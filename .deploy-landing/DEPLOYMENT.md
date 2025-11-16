# GastonApp Landing Page - Deployment Guide for Digital Ocean

This guide will walk you through deploying the GastonApp Landing Page to a separate Digital Ocean droplet.

## Prerequisites

- A Digital Ocean account
- SSH access to your droplet
- A domain name (optional, for custom domain)

## Step 1: Create a Digital Ocean Droplet

1. Log in to your Digital Ocean account
2. Click "Create" → "Droplets"
3. Choose the following specifications:
   - **Distribution**: Ubuntu 22.04 (LTS) x64
   - **Plan**: Basic (Shared CPU)
   - **CPU Options**: Regular (2GB RAM / 1 vCPU recommended)
   - **Datacenter**: Choose the region closest to your users
   - **Authentication**: SSH key (recommended) or password
   - **Hostname**: `gastonapp-landing` (or your preferred name)

4. Click "Create Droplet"

## Step 2: Initial Server Setup

SSH into your droplet:

```bash
ssh root@YOUR_DROPLET_IP
```

Update the system:

```bash
apt update && apt upgrade -y
```

## Step 3: Install Docker and Docker Compose

Install Docker:

```bash
# Install required packages
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
systemctl start docker
systemctl enable docker
```

Install Docker Compose:

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Step 4: Clone the Repository

Install Git if not already installed:

```bash
apt install -y git
```

Clone the GastonApp repository:

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/GastonApp.git
cd GastonApp
```

If it's a private repository, you'll need to set up SSH keys or use a personal access token.

## Step 5: Deploy the Landing Page

Run the deployment script:

```bash
chmod +x .deploy-landing/deploy.sh
./.deploy-landing/deploy.sh
```

The script will:
- Build the Docker image
- Stop any existing containers
- Start the new container
- Expose the app on port 8080

Verify the deployment:

```bash
docker ps
curl http://localhost:8080
```

## Step 6: Configure Nginx Reverse Proxy (Optional but Recommended)

Install Nginx:

```bash
apt install -y nginx
```

Create a new Nginx configuration:

```bash
nano /etc/nginx/sites-available/gastonapp-landing
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/gastonapp-landing /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 7: Configure SSL with Let's Encrypt (Recommended)

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

Obtain and install SSL certificate:

```bash
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

Follow the prompts to:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically configure Nginx for SSL and set up auto-renewal.

Test auto-renewal:

```bash
certbot renew --dry-run
```

## Step 8: Configure Firewall

Enable UFW firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

## Step 9: Set Up Auto-Updates (Optional)

For automatic deployments when you push to the repository:

### Option A: Manual Updates

Create a deployment script:

```bash
nano /usr/local/bin/update-landing
```

Add:

```bash
#!/bin/bash
cd /opt/GastonApp
git pull origin main
./.deploy-landing/deploy.sh
```

Make it executable:

```bash
chmod +x /usr/local/bin/update-landing
```

Update by running:

```bash
update-landing
```

### Option B: Webhook with GitHub Actions

Set up a GitHub webhook to trigger deployments automatically when you push changes.

1. Install webhook receiver (e.g., webhook, Adnanh's webhook)
2. Configure webhook endpoint in GitHub repository settings
3. Create workflow to pull and deploy on webhook trigger

## Step 10: Monitoring and Logs

View Docker logs:

```bash
docker-compose -f /opt/GastonApp/.deploy-landing/docker-compose.yml logs -f
```

View Nginx logs:

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

Check container status:

```bash
docker ps
docker stats
```

## Maintenance

### Updating the Application

```bash
cd /opt/GastonApp
git pull origin main
./.deploy-landing/deploy.sh
```

### Restarting the Container

```bash
docker-compose -f .deploy-landing/docker-compose.yml restart
```

### Stopping the Application

```bash
docker-compose -f .deploy-landing/docker-compose.yml down
```

### Removing Old Images

```bash
docker image prune -a
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose -f .deploy-landing/docker-compose.yml logs
```

### Port already in use

Find and stop the process using port 8080:
```bash
lsof -i :8080
kill -9 <PID>
```

### Nginx configuration errors

Test configuration:
```bash
nginx -t
```

View error logs:
```bash
tail -f /var/log/nginx/error.log
```

### SSL certificate issues

Renew certificate manually:
```bash
certbot renew
systemctl reload nginx
```

## Performance Optimization

### Enable caching

Nginx is already configured with caching in the included config file.

### Enable Gzip compression

Gzip is enabled by default in the Nginx configuration.

### Monitor resources

Install htop for resource monitoring:
```bash
apt install -y htop
htop
```

## Security Recommendations

1. **Keep system updated**:
   ```bash
   apt update && apt upgrade -y
   ```

2. **Use SSH keys** instead of password authentication

3. **Enable firewall** with UFW (covered in Step 8)

4. **Regular backups**: Set up automated backups of your droplet

5. **Monitor logs** regularly for suspicious activity

6. **Use fail2ban** to prevent brute-force attacks:
   ```bash
   apt install -y fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

## Cost Estimation

For a basic setup:
- **Droplet**: $12-24/month (2GB RAM)
- **Domain**: $10-15/year (optional)
- **SSL**: Free with Let's Encrypt
- **Total**: ~$12-24/month

## Support

For issues or questions:
- Check the main [README](../README.md)
- Review [logs](#monitoring-and-logs)
- Contact DevOps team

## Next Steps

- Configure custom domain DNS settings
- Set up monitoring and alerts
- Configure automated backups
- Implement CI/CD pipeline
- Add staging environment
