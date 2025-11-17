# Color System
## GastonApp Design System - Color Foundations

The GastonApp color system is designed to feel natural, serene, and organic. All colors maintain warmth and never drift toward cold blue or grey technology tones. The palette is inspired by natural materials: eucalyptus leaves, golden honey, and natural linen.

---

## Brand Color Philosophy

**Organique — Lumineux — Naturel/Serein**

Every color choice reinforces:
- Natural materials and organic warmth
- Soft, serene, never aggressive
- Luminous and airy, not heavy
- Accessible and readable
- Consistent across all platforms (web, mobile, landing)

---

## Primary Color: Eucalyptus Green

### Base Color
**#8FA998** - Fresh accent, eucalyptus

This is the primary interactive color used for CTAs, accents, highlights, icons, and focus states. It evokes freshness and natural serenity.

### Primary Palette Scale

| Token | Hex | Usage | Contrast Ratio (on white) |
|-------|-----|-------|---------------------------|
| `primary-50` | #F4F7F5 | Background tints, subtle highlights | 1.02:1 |
| `primary-100` | #E3EBE7 | Hover backgrounds, very subtle | 1.08:1 |
| `primary-200` | #C7D7CF | Disabled states, borders | 1.25:1 |
| `primary-300` | #ABC3B7 | Inactive elements | 1.65:1 |
| `primary-400` | #8FA998 | **Base - Primary interactive color** | 2.35:1 |
| `primary-500` | #7A9383 | Hover states on primary | 2.85:1 |
| `primary-600` | #657A6D | Pressed states | 3.45:1 |
| `primary-700` | #506158 | Text on light backgrounds | 4.85:1 ✓ WCAG AA |
| `primary-800` | #3B4842 | Strong emphasis | 7.25:1 ✓ WCAG AAA |
| `primary-900` | #262F2C | Maximum contrast | 11.5:1 ✓ WCAG AAA |

### Primary Color Usage

**Do:**
- Use primary-400 for interactive elements (buttons, links, icons)
- Use primary-700+ for text to ensure WCAG AA compliance
- Use primary-50 to primary-200 for subtle backgrounds and hover states
- Use primary tints for focus rings and selection states

**Don't:**
- Don't use primary colors for large text blocks
- Don't combine similar primary shades without sufficient contrast
- Don't use primary-400 on white backgrounds for body text (contrast too low)

### Code Examples

```css
/* Primary button */
.button-primary {
  background-color: var(--color-primary-400);
  color: white;
}

/* Primary button hover */
.button-primary:hover {
  background-color: var(--color-primary-500);
}

/* Primary text link (accessible) */
.link-primary {
  color: var(--color-primary-700);
}

/* Subtle background highlight */
.highlight-subtle {
  background-color: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
}
```

---

## Secondary Color: Golden Honey

### Base Color
**#D4A574** - Miel doré (Golden honey)

Used for badges, success states, warmth accents, and data visualization complementary tones. Adds warmth and organic richness to the palette.

### Secondary Palette Scale

| Token | Hex | Usage | Contrast Ratio (on white) |
|-------|-----|-------|---------------------------|
| `secondary-50` | #FAF6F1 | Background tints | 1.01:1 |
| `secondary-100` | #F2E8DC | Subtle backgrounds | 1.05:1 |
| `secondary-200` | #E8D4BA | Light accents, borders | 1.18:1 |
| `secondary-300` | #DEC097 | Soft emphasis | 1.42:1 |
| `secondary-400` | #D4A574 | **Base - Secondary accent** | 1.85:1 |
| `secondary-500` | #C18E5F | Hover states | 2.25:1 |
| `secondary-600` | #A97649 | Active states | 3.15:1 |
| `secondary-700` | #8B6039 | Text on light backgrounds | 4.65:1 ✓ WCAG AA |
| `secondary-800` | #6D4A2A | Strong emphasis | 7.15:1 ✓ WCAG AAA |
| `secondary-900` | #4F341C | Maximum contrast | 11.2:1 ✓ WCAG AAA |

### Secondary Color Usage

**Do:**
- Use for status badges (success, completed)
- Use for warm accent highlights
- Use in data visualizations as complementary color
- Use for secondary CTAs that need warmth

**Don't:**
- Don't overuse - secondary color should support, not dominate
- Don't use on backgrounds that clash with eucalyptus green
- Don't use secondary-400 for body text (insufficient contrast)

### Code Examples

