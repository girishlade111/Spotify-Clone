/**
 * Library Filters Component
 */

"use client";

import { useUIStore } from "@/store/uiStore";

const filters: { id: string; label: string }[] = [
  { id: "playlists", label: "Playlists" },
  { id: "podcasts", label: "Podcasts & Shows" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
];

interface LibraryFiltersProps {
  collapsed: boolean;
}

export function LibraryFilters({ collapsed }: LibraryFiltersProps) {
  const { libraryFilter, setLibraryFilter } = useUIStore();

  if (collapsed) {
    return null;
  }

  const activeFilter = filters.find((f) => f.id === libraryFilter);
  const hasActiveFilter = libraryFilter !== "all";

  return (
    <div className="flex items-center gap-2 px-2 py-1 overflow-x-auto scrollbar-thin">
      {hasActiveFilter && (
        <button
          type="button"
          onClick={() => setLibraryFilter("all")}
          className="w-6 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </button>
      )}

      {filters.map((filter) => {
        const isActive = libraryFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() =>
              setLibraryFilter(isActive ? "all" : (filter.id as typeof libraryFilter))
            }
            className={`
              h-8 px-3 rounded-full text-sm whitespace-nowrap
              transition-colors duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "bg-white/10 text-white hover:bg-white/20 font-normal"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
