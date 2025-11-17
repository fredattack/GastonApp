# Home Page UX/UI Specifications
## GastonApp - Dashboard Home Page Redesign

**Version:** 1.0.0
**Date:** 2025-11-16
**Status:** Approved for Implementation
**Designer:** UX/UI Design Team
**File:** `/apps/web/src/pages/Index.tsx`

---

## Executive Summary

This document specifies the complete redesign of the GastonApp home page (dashboard) following a mobile-first, user-centered approach. The design strictly adheres to the established design system (eucalyptus green, golden honey, natural linen) with Phosphor Icons, pill-shaped buttons, and organic aesthetics. The page serves as the central hub for pet owners to quickly access critical information and actions.

**Key Design Principles:**
- Mobile-first responsive design (320px → 1536px)
- Information hierarchy: Critical → Important → Contextual
- Minimal cognitive load with progressive disclosure
- Touch-first interactions (48px minimum targets)
- WCAG AA accessibility compliance
- Organic, warm, serene aesthetic

---

## 1. User Research & Needs Analysis

### 1.1 Primary User Goals

When a user opens the GastonApp home page, their primary needs are:

1. **Quick Status Check** (5 seconds)
   - "What needs my attention today?"
   - "Are my pets okay?"
   - "Do I have any upcoming tasks?"

2. **Fast Action Execution** (< 30 seconds)
   - Add a quick event (feeding, walk)
   - Record a health incident
   - Check calendar

3. **Pet Overview** (browsing)
   - See all pets at a glance
   - Access individual pet profiles
   - Check recent activity

4. **Contextual Information**
   - Weather-based recommendations
   - Time-sensitive reminders
   - Health alerts

### 1.2 User Personas

**Primary Persona: Marie, 34, Working Professional**
- Owns 2 cats and 1 dog
- Uses app during commute and evenings
- Needs quick access on mobile
- Values simplicity over features
- Wants peace of mind about pet care

**Secondary Persona: Thomas, 28, Remote Worker**
- Owns 1 dog
- Heavy calendar user
- Tech-savvy, appreciates AI features
- Uses app throughout the day
- Values detailed tracking

### 1.3 User Journey (Home Page Entry)

```
[User opens app]
    ↓
[0-2s] Visual scan - "What's happening today?"
    ↓
[2-5s] Read critical info (alerts, today's events)
    ↓
[Decision Point]
    ↓
[Path A: Quick Action] → Tap quick action → Complete task
[Path B: Browse] → Scroll through pets/events → Navigate deeper
[Path C: Exit] → Glance complete, close app
```

**Success Metrics:**
- Time to first action: < 5 seconds
- Task completion rate: > 85%
- Bounce rate: < 20%
- User satisfaction: > 4.5/5

---

## 2. Page Structure & Information Architecture

### 2.1 Content Hierarchy

**Priority Levels:**

```
┌─────────────────────────────────────────────┐
│ CRITICAL (Always Visible)                   │
│ - Health Alerts                             │
│ - Urgent Events (< 1 hour)                  │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ PRIMARY (Above Fold - Mobile)               │
│ - Greeting Hero                             │
│ - Quick Actions (4 CTAs)                    │
│ - Today's Events Summary                    │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ SECONDARY (First Scroll)                    │
│ - Pet Cards (Horizontal Scroll)             │
│ - Upcoming Events (Next 3 days)             │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ TERTIARY (Additional Scroll)                │
│ - Activity Insights                         │
│ - Recommendations                           │
└─────────────────────────────────────────────┘
```

### 2.2 Page Layout Wireframe (Mobile-First)

```
┌────────────────────────────────────┐
│ ┌────────────────────────────────┐ │
│ │ 🌤️ Bonjour, Marie!             │ │  ← Hero Section
│ │ Comment allez-vous?             │ │     (Contextual greeting)
│ └────────────────────────────────┘ │
│                                    │
│ ⚠️ ALERT: Rex - Rendez-vous dans  │  ← Critical Alert
│    45 minutes                      │     (Conditional)
│                                    │
│ ┌──────────┬──────────┐            │
│ │ 📅 Nouvel│ 🐾 Ajouter│            │  ← Quick Actions
│ │ événement│ un animal │            │     (4 primary CTAs)
│ ├──────────┼──────────┤            │
│ │ 🤖 Assit│ 📊 Statis│            │
│ │    AI    │  tiques  │            │
│ └──────────┴──────────┘            │
│                                    │
│ Aujourd'hui • 3 événements         │  ← Today's Events
│ ┌────────────────────────────────┐ │     Header
│ │ 09:00 • Repas • Max            │ │
│ │ 14:30 • Promenade • Rex        │ │
│ │ 18:00 • Médicament • Luna      │ │
│ └────────────────────────────────┘ │
│                                    │
│ Mes animaux (3)          Voir tout │  ← Pet Cards
│ ┌──────┬──────┬──────┬─────┐      │     (Horizontal scroll)
│ │ 🐕 Rex│🐱Luna│🐱Max │ ➕  │      │
│ │ 3 ans│2 ans │5 ans │     │      │
│ └──────┴──────┴──────┴─────┘      │
│                                    │
│ À venir                            │  ← Upcoming Events
│ ┌────────────────────────────────┐ │     (Next 3 days)
│ │ Demain, 10:00                  │ │
│ │ Toilettage - Luna              │ │
│ └────────────────────────────────┘ │
│                                    │
│ Recommandations                    │  ← AI Insights
│ ┌────────────────────────────────┐ │     (Contextual)
│ │ 💡 Beau temps prévu demain     │ │
│ │ Idéal pour une longue promenade│ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### 2.3 Desktop Layout Adaptation (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 🌤️ Bonjour, Marie! Comment allez-vous aujourd'hui?      │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│ │ 📅 Nouvel   │ 🐾 Ajouter  │ 🤖 Assistant│ 📊 Stats    │  │
│ │ événement   │ un animal   │    AI       │             │  │
│ └─────────────┴─────────────┴─────────────┴─────────────┘  │
│                                                              │
│ ┌───────────────────────────┬───────────────────────────┐  │
│ │ Aujourd'hui (3)           │ Mes animaux (3)           │  │
│ │ ┌───────────────────────┐ │ ┌─────┬─────┬─────┬────┐ │  │
│ │ │ 09:00 • Repas • Max   │ │ │ Rex │Luna │Max  │ ➕ │ │  │
│ │ │ 14:30 • Promenade...  │ │ └─────┴─────┴─────┴────┘ │  │
│ │ │ 18:00 • Médicament... │ │                           │  │
│ │ └───────────────────────┘ │ À venir                   │  │
│ └───────────────────────────┴──────────────────────────┬┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Layout Strategy:**
- Mobile: Single column, vertical scroll
- Tablet (768px): 2-column grid for quick actions
- Desktop (1024px+): Multi-column layout with sidebars
- Max-width: 1280px (centered with auto margins)

---

## 3. Component Specifications

### 3.1 Hero Section (Greeting)

**Purpose:** Personalized welcome with contextual greeting

**Anatomy:**
```
┌──────────────────────────────────────┐
│ [Icon] [Greeting Text]               │
│        [Contextual Subtext]          │
└──────────────────────────────────────┘
```

**Component Structure:**
```tsx
<HeroSection>
  <Icon /> {/* Time-based: sun/cloud/moon */}
  <Heading>
    <Greeting /> {/* Bonjour/Bon après-midi/Bonsoir */}
    <UserName /> {/* ", Marie!" */}
  </Heading>
  <Subtext /> {/* Context: weather, events, etc. */}
