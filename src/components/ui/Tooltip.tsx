/**
 * Tooltip Component
 */

"use client";

import { useState, useEffect, ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 500,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      setShouldRender(true);
    } else {
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 150);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  const showTooltip = () => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  if (!shouldRender && !isVisible) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#282828]",
    bottom: "absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#282828]",
    left: "absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#282828]",
    right: "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#282828]",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {(isVisible || shouldRender) && (
        <div
          className={`absolute z-[10000] ${positionClasses[side]} transition-opacity duration-150 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          role="tooltip"
        >
          <div className="bg-[#282828] text-white text-[13px] font-normal rounded-[4px] px-3 py-2 whitespace-nowrap shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
            {content}
          </div>
          <div className={arrowClasses[side]} />
        </div>
      )}
    </div>
  );
}
