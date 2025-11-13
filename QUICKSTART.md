# 🚀 Sales Microservice - Quick Start Guide

## ✅ What's Been Configured

Your sales microservice is now fully configured with:
- ✅ RabbitMQ integration via Docker Compose
- ✅ Sale creation and update processing
- ✅ Comprehensive logging
- ✅ Full test suite (11 tests passing)
- ✅ Test client with mock data
- ✅ Documentation and helper scripts

## 📋 Step-by-Step Testing Instructions

### Step 1: Start RabbitMQ

```bash
npm run rabbitmq:start
```

Or with make:
```bash
make rabbitmq
```

**Expected output:**
```
✔ Container sales-rabbitmq  Started
```

**Verify it's running:**
- Open http://localhost:15672 in your browser
- Login with username: `guest`, password: `guest`
- You should see the RabbitMQ Management UI

### Step 2: Start the Microservice

Open a **new terminal window** and run:

```bash
npm run start:dev
```

Or with make:
```bash
make start
```

**Expected output:**
```
[Nest] LOG [Bootstrap] 🚀 Sales Microservice is listening on RabbitMQ queue: sales_queue
```

**Keep this terminal open** - it will show all the processing logs.

### Step 3: Run the Test Client

Open **another terminal window** and run:

```bash
npm run test:client
```

Or with make:
```bash
make client
```

**What happens:**
1. The client connects to RabbitMQ
2. Sends 3 sale creation messages
3. Sends 3 sale update messages
4. Displays responses

**Expected Client Output:**
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
```

**Expected Microservice Output (in the other terminal):**
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

## 🧪 Alternative Testing Methods

### Method 1: Using Make Commands

```bash
# Terminal 1
make rabbitmq    # Start RabbitMQ

# Terminal 2
make start       # Start microservice

# Terminal 3
make client      # Run test client
```

### Method 2: Manual Testing via RabbitMQ UI

1. Open http://localhost:15672
2. Go to **Queues** tab
3. Click on `sales_queue`
4. Scroll to **Publish message**
5. Set **Routing key**: (leave empty)
6. Set **Payload**:

**For creating a sale:**
```json
{
  "pattern": "sale.create",
  "data": {
    "productId": "PROD-123",
    "productName": "Test Product",
    "quantity": 5,
    "price": 49.99,
    "customerId": "CUST-456",
    "customerName": "Test Customer",
    "timestamp": "2025-11-13T10:00:00Z"
  }
}
```

**For updating a sale:**
```json
{
  "pattern": "sale.update",
  "data": {
    "id": 1,
    "quantity": 10,
    "price": 39.99
  }
}
```

7. Click **Publish message**
8. Watch the microservice terminal for logs

### Method 3: Using cURL (Advanced)

You can also publish directly to RabbitMQ's HTTP API:

```bash
curl -i -u guest:guest -H "Content-Type: application/json" \
  -X POST http://localhost:15672/api/exchanges/%2F/amq.default/publish \
  -d '{
    "properties": {},
    "routing_key": "sales_queue",
    "payload": "{\"pattern\":\"sale.create\",\"data\":{\"productId\":\"PROD-001\",\"productName\":\"Laptop\",\"quantity\":1,\"price\":999.99,\"customerId\":\"CUST-001\",\"customerName\":\"John Doe\"}}",
    "payload_encoding": "string"
  }'
```

## 📊 Monitoring

### View RabbitMQ Logs
```bash
npm run rabbitmq:logs
# or
make logs
```

### Check Queue Status
1. Go to http://localhost:15672
2. Click **Queues** tab
3. View `sales_queue` statistics:
   - Ready: Messages waiting to be consumed
   - Unacked: Messages being processed
   - Total: Total message count

### View Message Rate
The Management UI shows:
- Publish rate
- Consumer rate
- Acknowledgment rate

## 🧹 Cleanup

### Stop Everything

```bash
# Stop microservice: Press Ctrl+C in the microservice terminal

# Stop RabbitMQ
npm run rabbitmq:stop
# or
make stop
```

### Remove All Data

```bash
# Remove containers and volumes (clears all messages)
docker compose down -v
# or
make clean
```

## 🔧 Troubleshooting

### Issue: "Connection refused" error

**Solution:**
1. Check if RabbitMQ is running:
   ```bash
   docker compose ps
   ```
2. Wait a few seconds for RabbitMQ to initialize
3. Check RabbitMQ logs:
   ```bash
   npm run rabbitmq:logs
   ```

### Issue: Port 5672 already in use

**Solution:**
1. Check what's using the port:
   ```bash
   lsof -i :5672
   ```
2. Stop the conflicting service or modify `docker-compose.yml` to use different ports

### Issue: Messages not being consumed

**Solution:**
1. Verify the microservice is running (check terminal)
2. Check the queue has messages (RabbitMQ UI)
3. Verify queue name matches: `sales_queue`
4. Check for errors in microservice logs

### Issue: Test client hangs

**Solution:**
1. Make sure microservice is running first
2. Check RabbitMQ is accessible at localhost:5672
3. Try manually publishing a message via UI to test

## 📝 Running Unit Tests

```bash
npm test
# or
make test
```

**All 11 tests should pass:**
- ✓ Controller and Service are defined
- ✓ Sale creation logging
- ✓ Sale update logging
- ✓ Message acknowledgment
- ✓ Error handling

## 🎯 What Each Component Does

### docker-compose.yml
- Defines RabbitMQ container
- Maps ports for AMQP (5672) and Management UI (15672)
- Sets up persistent storage

### src/main.ts
- Configures NestJS to use RabbitMQ transport
- Connects to queue: `sales_queue`
- Sets up durable queue with manual acknowledgment

### src/sale-processor/sale-processor.controller.ts
- Listens for `sale.create` and `sale.update` messages
- Acknowledges successful processing
- Rejects failed messages (NACK)

### src/sale-processor/sale-processor.service.ts
- Processes sales and logs details
- Calculates totals
- Returns structured responses

### test-client.ts
- Sends test messages to RabbitMQ
- Simulates a producer application
- Includes mock sales data

## 📚 Next Steps

1. **Add Database**: Store sales in PostgreSQL or MongoDB
2. **Add Validation**: Use `class-validator` for DTO validation
3. **Add Authentication**: Secure RabbitMQ with proper credentials
4. **Dead Letter Queue**: Handle failed messages
5. **Monitoring**: Add Prometheus/Grafana
6. **Multiple Queues**: Separate queues by priority
7. **API Gateway**: Add REST API to trigger messages

## 🆘 Need Help?

- Check `TESTING.md` for detailed instructions
- Check `SUMMARY.md` for architecture overview
- View RabbitMQ documentation: https://www.rabbitmq.com/documentation.html
- View NestJS microservices docs: https://docs.nestjs.com/microservices/basics

## 📞 Quick Commands Reference

| Task | Command |
|------|---------|
| Start RabbitMQ | `npm run rabbitmq:start` or `make rabbitmq` |
| Start Microservice | `npm run start:dev` or `make start` |
| Run Test Client | `npm run test:client` or `make client` |
| Run Tests | `npm test` or `make test` |
| View Logs | `npm run rabbitmq:logs` or `make logs` |
| Stop RabbitMQ | `npm run rabbitmq:stop` or `make stop` |
| Clean Everything | `make clean` |
| Management UI | http://localhost:15672 (guest/guest) |

---

**🎉 You're all set! Follow the steps above to test your microservice.**
