import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from 'react';
import '../styles/design-tokens.css';
import './Button.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * Button variant style
   * - primary: Black background (default)
   * - secondary: White background with border
   * - ghost: Transparent background
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Button size
   * - sm: 40px height
   * - md: 48px height (default)
   * - lg: 56px height
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner, disables interaction
   */
  loading?: boolean;

  /**
   * Optional icon (Phosphor Icon component)
   */
  icon?: ReactNode;

  /**
   * Icon position relative to label
   */
  iconPosition?: 'left' | 'right';

  /**
   * Full width button (100%)
   */
  fullWidth?: boolean;

  /**
   * Button type attribute
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Button label/content
   */
  children: ReactNode;
}

/**
 * Button Component
 *
 * Pill-shaped button following GastonApp design system.
 * Supports variants (primary, secondary, ghost), sizes, icons, and loading states.
 *
 * @example
 * ```tsx
 * import { Button } from '@gastonapp/ui';
 * import { PlusCircle } from '@phosphor-icons/react';
 *
 * <Button variant="primary" size="md" icon={<PlusCircle />} iconPosition="left">
 *   Add Pet
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      type = 'button',
      className,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classNames = [
      'gaston-button',
      `gaston-button--${variant}`,
      `gaston-button--${size}`,
      fullWidth && 'gaston-button--full-width',
      loading && 'gaston-button--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="gaston-button__spinner" aria-hidden="true">
            <svg className="gaston-button__spinner-svg" viewBox="0 0 24 24">
              <circle
                className="gaston-button__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="3"
              />
            </svg>
          </span>
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className="gaston-button__icon gaston-button__icon--left" aria-hidden="true">
            {icon}
          </span>
        )}

        <span className="gaston-button__label">{children}</span>

        {!loading && icon && iconPosition === 'right' && (
          <span className="gaston-button__icon gaston-button__icon--right" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