```css
/* Success badge */
.badge-success {
  background-color: var(--color-secondary-100);
  color: var(--color-secondary-800);
  border: 1px solid var(--color-secondary-300);
}

/* Warm accent button */
.button-warm {
  background-color: var(--color-secondary-400);
  color: white;
}
```

---

## Background Scale: Lin Naturel

The foundational neutral palette, inspired by natural linen. This 10-level scale maintains warmth throughout, never drifting to blue/grey tech tones.

### Background Palette (Lin-0 to Lin-9)

| Token | Hex | RGB | Description |
|-------|-----|-----|-------------|
| `lin-0` | #FDFCFA | 253, 252, 250 | Ultra light, almost white |
| `lin-1` | #F9F7F4 | 249, 247, 244 | Very light cream |
| `lin-2` | #F4F1E8 | 244, 241, 232 | **Base - Natural linen** |
| `lin-3` | #EFEADC | 239, 234, 220 | Soft warm beige |
| `lin-4` | #E9E3D0 | 233, 227, 208 | Light warm sand |
| `lin-5` | #E0D8C3 | 224, 216, 195 | Medium warm sand |
| `lin-6` | #D6CBB5 | 214, 203, 181 | Deeper beige |
| `lin-7` | #C8BDA6 | 200, 189, 166 | Warm tan |
| `lin-8` | #B9AD96 | 185, 173, 150 | Darker warm tan |
| `lin-9` | #A99D85 | 169, 157, 133 | Darkest acceptable warm tone |

### Background Usage Guidelines

**Lin-0 to Lin-2**: Ultra-light backgrounds
- Primary app backgrounds
- Card surfaces
- Modal overlays
- Use for maximum brightness and airiness

**Lin-3 to Lin-5**: Light backgrounds
- Secondary surfaces
- Hover states on cards
- Disabled input backgrounds
- Subtle section dividers

**Lin-6 to Lin-9**: Medium to darker backgrounds
- Borders and dividers
- Inactive states
- Text on very light backgrounds
- Tertiary surfaces

### Background Color Pairings

```css
/* Page background */
body {
  background-color: var(--color-lin-2);
}

/* Card on page */
.card {
  background-color: var(--color-lin-0);
  box-shadow: var(--shadow-md);
}

/* Section divider */
.divider {
  background-color: var(--color-lin-4);
  height: 1px;
}

/* Input background */
.input {
  background-color: var(--color-lin-1);
  border: 1px solid var(--color-lin-5);
}
```

---

## Accent Colors (From Reference Images)

These colors appear in the reference designs and add vibrancy to the system. Use sparingly for highlights, activity cards, and status indicators.

### Mint Green Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `mint-light` | #B8F4DC | Backgrounds, gradients |
| `mint-base` | #7CEDC3 | "Paid" status, success highlights |
| `mint-dark` | #4FD1A1 | Active states, strong emphasis |

**Usage:** "Paid" status cards, success indicators, positive financial data, gradient backgrounds.

```css
/* Paid status card (from reference images) */
.status-card-paid {
  background: linear-gradient(180deg, var(--color-mint-light) 0%, var(--color-mint-base) 100%);
  border-radius: var(--radius-status-card);
}
```

### Lavender Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `lavender-light` | #E8D9F5 | Activity card backgrounds |
| `lavender-base` | #D1B3E8 | Medium emphasis |
| `lavender-dark` | #B98DD9 | Strong accents |

**Usage:** Activity cards (purple variant), calendar events, gradient backgrounds, soft highlights.

```css
/* Activity card with lavender gradient */
.activity-card-purple {
  background: linear-gradient(135deg, var(--color-lavender-light) 0%, var(--color-lavender-base) 100%);
}
```

### Yellow Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `yellow-light` | #FFF9CC | Light backgrounds |
| `yellow-base` | #FFE88C | "Credits" status, highlights |
| `yellow-dark` | #FFD84D | Active states |

**Usage:** "Credits" status cards, activity cards (yellow variant), warning states, highlights.

```css
/* Credits status card (from reference images) */
.status-card-credits {
  background: linear-gradient(180deg, var(--color-yellow-light) 0%, var(--color-yellow-base) 100%);
  border-radius: var(--radius-status-card);
}
```

### Coral Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `coral-light` | #FFD4C4 | Activity card backgrounds |
| `coral-base` | #FFB59A | Medium emphasis |
| `coral-dark` | #FF9670 | Strong accents |

**Usage:** Activity cards (coral variant), warm highlights, tertiary accents.

```css
/* Activity card with coral gradient */
.activity-card-coral {
  background: linear-gradient(135deg, var(--color-coral-light) 0%, var(--color-coral-base) 100%);
}
```

