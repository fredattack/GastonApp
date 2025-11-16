# Deployment Scripts

This directory
contains all the
deployment
configuration and
scripts for
GastonApp.

## Files Overview

- **Dockerfile** -
  Multi-stage Docker
  build for
  production
-
    *
*docker-compose.yml
** - Docker
Compose
configuration
- **nginx.conf** -
  Nginx web server
  configuration
- **deploy.sh** -
  Local/droplet
  deployment script
- **remote-deploy.sh
  ** - Remote
  deployment
  script (from local
  to droplet)

## Quick Start

### Local Deployment

Deploy locally using
Docker:

```bash
# From project root
pnpm deploy

# Or directly
./.deploy/deploy.sh
```

### Remote Deployment

Deploy to your
Digital Ocean
droplet from your
local machine:

```bash
# Basic usage
pnpm deploy:remote -- --host YOUR_DROPLET_IP

# With custom SSH key
pnpm deploy:remote -- --host YOUR_DROPLET_IP --key ~/.ssh/my-key

# Deploy a specific branch
pnpm deploy:remote -- --host YOUR_DROPLET_IP --branch develop

# Full example
pnpm deploy:remote -- --host 192.168.1.100 --user deploy --branch main --key ~/.ssh/id_rsa
```

**Note:** The `--`
before arguments is
required when using
pnpm scripts.

Or use the script
directly:

```bash
./.deploy/remote-deploy.sh --host YOUR_DROPLET_IP
```

## remote-deploy.sh Options

```
-h, --host HOST      Droplet IP address or hostname (required)
-k, --key KEY        SSH key path (optional)
-u, --user USER      Remote user (default: root)
-p, --path PATH      Remote project path (default: /root/GastonApp)
-b, --branch BRANCH  Git branch to deploy (default: master)
--help               Show help message
```

## Available pnpm Commands

### Deployment Commands

```bash
pnpm deploy              # Deploy locally with Docker
pnpm deploy:remote       # Deploy to remote droplet (requires -- --host IP)
```

### Docker Commands

```bash
pnpm docker:build        # Build Docker image
pnpm docker:up           # Start containers
pnpm docker:down         # Stop containers
pnpm docker:logs         # View logs (follow mode)
pnpm docker:ps           # Show container status
```

## Deployment Workflows

### 1. First-Time Deployment to Droplet

Follow the detailed
guide in
`MIGRATION_DEPLOYMENT.md`:

1. Ensure your
   droplet has
   Docker and Git
   installed
2. Create
   `apps/web/.env`
   with your
   environment
   variables
3. Deploy:
   ```bash
   pnpm deploy:remote -- --host YOUR_DROPLET_IP
   ```

### 2. Update Existing Deployment

To update an already
deployed
application:

```bash
# Just run the remote deploy script
pnpm deploy:remote -- --host YOUR_DROPLET_IP

# It will:
# 1. Pull latest code from Git
# 2. Rebuild Docker image
# 3. Restart containers
```

### 3. Deploy a Specific Branch

```bash
pnpm deploy:remote -- --host YOUR_DROPLET_IP --branch feature/my-feature
```

### 4. Local Testing Before Deployment

Test the Docker
build locally before
deploying:

```bash
# Build and run locally
pnpm docker:build
pnpm docker:up

# Test the application
curl http://localhost

# Check logs
pnpm docker:logs

# Stop when done
pnpm docker:down
```

## Configuration

### Environment Variables

Create
`apps/web/.env` with
required variables:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OPENAI_API_KEY=...
VITE_API_URL=...
VITE_NODE_ENV=production
```

### Nginx Configuration

Edit `nginx.conf` to
customize:

- Server name (for
  SSL)
- Proxy settings (
  for backend API)
- Cache settings
- Security headers

### Docker Compose Configuration

Edit
`docker-compose.yml`
to customize:

- Ports
- Volumes
- Networks
- Additional
  services

## Troubleshooting

### Remote deployment fails with SSH error

```bash
# Test SSH connection first
ssh root@YOUR_DROPLET_IP

# Or with specific key
ssh -i ~/.ssh/your-key root@YOUR_DROPLET_IP

# If connection works, try deployment again
```

### Environment variables not found

```bash
# SSH into droplet and verify
ssh root@YOUR_DROPLET_IP
cd /root/GastonApp
ls -la apps/web/.env

# If missing, create it
nano apps/web/.env
# Add your variables, save and exit

# Rebuild
docker-compose -f .deploy/docker-compose.yml build --no-cache
docker-compose -f .deploy/docker-compose.yml up -d
```

### Docker build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
pnpm docker:build -- --no-cache

# Or on remote
ssh root@YOUR_DROPLET_IP 'cd /root/GastonApp && docker-compose -f .deploy/docker-compose.yml build --no-cache'
```

### Application shows white screen

```bash
# Check logs for errors
pnpm docker:logs

# Or on remote
ssh root@YOUR_DROPLET_IP 'cd /root/GastonApp && docker-compose -f .deploy/docker-compose.yml logs'

# Verify environment variables are correct
ssh root@YOUR_DROPLET_IP 'cat /root/GastonApp/apps/web/.env'
```

## Monitoring

### View Logs

```bash
# Local
pnpm docker:logs

# Remote
ssh root@YOUR_DROPLET_IP 'cd /root/GastonApp && docker-compose -f .deploy/docker-compose.yml logs -f'
```

### Check Container Status

```bash
# Local
pnpm docker:ps

# Remote
ssh root@YOUR_DROPLET_IP 'cd /root/GastonApp && docker-compose -f .deploy/docker-compose.yml ps'
```

### Health Check

```bash
# Local
curl http://localhost/health

# Remote
curl http://YOUR_DROPLET_IP/health
```

## Best Practices

1. **Test Locally
   First**: Always
   test Docker build
   locally before
   deploying to
   production
2. **Use Branches**:
   Deploy feature
   branches to test
   before merging to
   main
3. **Check Logs**:
   Always check logs
   after deployment
   to verify
   everything works
4. **Backup**: Keep
   backups of
   environment
   variables and
   data
5. **Monitor**: Set
   up monitoring and
   alerting for
   production

## Additional Resources

- [DEPLOYMENT.md](../docs/DEPLOYMENT.md) -
  Complete
  deployment guide
- [MIGRATION_DEPLOYMENT.md](../docs/MIGRATION_DEPLOYMENT.md) -
  Migration guide
  from old structure
- [CLAUDE.md](../CLAUDE.md) -
  Project overview
  and architecture

## Support

For issues or
questions:

1. Check logs first
2. Review the
   troubleshooting
   sections
3. Consult the full
   deployment guides
4. Open an issue on
   GitHub
