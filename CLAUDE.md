# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GastonApp is a **Turborepo-based monorepo** containing multiple applications for pet event management and scheduling. The monorepo includes a React TypeScript web application and is prepared for a future React Native Expo mobile app. All apps share common code through workspace packages.

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
- **Frontend**: React 18 + TypeScript + Vite
- **UI Libraries**: Mantine v5, Tailwind CSS, FontAwesome icons
- **State Management**: Redux Toolkit
- **Backend**: Firebase (auth, firestore, storage)
- **AI Integration**: OpenAI API
- **Internationalization**: i18next
- **Error Tracking**: Bugsnag

#### Mobile App (apps/mobile) - Future
- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **Shared Code**: Uses @gastonapp/shared package

#### Shared Infrastructure
- **Monorepo**: Turborepo for build orchestration
- **Package Manager**: pnpm with workspaces
- **Deployment**: Docker + Nginx for production

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
├── repository/        # Data access layer (Firebase, REST APIs)
├── hooks/             # Custom React hooks
├── store/             # Redux store configuration
├── router/            # App routing configuration
├── types/             # TypeScript type definitions
└── enums/             # TypeScript enums
```

### Shared Packages

#### @gastonapp/shared
Contains code shared between web and mobile apps:
- **types/**: Shared TypeScript type definitions
- **services/**: Business logic (EventService, ModelService, OpenAIService)
- **repository/**: Data access layer (FirebaseRepository, REST repositories)
- **utils/**: Shared utility functions

#### @gastonapp/ui (Future)
Will contain shared UI components usable in both web and mobile apps.

#### @gastonapp/eslint-config
Shared ESLint configurations:
- `react.js`: For React web apps
- `react-native.js`: For React Native mobile apps

#### @gastonapp/typescript-config
Shared TypeScript configurations:
- `base.json`: Base configuration
- `react.json`: For React apps
- `react-native.json`: For React Native apps

### Data Layer Architecture

The app uses a repository pattern for data access:

- **FirebaseRepository**: Handles Firebase operations (in @gastonapp/shared)
- **RestEventRepository**: Manages event data via REST APIs
- **RestModelRepository**: Manages pet data via REST APIs
- **EventService**: Business logic for event operations
- **ModelService**: Business logic for pet/model operations
- **OpenAIService**: AI integration for enhanced features

### Context Providers (Web App)

- **EventsProvider**: Manages event state across the app (apps/web/src/contexts/EventsContext.tsx)
- **PetsProvider**: Manages pet data state (apps/web/src/contexts/PetsContext.tsx)
- **GlobalProvider**: App-wide state management

### Key Features

1. **Event Management**: Create, update, delete events with recurrence patterns
2. **Pet Management**: CRUD operations for pets with detailed information
3. **Calendar Integration**: Event scheduling and visualization
4. **AI Features**: OpenAI integration for enhanced user experience
5. **Multi-language Support**: i18next with multiple locales
6. **Voice Recording**: Speech recognition and processing features
7. **Multi-platform Ready**: Shared code enables future mobile app

### Environment Configuration

#### Web App (apps/web/.env)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
VITE_API_URL=
```

Environment variables are loaded via Vite's import.meta.env system.

### Code Conventions

- Use TypeScript strict mode
- Follow ESLint Airbnb configuration
- Use Prettier for code formatting
- Component file naming: PascalCase with .tsx extension
- Use functional components with React hooks
- Context providers follow the pattern: Provider + custom hook
- Repository pattern for data access abstraction
- Shared code should be placed in packages/ when used by multiple apps

### Package Naming Convention

All packages use the `@gastonapp/` scope:
- `@gastonapp/web` - Web application
- `@gastonapp/mobile` - Mobile application
- `@gastonapp/shared` - Shared code
- `@gastonapp/ui` - Shared UI components
- `@gastonapp/eslint-config` - ESLint configuration
- `@gastonapp/typescript-config` - TypeScript configuration

### Testing

The project includes testing setup with:
- Jest + React Testing Library (per package)
- Type checking via TypeScript compiler (`pnpm type-check`)

### Path Aliases

#### Web App (apps/web)
- `@/`: Points to `apps/web/src/` directory
- `@c/`: Points to `apps/web/src/components/` directory

#### Mobile App (apps/mobile) - Future
- `@/`: Points to `apps/mobile/app/` directory
- `@components/`: Points to `apps/mobile/components/` directory

### Important Notes

#### Development
- The web app runs on port 4480 in development
- Uses Vite as the build tool with React plugin for web
- Turborepo caches builds for faster subsequent builds
- pnpm workspaces enable sharing code between packages

#### Production & Deployment
- Docker multi-stage builds for optimized production images
- Nginx serves the built static files
- Deployment scripts provided in `.deploy/` folder
- See DEPLOYMENT.md for detailed deployment instructions

#### Code Organization
- Extract shared code to `packages/shared` when used by multiple apps
- Keep app-specific code in respective `apps/` folders
- UI components that can be shared should go in `packages/ui`

#### Monorepo Benefits
- **Code Sharing**: Types, services, and utilities shared between web and mobile
- **Consistent Tooling**: Same ESLint, TypeScript, and Prettier configs
- **Atomic Changes**: Update shared code and all apps in a single commit
- **Faster Builds**: Turborepo caches and parallelizes builds

### Additional Resources

- **Deployment Guide**: See DEPLOYMENT.md for detailed deployment instructions
- **Turborepo Docs**: https://turbo.build/repo/docs
- **pnpm Docs**: https://pnpm.io/
- **Expo Docs** (for mobile app): https://docs.expo.dev/
