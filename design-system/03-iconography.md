# Iconography System
## GastonApp Design System - Icon Foundations

Phosphor Icons is the exclusive icon system for GastonApp. These icons are clean, consistent, and perfectly aligned with our natural, serene brand aesthetic. Every icon maintains optical balance and clarity across all sizes.

---

## Iconography Philosophy

**Clear — Consistent — Optical — Natural**

Every icon decision reinforces:
- Clarity at all sizes (especially small mobile sizes)
- Visual consistency across the entire system
- Optical alignment, never mechanical
- Natural, organic shapes that feel calm
- No emojis - only well-designed icons

---

## Icon Library: Phosphor Icons

### Why Phosphor Icons?

**Official Library:** [https://phosphoricons.com/](https://phosphoricons.com/)

Phosphor is a flexible icon family for interfaces, diagrams, presentations — whatever you need.

**Advantages:**
- 6+ weights available (we use Regular and Bold)
- 24x24 base grid for perfect alignment
- Over 6,000+ icons covering all use cases
- Consistent stroke thickness and geometry
- Available as React components, SVG, and web font
- Open source and actively maintained
- Excellent optical balance at small sizes

**Key Principle:** Replace all emojis with appropriate Phosphor icons for a professional, cohesive look.

---

## Icon Weights

We use only two weights for clarity:

| Weight | Stroke Width | Usage |
|--------|--------------|-------|
| **Regular** | 1.5px | Default icons, UI elements, navigation |
| **Bold** | 2px | Emphasis, active states, CTAs, important actions |

**Do's:**
- Use Regular (1.5px) for most UI icons
- Use Bold (2px) for active states and emphasis
- Maintain consistent weight within a component

**Don'ts:**
- Don't use Thin or Light weights (too faint on mobile)
- Don't mix weights randomly
- Don't use Fill weight unless specifically needed for filled states

---

## Icon Grid & Base Size

### Base Grid: 24x24

All Phosphor icons are designed on a 24x24px grid. This ensures:
- Perfect pixel alignment
- Consistent visual weight
- Optical balance across all icons
- Easy scaling to different sizes

### Icon Bounding Box

```
┌─────────────────────┐
│   24px × 24px       │
│                     │
│      ┌───────┐      │
│      │ Icon  │      │
│      │ Area  │      │
│      └───────┘      │
│                     │
│   (2px padding)     │
└─────────────────────┘
```

**Padding:** Icons have built-in 2px padding to prevent visual crowding

---

## Icon Sizing Scale

| Size Token | Dimensions | Usage | Stroke Width |
|------------|------------|-------|--------------|
| `xs` | 16x16px | Dense UI, small badges | 1.5px |
| `sm` | 20x20px | Compact interfaces, inline text | 1.5px |
| `md` | **24x24px** | **Default - Most UI elements** | 1.5px |
| `lg` | 32x32px | Prominent actions, list icons | 1.5px or 2px |
| `xl` | 40x40px | Large buttons, feature highlights | 2px |
| `2xl` | 48x48px | Hero icons, empty states | 2px |

**Default:** Always use 24x24 (md) unless there's a specific reason to deviate.

### CSS Variables

```css
--icon-size-xs: 16px;
--icon-size-sm: 20px;
--icon-size-md: 24px;   /* Default */
--icon-size-lg: 32px;
--icon-size-xl: 40px;
--icon-size-2xl: 48px;
```

---

## Installation & Implementation

### Web (React)

```bash
npm install phosphor-react
# or
pnpm add phosphor-react
```

```tsx
import { House, Calendar, User, Bell, ArrowLeft } from 'phosphor-react';

// Regular weight (default)
<House size={24} weight="regular" />

// Bold weight
<Bell size={24} weight="bold" color="#8FA998" />

// With custom color
<Calendar size={32} color="var(--color-primary-400)" />
```

### React Native (Expo)

```bash
npx expo install phosphor-react-native
```

```tsx
import { House, Calendar, User } from 'phosphor-react-native';

<House size={24} weight="regular" color="#8FA998" />
```

### CSS / SVG (Direct Usage)

```html
<!-- Inline SVG -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
  <!-- Icon path data -->
</svg>
```

---

## Icon Colors

Icons inherit text color by default but can be customized.

### Color Guidelines

| Color Token | Hex | Usage |
|-------------|-----|-------|
| `text-primary` | #1A1A1A | Primary icons, high emphasis |
| `text-secondary` | #4A4A4A | Secondary icons, navigation |
| `text-tertiary` | #6B6B6B | Tertiary icons, disabled-like |
| `text-disabled` | #A0A0A0 | Disabled icons |
| `primary-400` | #8FA998 | Active states, primary actions |
| `primary-700` | #506158 | Hover states on primary |
| `white` | #FFFFFF | Icons on dark backgrounds |

### Code Examples

```tsx
// Default - inherits text color
<Calendar size={24} />

// Primary color for active state
<Calendar size={24} color="var(--color-primary-400)" />

// Secondary text color
<User size={24} color="var(--color-text-secondary)" />

// White on dark background
<Bell size={24} color="#FFFFFF" />
```

---

## Optical Alignment

Icons must be **optically aligned**, not mechanically centered.

### Principles

1. **Visual Weight:** Some icons appear heavier - adjust position slightly
2. **Direction:** Arrow icons may need offset in the direction they point
3. **Circular Icons:** May appear lower - shift up 1-2px
4. **Horizontal Balance:** Icons with vertical strokes may need horizontal adjustment

### Examples from Reference Images

```tsx
// Back arrow - optically centered with text
<ArrowLeft size={24} style={{ marginRight: 8, position: 'relative', top: '-1px' }} />
<span>Invoice</span>

// Circular icon button (from reference images)
// Icon optically centered in circular container
<div className="icon-button">
  <List size={24} style={{ position: 'relative', left: '0.5px' }} />
</div>
```

---

## Icon + Text Combinations

### Horizontal Layout (Icon Before Text)

```tsx
<div className="icon-text">
  <Calendar size={20} weight="regular" />
  <span>Schedule Event</span>
</div>
```

```css
.icon-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.icon-text svg {
  flex-shrink: 0;
  position: relative;
  top: -1px; /* Optical adjustment */
}
```

### Vertical Layout (Icon Above Text)

```tsx
<div className="icon-text-vertical">
  <Calendar size={32} weight="regular" />
  <span>Calendar</span>
</div>
```

```css
.icon-text-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-8);
}
```

### Icon Button Pattern (from reference images)

Circular white buttons with icons:

```tsx
<button className="icon-button">
  <List size={24} weight="regular" />
</button>
```

```css
.icon-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.icon-button:hover {
  background-color: var(--color-lin-1);
  box-shadow: var(--shadow-md);
}

.icon-button svg {
  color: var(--color-text-primary);
}
```

---

## Common Icon Mappings

### App Features from Reference Images

Based on the reference images, here are the icon mappings:

| Feature | Icon Name | Weight | Size | Notes |
|---------|-----------|--------|------|-------|
| Back/Return | `ArrowLeft` | Regular | 24px | Navigation header |
| Menu | `List` | Regular | 24px | Hamburger menu |
| More Options | `DotsThree` | Regular | 24px | Three dots menu |
| Invoice/Receipt | `Receipt` | Regular | 24px | Financial documents |
| Account/Building | `Buildings` | Regular | 24px | Company/account |
| Invoice Number | `Hash` | Regular | 24px | Number identifier |
| Status | `CircleNotch` | Regular | 24px | Loading/status |
| Paid Status | `CheckCircle` | Regular | 24px | Green status card icon |
| Credits | `CreditCard` | Regular | 24px | Yellow status card icon |
| Calendar | `Calendar` | Regular | 24px | Date/scheduling |
| Time/Clock | `Hourglass` | Regular | 24px | Time remaining |
| Search | `MagnifyingGlass` | Regular | 24px | Search functionality |
| Filter | `Funnel` | Regular | 24px | Filter/sort |
| Create/Add | `Plus` | Regular | 24px | Add new item |
| Phone | `Phone` | Regular | 20px | Activity card icon |
| Email | `Envelope` | Regular | 20px | Activity card icon |
| Chat | `ChatCircle` | Regular | 20px | Activity card icon |
| Edit | `PencilSimple` | Regular | 20px | Edit action |
| Delete | `X` | Regular | 20px | Remove/close |
| Image | `Image` | Regular | 20px | Image placeholder |
| Notification Badge | `Circle` | Fill | 8px | Red notification dot |

### Navigation Icons (Bottom Bar - from reference images)

```tsx
// Bottom navigation (circular buttons)
const BottomNav = () => (
  <nav className="bottom-nav">
    <button className="nav-icon-button">
      <List size={24} weight="regular" />
    </button>
    <button className="nav-icon-button">
      <Receipt size={24} weight="regular" />
    </button>
    <button className="nav-icon-button">
      <SquaresFour size={24} weight="regular" />
    </button>
    <button className="nav-icon-button">
      <PencilSimple size={24} weight="regular" />
    </button>
    <button className="nav-icon-button">
      <X size={24} weight="regular" />
    </button>
  </nav>
);
```

### Status Icons

```tsx
// Success
<CheckCircle size={20} weight="bold" color="var(--color-success-base)" />

// Warning
<Warning size={20} weight="bold" color="var(--color-warning-base)" />

// Error
<XCircle size={20} weight="bold" color="var(--color-error-base)" />

// Info
<Info size={20} weight="regular" color="var(--color-info-base)" />
```

### Pet/Animal Icons (for pet management app)

```tsx
import { Dog, Cat, Bird, Fish, Horse } from 'phosphor-react';

<Dog size={32} weight="regular" color="var(--color-primary-400)" />
<Cat size={32} weight="regular" color="var(--color-primary-400)" />
<Bird size={32} weight="regular" />
<Fish size={32} weight="regular" />
<Horse size={32} weight="regular" />
```

---

## Emoji Replacement Strategy

**Critical Rule:** Never use emojis in the UI. Always replace with Phosphor icons.

### Common Emoji to Icon Mappings

| Emoji | Phosphor Icon | Context |
|-------|---------------|---------|
| ✅ | `CheckCircle` | Success, completed |
| ❌ | `XCircle` | Error, canceled |
| ⚠️ | `Warning` | Warning, caution |
| ℹ️ | `Info` | Information |
| 📅 | `Calendar` | Dates, scheduling |
| 🔔 | `Bell` | Notifications |
| ⏰ | `Clock` | Time, reminders |
| 📧 | `Envelope` | Email |
| 📞 | `Phone` | Phone calls |
| 💬 | `ChatCircle` | Messages, chat |
| 🏠 | `House` | Home |
| 👤 | `User` | User profile |
| ⚙️ | `Gear` | Settings |
| 🔍 | `MagnifyingGlass` | Search |
| ➕ | `Plus` | Add, create |
| ❤️ | `Heart` | Favorites, likes |
| ⭐ | `Star` | Featured, rating |
| 📊 | `ChartBar` | Analytics, stats |
| 💰 | `CurrencyDollar` | Money, payments |
| 🐕 | `Dog` | Dog |
| 🐈 | `Cat` | Cat |

**Why no emojis:**
- Inconsistent rendering across platforms
- No control over color or size
- Breaks visual cohesion
- Accessibility issues
- Not professional for enterprise apps

---

## Icon States

### Default State

```tsx
<Calendar
  size={24}
  weight="regular"
  color="var(--color-text-secondary)"
/>
```

### Hover State

```tsx
<Calendar
  size={24}
  weight="regular"
  color="var(--color-primary-500)"
/>
```

```css
.icon-interactive {
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.icon-interactive:hover {
  color: var(--color-primary-500);
}
```

### Active State

```tsx
<Calendar
  size={24}
  weight="bold"
  color="var(--color-primary-400)"
/>
```

### Disabled State

```tsx
<Calendar
  size={24}
  weight="regular"
  color="var(--color-text-disabled)"
  opacity={0.5}
/>
```

### Focus State

```css
.icon-button:focus {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
  border-radius: var(--radius-full);
}
```

---

## Icon Spacing & Layout

### Icon Margins

```css
/* Icon before text */
.icon-before {
  margin-right: var(--spacing-8);
}

/* Icon after text */
.icon-after {
  margin-left: var(--spacing-8);
}

/* Icon above text */
.icon-above {
  margin-bottom: var(--spacing-8);
}

/* Icon below text */
.icon-below {
  margin-top: var(--spacing-8);
}
```

### Icon in Buttons

```tsx
// Primary button with icon
<button className="button-primary">
  <Plus size={20} weight="bold" />
  <span>Create</span>
</button>
```

```css
.button-primary {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-24);
}
```

### Icon in List Items

```tsx
<li className="list-item">
  <Receipt size={20} />
  <span>Invoice #4905</span>
  <ArrowRight size={16} />
</li>
```

```css
.list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  padding: var(--spacing-16);
}

.list-item svg:last-child {
  margin-left: auto;
  opacity: 0.5;
}
```

---

## Accessibility Considerations

### Icon Labels

**Always provide labels** for icons used without text:

```tsx
// With accessible label
<button aria-label="Open menu">
  <List size={24} />
</button>

// With sr-only text
<button>
  <List size={24} />
  <span className="sr-only">Open menu</span>
</button>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### ARIA Attributes

```tsx
// Decorative icon (aria-hidden)
<span aria-hidden="true">
  <Calendar size={20} />
</span>
<span>Schedule</span>

// Interactive icon button
<button aria-label="Search invoices">
  <MagnifyingGlass size={24} />
</button>
```

### Touch Targets

Minimum 44x44px touch target for mobile:

```css
.icon-button-mobile {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Keyboard Navigation

```css
.icon-button:focus-visible {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
}
```

---

## Component-Specific Icon Usage

### Circular Icon Buttons (from reference images)

These white circular buttons appear throughout the interface:

```tsx
const CircularIconButton = ({ icon: Icon, label }) => (
  <button className="circular-icon-button" aria-label={label}>
    <Icon size={24} weight="regular" />
  </button>
);
```

```css
.circular-icon-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.circular-icon-button:hover {
  background-color: var(--color-lin-1);
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.circular-icon-button:active {
  transform: scale(0.95);
}

.circular-icon-button svg {
  color: var(--color-text-primary);
}
```

### Status Card Icons (from reference images)

Green "Paid" and Yellow "Credits" cards with icons:

```tsx
// Paid card icon
<div className="status-card-icon">
  <CheckCircle size={24} weight="regular" color="currentColor" />
</div>

// Credits card icon
<div className="status-card-icon">
  <CreditCard size={24} weight="regular" color="currentColor" />
</div>
```

```css
.status-card-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Notification Badges (from reference images)

Small red notification dots with numbers:

```tsx
<div className="icon-with-badge">
  <Bell size={24} />
  <span className="notification-badge">3</span>
</div>
```

```css
.icon-with-badge {
  position: relative;
  display: inline-flex;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background-color: var(--color-error-base);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  padding: 0 4px;
  box-shadow: 0 0 0 2px white;
}
```

### Activity Card Icons (from reference images)

Small circular icons in activity cards:

```tsx
<div className="activity-icon">
  <Phone size={16} weight="bold" />
</div>
```

```css
.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon svg {
  color: var(--color-text-primary);
}
```

---

## Icon Animation

### Subtle Hover

```css
.icon-hover {
  transition: transform var(--transition-fast);
}

.icon-hover:hover {
  transform: scale(1.1);
}
```

### Rotate Animation (Loading)

```tsx
<CircleNotch size={24} className="icon-rotating" />
```

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon-rotating {
  animation: rotate 1s linear infinite;
}
```

### Pulse Animation (Notification)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.icon-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## Icon Do's and Don'ts

### Do's

- **Do** use Phosphor Icons exclusively
- **Do** use Regular weight (1.5px) by default
- **Do** use Bold weight (2px) for emphasis and active states
- **Do** provide accessible labels for icon-only buttons
- **Do** ensure 44x44px minimum touch targets on mobile
- **Do** optically align icons with text
- **Do** use consistent icon sizes within a component
- **Do** replace all emojis with appropriate icons
- **Do** test icons at actual size on mobile devices

### Don'ts

- **Don't** use emojis instead of icons
- **Don't** mix icon libraries (e.g., Phosphor + FontAwesome)
- **Don't** use Thin or Light weights (too faint)
- **Don't** use icons smaller than 16px
- **Don't** mechanically center - use optical alignment
- **Don't** use icons without accessible labels when standalone
- **Don't** use Fill weight unless specifically needed
- **Don't** animate icons excessively (keep it subtle)

---

## Icon Testing Checklist

Before shipping icons:

- [ ] All icons from Phosphor library (no emojis)
- [ ] Icon sizes consistent within components
- [ ] Icons have accessible labels when standalone
- [ ] Touch targets are 44x44px minimum on mobile
- [ ] Icons optically aligned with text
- [ ] Hover/focus states defined for interactive icons
- [ ] Icons render correctly at all sizes
- [ ] Icon colors meet contrast requirements
- [ ] Icons tested on mobile devices
- [ ] No mixing of icon libraries

---

## Icon Resources

### Official Documentation
- **Phosphor Icons:** https://phosphoricons.com/
- **React Package:** https://github.com/phosphor-icons/react
- **React Native Package:** https://github.com/duongdev/phosphor-react-native

### Installation
```bash
# Web
pnpm add phosphor-react

# Mobile
npx expo install phosphor-react-native
```

### Figma Plugin
- Install "Phosphor Icons" plugin in Figma
- Sync icons directly from Figma to code

---

**Last updated:** 2025-11-16
**Version:** 1.0.0
**Maintained by:** Design System Team