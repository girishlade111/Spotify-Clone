/**
 * Navigation History Buttons Component
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IconButton } from "@/components/ui/IconButton";

export function NavHistory() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Check initial state
    setCanGoBack(window.history.length > 1);
    setCanGoForward(false);

    // Listen for popstate to update button states
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );

  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={handleBack}
        disabled={!canGoBack}
        tooltip="Go back"
        size="sm"
        className="bg-black/70 hover:bg-black/90 hover:scale-[1.04] transition-all"
      />
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={handleForward}
        disabled={!canGoForward}
        tooltip="Go forward"
        size="sm"
        className="bg-black/70 hover:bg-black/90 hover:scale-[1.04] transition-all"
      />
    </div>
  );
}
