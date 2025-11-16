# Multi-stage Dockerfile for GastonApp Web
# Stage 1: Build
FROM node:22.3-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY turbo.json ./

# Copy all packages and apps
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web app
RUN pnpm --filter @gastonapp/web build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy custom nginx config
COPY .deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
