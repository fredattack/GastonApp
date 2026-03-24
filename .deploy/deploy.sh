#!/bin/bash

# GastonApp Deployment Script for Digital Ocean
# This script builds and deploys the GastonApp web application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting GastonApp Deployment${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker compose -f .deploy/docker-compose.yml build

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f .deploy/docker-compose.yml down

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker compose -f .deploy/docker-compose.yml up -d

echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 5

# Check if the web service is running
if docker compose -f .deploy/docker-compose.yml ps | grep -qE "web.*(Up|running)"; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application is running at: http://localhost${NC}"
else
    echo -e "${RED}❌ Deployment failed. Container logs:${NC}"
    docker compose -f .deploy/docker-compose.yml logs --tail=50
    exit 1
fi

echo -e "${GREEN}📊 Container status:${NC}"
docker compose -f .deploy/docker-compose.yml ps

echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "  View logs:    docker compose -f .deploy/docker-compose.yml logs -f"
echo -e "  Stop app:     docker compose -f .deploy/docker-compose.yml down"
echo -e "  Restart app:  docker compose -f .deploy/docker-compose.yml restart"
