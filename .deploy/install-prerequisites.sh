#!/bin/bash

# GastonApp - Droplet Prerequisites Installation Script
# This script installs all required software on a fresh Ubuntu droplet
# Supports: Ubuntu 20.04, 22.04, 24.04

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 GastonApp - Installing Prerequisites${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ This script must be run as root${NC}"
    echo -e "${YELLOW}💡 Run: sudo bash install-prerequisites.sh${NC}"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo -e "${RED}❌ Cannot detect OS${NC}"
    exit 1
fi

echo -e "${BLUE}📋 System Information:${NC}"
echo -e "   OS: $OS $VER"
echo -e "   Hostname: $(hostname)"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt-get update -qq
apt-get upgrade -y -qq

# Install basic tools
echo -e "${YELLOW}🔧 Installing basic tools...${NC}"
apt-get install -y -qq \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https

# Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is already installed${NC}"
    docker --version
else
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"

    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt-get update -qq
    apt-get install -y -qq \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin

    # Start and enable Docker
    systemctl start docker
    systemctl enable docker

    echo -e "${GREEN}✅ Docker installed successfully${NC}"
    docker --version
fi

# Check if Docker Compose is installed
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose is already installed${NC}"
    docker compose version
else
    echo -e "${YELLOW}🔧 Installing Docker Compose...${NC}"
    apt-get install -y -qq docker-compose-plugin
    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
    docker compose version
fi

# Configure Docker
echo -e "${YELLOW}⚙️  Configuring Docker...${NC}"

# Create Docker daemon config if it doesn't exist
if [ ! -f /etc/docker/daemon.json ]; then
    cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
    systemctl restart docker
    echo -e "${GREEN}✅ Docker configured${NC}"
else
    echo -e "${GREEN}✅ Docker daemon config already exists${NC}"
fi

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"

if command -v ufw &> /dev/null; then
    # Enable UFW if not enabled
    if ! ufw status | grep -q "Status: active"; then
        echo -e "${YELLOW}   Enabling UFW...${NC}"
        ufw --force enable
    fi

    # Allow SSH (important!)
    ufw allow 22/tcp comment 'SSH'

    # Allow HTTP and HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'

    # Reload UFW
    ufw reload

    echo -e "${GREEN}✅ Firewall configured${NC}"
    ufw status numbered
else
    echo -e "${YELLOW}⚠️  UFW not installed, skipping firewall configuration${NC}"
fi

# Install Git if not present
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📚 Installing Git...${NC}"
    apt-get install -y -qq git
fi

echo -e "${GREEN}✅ Git installed${NC}"
git --version

# Configure Git (optional but recommended)
echo -e "${YELLOW}⚙️  Configuring Git...${NC}"
if [ -z "$(git config --global user.email)" ]; then
    git config --global user.email "deploy@gastonapp.com"
    git config --global user.name "GastonApp Deploy"
    echo -e "${GREEN}✅ Git configured${NC}"
else
    echo -e "${GREEN}✅ Git already configured${NC}"
fi

# Create app directory if it doesn't exist
APP_DIR="/root/GastonApp"
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}📁 Creating application directory...${NC}"
    mkdir -p "$APP_DIR"
    echo -e "${GREEN}✅ Directory created: $APP_DIR${NC}"
else
    echo -e "${GREEN}✅ Application directory exists: $APP_DIR${NC}"
fi

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
apt-get autoremove -y -qq
apt-get clean -qq

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All prerequisites installed successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${GREEN}📋 Installation Summary:${NC}"
echo -e "   ✅ Docker: $(docker --version | cut -d',' -f1)"
echo -e "   ✅ Docker Compose: $(docker compose version | cut -d',' -f1)"
echo -e "   ✅ Git: $(git --version)"
echo -e "   ✅ Firewall: Configured (ports 22, 80, 443)"
echo -e "   ✅ Application directory: $APP_DIR"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Your droplet is ready for GastonApp!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Clone the GastonApp repository to $APP_DIR"
echo -e "   2. Create apps/web/.env with your configuration"
echo -e "   3. Run the deployment script"
echo ""
echo -e "${YELLOW}💡 Example:${NC}"
echo -e "   cd $APP_DIR"
echo -e "   git clone https://github.com/fredattack/GastonApp.git ."
echo -e "   nano apps/web/.env  # Add your environment variables"
echo -e "   ./.deploy/deploy.sh"
echo ""
echo -e "${GREEN}🚀 Happy deploying!${NC}"