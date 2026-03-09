/**
 * Music Card Component - Standard card for albums, playlists, tracks
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayButton } from "@/components/ui/PlayButton";

interface MusicCardProps {
  id: string;
  name: string;
  image: string;
  type: "track" | "playlist" | "album" | "artist";
  description?: string;
  cardType?: "music" | "artist";
}

export function MusicCard({
  id,
  name,
  image,
  type,
  description = "",
  cardType = "music",
}: MusicCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "artist") {
      router.push(`/artist/${id}`);
    } else if (type === "album") {
      router.push(`/album/${id}`);
    } else if (type === "playlist") {
      router.push(`/playlist/${id}`);
    } else if (type === "track") {
      // Could play track directly or navigate to album
      console.log("Play track:", id);
    }
  };

  const isArtist = cardType === "artist" || type === "artist";

  return (
    <div
      onClick={handleClick}
      className="group bg-[#181818] p-4 rounded-[8px] cursor-pointer hover:bg-[#282828] transition-all duration-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative mb-4">
        <div
          className={`relative ${
            isArtist ? "aspect-square rounded-full overflow-hidden" : "aspect-square rounded-[4px] overflow-hidden"
          }`}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
            unoptimized
          />
        </div>

        {/* Play Button (appears on hover) */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <PlayButton size={48} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold text-white truncate mb-1">
        {name}
      </h3>

      {/* Description/Subtitle */}
      {description && (
        <p className="text-[13px] text-[#A7A7A7] line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
}
