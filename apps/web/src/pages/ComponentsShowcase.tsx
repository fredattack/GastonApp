import React from 'react';
import { Button, Card, Icon, Badge, Avatar } from '@gastonapp/ui';
import {
  Heart,
  Dog,
  Calendar,
  Plus,
  User,
  PawPrint,
  Bell,
  MapPin,
  Camera,
  Check,
  X,
  Warning,
  Info,
  ArrowRight,
  Star,
} from '@phosphor-icons/react';

/**
 * ComponentsShowcase - Page de démonstration des composants UI
 *
 * Cette page affiche tous les composants de base créés en Phase 1
 * avec leurs différents variants, sizes et states.
 */
const ComponentsShowcase: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-lin-2)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Components Showcase
          </h1>
          <p
            className="text-lg"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            Démonstration des composants UI du design system GastonApp
          </p>
        </div>

        {/* Section: Buttons */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Buttons
          </h2>

          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              With Icons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" icon={<Plus />} iconPosition="left">
                Add Pet
              </Button>
              <Button variant="secondary" icon={<Calendar />} iconPosition="left">
                Schedule
              </Button>
              <Button variant="ghost" icon={<ArrowRight />} iconPosition="right">
                Next
              </Button>
              <Button variant="primary" icon={<Heart />} iconPosition="left" size="sm">
                Like
              </Button>
            </div>
          </div>

          {/* States */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              States
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>
                Loading...
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button variant="primary" fullWidth>
                Full Width Button
              </Button>
            </div>
          </div>
        </section>

        {/* Section: Cards */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Cards
          </h2>

          {/* Standard Card */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Standard Card
            </h3>
            <Card variant="standard" padding="md">
              <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary-900)' }}>
                Standard Card Title
              </h4>
              <p style={{ color: 'var(--color-neutral-600)' }}>
                This is a standard card with white background and subtle shadow.
                Perfect for content sections and information display.
              </p>
            </Card>
          </div>

          {/* Glass Card */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Glass Card
            </h3>
            <Card variant="glass" padding="lg">
              <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary-900)' }}>
                Glass Card Title
              </h4>
              <p style={{ color: 'var(--color-neutral-700)' }}>
                This is a glass card with frosted glass effect (backdrop-filter blur).
                Great for overlays and modern UI designs.
              </p>
            </Card>
          </div>

          {/* Gradient Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Gradient Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="gradient" gradient="mint-lavender" padding="md">
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Mint Lavender Gradient
                </h4>
                <p className="text-white/90">
                  Soft mint to lavender gradient. Calming and elegant.
                </p>
              </Card>

              <Card variant="gradient" gradient="mint-white" padding="md">
                <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary-900)' }}>
                  Mint White Gradient
                </h4>
                <p style={{ color: 'var(--color-neutral-700)' }}>
                  Fresh mint to white gradient. Clean and modern.
                </p>
              </Card>

              <Card variant="gradient" gradient="activity-purple" padding="md">
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Activity Purple
                </h4>
                <p className="text-white/90">
                  Vibrant purple gradient for activity cards. Bold and energetic.
                </p>
              </Card>

              <Card variant="gradient" gradient="activity-yellow" padding="md">
                <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary-900)' }}>
                  Activity Yellow
                </h4>
                <p style={{ color: 'var(--color-neutral-700)' }}>
                  Warm yellow gradient for cheerful activities.
                </p>
              </Card>

              <Card variant="gradient" gradient="activity-coral" padding="md">
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Activity Coral
                </h4>
                <p className="text-white/90">
                  Coral gradient for health and wellness activities.
                </p>
              </Card>
            </div>
          </div>

          {/* Padding Variations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Padding Variations
            </h3>
            <div className="space-y-4">
              <Card variant="standard" padding="sm">
                <p style={{ color: 'var(--color-neutral-600)' }}>Small padding (12px)</p>
              </Card>
              <Card variant="standard" padding="md">
                <p style={{ color: 'var(--color-neutral-600)' }}>Medium padding (20px)</p>
              </Card>
              <Card variant="standard" padding="lg">
                <p style={{ color: 'var(--color-neutral-600)' }}>Large padding (32px)</p>
              </Card>
              <Card variant="standard" padding="none">
                <div style={{ padding: '16px' }}>
                  <p style={{ color: 'var(--color-neutral-600)' }}>No padding (custom padding applied)</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Clickable Card */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Clickable Card
            </h3>
            <Card
              variant="standard"
              padding="md"
              onClick={() => alert('Card clicked!')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-primary-900)' }}>
                    Clickable Card
                  </h4>
                  <p style={{ color: 'var(--color-neutral-600)' }}>
                    Click me to see the interaction!
                  </p>
                </div>
                <ArrowRight size={24} style={{ color: 'var(--color-neutral-500)' }} />
              </div>
            </Card>
          </div>
        </section>

        {/* Section: Badges */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Badges
          </h2>

          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success" size="sm">Small</Badge>
              <Badge variant="info" size="md">Medium (Default)</Badge>
            </div>
          </div>

          {/* With Icons (rendered manually inside Badge children) */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              With Icons (Custom)
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">
                <Check size={14} style={{ marginRight: '4px' }} />
                Completed
              </Badge>
              <Badge variant="warning">
                <Warning size={14} style={{ marginRight: '4px' }} />
                Pending
              </Badge>
              <Badge variant="error">
                <X size={14} style={{ marginRight: '4px' }} />
                Failed
              </Badge>
              <Badge variant="info">
                <Info size={14} style={{ marginRight: '4px' }} />
                New Update
              </Badge>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Use Cases
            </h3>
            <Card variant="standard" padding="md">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--color-neutral-700)' }}>Event Status:</span>
                  <Badge variant="success">
                    <Check size={14} style={{ marginRight: '4px' }} />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--color-neutral-700)' }}>Pet Health:</span>
                  <Badge variant="warning">
                    <Warning size={14} style={{ marginRight: '4px' }} />
                    Vet Checkup Due
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--color-neutral-700)' }}>Notification:</span>
                  <Badge variant="info">
                    <Bell size={14} style={{ marginRight: '4px' }} />
                    3 New
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section: Icons */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Icons
          </h2>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <Icon icon={Heart} size="sm" color="var(--color-primary-500)" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Small (16px)</p>
              </div>
              <div className="text-center">
                <Icon icon={Heart} size="md" color="var(--color-primary-500)" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Medium (20px)</p>
              </div>
              <div className="text-center">
                <Icon icon={Heart} size="lg" color="var(--color-primary-500)" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Large (24px)</p>
              </div>
              <div className="text-center">
                <Icon icon={Heart} size="xl" color="var(--color-primary-500)" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>XL (32px)</p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Colors
            </h3>
            <div className="flex flex-wrap gap-4">
              <Icon icon={Dog} size="lg" color="var(--color-primary-500)" />
              <Icon icon={Calendar} size="lg" color="var(--color-accent-500)" />
              <Icon icon={MapPin} size="lg" color="var(--color-tertiary-500)" />
              <Icon icon={Star} size="lg" color="var(--color-warning-400)" />
              <Icon icon={Heart} size="lg" color="var(--color-error-400)" />
            </div>
          </div>

          {/* Icon Collection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Icon Collection Examples
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Dog} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Dog</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={PawPrint} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Paw</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Calendar} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Calendar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Bell} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Bell</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Heart} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Heart</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={MapPin} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Map</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Camera} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Camera</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon={Star} size="lg" color="var(--color-primary-500)" />
                <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>Star</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Avatars */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Avatars
          </h2>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center">
                <Avatar size="sm" initials="GG" alt="Gaston" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Small (32px)</p>
              </div>
              <div className="text-center">
                <Avatar size="md" initials="GG" alt="Gaston" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Medium (40px)</p>
              </div>
              <div className="text-center">
                <Avatar size="lg" initials="GG" alt="Gaston" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>Large (48px)</p>
              </div>
              <div className="text-center">
                <Avatar size="xl" initials="GG" alt="Gaston" />
                <p className="text-xs mt-2" style={{ color: 'var(--color-neutral-600)' }}>XL (64px)</p>
              </div>
            </div>
          </div>

          {/* With Initials */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              With Initials
            </h3>
            <div className="flex flex-wrap gap-4">
              <Avatar size="lg" initials="GG" alt="Gaston Gaston" />
              <Avatar size="lg" initials="ML" alt="Max Labrador" />
              <Avatar size="lg" initials="BC" alt="Bella Cat" />
              <Avatar size="lg" initials="CH" alt="Charlie Husky" />
            </div>
          </div>

          {/* With Images */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              With Images
            </h3>
            <div className="flex flex-wrap gap-4">
              <Avatar
                size="lg"
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop"
                alt="Cute Dog"
              />
              <Avatar
                size="lg"
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop"
                alt="Cute Cat"
              />
              <Avatar
                size="lg"
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
                alt="Cute Puppy"
              />
            </div>
          </div>

          {/* Fallback Icon */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Fallback Icon (no image or initials)
            </h3>
            <div className="flex flex-wrap gap-4">
              <Avatar size="sm" alt="Fallback small" />
              <Avatar size="md" alt="Fallback medium" />
              <Avatar size="lg" alt="Fallback large" />
              <Avatar size="xl" alt="Fallback extra large" />
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-neutral-700)' }}>
              Use Cases
            </h3>
            <div className="space-y-4">
              <Card variant="standard" padding="md">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop"
                    alt="Max"
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--color-primary-900)' }}>
                      Max
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
                      Golden Retriever • 3 years old
                    </p>
                  </div>
                  <Badge variant="success" size="sm" className="ml-auto">
                    Active
                  </Badge>
                </div>
              </Card>

              <Card variant="standard" padding="md">
                <div className="flex items-center gap-4">
                  <Avatar size="md" initials="BC" alt="Bella" />
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--color-primary-900)' }}>
                      Bella
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
                      Persian Cat • 2 years old
                    </p>
                  </div>
                  <Badge variant="info" size="sm" className="ml-auto">
                    Vet Today
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section: Combined Examples */}
        <section className="mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-primary-900)' }}
          >
            Combined Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Card Example */}
            <Card variant="standard" padding="lg">
              <div className="flex items-start gap-4 mb-4">
                <Avatar
                  size="xl"
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop"
                  alt="Max"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-primary-900)' }}>
                    Max
                  </h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-600)' }}>
                    Golden Retriever • 3 years
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="success" size="sm">
                      <Check size={12} style={{ marginRight: '4px' }} />
                      Vaccinated
                    </Badge>
                    <Badge variant="info" size="sm">
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      Checkup
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" icon={<Calendar />} fullWidth>
                  Schedule
                </Button>
                <Button variant="secondary" size="sm" icon={<Heart />} fullWidth>
                  Details
                </Button>
              </div>
            </Card>

            {/* Action Card Example */}
            <Card variant="gradient" gradient="activity-purple" padding="lg">
              <Icon icon={PawPrint} size="xl" color="white" />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-white">
                Add New Pet
              </h3>
              <p className="text-white/90 mb-4">
                Register your pet and keep track of their health, activities, and important dates.
              </p>
              <Button variant="secondary" icon={<Plus />} iconPosition="left">
                Add Pet
              </Button>
            </Card>

            {/* Quick Stats */}
            <Card variant="glass" padding="lg">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-primary-900)' }}>
                Today's Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={Calendar} size="md" color="var(--color-primary-500)" />
                    <span style={{ color: 'var(--color-neutral-700)' }}>Events</span>
                  </div>
                  <Badge variant="info">3 Today</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={Bell} size="md" color="var(--color-warning-500)" />
                    <span style={{ color: 'var(--color-neutral-700)' }}>Reminders</span>
                  </div>
                  <Badge variant="warning">2 Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={PawPrint} size="md" color="var(--color-tertiary-500)" />
                    <span style={{ color: 'var(--color-neutral-700)' }}>Pets</span>
                  </div>
                  <Badge variant="success">5 Active</Badge>
                </div>
              </div>
            </Card>

            {/* CTA Card */}
            <Card variant="gradient" gradient="mint-lavender" padding="lg">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Ready to Get Started?
              </h3>
              <p className="text-white/90 mb-4">
                All components are ready to use. Start building amazing pet management experiences.
              </p>
              <Button variant="secondary" icon={<ArrowRight />} iconPosition="right">
                View Documentation
              </Button>
            </Card>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p style={{ color: 'var(--color-neutral-500)' }}>
            GastonApp Design System • Phase 1 Base Components
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComponentsShowcase;
