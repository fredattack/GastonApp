# CLAUDE.md

This file provides
guidance to Claude
Code (
claude.ai/code) when
working with code in
this repository.

## Project Overview

GastonApp is a *
*Turborepo-based
monorepo**
containing multiple
applications for pet
event management and
scheduling. The
monorepo includes a
React TypeScript web
application and is
prepared for a
future React Native
Expo mobile app. All
apps share common
code through
workspace packages.

This guide is
intended for
developers working
with Claude Code (
claude.ai/code) and
provides detailed
information about
the project
structure,
architecture,
conventions, and
workflows.

## Monorepo Structure

```
GastonApp/
├── apps/
│   ├── web/                    # React + Vite web application (main app)
│   └── mobile/                 # React Native Expo mobile app (future)
├── packages/
│   ├── shared/                 # Shared code (types, services, repositories, utils)
│   ├── ui/                     # Shared UI components (future)
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configurations
├── .deploy/                    # Deployment configuration for Digital Ocean
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── deploy.sh
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspaces configuration
└── package.json                # Root package.json with monorepo scripts
```

## Development Commands

### Monorepo-level Commands

```bash
# Install all dependencies (run from root)
pnpm install

# Development - Run all apps
pnpm dev

# Development - Run specific app
pnpm dev:web        # Web app only (port 4480)
pnpm dev:mobile     # Mobile app only (future)

# Build all apps and packages
pnpm build

# Build specific app
pnpm build:web

# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Format code with Prettier
pnpm format

# Clean all build artifacts and node_modules
pnpm clean
```

### Working with Specific Packages

```bash
# Run commands in a specific workspace
pnpm --filter @gastonapp/web dev
pnpm --filter @gastonapp/shared build
pnpm --filter @gastonapp/ui lint
```

### Deployment Commands

```bash
# Deploy with Docker (automated)
pnpm deploy

# Manual Docker commands
pnpm docker:build    # Build Docker image
pnpm docker:up       # Start containers
pnpm docker:down     # Stop containers
pnpm docker:logs     # View logs
```

## Architecture

### Tech Stack

#### Web App (apps/web)

- **Frontend**:
  React 18 +
  TypeScript + Vite
- **UI Libraries**:
  Mantine v5,
  Tailwind CSS,
  FontAwesome icons
- **State Management
  **: Redux Toolkit
- **Backend**:
  Laravel
  12/Users/fred/PhpstormProjects/gaston-backend
- **AI Integration
  **: OpenAI API
-
    *

*

Internationalization
**: i18next

- **Error Tracking
  **: Bugsnag

#### Mobile App (apps/mobile) - Future

- **Framework**:
  React Native +
  Expo
- **Navigation**:
  Expo Router
- **Shared Code**:
  Uses
  @gastonapp/shared
  package

#### Shared Infrastructure

- **Monorepo**:
  Turborepo for
  build
  orchestration
- **Package Manager
  **: pnpm with
  workspaces
- **Deployment**:
  Docker + Nginx for
  production

### Web App Directory Structure (apps/web/src)

```
apps/web/src/
├── components/         # Reusable UI components
│   ├── Event/         # Event-related components (forms, calendar, tables)
│   ├── Pets/          # Pet management components
│   ├── Layouts/       # App layout components
│   ├── Modal/         # Modal components with AI features
│   ├── Form/          # Form input components
│   └── Icon/          # Custom icon components
├── contexts/          # React contexts for state management
├── services/          # Business logic and API calls
├── repository/        # Data access layer (REST APIs)
├── hooks/             # Custom React hooks
├── store/             # Redux store configuration
├── router/            # App routing configuration
├── types/             # TypeScript type definitions
└── enums/             # TypeScript enums
```

### Shared Packages

#### @gastonapp/shared

Contains code shared
between web and
mobile apps:

