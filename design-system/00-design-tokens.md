# Design Tokens
## GastonApp Design System - Foundation Layer

Design tokens are the atomic design decisions that form the foundation of the GastonApp design system. They ensure consistency across web, mobile, and landing page applications.

---

## Color Tokens

### Brand Colors

```css
--color-primary-base: #8FA998;           /* Eucalyptus green - Primary accent */
--color-secondary-base: #D4A574;         /* Golden honey - Secondary accent */
--color-background-base: #F4F1E8;        /* Natural linen - Base background */
```

### Primary Palette (Eucalyptus Green)

```css
--color-primary-50: #F4F7F5;             /* Lightest tint */
--color-primary-100: #E3EBE7;
--color-primary-200: #C7D7CF;
--color-primary-300: #ABC3B7;
--color-primary-400: #8FA998;            /* Base */
--color-primary-500: #7A9383;
--color-primary-600: #657A6D;
--color-primary-700: #506158;
--color-primary-800: #3B4842;
--color-primary-900: #262F2C;            /* Darkest shade */
```

### Secondary Palette (Golden Honey)

```css
--color-secondary-50: #FAF6F1;
--color-secondary-100: #F2E8DC;
--color-secondary-200: #E8D4BA;
--color-secondary-300: #DEC097;
--color-secondary-400: #D4A574;          /* Base */
--color-secondary-500: #C18E5F;
--color-secondary-600: #A97649;
--color-secondary-700: #8B6039;
--color-secondary-800: #6D4A2A;
--color-secondary-900: #4F341C;
```

### Background Scale (Lin Naturel - 10 Levels)

All background colors maintain warmth and organic feel, never drifting to blue/grey tech tones.

```css
--color-lin-0: #FDFCFA;                  /* Ultra light, almost white */
--color-lin-1: #F9F7F4;                  /* Very light cream */
--color-lin-2: #F4F1E8;                  /* Base - Natural linen */
--color-lin-3: #EFEADC;                  /* Soft warm beige */
--color-lin-4: #E9E3D0;                  /* Light warm sand */
--color-lin-5: #E0D8C3;                  /* Medium warm sand */
--color-lin-6: #D6CBB5;                  /* Deeper beige */
--color-lin-7: #C8BDA6;                  /* Warm tan */
--color-lin-8: #B9AD96;                  /* Darker warm tan */
--color-lin-9: #A99D85;                  /* Darkest acceptable warm tone */
```

### Accent Colors (From Reference Images)

```css
--color-mint-light: #B8F4DC;             /* Soft mint green */
--color-mint-base: #7CEDC3;              /* Vibrant mint */
--color-mint-dark: #4FD1A1;

--color-lavender-light: #E8D9F5;         /* Soft lavender */
--color-lavender-base: #D1B3E8;          /* Medium lavender */
--color-lavender-dark: #B98DD9;

--color-yellow-light: #FFF9CC;           /* Pastel yellow */
--color-yellow-base: #FFE88C;            /* Credits yellow */
--color-yellow-dark: #FFD84D;

--color-coral-light: #FFD4C4;            /* Soft coral */
--color-coral-base: #FFB59A;             /* Medium coral */
--color-coral-dark: #FF9670;

--color-paid-green: #7CEDC3;             /* "Paid" status card */
--color-credits-yellow: #FFE88C;         /* "Credits" status card */
```

### Semantic Colors

```css
--color-success-light: #D4F4E7;
--color-success-base: #7CEDC3;           /* Matches mint accent */
--color-success-dark: #4FD1A1;

--color-warning-light: #FFF4D9;
--color-warning-base: #FFD84D;
--color-warning-dark: #FFBB1A;

--color-error-light: #FFE5E5;
--color-error-base: #FF6B6B;
--color-error-dark: #E54545;

--color-info-light: #E3EBE7;
--color-info-base: #8FA998;              /* Matches primary */
--color-info-dark: #657A6D;
```

