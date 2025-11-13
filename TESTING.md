# Sales Microservice - Testing Guide

This guide provides instructions for testing the Sales Microservice with RabbitMQ.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- Project dependencies installed (`npm install`)

## Setup

### 1. Start RabbitMQ

Start the RabbitMQ container using Docker Compose:

```bash
docker-compose up -d
```

This will start RabbitMQ with the management UI accessible at:
- **RabbitMQ Management UI**: http://localhost:15672
- **Username**: guest
- **Password**: guest

### 2. Verify RabbitMQ is Running

```bash
docker-compose ps
```

You should see the `sales-rabbitmq` container running.

### 3. Access RabbitMQ Management UI

Open http://localhost:15672 in your browser and login with:
- Username: `guest`
- Password: `guest`

You can monitor queues, exchanges, and messages here.

## Running the Microservice

### Start the Sales Processor Service

In one terminal window:

```bash
npm run start:dev
```

You should see:
```
🚀 Sales Microservice is listening on RabbitMQ queue: sales_queue
```

The service will:
- Connect to RabbitMQ
- Listen to the `sales_queue` queue
- Process messages with patterns `sale.create` and `sale.update`

## Testing with the Test Client

### Run the Test Client

In another terminal window (while the microservice is running):

```bash
npx ts-node test-client.ts
```

The test client will:
1. Connect to RabbitMQ
2. Send 3 mock sale creation messages
3. Send 3 mock sale update messages
4. Display responses from the microservice

### Expected Output

**Test Client Output:**
```
🚀 Starting Test Client for Sales Microservice
✅ Connected to RabbitMQ

🧪 Testing Sale Creation...
📤 Sending create request for: MacBook Pro 16"
✅ Response: {
  "success": true,
  "message": "Sale created and processed",
  "data": { ... }
}
...
```

**Microservice Output:**
```
📨 Received 'sale.create' message
=== Processing Sale Creation ===
Product: MacBook Pro 16" (ID: PROD-001)
Quantity: 1
Price: $2499.99
Total: $2499.99
Customer: Alice Johnson (ID: CUST-001)
Timestamp: 2025-11-13T...
✅ Sale created successfully
```

## Manual Testing with RabbitMQ Management UI

You can also send messages manually through the RabbitMQ Management UI:

### 1. Navigate to Queues

1. Go to http://localhost:15672/#/queues
2. Click on `sales_queue`
3. Scroll down to "Publish message"

### 2. Create Sale Message

**Routing key**: `sale.create`

**Payload**:
```json
{
  "pattern": "sale.create",
  "data": {
    "productId": "PROD-999",
    "productName": "Test Product",
    "quantity": 1,
    "price": 99.99,
    "customerId": "CUST-999",
    "customerName": "Test Customer",
    "timestamp": "2025-11-13T10:00:00Z"
  }
}
```

### 3. Update Sale Message

**Routing key**: `sale.update`

**Payload**:
```json
{
  "pattern": "sale.update",
  "data": {
    "id": 1,
    "quantity": 5,
    "price": 79.99
  }
}
```

## Running Unit Tests

Run the Jest test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:cov
```

## Expected Test Results

All tests should pass:
- ✓ Service should be defined
- ✓ Service should process sale creation
- ✓ Service should process sale updates
- ✓ Controller should acknowledge messages
- ✓ Controller should handle errors

## Troubleshooting

### RabbitMQ Connection Issues

If you see connection errors:

1. Check if RabbitMQ is running:
   ```bash
   docker-compose ps
   ```

2. Check RabbitMQ logs:
   ```bash
   docker-compose logs rabbitmq
   ```

3. Restart RabbitMQ:
   ```bash
   docker-compose restart rabbitmq
   ```

### Port Already in Use

If port 5672 or 15672 is already in use:

1. Stop the conflicting service
2. Or modify `docker-compose.yml` to use different ports

### Messages Not Being Processed

1. Check if the microservice is running
2. Verify the queue name matches in both client and service
3. Check the RabbitMQ Management UI for pending messages
4. Review microservice logs for errors

## Cleanup

### Stop the microservice

Press `Ctrl+C` in the terminal running the microservice.

### Stop RabbitMQ

```bash
docker-compose down
```

To also remove volumes (clears all data):

```bash
docker-compose down -v
```

## Architecture Overview

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Test Client   │────────▶│   RabbitMQ   │────────▶│  Microservice   │
│  (Producer)     │         │   Queue      │         │  (Consumer)     │
└─────────────────┘         └──────────────┘         └─────────────────┘
                                   │                           │
                                   │                           ▼
                                   │                  ┌─────────────────┐
                                   │                  │ Sale Processor  │
                                   │                  │    Service      │
                                   │                  └─────────────────┘
                                   │                           │
                                   │                           ▼
                                   │                    (Logs operations)
                                   ▼
                           Management UI
                         (localhost:15672)
```

## Message Patterns

- **sale.create**: Creates a new sale record
- **sale.update**: Updates an existing sale record

## Next Steps

- Add database persistence (PostgreSQL, MongoDB, etc.)
- Implement dead letter queues for failed messages
- Add message validation
- Implement retry logic
- Add metrics and monitoring
- Deploy to production environment
