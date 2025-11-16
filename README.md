# GastonApp - Multi-Platform Pet Management

<div align="center">

<!-- Logo: Replace with actual logo when available -->
<!-- ![GastonApp Logo](./assets/logo.png) -->

**AI-Powered Pet
Care Management
Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## Overview

GastonApp is a *
*Turborepo-based
monorepo**
containing a
comprehensive pet
management platform
with:

- **Web Application
  ** (React + Vite +
  TypeScript)
- **Mobile
  Application** (
  React Native +
  Expo) - *Coming
  Soon*
- **AI Integration
  ** (OpenAI GPT-4)
- **Shared Code**
  across platforms

## Features

- **Pet Profile
  Management** -
  Track multiple
  pets with detailed
  information
- **Event Scheduling
  ** - Create
  recurring events
  for feeding,
  medications, vet
  visits
- **Voice Assistant
  ** - AI-powered
  voice commands for
  hands-free
  management
- **Calendar
  Integration** -
  Visual calendar
  for all
  pet-related events
- **Multi-language
  Support** -
  Available in
  multiple
  languages (
  i18next)
- **Dark Mode** -
  Beautiful UI with
  light and dark
  themes
- **Analytics** -
  Track pet care
  patterns and
  insights

## Monorepo Structure

```
GastonApp/
├── apps/
│   ├── web/                    # React web application
│   └── mobile/                 # React Native Expo app (future)
├── packages/
│   ├── shared/                 # Shared code (types, services, utils)
│   ├── ui/                     # Shared UI components (future)
│   ├── eslint-config/          # ESLint configurations
│   └── typescript-config/      # TypeScript configurations
└── .deploy/                    # Deployment configs (Docker, Nginx)
```

## Quick Start

### Prerequisites

- **Node.js**:
  22.3.0 or later
- **pnpm**: 9.0.0 or
  later
- **Git**: For
  version control

### Installation

```bash
# Clone the repository
git clone https://github.com/fredattack/GastonApp.git
cd GastonApp

# Enable pnpm (if not already enabled)
corepack enable
corepack prepare pnpm@latest --activate

# Install all dependencies
pnpm install

# Start the web app in development mode
pnpm dev:web
```

The web app will be
available at
`http://localhost:4480`

## Available Commands

### Development

```bash
pnpm dev              # Run all apps in dev mode
pnpm dev:web          # Run web app only
pnpm dev:mobile       # Run mobile app only (future)
```

### Building

```bash
pnpm build            # Build all apps
pnpm build:web        # Build web app only
```

### Quality Checks

```bash
pnpm lint             # Lint all packages
pnpm lint:fix         # Lint and auto-fix issues
pnpm type-check       # Type check all packages
pnpm format           # Format code with Prettier
```

### Deployment

```bash
pnpm deploy           # Deploy with Docker
pnpm docker:build     # Build Docker image
pnpm docker:up        # Start containers
pnpm docker:down      # Stop containers
```

## Tech Stack

### Web Application

- **Framework**:
  React 18
- **Build Tool**:
  Vite
- **Language**:
  TypeScript
- **UI Library**:
  Mantine v5
- **Styling**:
  Tailwind CSS
- **State Management
  **: Redux Toolkit
- **Backend**:
  Firebase (Auth,
  Firestore,
  Storage)
- **AI**: OpenAI
  GPT-4
- **i18n**: i18next

### Mobile Application (Future)

- **Framework**:
  React Native
- **Platform**: Expo
- **Navigation**:
  Expo Router
- **Shared Code**:
  @gastonapp/shared

### Infrastructure

- **Monorepo**:
  Turborepo
- **Package Manager
  **: pnpm with
  workspaces
- **Deployment**:
  Docker + Nginx
- **CI/CD**: GitHub
  Actions (future)

## Documentation

-
    *
*[Deployment Guide](docs/DEPLOYMENT.md)
** - Detailed
deployment
instructions
-
    *
*[Developer Guide](CLAUDE.md)
** - Project
architecture and
conventions
-
    *
*[Product Strategy](docs/PRODUCT_STRATEGY_ANALYSIS.md)
** - Product
roadmap and
strategy
-
    *
*[MVP Definition](docs/MVP_DEFINITION.md)
** - Core features
and priorities
-
    *
*[Go-to-Market Strategy](docs/GO_TO_MARKET_STRATEGY.md)
** - Marketing and
launch strategy
-
    *
*[Monorepo Migration](docs/MONOREPO_MIGRATION.md)
** - Migration
summary and guide

## Applications

### Web App (

`apps/web`)

React + Vite
application for
desktop and mobile
browsers.

**Key Features:**

- Pet profile
  management
- Event scheduling
  with recurrence
- Voice-activated AI
  assistant
- Calendar
  visualization
- Multi-language
  support

**Development:**

```bash
cd apps/web
pnpm dev
```

### Mobile App (

`apps/mobile`)

React Native + Expo
application for iOS
and Android. *(Under
Development)*

**Development:**

```bash
cd apps/mobile
pnpm start
```

## Packages

###

`@gastonapp/shared`

Shared code used by
both web and mobile
apps:

- TypeScript type
  definitions
- Business logic
  services
- Data repository
  layer
- Utility functions

###

`@gastonapp/ui` (
Future)

Shared UI components
compatible with
React and React
Native.

###

`@gastonapp/eslint-config`

ESLint
configurations for
consistent code
style:

- `react.js` - For
  React web apps
-

`react-native.js` -
For React Native
mobile apps

###

`@gastonapp/typescript-config`

TypeScript
configurations:

- `base.json` - Base
  config
- `react.json` - For
  React apps
-

`react-native.json` -
For React Native
apps

## Deployment

### Docker (Recommended)

```bash
# Quick deploy
pnpm deploy

# Or manually
docker-compose -f .deploy/docker-compose.yml up -d
```

### Digital Ocean

See [DEPLOYMENT.md](docs/DEPLOYMENT.md)
for detailed
instructions on:

- App Platform
  deployment
- Droplet deployment
- Container Registry
  deployment
- SSL configuration

## Contributing

We welcome
contributions!
Please follow these
steps:

1. Fork the
   repository
2. Create a feature
   branch (
   `git checkout -b feature/amazing-feature`)
3. Commit your
   changes (
   `git commit -m 'Add amazing feature'`)
4. Push to the
   branch (
   `git push origin feature/amazing-feature`)
5. Open a Pull
   Request

### Development Guidelines

- Follow TypeScript
  strict mode
- Use ESLint and
  Prettier for code
  formatting
- Write meaningful
  commit messages
- Add tests for new
  features
- Update
  documentation as
  needed

## Environment Variables

Create `.env` files
in the appropriate
locations:

**Web App** (
`apps/web/.env`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_key
VITE_API_URL=your_backend_url
```

> **Note**: Never
> commit `.env`
> files
> to version
> control.
> They are included
> in
`.gitignore`.

## License

This project is
licensed under the
MIT License - see
the LICENSE file for
details.

## Team

Created with care by
the GastonApp Team

## Contact

- **GitHub
  **: [@fredattack](https://github.com/fredattack)
- **Issues
  **: [GitHub Issues](https://github.com/fredattack/GastonApp/issues)

---

<div align="center">

*

*[⬆ Back to top](#gastonapp---multi-platform-pet-management)
**

Made with
TypeScript, React,
and lots of ☕

</div>
