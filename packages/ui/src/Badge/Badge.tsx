import { type ReactNode, type HTMLAttributes, forwardRef } from 'react';
import '../styles/design-tokens.css';
import './Badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant based on semantic colors
   * - success: Green (mint)
   * - warning: Yellow
   * - error: Red
   * - info: Eucalyptus green
   * - neutral: Grey
   */
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';

  /**
   * Badge size
   * - sm: 12px text, compact padding
   * - md: 14px text, normal padding (default)
   */
  size?: 'sm' | 'md';

  /**
   * Force pill shape (default true for design system)
   */
  pill?: boolean;

  /**
   * Badge content
   */
  children: ReactNode;
}

/**
 * Badge Component
 *
 * Pill-shaped badge for status indicators, labels, and tags.
 * Uses semantic colors from the design system.
 *
 * @example
 * ```tsx
 * import { Badge } from '@gastonapp/ui';
 *
 * // Success badge
 * <Badge variant="success">PAID</Badge>
 *
 * // Warning badge
 * <Badge variant="warning" size="sm">PENDING</Badge>
 *
 * // Error badge
 * <Badge variant="error">OVERDUE</Badge>
 *
 * // Info badge
 * <Badge variant="info">3 EVENTS</Badge>
 *
 * // Neutral badge
 * <Badge variant="neutral">INACTIVE</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', pill = true, className, children, ...props }, ref) => {
    const classNames = [
      'gaston-badge',
      `gaston-badge--${variant}`,
      `gaston-badge--${size}`,
      pill && 'gaston-badge--pill',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
