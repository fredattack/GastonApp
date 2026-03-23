# Dockerfile for GastonApp Web
# Assets are pre-built on CI runner and copied here
FROM nginx:alpine

# Copy custom nginx config
COPY .deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-built assets
COPY apps/web/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