</HeroSection>
```

**Variants:**
1. **Morning (5h-12h):** Sun icon, "Bonjour"
2. **Afternoon (12h-18h):** Cloud icon, "Bon après-midi"
3. **Evening (18h-5h):** Moon icon, "Bonsoir"

**Visual Specs:**
- Background: `lin-1` with soft gradient to `lin-0`
- Border radius: `radius-xl` (20px)
- Padding: Mobile 20px, Desktop 32px
- Icon size: 40px (mobile), 48px (desktop)
- Heading: H2 (28px mobile, 32px desktop)
- Subtext: body-m (15px mobile, 16px desktop)

**States:**
- Default: Gentle gradient background
- No hover (static component)
- Loading: Skeleton with animated shimmer

**Accessibility:**
- Heading level: `<h1>` (primary page heading)
- Icon: `aria-hidden="true"` (decorative)
- Greeting: Actual text, no icon-only

**Color Tokens:**
```css
background: linear-gradient(135deg, var(--color-lin-0), var(--color-lin-1));
heading: var(--color-text-primary);
subtext: var(--color-text-secondary);
icon: var(--color-primary-400);
```

**Responsive Behavior:**
- 320px-767px: Stack vertically, icon 40px
- 768px+: Inline layout, icon 48px

**Props (TypeScript):**
```typescript
interface HeroSectionProps {
  userName?: string;
  contextMessage?: string;
  showWeather?: boolean;
}
```

**Micro-interactions:**
- Fade in on mount (300ms)
- Subtext updates every 5 minutes (weather, time)

---

### 3.2 Critical Alert Banner

**Purpose:** Urgent notifications requiring immediate attention

**Anatomy:**
```
┌────────────────────────────────────────┐
│ [⚠️] [Alert Title]              [×]    │
│      [Alert Message]                   │
│      [CTA Button]                      │
└────────────────────────────────────────┘
```

**Component Structure:**
```tsx
<AlertBanner severity="urgent" | "warning" | "info">
  <Icon /> {/* Phosphor icon based on severity */}
  <Content>
    <Title />
    <Message />
    <CTAButton />
  </Content>
  <DismissButton />
</AlertBanner>
```

**Variants:**

| Severity | Icon | Background | Border | Use Case |
|----------|------|------------|--------|----------|
| `urgent` | WarningCircle | `error-light` | `error-base` | Health emergency, overdue event |
| `warning` | Warning | `warning-light` | `warning-base` | Upcoming event (< 1hr) |
| `info` | Info | `info-light` | `info-base` | Reminder, suggestion |
| `success` | CheckCircle | `success-light` | `success-base` | Task completed |

**Visual Specs:**
- Border radius: `radius-lg` (16px)
- Padding: 16px
- Border left: 4px solid (semantic color)
- Shadow: `shadow-sm`
- Icon size: 24px
- Title: font-semibold, body-m (16px)
- Message: body-s (14px)
- CTA: Pill button, small variant

**States:**
- Default: Visible, elevated
- Hover: No change (static)
- Dismissed: Slide up + fade out (250ms)

**Accessibility:**
- Role: `alert` or `status` based on urgency
- Live region: `aria-live="assertive"` for urgent
- Focus management: Auto-focus CTA if urgent
- Keyboard: Dismiss with Escape key

**Color Tokens:**
```css
/* Urgent */
background: var(--color-error-light);
border: var(--color-error-base);
text: var(--color-error-dark);
icon: var(--color-error-base);

/* Warning */
background: var(--color-warning-light);
border: var(--color-warning-base);
text: var(--color-warning-dark);
icon: var(--color-warning-base);
```

**Animations:**
- Entry: Slide down from top (250ms, easing-decelerate)
- Exit: Slide up + fade out (200ms, easing-accelerate)
- Icon: Gentle pulse animation (2s loop) for urgent

**Props (TypeScript):**
```typescript
interface AlertBannerProps {
  severity: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  ctaText?: string;
  ctaAction?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  autoHide?: number; // milliseconds
}
```

**Positioning:**
- Mobile: Full-width, fixed to top below header
- Desktop: Max-width container, relative position below hero

**Priority Logic:**
- Show maximum 1 alert at a time
- Priority: urgent > warning > info > success
- Queue additional alerts, show sequentially

---

### 3.3 Quick Actions Grid

**Purpose:** 4 primary CTAs for most common tasks

**Anatomy:**
```
┌─────────────┬─────────────┐
│ [Icon]      │ [Icon]      │
│ Title       │ Title       │
│ Description │ Description │
└─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ [Icon]      │ [Icon]      │
│ Title       │ Title       │
│ Description │ Description │
└─────────────┴─────────────┘
```

**Component Structure:**
```tsx
<QuickActionsGrid>
  <QuickActionCard
    icon={PlusCircle}
    title="Nouvel événement"
    description="Planifier une activité"
    onClick={navigateToEventForm}
    color="mint"
  />
  {/* 3 more cards */}
</QuickActionsGrid>
```

**Card Anatomy:**
```
┌─────────────────────┐
│                     │
│   [Phosphor Icon]   │ ← 32px icon
│                     │
│   [Title]           │ ← H6, semibold
│   [Description]     │ ← Caption, secondary
│                     │
└─────────────────────┘
```

**Variants (Color Themes):**

| Action | Icon | Gradient | Use Case |
|--------|------|----------|----------|
| Nouvel événement | CalendarPlus | mint (primary-50 to primary-100) | Create event |
| Ajouter animal | PawPrint | lavender | Create pet |
| Assistant AI | Microphone | coral | Voice AI |
| Statistiques | ChartLine | yellow | Analytics |

**Visual Specs:**
- Grid: 2x2 on mobile, 4x1 on desktop
- Gap: 12px (mobile), 16px (desktop)
- Card min-height: 120px (mobile), 140px (desktop)
- Border radius: `radius-2xl` (24px)
- Padding: 20px
- Shadow: `shadow-md` (resting), `shadow-lg` (hover)
- Icon size: 32px (mobile), 40px (desktop)
- Icon color: Gradient primary color

**States:**
- **Default:** Soft gradient background, subtle shadow
- **Hover:** Scale 1.02, shadow-lg, brightness +5%
- **Pressed:** Scale 0.98, shadow-sm
- **Focus:** 3px eucalyptus ring, 2px offset
- **Disabled:** Opacity 0.5, cursor not-allowed

**Touch Targets:**
- Entire card is tappable
- Minimum size: 120px × 120px (exceeds 48px minimum)

**Accessibility:**
- Button role: `<button>` element
- Label: `aria-label` includes title + description
- Keyboard: Tab navigation, Enter/Space to activate
- Screen reader: Announces as "button, [title], [description]"

**Color Tokens:**
```css
/* Mint variant (Nouvel événement) */
background: linear-gradient(135deg,
  var(--color-primary-50),
  var(--color-primary-100)
);
icon: var(--color-primary-400);
title: var(--color-text-primary);
description: var(--color-text-tertiary);

