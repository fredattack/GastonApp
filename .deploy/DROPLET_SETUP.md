# Digital Ocean Droplet Setup Guide

## Quick Setup (5 minutes)

This guide helps you create and configure a Digital Ocean droplet for GastonApp deployment.

---

## Step 1: Create the Droplet

### Via Digital Ocean Dashboard

1. **Go to**: [DigitalOcean Droplets](https://cloud.digitalocean.com/droplets)
2. **Click**: "Create" → "Droplets"
3. **Configure**:

   ```
   Region:      Choose closest to your users (e.g., Frankfurt, Amsterdam)
   Image:       Ubuntu 24.04 LTS x64 (Noble Numbat)
   Size:        Basic - $4/month (512MB RAM, 1 vCPU, 10GB SSD)
                OR
                Basic - $6/month (1GB RAM, 1 vCPU, 25GB SSD) - RECOMMENDED
   ```

4. **SSH Key**: Add your SSH public key (required for GitHub Actions)
5. **Hostname**: `gastonapp-production` (or your choice)
6. **Create Droplet**

### Via DigitalOcean CLI (doctl)

```bash
# Install doctl
brew install doctl  # macOS
# or: snap install doctl  # Linux

# Authenticate
doctl auth init

# Create droplet
doctl compute droplet create gastonapp-production \
  --region fra1 \
  --image ubuntu-24-04-x64 \
  --size s-1vcpu-1gb \
  --ssh-keys YOUR_SSH_KEY_ID \
  --wait

# Get droplet IP
doctl compute droplet list gastonapp-production
```

---

## Step 2: Get Droplet Information

After creation, note:
- **IP Address**: `xxx.xxx.xxx.xxx`
- **SSH Key**: The one you added
- **Username**: `root` (default for DigitalOcean)

Test SSH access:
```bash
ssh root@xxx.xxx.xxx.xxx
```

---

## Step 3: Update GitHub Secrets

Go to your GitHub repository settings and update:

### Required Secrets

| Secret Name | Value | Example |
|------------|-------|---------|
| `DROPLET_IP` | Your droplet IP | `64.226.118.164` |
| `DROPLET_USER` | SSH user | `root` |
| `REMOTE_PATH` | App directory | `/root/GastonApp` |
| `SSH_PRIVATE_KEY` | Your SSH private key | `-----BEGIN...` |

### Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key |
| `VITE_API_URL` | Your backend API URL |
| `VITE_BUGSNAG_API_KEY` | Bugsnag error tracking key |

### How to Add Secrets

```bash
# Go to your repository
1. Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: DROPLET_IP
4. Value: Your droplet IP
5. Click "Add secret"

# Repeat for all secrets above
```

---

## Step 4: First Deployment

### Option A: Via GitHub Actions (Recommended)

1. Push to `master` branch
2. GitHub Actions will automatically:
   - ✅ Check for Docker
   - ✅ Install Docker if needed
   - ✅ Clone repository
   - ✅ Build application
   - ✅ Deploy with Docker

### Option B: Manual Deployment

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Clone repository
cd /root
git clone https://github.com/YOUR_USERNAME/GastonApp.git
cd GastonApp

# Install prerequisites (Docker, etc.)
sudo ./.deploy/install-prerequisites.sh

# Create environment file
cd apps/web
nano .env

# Add:
VITE_OPENAI_API_KEY=your_key_here
VITE_API_URL=your_api_url
VITE_BUGSNAG_API_KEY=your_bugsnag_key
VITE_NODE_ENV=production

# Deploy
cd /root/GastonApp
./.deploy/deploy.sh
```

---

## Step 5: Verify Deployment

```bash
# Check if containers are running
docker ps

# Expected output:
# gastonapp-web    running    0.0.0.0:80->80/tcp

# Test the application
curl http://YOUR_DROPLET_IP

# Check logs if needed
docker logs gastonapp-web
```

---

## Troubleshooting

### Issue: "Ubuntu 24.10 is EOL"

**Problem**: You created droplet with Ubuntu 24.10 (Oracular)

**Solution**:
1. Destroy the droplet
2. Create new one with Ubuntu 24.04 LTS
3. Update GitHub secrets with new IP

### Issue: "Permission denied (publickey)"

**Problem**: SSH key not configured correctly

**Solutions**:
```bash
# 1. Check if SSH key is added to droplet
doctl compute ssh-key list

# 2. Add your public key
cat ~/.ssh/id_rsa.pub  # Copy this
# Add via DigitalOcean dashboard: Settings → Security → SSH Keys

# 3. Test connection
ssh -v root@YOUR_DROPLET_IP
```

### Issue: Docker installation fails

**Problem**: Package repositories unavailable

**Solution**: Use Ubuntu 24.04 LTS (not 24.10 or other non-LTS)

### Issue: Deployment fails in GitHub Actions

**Checklist**:
- ✅ All GitHub secrets are set correctly
- ✅ SSH key has no passphrase (or use ssh-agent)
- ✅ Droplet is Ubuntu 24.04 LTS
- ✅ SSH access works: `ssh root@YOUR_IP`
- ✅ Repository path is correct: `/root/GastonApp`

---

## Security Recommendations

### 1. Setup Firewall

```bash
# UFW is configured by install-prerequisites.sh
# But verify:
ufw status

# Should show:
# 22/tcp   ALLOW   SSH
# 80/tcp   ALLOW   HTTP
# 443/tcp  ALLOW   HTTPS
```

### 2. Enable Automatic Updates (Optional)

```bash
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 3. Setup SSL/HTTPS (Recommended)

```bash
# Install certbot
apt-get install -y certbot

# Get certificate
certbot certonly --standalone -d yourdomain.com

# Update nginx config to use SSL
# (See Docker nginx.conf)
```

---

## Cost Estimation

| Size | RAM | vCPU | Storage | Monthly Cost |
|------|-----|------|---------|--------------|
| Basic | 512MB | 1 | 10GB | $4 USD |
| **Recommended** | 1GB | 1 | 25GB | **$6 USD** |
| Standard | 2GB | 1 | 50GB | $12 USD |

**Recommendation**: Start with $6/month (1GB RAM) for production.

---

## Next Steps

After successful deployment:

1. ✅ Test application: `http://YOUR_DROPLET_IP`
2. ✅ Setup domain name (optional)
3. ✅ Configure SSL certificate (recommended)
4. ✅ Setup monitoring (Bugsnag already configured)
5. ✅ Configure backups (DigitalOcean Backups or Snapshots)

---

## Support

- **Deployment Issues**: Check GitHub Actions logs
- **Docker Issues**: `docker logs gastonapp-web`
- **System Logs**: `journalctl -xe`
- **Digital Ocean**: [Support Center](https://www.digitalocean.com/support)

---

**🎉 Your GastonApp droplet is ready!**