- **types/**: Shared
  TypeScript type
  definitions
- **services/**:
  Business logic (
  EventService,
  ModelService,
  OpenAIService)
- **repository/**:
  Data access
  layer (
  REST repositories)
- **utils/**: Shared
  utility functions

#### @gastonapp/ui (Future)

Will contain shared
UI components usable
in both web and
mobile apps.

#### @gastonapp/eslint-config

Shared ESLint
configurations:

- `react.js`: For
  React web apps
- `react-native.js`:
  For React Native
  mobile apps

#### @gastonapp/typescript-config

Shared TypeScript
configurations:

- `base.json`: Base
  configuration
- `react.json`: For
  React apps
-

`react-native.json`:
For React Native
apps

### Data Layer Architecture

The app uses a
repository pattern
for data access:

-
    *


-
    *

*RestEventRepository
**: Manages event
data via REST APIs

-
    *

*RestModelRepository
**: Manages pet
data via REST APIs

- **EventService**:
  Business logic for
  event operations
- **ModelService**:
  Business logic for
  pet/model
  operations
- **OpenAIService**:
  AI integration for
  enhanced features

### Context Providers (Web App)

- **EventsProvider
  **: Manages event
  state across the
  app (
  apps/web/src/contexts/EventsContext.tsx)
- **PetsProvider**:
  Manages pet data
  state (
  apps/web/src/contexts/PetsContext.tsx)
- **GlobalProvider
  **: App-wide state
  management

### Key Features

1. **Event
   Management**:
   Create, update,
   delete events
   with recurrence
   patterns
2. **Pet Management
   **: CRUD
   operations for
   pets with
   detailed
   information
3. **Calendar
   Integration**:
   Event scheduling
   and visualization
4. **AI Features**:
   OpenAI
   integration for
   enhanced user
   experience
5. **Multi-language
   Support**:
   i18next with
   multiple locales
6. **Voice Recording
   **: Speech
   recognition and
   processing
   features
7. **Multi-platform
   Ready**: Shared
   code enables
   future mobile app

### Environment Configuration

#### Web App (apps/web/.env)

```env

VITE_OPENAI_API_KEY=
VITE_API_URL=
```

Environment
variables are loaded
via Vite's
import.meta.env
system.

### Code Conventions

**⚠️ IMPORTANT: For detailed architectural guidelines, design patterns, and best practices, see [Front-End Architecture Guide](docs/technical/front-architecture.md).**

#### Quick Reference

- **TypeScript**: Strict mode enabled, explicit types for all public APIs
- **ESLint**: Airbnb configuration
- **Formatting**: Prettier for all code
- **Components**: PascalCase naming with `.tsx` extension
- **Architecture Patterns**:
  - **Hooks Pattern** (primary): Custom hooks for all business logic
  - **Provider Pattern**: Context API for global state (Auth, Theme, I18n, Family)
  - **UI/Logic Separation**: Presentational components vs. Container components
  - **HOC**: Discouraged (legacy pattern)
- **File Organization**:
  - Business logic → `packages/shared/src/hooks/`
  - UI components → `packages/ui/src/` (when reusable) or `apps/*/components/` (when app-specific)
  - Types → `packages/shared/src/types/`
  - Services → `packages/shared/src/services/`
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `PetsTable`, `EventCard`)
  - Hooks: `camelCase` with `use` prefix (e.g., `usePetsList`, `useAuth`)
  - Files: Match the export name
- **State Management Hierarchy**:
  1. Local state (`useState`) for UI-only state
  2. Custom hooks for reusable logic
  3. Context for global simple state
  4. Redux Toolkit for complex global state

### Package Naming Convention

All packages use the
`@gastonapp/` scope:

- `@gastonapp/web` -
  Web application
-

`@gastonapp/mobile` -
Mobile application

-

`@gastonapp/shared` -
Shared code

- `@gastonapp/ui` -
  Shared UI
  components
-

`@gastonapp/eslint-config` -
ESLint configuration

-

`@gastonapp/typescript-config` -
TypeScript
configuration

### Testing

The project includes
testing setup with:

- Jest + React
  Testing Library (
  per package)
- Type checking via
  TypeScript
  compiler (
  `pnpm type-check`)

### Path Aliases

#### Web App (apps/web)

- `@/`: Points to
  `apps/web/src/`
  directory
- `@c/`: Points to
  `apps/web/src/components/`
  directory

#### Mobile App (apps/mobile) - Future

- `@/`: Points to
  `apps/mobile/app/`
  directory
- `@components/`:
  Points to
  `apps/mobile/components/`
  directory

### Important Notes

#### Development

- The web app runs
  on port 4480 in
  development
- Uses Vite as the
  build tool with
  React plugin for
  web
- Turborepo caches
  builds for faster
  subsequent builds
- pnpm workspaces
  enable sharing
  code between
  packages

#### Production & Deployment

- Docker multi-stage
  builds for
  optimized
  production images
- Nginx serves the
  built static files
- Deployment scripts
  provided in
  `.deploy/` folder
- See DEPLOYMENT.md
  for detailed
  deployment
  instructions

#### Code Organization

- Extract shared
  code to
  `packages/shared`
  when used by
  multiple apps
- Keep app-specific
  code in respective
  `apps/` folders
- UI components that
  can be shared
  should go in
  `packages/ui`

#### Monorepo Benefits

- **Code Sharing**:
  Types, services,
  and utilities
  shared between web
  and mobile
- **Consistent
  Tooling**: Same
  ESLint,
  TypeScript, and
  Prettier configs
- **Atomic Changes
  **: Update shared
  code and all apps
  in a single commit
- **Faster Builds**:
  Turborepo caches
  and parallelizes
  builds

### Common Development Workflows

#### Adding a New Feature to Web App

1. Create components
   in
   `apps/web/src/components/`
2. Add business
   logic to
   `apps/web/src/services/`
   or
   `packages/shared/src/services/`
3. Update types in
   `apps/web/src/types/`
   or
   `packages/shared/src/types/`
4. Test locally:
   `pnpm dev:web`
5. Run quality
   checks:
   `pnpm lint && pnpm type-check`

#### Adding Shared Code

When code needs to
be shared between
web and mobile:

1. Move types to
   `packages/shared/src/types/`
2. Move services to
   `packages/shared/src/services/`
3. Move utilities to
   `packages/shared/src/utils/`
4. Import from
   `@gastonapp/shared`
   in apps

Example:

```typescript
// In apps/web/src/services/EventService.ts
import {
    EventService
} from '@gastonapp/shared';
```

#### Debugging Build Issues

```bash
# Clean everything and rebuild
pnpm clean
pnpm install
pnpm build

