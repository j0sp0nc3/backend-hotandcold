#!/bin/bash

# Script para construir y ejecutar el contenedor Docker
# Con soporte para variables de entorno (Firebase + Email)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Docker Build Script - Hot and Cold Backend${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}📝 Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your credentials:${NC}"
    echo "   - FIREBASE_PROJECT_ID"
    echo "   - FIREBASE_PRIVATE_KEY"
    echo "   - EMAIL_USER (Gmail)"
    echo "   - EMAIL_PASS (App password from https://myaccount.google.com/apppasswords)"
    echo ""
    echo "Run this script again after updating .env"
    exit 1
fi

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Build image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t hotandcold-backend:latest .

echo -e "${GREEN}✅ Image built successfully${NC}"
echo ""

# Run container
echo -e "${YELLOW}🚀 Starting container...${NC}"
docker run -d \
    -p 3000:3000 \
    --name hotandcold-backend \
    --env-file .env \
    --restart unless-stopped \
    hotandcold-backend:latest

echo -e "${GREEN}✅ Container started${NC}"
echo ""
echo "📊 Container status:"
docker ps --filter "name=hotandcold-backend"
echo ""
echo "🔍 View logs:"
echo "   docker logs -f hotandcold-backend"
echo ""
echo "🛑 Stop container:"
echo "   docker stop hotandcold-backend"
echo ""
echo "🗑️  Remove container:"
echo "   docker rm hotandcold-backend"
