/**
 * Select Control Component
 */

"use client";

import { SelectHTMLAttributes } from "react";

interface SelectControlProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function SelectControl({ options, className = "", ...props }: SelectControlProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`
          appearance-none bg-[#3E3E3E] text-white
          border border-[#727272] rounded-[4px]
          px-3 py-2 pr-10
          text-sm cursor-pointer
          focus:outline-none focus:border-white
          transition-colors
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </span>
    </div>
  );
}
