# Multi-stage Dockerfile for GastonApp Landing Page
# Stage 1: Build
FROM node:22.3-alpine AS builder

# Install pnpm directly via npm (avoids corepack signature verification issues)
RUN npm install -g pnpm@10.14.0

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY turbo.json ./

# Copy all packages and the landing-page app
COPY packages ./packages
COPY apps/landing-page ./apps/landing-page

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the landing page
RUN pnpm --filter @gastonapp/landing-page build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy custom nginx config
COPY .deploy-landing/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/apps/landing-page/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
