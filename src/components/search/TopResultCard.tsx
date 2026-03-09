/**
 * Top Result Card - Large card for the top search result
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayButton } from "@/components/ui/PlayButton";
import type { SpotifyTrack, SpotifyArtist, SpotifyAlbum, SpotifyPlaylist } from "@/types/spotify";

interface TopResultCardProps {
  item: SpotifyTrack | SpotifyArtist | SpotifyAlbum | SpotifyPlaylist;
  type: "track" | "artist" | "album" | "playlist";
}

export function TopResultCard({ item, type }: TopResultCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "artist") {
      router.push(`/artist/${item.id}`);
    } else if (type === "album") {
      router.push(`/album/${item.id}`);
    } else if (type === "playlist") {
      router.push(`/playlist/${item.id}`);
    } else if (type === "track") {
      // Navigate to album or play track
      console.log("Play track:", (item as SpotifyTrack).uri);
    }
  };

  const imageUrl = type === "track"
    ? (item as SpotifyTrack).album?.images?.[0]?.url
    : type === "playlist"
    ? (item as SpotifyPlaylist).images?.[0]?.url
    : (item as SpotifyArtist | SpotifyAlbum).images?.[0]?.url;

  const title = item.name;

  const subtitle = type === "track"
    ? (item as SpotifyTrack).artists.map((a) => a.name).join(", ")
    : type === "artist"
    ? "Artist"
    : type === "album"
    ? "Album"
    : "Playlist";

  const isRound = type === "artist";

  return (
    <div
      onClick={handleClick}
      className="group bg-[#181818] rounded-[8px] p-6 cursor-pointer hover:bg-[#282828] transition-colors relative overflow-hidden"
    >
      {/* Content */}
      <div className="flex items-end gap-6">
        {/* Image */}
        <div className={`relative flex-shrink-0 ${isRound ? "w-[92px] h-[92px] rounded-full" : "w-[92px] h-[92px]"}`}>
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-normal text-white uppercase mb-1">
            {type}
          </div>
          <h2 className="text-[32px] font-bold text-white truncate mb-1">
            {title}
          </h2>
          <p className="text-[14px] text-[#A7A7A7] truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Play Button (appears on hover) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        <PlayButton size={56} />
      </div>
    </div>
  );
}