### Text Colors

```css
--color-text-primary: #1A1A1A;           /* Headings, primary content */
--color-text-secondary: #4A4A4A;         /* Body text */
--color-text-tertiary: #6B6B6B;          /* Supporting text */
--color-text-disabled: #A0A0A0;          /* Disabled states */
--color-text-inverse: #FFFFFF;           /* Text on dark backgrounds */
--color-text-hint: #8E8E8E;              /* Placeholder text */
```

### Gradient Tokens

```css
--gradient-mint-lavender: linear-gradient(135deg, #B8F4DC 0%, #E8D9F5 100%);
--gradient-mint-white: linear-gradient(180deg, #B8F4DC 0%, #FFFFFF 50%, #F4F1E8 100%);
--gradient-activity-purple: linear-gradient(135deg, #E8D9F5 0%, #D1B3E8 100%);
--gradient-activity-yellow: linear-gradient(135deg, #FFF9CC 0%, #FFE88C 100%);
--gradient-activity-coral: linear-gradient(135deg, #FFD4C4 0%, #FFB59A 100%);
```

---

## Spacing Tokens

```css
--spacing-4: 4px;
--spacing-8: 8px;
--spacing-12: 12px;
--spacing-16: 16px;
--spacing-20: 20px;
--spacing-24: 24px;
--spacing-32: 32px;
--spacing-40: 40px;
--spacing-48: 48px;
--spacing-64: 64px;
--spacing-80: 80px;
--spacing-96: 96px;
--spacing-128: 128px;
```

### Semantic Spacing

```css
--spacing-component-gap: var(--spacing-16);
--spacing-section-gap: var(--spacing-32);
--spacing-page-padding-mobile: var(--spacing-20);
--spacing-page-padding-web: var(--spacing-40);
--spacing-card-padding: var(--spacing-20);
--spacing-button-padding-x: var(--spacing-24);
--spacing-button-padding-y: var(--spacing-12);
```

---

## Typography Tokens

### Font Family

```css
--font-family-base: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Weights

```css
--font-weight-regular: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Font Sizes

```css
--font-size-h1: 40px;                    /* Large headings */
--font-size-h2: 32px;                    /* Section headings */
--font-size-h3: 24px;                    /* Subsection headings */
--font-size-h4: 20px;                    /* Card headings */
--font-size-h5: 18px;                    /* Minor headings */
--font-size-h6: 16px;                    /* Small headings */
--font-size-body-l: 18px;                /* Large body text */
--font-size-body-m: 16px;                /* Default body text */
--font-size-body-s: 14px;                /* Small body text */
--font-size-caption: 12px;               /* Captions, labels */
--font-size-overline: 11px;              /* Overline text, timestamps */

/* Mobile Adjustments */
--font-size-h1-mobile: 32px;
--font-size-h2-mobile: 28px;
--font-size-h3-mobile: 22px;
--font-size-body-l-mobile: 17px;
--font-size-body-m-mobile: 15px;
```

### Line Heights

```css
--line-height-tight: 1.2;                /* Headings */
--line-height-normal: 1.5;               /* Body text */
--line-height-relaxed: 1.75;             /* Spacious paragraphs */
```

### Letter Spacing

```css
--letter-spacing-tight: -0.02em;         /* Large headings */
--letter-spacing-normal: 0;              /* Default */
--letter-spacing-wide: 0.02em;           /* All caps, small text */
--letter-spacing-number: 0.03em;         /* Numerical data clarity */
```

---

## Border Radius Tokens

```css
--radius-none: 0px;
--radius-xs: 4px;                        /* Tiny elements */
--radius-sm: 8px;                        /* Chips, small badges */
--radius-md: 12px;                       /* Buttons, inputs */
--radius-lg: 16px;                       /* Cards */
--radius-xl: 20px;                       /* Large cards */
--radius-2xl: 24px;                      /* Extra large cards */
--radius-full: 9999px;                   /* Pills, circular elements */
```

