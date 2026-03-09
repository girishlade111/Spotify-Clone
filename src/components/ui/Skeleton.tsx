/**
 * Skeleton Component
 */

"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({
  width,
  height,
  className = "",
  variant = "rect",
}: SkeletonProps) {
  const baseClasses = `
    bg-[#282828]
    bg-[length:400%_100%]
    animate-shimmer
  `;

  const variantClasses = {
    rect: "rounded-[2px]",
    circle: "rounded-full",
    text: "rounded-[2px] h-4",
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : "100%",
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}
