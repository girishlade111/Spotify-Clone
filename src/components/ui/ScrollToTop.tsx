/**
 * Scroll To Top Component
 * Resets scroll position on page navigation
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface ScrollToTopProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function ScrollToTop({ scrollRef }: ScrollToTopProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, scrollRef]);

  return null;
}
