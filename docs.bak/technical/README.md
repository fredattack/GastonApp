# Technical Documentation

This directory contains technical implementation guides, architecture decisions, and developer-focused documentation.

## Available Documents

### [Monorepo Migration](./monorepo-migration.md)
**Status**: Historical Reference
**Audience**: Developers

Detailed documentation of the migration from single-app to monorepo structure:
- Migration strategy and approach
- Package structure design
- Turborepo configuration
- Shared code organization
- Development workflow changes

**Use this for**: Understanding the monorepo architecture and historical context.

---

### [Monorepo Migration Completed](./monorepo-completed.md)
**Status**: Historical Record
**Audience**: Developers, Project Managers

Summary of the completed monorepo migration:
- Migration timeline (November 2025, 10 minutes)
- Changes made to package.json and structure
- Verification steps performed
- Before/after comparisons

**Use this for**: Quick reference of what changed during the monorepo migration.

---

### [Makefile Guide](./makefile-guide.md)
**Status**: Active Reference
**Audience**: Developers

Comprehensive guide for using the project Makefile:
- Quick start commands
- Development workflows
- Backend commands (Docker and local)
- Frontend commands (monorepo)
- Testing and linting commands
- Deployment commands

**Use this for**: Daily development workflow and command reference.

---

### [API Streaming Implementation](./api-streaming.md)
**Status**: Implementation Guide
**Audience**: Backend Developers

Guide for implementing streaming AI responses:
- Current API endpoint structure
- Proposed streaming architecture
- Laravel implementation details
- Frontend integration approach
- Testing strategies

**Use this for**: Implementing or understanding the AI streaming feature.

---

## Monorepo Architecture

The project uses a Turborepo-based monorepo structure:

```
GastonApp/
├── apps/
│   ├── web/          # React + Vite web application
│   └── mobile/       # React Native Expo (future)
└── packages/
    ├── shared/       # Shared code (types, services, utils)
    ├── ui/           # Shared UI components (future)
    ├── eslint-config/
    └── typescript-config/
```

## Key Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Laravel (separate repository/Docker)
- **Build System**: Turborepo + pnpm workspaces
- **Deployment**: Docker + Nginx
- **AI Integration**: OpenAI API

## Recommended Reading Order

### For New Developers
1. [Makefile Guide](./makefile-guide.md) - Get started with development
2. [Monorepo Migration](./monorepo-migration.md) - Understand project structure
3. [Main CLAUDE.md](../../CLAUDE.md) - Full development guide

### For Understanding Architecture
1. [Monorepo Migration](./monorepo-migration.md) - Architecture overview
2. [Monorepo Completed](./monorepo-completed.md) - Migration summary
3. [Main README](../../README.md) - Project structure

### For Feature Development
1. [Makefile Guide](./makefile-guide.md) - Development commands
2. [API Streaming](./api-streaming.md) - Backend API patterns
3. [Main CLAUDE.md](../../CLAUDE.md) - Coding conventions

---

## Related Documentation

- [Deployment Documentation](../deployment/) - Deployment and CI/CD
- [AI Improvements](../ai-improvements/) - AI feature development
- [Main README](../../README.md) - Project overview
- [CLAUDE.md](../../CLAUDE.md) - Comprehensive development guide