# Component Library
## GastonApp Design System - Component Specifications

This document provides comprehensive specifications for all UI components in the GastonApp design system. Each component includes anatomy, variants, states, accessibility guidelines, and implementation examples.

---

## Component Philosophy

**Consistent — Accessible — Responsive — Natural**

Every component adheres to:
- WCAG AA accessibility standards minimum
- Mobile-first responsive design
- Natural, organic feel with soft shadows
- Consistent spacing and visual rhythm
- Touch-friendly interactions (44px minimum)

---

## Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Inputs & Forms](#inputs--forms)
4. [Badges & Pills](#badges--pills)
5. [Avatars](#avatars)
6. [Navigation](#navigation)
7. [List Items](#list-items)
8. [Icon Buttons](#icon-buttons)
9. [Status Cards](#status-cards)
10. [Activity Cards](#activity-cards)
11. [Containers & Sections](#containers--sections)
12. [Overlays & Modals](#overlays--modals)

---

## Buttons

### Anatomy

```
┌──────────────────────────────┐
│  [Icon] Button Text  [Icon]  │ ← 48px height (min)
└──────────────────────────────┘
   ↑              ↑
   24px        24px
   padding     padding
```

### Primary Button (Pill-shaped, Black - from reference images)

**Visual:** Black pill-shaped button with white text

```tsx
<button className="button-primary">
  Book Event
</button>
```

```css
.button-primary {
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-full); /* Pill shape */
  padding: 14px 32px;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  min-height: 48px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.button-primary:hover {
  background-color: #1A1A1A;
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.button-primary:focus-visible {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
}

.button-primary:disabled {
  background-color: var(--color-lin-5);
  color: var(--color-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}
```

**States:**
- **Default:** Black background, white text, medium shadow
- **Hover:** Slightly lighter (#1A1A1A), larger shadow, lift -1px
- **Pressed:** No lift, smaller shadow
- **Focus:** Primary color ring, 3px width
- **Disabled:** Light grey, no shadow, not-allowed cursor

**Accessibility:**
- Minimum height: 48px (touch-friendly)
- Minimum contrast: 21:1 (black on white - AAA)
- Focus ring visible
- `aria-disabled` when disabled

### Secondary Button

**Visual:** White background with primary color border

```tsx
<button className="button-secondary">
  Cancel
</button>
```

```css
.button-secondary {
  background-color: white;
  color: var(--color-primary-700);
  border: 2px solid var(--color-primary-400);
  border-radius: var(--radius-full);
  padding: 12px 32px;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  min-height: 48px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.button-secondary:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-500);
}

.button-secondary:active {
  background-color: var(--color-primary-100);
}
```

### Ghost Button

**Visual:** Transparent background, colored text

```tsx
<button className="button-ghost">
  <Plus size={20} weight="bold" />
  <span>Create</span>
</button>
```

```css
.button-ghost {
  background-color: transparent;
  color: var(--color-primary-700);
  border: none;
  padding: 12px 20px;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-8);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.button-ghost:hover {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}
```

### Floating Action Button (FAB)

**Visual:** Circular button for primary action

```tsx
<button className="fab" aria-label="Add new item">
  <Plus size={24} weight="bold" />
</button>
```

```css
.fab {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-400);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-fixed);
}

.fab:hover {
  background-color: var(--color-primary-500);
  box-shadow: var(--shadow-xl);
  transform: scale(1.05);
}

.fab:active {
  transform: scale(0.95);
}
```

### Button Sizes

| Size | Height | Padding X | Padding Y | Font Size |
|------|--------|-----------|-----------|-----------|
| Small | 40px | 20px | 10px | 14px |
| Medium | 48px | 24px | 12px | 16px |
| Large | 56px | 32px | 16px | 18px |

### Button Do's and Don'ts

**Do's:**
- Use pill-shaped (fully rounded) buttons for primary actions
- Maintain minimum 48px height for touch targets
- Provide clear, action-oriented labels
- Use icons with text for clarity
- Ensure sufficient contrast (WCAG AA minimum)

**Don'ts:**
- Don't use more than one primary button per screen section
- Don't use small buttons on mobile (<40px height)
- Don't use vague labels like "OK" or "Submit"
- Don't forget focus states for keyboard navigation

---

## Cards

### Standard Card (from reference images)

**Visual:** White background, rounded corners, soft shadow

```tsx
<div className="card">
  <h3 className="card-title">Pet Profile</h3>
  <div className="card-content">
    {/* Card content */}
  </div>
</div>
```

```css
.card {
  background-color: white;
  border-radius: var(--radius-xl); /* 20px */
  padding: var(--spacing-24);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-16);
}

.card-content {
  color: var(--color-text-secondary);
}
```

### Glassmorphism Card with Stripes (from reference images)

**Visual:** Semi-transparent white background with vertical stripe pattern

```tsx
<div className="card-glass">
  <div className="card-glass-content">
    <span className="label">Upcoming Events</span>
    <span className="value">12</span>
  </div>
</div>
```

```css
.card-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-20);
  box-shadow: var(--shadow-inner-glass), var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.card-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(143, 169, 152, 0.08) 2px,
    rgba(143, 169, 152, 0.08) 4px
  );
  pointer-events: none;
}

.card-glass-content {
  position: relative;
  z-index: 1;
}
```

### Pet/Event List Item Card (from reference images)

**Visual:** Horizontal card with pet/item image, details, additional info

```tsx
<div className="pet-item-card">
  <img src="/pet.png" alt="Golden Retriever" className="item-image" />
  <div className="item-details">
    <h4 className="item-name">Golden Retriever</h4>
    <p className="item-meta">Vaccinated • 3 years</p>
  </div>
  <div className="item-badge">
    <span className="badge badge-success">Active</span>
  </div>
  <button className="item-options" aria-label="More options">
    <DotsThree size={20} />
  </button>
</div>
```

```css
.pet-item-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
  background-color: white;
  padding: var(--spacing-16);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-12);
}

.item-image {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.item-meta {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.item-badge {
  display: flex;
  align-items: center;
}
```

---

## Status Cards (Vertical Pills - from reference images)

### Vaccinated Status Card (Green)

**Visual:** Vertical pill shape, mint green gradient, checkmark icon, rotated text

```tsx
<div className="status-card status-card-vaccinated">
  <div className="status-card-icon">
    <CheckCircle size={24} weight="regular" />
  </div>
  <span className="status-card-label">Vaccinated</span>
</div>
```

```css
.status-card {
  width: 80px;
  height: 240px;
  border-radius: var(--radius-2xl); /* 24px */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
  box-shadow: var(--shadow-md);
  position: relative;
}

.status-card-vaccinated {
  background: linear-gradient(180deg, #B8F4DC 0%, #7CEDC3 100%);
}

.status-card-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.7);
}

.status-card-label {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: rgba(0, 0, 0, 0.8);
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  letter-spacing: 0.08em;
}
```

### Appointments Status Card (Yellow)

```css
.status-card-appointments {
  background: linear-gradient(180deg, #FFF9CC 0%, #FFE88C 100%);
}
```

### Primary Status Card (Eucalyptus Green)

```css
.status-card-primary {
  background: linear-gradient(180deg, #C7D7CF 0%, #8FA998 100%);
}
```

### Secondary Status Card (Golden Honey)

```css
.status-card-secondary {
  background: linear-gradient(180deg, #E8D4BA 0%, #D4A574 100%);
}
```

**Variants:**
- `status-card-vaccinated`: Mint green gradient (health status)
- `status-card-appointments`: Yellow gradient (upcoming events)
- `status-card-primary`: Eucalyptus green gradient (primary status)
- `status-card-secondary`: Golden honey gradient (secondary status)
- Custom colors can use `--gradient-activity-*` tokens

---

## Activity Cards (from reference images)

### Activity Card with Gradient

**Visual:** Rounded card with gradient background, avatar, date, title, description

```tsx
<div className="activity-card activity-card-vet">
  <div className="activity-header">
    <div className="activity-date">
      <span className="day">12</span>
      <span className="month">Feb</span>
      <span className="time">at 2 pm</span>
    </div>
    <div className="activity-icon-circle">
      <Stethoscope size={16} weight="bold" />
    </div>
  </div>
  <h4 className="activity-title">Vet Appointment</h4>
  <div className="activity-user">
    <img src="/avatar.jpg" alt="Dr. Sarah Johnson" className="activity-avatar" />
    <p className="activity-description">Annual checkup for Max</p>
  </div>
</div>
```

```css
.activity-card {
  border-radius: var(--radius-xl);
  padding: var(--spacing-20);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.activity-card-vet {
  background: linear-gradient(135deg, #E8D9F5 0%, #D1B3E8 100%);
}

.activity-card-grooming {
  background: linear-gradient(135deg, #FFF9CC 0%, #FFE88C 100%);
}

.activity-card-training {
  background: linear-gradient(135deg, #FFD4C4 0%, #FFB59A 100%);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-12);
}

.activity-date {
  display: flex;
  flex-direction: column;
}

.activity-date .day {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.activity-date .month {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.activity-date .time {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.activity-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-title {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-12);
}

.activity-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.activity-description {
  font-size: 14px;
  color: var(--color-text-secondary);
}
```

---

## Icon Buttons (Circular - from reference images)

### Circular White Icon Button

**Visual:** 48px circular button, white background, soft shadow

```tsx
<button className="icon-button" aria-label="Open menu">
  <List size={24} weight="regular" />
</button>
```

```css
.icon-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
}

.icon-button:hover {
  background-color: var(--color-lin-1);
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.icon-button:active {
  transform: scale(0.95);
}

.icon-button:focus-visible {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* With notification badge */
.icon-button-with-badge {
  position: relative;
}

.icon-button-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background-color: var(--color-error-base);
  color: white;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 0 0 2px white;
}
```

---

## Inputs & Forms

### Text Input

```tsx
<div className="input-group">
  <label htmlFor="email" className="input-label">Email</label>
  <input
    type="email"
    id="email"
    className="input-text"
    placeholder="Enter your email"
  />
</div>
```

```css
.input-group {
  margin-bottom: var(--spacing-20);
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
}

.input-text {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
  background-color: var(--color-lin-1);
  border: 2px solid var(--color-lin-5);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-height: 48px;
}

.input-text:hover {
  border-color: var(--color-lin-6);
}

.input-text:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
}

.input-text::placeholder {
  color: var(--color-text-hint);
}

.input-text:disabled {
  background-color: var(--color-lin-3);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

/* Error state */
.input-text.error {
  border-color: var(--color-error-base);
}

.input-text.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}
```

### Search Input (from reference images)

```tsx
<div className="search-input">
  <MagnifyingGlass size={20} weight="regular" />
  <input type="search" placeholder="Search pets or events..." />
</div>
```

```css
.search-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: 12px 16px;
  background-color: var(--color-lin-1);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-input svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-input input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--color-text-primary);
  outline: none;
}

.search-input input::placeholder {
  color: var(--color-text-hint);
}

.search-input:focus-within {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
}
```

---

## Badges & Pills

### Status Badge

```tsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Inactive</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.badge-success {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
  border: 1px solid var(--color-success-base);
}

.badge-warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
  border: 1px solid var(--color-warning-base);
}

.badge-error {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
  border: 1px solid var(--color-error-base);
}
```

### Notification Badge (Red Circle with Number)

```tsx
<div className="icon-with-badge">
  <Bell size={24} />
  <span className="notification-count">3</span>
</div>
```

```css
.icon-with-badge {
  position: relative;
  display: inline-flex;
}

.notification-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background-color: var(--color-error-base);
  color: white;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 0 0 2px white;
}
```

---

## Avatars

### Circular Avatar (from reference images)

```tsx
<img src="/user.jpg" alt="Jessi Johnson" className="avatar" />
<div className="avatar-placeholder">JJ</div>
```

```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

/* Sizes */
.avatar-sm {
  width: 32px;
  height: 32px;
}

.avatar-md {
  width: 40px;
  height: 40px;
}

.avatar-lg {
  width: 56px;
  height: 56px;
}

.avatar-xl {
  width: 80px;
  height: 80px;
}

/* Placeholder with initials */
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}
```

---

## Navigation

### Bottom Navigation (from reference images)

**Visual:** Row of circular white icon buttons

```tsx
<nav className="bottom-nav">
  <button className="nav-button" aria-label="Menu">
    <List size={24} weight="regular" />
  </button>
  <button className="nav-button" aria-label="Events">
    <Calendar size={24} weight="regular" />
  </button>
  <button className="nav-button" aria-label="Dashboard">
    <SquaresFour size={24} weight="regular" />
  </button>
  <button className="nav-button nav-button-active" aria-label="Pets">
    <PawPrint size={24} weight="regular" />
  </button>
  <button className="nav-button" aria-label="Profile">
    <User size={24} weight="regular" />
  </button>
</nav>
```

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(244, 241, 232, 0) 0%, rgba(244, 241, 232, 0.95) 20%, rgba(244, 241, 232, 1) 100%);
  padding: var(--spacing-20) var(--spacing-24) var(--spacing-24);
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: var(--spacing-12);
  z-index: var(--z-sticky);
}

.nav-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.nav-button:hover {
  background-color: var(--color-lin-1);
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.nav-button-active {
  background-color: var(--color-primary-400);
  color: white;
}

.nav-button-active:hover {
  background-color: var(--color-primary-500);
}
```

---

## Component Testing Checklist

Before shipping components:

- [ ] All interactive elements have 44px minimum touch target
- [ ] Focus states visible for keyboard navigation
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Components work on mobile and desktop
- [ ] Hover states defined for interactive elements
- [ ] Disabled states are visually clear
- [ ] Aria labels provided for icon-only buttons
- [ ] Components scale properly across breakpoints
- [ ] Shadows are soft and organic (no harsh black)
- [ ] Border radius consistent with design tokens

---

**Last updated:** 2025-11-16
**Version:** 1.0.0
**Maintained by:** Design System Team