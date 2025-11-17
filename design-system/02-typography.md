# Typography System
## GastonApp Design System - Typography Foundations

Typography in GastonApp creates a natural, calm, and readable experience. Nunito is our exclusive typeface, chosen for its warm, friendly appearance and excellent readability across all screen sizes.

---

## Typography Philosophy

**Readable — Airy — Calm — Organic**

Every typographic decision reinforces:
- Clear hierarchy without aggression
- Generous spacing for breathing room
- Natural rhythm and flow
- Accessibility and legibility
- Consistency across web, mobile, and landing platforms

---

## Font Family

### Nunito (Exclusive Typeface)

**Primary Font:** Nunito
**Fallback Stack:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Nunito is a well-balanced sans-serif that combines geometric shapes with organic curves. It feels modern yet approachable, professional yet friendly.

**Why Nunito:**
- Excellent readability at all sizes
- Warm, friendly character without being casual
- Wide character set including special characters
- Optimal for both digital screens and mobile devices
- Open-source and freely available

### Font Loading

```css
/* Web - Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

/* CSS Font Stack */
:root {
  --font-family-base: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

body {
  font-family: var(--font-family-base);
}
```

```typescript
// React Native - Requires font loading
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
  'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
  'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
});
```

---

## Font Weights

Only three weights are used for clarity and consistency:

| Weight | Value | Usage |
|--------|-------|-------|
| **Regular** | 400 | Body text, paragraphs, captions |
| **Semi-bold** | 600 | Headings, emphasis, labels |
| **Bold** | 700 | Strong emphasis, important CTAs |

**Do's:**
- Use Regular (400) for all body text
- Use Semi-bold (600) for all headings
- Use Bold (700) sparingly for critical emphasis

**Don'ts:**
- Don't use Light weights (too faint on mobile)
- Don't use Extra Bold weights (too aggressive)
- Don't mix multiple weights in a single text block unless necessary

---

## Type Scale

### Complete Typography Scale

| Style | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| **H1** | 40px | 48px (1.2) | 600 | -0.02em | Page titles, hero headings |
| **H2** | 32px | 40px (1.25) | 600 | -0.01em | Section headings |
| **H3** | 24px | 32px (1.33) | 600 | 0 | Subsection headings |
| **H4** | 20px | 28px (1.4) | 600 | 0 | Card titles, component headings |
| **H5** | 18px | 26px (1.44) | 600 | 0 | Minor headings, labels |
| **H6** | 16px | 24px (1.5) | 600 | 0 | Small headings, tertiary labels |
| **Body L** | 18px | 28px (1.56) | 400 | 0 | Large body text, emphasis |
| **Body M** | 16px | 24px (1.5) | 400 | 0 | Default body text, paragraphs |
| **Body S** | 14px | 21px (1.5) | 400 | 0 | Small body text, dense content |
| **Caption** | 12px | 18px (1.5) | 400 | 0.02em | Captions, helper text, timestamps |
| **Overline** | 11px | 16px (1.45) | 600 | 0.08em | Overline labels, tags, metadata |

### Mobile Type Scale

Slightly adjusted for mobile readability:

| Style | Mobile Size | Line Height | Weight |
|-------|-------------|-------------|--------|
| **H1** | 32px | 40px (1.25) | 600 |
| **H2** | 28px | 36px (1.29) | 600 |
| **H3** | 22px | 30px (1.36) | 600 |
| **H4** | 20px | 28px (1.4) | 600 |
| **H5** | 18px | 26px (1.44) | 600 |
| **H6** | 16px | 24px (1.5) | 600 |
| **Body L** | 17px | 26px (1.53) | 400 |
| **Body M** | 15px | 23px (1.53) | 400 |
| **Body S** | 14px | 21px (1.5) | 400 |
| **Caption** | 12px | 18px (1.5) | 400 |
| **Overline** | 11px | 16px (1.45) | 600 |

---

## Design Tokens

### CSS Variables

