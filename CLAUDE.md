# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GastonApp is a React TypeScript application for pet event management and scheduling. The app allows users to manage pets, create and track events, and includes AI-powered features through OpenAI integration.

## Development Commands

```bash
# Development server (port 4480)
npm run dev

# Build for production
npm run build

# Lint and fix code
npm run lint

# Format code with Prettier
npm run format

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Libraries**: Mantine v5, Tailwind CSS, FontAwesome icons
- **State Management**: Redux Toolkit
- **Backend**: Firebase (auth, firestore, storage)
- **AI Integration**: OpenAI API
- **Internationalization**: i18next
- **Error Tracking**: Bugsnag

### Key Directory Structure

```
src/
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

### Data Layer Architecture

The app uses a repository pattern for data access:

- **FirebaseRepository**: Handles Firebase operations
- **RestEventRepository**: Manages event data via REST APIs
- **RestModelRepository**: Manages pet data via REST APIs
- **EventService**: Business logic for event operations
- **ModelService**: Business logic for pet/model operations
- **OpenAIService**: AI integration for enhanced features

### Context Providers

- **EventsProvider**: Manages event state across the app (src/contexts/EventsContext.tsx)
- **PetsProvider**: Manages pet data state (src/contexts/PetsContext.tsx)
- **GlobalProvider**: App-wide state management

### Key Features

1. **Event Management**: Create, update, delete events with recurrence patterns
2. **Pet Management**: CRUD operations for pets with detailed information
3. **Calendar Integration**: Event scheduling and visualization
4. **AI Features**: OpenAI integration for enhanced user experience
5. **Multi-language Support**: i18next with multiple locales
6. **Voice Recording**: Speech recognition and processing features

### Environment Configuration

The app requires these environment variables:
- Firebase configuration (VITE_FIREBASE_*)
- OpenAI API configuration
- Other service-specific variables

Environment variables are loaded via Vite's import.meta.env system.

### Code Conventions

- Use TypeScript strict mode
- Follow ESLint Airbnb configuration
- Use Prettier for code formatting
- Component file naming: PascalCase with .tsx extension
- Use functional components with React hooks
- Context providers follow the pattern: Provider + custom hook
- Repository pattern for data access abstraction

### Testing

The project includes testing setup with:
- Jest + React Testing Library
- Type checking via TypeScript compiler

### Path Aliases

- `@/`: Points to `src/` directory
- `@c/`: Points to `src/components/` directory

### Important Notes

- The app runs on port 4480 in development
- Uses Vite as the build tool with React plugin
- Implements error boundaries via Bugsnag
- Supports both light and dark themes via Redux store
- Uses Husky for git hooks with lint-staged