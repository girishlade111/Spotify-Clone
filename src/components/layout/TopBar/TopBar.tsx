/**
 * Top Navigation Bar Component
 */

"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { useScrollHeader } from "@/hooks/useScrollHeader";
import { NavHistory } from "./NavHistory";
import { SearchInput } from "./SearchInput";
import { UserMenu } from "./UserMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function TopBar({ scrollRef }: TopBarProps) {
  const pathname = usePathname();
  const { pageDominantColor } = useUIStore();
  const { isScrolled } = useScrollHeader(scrollRef);

  // Calculate background style based on scroll state
  const backgroundStyle = isScrolled
    ? { backgroundColor: pageDominantColor }
    : { backgroundColor: "transparent" };

  const isOnSearchPage = pathname === "/search";

  const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );

  const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );

  return (
    <header
      className="sticky top-0 z-[50] h-16 flex items-center justify-between px-6 transition-colors duration-300"
      style={backgroundStyle}
    >
      {/* Left Side - Nav History */}
      <div className="flex items-center gap-4">
        <NavHistory />
      </div>

      {/* Center - Search or Placeholder */}
      <div className="flex items-center justify-center flex-1 max-w-[500px]">
        {isOnSearchPage ? (
          <SearchInput variant="full" />
        ) : (
          <SearchInput variant="small" />
        )}
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Explore Premium */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            window.open("https://www.spotify.com/premium", "_blank")
          }
        >
          Explore Premium
        </Button>

        {/* Install App */}
        <IconButton
          icon={<DownloadIcon />}
          tooltip="Install App"
          size="sm"
          onClick={() => {
            // Show toast about desktop app
          }}
        />

        {/* Notifications */}
        <IconButton
          icon={<BellIcon />}
          tooltip="What's New"
          size="sm"
          onClick={() => {
            // Show notifications drawer
          }}
        />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