```css
/* Font Families */
--font-family-base: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Weights */
--font-weight-regular: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Font Sizes - Desktop/Web */
--font-size-h1: 40px;
--font-size-h2: 32px;
--font-size-h3: 24px;
--font-size-h4: 20px;
--font-size-h5: 18px;
--font-size-h6: 16px;
--font-size-body-l: 18px;
--font-size-body-m: 16px;
--font-size-body-s: 14px;
--font-size-caption: 12px;
--font-size-overline: 11px;

/* Font Sizes - Mobile */
--font-size-h1-mobile: 32px;
--font-size-h2-mobile: 28px;
--font-size-h3-mobile: 22px;
--font-size-body-l-mobile: 17px;
--font-size-body-m-mobile: 15px;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* Letter Spacing */
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.02em;
--letter-spacing-number: 0.03em;
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'h6': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-l': ['18px', { lineHeight: '28px' }],
        'body-m': ['16px', { lineHeight: '24px' }],
        'body-s': ['14px', { lineHeight: '21px' }],
        'caption': ['12px', { lineHeight: '18px', letterSpacing: '0.02em' }],
        'overline': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      fontWeight: {
        regular: 400,
        semibold: 600,
        bold: 700,
      },
    },
  },
};
```

### React Native / JSON Export

```json
{
  "typography": {
    "fontFamily": {
      "base": "Nunito"
    },
    "fontWeight": {
      "regular": "400",
      "semibold": "600",
      "bold": "700"
    },
    "fontSize": {
      "h1": 32,
      "h2": 28,
      "h3": 22,
      "h4": 20,
      "h5": 18,
      "h6": 16,
      "bodyL": 17,
      "bodyM": 15,
      "bodyS": 14,
      "caption": 12,
      "overline": 11
    },
    "lineHeight": {
      "h1": 40,
      "h2": 36,
      "h3": 30,
      "h4": 28,
      "h5": 26,
      "h6": 24,
      "bodyL": 26,
      "bodyM": 23,
      "bodyS": 21,
      "caption": 18,
      "overline": 16
    },
    "letterSpacing": {
      "tight": -0.02,
      "normal": 0,
      "wide": 0.02,
      "number": 0.03
    }
  }
}
```

---

## Usage Guidelines

### Headings (H1 - H6)

#### H1 - Page Titles
**40px / 600 / -0.02em**

```html
<h1 class="text-h1">Invoice</h1>
```

```css
.heading-1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-text-primary);
}
```

**Usage:** Page titles, hero headings, primary screen titles
**Max per screen:** 1
**Color:** text-primary

#### H2 - Section Headings
**32px / 600 / -0.01em**

```html
<h2 class="text-h2">Invoice lines</h2>
```

**Usage:** Main section headings, card group titles
**Max per screen:** 2-3
**Color:** text-primary

#### H3 - Subsection Headings
**24px / 600 / 0**

```html
<h3 class="text-h3">Activity</h3>
```

**Usage:** Subsection headings, prominent card titles, modal titles
**Color:** text-primary

#### H4 - Component Headings
**20px / 600 / 0**

```html
<h4 class="text-h4">Send Payment Reminder</h4>
```

**Usage:** Card titles, component headings, list section titles
**Color:** text-primary or text-secondary

#### H5 - Minor Headings
**18px / 600 / 0**

**Usage:** Labels with emphasis, small card titles
**Color:** text-secondary

#### H6 - Small Headings
**16px / 600 / 0**

**Usage:** Tertiary labels, navigation items, tab labels
**Color:** text-secondary or text-tertiary

### Body Text

#### Body L - Large Body
**18px / 400 / 1.56**

```html
<p class="text-body-l">Important information that needs emphasis.</p>
```

**Usage:** Lead paragraphs, emphasized body text, introductions
**Color:** text-secondary

#### Body M - Default Body (Most Common)
**16px / 400 / 1.5**

```html
<p class="text-body-m">Standard paragraph text for most content.</p>
```

**Usage:** Default paragraphs, list items, descriptions
**Color:** text-secondary
**This is the most commonly used text style**

#### Body S - Small Body
**14px / 400 / 1.5**

```html
<p class="text-body-s">Dense content or less important information.</p>
```

**Usage:** Dense content, secondary descriptions, footer text
**Color:** text-tertiary

### Captions & Labels

#### Caption
**12px / 400 / 0.02em**