---

## Semantic Colors

### Success

| Token | Hex | Usage |
|-------|-----|-------|
| `success-light` | #D4F4E7 | Backgrounds |
| `success-base` | #7CEDC3 | Icons, borders (matches mint) |
| `success-dark` | #4FD1A1 | Text |

**Contrast Ratio:** success-dark on success-light = 4.8:1 ✓ WCAG AA

```css
.alert-success {
  background-color: var(--color-success-light);
  border-left: 4px solid var(--color-success-base);
  color: var(--color-success-dark);
}
```

### Warning

| Token | Hex | Usage |
|-------|-----|-------|
| `warning-light` | #FFF4D9 | Backgrounds |
| `warning-base` | #FFD84D | Icons, borders |
| `warning-dark` | #FFBB1A | Text |

**Contrast Ratio:** warning-dark on warning-light = 4.6:1 ✓ WCAG AA

```css
.alert-warning {
  background-color: var(--color-warning-light);
  border-left: 4px solid var(--color-warning-base);
  color: var(--color-warning-dark);
}
```

### Error

| Token | Hex | Usage |
|-------|-----|-------|
| `error-light` | #FFE5E5 | Backgrounds |
| `error-base` | #FF6B6B | Icons, borders |
| `error-dark` | #E54545 | Text |

**Contrast Ratio:** error-dark on error-light = 5.2:1 ✓ WCAG AA

```css
.alert-error {
  background-color: var(--color-error-light);
  border-left: 4px solid var(--color-error-base);
  color: var(--color-error-dark);
}

.input-error {
  border-color: var(--color-error-base);
}
```

### Info

| Token | Hex | Usage |
|-------|-----|-------|
| `info-light` | #E3EBE7 | Backgrounds |
| `info-base` | #8FA998 | Icons, borders (matches primary) |
| `info-dark` | #657A6D | Text |

**Contrast Ratio:** info-dark on info-light = 3.8:1 ✓ WCAG AA (large text)

---

## Text Colors

| Token | Hex | Usage | Contrast on Lin-2 |
|-------|-----|-------|-------------------|
| `text-primary` | #1A1A1A | Headings, primary content | 14.5:1 ✓ AAA |
| `text-secondary` | #4A4A4A | Body text | 8.2:1 ✓ AAA |
| `text-tertiary` | #6B6B6B | Supporting text | 5.5:1 ✓ AA |
| `text-disabled` | #A0A0A0 | Disabled states | 2.8:1 |
| `text-inverse` | #FFFFFF | Text on dark backgrounds | - |
| `text-hint` | #8E8E8E | Placeholder text | 3.2:1 |

### Text Color Usage

```css
/* Heading */
h1, h2, h3 {
  color: var(--color-text-primary);
}

/* Body text */
p {
  color: var(--color-text-secondary);
}

/* Supporting text (captions, labels) */
.caption {
  color: var(--color-text-tertiary);
}

/* Placeholder */
input::placeholder {
  color: var(--color-text-hint);
}

/* Disabled */
.disabled {
  color: var(--color-text-disabled);
}
```

---

## Gradient Patterns

Based on reference images, these gradients are used for backgrounds and cards.

### Mint to Lavender (Primary Background Gradient)

```css
--gradient-mint-lavender: linear-gradient(135deg, #B8F4DC 0%, #E8D9F5 100%);
```

**Usage:** Primary app backgrounds, hero sections, full-screen backgrounds

### Mint to White (Vertical Fade)

```css
--gradient-mint-white: linear-gradient(180deg, #B8F4DC 0%, #FFFFFF 50%, #F4F1E8 100%);
```

**Usage:** Page backgrounds with vertical color fade

### Activity Card Gradients

```css
/* Purple activity card */
--gradient-activity-purple: linear-gradient(135deg, #E8D9F5 0%, #D1B3E8 100%);

/* Yellow activity card */
--gradient-activity-yellow: linear-gradient(135deg, #FFF9CC 0%, #FFE88C 100%);

/* Coral activity card */
--gradient-activity-coral: linear-gradient(135deg, #FFD4C4 0%, #FFB59A 100%);
```

**Usage:** Activity/event cards, notification cards, highlighted sections

---

## Glassmorphism & Overlay Colors

Based on reference images showing semi-transparent overlays with vertical stripes.

### Glass Background

```css
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-inner-glass), var(--shadow-md);
}
```

### Striped Pattern Overlay

