#!/bin/bash

# Remote Deployment Script for GastonApp
# This script deploys the application to a remote Digital Ocean droplet
# Usage: ./remote-deploy.sh [DROPLET_IP] [OPTIONS]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DROPLET_IP=""
SSH_KEY=""
REMOTE_USER="root"
REMOTE_PATH="/root/GastonApp"
BRANCH="master"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            DROPLET_IP="$2"
            shift 2
            ;;
        -k|--key)
            SSH_KEY="$2"
            shift 2
            ;;
        -u|--user)
            REMOTE_USER="$2"
            shift 2
            ;;
        -p|--path)
            REMOTE_PATH="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -h, --host HOST      Droplet IP address or hostname (required)"
            echo "  -k, --key KEY        SSH key path (optional)"
            echo "  -u, --user USER      Remote user (default: root)"
            echo "  -p, --path PATH      Remote project path (default: /root/GastonApp)"
            echo "  -b, --branch BRANCH  Git branch to deploy (default: master)"
            echo "  --help               Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --host 192.168.1.100"
            echo "  $0 --host myapp.com --user deploy --branch main"
            echo "  $0 -h 192.168.1.100 -k ~/.ssh/id_rsa -b develop"
            exit 0
            ;;
        *)
            if [[ -z "$DROPLET_IP" ]]; then
                DROPLET_IP="$1"
            fi
            shift
            ;;
    esac
done

# Check if droplet IP is provided
if [[ -z "$DROPLET_IP" ]]; then
    echo -e "${RED}❌ Error: Droplet IP/hostname is required${NC}"
    echo "Usage: $0 --host DROPLET_IP [OPTIONS]"
    echo "Run '$0 --help' for more information"
    exit 1
fi

# Build SSH command
SSH_CMD="ssh"
if [[ -n "$SSH_KEY" ]]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY"
fi
SSH_CMD="$SSH_CMD ${REMOTE_USER}@${DROPLET_IP}"

echo -e "${GREEN}🚀 Starting Remote Deployment to ${DROPLET_IP}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check SSH connection
echo -e "${YELLOW}📡 Testing SSH connection...${NC}"
if ! $SSH_CMD "echo 'Connection successful'" &> /dev/null; then
    echo -e "${RED}❌ Failed to connect to ${DROPLET_IP}${NC}"
    echo -e "${YELLOW}💡 Make sure:"
    echo -e "   - The droplet IP is correct"
    echo -e "   - SSH access is configured"
    echo -e "   - Your SSH key is added to the droplet (if using key auth)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection successful${NC}"

# Check if Docker is installed
echo -e "${YELLOW}🐳 Checking Docker installation...${NC}"
if ! $SSH_CMD "command -v docker &> /dev/null"; then
    echo -e "${RED}⚠️  Docker is not installed on the droplet${NC}"
    echo -e "${YELLOW}💡 GastonApp requires Docker and Docker Compose to run${NC}"
    echo ""
    read -p "Do you want to install Docker and prerequisites automatically? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}📦 Installing prerequisites on droplet...${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

        # Upload and run installation script
        SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
        $SSH_CMD "mkdir -p /tmp/gastonapp-setup"
        scp $(echo "$SSH_CMD" | sed 's/ssh/scp/' | sed "s/${REMOTE_USER}@${DROPLET_IP}//") \
            "${SCRIPT_DIR}/install-prerequisites.sh" \
            "${REMOTE_USER}@${DROPLET_IP}:/tmp/gastonapp-setup/install-prerequisites.sh"

        $SSH_CMD "chmod +x /tmp/gastonapp-setup/install-prerequisites.sh && sudo /tmp/gastonapp-setup/install-prerequisites.sh"

        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ Prerequisites installed successfully${NC}"
    else
        echo -e "${RED}❌ Deployment cancelled${NC}"
        echo -e "${YELLOW}💡 Please install Docker manually or run this script again and choose 'y'${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker is installed${NC}"
    $SSH_CMD "docker --version"
fi

# Check if project exists on remote
echo -e "${YELLOW}📂 Checking remote project...${NC}"
if $SSH_CMD "[ -d ${REMOTE_PATH} ]"; then
    echo -e "${GREEN}✅ Project directory exists${NC}"

    # Update existing project
    echo -e "${YELLOW}🔄 Updating project from Git...${NC}"
    $SSH_CMD "cd ${REMOTE_PATH} && git fetch origin && git checkout ${BRANCH} && git pull origin ${BRANCH}"
else
    echo -e "${YELLOW}📥 Project not found, cloning...${NC}"
    $SSH_CMD "git clone https://github.com/fredattack/GastonApp.git ${REMOTE_PATH} && cd ${REMOTE_PATH} && git checkout ${BRANCH}"
fi

# Check if .env exists
echo -e "${YELLOW}🔍 Checking environment variables...${NC}"
if ! $SSH_CMD "[ -f ${REMOTE_PATH}/apps/web/.env ]"; then
    echo -e "${RED}⚠️  Warning: .env file not found in apps/web/${NC}"
    echo -e "${YELLOW}💡 You need to create apps/web/.env with your configuration${NC}"
    echo -e "${YELLOW}   See MIGRATION_DEPLOYMENT.md for details${NC}"

    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi
fi

# Run deployment script on remote
echo -e "${YELLOW}🚀 Running deployment on remote server...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

$SSH_CMD "cd ${REMOTE_PATH} && ./.deploy/deploy.sh"

# Check deployment status
if [ $? -eq 0 ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo -e "${GREEN}🌐 Application should be running at: http://${DROPLET_IP}${NC}"

    # Test the application
    echo -e "${YELLOW}🧪 Testing application...${NC}"
    if curl -sf "http://${DROPLET_IP}/health" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed, but deployment completed${NC}"
        echo -e "${YELLOW}   Check logs with: ssh ${REMOTE_USER}@${DROPLET_IP} 'cd ${REMOTE_PATH} && docker-compose -f .deploy/docker-compose.yml logs'${NC}"
    fi

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📊 Useful commands:${NC}"
    echo -e "   View logs:    ssh ${REMOTE_USER}@${DROPLET_IP} 'cd ${REMOTE_PATH} && docker-compose -f .deploy/docker-compose.yml logs -f'"
    echo -e "   Check status: ssh ${REMOTE_USER}@${DROPLET_IP} 'cd ${REMOTE_PATH} && docker-compose -f .deploy/docker-compose.yml ps'"
    echo -e "   Restart:      ssh ${REMOTE_USER}@${DROPLET_IP} 'cd ${REMOTE_PATH} && docker-compose -f .deploy/docker-compose.yml restart'"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo -e "${YELLOW}💡 Check logs with: ssh ${REMOTE_USER}@${DROPLET_IP} 'cd ${REMOTE_PATH} && docker-compose -f .deploy/docker-compose.yml logs'${NC}"
    exit 1
fi