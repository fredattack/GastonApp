# Layout System
## GastonApp Design System - Layout Foundations

The GastonApp layout system ensures consistent, responsive, and natural layouts across web, mobile, and landing page applications. Every layout promotes clear hierarchy, generous breathing room, and intuitive navigation.

---

## Layout Philosophy

**Spacious — Hierarchical — Responsive — Organic**

Every layout decision reinforces:
- Generous white space and breathing room
- Clear visual hierarchy with natural flow
- Mobile-first responsive approach
- Consistent grid and spacing systems
- Organic, never rigid or mechanical

---

## Grid Systems

### Base Grid Units

| Platform | Baseline Grid | Usage |
|----------|---------------|-------|
| **Mobile App** | 4px | All spacing, sizing, alignment |
| **Web App** | 8px | Desktop layouts, components |
| **Landing Page** | 12px | Marketing content, hero sections |

All measurements should be multiples of the baseline grid.

### Spacing Scale

```css
--spacing-4: 4px;    /* Micro spacing */
--spacing-8: 8px;    /* Small gaps */
--spacing-12: 12px;  /* Compact spacing */
--spacing-16: 16px;  /* Component gaps */
--spacing-20: 20px;  /* Section spacing */
--spacing-24: 24px;  /* Card padding */
--spacing-32: 32px;  /* Section gaps */
--spacing-40: 40px;  /* Large sections */
--spacing-48: 48px;  /* Hero spacing */
--spacing-64: 64px;  /* Page sections */
--spacing-80: 80px;  /* Landing sections */
--spacing-96: 96px;  /* Large gaps */
--spacing-128: 128px; /* Hero sections */
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 0px;      /* Mobile portrait */
--breakpoint-sm: 576px;    /* Mobile landscape */
--breakpoint-md: 768px;    /* Tablet portrait */
--breakpoint-lg: 1024px;   /* Tablet landscape, small desktop */
--breakpoint-xl: 1280px;   /* Desktop */
--breakpoint-2xl: 1536px;  /* Large desktop */
```

### Media Query Usage

```css
/* Mobile first - default styles are for mobile */
.container {
  padding: var(--spacing-20);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-32);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-40);
  }
}
```

---

## Container Widths

### Mobile App
- **Full Width:** 100% of viewport
- **Content Width:** 100% with padding
- **Padding:** 20px left/right

### Web App
- **Small:** 640px (forms, modals)
- **Medium:** 768px (content pages)
- **Large:** 1024px (dashboards)
- **Extra Large:** 1280px (full-width views)
- **Padding:** 40px left/right on desktop

### Landing Page
- **Narrow:** 720px (text content)
- **Medium:** 1024px (feature sections)
- **Wide:** 1280px (hero sections)
- **Full:** 100% (background sections)

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-page-padding-mobile);
  padding-right: var(--spacing-page-padding-mobile);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--spacing-page-padding-web);
    padding-right: var(--spacing-page-padding-web);
  }
}

.container-sm {
  max-width: 640px;
}

.container-md {
  max-width: 768px;
}

.container-lg {
  max-width: 1024px;
}

.container-xl {
  max-width: 1280px;
}
```

---

## Page Templates

### Mobile App - Pet Profile Screen (from reference images)

**Layout Structure:**
```
┌────────────────────────────┐
│ ← Pet Profile [avatar]  ⋯ │ ← Header (fixed)
├────────────────────────────┤
│                            │
│   12 Upcoming Events       │ ← Hero count
│                            │
│   [Pet Name] [Breed] [Age] │ ← Meta info grid
│                            │
│   [Vaccinated] [Active] [Healthy] ← Status cards
│                            │
│   Book Event (button)      │ ← Primary action
│                            │
├────────────────────────────┤
│ [○] [○] [○] [○] [○]       │ ← Bottom nav (fixed)
└────────────────────────────┘
```

```tsx
<div className="mobile-page">
  {/* Fixed header */}
  <header className="page-header">
    <button className="back-button" aria-label="Go back">
      <ArrowLeft size={24} />
    </button>
    <h1>Pet Profile</h1>
    <img src="/avatar.jpg" alt="User" className="avatar" />
    <button className="more-button" aria-label="More options">
      <DotsThree size={24} />
    </button>
  </header>

  {/* Scrollable content */}
  <main className="page-content">
    {/* Event count display */}
    <div className="count-hero">
      <span className="count">12</span>
      <span className="label">Upcoming Events</span>
    </div>

    {/* Meta grid */}
    <div className="meta-grid">
      {/* Meta items */}
    </div>

    {/* Status cards */}
    <div className="status-cards">
      {/* Vertical pill cards */}
    </div>

    {/* Primary button */}
    <button className="button-primary">Book Event</button>
  </main>

  {/* Fixed bottom navigation */}
  <nav className="bottom-nav">
    {/* Navigation buttons */}
  </nav>
</div>
```

```css
.mobile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #B8F4DC 0%, #FFFFFF 50%, #F4F1E8 100%);
  display: flex;
  flex-direction: column;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  padding: var(--spacing-16) var(--spacing-20);
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  box-shadow: var(--shadow-sm);
}

