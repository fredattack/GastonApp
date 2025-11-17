# Usage Examples - @gastonapp/ui

Complete examples of how to use each component in the GastonApp UI library.

## Setup

First, import the design tokens CSS in your app's entry point:

```tsx
// apps/web/src/main.tsx
import '@gastonapp/ui/dist/styles/design-tokens.css';
```

Then import components as needed:

```tsx
import { Button, Card, Icon, Badge, Avatar } from '@gastonapp/ui';
```

---

## Button Component

### Basic Variants

```tsx
import { Button } from '@gastonapp/ui';

function MyPage() {
  return (
    <>
      {/* Primary (black background) */}
      <Button variant="primary">
        Primary Button
      </Button>

      {/* Secondary (white with border) */}
      <Button variant="secondary">
        Secondary Button
      </Button>

      {/* Ghost (transparent) */}
      <Button variant="ghost">
        Ghost Button
      </Button>
    </>
  );
}
```

### Sizes

```tsx
<Button variant="primary" size="sm">Small (40px)</Button>
<Button variant="primary" size="md">Medium (48px)</Button>
<Button variant="primary" size="lg">Large (56px)</Button>
```

### With Icons

```tsx
import { PlusCircle, Heart, ArrowRight } from '@phosphor-icons/react';

// Icon on left
<Button
  variant="primary"
  icon={<PlusCircle />}
  iconPosition="left"
>
  Add Pet
</Button>

// Icon on right
<Button
  variant="secondary"
  icon={<ArrowRight />}
  iconPosition="right"
>
  Continue
</Button>

// Icon only (use aria-label)
<Button
  variant="ghost"
  icon={<Heart />}
  aria-label="Like"
/>
```

### Loading State

```tsx
<Button variant="primary" loading>
  Saving...
</Button>
```

### Full Width

```tsx
<Button variant="primary" fullWidth>
  Full Width Button
</Button>
```

### Disabled

```tsx
<Button variant="primary" disabled>
  Disabled Button
</Button>
```

### Complete Example

```tsx
import { Button } from '@gastonapp/ui';
import { CalendarPlus } from '@phosphor-icons/react';

function EventCreationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // ... API call
    setIsLoading(false);
  };

  return (
    <div>
      <Button
        variant="primary"
        size="lg"
        icon={<CalendarPlus />}
        iconPosition="left"
        loading={isLoading}
        onClick={handleSubmit}
        fullWidth
      >
        Create Event
      </Button>
    </div>
  );
}
```

---

## Card Component

### Standard Card

```tsx
import { Card } from '@gastonapp/ui';

<Card variant="standard" padding="lg" shadow="md" borderRadius="xl">
  <h2>Pet Profile</h2>
  <p>Name: Max</p>
  <p>Species: Dog</p>
  <p>Age: 3 years</p>
</Card>
```

### Glass Card (Glassmorphism)

```tsx
<Card variant="glass" padding="md" shadow="lg" borderRadius="2xl">
  <h3>Balance Information</h3>
  <p>$250.00</p>
</Card>
```

### Gradient Cards

```tsx
{/* Mint-Lavender gradient */}
<Card variant="gradient" gradient="mint-lavender" padding="lg">
  <h3>Welcome!</h3>
  <p>Beautiful gradient background</p>
</Card>

{/* Activity card gradients */}
<Card variant="gradient" gradient="activity-purple" padding="md">
  Purple Activity Card
</Card>

<Card variant="gradient" gradient="activity-yellow" padding="md">
  Yellow Activity Card
</Card>

<Card variant="gradient" gradient="activity-coral" padding="md">
  Coral Activity Card
</Card>
```

### Interactive Card (Clickable)

```tsx
import { useNavigate } from 'react-router-dom';

function PetCard({ pet }) {
  const navigate = useNavigate();

  return (
    <Card
      variant="standard"
      padding="md"
      shadow="md"
      hoverable
      onClick={() => navigate(`/pets/${pet.id}`)}
    >
      <h3>{pet.name}</h3>
      <p>{pet.species}</p>
    </Card>
  );
}
```

### No Padding (Custom Layout)

```tsx
<Card variant="standard" padding="none" shadow="sm">
  <img src="/pet.jpg" alt="Pet" style={{ width: '100%' }} />
  <div style={{ padding: 'var(--spacing-20)' }}>
    <h3>Max the Dog</h3>
  </div>
</Card>
```

---

## Icon Component

### Basic Usage

```tsx
import { Icon } from '@gastonapp/ui';
import { Dog, Cat, Heart, CalendarPlus } from '@phosphor-icons/react';

<Icon icon={Dog} size="md" weight="regular" />
<Icon icon={Cat} size="lg" weight="bold" />
<Icon icon={Heart} size="xl" color="var(--color-error-base)" />
```

### All Sizes

