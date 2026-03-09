// @ts-ignore - colorthief has non-standard exports
import ColorThief from 'colorthief';
import { rgbToHex, darkenColor } from './utils';

const FALLBACK_COLOR = '#535353';

/**
 * Extract dominant color from an image URL
 * Uses ColorThief to get the dominant color, then darkens it
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Add cache-busting parameter to bypass CORS issues
    const cacheBustedUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cache-bust=${Date.now()}`;

    img.onload = () => {
      try {
        // @ts-ignore - colorthief has non-standard exports
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);

        if (color && color.length >= 3) {
          const [r, g, b] = color;
          // Darken the color by 30% for better contrast
          const darkenedHex = darkenColor(rgbToHex(r, g, b), 0.7);
          resolve(darkenedHex);
        } else {
          resolve(FALLBACK_COLOR);
        }
      } catch (error) {
        console.error('Failed to extract dominant color:', error);
        resolve(FALLBACK_COLOR);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image for color extraction:', imageUrl);
      resolve(FALLBACK_COLOR);
    };

    img.src = cacheBustedUrl;
  });
}

/**
 * Extract multiple colors (color palette) from an image
 */
export async function extractColorPalette(
  imageUrl: string,
  colorCount = 5
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cacheBustedUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cache-bust=${Date.now()}`;

    img.onload = () => {
      try {
        // @ts-ignore - colorthief has non-standard exports
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, colorCount);

        if (palette && palette.length > 0) {
          const hexPalette = palette.map(([r, g, b]: number[]) => rgbToHex(r, g, b));
          resolve(hexPalette);
        } else {
          resolve([FALLBACK_COLOR]);
        }
      } catch (error) {
        console.error('Failed to extract color palette:', error);
        resolve([FALLBACK_COLOR]);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image for color palette extraction:', imageUrl);
      resolve([FALLBACK_COLOR]);
    };

    img.src = cacheBustedUrl;
  });
}
