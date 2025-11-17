import { type ImgHTMLAttributes, forwardRef, useState } from 'react';
import './Avatar.css';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for image (required for accessibility)
   */
  alt: string;

  /**
   * Avatar size
   * - sm: 32px
   * - md: 40px (default)
   * - lg: 56px
   * - xl: 80px
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Initials to display if no image (e.g., "JD" for John Doe)
   */
  initials?: string;

  /**
   * Fallback background color (CSS variable or hex)
   */
  fallbackColor?: string;
}

/**
 * Avatar Component
 *
 * Circular avatar component for user or pet profiles.
 * Shows image if available, falls back to initials, then to generic placeholder.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@gastonapp/ui';
 *
 * // With image
 * <Avatar
 *   src="/pets/max.jpg"
 *   alt="Max the dog"
 *   size="md"
 * />
 *
 * // With initials fallback
 * <Avatar
 *   src="/pets/rex.jpg"
 *   alt="Rex the dog"
 *   initials="RX"
 *   size="lg"
 * />
 *
 * // Initials only
 * <Avatar
 *   alt="Luna the cat"
 *   initials="LN"
 *   size="sm"
 *   fallbackColor="var(--color-lavender-light)"
 * />
 * ```
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      size = 'md',
      initials,
      fallbackColor = 'var(--color-primary-100)',
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const showImage = src && !imageError;
    const showInitials = !showImage && initials;

    const classNames = [
      'gaston-avatar',
      `gaston-avatar--${size}`,
      imageLoaded && 'gaston-avatar--loaded',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    return (
      <div
        ref={ref}
        className={classNames}
        style={{
          backgroundColor: showInitials ? fallbackColor : undefined,
        }}
        role="img"
        aria-label={alt}
      >
        {showImage && (
          <img
            src={src}
            alt={alt}
            className="gaston-avatar__image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            {...props}
          />
        )}

        {showInitials && <span className="gaston-avatar__initials">{initials}</span>}

        {!showImage && !showInitials && (
          <span className="gaston-avatar__placeholder" aria-hidden="true">
            {/* Generic placeholder icon using text */}
            <svg
              className="gaston-avatar__placeholder-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