```html
<span class="text-caption">12 Feb at 11 pm</span>
```

**Usage:** Timestamps, helper text, image captions, metadata
**Color:** text-tertiary or text-hint

#### Overline
**11px / 600 / 0.08em / UPPERCASE**

```html
<span class="text-overline">UPCOMING</span>
```

**Usage:** Overline labels, category tags, section markers
**Color:** text-tertiary
**Always uppercase**

---

## Numerical Data Typography

Financial and numerical data requires special treatment for clarity and scannability.

### Large Numbers (Primary Data)

```html
<!-- From reference images: $68,575.00 -->
<div class="text-number-large">
  <span class="currency">$</span>
  <span class="amount">68,575</span>
  <span class="decimal">.00</span>
</div>
```

```css
.text-number-large {
  font-size: 56px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.1;
  letter-spacing: var(--letter-spacing-number);
  color: var(--color-text-primary);
}

.text-number-large .currency {
  font-size: 0.5em; /* 28px */
  opacity: 0.7;
}

.text-number-large .decimal {
  font-size: 0.5em; /* 28px */
  opacity: 0.5;
}
```

**Usage:** Primary financial amounts, hero numbers, key metrics

### Medium Numbers (Card/List Data)

```html
<!-- From reference images: $700 -->
<span class="text-number-medium">$700</span>
```

```css
.text-number-medium {
  font-size: 18px;
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letter-spacing-number);
  color: var(--color-text-primary);
}
```

**Usage:** List item prices, card amounts, secondary metrics

### Small Numbers (Metadata)

```html
<!-- From reference images: 67 Items -->
<span class="text-number-small">67 <span class="label">Items</span></span>
```

```css
.text-number-small {
  font-size: 32px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-tight);
}

.text-number-small .label {
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-tertiary);
}
```

**Usage:** Counts, quantities, numeric badges

### Number Formatting Rules

1. **Use commas** for thousands separators: 68,575 not 68575
2. **Reduce opacity** of currency symbols and decimals
3. **Add letter spacing** (0.03em) for better number scanning
4. **Use tabular figures** when available (Nunito supports this)
5. **Align right** for columns of numbers

---

## Responsive Typography

### Breakpoints

```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 767px) {
  :root {
    --font-size-h1: 32px;
    --font-size-h2: 28px;
    --font-size-h3: 22px;
    --font-size-body-l: 17px;
    --font-size-body-m: 15px;
  }
}
```

### Fluid Typography (Advanced)

For landing pages, use fluid scaling:

```css
.heading-fluid {
  font-size: clamp(32px, 5vw, 40px);
}

.body-fluid {
  font-size: clamp(15px, 2vw, 16px);
}
```

---

## Text Alignment

### Default Alignment

- **Headings:** Left-aligned (natural reading flow)
- **Body text:** Left-aligned (best readability)
- **Numbers:** Right-aligned in tables
- **Centered text:** Only for hero sections or empty states

### Code Examples

```css
/* Default - Left aligned */
.text-default {
  text-align: left;
}

/* Numbers in tables - Right aligned */
.table-cell-number {
  text-align: right;
}

/* Hero section - Centered */
.hero-title {
  text-align: center;
}
```

---

## Text Decoration & Styling

### Links

```css
.link {
  color: var(--color-primary-700);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.link:hover {
  color: var(--color-primary-600);
  text-decoration: underline;
}

.link:focus {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Emphasis

```css
/* Strong (bold) */
strong, b {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* Emphasis (italic) - use sparingly */
em, i {
  font-style: italic;
}

/* Code */
code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  background-color: var(--color-lin-3);
  padding: 2px 6px;
  border-radius: 4px;
}
```

### Text Truncation

```css
/* Single line truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line truncation (2 lines) */
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Accessibility Considerations

### Font Size Minimums

- **Minimum body text:** 14px (mobile), 16px (desktop)
- **Minimum interactive text:** 14px with 44px touch target
- **Maximum line length:** 70-80 characters for optimal readability

### Line Height Guidelines

- **Headings:** 1.2 - 1.4
- **Body text:** 1.5 - 1.75
- **Dense content:** 1.4 minimum

