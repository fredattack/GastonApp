# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Documentation
- Comprehensive project documentation improvements and standardization
- French translation of product strategy analysis
- Go-to-market strategy, MVP definition, and product roadmap documents
- Comprehensive TODO.md roadmap for future development
- CONTRIBUTING.md with development workflows and coding standards
- .env.example with detailed environment variable descriptions
- CHANGELOG.md to track version history

#### Features
- Multi-language support for speech recognition
- Event completion toggle functionality
- Event display settings with view mode options
- Action dropdown menu for event cards
- Enhanced pet details and event handling logic
- Speech recognition with transcription handling and recording controls
- Axios client with error handling and Bugsnag integration
- Bugsnag error tracking and performance monitoring
- Multiple pet selection in event forms
- Dynamic prompt handling for voice assistant

#### UI/UX Improvements
- New GAS branding logos and favicons
- Enhanced event card UI with dropdown menus
- Event highlighting based on completion status
- DisplaySettingsDropdown component for calendar views
- Improved pet list component display
- Updated event card layouts and grouped event summaries

### Changed

#### Refactoring
- **MAJOR**: Transformed project into Turborepo monorepo with multi-app support
- Improved AI message card with pet lookup logic and fallback to eventPet
- Removed unused Firebase repository classes
- Extracted EventTable component and simplified grouping logic
- Split EventForm into reusable components with updated UI styles
- Streamlined imports and optimized pet handling logic
- Removed unused VoiceModulation import from ActionModal
- Updated function parameters to support number or string IDs
- Simplified state reducers and locale/toggle logic
- Replaced hardcoded authId with placeholder value
- Unified code style and improved consistency across codebase
- Cleaned up EventService code
- Unified axios client usage and removed redundant setup
- Renamed SpeechButton to CTAButton for better semantics
- Improved Tailwind configs and layout updates

#### Development
- Added Prettier integration for code formatting
- Improved linting setup
- Updated deploy workflow and TypeScript configuration
- Updated comments formatting and optimized variable declarations

### Fixed

- Correct app name typo and formatting improvements
- Fixed import path case sensitivity in ModelService
- Ensured correct formatting for pet names and date/time in EventCard

### Removed

- Unused Firebase repository classes
- Unused VoiceModulation component
- Hardcoded authentication IDs
- Commented-out code and redundant logic

---

## Version History

### Version 0.1.0 - Initial Development (Pre-Release)

The project is currently in active development. This changelog documents ongoing changes leading up to the first official release.

#### Core Features Implemented

- **Pet Management**
  - Create, read, update, delete pet profiles
  - Store detailed pet information (name, breed, age, medical history)
  - Upload and manage pet photos
  - Track multiple pets per account

- **Event Scheduling**
  - Create events for feeding, medication, vet visits, and more
  - Recurring event support (daily, weekly, monthly)
  - Event completion tracking
  - Calendar visualization of events
  - Event grouping and filtering

- **AI Integration**
  - Voice-activated assistant for hands-free management
  - AI-powered event suggestions
  - Natural language processing for event creation
  - Speech recognition and transcription

- **User Interface**
  - Dark mode and light mode themes
  - Responsive design for mobile and desktop
  - Multi-language support (i18next)
  - Intuitive calendar views
  - Modal-based workflows

- **Technical Infrastructure**
  - Turborepo monorepo architecture
  - React 18 + TypeScript + Vite
  - Firebase backend (Auth, Firestore, Storage)
  - Redux Toolkit for state management
  - Mantine v5 UI library
  - Tailwind CSS for styling
  - Bugsnag error tracking
  - Docker deployment support

---

## Upgrade Guide

### Monorepo Migration (November 2025)

The project was transformed from a single-app structure to a Turborepo monorepo. If you have a local development environment from before this migration:

1. **Clean your local environment**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   ```

2. **Enable pnpm**:
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

3. **Install dependencies with pnpm**:
   ```bash
   pnpm install
   ```

4. **Update your scripts**:
   - Use `pnpm dev:web` instead of `npm run dev`
   - Use `pnpm build:web` instead of `npm run build`
   - See [README.md](README.md) for all available commands

5. **Environment variables**:
   - Copy `apps/web/.env.example` to `apps/web/.env`
   - Update with your configuration

For more details, see [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md).

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

---

## Links

- **Repository**: [https://github.com/fredattack/GastonApp](https://github.com/fredattack/GastonApp)
- **Issues**: [https://github.com/fredattack/GastonApp/issues](https://github.com/fredattack/GastonApp/issues)
- **Documentation**: See [README.md](README.md) and [CLAUDE.md](CLAUDE.md)

---

**Note**: This project is under active development. Features and APIs may change before the first stable release.

[Unreleased]: https://github.com/fredattack/GastonApp/compare/HEAD
