/**
 * Button Component
 */

"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  icon,
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-[#1DB954] text-black font-bold hover:bg-[#1ED760] active:bg-[#169C46]",
    secondary:
      "bg-white text-black font-bold hover:scale-[1.04] active:scale-100",
    outline:
      "bg-transparent border border-[#727272] text-white hover:border-white",
    ghost:
      "bg-transparent text-[#A7A7A7] hover:text-white hover:bg-white/10",
    danger: "bg-transparent text-[#F15E6C] hover:text-[#F15E6C]",
  };

  const sizeClasses = {
    sm: "h-8 px-4 text-[13px]",
    md: "h-10 px-6 text-[14px]",
    lg: "h-12 px-8 text-[16px]",
  };

  const shapeClasses =
    variant === "primary" || variant === "secondary"
      ? "rounded-[500px]"
      : "rounded-[500px]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${shapeClasses}
        ${fullWidth ? "w-full" : ""}
        flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
