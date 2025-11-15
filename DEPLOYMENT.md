# GastonApp Deployment Guide

This document provides comprehensive instructions for deploying GastonApp to Digital Ocean and other platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Monorepo Structure](#monorepo-structure)
- [Local Development](#local-development)
- [Building for Production](#building-for-production)
- [Docker Deployment](#docker-deployment)
- [Digital Ocean Deployment](#digital-ocean-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Digital Ocean Droplet Requirements

**⚠️ IMPORTANT: Use Ubuntu LTS versions only!**

For production deployment, create a droplet with:
- **OS**: Ubuntu 24.04 LTS (Noble) - **RECOMMENDED**
- **Alternative**: Ubuntu 22.04 LTS (Jammy)
- **Memory**: Minimum 512MB RAM (1GB+ recommended)
- **Storage**: Minimum 10GB

**❌ DO NOT USE:**
- Ubuntu 24.10 (Oracular) - End-of-life, repositories unavailable
- Ubuntu 23.x - Non-LTS versions
- Other non-LTS versions

**Why LTS (Long Term Support)?**
- Supported for 5 years with security updates
- Stable and production-ready
- Package repositories remain available
- Docker officially supports LTS versions

### Required Software (Local Development)
- **Node.js**: 22.3.0 or later
- **pnpm**: 9.0.0 or later (will be installed via corepack)
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: For version control

### Installation

```bash
# Enable corepack for pnpm
corepack enable

# Install pnpm
corepack prepare pnpm@latest --activate

# Verify installations
node --version  # Should be >= 22.3.0
pnpm --version  # Should be >= 9.0.0
docker --version
docker-compose --version
```

---

## Monorepo Structure

GastonApp uses a Turborepo-based monorepo structure:

```
GastonApp/
├── apps/
│   ├── web/                    # React + Vite web application
│   └── mobile/                 # React Native Expo mobile app (future)
├── packages/
│   ├── shared/                 # Shared code (types, services, utils)
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
├── .deploy/                    # Deployment configuration
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── deploy.sh
├── turbo.json                  # Turborepo configuration
└── pnpm-workspace.yaml         # pnpm workspaces configuration
```

---

## Local Development

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/fredattack/GastonApp.git
cd GastonApp

# Install all dependencies
pnpm install

# Run the web app in development mode
pnpm dev:web

# Or run all apps
pnpm dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in development mode |
| `pnpm dev:web` | Run web app only |
| `pnpm dev:mobile` | Run mobile app only |
| `pnpm build` | Build all apps for production |
| `pnpm build:web` | Build web app only |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | Type check all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Clean all build artifacts |

### Working with Specific Packages

```bash
# Run commands in a specific package
pnpm --filter @gastonapp/web dev
pnpm --filter @gastonapp/shared build
pnpm --filter @gastonapp/ui lint
```

---

## Building for Production

### Build Web Application

```bash
# Build the web app
pnpm build:web

# The built files will be in apps/web/dist/
```

### Build All Packages

```bash
# Build everything
pnpm build

# This will:
# 1. Build packages/shared
# 2. Build packages/ui
# 3. Build apps/web
```

---

## Docker Deployment

### Quick Deployment

Use the provided deployment script:

```bash
# Make the script executable (already done)
chmod +x .deploy/deploy.sh

# Run the deployment
pnpm deploy

# Or directly
./.deploy/deploy.sh
```

### Manual Docker Commands

```bash
# Build the Docker image
pnpm docker:build

# Start containers
pnpm docker:up

# Stop containers
pnpm docker:down

# View logs
pnpm docker:logs
```

### Docker Configuration

The deployment uses a **multi-stage Dockerfile**:
1. **Build stage**: Installs dependencies and builds the app
2. **Production stage**: Serves the app with Nginx

**Key features:**
- Optimized image size (Alpine Linux)
- Gzip compression enabled
- Security headers configured
- Health checks included
- Static asset caching

---

## Digital Ocean Deployment

### Option 1: App Platform (Recommended)

Digital Ocean App Platform is the easiest way to deploy:

1. **Connect Repository**
   - Go to Digital Ocean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   name: gastonapp-web
   region: nyc
   services:
     - name: web
       github:
         repo: fredattack/GastonApp
         branch: main
       build_command: |
         corepack enable
         corepack prepare pnpm@latest --activate
         pnpm install --frozen-lockfile
         pnpm build:web
       run_command: echo "Static site"
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       routes:
         - path: /
       static_sites:
         - name: web
           build_command: pnpm build:web
           output_dir: apps/web/dist
   ```

3. **Set Environment Variables**
   - Add all required environment variables (see below)

4. **Deploy**
   - Click "Create Resources"
   - Wait for the build to complete

### Option 2: Droplet (More Control)

For more control, use a Droplet:

1. **Create Droplet**
   ```bash
   # Choose: Ubuntu 22.04 LTS
   # Minimum: 2 GB RAM, 1 vCPU, 50 GB SSD
   ```

2. **SSH into Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Dependencies**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   apt-get install docker-compose-plugin

   # Install Git
   apt-get install git
   ```

4. **Clone and Deploy**
   ```bash
   # Clone repository
   git clone https://github.com/fredattack/GastonApp.git
   cd GastonApp

   # Set environment variables
   # Copy and edit .env files

   # Deploy with Docker
   ./.deploy/deploy.sh
   ```

5. **Configure Domain (Optional)**
   - Point your domain to the Droplet IP
   - Update nginx.conf with your domain
   - Set up SSL with Let's Encrypt:
   ```bash
   # Install Certbot
   apt-get install certbot python3-certbot-nginx

   # Get SSL certificate
   certbot --nginx -d yourdomain.com
   ```

### Option 3: Container Registry + App Platform

For a hybrid approach:

1. **Push to Digital Ocean Container Registry**
   ```bash
   # Install doctl CLI
   # https://docs.digitalocean.com/reference/doctl/how-to/install/

   # Authenticate
   doctl auth init

   # Create registry
   doctl registry create gastonapp

   # Login to registry
   doctl registry login

   # Build and push
   docker build -f .deploy/Dockerfile -t registry.digitalocean.com/gastonapp/web:latest .
   docker push registry.digitalocean.com/gastonapp/web:latest
   ```

2. **Deploy from Registry in App Platform**
   - Select "Container Registry" as source
   - Choose your image
   - Configure and deploy

---

## Environment Variables

### Web App (apps/web)

Create a `.env` file in `apps/web/`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Backend API URL
VITE_API_URL=https://your-backend-api.com

# Environment
VITE_NODE_ENV=production
```

> **Important**: Never commit `.env` files to version control. Keep your API keys secure.

### Docker Environment

Create `.env` file in the root:

```env
NODE_ENV=production
```

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with "out of memory"
```bash
# Solution: Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build:web
```

**Issue**: TypeScript errors during build
```bash
# Solution: Check types first
pnpm type-check
```

### Docker Issues

**Issue**: Docker build fails
```bash
# Solution: Clean Docker cache
docker system prune -a
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

**Issue**: Container won't start
```bash
# Solution: Check logs
docker-compose -f .deploy/docker-compose.yml logs web

# Check if port is already in use
lsof -i :80
```

### Deployment Issues

**Issue**: App shows white screen
- Check if environment variables are set correctly
- Verify the build completed successfully
- Check browser console for errors

**Issue**: API requests fail
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration on backend
- Verify firewall rules allow traffic

### Performance Issues

**Issue**: Slow page loads
```bash
# Solution: Enable Gzip compression (already in nginx.conf)
# Verify compression is working
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
```

**Issue**: High memory usage
- Consider upgrading droplet size
- Enable swap space on droplet

---

## Monitoring & Maintenance

### Health Checks

Docker Compose includes health checks for the web container. You can verify the container is running properly:

```bash
# Check container health status
docker ps
# Look for "healthy" in the STATUS column

# Check if the site is accessible
curl http://localhost:80
```

### Logs

```bash
# View all logs
pnpm docker:logs

# View specific service
docker-compose -f .deploy/docker-compose.yml logs web

# Follow logs in real-time
docker-compose -f .deploy/docker-compose.yml logs -f
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
pnpm deploy
```

---

## Support

For issues or questions:
1. Check the [troubleshooting section](#troubleshooting)
2. Review logs for error messages
3. Open an issue on [GitHub](https://github.com/fredattack/GastonApp/issues)

---

## Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/)
- [Digital Ocean Documentation](https://docs.digitalocean.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Last Updated**: November 2025
