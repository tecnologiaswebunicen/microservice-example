# Architecture Diagram

## Message Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Sales Processing Flow                        │
└─────────────────────────────────────────────────────────────────┘

   Producer                Queue               Consumer
┌────────────┐         ┌──────────┐         ┌─────────────┐
│            │         │          │         │             │
│   Test     │ Publish │ RabbitMQ │ Consume │  NestJS     │
│   Client   ├────────►│  Queue   ├────────►│ Microservice│
│            │         │          │         │             │
└────────────┘         └──────────┘         └──────┬──────┘
                                                    │
                                                    │
                       ┌────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Message Patterns    │
            ├──────────────────────┤
            │  • sale.create       │
            │  • sale.update       │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   Controller Layer   │
            │  (Message Handlers)  │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │    Service Layer     │
            │  (Business Logic)    │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   Console Logging    │
            │  (Operation Details) │
            └──────────────────────┘
```

## Component Details

```
┌──────────────────────────────────────────────────────────────┐
│                    RabbitMQ Container                         │
├──────────────────────────────────────────────────────────────┤
│  Image: rabbitmq:3.13-management-alpine                      │
│  Ports:                                                      │
│    - 5672  (AMQP Protocol)                                  │
│    - 15672 (Management UI)                                  │
│  Queue: sales_queue (durable)                               │
│  Volume: rabbitmq_data (persistent)                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────────┐                    ┌──────────────────┐
│   Test Client     │                    │  Microservice    │
│   (Producer)      │                    │   (Consumer)     │
├───────────────────┤                    ├──────────────────┤
│ • Connect to MQ   │                    │ • Connect to MQ  │
│ • Create msgs     │                    │ • Listen queue   │
│ • Update msgs     │                    │ • Process msgs   │
│ • Display results │                    │ • ACK/NACK       │
└───────────────────┘                    └──────────────────┘
```

## Message Structure

### Sale Creation Message

```json
{
  "pattern": "sale.create",
  "data": {
    "productId": "PROD-001",
    "productName": "MacBook Pro 16\"",
    "quantity": 1,
    "price": 2499.99,
    "customerId": "CUST-001",
    "customerName": "Alice Johnson",
    "timestamp": "2025-11-13T10:00:00Z"
  }
}
```

**Processing Flow:**
```
1. Controller receives message
2. Extract payload
3. Call service.create()
4. Log product details
5. Log customer details
6. Calculate & log total
7. Return success response
8. ACK message
```

### Sale Update Message

```json
{
  "pattern": "sale.update",
  "data": {
    "id": 1,
    "quantity": 5,
    "price": 899.99
  }
}
```

**Processing Flow:**
```
1. Controller receives message
2. Extract payload
3. Call service.update()
4. Log sale ID
5. Log changed fields only
6. Return success response
7. ACK message
```

## Error Handling Flow

```
Message Received
      │
      ▼
   Try Process
      │
      ├─ Success ───► Log Success ───► ACK ───► Done
      │
      └─ Error ─────► Log Error ─────► NACK ──► Rejected
                                              (not requeued)
```

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Development Setup                        │
└────────────────────────────────────────────────────────────┘

  Docker Host (localhost)
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  ┌──────────────────────────────────────────────┐  │
  │  │        RabbitMQ Container                    │  │
  │  │  ┌────────────────────────────────────┐     │  │
  │  │  │  Queue: sales_queue                │     │  │
  │  │  │  Type: Durable                     │     │  │
  │  │  │  Mode: Manual ACK                  │     │  │
  │  │  │  Prefetch: 1                       │     │  │
  │  │  └────────────────────────────────────┘     │  │
  │  │                                              │  │
  │  │  Ports: :5672, :15672                       │  │
  │  └──────────────────────────────────────────────┘  │
  │                                                      │
  └──────────────────────────────────────────────────────┘
                          │
                          │ AMQP Protocol
                          │
       ┌──────────────────┴───────────────────┐
       │                                      │
       ▼                                      ▼
┌──────────────┐                     ┌───────────────┐
│ Terminal 1   │                     │  Terminal 2   │
│              │                     │               │
│ Test Client  │                     │ Microservice  │
│ (ts-node)    │                     │ (NestJS)      │
│              │                     │               │
│ Port: -      │                     │ Port: -       │
└──────────────┘                     └───────────────┘

Terminal 3: Docker Compose (manages RabbitMQ)
```

## Data Flow Sequence

```
Test Client                RabbitMQ              Microservice
     │                         │                      │
     │  1. Connect              │                      │
     ├─────────────────────────►│                      │
     │                         │                      │
     │  2. Publish Message      │                      │
     ├─────────────────────────►│                      │
     │                         │  3. Forward Message   │
     │                         ├─────────────────────►│
     │                         │                      │
     │                         │  4. Process & Log    │
     │                         │                      ├──┐
     │                         │                      │  │
     │                         │                      │◄─┘
     │                         │  5. ACK Message      │
     │                         │◄─────────────────────┤
     │                         │                      │
     │  6. Response (RPC)      │                      │
     │◄────────────────────────┴──────────────────────┤
     │                         │                      │
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                   Technology Stack                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Backend Framework:  NestJS 10.x                        │
│  Language:          TypeScript 5.x                      │
│  Message Broker:    RabbitMQ 3.13                       │
│  Client Library:    amqplib + amqp-connection-manager   │
│  Testing:           Jest 29.x                           │
│  Container:         Docker + Docker Compose             │
│  Runtime:           Node.js 20.x                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Monitoring & Management

```
┌──────────────────────────────────────────────────────────┐
│              RabbitMQ Management UI                       │
│              http://localhost:15672                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Dashboard:                                              │
│    • Connection count                                    │
│    • Channel count                                       │
│    • Queue count                                         │
│    • Message rates                                       │
│                                                          │
│  Queues Tab:                                             │
│    • sales_queue status                                  │
│    • Ready messages                                      │
│    • Unacked messages                                    │
│    • Total messages                                      │
│    • Publish/Consume rates                               │
│                                                          │
│  Exchanges Tab:                                          │
│    • Default exchange                                    │
│    • Message routing                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Testing Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Testing Workflow                      │
└─────────────────────────────────────────────────────────┘

Step 1: Start Infrastructure
  $ npm run rabbitmq:start
      │
      ▼
  RabbitMQ Container Running ✓

Step 2: Start Microservice
  $ npm run start:dev
      │
      ▼
  Microservice Listening ✓

Step 3: Run Tests
  $ npm run test:client
      │
      ▼
  Messages Sent & Processed ✓

Step 4: Verify Logs
  • Check Terminal 2 for processing logs
  • Check RabbitMQ UI for queue stats
  • Check Terminal 3 for responses
```
