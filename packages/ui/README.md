# @gastonapp/ui

Shared UI component library for GastonApp monorepo. Contains presentational components following the GastonApp design system.

## Installation

This package is part of the GastonApp monorepo and uses pnpm workspaces.

```bash
# Install dependencies from project root
pnpm install
```

## Usage

### Import Components

```tsx
import { Button, Card, Icon, Badge, Avatar } from '@gastonapp/ui';
import { Heart, Dog } from '@phosphor-icons/react';
```

### Import Design Tokens CSS

Import the design tokens CSS in your app's entry point:

```tsx
// apps/web/src/main.tsx
import '@gastonapp/ui/dist/styles/design-tokens.css';
```

## Components

### Button

Pill-shaped button with variants, sizes, icons, and loading states.

**Variants:** `primary`, `secondary`, `ghost`
**Sizes:** `sm` (40px), `md` (48px), `lg` (56px)

```tsx
<Button variant="primary" size="md">
  Click Me
</Button>

<Button variant="secondary" icon={<Heart />} iconPosition="left">
  Like
</Button>

<Button loading variant="primary">
  Saving...
</Button>
```

### Card

Flexible container component with multiple variants.

**Variants:** `standard`, `glass`, `gradient`
**Padding:** `none`, `sm`, `md`, `lg`
**Shadow:** `none`, `sm`, `md`, `lg`
**Border Radius:** `md`, `lg`, `xl`, `2xl`

```tsx
<Card variant="standard" padding="lg" shadow="md">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

<Card variant="glass" borderRadius="2xl" hoverable>
  Glassmorphism effect
</Card>

<Card variant="gradient" gradient="mint-lavender">
  Gradient background
</Card>
```

### Icon

Type-safe wrapper for @phosphor-icons/react with design system size tokens.

**Sizes:** `xs` (16px), `sm` (20px), `md` (24px), `lg` (32px), `xl` (40px), `2xl` (48px)
**Weights:** `regular`, `bold`

```tsx
import { Dog, CalendarPlus } from '@phosphor-icons/react';

<Icon icon={Dog} size="lg" weight="bold" />
<Icon icon={CalendarPlus} size="md" color="var(--color-primary-400)" />
```

### Badge

Pill-shaped badge for status indicators and labels.

**Variants:** `success`, `warning`, `error`, `info`, `neutral`
**Sizes:** `sm`, `md`

```tsx
<Badge variant="success">PAID</Badge>
<Badge variant="warning" size="sm">PENDING</Badge>
<Badge variant="error">OVERDUE</Badge>
```

### Avatar

Circular avatar component with image, initials fallback, and placeholder.

**Sizes:** `sm` (32px), `md` (40px), `lg` (56px), `xl` (80px)

```tsx
<Avatar
  src="/pets/max.jpg"
  alt="Max the dog"
  size="md"
/>

<Avatar
  alt="Luna the cat"
  initials="LN"
  size="lg"
  fallbackColor="var(--color-lavender-light)"
/>
```

## Design Tokens

All components use CSS custom properties from the design system:

- **Colors:** `--color-primary-400`, `--color-secondary-400`, `--color-lin-2`, etc.
- **Spacing:** `--spacing-4`, `--spacing-8`, ..., `--spacing-128`
- **Typography:** `--font-family-base`, `--font-size-h1`, `--font-weight-bold`
- **Border Radius:** `--radius-xs`, `--radius-md`, `--radius-full`
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- **Transitions:** `--transition-fast`, `--transition-normal`
- **Z-index:** `--z-modal`, `--z-tooltip`, etc.

See `/design-system/00-design-tokens.md` for full reference.

## Development

```bash
# Type check
pnpm type-check

# Build
pnpm build

# Clean
pnpm clean

# Lint
pnpm lint
```

## Architecture

- **Presentational components only** - No business logic, no data fetching
- **TypeScript strict mode** - Full type safety
- **CSS Modules** - Scoped styles, no global pollution
- **Accessible** - WCAG AA compliant, keyboard navigation, ARIA attributes
- **Responsive** - Mobile-first design with design system breakpoints

## Guidelines

### Component Props

- All props interfaces extend native HTML attributes when applicable
- Props are destructured with defaults
- Required props are clearly marked in JSDoc

### Styling

- Use CSS custom properties (design tokens) for all values
- Never hardcode colors, spacing, or typography
- Follow BEM-like naming: `gaston-button`, `gaston-button--primary`, `gaston-button__icon`

### Accessibility

- All interactive elements have minimum 48px touch targets
- Focus indicators visible (3px eucalyptus ring)
- ARIA attributes for screen readers
- Keyboard navigation support (Enter, Space, Escape, Arrows)
- Semantic HTML (button, not div with onClick)

## References

- [Design System](../../design-system/)
- [Front Architecture](../../docs/technical/front-architecture.md)
- [Home Page Specifications](../../design-system/home-page-specifications.md)
- [Phosphor Icons](https://phosphoricons.com/)

## Version

**1.0.0** - Phase 1 Base Components (2025-11-17)
