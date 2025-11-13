.PHONY: help install start stop test client logs clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

rabbitmq: ## Start RabbitMQ
	docker compose up -d
	@echo "Waiting for RabbitMQ to be ready..."
	@sleep 5
	@echo "✅ RabbitMQ is running at http://localhost:15672 (guest/guest)"

stop: ## Stop RabbitMQ
	docker compose down

start: ## Start the microservice in dev mode
	npm run start:dev

test: ## Run unit tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

client: ## Run the test client
	npm run test:client

logs: ## Show RabbitMQ logs
	docker compose logs -f rabbitmq

clean: ## Stop and remove all containers and volumes
	docker compose down -v

quickstart: ## Quick start: RabbitMQ + Microservice
	./quick-start.sh
