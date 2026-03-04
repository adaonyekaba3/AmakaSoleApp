.PHONY: help dev build test clean setup migrate seed

help:
	@echo "AmakaSole Development Commands"
	@echo ""
	@echo "  make setup       - Full initial setup (install + migrate + seed)"
	@echo "  make dev         - Start all development servers"
	@echo "  make build       - Build all packages"
	@echo "  make test        - Run all tests"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Seed database with test data"
	@echo "  make clean       - Clean all build artifacts and dependencies"
	@echo ""

setup:
	@echo "🚀 Setting up AmakaSole..."
	npm install
	@echo "📊 Setting up database package..."
	cd packages/db && npm install && npm run build
	@echo "📦 Setting up shared package..."
	cd packages/shared && npm install && npm run build
	@echo "🔧 Setting up API..."
	cd packages/api && npm install
	@echo "✅ Setup complete! Run 'make migrate' next."

dev:
	@echo "🚀 Starting development servers..."
	@echo "API will run on http://localhost:3000"
	cd packages/api && npm run dev

build:
	@echo "🏗️  Building all packages..."
	npm run build --workspaces

test:
	@echo "🧪 Running tests..."
	npm run test --workspaces --if-present

migrate:
	@echo "🗄️  Running database migrations..."
	cd packages/db && npm run migrate

seed:
	@echo "🌱 Seeding database..."
	cd packages/db && npm run seed

clean:
	@echo "🧹 Cleaning project..."
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".expo" -type d -prune -exec rm -rf {} +
	@echo "✅ Clean complete!"
