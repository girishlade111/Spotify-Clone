/**
 * Play Button Component - Green circular play button
 */

"use client";

import { cn } from "@/lib/utils";

interface PlayButtonProps {
  size?: 24 | 32 | 40 | 48 | 56;
  onClick?: () => void;
  className?: string;
  isPlaying?: boolean;
}

export function PlayButton({
  size = 48,
  onClick,
  className,
  isPlaying = false,
}: PlayButtonProps) {
  const sizeClasses = {
    24: "w-6 h-6",
    32: "w-8 h-8",
    40: "w-10 h-10",
    48: "w-12 h-12",
    56: "w-14 h-14",
  };

  const iconSize = {
    24: "w-3 h-3",
    32: "w-4 h-4",
    40: "w-5 h-5",
    48: "w-5 h-5",
    56: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full bg-[#1DB954] flex items-center justify-center",
        "hover:bg-[#1ED760] hover:scale-105",
        "active:bg-[#169C46] active:scale-100",
        "shadow-[0_8px_8px_rgba(0,0,0,0.3)]",
        "transition-all duration-150",
        sizeClasses[size],
        className
      )}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        /* Pause Icon */
        <svg
          viewBox="0 0 24 24"
          fill="black"
          className={iconSize[size]}
        >
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        /* Play Icon */
        <svg
          viewBox="0 0 24 24"
          fill="black"
          className={cn(iconSize[size], "ml-0.5")}
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}