### Component-Specific Radius

```css
--radius-button: var(--radius-full);     /* Pill-shaped buttons */
--radius-card: var(--radius-xl);         /* Standard cards */
--radius-input: var(--radius-md);
--radius-badge: var(--radius-full);
--radius-avatar: var(--radius-full);
--radius-tag: var(--radius-full);
--radius-status-card: var(--radius-2xl); /* Vertical status cards */
```

---

## Shadow Tokens

All shadows are soft, warm, and use tinted colors (never pure black).

```css
--shadow-xs: 0 1px 2px 0 rgba(143, 169, 152, 0.05);
--shadow-sm: 0 2px 4px 0 rgba(143, 169, 152, 0.08),
             0 1px 2px 0 rgba(143, 169, 152, 0.04);
--shadow-md: 0 4px 8px 0 rgba(143, 169, 152, 0.12),
             0 2px 4px 0 rgba(143, 169, 152, 0.06);
--shadow-lg: 0 8px 16px 0 rgba(143, 169, 152, 0.16),
             0 4px 8px 0 rgba(143, 169, 152, 0.08);
--shadow-xl: 0 12px 24px 0 rgba(143, 169, 152, 0.20),
             0 6px 12px 0 rgba(143, 169, 152, 0.10);

/* Warm secondary shadow variant */
--shadow-warm-md: 0 4px 8px 0 rgba(212, 165, 116, 0.12),
                  0 2px 4px 0 rgba(212, 165, 116, 0.06);

/* Inner shadow for glassmorphism */
--shadow-inner-glass: inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
```

---

## Elevation System

```css
--elevation-0: none;                     /* Flat, no shadow */
--elevation-1: var(--shadow-sm);         /* Subtle lift */
--elevation-2: var(--shadow-md);         /* Standard cards */
--elevation-3: var(--shadow-lg);         /* Prominent cards */
--elevation-4: var(--shadow-xl);         /* Modals, dialogs */
```

---

## State Tokens

### Hover States

```css
--state-hover-opacity: 0.9;
--state-hover-scale: 1.02;
--state-hover-bg-darken: rgba(0, 0, 0, 0.05);
```

### Pressed States

```css
--state-pressed-opacity: 0.8;
--state-pressed-scale: 0.98;
--state-pressed-bg-darken: rgba(0, 0, 0, 0.10);
```

### Focus States

```css
--state-focus-ring-color: var(--color-primary-400);
--state-focus-ring-width: 3px;
--state-focus-ring-offset: 2px;
--state-focus-ring: 0 0 0 var(--state-focus-ring-offset) #FFFFFF,
                    0 0 0 calc(var(--state-focus-ring-offset) + var(--state-focus-ring-width)) var(--state-focus-ring-color);
```

### Disabled States

```css
--state-disabled-opacity: 0.5;
--state-disabled-cursor: not-allowed;
--state-disabled-bg: var(--color-lin-3);
--state-disabled-text: var(--color-text-disabled);
```

### Error States

```css
--state-error-border-color: var(--color-error-base);
--state-error-bg: var(--color-error-light);
--state-error-text: var(--color-error-dark);
```

### Success States

```css
--state-success-border-color: var(--color-success-base);
--state-success-bg: var(--color-success-light);
--state-success-text: var(--color-success-dark);
```

---

## Animation & Transition Tokens

```css
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);      /* Material standard */
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);    /* Enter screen */
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);      /* Exit screen */
--easing-smooth: cubic-bezier(0.4, 0.0, 0.6, 1);        /* Smooth organic */

--transition-fast: var(--duration-fast) var(--easing-standard);
--transition-normal: var(--duration-normal) var(--easing-standard);
--transition-slow: var(--duration-slow) var(--easing-smooth);
```

