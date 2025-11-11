# Contributing to GastonApp

Thank you for your interest in contributing to GastonApp! This document provides guidelines and workflows for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

### Expected Behavior

- Be respectful and considerate of different viewpoints
- Provide constructive feedback
- Focus on what is best for the project and community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that would be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 22.3.0 or later
- **pnpm**: 9.0.0 or later
- **Git**: Latest version recommended

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/GastonApp.git
   cd GastonApp
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/fredattack/GastonApp.git
   ```

4. **Enable pnpm**:
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

5. **Install dependencies**:
   ```bash
   pnpm install
   ```

6. **Set up environment variables**:
   ```bash
   cp apps/web/.env.example apps/web/.env
   # Edit apps/web/.env with your configuration
   ```

7. **Start the development server**:
   ```bash
   pnpm dev:web
   ```

8. **Verify the setup**:
   - Visit `http://localhost:4480`
   - Run `pnpm lint` to check code style
   - Run `pnpm type-check` to check TypeScript types

## Development Workflow

### Monorepo Structure

GastonApp uses Turborepo for managing the monorepo. Key locations:

- `apps/web/` - React web application
- `apps/mobile/` - React Native mobile app (future)
- `packages/shared/` - Shared code (types, services, utilities)
- `packages/ui/` - Shared UI components (future)
- `packages/eslint-config/` - Shared ESLint configurations
- `packages/typescript-config/` - Shared TypeScript configurations

### Working with the Monorepo

```bash
# Run commands for all packages
pnpm dev              # Start all apps
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages

# Run commands for specific packages
pnpm --filter @gastonapp/web dev
pnpm --filter @gastonapp/shared build
pnpm --filter @gastonapp/web lint
```

### Adding Dependencies

```bash
# Add to root (monorepo-level dependency)
pnpm add -w <package-name>

# Add to specific workspace
pnpm --filter @gastonapp/web add <package-name>

# Add dev dependency
pnpm --filter @gastonapp/web add -D <package-name>
```

## Git Workflow

We use a **feature branch workflow** with the following conventions:

### Branch Naming

Use descriptive branch names with one of these prefixes:

