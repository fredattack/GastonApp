# Changelog - @gastonapp/ui

All notable changes to the GastonApp UI component library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-17

### Added - Phase 1: Design Tokens + Base Components

#### Design Tokens
- **design-tokens.css**: Complete CSS custom properties for the entire design system
  - Color tokens (primary, secondary, lin, accent, semantic, text)
  - Spacing tokens (4px → 128px scale)
  - Typography tokens (Nunito font family, sizes, weights, line-heights)
  - Border radius tokens (xs → full)
  - Shadow tokens (tinted eucalyptus soft shadows)
  - State tokens (hover, pressed, focus, disabled)
  - Animation tokens (durations, easings, transitions)
  - Z-index scale (dropdown → maximum)
  - Opacity tokens
  - Icon size tokens
  - Accessibility tokens (touch targets)
  - Breakpoints (xs → 2xl)

#### Components

##### Button
- Pill-shaped button component following design system
- **Variants**: `primary` (black), `secondary` (white + border), `ghost` (transparent)
- **Sizes**: `sm` (40px), `md` (48px), `lg` (56px)
- **States**: default, hover, pressed, focus, disabled, loading
- **Features**:
  - Icon support (left/right position)
  - Loading spinner animation
  - Full width option
  - forwardRef support
  - Accessibility: WCAG AA compliant, keyboard navigation, ARIA attributes
  - Touch targets: minimum 48px

##### Card
- Flexible container component with multiple variants
- **Variants**: `standard`, `glass` (glassmorphism), `gradient`
- **Gradient colors**: mint-lavender, mint-white, activity-purple, activity-yellow, activity-coral
- **Padding**: `none`, `sm`, `md`, `lg`
- **Shadow**: `none`, `sm`, `md`, `lg`
- **Border Radius**: `md`, `lg`, `xl`, `2xl`
- **Features**:
  - Interactive (clickable) mode with hover effects
  - Keyboard navigation (Enter/Space)
  - forwardRef support
  - Accessibility: role="button" when clickable, keyboard support

##### Icon
- Type-safe wrapper for @phosphor-icons/react
- **Sizes**: `xs` (16px), `sm` (20px), `md` (24px), `lg` (32px), `xl` (40px), `2xl` (48px)
- **Weights**: `regular`, `bold`
- **Features**:
  - Design system size mapping
  - Custom color support
  - currentColor default for flexibility

##### Badge
- Pill-shaped badge for status and labels
- **Variants**: `success`, `warning`, `error`, `info`, `neutral`
- **Sizes**: `sm`, `md`
- **Features**:
  - Pill shape (border-radius: 9999px)
  - Uppercase text with letter-spacing
  - Semantic color system
  - High contrast mode support

##### Avatar
- Circular avatar component with fallbacks
- **Sizes**: `sm` (32px), `md` (40px), `lg` (56px), `xl` (80px)
- **Features**:
  - Image support with error handling
  - Initials fallback
  - Generic placeholder icon
  - Custom fallback color
  - Lazy loading with fade-in animation
  - forwardRef support
  - Accessibility: role="img", descriptive alt text

#### Dependencies
- Added `@phosphor-icons/react` ^2.1.10

#### Documentation
- README.md with component API and usage
- USAGE_EXAMPLES.md with comprehensive examples for all components
- CHANGELOG.md (this file)

#### Development
- TypeScript strict mode configuration
- Build scripts (tsc)
- Type checking scripts
- ESLint configuration

### Design System Compliance
- All components follow GastonApp design system specifications
- Colors: Eucalyptus green (#8FA998), Golden honey (#D4A574), Natural linen (#F4F1E8)
- Typography: Nunito font family exclusive
- Shadows: Tinted eucalyptus (never black)
- Border radius: Pill-shaped buttons, rounded cards (20px)
- Accessibility: WCAG AA minimum, 48px touch targets, 3px focus rings

### Architecture
- Presentational components only (no business logic)
- TypeScript strict mode with full type safety
- CSS Modules for scoped styling
- forwardRef support for all components
- Accessibility-first approach

---

## Future Releases

### Planned for v1.1.0
- Input component (text, email, password variants)
- Textarea component
- Select/Dropdown component
- Checkbox component
- Radio component
- Switch/Toggle component

### Planned for v1.2.0
- Modal component
- Drawer component
- Tooltip component
- Popover component
- Alert/Notification component

### Planned for v1.3.0
- Table component
- List components
- Pagination component
- Tabs component
- Accordion component

### Planned for v2.0.0
- Dark mode support
- Theme customization API
- Animation presets
- Storybook integration
- Visual regression testing

---

## Version History

| Version | Date       | Description                          |
|---------|------------|--------------------------------------|
| 1.0.0   | 2025-11-17 | Phase 1: Design Tokens + Base Components |

---

**Maintained by**: GastonApp Frontend Team
**Reference**: `/design-system/home-page-specifications.md`