### Contrast Requirements

All text must meet WCAG AA contrast requirements:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum

See Color System documentation for contrast ratios.

### User Preferences

```css
/* Respect user font size preferences */
html {
  font-size: 16px;
}

/* Allow text scaling on mobile */
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* Reduce motion for animations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Typography Do's and Don'ts

### Do's

- **Do** use Nunito exclusively - no font mixing
- **Do** maintain clear hierarchy with size and weight
- **Do** use proper line heights (1.5 for body text)
- **Do** add generous margins between sections
- **Do** use letter spacing for numbers and small caps
- **Do** ensure minimum 44px touch targets for interactive text
- **Do** left-align text for natural reading flow
- **Do** test typography on actual devices

### Don'ts

- **Don't** use more than 3 font sizes on a single screen
- **Don't** use all caps except for overline labels
- **Don't** use center-aligned body text
- **Don't** use long lines of text (max 70-80 characters)
- **Don't** use font sizes smaller than 12px
- **Don't** use light font weights (too faint on mobile)
- **Don't** mix multiple font weights in a single word
- **Don't** use justified text (creates awkward spacing)

---

## Component-Specific Typography

### Button Text

```css
.button-text {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  letter-spacing: 0;
}

.button-text-small {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
}
```

### Input Labels

```css
.input-label {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
}
```

### Badge Text

```css
.badge-text {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### Card Text (from reference images)

```css
/* Card title */
.card-title {
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  color: var(--color-text-primary);
}

/* Card metadata */
.card-meta {
  font-size: 12px;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-tertiary);
  letter-spacing: 0.02em;
}
```

---

## Complete Typography Examples

### Invoice Header (from reference images)

```html
<div class="invoice-header">
  <h1 class="text-h1">Invoice</h1>
  <div class="amount-display">
    <span class="currency">$</span>
    <span class="amount">68,575</span>
    <span class="decimal">.00</span>
  </div>
  <div class="invoice-meta">
    <div class="meta-item">
      <span class="label">Account</span>
      <span class="value">Ohana Inc.</span>
    </div>
    <div class="meta-item">
      <span class="label">Invoice Number</span>
      <span class="value">INV-4905</span>
    </div>
    <div class="meta-item">
      <span class="label">Status</span>
      <span class="value">Posted</span>
    </div>
  </div>
</div>
```

```css
.invoice-header {
  padding: var(--spacing-24);
}

.invoice-header .text-h1 {
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-16);
}

.amount-display {
  font-size: 56px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-number);
  margin-bottom: var(--spacing-24);
}

.amount-display .currency,
.amount-display .decimal {
  font-size: 28px;
  opacity: 0.5;
}

.meta-item {
  margin-bottom: var(--spacing-12);
}

.meta-item .label {
  font-size: 12px;
  color: var(--color-text-tertiary);
  display: block;
  margin-bottom: var(--spacing-4);
}

.meta-item .value {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
```

### Activity Card (from reference images)

```html
<div class="activity-card">
  <div class="activity-date">
    <span class="day">12</span>
    <span class="month">Feb</span>
    <span class="time">at 11 pm</span>
  </div>
  <h4 class="activity-title">Send Payment Reminder</h4>
  <p class="activity-description">Jessi Johnson sent a payment reminder</p>
</div>
```

```css
.activity-date {
  margin-bottom: var(--spacing-8);
}

.activity-date .day {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
}

.activity-date .month {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.activity-date .time {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.activity-title {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-8);
}

.activity-description {
  font-size: 14px;
  color: var(--color-text-secondary);
}
```

---

## Testing Checklist

Before shipping typography changes:

- [ ] All text readable on mobile (minimum 14px)
- [ ] Headings create clear visual hierarchy
- [ ] Line heights provide adequate breathing room
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Numbers use proper formatting and letter spacing
- [ ] Touch targets for interactive text are 44px minimum
- [ ] Typography scales properly across breakpoints
- [ ] Nunito font loads correctly on all platforms
- [ ] Text truncation works for long content
- [ ] All text styles documented and tokenized

---

**Last updated:** 2025-11-16
**Version:** 1.0.0
**Maintained by:** Design System Team