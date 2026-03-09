/**
 * Page Gradient Component
 * Creates the colored gradient background for content pages
 */

"use client";

interface PageGradientProps {
  color: string;
  opacity?: number;
}

export function PageGradient({ color, opacity = 1 }: PageGradientProps) {
  const rgbaColor = color.startsWith("#")
    ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
    : color;

  return (
    <div
      className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 transition-colors duration-500 ease-in-out"
      style={{
        background: `linear-gradient(to bottom, ${rgbaColor} 0%, transparent 100%)`,
      }}
    />
  );
}
