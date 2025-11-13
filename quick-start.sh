#!/bin/bash

# Quick Start Script for Sales Microservice

echo "🚀 Sales Microservice - Quick Start"
echo "===================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start RabbitMQ
echo "📦 Starting RabbitMQ..."
docker compose up -d
if [ $? -eq 0 ]; then
    echo "✅ RabbitMQ started successfully"
else
    echo "❌ Failed to start RabbitMQ"
    exit 1
fi

echo ""
echo "⏳ Waiting for RabbitMQ to be ready..."
sleep 5

# Check RabbitMQ health
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:15672 > /dev/null; then
        echo "✅ RabbitMQ is ready!"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ RabbitMQ failed to start within timeout"
        exit 1
    fi
    sleep 1
done

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start the microservice:     npm run start:dev"
echo "2. Run the test client:        npm run test:client"
echo "3. View RabbitMQ Management:   http://localhost:15672 (guest/guest)"
echo ""
echo "For detailed instructions, see TESTING.md"
echo ""