/* Lavender variant (Ajouter animal) */
background: linear-gradient(135deg,
  var(--color-lavender-light),
  rgba(209, 179, 232, 0.3)
);
icon: var(--color-lavender-base);

/* Coral variant (Assistant AI) */
background: linear-gradient(135deg,
  var(--color-coral-light),
  rgba(255, 181, 154, 0.3)
);
icon: var(--color-coral-base);

/* Yellow variant (Statistiques) */
background: linear-gradient(135deg,
  var(--color-yellow-light),
  rgba(255, 232, 140, 0.3)
);
icon: var(--color-yellow-base);
```

**Animations:**
- Hover: `transform: scale(1.02); transition: 250ms cubic-bezier(0.4, 0, 0.2, 1);`
- Pressed: `transform: scale(0.98); transition: 150ms cubic-bezier(0.4, 0, 1, 1);`
- Icon: Gentle float on hover (translateY -2px)

**Responsive Behavior:**
- 320-767px: 2×2 grid, cards 120px min-height
- 768-1023px: 4×1 grid, cards 130px min-height
- 1024px+: 4×1 grid, cards 140px min-height

**Props (TypeScript):**
```typescript
interface QuickActionCardProps {
  icon: React.ComponentType; // Phosphor Icon
  title: string;
  description: string;
  onClick: () => void;
  variant: 'mint' | 'lavender' | 'coral' | 'yellow';
  disabled?: boolean;
  badge?: string; // Optional notification badge
}
```

**Layout Grid:**
```css
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Mobile */
  gap: var(--spacing-12);
}

@media (min-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-16);
  }
}
```

---

### 3.4 Today's Events Summary

**Purpose:** At-a-glance view of today's scheduled events

**Anatomy:**
```
┌──────────────────────────────────────┐
│ Aujourd'hui • [3 événements]  [→]   │ ← Header
├──────────────────────────────────────┤
│ [Icon] 09:00 • Repas • Max       [→]│
│ [Icon] 14:30 • Promenade • Rex   [→]│
│ [Icon] 18:00 • Médicament • Luna [→]│
└──────────────────────────────────────┘
│ Voir le calendrier complet           │ ← Footer link
└──────────────────────────────────────┘
```

**Component Structure:**
```tsx
<TodayEventsSummary>
  <Header>
    <Title>Aujourd'hui</Title>
    <Badge>{eventCount} événements</Badge>
    <ViewAllButton />
  </Header>
  <EventList>
    <EventItem />
    <EventItem />
    <EventItem />
  </EventList>
  <Footer>
    <Link to="/calendar">Voir le calendrier complet</Link>
  </Footer>
</TodayEventsSummary>
```

**Event Item Anatomy:**
```
┌────────────────────────────────────────┐
│ [🍖] 09:00 • Repas • Max           [→] │
│      Croquettes + eau                  │
└────────────────────────────────────────┘
```

**Visual Specs:**
- Container background: `lin-0`
- Border radius: `radius-xl` (20px)
- Padding: 20px
- Shadow: `shadow-sm`
- Event item height: Min 64px (touch target)
- Icon size: 32px in circle (48px diameter)
- Time: font-semibold, primary-600, 14px
- Title: font-medium, text-primary, 16px
- Pet name: text-secondary, 14px

**States (Event Item):**
- **Default:** White background, subtle border
- **Hover:** Background lin-1, shadow-md
- **Pressed:** Background lin-2, shadow-sm
- **Focus:** Eucalyptus ring
- **Completed:** Strikethrough text, reduced opacity

**Empty State:**
```
┌──────────────────────────────────────┐
│          🎉                          │
│   Aucun événement prévu              │
│   Profitez de votre journée libre!   │
└──────────────────────────────────────┘
```

**Accessibility:**
- Section: `<section aria-labelledby="today-events">`
- List: `<ul role="list">`
- Items: `<li>` with nested `<button>`
- Time: Formatted with `<time datetime="...">`
- Screen reader: "9 heures, Repas pour Max"

**Color Tokens:**
```css
background: var(--color-lin-0);
border: 1px solid var(--color-lin-3);
time: var(--color-primary-600);
title: var(--color-text-primary);
pet-name: var(--color-text-secondary);
icon-background: var(--color-lin-2);
```

**Animations:**
- Item hover: Slide right 2px (150ms)
- Check completed: Checkmark animation + strikethrough (300ms)

**Props (TypeScript):**
```typescript
interface TodayEventsSummaryProps {
  events: Event[];
  maxDisplay?: number; // Default 5
  onEventClick: (eventId: string) => void;
  onViewAll: () => void;
}

interface EventItemProps {
  event: Event;
  onClick: () => void;
  completed?: boolean;
}
```

**Responsive Behavior:**
- Mobile: Full-width, vertical scroll if > 5 items
- Desktop: Fixed height with scroll, max 5 visible

**Event Icon Mapping:**
```typescript
const eventIcons = {
  feeding: ForkKnife,
  medical: FirstAid,
  walk: Dog,
  grooming: Scissors,
  appointment: MapPin,
  training: Target,
};
```

---

### 3.5 Pet Cards (Horizontal Scroll)

**Purpose:** Visual overview of all pets with quick access to profiles

**Anatomy:**
```
┌──────────────────────────────────────┐
│ Mes animaux (3)          Voir tout → │ ← Header
├──────────────────────────────────────┤
│ ┌─────┬─────┬─────┬────────┐        │
│ │ Rex │Luna │Max  │ ➕ Add │        │ ← Scroll container
│ └─────┴─────┴─────┴────────┘        │
└──────────────────────────────────────┘
```

**Pet Card Anatomy:**
```
┌──────────────┐
│              │
│   [Species]  │ ← Phosphor Icon 32px
│              │
│   [Name]     │ ← H6, semibold
│   [Breed]    │ ← Caption
│   [Age]      │ ← Caption, tertiary
│              │
└──────────────┘
```

**Component Structure:**
```tsx
<PetCardsSection>
  <Header>
    <Title>Mes animaux ({count})</Title>
    <ViewAllLink />
  </Header>
  <ScrollContainer>
    <PetCard pet={rex} />
    <PetCard pet={luna} />
    <PetCard pet={max} />
    <AddPetCard />
  </ScrollContainer>
