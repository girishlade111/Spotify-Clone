/**
 * Section Row Component - Horizontal scrollable section with cards
 */

"use client";

import { useRouter } from "next/navigation";
import { MusicCard } from "@/components/content/MusicCard";
import type { SpotifyImage } from "@/types/spotify";

interface SectionItem {
  id: string;
  name: string;
  image: string;
  type: "track" | "playlist" | "album" | "artist";
  uri?: string;
  description?: string;
  artists?: string;
}

interface SectionRowProps {
  title: string;
  items: SectionItem[];
  cardType: "music" | "artist";
  onShowAll?: () => void;
}

export function SectionRow({
  title,
  items,
  cardType,
  onShowAll,
}: SectionRowProps) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 group">
        <h2 className="text-[20px] font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        {onShowAll && (
          <button
            onClick={onShowAll}
            className="text-[12px] font-bold text-[#B3B3B3] uppercase tracking-wider hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
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
