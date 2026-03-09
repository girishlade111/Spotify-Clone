/**
 * useScrollHeader Hook
 * Tracks scroll position of the main content area
 */

"use client";

import { useState, useEffect, RefObject } from "react";

interface UseScrollHeaderReturn {
  isScrolled: boolean;
  scrollY: number;
}

export function useScrollHeader(
  scrollRef: RefObject<HTMLDivElement | null>
): UseScrollHeaderReturn {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const y = element.scrollTop;
      setScrollY(y);
      setIsScrolled(y > 0);
    };

    // Initial check
    handleScroll();

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef]);

  return { isScrolled, scrollY };
}
