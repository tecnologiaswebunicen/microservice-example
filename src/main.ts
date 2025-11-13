import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;
  
  // Create hybrid application (HTTP + Microservice)
  const app = await NestFactory.create(AppModule);
  
  // Connect RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'sales_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });
  
  // Start all microservices
  await app.startAllMicroservices();
  logger.log('🚀 Sales Microservice is listening on RabbitMQ queue: sales_queue');
  
  // Start HTTP server
  await app.listen(port);
  logger.log(`🌐 HTTP Server is running on http://localhost:${port}`);
}
bootstrap();