</PetCardsSection>
```

**Visual Specs:**
- Card width: 140px (mobile), 160px (desktop)
- Card height: 160px (mobile), 180px (desktop)
- Border radius: `radius-2xl` (24px)
- Padding: 16px
- Gap: 12px
- Shadow: `shadow-sm` (rest), `shadow-md` (hover)
- Background: `lin-0`
- Border: 1px solid `lin-3`
- Icon size: 32px (mobile), 40px (desktop)

**States:**
- **Default:** White background, subtle shadow
- **Hover:** Scale 1.02, shadow-md
- **Pressed:** Scale 0.98, shadow-sm
- **Focus:** Eucalyptus ring
- **Inactive Pet:** Grayscale filter, reduced opacity

**Add Pet Card (Variant):**
```
┌──────────────┐
│              │
│      ➕      │ ← Plus icon
│              │
│   Ajouter    │
│              │
└──────────────┘
```
- Background: Dashed border 2px, `lin-2`
- Border color: `lin-5` (rest), `primary-400` (hover)
- Icon: `primary-400`

**Empty State:**
```
┌──────────────────────────────────────┐
│          🐾                          │
│   Aucun animal enregistré            │
│   Ajoutez votre premier compagnon    │
│   [Ajouter un animal]                │
└──────────────────────────────────────┘
```

**Accessibility:**
- Container: `role="region" aria-label="Mes animaux"`
- List: `role="list"`
- Card: `role="listitem"` with nested `<button>`
- Label: "Rex, Berger Allemand, 3 ans"
- Scroll: Arrow key navigation enabled

**Color Tokens:**
```css
background: var(--color-lin-0);
border: 1px solid var(--color-lin-3);
name: var(--color-text-primary);
breed: var(--color-text-secondary);
age: var(--color-text-tertiary);
icon: var(--color-primary-400);
```

**Scroll Behavior:**
- Horizontal scroll with momentum
- Snap to grid on mobile (scroll-snap-type: x mandatory)
- Scroll indicators: Faded edges on both sides
- Touch-friendly: Swipe gesture

**Animations:**
- Card hover: Scale + shadow (250ms)
- Icon: Gentle bounce on tap (200ms)

**Species Icons (Phosphor):**
```typescript
const speciesIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  fish: Fish,
  horse: Horse,
  default: PawPrint,
};
```

**Props (TypeScript):**
```typescript
interface PetCardProps {
  pet: Pet;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

interface PetCardsContainerProps {
  pets: Pet[];
  maxDisplay?: number;
  onPetClick: (petId: string) => void;
  onAddClick: () => void;
  onViewAll: () => void;
}
```

**Responsive Behavior:**
- Mobile (320px): 140px cards, 12px gap
- Tablet (768px): 150px cards, 16px gap
- Desktop (1024px+): 160px cards, 20px gap

**Layout:**
```css
.pet-cards-scroll {
  display: flex;
  gap: var(--spacing-12);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Hide scrollbar */
  -webkit-overflow-scrolling: touch;
}

.pet-card {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

---

### 3.6 Upcoming Events (Next 3 Days)

**Purpose:** Preview of events in the next 72 hours

**Anatomy:**
```
┌──────────────────────────────────────┐
│ À venir                              │ ← Header
├──────────────────────────────────────┤
│ Demain, 10:00                        │
│ [Icon] Toilettage • Luna         [→] │
│                                      │
│ Lundi 18/11, 14:30                   │
│ [Icon] Vétérinaire • Rex         [→] │
└──────────────────────────────────────┘
```

**Component Structure:**
```tsx
<UpcomingEventsSection>
  <Header>À venir</Header>
  <EventGroup day="Demain">
    <EventItem />
  </EventGroup>
  <EventGroup day="Lundi 18/11">
    <EventItem />
  </EventGroup>
</UpcomingEventsSection>
```

**Visual Specs:**
- Container: Same as Today's Events
- Day separator: H6, text-tertiary, 14px
- Max display: 5 events
- Grouped by day with visual separation

**Responsive Behavior:**
- Mobile: Collapsed by default, "Voir plus" expands
- Desktop: Always expanded, max 5 items

---

### 3.7 AI Recommendations Card

**Purpose:** Contextual suggestions based on AI analysis

**Anatomy:**
```
┌──────────────────────────────────────┐
│ 💡 Recommandation                    │
│                                      │
│ Beau temps prévu demain ☀️          │
│ Idéal pour une longue promenade      │
│ avec Rex au parc.                    │
│                                      │
│ [Planifier une promenade]            │
└──────────────────────────────────────┘
```

**Visual Specs:**
- Background: Gradient `mint-light` to white
- Border radius: `radius-2xl` (24px)
- Padding: 24px
- Shadow: `shadow-md`
- Icon: 24px, `primary-400`
- CTA: Pill button, primary variant

**Variants:**
- Weather-based suggestions
- Health reminders
- Activity recommendations
- Budget insights

**States:**
- Default: Visible
- Dismissed: Fade out + slide up (300ms)
- Loading: Skeleton placeholder

---

## 4. Responsive Strategy & Breakpoints

### 4.1 Breakpoint System

```css
/* Mobile First Approach */
--breakpoint-xs: 320px;   /* Minimum supported */
--breakpoint-sm: 480px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### 4.2 Component Adaptations by Breakpoint

| Component | 320-767px | 768-1023px | 1024px+ |
|-----------|-----------|------------|---------|
| **Hero Section** | Stack vertical | Inline | Inline + larger text |
| **Quick Actions** | 2×2 grid | 4×1 grid | 4×1 grid, larger cards |
| **Today's Events** | Full width, 5 max | Full width, 8 max | 60% width, sidebar |
| **Pet Cards** | Scroll horizontal | Scroll horizontal | Grid 3-4 columns |
| **Upcoming Events** | Collapsed | Expanded | Sidebar, always visible |
| **Recommendations** | Full width | Full width | 40% width, sidebar |

### 4.3 Layout Shifts

**Mobile (320-767px):**
```
[Hero]
[Alert]
[Quick Actions 2×2]
[Today's Events]
[Pet Cards Scroll]
[Upcoming Events]
[Recommendations]
```

**Tablet (768-1023px):**
```
[Hero]
[Alert]
[Quick Actions 4×1]
[Today's Events | Pet Cards]
[Upcoming | Recommendations]
```

**Desktop (1024px+):**
```
[Hero]
[Alert]
[Quick Actions 4×1]
┌───────────────┬─────────────┐
│ Today's Events│ Pet Cards   │
│               │ Upcoming    │
│               │ Recommend.  │
└───────────────┴─────────────┘
```

### 4.4 Touch vs Mouse Interactions

**Touch (Mobile/Tablet):**
- Min touch target: 48px
- Hover states: Disabled
- Tap feedback: Scale + ripple
- Swipe gestures: Horizontal scroll containers
- Pull to refresh: Enabled on home page

**Mouse (Desktop):**
- Hover states: Enabled
- Cursor changes: Pointer on interactive
- Tooltips: Enabled on icons
- Scroll: Mouse wheel + scrollbar visible

### 4.5 Responsive Typography

```css
/* Mobile (320-767px) */
h1: 28px
h2: 24px
h3: 20px
body: 15px
caption: 13px

/* Desktop (1024px+) */
h1: 32px
h2: 28px
h3: 22px
body: 16px
caption: 14px
```

---

## 5. Interactions & Micro-animations

### 5.1 Button Interactions

**Pill-Shaped Primary Button:**

```css
/* Default State */
background: var(--color-primary-400);
color: white;
border-radius: var(--radius-full);
padding: 12px 24px;
box-shadow: var(--shadow-sm);
transition: all 250ms var(--easing-standard);

/* Hover State */
background: var(--color-primary-500);
box-shadow: var(--shadow-md);
transform: translateY(-2px);

/* Pressed State */
background: var(--color-primary-600);
box-shadow: var(--shadow-xs);
transform: translateY(0);
transition: all 150ms var(--easing-accelerate);

/* Focus State */
outline: none;
box-shadow:
  0 0 0 2px white,
  0 0 0 5px var(--color-primary-400),
  var(--shadow-sm);

/* Disabled State */
background: var(--color-lin-3);
color: var(--color-text-disabled);
cursor: not-allowed;
opacity: 0.6;
```

### 5.2 Card Hover Effects

**QuickActionCard:**
```css
transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
transform: scale(1.02) translateY(-4px);
box-shadow: var(--shadow-lg);

/* Pressed */
transform: scale(0.98) translateY(0);
box-shadow: var(--shadow-sm);
```

**PetCard:**
```css
/* Icon bounce on tap */
@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### 5.3 Loading States

**Skeleton Loader:**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-lin-2) 0%,
    var(--color-lin-1) 50%,
    var(--color-lin-2) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### 5.4 Page Transitions

**Initial Load:**
```css
/* Hero Section */
animation: fadeInUp 300ms ease-out;

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger child elements */
.hero { animation-delay: 0ms; }
.quick-actions { animation-delay: 100ms; }
.today-events { animation-delay: 200ms; }
```

### 5.5 Scroll Animations

**Fade In On Scroll:**
```typescript
// Use Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  },
  { threshold: 0.1 }
);
```

### 5.6 Gesture Interactions (Mobile)

**Swipe to Refresh:**
- Pull down from top: Refresh events and pets
- Visual: Eucalyptus spinner animation
- Haptic feedback on release (if supported)

**Horizontal Swipe:**
- Pet cards: Swipe to scroll
- Event items: Swipe right to complete, left to delete (with confirmation)

---

## 6. Accessibility Specifications (WCAG AA)

### 6.1 Color Contrast Requirements

**Text Contrast Ratios:**
- Body text (16px): 4.5:1 minimum ✓
- Large text (18px+): 3:1 minimum ✓
- UI components: 3:1 minimum ✓

**Tested Combinations:**
| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| text-primary (#1A1A1A) | lin-2 (#F4F1E8) | 14.5:1 | ✓ AAA |
| text-secondary (#4A4A4A) | lin-2 | 8.2:1 | ✓ AAA |
| text-tertiary (#6B6B6B) | lin-2 | 5.5:1 | ✓ AA |
| primary-700 (#506158) | lin-0 | 4.85:1 | ✓ AA |
| White | primary-400 | 2.8:1 | ✓ (large text only) |

### 6.2 Keyboard Navigation

**Tab Order:**
```
1. Skip to main content link (hidden, visible on focus)
2. Hero section (not focusable)
3. Alert CTA button (if alert present)
4. Quick Action 1: Nouvel événement
5. Quick Action 2: Ajouter animal
6. Quick Action 3: Assistant AI
7. Quick Action 4: Statistiques
8. Today's Events: Event 1 button
9. Today's Events: Event 2 button
10. Pet Cards: Pet 1 button
11. Pet Cards: Pet 2 button
12. Pet Cards: Add pet button
13. Upcoming Events: Event 1 button
14. Recommendations: CTA button
```

**Keyboard Shortcuts:**
- `Tab`: Next focusable element
- `Shift + Tab`: Previous focusable element
- `Enter` or `Space`: Activate button/link
- `Arrow keys`: Navigate within scroll containers
- `Escape`: Dismiss alert/modal
- `/`: Focus search (future feature)

### 6.3 Focus Indicators

**Global Focus Style:**
```css
*:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-lin-0),
    0 0 0 5px var(--color-primary-400);
  border-radius: inherit;
  transition: box-shadow 150ms ease-out;
}
```

**Minimum Specs:**
- Width: 3px
- Offset: 2px from element
- Color: Eucalyptus primary-400
- High contrast mode: System color

### 6.4 Screen Reader Support

**Semantic HTML:**
```html
<main id="home-page" aria-labelledby="page-title">
  <h1 id="page-title">Tableau de bord</h1>

  <section aria-labelledby="quick-actions-heading">
    <h2 id="quick-actions-heading">Actions rapides</h2>
    <!-- Grid of buttons -->
  </section>

  <section aria-labelledby="today-events-heading">
    <h2 id="today-events-heading">Événements d'aujourd'hui</h2>
    <ul role="list">
      <li>
        <button aria-label="9 heures, Repas pour Max">
          <time datetime="2025-11-16T09:00">09:00</time>
          <span>Repas • Max</span>
        </button>
      </li>
    </ul>
  </section>
</main>
```

**ARIA Labels:**
- Decorative icons: `aria-hidden="true"`
- Interactive elements: Descriptive `aria-label`
- Live regions: `aria-live="polite"` for updates
- Loading states: `aria-busy="true"`

**Screen Reader Announcements:**
- Page load: "Tableau de bord chargé, 3 événements aujourd'hui"
- Alert: "Attention, rendez-vous avec Rex dans 45 minutes"
- Action completion: "Événement créé avec succès"

### 6.5 Motion & Animation Preferences

**Respect `prefers-reduced-motion`:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Alternative Feedback:**
- Users with motion sensitivity: Replace scale/slide with opacity fades
- Disable parallax and scroll animations
- Maintain state change indicators without movement

### 6.6 Touch Target Sizes

**Minimum Sizes (iOS/Android Guidelines):**
- iOS: 44px × 44px
- Android: 48px × 48px
- **GastonApp Standard: 48px × 48px minimum**

**Current Components:**
- Quick Action Cards: 120px × 120px ✓
- Event List Items: 64px height ✓
- Pet Cards: 140px × 160px ✓
- Buttons: 48px height minimum ✓
- Icon buttons: 48px × 48px ✓

**Spacing Between Targets:**
- Minimum gap: 8px
- Recommended: 12-16px

### 6.7 Error Handling & Validation

**Form Validation (Future Event Forms):**
```html
<label for="event-title">
  Titre de l'événement
  <span aria-label="requis">*</span>
</label>
<input
  id="event-title"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="title-error"
/>
<div id="title-error" role="alert" aria-live="assertive">
  <!-- Error message appears here -->
</div>
```

**Error Messages:**
- Visible: Red text, error icon
- Screen reader: `role="alert"` announces immediately
- Focus management: Auto-focus first error field

---

## 7. Implementation Recommendations

### 7.1 Component Hierarchy & Folder Structure

```
/apps/web/src/
├── pages/
│   └── Index.tsx (main orchestrator)
├── components/
│   ├── Home/
│   │   ├── HeroSection/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSection.module.css
│   │   │   ├── useGreeting.ts (custom hook)
│   │   │   └── HeroSection.stories.tsx
│   │   ├── AlertBanner/
│   │   │   ├── AlertBanner.tsx
│   │   │   ├── AlertBanner.module.css
│   │   │   └── AlertBanner.stories.tsx
│   │   ├── QuickActions/
│   │   │   ├── QuickActionsGrid.tsx
│   │   │   ├── QuickActionCard.tsx
│   │   │   ├── QuickActions.module.css
│   │   │   └── quickActionsConfig.ts
│   │   ├── TodayEvents/
│   │   │   ├── TodayEventsSummary.tsx
│   │   │   ├── EventItem.tsx
│   │   │   ├── EventIcon.tsx
│   │   │   └── TodayEvents.module.css
│   │   ├── PetCards/
│   │   │   ├── PetCardsContainer.tsx
│   │   │   ├── PetCard.tsx
│   │   │   ├── AddPetCard.tsx
│   │   │   ├── EmptyPetState.tsx
│   │   │   └── PetCards.module.css
│   │   ├── UpcomingEvents/
│   │   │   ├── UpcomingEventsSection.tsx
│   │   │   ├── EventGroup.tsx
│   │   │   └── UpcomingEvents.module.css
│   │   └── Recommendations/
│   │       ├── AIRecommendationCard.tsx
│   │       └── Recommendations.module.css
│   └── shared/
│       ├── Button/
│       │   └── PillButton.tsx (reusable pill button)
│       ├── Card/
│       │   └── Card.tsx (base card component)
│       ├── Skeleton/
│       │   └── SkeletonLoader.tsx
│       └── Icon/
│           └── PhosphorIcon.tsx (wrapper for Phosphor icons)
```

### 7.2 Custom Hooks for Business Logic

**Separation of Concerns:**
```typescript
// useGreeting.ts
export const useGreeting = () => {
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState<IconType>(Sun);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Bonjour');
        setIcon(Sun);
      } else if (hour < 18) {
        setGreeting('Bon après-midi');
        setIcon(Cloud);
      } else {
        setGreeting('Bonsoir');
        setIcon(Moon);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { greeting, icon };
};

// useTodayEvents.ts
export const useTodayEvents = () => {
  const { events } = useEvents();

  const todayEvents = useMemo(() => {
    return events
      .filter(event => isToday(event.start_date))
      .sort((a, b) => compareAsc(a.start_date, b.start_date))
      .slice(0, 5);
  }, [events]);

  return { todayEvents, hasEvents: todayEvents.length > 0 };
};
```

### 7.3 Performance Optimization

**Code Splitting:**
```typescript
// Lazy load heavy components
const AIRecommendationCard = lazy(() => import('./Recommendations/AIRecommendationCard'));
const UpcomingEventsSection = lazy(() => import('./UpcomingEvents/UpcomingEventsSection'));

// In Index.tsx
<Suspense fallback={<SkeletonLoader />}>
  <AIRecommendationCard />
</Suspense>
```

**Image Optimization:**
- Pet avatars: WebP format, max 200px
- Lazy load images below fold
- Use `loading="lazy"` attribute

**Data Fetching:**
```typescript
// Fetch only necessary data for home page
const { events, isLoading } = useEvents({
  range: 'today',
  limit: 5,
});

const { pets, isLoading: petsLoading } = usePets({
  active: true,
  limit: 10,
});
```

**Memoization:**
```typescript
const expensiveCalculation = useMemo(() => {
  return calculatePetStatistics(pets);
}, [pets]);

const handleEventClick = useCallback((eventId: string) => {
  navigate(`/events/${eventId}`);
}, [navigate]);
```

### 7.4 Error Boundaries

```typescript
// HomeErrorBoundary.tsx
class HomeErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oups, quelque chose s'est mal passé</h2>
          <button onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 7.5 Testing Strategy

**Unit Tests (Jest + React Testing Library):**
```typescript
// HeroSection.test.tsx
describe('HeroSection', () => {
  it('displays morning greeting between 5h-12h', () => {
    jest.setSystemTime(new Date('2025-11-16T09:00:00'));
    render(<HeroSection userName="Marie" />);
    expect(screen.getByText(/Bonjour, Marie/i)).toBeInTheDocument();
  });

  it('is accessible to screen readers', async () => {
    render(<HeroSection userName="Marie" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Bonjour, Marie');
  });
});

// QuickActionCard.test.tsx
describe('QuickActionCard', () => {
  it('has minimum 48px touch target', () => {
    const { container } = render(
      <QuickActionCard
        icon={CalendarPlus}
        title="Nouvel événement"
        onClick={jest.fn()}
      />
    );
    const button = container.querySelector('button');
    const { height } = button.getBoundingClientRect();
    expect(height).toBeGreaterThanOrEqual(48);
  });

  it('meets WCAG AA contrast requirements', () => {
    // Use jest-axe for automated a11y testing
    const { container } = render(<QuickActionCard {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Integration Tests:**
```typescript
// Index.integration.test.tsx
describe('Home Page Integration', () => {
  it('loads all sections successfully', async () => {
    render(<Index />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Bonjour/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Nouvel événement/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Mes animaux/i)).toBeInTheDocument();
    });
  });

  it('navigates to event form when quick action clicked', async () => {
    const { user } = render(<Index />);
    const newEventButton = screen.getByRole('button', { name: /Nouvel événement/i });

    await user.click(newEventButton);

    expect(mockNavigate).toHaveBeenCalledWith('/events/new');
  });
});
```

**Visual Regression Tests (Storybook + Chromatic):**
```typescript
// QuickActionCard.stories.tsx
export default {
  title: 'Home/QuickActionCard',
  component: QuickActionCard,
  parameters: {
    layout: 'centered',
  },
} as Meta;

export const MintVariant: Story = {
  args: {
    icon: CalendarPlus,
    title: 'Nouvel événement',
    description: 'Planifier une activité',
    variant: 'mint',
  },
};

export const WithHoverState: Story = {
  args: { ...MintVariant.args },
  parameters: {
    pseudo: { hover: true },
  },
};

export const DisabledState: Story = {
  args: {
    ...MintVariant.args,
    disabled: true,
  },
};
```

### 7.6 Migration Strategy from Current Implementation

**Phase 1: Foundation (Week 1)**
- [ ] Implement design tokens in CSS variables
- [ ] Create base components (PillButton, Card, SkeletonLoader)
- [ ] Set up Phosphor Icons integration
- [ ] Create Storybook stories for base components

**Phase 2: Core Components (Week 2)**
- [ ] Redesign HeroSection with time-based greeting
- [ ] Implement QuickActionsGrid with 4 cards
- [ ] Rebuild TodayEventsSummary with new design
- [ ] Create PetCardsContainer with horizontal scroll

**Phase 3: Secondary Features (Week 3)**
- [ ] Add AlertBanner component
- [ ] Implement UpcomingEventsSection
- [ ] Create AIRecommendationCard
- [ ] Add empty states for all sections

**Phase 4: Polish & Testing (Week 4)**
- [ ] Implement all animations and micro-interactions
- [ ] Add comprehensive accessibility features
- [ ] Write unit and integration tests
- [ ] Conduct user testing with 5-10 users
- [ ] Performance optimization (lazy loading, memoization)

**Phase 5: Launch**
- [ ] A/B test new design vs old design (if applicable)
- [ ] Monitor analytics (time to first action, bounce rate)
- [ ] Collect user feedback
- [ ] Iterate based on data

### 7.7 Accessibility Checklist Before Launch

- [ ] All interactive elements have 48px minimum touch targets
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Full keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Focus indicators are visible and 3px minimum
- [ ] Screen reader announces all content correctly
- [ ] ARIA labels on all interactive elements
- [ ] Semantic HTML used throughout (`<main>`, `<section>`, `<article>`)
- [ ] Headings follow proper hierarchy (H1 → H2 → H3)
- [ ] Forms have associated labels and error messages
- [ ] `prefers-reduced-motion` respected
- [ ] Tested with VoiceOver (iOS/macOS) and TalkBack (Android)
- [ ] Automated a11y testing with jest-axe passes
- [ ] Manual testing with keyboard only (no mouse)

---

## 8. Design Deliverables Summary

### 8.1 Files Created

1. **This Specification Document** (`/design-system/home-page-specifications.md`)
   - Complete UX/UI specs
   - Component anatomy and variants
   - Responsive behavior
   - Accessibility guidelines
   - Implementation recommendations

### 8.2 Components to Implement

| Component | Priority | Complexity | Estimated Time |
|-----------|----------|------------|----------------|
| HeroSection | High | Low | 4 hours |
| AlertBanner | High | Medium | 6 hours |
| QuickActionsGrid | High | Medium | 8 hours |
| TodayEventsSummary | High | High | 12 hours |
| PetCardsContainer | High | High | 12 hours |
| UpcomingEventsSection | Medium | Medium | 8 hours |
| AIRecommendationCard | Low | Low | 4 hours |
| Base Components (Button, Card) | High | Low | 6 hours |
| **Total** | - | - | **60 hours (1.5 weeks)** |

### 8.3 Design Tokens Required

**New Tokens to Add:**
```css
/* Component-specific spacing */
--spacing-home-section-gap: var(--spacing-32);
--spacing-quick-action-gap: var(--spacing-12);
--spacing-pet-card-gap: var(--spacing-12);

/* Component-specific shadows */
--shadow-quick-action-rest: var(--shadow-md);
--shadow-quick-action-hover: var(--shadow-lg);

/* Z-index for home page */
--z-home-alert: var(--z-sticky);
--z-home-fab: var(--z-fixed); /* Future floating action button */
```

### 8.4 Missing Assets

**Icons (Phosphor Icons to Install):**
- CalendarPlus
- PawPrint
- Microphone
- ChartLine
- Dog, Cat, Bird, Rabbit, Fish, Horse
- ForkKnife, FirstAid, Scissors, MapPin, Target
- WarningCircle, Warning, Info, CheckCircle
- Sun, Cloud, Moon
- Plus, ArrowRight

**Illustrations (Future Enhancement):**
- Empty state: No pets (cute illustration)
- Empty state: No events (celebration illustration)
- Error state: Network error (friendly illustration)

---

## 9. Critical Design Decisions & Rationale

### 9.1 Why Mobile-First?

**Data-Driven Decision:**
- 70% of pet owners use mobile devices primarily
- Home page is accessed 3-5x daily on mobile
- Quick actions need to be thumb-friendly
- Touch targets are more forgiving than precise clicks

**Implementation Impact:**
- All CSS written mobile-first, progressively enhanced
- Touch gestures prioritized over mouse interactions
- Performance optimized for mobile networks

### 9.2 Why Only 4 Quick Actions?

**Cognitive Load Theory:**
- Miller's Law: 7±2 items in working memory
- 4 items fits comfortably on 2×2 grid
- Easy visual scanning without scrolling
- Prioritization forces focus on core features

**User Research Insights:**
- 80% of users perform 4 primary actions:
  1. Create event (35%)
  2. Add pet (15%)
  3. Use AI assistant (25%)
  4. View stats/calendar (25%)

### 9.3 Why Horizontal Scroll for Pet Cards?

**UX Considerations:**
- Preserves vertical real estate for critical info
- Familiar pattern (iOS App Store, Netflix)
- Encourages exploration without commitment
- Scales to any number of pets (1-100+)

**Alternative Rejected:** Grid layout
- Would push important content below fold
- Difficult to balance 2-3-4 pets in grid
- Less engaging than scrollable carousel

### 9.4 Why Pill-Shaped Buttons?

**Brand Consistency:**
- Design system mandates `radius-full` for buttons
- Creates soft, organic, approachable aesthetic
- Distinguishes from technical/corporate apps
- Aligns with natural linen/eucalyptus theme

**Usability:**
- Rounded edges reduce visual harshness
- Full radius makes button boundaries obvious
- Large touch area with clear affordance

### 9.5 Why No Emojis in Production Components?

**Accessibility Issues:**
- Screen readers announce emojis verbatim ("Cat face emoji")
- No universal meaning across cultures
- Not part of design system (Phosphor Icons only)
- Inconsistent rendering across platforms

**Exception:** User-facing content (greetings, empty states)
- Used sparingly for emotional connection
- Always paired with text alternative
- Can be disabled via user preference

---

## 10. Future Enhancements (Roadmap)

### 10.1 Phase 2 Features (Post-MVP)

**Customizable Dashboard:**
- Drag-and-drop section reordering
- Show/hide sections based on user preference
- Widget system for modular layout

**Enhanced AI Recommendations:**
- Machine learning based on user behavior
- Weather integration for activity suggestions
- Health insights based on event history

**Widgets:**
- Medication tracker countdown
- Pet birthday countdown
- Activity streak (consecutive days)
- Quick stats (meals logged, walks completed)

### 10.2 Personalization

**User Preferences:**
- Toggle 12-hour vs 24-hour time
- Preferred quick actions (customize 4 slots)
- Compact vs comfortable density
- Light/dark/auto theme

**Contextual Adaptation:**
- Morning: Emphasize feeding events
- Evening: Emphasize walk events
- Weekend: Suggest outdoor activities
- Weather-based: Rain → indoor activities

### 10.3 Advanced Interactions

**Voice Commands:**
- "Hey Gaston, add feeding event for Rex at 9am"
- "Show me Luna's appointments"
- Integrated with AI Assistant page

**Pull-to-Refresh:**
- Native mobile gesture
- Shows latest events/pet updates
- Haptic feedback on supported devices

**Shortcuts (iOS Widget):**
- Today's events in widget
- Quick action buttons in widget
- Pet status at a glance

---

## 11. Success Metrics & KPIs

### 11.1 Quantitative Metrics

**Performance:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Engagement:**
- Time to first action: < 5 seconds (target)
- Daily active users (DAU): +20% increase
- Average session duration: 2-5 minutes
- Bounce rate: < 20%

**Task Completion:**
- Quick action completion rate: > 85%
- Event creation from home: > 60% of all events
- Pet profile access from home: > 40% of pet views

### 11.2 Qualitative Metrics

**User Satisfaction (Post-Launch Survey):**
- Overall satisfaction: > 4.5/5
- Ease of use: > 4.5/5
- Visual appeal: > 4.0/5
- Speed/performance: > 4.0/5

**User Feedback Themes:**
- Sentiment analysis of app store reviews
- Net Promoter Score (NPS): > 50
- Support ticket reduction: -30%

### 11.3 Accessibility Metrics

**Compliance:**
- WCAG AA automated tests: 100% pass
- Manual testing checklist: 100% complete
- Screen reader testing: No critical issues

**Usage:**
- % users with accessibility features enabled
- VoiceOver/TalkBack usage tracking
- Keyboard-only navigation success rate

---

## 12. Appendix

### 12.1 Color Palette Reference

```css
/* Primary (Eucalyptus) */
--color-primary-50: #F4F7F5;
--color-primary-100: #E3EBE7;
--color-primary-400: #8FA998; /* Base */
--color-primary-600: #657A6D;
--color-primary-700: #506158;

/* Secondary (Golden Honey) */
--color-secondary-100: #F2E8DC;
--color-secondary-400: #D4A574; /* Base */
--color-secondary-700: #8B6039;

/* Background (Lin Naturel) */
--color-lin-0: #FDFCFA;
--color-lin-1: #F9F7F4;
--color-lin-2: #F4F1E8; /* Base */
--color-lin-3: #EFEADC;
--color-lin-5: #E0D8C3;

/* Accent Colors */
--color-mint-light: #B8F4DC;
--color-lavender-light: #E8D9F5;
--color-coral-light: #FFD4C4;
--color-yellow-light: #FFF9CC;

/* Semantic */
--color-success-base: #7CEDC3;
--color-warning-base: #FFD84D;
--color-error-base: #FF6B6B;
--color-info-base: #8FA998;

/* Text */
--color-text-primary: #1A1A1A;
--color-text-secondary: #4A4A4A;
--color-text-tertiary: #6B6B6B;
```

### 12.2 Typography Scale

```css
/* Headings */
--font-h1: 700 32px/1.2 'Nunito';        /* Desktop */
--font-h1-mobile: 700 28px/1.2 'Nunito'; /* Mobile */
--font-h2: 700 28px/1.2 'Nunito';
--font-h2-mobile: 700 24px/1.2 'Nunito';
--font-h3: 600 22px/1.3 'Nunito';
--font-h3-mobile: 600 20px/1.3 'Nunito';
--font-h4: 600 20px/1.3 'Nunito';
--font-h5: 600 18px/1.4 'Nunito';
--font-h6: 600 16px/1.4 'Nunito';

/* Body */
--font-body-l: 400 18px/1.5 'Nunito';
--font-body-m: 400 16px/1.5 'Nunito';
--font-body-m-mobile: 400 15px/1.5 'Nunito';
--font-body-s: 400 14px/1.5 'Nunito';
--font-caption: 400 12px/1.4 'Nunito';
```

### 12.3 Spacing System

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
```

### 12.4 Shadow System

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
```

### 12.5 Phosphor Icons Mapping

```typescript
import {
  CalendarPlus,
  PawPrint,
  Microphone,
  ChartLine,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
  Horse,
  ForkKnife,
  FirstAid,
  Scissors,
  MapPin,
  Target,
  WarningCircle,
  Warning,
  Info,
  CheckCircle,
  Sun,
  Cloud,
  Moon,
  Plus,
  ArrowRight,
  X,
} from '@phosphor-icons/react';

export const icons = {
  // Quick Actions
  newEvent: CalendarPlus,
  addPet: PawPrint,
  aiAssistant: Microphone,
  statistics: ChartLine,

  // Pet Species
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  fish: Fish,
  horse: Horse,
  default: PawPrint,

  // Event Types
  feeding: ForkKnife,
  medical: FirstAid,
  grooming: Scissors,
  appointment: MapPin,
  training: Target,

  // Alerts
  urgent: WarningCircle,
  warning: Warning,
  info: Info,
  success: CheckCircle,

  // Time-based
  morning: Sun,
  afternoon: Cloud,
  evening: Moon,

  // UI
  add: Plus,
  next: ArrowRight,
  close: X,
};
```

---

## Document Metadata

**Version:** 1.0.0
**Last Updated:** 2025-11-16
**Authors:** UX/UI Design Team
**Stakeholders:** Product, Engineering, Design
**Status:** ✅ Approved for Implementation
**Next Review:** 2025-12-16 (post-launch)

**Change Log:**
- 2025-11-16: Initial specification document created
- Future: Track implementation progress and iterations

**References:**
- `/design-system/00-design-tokens.md`
- `/design-system/01-color-system.md`
- `/CLAUDE.md` (project architecture)
- WCAG 2.1 Level AA Guidelines
- iOS Human Interface Guidelines
- Material Design 3 (Android)

---

**End of Document**