.page-content {
  flex: 1;
  padding: calc(64px + var(--spacing-20)) var(--spacing-20) calc(80px + var(--spacing-20));
  overflow-y: auto;
}

.count-hero {
  text-align: center;
  margin-bottom: var(--spacing-32);
}

.count-hero .count {
  font-size: 56px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-number);
  display: block;
}

.count-hero .label {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-8);
  display: block;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-32);
}

.status-cards {
  display: flex;
  gap: var(--spacing-12);
  margin-bottom: var(--spacing-32);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Mobile App - List View (Pet Events)

```
┌────────────────────────────┐
│ ← My Pets                 │ ← Header
├────────────────────────────┤
│ 5 Pets           🔍  ⋯    │ ← Count + search/filter
├────────────────────────────┤
│ [img] Golden Retriever     │ ← List item
│       Vaccinated • 3 yrs ⋯ │
├────────────────────────────┤
│ [img] Siamese Cat          │
│       Active • 2 yrs    ⋯  │
├────────────────────────────┤
│ [img] Beagle               │
│       Healthy • 5 yrs   ⋯  │
└────────────────────────────┘
```

```css
.list-view {
  padding: var(--spacing-20);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-20);
}

.list-count {
  font-size: 32px;
  font-weight: var(--font-weight-semibold);
}

.list-count-label {
  font-size: 16px;
  color: var(--color-text-tertiary);
  margin-left: var(--spacing-8);
}

.list-actions {
  display: flex;
  gap: var(--spacing-12);
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}
```

### Mobile App - Activity View

```
┌────────────────────────────┐
│ Activity                   │ ← Header
├────────────────────────────┤
│ ⊕ Create 📅 💬 🐾 ✉      │ ← Action buttons
├────────────────────────────┤
│ Upcoming          12 Events │
├────────────────────────────┤
│ ┌──────────────────────┐  │
│ │ 12 Feb  Vet         │  │ ← Activity card (purple)
│ │ at 2pm  Appointment  │  │
│ │ [avatar] Max...      │  │
│ └──────────────────────┘  │
├────────────────────────────┤
│ ┌──────────────────────┐  │
│ │ 13 Feb  Grooming     │  │ ← Activity card (yellow)
│ │ at 10am Session      │  │
│ │ [avatar] Bella...    │  │
│ └──────────────────────┘  │
└────────────────────────────┘
```

```css
.activity-view {
  padding: var(--spacing-20);
}

.activity-actions {
  display: flex;
  gap: var(--spacing-12);
  margin-bottom: var(--spacing-24);
  align-items: center;
}

.activity-section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-16);
}

.activity-section-title {
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
}

.activity-count {
  font-size: 40px;
  font-weight: var(--font-weight-semibold);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}
```

---

## Web App Layouts

### Dashboard Layout

```
┌──────────────────────────────────────────────┐
│ Logo   Dashboard   Events   Pets   [avatar] │ ← Top nav (fixed)
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Card 1  │  │  Card 2  │  │  Card 3  │ │ ← Card grid
│  └──────────┘  └──────────┘  └──────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐│
│  │        Recent Activity                  ││ ← Full width section
│  └────────────────────────────────────────┘│
│                                              │
└──────────────────────────────────────────────┘
```

```css
.dashboard-layout {
  min-height: 100vh;
  background-color: var(--color-lin-2);
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background-color: white;
  padding: var(--spacing-16) var(--spacing-40);
  display: flex;
  align-items: center;
  gap: var(--spacing-32);
  box-shadow: var(--shadow-sm);
}

.dashboard-content {
  padding: calc(64px + var(--spacing-40)) var(--spacing-40) var(--spacing-40);
  max-width: 1280px;
  margin: 0 auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-24);
  margin-bottom: var(--spacing-40);
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Two-Column Layout (Detail + Sidebar)

```
┌────────────────────────────────────┐
│  Main Content   │   Sidebar       │
│                 │                  │
│  [Details]      │   [Actions]     │
│                 │   [Info]        │
│                 │   [Related]     │
└────────────────────────────────────┘
```

```css
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-24);
}

@media (min-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 2fr 1fr;
  }
}

.main-column {
  background-color: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-32);
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-20);
}
```

---

## Landing Page Layouts

### Hero Section

```
┌─────────────────────────────────────────┐
│                                         │
│         Welcome to GastonApp            │ ← Centered hero
│    Manage your pet care with ease       │
│                                         │
│         [Get Started] [Learn More]      │ ← CTA buttons
│                                         │
└─────────────────────────────────────────┘
```

```css
.hero-section {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-64) var(--spacing-24);
  background: linear-gradient(135deg, #B8F4DC 0%, #E8D9F5 100%);
}

.hero-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-24);
  color: var(--color-text-primary);
}

.hero-subtitle {
  font-size: clamp(18px, 2.5vw, 24px);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-40);
  max-width: 600px;
}

