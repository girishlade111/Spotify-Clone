/**
 * IconButton Component
 */

"use client";

import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  tooltip?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export function IconButton({
  icon,
  onClick,
  tooltip,
  size = "md",
  active = false,
  disabled = false,
  className = "",
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        bg-transparent
        text-[#A7A7A7]
        transition-colors duration-200
        hover:text-white
        focus-visible:outline-none
        focus-visible:outline-2
        focus-visible:outline-white
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${active ? "text-[#1DB954]" : ""}
        ${className}
      `}
    >
      <span className={iconSizeClasses[size]}>{icon}</span>
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
}
