/**
 * Library Sort Menu Component
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import type { LibrarySort } from "@/types/ui";

const sortOptions: { id: LibrarySort; label: string }[] = [
  { id: "recents", label: "Recents" },
  { id: "recently-added", label: "Recently Added" },
  { id: "alphabetical", label: "Alphabetical" },
  { id: "creator", label: "Creator" },
];

interface LibrarySortMenuProps {
  collapsed: boolean;
}

export function LibrarySortMenu({ collapsed }: LibrarySortMenuProps) {
  const { librarySort, setLibrarySort } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentSort = sortOptions.find((s) => s.id === librarySort);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (collapsed) {
    return null;
  }

  return (
    <div className="px-2 py-1 flex justify-end" ref={menuRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[#A7A7A7] hover:text-white transition-colors text-sm"
        >
          <span>{currentSort?.label || "Recents"}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-[200px] bg-[#282828] rounded-[4px] shadow-[0_16px_24px_rgba(0,0,0,0.3)] z-[1000] overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setLibrarySort(option.id);
                  setIsOpen(false);
                }}
                className="w-full h-10 px-3 flex items-center justify-between text-sm text-white hover:bg-white/10 transition-colors"
              >
                <span>{option.label}</span>
                {librarySort === option.id && (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
