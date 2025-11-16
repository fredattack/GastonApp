#!/bin/bash

# GastonApp Landing Page Deployment Script for Digital Ocean Droplet
# This script builds and deploys the landing page using Docker

set -e

echo "🚀 Starting GastonApp Landing Page deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📦 Building Docker image..."
docker-compose -f .deploy-landing/docker-compose.yml build

echo "🛑 Stopping existing containers..."
docker-compose -f .deploy-landing/docker-compose.yml down

echo "🚀 Starting new containers..."
docker-compose -f .deploy-landing/docker-compose.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check container health
if docker ps | grep -q gastonapp-landing; then
    echo "✅ Landing page is running!"
    echo "🌐 Access the landing page at: http://localhost:8080"
    echo "📊 View logs with: docker-compose -f .deploy-landing/docker-compose.yml logs -f"
else
    echo "❌ Landing page failed to start. Check logs:"
    docker-compose -f .deploy-landing/docker-compose.yml logs
    exit 1
fi

echo "✅ Deployment completed successfully!"
