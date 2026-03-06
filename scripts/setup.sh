#!/bin/bash
set -e

echo "=== AmakaSole Development Setup ==="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed."; exit 1; }

echo "1. Installing npm dependencies..."
npm install

echo ""
echo "2. Starting local services (Postgres + Redis)..."
docker compose -f infra/docker-compose.yml up -d postgres redis

echo ""
echo "3. Waiting for services to be ready..."
sleep 5

echo ""
echo "4. Setting up environment files..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   Created .env from .env.example"
fi
if [ ! -f packages/api/.env ]; then
  cp packages/api/.env.example packages/api/.env
  echo "   Created packages/api/.env"
fi
if [ ! -f packages/db/.env ]; then
  cp packages/db/.env.example packages/db/.env
  echo "   Created packages/db/.env"
fi

echo ""
echo "5. Building shared packages..."
npm run build --workspace=@amakasole/shared
npm run build --workspace=@amakasole/db

echo ""
echo "6. Running database migrations..."
npm run push --workspace=@amakasole/db

echo ""
echo "7. Seeding database..."
npm run seed --workspace=@amakasole/db

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Start the API:          npm run dev --workspace=@amakasole/api"
echo "Start the ML service:   cd packages/ml-service && uvicorn app.main:app --reload"
echo "Start the mobile app:   cd apps/mobile && npx expo start"
echo "Start the dashboard:    cd apps/web-dashboard && npm run dev"
echo ""
