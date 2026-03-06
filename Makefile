.PHONY: help dev dev-all build test clean setup migrate seed infra-up infra-down type-check

help:
	@echo "AmakaSole Development Commands"
	@echo ""
	@echo "  make setup       - Full initial setup (install + infra + migrate + seed)"
	@echo "  make dev         - Start API dev server"
	@echo "  make dev-all     - Start all services (API + ML + Dashboard)"
	@echo "  make build       - Build all packages"
	@echo "  make test        - Run all tests"
	@echo "  make type-check  - Run TypeScript type checking"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Seed database with test data"
	@echo "  make infra-up    - Start local Postgres + Redis"
	@echo "  make infra-down  - Stop local infrastructure"
	@echo "  make clean       - Clean all build artifacts and dependencies"
	@echo ""

setup:
	@chmod +x scripts/setup.sh && ./scripts/setup.sh

dev:
	@echo "Starting API on http://localhost:3000..."
	cd packages/api && npm run dev

dev-all:
	@echo "Starting all services..."
	@make infra-up
	@(cd packages/api && npm run dev) & \
	(cd packages/ml-service && uvicorn app.main:app --reload --port 8000) & \
	(cd apps/web-dashboard && npm run dev) & \
	wait

build:
	npm run build --workspaces --if-present

test:
	npm run test --workspaces --if-present

type-check:
	npm run type-check --workspace=@amakasole/shared
	npm run type-check --workspace=@amakasole/db
	npm run type-check --workspace=@amakasole/api

migrate:
	cd packages/db && npm run push

seed:
	cd packages/db && npm run seed

infra-up:
	docker compose -f infra/docker-compose.yml up -d postgres redis

infra-down:
	docker compose -f infra/docker-compose.yml down

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".expo" -type d -prune -exec rm -rf {} +
	find . -name ".next" -type d -prune -exec rm -rf {} +
	find . -name "__pycache__" -type d -prune -exec rm -rf {} +
	@echo "Clean complete!"