- `feature/` - New features (e.g., `feature/add-voice-commands`)
- `fix/` - Bug fixes (e.g., `fix/calendar-display-issue`)
- `refactor/` - Code refactoring (e.g., `refactor/event-service`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `test/` - Test additions or updates (e.g., `test/event-service`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Basic Workflow

1. **Keep your fork synchronized**:
   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   git push origin main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write code following our [coding standards](#coding-standards)
   - Add/update tests if applicable
   - Update documentation if needed

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   See [Commit Message Guidelines](#commit-message-guidelines) for format details.

5. **Keep your branch up-to-date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

### Handling Conflicts

If you encounter merge conflicts:

```bash
# Fetch latest changes
git fetch upstream

# Rebase on main
git rebase upstream/main

# Resolve conflicts in your editor
# After resolving, stage the files
git add <resolved-files>

# Continue the rebase
git rebase --continue

# Force push to your branch
git push origin feature/your-feature-name --force-with-lease
```

## Coding Standards

### TypeScript

- Use **TypeScript strict mode** - no `any` types unless absolutely necessary
- Define proper interfaces and types
- Use meaningful variable and function names
- Avoid `@ts-ignore` - fix type errors properly

### Code Style

We use **ESLint** and **Prettier** for code formatting:

```bash
# Check for lint errors
pnpm lint

# Auto-fix lint errors
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Best Practices

1. **Component Structure**:
   - Use functional components with hooks
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use proper TypeScript types for props

2. **File Organization**:
   - Place files in appropriate directories
   - Use PascalCase for component files (e.g., `EventCalendar.tsx`)
   - Use camelCase for utility files (e.g., `dateHelpers.ts`)

3. **Import Order**:
   ```typescript
   // 1. External libraries
   import React from 'react';
   import { useDispatch } from 'react-redux';

   // 2. Internal modules
   import { EventService } from '@/services/EventService';

   // 3. Components
   import { Button } from '@c/Button';

   // 4. Types
   import type { Event } from '@/types';

   // 5. Styles
   import './styles.css';
   ```

4. **Error Handling**:
   - Always handle errors gracefully
   - Provide user-friendly error messages
   - Log errors to Bugsnag in production
   - Use try-catch blocks for async operations

5. **Performance**:
   - Use `React.memo` for expensive components
   - Use `useMemo` and `useCallback` appropriately
   - Implement code splitting for large features
   - Optimize images and assets

## Commit Message Guidelines

We follow the **Conventional Commits** specification for clear and meaningful commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semi-colons, etc.)
- `refactor` - Code refactoring without changing functionality
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates
- `ci` - CI/CD configuration changes
- `build` - Build system or external dependency changes

### Scope (Optional)

The scope should be the area of the codebase affected:

- `web` - Web application
- `mobile` - Mobile application
- `shared` - Shared packages
- `deps` - Dependencies
- Component or feature name

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize the first letter
- No period at the end
- Keep it concise (50 characters or less)

### Examples

```bash
# Feature
git commit -m "feat(calendar): add drag-and-drop event rescheduling"

# Bug fix
git commit -m "fix(pets): resolve pet deletion not updating UI"

# Documentation
git commit -m "docs: update deployment instructions for Digital Ocean"

# Refactoring
git commit -m "refactor(event-service): simplify event creation logic"

# Multiple changes (use body)
git commit -m "feat(voice): add multi-language support

- Add French language support
- Add Spanish language support
- Update voice recognition settings"
```

### Breaking Changes

If your commit introduces breaking changes, add `BREAKING CHANGE:` in the footer:

```bash
git commit -m "feat(api)!: change event API response format

BREAKING CHANGE: Event API now returns ISO date strings instead of Unix timestamps.
Migration guide: Update all date parsing to use ISO format."
```

## Pull Request Process

### Before Creating a PR

1. **Run all quality checks**:
   ```bash
   pnpm lint           # Check for lint errors
   pnpm type-check     # Check TypeScript types
   pnpm build          # Ensure build succeeds
   ```

2. **Test your changes**:
   - Manual testing in the browser
   - Run existing tests (when available)
   - Add new tests for new features

3. **Update documentation**:
   - Update relevant README files
   - Add JSDoc comments to new functions
   - Update CHANGELOG.md (if applicable)

### Creating the PR

1. **Push your branch** to your fork

2. **Create a Pull Request** on GitHub with:
   - **Clear title** following commit message format
   - **Detailed description** explaining:
     - What changes were made
     - Why the changes were necessary
     - Any breaking changes or migration steps
     - Screenshots (if UI changes)
   - **Reference related issues** (e.g., "Closes #123")

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix (non-breaking change that fixes an issue)
   - [ ] New feature (non-breaking change that adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe the tests you ran

   ## Checklist
   - [ ] My code follows the project's coding standards
   - [ ] I have performed a self-review of my code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have updated the documentation accordingly
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] New and existing tests pass locally

   ## Screenshots (if applicable)
   Add screenshots here
   ```

### PR Review Process

1. **Automated checks** will run (linting, type checking, build)
2. **Code review** by maintainers
3. **Address feedback** by pushing new commits
4. **Approval** and merge by maintainers

### After Your PR is Merged

1. **Delete your feature branch**:
   ```bash
   git checkout main
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**:
   ```bash
   git pull upstream main
   git push origin main
   ```

## Testing

### Running Tests

```bash
# Run all tests (when implemented)
pnpm test

# Run tests for specific package
pnpm --filter @gastonapp/web test

# Run tests in watch mode
pnpm --filter @gastonapp/web test:watch

# Run tests with coverage
pnpm --filter @gastonapp/web test:coverage
```

### Writing Tests

- Write tests for new features and bug fixes
- Aim for meaningful test coverage, not just high percentages
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### Test Organization

```typescript
describe('EventService', () => {
  describe('createEvent', () => {
    it('should create a new event with valid data', () => {
      // Arrange
      const eventData = { ... };

      // Act
      const result = eventService.createEvent(eventData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
    });

    it('should throw an error with invalid data', () => {
      // Test error cases
    });
  });
});
```

## Documentation

### Code Documentation

- Add **JSDoc comments** to all public functions and classes
- Document complex algorithms and business logic
- Keep comments up-to-date with code changes

### JSDoc Example

```typescript
/**
 * Creates a new recurring event for a pet.
 *
 * @param eventData - The event data including pet ID, type, and schedule
 * @param recurrence - Optional recurrence pattern for the event
 * @returns A promise that resolves to the created event
 * @throws {ValidationError} If the event data is invalid
 * @throws {NotFoundError} If the specified pet doesn't exist
 *
 * @example
 * ```typescript
 * const event = await createEvent({
 *   petId: '123',
 *   type: 'feeding',
 *   time: '08:00'
 * }, {
 *   frequency: 'daily'
 * });
 * ```
 */
async function createEvent(
  eventData: EventData,
  recurrence?: RecurrencePattern
): Promise<Event> {
  // Implementation
}
```

### Documentation Files

When making changes that affect:

- **README.md** - Update project overview, features, or quick start
- **CLAUDE.md** - Update developer guide, architecture, or workflows
- **DEPLOYMENT.md** - Update deployment instructions
- **CHANGELOG.md** - Add entry for notable changes

## Getting Help

### Resources

- **Documentation**: See [README.md](README.md), [CLAUDE.md](CLAUDE.md), and [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Check [GitHub Issues](https://github.com/fredattack/GastonApp/issues) for known problems
- **Discussions**: Ask questions in GitHub Discussions (if enabled)

### Asking Questions

When asking for help:

1. **Search first** - Check if your question has been answered
2. **Be specific** - Provide context, error messages, and steps to reproduce
3. **Share code** - Use code blocks and include relevant snippets
4. **Be patient** - Maintainers are volunteers

### Reporting Bugs

When reporting bugs, include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs **actual behavior**
4. **Environment details** (OS, Node version, browser)
5. **Screenshots or error logs** if applicable
6. **Possible solution** if you have ideas

### Suggesting Features

When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Explain the use case** and problem it solves
3. **Describe the proposed solution**
4. **Consider alternatives** you've thought about
5. **Be open to discussion** and feedback

## License

By contributing to GastonApp, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to GastonApp! Your efforts help make pet care management better for everyone.

**Questions?** Open an issue or reach out to the maintainers.

**Happy coding!**