.hero-cta {
  display: flex;
  gap: var(--spacing-16);
  flex-wrap: wrap;
  justify-content: center;
}
```

### Feature Grid

```
┌────────────────────────────────────────┐
│            Features                    │
├────────┬────────┬────────┬────────────┤
│ [Icon] │ [Icon] │ [Icon] │ [Icon]     │
│ Title  │ Title  │ Title  │ Title      │
│ Desc   │ Desc   │ Desc   │ Desc       │
└────────┴────────┴────────┴────────────┘
```

```css
.features-section {
  padding: var(--spacing-80) var(--spacing-24);
  background-color: var(--color-lin-0);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-40);
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-item {
  text-align: center;
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-16);
  background-color: var(--color-primary-100);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
}
```

---

## Safe Areas & Margins

### Mobile Safe Areas

```css
/* Account for notches and system UI */
.mobile-page {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Additional padding for fixed elements */
.page-header {
  padding-top: calc(env(safe-area-inset-top) + var(--spacing-16));
}

.bottom-nav {
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--spacing-16));
}
```

### Content Margins

```css
/* Mobile */
.content-section {
  margin-bottom: var(--spacing-32);
}

/* Desktop */
@media (min-width: 1024px) {
  .content-section {
    margin-bottom: var(--spacing-64);
  }
}
```

---

## Scrolling & Overflow

### Horizontal Scrolling (Status Cards from reference images)

```css
.horizontal-scroll {
  display: flex;
  gap: var(--spacing-12);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--spacing-8);
}

.horizontal-scroll::-webkit-scrollbar {
  height: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background-color: var(--color-lin-6);
  border-radius: var(--radius-full);
}

.horizontal-scroll > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

### Vertical Scrolling

```css
.scrollable-content {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  -webkit-overflow-scrolling: touch;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: var(--color-lin-6);
  border-radius: var(--radius-full);
}
```

---

## Layout Patterns from Reference Images

### Gradient Background Pattern

The reference images show a distinctive mint-to-lavender gradient background:

```css
.app-background {
  background: linear-gradient(180deg, #B8F4DC 0%, #FFFFFF 50%, #F4F1E8 100%);
  min-height: 100vh;
}

/* Alternative diagonal gradient */
.app-background-diagonal {
  background: linear-gradient(135deg, #B8F4DC 0%, #E8D9F5 100%);
}
```

### Card Container with Gradient Background

```css
.card-container {
  background: linear-gradient(180deg, rgba(184, 244, 220, 0.3) 0%, rgba(244, 241, 232, 0) 100%);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-24);
}
```

---

## Z-Index Layering

```css
:root {
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;      /* Headers, bottom nav */
  --z-fixed: 1200;       /* FABs */
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  --z-notification: 1700;
}

.page-header {
  z-index: var(--z-sticky);
}

.bottom-nav {
  z-index: var(--z-sticky);
}

.fab {
  z-index: var(--z-fixed);
}

.modal {
  z-index: var(--z-modal);
}
```

---

## Accessibility Considerations

### Focus Management

```css
/* Skip to main content link */
.skip-to-main {
  position: absolute;
  top: -100px;
  left: 0;
  background-color: var(--color-primary-400);
  color: white;
  padding: var(--spacing-12) var(--spacing-20);
  z-index: var(--z-maximum);
  border-radius: var(--radius-md);
}

.skip-to-main:focus {
  top: var(--spacing-16);
  left: var(--spacing-16);
}
```

### Keyboard Navigation

```css
/* Visible focus indicators */
*:focus-visible {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* Focus within containers */
.card:focus-within {
  box-shadow: var(--shadow-lg), 0 0 0 3px rgba(143, 169, 152, 0.2);
}
```

---

## Layout Do's and Don'ts

### Do's

- **Do** use mobile-first responsive design
- **Do** maintain consistent spacing using design tokens
- **Do** provide generous white space and breathing room
- **Do** ensure fixed navigation doesn't overlap content
- **Do** use gradient backgrounds from the design system
- **Do** test layouts on actual devices
- **Do** account for safe areas on mobile
- **Do** use semantic HTML for proper structure

### Don'ts

- **Don't** use fixed pixel values - use spacing tokens
- **Don't** create rigid, cramped layouts
- **Don't** ignore mobile viewports
- **Don't** use more than 3 columns on mobile
- **Don't** forget about horizontal scrolling affordances
- **Don't** overlap interactive elements
- **Don't** use harsh grid lines or dividers

---

## Layout Testing Checklist

Before shipping layouts:

- [ ] Responsive at all breakpoints (320px to 1920px)
- [ ] Content readable on mobile (16px minimum text)
- [ ] Touch targets are 44px minimum on mobile
- [ ] Fixed headers/footers don't overlap content
- [ ] Horizontal scrolling has visual indicators
- [ ] Gradients render smoothly on all devices
- [ ] Safe areas respected on iOS/Android
- [ ] Keyboard navigation works properly
- [ ] Focus indicators visible on all interactive elements
- [ ] Layout tested on actual devices (not just browser resize)

---

**Last updated:** 2025-11-16
**Version:** 1.0.0
**Maintained by:** Design System Team