```tsx
<Icon icon={Dog} size="xs" />   {/* 16px */}
<Icon icon={Dog} size="sm" />   {/* 20px */}
<Icon icon={Dog} size="md" />   {/* 24px */}
<Icon icon={Dog} size="lg" />   {/* 32px */}
<Icon icon={Dog} size="xl" />   {/* 40px */}
<Icon icon={Dog} size="2xl" />  {/* 48px */}
```

### With Custom Colors

```tsx
<Icon icon={Heart} size="lg" color="var(--color-error-base)" />
<Icon icon={Dog} size="md" color="var(--color-primary-400)" />
<Icon icon={CalendarPlus} size="xl" color="#8FA998" />
```

### In Text

```tsx
<p>
  <Icon icon={Dog} size="sm" /> Max the dog is 3 years old
</p>
```

### Complete Example

```tsx
import { Icon } from '@gastonapp/ui';
import { PawPrint, CalendarPlus, ChartLine } from '@phosphor-icons/react';

function QuickActions() {
  return (
    <div>
      <button>
        <Icon icon={CalendarPlus} size="lg" color="var(--color-primary-400)" />
        <span>New Event</span>
      </button>

      <button>
        <Icon icon={PawPrint} size="lg" color="var(--color-lavender-base)" />
        <span>Add Pet</span>
      </button>

      <button>
        <Icon icon={ChartLine} size="lg" color="var(--color-yellow-base)" />
        <span>Statistics</span>
      </button>
    </div>
  );
}
```

---

## Badge Component

### Basic Variants

```tsx
import { Badge } from '@gastonapp/ui';

<Badge variant="success">PAID</Badge>
<Badge variant="warning">PENDING</Badge>
<Badge variant="error">OVERDUE</Badge>
<Badge variant="info">3 EVENTS</Badge>
<Badge variant="neutral">INACTIVE</Badge>
```

### Sizes

```tsx
<Badge variant="success" size="sm">Small</Badge>
<Badge variant="success" size="md">Medium</Badge>
```

### Non-Pill Shape

```tsx
<Badge variant="success" pill={false}>
  Rectangular Badge
</Badge>
```

### Complete Example

```tsx
import { Badge } from '@gastonapp/ui';

function EventsList({ events }) {
  return (
    <ul>
      {events.map(event => (
        <li key={event.id}>
          <span>{event.title}</span>
          {event.status === 'completed' && (
            <Badge variant="success" size="sm">DONE</Badge>
          )}
          {event.status === 'upcoming' && (
            <Badge variant="info" size="sm">UPCOMING</Badge>
          )}
          {event.status === 'overdue' && (
            <Badge variant="error" size="sm">OVERDUE</Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
```

---

## Avatar Component

### With Image

```tsx
import { Avatar } from '@gastonapp/ui';

<Avatar
  src="/pets/max.jpg"
  alt="Max the dog"
  size="md"
/>
```

### With Initials Fallback

```tsx
<Avatar
  src="/pets/luna.jpg"
  alt="Luna the cat"
  initials="LN"
  size="lg"
/>
```

### Initials Only

```tsx
<Avatar
  alt="Rex the dog"
  initials="RX"
  size="xl"
  fallbackColor="var(--color-primary-100)"
/>
```

### All Sizes

```tsx
<Avatar src="/pet.jpg" alt="Pet" size="sm" />  {/* 32px */}
<Avatar src="/pet.jpg" alt="Pet" size="md" />  {/* 40px */}
<Avatar src="/pet.jpg" alt="Pet" size="lg" />  {/* 56px */}
<Avatar src="/pet.jpg" alt="Pet" size="xl" />  {/* 80px */}
```

### Custom Fallback Colors

```tsx
<Avatar
  alt="Max"
  initials="MX"
  fallbackColor="var(--color-mint-light)"
/>

<Avatar
  alt="Luna"
  initials="LN"
  fallbackColor="var(--color-lavender-light)"
/>

<Avatar
  alt="Rex"
  initials="RX"
  fallbackColor="var(--color-coral-light)"
/>
```

### Complete Example

```tsx
import { Avatar } from '@gastonapp/ui';

function PetCard({ pet }) {
  return (
    <div>
      <Avatar
        src={pet.imageUrl}
        alt={pet.name}
        initials={pet.name.substring(0, 2).toUpperCase()}
        size="lg"
        fallbackColor={getPetColor(pet.species)}
      />
      <h3>{pet.name}</h3>
      <p>{pet.species}</p>
    </div>
  );
}

function getPetColor(species: string): string {
  const colors: Record<string, string> = {
    dog: 'var(--color-mint-light)',
    cat: 'var(--color-lavender-light)',
    bird: 'var(--color-yellow-light)',
    rabbit: 'var(--color-coral-light)',
  };
  return colors[species.toLowerCase()] || 'var(--color-primary-100)';
}
```

---

## Combined Examples

### Event Card

