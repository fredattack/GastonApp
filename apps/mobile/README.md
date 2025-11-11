# GastonApp Mobile

This is the React Native Expo app for GastonApp.

## Getting Started

### Prerequisites
- Node.js 22.3.0 or later
- pnpm installed
- Expo CLI (will be installed with dependencies)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

From the monorepo root:
```bash
pnpm install
```

### Development

Start the Expo development server:
```bash
cd apps/mobile
pnpm start
```

Or from the root:
```bash
pnpm --filter @gastonapp/mobile start
```

### Available Commands

- `pnpm start` - Start Expo development server
- `pnpm android` - Start on Android emulator
- `pnpm ios` - Start on iOS simulator
- `pnpm web` - Start on web browser
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check

## Shared Code

This app uses shared packages from the monorepo:
- `@gastonapp/shared` - Shared types, services, and utilities
- `@gastonapp/ui` - Shared UI components (future)

## Next Steps

1. Configure Firebase for React Native
2. Implement authentication flow
3. Add pet management screens
4. Integrate AI voice assistant
5. Add event management features