# Check for type errors
pnpm type-check

# Check specific package
pnpm --filter @gastonapp/web type-check
```

#### Working with Environment Variables

1. Copy
   `.env.example` to
   `.env` in
   `apps/web/`
2. Add required
   values
3. Access in code:
   `import.meta.env.VITE_*`
4. Never commit
   `.env` files

#### Deploying Changes

```bash
# Build and test locally
pnpm build:web

# Deploy with Docker
pnpm deploy

# Or deploy to Digital Ocean (see DEPLOYMENT.md)
```

### Additional Resources

#### Project Documentation

- **[Front-End Architecture Guide](docs/technical/front-architecture.md)** - **MUST READ**: Comprehensive guide covering React design patterns, hooks, providers, code organization, and architectural guidelines for all front-end development. This document defines the mandatory patterns and best practices for the mono-repo.

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Detailed deployment instructions

- **[README](README.md)** - Quick start and project overview

- **[Migration Guide](docs/MONOREPO_MIGRATION.md)** - Monorepo migration details

#### External Documentation

- **[Turborepo Docs](https://turbo.build/repo/docs)** - Turborepo documentation

- **[pnpm Docs](https://pnpm.io/)** - pnpm documentation

- **[Expo Docs](https://docs.expo.dev/)** - Expo documentation (for mobile app)
