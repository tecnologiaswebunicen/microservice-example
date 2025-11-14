import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  
  logger.log(`Attempting to connect to RabbitMQ at: ${rabbitmqUrl.replace(/:[^:@]+@/, ':****@')}`);
  
  // Create hybrid application (HTTP + Microservice)
  const app = await NestFactory.create(AppModule);
  
  // Connect RabbitMQ microservice with better options
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'sales_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
      socketOptions: {
        heartbeatIntervalInSeconds: 30,
        reconnectTimeInSeconds: 5,
      },
    },
  });
  
  // Start HTTP server first (so health checks work even if RabbitMQ is down)
  await app.listen(port);
  logger.log(`🌐 HTTP Server is running on http://localhost:${port}`);
  
  // Try to start microservices (non-blocking)
  try {
    await app.startAllMicroservices();
    logger.log('🚀 Sales Microservice is listening on RabbitMQ queue: sales_queue');
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ initially. Will keep retrying...', error.message);
  }
}
bootstrap();
