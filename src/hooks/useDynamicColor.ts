'use client';

import { useEffect, useState, useCallback } from 'react';
import { extractDominantColor, extractColorPalette } from '@/lib/colorExtractor';
import { useUIStore } from '@/store/uiStore';

const FALLBACK_COLOR = '#535353';

interface UseDynamicColorReturn {
  dominantColor: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to extract and manage dominant color from an image
 * Updates the UI store with the extracted color
 */
export function useDynamicColor(imageUrl: string | null | undefined): UseDynamicColorReturn {
  const [dominantColor, setDominantColor] = useState<string>(FALLBACK_COLOR);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const setPageDominantColor = useUIStore((state) => state.setPageDominantColor);

  const extractColor = useCallback(async () => {
    if (!imageUrl) {
      setDominantColor(FALLBACK_COLOR);
      setPageDominantColor(FALLBACK_COLOR);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const color = await extractDominantColor(imageUrl);
      setDominantColor(color);
      setPageDominantColor(color);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to extract color');
      setError(errorObj);
      setDominantColor(FALLBACK_COLOR);
      setPageDominantColor(FALLBACK_COLOR);
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, setPageDominantColor]);

  useEffect(() => {
    extractColor();
  }, [extractColor]);

  return { dominantColor, isLoading, error };
}

/**
 * Hook to extract color palette from an image
 * Returns multiple colors for gradient backgrounds
 */
export function useColorPalette(
  imageUrl: string | null | undefined,
  colorCount = 5
): { palette: string[]; isLoading: boolean } {
  const [palette, setPalette] = useState<string[]>([FALLBACK_COLOR]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!imageUrl) {
      setPalette([FALLBACK_COLOR]);
      return;
    }

    setIsLoading(true);

    extractColorPalette(imageUrl, colorCount)
      .then((colors) => {
        setPalette(colors.length > 0 ? colors : [FALLBACK_COLOR]);
      })
      .catch(() => {
        setPalette([FALLBACK_COLOR]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [imageUrl, colorCount]);

  return { palette, isLoading };
}