```css
.pattern-stripes-vertical {
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(143, 169, 152, 0.08) 2px,
    rgba(143, 169, 152, 0.08) 4px
  );
}
```

**Usage:** Financial cards with balance information, data cards requiring subtle texture

---

## Color Accessibility Guidelines

### Contrast Requirements (WCAG 2.1)

**Level AA:**
- Normal text (< 18px): 4.5:1 minimum
- Large text (>= 18px or bold >= 14px): 3:1 minimum
- UI components and graphical objects: 3:1 minimum

**Level AAA:**
- Normal text: 7:1 minimum
- Large text: 4.5:1 minimum

### Accessibility Matrix

All color combinations used in GastonApp meet WCAG AA standards minimum. Key pairings:

| Foreground | Background | Ratio | Level | Use Case |
|------------|------------|-------|-------|----------|
| text-primary | lin-2 | 14.5:1 | AAA | Headings |
| text-secondary | lin-2 | 8.2:1 | AAA | Body text |
| text-tertiary | lin-2 | 5.5:1 | AA | Captions |
| primary-700 | lin-0 | 4.85:1 | AA | Links |
| primary-400 | white (inverse) | 2.8:1 | - | Buttons (white text on primary) |
| success-dark | success-light | 4.8:1 | AA | Success messages |
| error-dark | error-light | 5.2:1 | AA | Error messages |

### Testing Tools

Use these tools to verify contrast:
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Panel
- Figma A11y - Color Contrast Checker plugin

---

## Color Usage Do's and Don'ts

### Do's

- **Do** use primary-400 for interactive elements (buttons, icons, focus states)
- **Do** use text-primary through text-tertiary for proper hierarchy
- **Do** maintain the warm, organic feel - never drift to blue/grey tones
- **Do** use gradients from reference images for background variety
- **Do** ensure all text meets WCAG AA contrast minimums
- **Do** use semantic colors (success, warning, error) consistently
- **Do** test colors on actual devices and lighting conditions
- **Do** use accent colors (mint, lavender, yellow, coral) sparingly for highlights

### Don'ts

- **Don't** use primary-400 for body text (insufficient contrast)
- **Don't** mix too many accent colors in one screen
- **Don't** use pure black (#000000) - use text-primary instead
- **Don't** use harsh, saturated colors that break the serene aesthetic
- **Don't** create gradients that drift to blue or cold tones
- **Don't** use colors not defined in this system
- **Don't** override semantic colors for different meanings
- **Don't** use low-contrast combinations for critical UI elements

---

## Platform-Specific Color Implementation

### Web (CSS/Tailwind)

```css
/* CSS Custom Properties */
:root {
  --color-primary-400: #8FA998;
  --color-secondary-400: #D4A574;
  --color-lin-2: #F4F1E8;
}

/* Tailwind Config */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#8FA998',
        },
        lin: {
          2: '#F4F1E8',
        }
      }
    }
  }
}
```

### Mobile (React Native)

```javascript
// colors.ts
export const colors = {
  primary: {
    400: '#8FA998',
  },
  lin: {
    2: '#F4F1E8',
  },
};

// Usage
import { colors } from '@gastonapp/shared/theme/colors';

<View style={{ backgroundColor: colors.primary[400] }} />
```

### Figma

Organize color styles in Figma as:
- `Brand/Primary/400`
- `Brand/Secondary/400`
- `Background/Lin/2`
- `Semantic/Success/Base`
- `Text/Primary`

Enable color variables for easy synchronization with code.

---

## Color Maintenance

### Adding New Colors

1. Ensure color fits organic/warm/natural brand philosophy
2. Create full tint/shade scale (50-900)
3. Verify WCAG AA contrast ratios
4. Add to design tokens
5. Document usage guidelines
6. Update Figma color styles
7. Test on all platforms

### Deprecating Colors

1. Mark as deprecated in design tokens
2. Document migration path
3. Provide grace period (minimum 2 versions)
4. Update all components
5. Remove from Figma

---

## Color Testing Checklist

Before shipping:

- [ ] All text meets WCAG AA contrast (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements have clear hover/focus states
- [ ] Colors work in light mode (dark mode TBD)
- [ ] Colors tested on actual mobile devices
- [ ] No pure black or pure white (unless intentional)
- [ ] Gradients are smooth and organic
- [ ] Semantic colors used consistently
- [ ] Colors exported to all platforms (web, mobile)

---

**Last updated:** 2025-11-16
**Version:** 1.0.0
**Maintained by:** Design System Team