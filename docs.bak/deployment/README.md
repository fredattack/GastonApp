# Deployment Documentation

This directory contains all documentation related to deploying GastonApp to various environments.

## Quick Start

For new deployments, start with the [quickstart guide](./quickstart.md).

## Available Guides

### [Deployment Guide](./deployment-guide.md)
**Status**: Active
**Audience**: DevOps, Developers

Comprehensive deployment guide covering:
- Prerequisites and system requirements
- Digital Ocean droplet setup (Ubuntu 24.04 LTS)
- Docker deployment configuration
- Environment variable management
- Production deployment workflows
- Troubleshooting common deployment issues

**Start here for**: Complete production deployment setup.

---

### [Quickstart Guide](./quickstart.md)
**Status**: Active
**Audience**: Developers

Fast-track deployment guide to get GastonApp running in 5 minutes:
- Automated deployment script usage
- Quick environment setup
- Essential configuration steps
- Verification steps

**Start here for**: Quick deployment testing or staging environments.

---

### [CI/CD Guide](./ci-cd-guide.md)
**Status**: Active
**Audience**: DevOps, Team Leads

Continuous Integration and Deployment configuration:
- GitHub Actions workflows overview
- Automated testing on pull requests
- Production deployment automation
- Staging environment setup
- Workflow monitoring and logs

**Start here for**: Setting up automated deployments.

---

### [Migration Guide](./migration-guide.md)
**Status**: Historical (Monorepo Migration)
**Audience**: Developers

Guide for migrating an existing Digital Ocean droplet from the old single-app structure to the new monorepo architecture:
- Pre-migration checklist and backup procedures
- Step-by-step migration process
- Environment reconfiguration
- Rollback procedures
- Post-migration validation

**Relevance**: Useful for understanding the monorepo transition. Most deployments should use the deployment-guide.md instead.

---

### [GitHub Secrets Configuration](./github-secrets.md)
**Status**: Active
**Audience**: DevOps, Team Leads

Required GitHub Secrets for CI/CD workflows:
- SSH configuration for deployment
- Environment variables for production
- API keys and credentials management
- Security best practices

**Start here for**: Configuring GitHub Actions deployment automation.

---

## Recommended Reading Order

### For First-Time Deployment
1. [Deployment Guide](./deployment-guide.md) - Full setup instructions
2. [GitHub Secrets](./github-secrets.md) - Configure CI/CD (optional)
3. [CI/CD Guide](./ci-cd-guide.md) - Automate deployments (optional)

### For Quick Testing
1. [Quickstart Guide](./quickstart.md) - Get running fast
2. [Deployment Guide](./deployment-guide.md) - Reference for troubleshooting

### For CI/CD Setup
1. [GitHub Secrets](./github-secrets.md) - Configure secrets first
2. [CI/CD Guide](./ci-cd-guide.md) - Setup workflows
3. [Deployment Guide](./deployment-guide.md) - Understanding deployment process

---

## Related Documentation

- [Technical Documentation](../technical/) - Monorepo structure and architecture
- [Main README](../../README.md) - Project overview and local development