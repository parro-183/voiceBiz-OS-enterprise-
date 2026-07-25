.PHONY: help install dev build test lint format clean db-setup

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Display this help message
	@echo "$(BLUE)voiceBiz-OS-enterprise Development Commands$(NC)"
	@echo "$(YELLOW)Usage: make [command]$(NC)\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install

dev: ## Start development server with hot reload
	@echo "$(BLUE)Starting development server...$(NC)"
	npm run dev

build: ## Build for production
	@echo "$(BLUE)Building for production...$(NC)"
	npm run build

start: build ## Build and start production server
	@echo "$(BLUE)Starting production server...$(NC)"
	npm start

test: ## Run test suite
	@echo "$(BLUE)Running tests...$(NC)"
	npm test

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(NC)"
	npm run test:watch

test-coverage: ## Generate test coverage report
	@echo "$(BLUE)Generating coverage report...$(NC)"
	npm run test:coverage

lint: ## Run ESLint
	@echo "$(BLUE)Linting code...$(NC)"
	npm run lint

lint-fix: ## Fix linting issues automatically
	@echo "$(BLUE)Fixing linting issues...$(NC)"
	npm run lint:fix

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(NC)"
	npm run format

format-check: ## Check code formatting
	@echo "$(BLUE)Checking code formatting...$(NC)"
	npm run format:check

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Type checking...$(NC)"
	npm run type-check

db-setup: ## Set up database (migrate + seed)
	@echo "$(BLUE)Setting up database...$(NC)"
	npm run db:migrate
	npm run db:seed

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	npm run db:migrate

db-migrate-dev: ## Run migrations in development mode
	@echo "$(BLUE)Running migrations in development mode...$(NC)"
	npm run db:migrate:dev

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	npm run db:seed

db-studio: ## Open Prisma Studio
	@echo "$(BLUE)Opening Prisma Studio...$(NC)"
	npm run db:studio

clean: ## Clean build artifacts and cache
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/
	rm -rf .jest/

pre-commit: lint type-check test ## Run pre-commit checks (lint + type-check + test)
	@echo "$(GREEN)All pre-commit checks passed!$(NC)"

setup: install db-setup ## Complete setup (install + database setup)
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development.$(NC)"

ci: lint type-check test build ## Run CI checks
	@echo "$(GREEN)CI checks passed!$(NC)"

docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t voicebiz-os:latest .

docker-run: ## Run Docker container
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -p 3000:3000 --env-file .env voicebiz-os:latest

.DEFAULT_GOAL := help
