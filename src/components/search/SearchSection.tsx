/**
 * Search Section Component - Horizontal section for search results
 */

"use client";

import { MusicCard } from "@/components/content/MusicCard";

interface SectionItem {
  id: string;
  name: string;
  image: string;
  type: "track" | "playlist" | "album" | "artist";
  uri?: string;
  description?: string;
  artists?: string;
}

interface SearchSectionProps {
  title: string;
  items: SectionItem[];
  cardType: "music" | "artist";
  onShowAll?: () => void;
}

export function SearchSection({
  title,
  items,
  cardType,
  onShowAll,
}: SearchSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-white">{title}</h2>
        {onShowAll && (
          <button
            onClick={onShowAll}
            className="text-[12px] font-bold text-[#B3B3B3] uppercase tracking-wider hover:underline"
          >
            Show all
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {items.map((item) => (
          <MusicCard
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            type={item.type}
            description={item.description || item.artists || ""}
            cardType={cardType}
          />
        ))}
      </div>
    </section>
  );
}
