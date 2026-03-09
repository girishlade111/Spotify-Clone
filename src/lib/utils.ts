import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Extract ID from Spotify URI
 * "spotify:playlist:abc123" → "abc123"
 */
export function extractSpotifyId(uri: string): string {
  const parts = uri.split(':');
  return parts[parts.length - 1];
}

/**
 * Get context type from Spotify URI
 */
export function getContextTypeFromUri(
  uri: string
): 'playlist' | 'album' | 'artist' | 'collection' {
  const parts = uri.split(':');
  if (parts.length < 2) return 'collection';

  const type = parts[1];
  if (type === 'playlist') return 'playlist';
  if (type === 'album') return 'album';
  if (type === 'artist') return 'artist';
  if (type === 'collection' || type === 'track') return 'collection';
  return 'collection';
}

/**
 * Check if a hex color is light (luminance > 0.5)
 * Used to decide text color over backgrounds
 */
export function isLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Darken a hex color by multiplying RGB channels
 * @param hex - Hex color string (#RRGGBB)
 * @param amount - Multiplier (0-1), e.g., 0.7 for 70% brightness
 */
export function darkenColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const darkened = {
    r: Math.round(r * amount),
    g: Math.round(g * amount),
    b: Math.round(b * amount),
  };
  return rgbToHex(darkened.r, darkened.g, darkened.b);
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Handle 3-digit hex
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, n));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a hash from a string (for consistent color generation)
 */
export function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