---

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-modal-backdrop: 1300;
--z-modal: 1400;
--z-popover: 1500;
--z-tooltip: 1600;
--z-notification: 1700;
--z-maximum: 9999;
```

---

## Opacity Tokens

```css
--opacity-0: 0;
--opacity-10: 0.1;
--opacity-20: 0.2;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-100: 1;

/* Semantic opacity */
--opacity-disabled: var(--opacity-50);
--opacity-hover: var(--opacity-90);
--opacity-glass: var(--opacity-80);      /* Glassmorphism background */
```

---

## Border Width Tokens

```css
--border-width-none: 0;
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 3px;
--border-width-heavy: 4px;
```

---

## Icon Size Tokens

```css
--icon-size-xs: 16px;
--icon-size-sm: 20px;
--icon-size-md: 24px;                    /* Base size */
--icon-size-lg: 32px;
--icon-size-xl: 40px;
--icon-size-2xl: 48px;
```

---

## Export Formats

### CSS Variables (Web)

All tokens above are available as CSS custom properties and can be imported:

```css
@import '@gastonapp/design-tokens/css/tokens.css';

/* Usage */
.button {
  background-color: var(--color-primary-400);
  border-radius: var(--radius-button);
  padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
}
```

### Tailwind Configuration (Web)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F7F5',
          100: '#E3EBE7',
          // ... etc
          400: '#8FA998',
          // ... etc
        },
        // ... all color tokens
      },
      spacing: {
        4: '4px',
        8: '8px',
        // ... etc
      },
      borderRadius: {
        'button': '9999px',
        'card': '20px',
        // ... etc
      },
      // ... all tokens
    }
  }
}
```

### JSON Export (Mobile - React Native)

```json
{
  "color": {
    "primary": {
      "50": "#F4F7F5",
      "100": "#E3EBE7",
      "400": "#8FA998"
    }
  },
  "spacing": {
    "4": 4,
    "8": 8,
    "16": 16
  },
  "radius": {
    "button": 9999,
    "card": 20
  }
}
```

---

## Platform-Specific Considerations

### Mobile (React Native)

- Spacing values are unitless numbers (not px strings)
- Border radius uses numeric values
- Shadows use platform-specific elevation properties
- Fonts require proper linking in native projects

### Web (React + Tailwind)

- All values use CSS units
- CSS custom properties for dynamic theming
- Tailwind utilities for rapid development

### Landing Page

- Larger spacing scale multipliers (1.5x - 2x)
- More generous margins and padding
- Emphasis on visual hierarchy with larger type scale

---

## Accessibility Tokens

### Minimum Touch Targets

```css
--touch-target-min: 44px;                /* iOS minimum */
--touch-target-comfortable: 48px;        /* Android minimum */
```

### Contrast Ratios (WCAG AA)

All color combinations must meet these minimums:

- Normal text (< 18px): 4.5:1
- Large text (>= 18px or bold >= 14px): 3:1
- UI components and graphical objects: 3:1

### Focus Indicators

- Must be visible with 3px minimum width
- Must use primary color or high contrast
- Must have 2px offset from element

---

## Usage Guidelines

### Do's

- Use semantic tokens (e.g., `--spacing-component-gap`) over raw values
- Reference base tokens in component-specific tokens
- Maintain token hierarchy (primitive → semantic → component)
- Version tokens when making breaking changes
- Document token usage in component specifications

### Don'ts

- Don't hardcode values in components
- Don't create one-off tokens for single use cases
- Don't drift from brand colors (especially backgrounds)
- Don't use harsh black shadows
- Don't bypass the token system for "quick fixes"

---

## Token Versioning

Current version: **1.0.0**

Version format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes to token names or structure
- **MINOR**: New tokens added (backwards compatible)
- **PATCH**: Token value adjustments (same semantics)

---

## Maintenance

Tokens are maintained in:
- `/packages/design-tokens/` (source of truth)
- Exported to `/packages/ui/` for component consumption
- Synced with Figma via Style Dictionary or Figma Tokens plugin

Last updated: 2025-11-16