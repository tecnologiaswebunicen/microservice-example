# Deploying to Render

## RabbitMQ Connection Configuration

### Important: Internal vs External Hostnames

Render services can connect to each other using **internal hostnames** which are faster and don't count toward bandwidth limits.

#### When deploying your microservice on Render:

Use the **internal hostname** (without `.onrender.com`):
```
RABBITMQ_URL=amqp://rabbitmq:f31027fe2f5c1fd3dc2de43740709bc2@rabbitmq-kzo0:5672
```

#### When connecting from your local machine:

Use the **public hostname** (with `.onrender.com`):
```
RABBITMQ_URL=amqp://rabbitmq:f31027fe2f5c1fd3dc2de43740709bc2@rabbitmq-kzo0.onrender.com:5672
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `sales-microservice` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`

3. **Add Environment Variables**
   - Click "Environment" in the left sidebar
   - Add the following variables:
     - `RABBITMQ_URL`: `amqp://rabbitmq:YOUR_PASSWORD@rabbitmq-kzo0:5672`
     - `PORT`: (leave empty, Render sets this automatically)

4. **Configure Health Check**
   - Path: `/health`
   - This ensures Render knows when your service is ready

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete

## Testing Your Deployment

Once deployed, you can test your service:

1. **Health Check**
   ```bash
   curl https://your-service.onrender.com/health
   ```

2. **Test Endpoint**
   ```bash
   curl https://your-service.onrender.com/test
   ```

## Troubleshooting

### Connection Errors

If you see `AggregateError` or connection timeouts:

1. **Check the hostname format**
   - On Render: use internal hostname (`rabbitmq-kzo0`)
   - Locally: use public hostname (`rabbitmq-kzo0.onrender.com`)

2. **Verify RabbitMQ credentials**
   - Username should match `RABBITMQ_DEFAULT_USER`
   - Password should match `RABBITMQ_DEFAULT_PASS`

3. **Check RabbitMQ service is running**
   - Visit the management UI: `https://rabbitmq-kzo0.onrender.com`
   - Login with your credentials

4. **Verify both services are in the same region**
   - Render's internal networking only works within the same region

### Logs

View your service logs in the Render Dashboard to see detailed error messages.

## Architecture on Render

```
┌─────────────────────┐
│   Your Service      │
│  (Web Service)      │
│  Port: 10000        │
│  /health            │
│  /test              │
└──────────┬──────────┘
           │
           │ Internal Network
           │ amqp://rabbitmq-kzo0:5672
           │
┌──────────▼──────────┐
│    RabbitMQ         │
│  (Web Service)      │
│  Port: 5672 (AMQP)  │
│  Port: 15672 (HTTP) │
└─────────────────────┘
```

## Cost Optimization

- Both services on Render's free tier will spin down after 15 minutes of inactivity
- They will automatically spin up when receiving requests (cold start ~1-2 minutes)
- Consider upgrading to a paid plan for 24/7 availability
