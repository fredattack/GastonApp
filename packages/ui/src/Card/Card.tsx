import { type ReactNode, type HTMLAttributes, forwardRef } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant style
   * - standard: Solid white background with shadow
   * - glass: Semi-transparent with backdrop blur (glassmorphism)
   * - gradient: Gradient background (uses data-gradient attribute for color)
   */
  variant?: 'standard' | 'glass' | 'gradient';

  /**
   * Padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Shadow elevation level
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Border radius size
   */
  borderRadius?: 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Click handler - makes card interactive
   */
  onClick?: () => void;

  /**
   * Enable hover effect (lift + shadow increase)
   */
  hoverable?: boolean;

  /**
   * Card content
   */
  children: ReactNode;

  /**
   * For gradient variant: specify gradient name
   * - 'mint-lavender' | 'mint-white' | 'activity-purple' | 'activity-yellow' | 'activity-coral'
   */
  gradient?: 'mint-lavender' | 'mint-white' | 'activity-purple' | 'activity-yellow' | 'activity-coral';
}

/**
 * Card Component
 *
 * Flexible container component supporting multiple variants:
 * - Standard: Classic card with shadow
 * - Glass: Glassmorphism effect with backdrop blur
 * - Gradient: Colorful gradient backgrounds
 *
 * @example
 * ```tsx
 * import { Card } from '@gastonapp/ui';
 *
 * // Standard card
 * <Card variant="standard" padding="lg" shadow="md">
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </Card>
 *
 * // Glass card
 * <Card variant="glass" borderRadius="2xl" hoverable>
 *   Content with glassmorphism effect
 * </Card>
 *
 * // Gradient card
 * <Card variant="gradient" gradient="mint-lavender">
 *   Gradient background card
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'standard',
      padding = 'md',
      shadow = 'md',
      borderRadius = 'xl',
      onClick,
      hoverable = false,
      gradient,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractive = Boolean(onClick) || hoverable;

    const classNames = [
      'gaston-card',
      `gaston-card--${variant}`,
      `gaston-card--padding-${padding}`,
      `gaston-card--shadow-${shadow}`,
      `gaston-card--radius-${borderRadius}`,
      isInteractive && 'gaston-card--interactive',
      variant === 'gradient' && gradient && `gaston-card--gradient-${gradient}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const role = onClick ? 'button' : undefined;
    const tabIndex = onClick ? 0 : undefined;

    const handleKeyDown = onClick
      ? (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }
      : undefined;

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={role}
        tabIndex={tabIndex}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