```tsx
import { Card, Icon, Badge, Avatar } from '@gastonapp/ui';
import { CalendarBlank, Clock } from '@phosphor-icons/react';

function EventCard({ event, pet }) {
  return (
    <Card
      variant="standard"
      padding="md"
      shadow="md"
      borderRadius="xl"
      hoverable
      onClick={() => handleEventClick(event.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
        <Avatar
          src={pet.imageUrl}
          alt={pet.name}
          initials={pet.name.substring(0, 2).toUpperCase()}
          size="md"
        />

        <div style={{ flex: 1 }}>
          <h3>{event.title}</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
            <Icon icon={CalendarBlank} size="sm" color="var(--color-text-tertiary)" />
            <span>{formatDate(event.date)}</span>

            <Icon icon={Clock} size="sm" color="var(--color-text-tertiary)" />
            <span>{event.time}</span>
          </div>
        </div>

        <Badge variant={event.completed ? 'success' : 'info'} size="sm">
          {event.completed ? 'DONE' : 'TODO'}
        </Badge>
      </div>
    </Card>
  );
}
```

### Quick Actions Grid

```tsx
import { Card, Icon } from '@gastonapp/ui';
import { CalendarPlus, PawPrint, Microphone, ChartLine } from '@phosphor-icons/react';

function QuickActionsGrid() {
  const actions = [
    {
      icon: CalendarPlus,
      title: 'New Event',
      gradient: 'mint-lavender',
      onClick: () => navigate('/events/new'),
    },
    {
      icon: PawPrint,
      title: 'Add Pet',
      gradient: 'activity-purple',
      onClick: () => navigate('/pets/new'),
    },
    {
      icon: Microphone,
      title: 'AI Assistant',
      gradient: 'activity-coral',
      onClick: () => navigate('/ai'),
    },
    {
      icon: ChartLine,
      title: 'Statistics',
      gradient: 'activity-yellow',
      onClick: () => navigate('/stats'),
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--spacing-12)',
    }}>
      {actions.map(action => (
        <Card
          key={action.title}
          variant="gradient"
          gradient={action.gradient}
          padding="lg"
          borderRadius="2xl"
          hoverable
          onClick={action.onClick}
        >
          <Icon icon={action.icon} size="2xl" />
          <h3>{action.title}</h3>
        </Card>
      ))}
    </div>
  );
}
```

### Pet Profile Header

```tsx
import { Avatar, Badge, Button } from '@gastonapp/ui';
import { PencilSimple } from '@phosphor-icons/react';

function PetProfileHeader({ pet }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-20)' }}>
      <Avatar
        src={pet.imageUrl}
        alt={pet.name}
        initials={pet.name.substring(0, 2).toUpperCase()}
        size="xl"
      />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
          <h1>{pet.name}</h1>
          <Badge variant={pet.isActive ? 'success' : 'neutral'}>
            {pet.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>

        <p>{pet.species} • {pet.breed} • {pet.age} years old</p>
      </div>

      <Button
        variant="secondary"
        icon={<PencilSimple />}
        iconPosition="left"
      >
        Edit
      </Button>
    </div>
  );
}
```

---

## Accessibility Examples

### Keyboard Navigation

```tsx
<Card
  variant="standard"
  padding="md"
  onClick={handleClick}
  hoverable
  // Card automatically handles Enter/Space for keyboard users
>
  Keyboard accessible card
</Card>
```

### ARIA Labels

```tsx
{/* Button with icon only */}
<Button
  variant="ghost"
  icon={<Heart />}
  aria-label="Like this pet"
/>

{/* Icon for screen readers */}
<Icon
  icon={Dog}
  size="md"
  aria-hidden="true"  // Decorative icon
/>

{/* Avatar */}
<Avatar
  src="/pet.jpg"
  alt="Max the dog, 3 years old"  // Descriptive alt text
  size="md"
/>
```

### Focus Indicators

All interactive components automatically show a 3px eucalyptus green focus ring when focused via keyboard (`:focus-visible`).

```tsx
<Button variant="primary">
  Keyboard navigation supported
</Button>

<Card hoverable onClick={handleClick}>
  Tab to focus, Enter/Space to activate
</Card>
```

---

## Design Tokens in Custom Styles

Use design tokens in your custom CSS:

```css
.custom-component {
  padding: var(--spacing-20);
  background-color: var(--color-lin-0);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-m);
  transition: all var(--transition-normal);
}

.custom-component:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

Or inline styles:

```tsx
<div style={{
  padding: 'var(--spacing-24)',
  backgroundColor: 'var(--color-primary-50)',
  borderRadius: 'var(--radius-lg)',
  color: 'var(--color-text-primary)',
}}>
  Custom styled content
</div>
```

---

## TypeScript Usage

All components are fully typed:

```tsx
import type { ButtonProps, CardProps, IconProps } from '@gastonapp/ui';

const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  children: 'Submit',
};

<Button {...buttonProps} />
```

---

For more details, see:
- [README.md](./README.md)
- [Design System Documentation](../../design-system/)
- [Front Architecture Guidelines](../../docs/technical/front-architecture.md)
