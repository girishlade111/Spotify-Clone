'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotifyImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  className?: string;
  showPlaceholder?: boolean;
}

const defaultPlaceholder = (
  <div className="w-full h-full bg-[#282828] flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#A7A7A7]">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  </div>
);

export function SpotifyImage({
  src,
  alt,
  fallbackSrc,
  className,
  showPlaceholder = true,
  ...props
}: SpotifyImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const effectiveSrc = hasError ? fallbackSrc || null : src;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-[#282828] animate-pulse" />
      )}
      {effectiveSrc ? (
        <Image
          src={effectiveSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      ) : (
        <div className="w-full h-full">{defaultPlaceholder}</div>
      )}
    </div>
  );
}

// Album art specific component with consistent styling
export function AlbumArt({
  src,
  alt,
  size = 'md',
  rounded = 'md',
  className,
  ...props
}: SpotifyImageProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-48 h-48',
    xl: 'w-56 h-56',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <SpotifyImage
      src={src}
      alt={alt || 'Album art'}
      className={cn(sizeClasses[size], roundedClasses[rounded], className)}
      fill
      sizes={`${size === 'sm' ? '40px' : size === 'md' ? '56px' : size === 'lg' ? '192px' : '224px'}`}
      {...props}
    />
  );
}

// Artist avatar component
export function ArtistAvatar({
  src,
  alt,
  name,
  size = 'md',
  className,
}: {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-32 h-32 text-lg',
    xl: 'w-48 h-48 text-xl',
  };

  const initial = name?.charAt(0).toUpperCase() || '?';

  if (src) {
    return (
      <SpotifyImage
        src={src}
        alt={alt || name || 'Artist'}
        className={cn('rounded-full', sizeClasses[size], className)}
        fill
        sizes={`${size === 'sm' ? '40px' : size === 'md' ? '56px' : size === 'lg' ? '128px' : '192px'}`}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-[#535353] flex items-center justify-center text-white font-bold',
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
