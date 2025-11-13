import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const logger = new Logger('TestClient');

// Mock sales data
const mockSales = [
  {
    productId: 'PROD-001',
    productName: 'MacBook Pro 16"',
    quantity: 1,
    price: 2499.99,
    customerId: 'CUST-001',
    customerName: 'Alice Johnson',
    timestamp: new Date(),
  },
  {
    productId: 'PROD-002',
    productName: 'iPhone 15 Pro',
    quantity: 2,
    price: 999.99,
    customerId: 'CUST-002',
    customerName: 'Bob Smith',
    timestamp: new Date(),
  },
  {
    productId: 'PROD-003',
    productName: 'AirPods Pro',
    quantity: 3,
    price: 249.99,
    customerId: 'CUST-003',
    customerName: 'Charlie Brown',
    timestamp: new Date(),
  },
];

async function testSaleCreation(client: ClientProxy) {
  logger.log('\n🧪 Testing Sale Creation...\n');

  for (let i = 0; i < mockSales.length; i++) {
    const sale = mockSales[i];
    logger.log(`📤 Sending create request for: ${sale.productName}`);
    
    try {
      const result = await client.send('sale.create', sale).toPromise();
      logger.log(`✅ Response: ${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      logger.error(`❌ Error: ${error.message}\n`);
    }

    // Wait a bit between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function testSaleUpdate(client: ClientProxy) {
  logger.log('\n🧪 Testing Sale Updates...\n');

  const updates = [
    {
      id: 1,
      quantity: 2,
      price: 2299.99,
      productName: 'MacBook Pro 16" (Refurbished)',
    },
    {
      id: 2,
      quantity: 5,
    },
    {
      id: 3,
      customerName: 'Charlie Brown Jr.',
      price: 199.99,
    },
  ];

  for (const update of updates) {
    logger.log(`📤 Sending update request for Sale ID: ${update.id}`);
    
    try {
      const result = await client.send('sale.update', update).toPromise();
      logger.log(`✅ Response: ${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      logger.error(`❌ Error: ${error.message}\n`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function main() {
  logger.log('🚀 Starting Test Client for Sales Microservice\n');

  // Create RabbitMQ client
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'sales_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  try {
    // Connect to RabbitMQ
    await client.connect();
    logger.log('✅ Connected to RabbitMQ\n');

    // Test sale creation
    await testSaleCreation(client);

    // Test sale updates
    await testSaleUpdate(client);

    logger.log('\n🎉 All tests completed!\n');
  } catch (error) {
    logger.error(`❌ Fatal error: ${error.message}`);
  } finally {
    await client.close();
    logger.log('👋 Client disconnected');
    process.exit(0);
  }
}

main();
