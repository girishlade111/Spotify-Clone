/**
 * Shortcut Tile Component - Home page greeting tiles
 */

"use client";

import Image from "next/image";
import { PlayButton } from "@/components/ui/PlayButton";

interface ShortcutTileProps {
  id: string;
  name: string;
  image: string;
  uri: string;
  type: "track" | "playlist" | "album" | "artist";
}

export function ShortcutTile({ id, name, image, uri, type }: ShortcutTileProps) {
  const handleClick = () => {
    // Navigate based on type
    if (type === "track") {
      // Could play track directly
      console.log("Play track:", uri);
    } else if (type === "playlist") {
      window.location.href = `/playlist/${id}`;
    } else if (type === "album") {
      window.location.href = `/album/${id}`;
    } else if (type === "artist") {
      window.location.href = `/artist/${id}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative h-12 flex items-center bg-white/10 rounded-[4px] cursor-pointer hover:bg-white/20 transition-colors overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Album Art */}
      <div className="h-12 w-12 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>

      {/* Title */}
      <span className="flex-1 px-3 text-sm font-bold text-white truncate">
        {name}
      </span>

      {/* Play Button (appears on hover) */}
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        <PlayButton size={32} />
      </div>
    </div>
  );
}
