import { type IconProps as PhosphorIconProps, type Icon as PhosphorIcon } from '@phosphor-icons/react';
import { type ComponentType } from 'react';
import './Icon.css';

export interface IconProps extends Omit<PhosphorIconProps, 'size' | 'weight'> {
  /**
   * Phosphor Icon component
   */
  icon: ComponentType<PhosphorIconProps>;

  /**
   * Icon size - maps to design tokens
   * - xs: 16px
   * - sm: 20px
   * - md: 24px (default)
   * - lg: 32px
   * - xl: 40px
   * - 2xl: 48px
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Icon weight
   */
  weight?: 'regular' | 'bold';

  /**
   * Icon color - defaults to currentColor
   */
  color?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Icon Component
 *
 * Type-safe wrapper for @phosphor-icons/react with design system size tokens.
 *
 * @example
 * ```tsx
 * import { Icon } from '@gastonapp/ui';
 * import { Heart, Dog, CalendarPlus } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <Icon icon={Heart} size="md" weight="regular" />
 *
 * // With custom color
 * <Icon icon={Dog} size="lg" color="var(--color-primary-400)" />
 *
 * // Bold variant
 * <Icon icon={CalendarPlus} size="xl" weight="bold" />
 * ```
 */
export function Icon({
  icon: IconComponent,
  size = 'md',
  weight = 'regular',
  color = 'currentColor',
  className,
  ...props
}: IconProps) {
  const sizeMap: Record<NonNullable<IconProps['size']>, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
  };

  const sizeValue = sizeMap[size];

  const classNames = ['gaston-icon', `gaston-icon--${size}`, className].filter(Boolean).join(' ');

  return (
    <IconComponent
      size={sizeValue}
      weight={weight}
      color={color}
      className={classNames}
      {...props}
    />
  );
}
