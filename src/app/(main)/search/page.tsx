/**
 * Search Page - Default view with genre browsing
 */

"use client";

import { useRouter } from "next/navigation";
import { GenreCard } from "@/components/search/GenreCard";
import { GENRE_COLORS } from "@/lib/constants";

const GENRES = [
  { id: "pop", name: "Pop" },
  { id: "hip-hop", name: "Hip-Hop" },
  { id: "dance-electronic", name: "Dance/Electronic" },
  { id: "rnb", name: "R&B" },
  { id: "indie", name: "Indie" },
  { id: "rock", name: "Rock" },
  { id: "latin", name: "Latin" },
  { id: "podcasts", name: "Podcasts" },
  { id: "mood", name: "Mood" },
  { id: "country", name: "Country" },
  { id: "jazz", name: "Jazz" },
  { id: "classical", name: "Classical" },
  { id: "k-pop", name: "K-Pop" },
  { id: "chill", name: "Chill" },
  { id: "gaming", name: "Gaming" },
  { id: "soul", name: "Soul" },
  { id: "metal", name: "Metal" },
  { id: "alternative", name: "Alternative" },
  { id: "focus", name: "Focus" },
  { id: "wellness", name: "Wellness" },
];

export default function SearchPage() {
  const router = useRouter();

  const handleGenreClick = (genreId: string) => {
    router.push(`/search/${genreId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-bold text-white mb-6">Browse all</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {GENRES.map((genre) => (
          <GenreCard
            key={genre.id}
            id={genre.id}
            name={genre.name}
            color={GENRE_COLORS[genre.id as keyof typeof GENRE_COLORS] || "#8B5CF6"}
            onClick={() => handleGenreClick(genre.id)}
          />
        ))}
      </div>
    </div>
  );
}
