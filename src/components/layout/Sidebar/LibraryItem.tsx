/**
 * Library Item Component
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlayingIndicator } from "@/components/ui/PlayingIndicator";
import { Tooltip } from "@/components/ui/Tooltip";
import type { SpotifyPlaylist, SpotifyAlbum, SpotifyArtist } from "@/types/spotify";

type LibraryItemType = SpotifyPlaylist | SpotifyAlbum | SpotifyArtist;

interface LibraryItemProps {
  item: LibraryItemType;
  isActive: boolean;
  isPlaying: boolean;
  collapsed: boolean;
  type: "playlist" | "album" | "artist" | "show";
}

export function LibraryItem({
  item,
  isActive,
  isPlaying,
  collapsed,
  type,
}: LibraryItemProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const getTitle = () => {
    return item.name;
  };

  const getSubtitle = () => {
    if (type === "playlist") {
      const playlist = item as SpotifyPlaylist;
      const owner = playlist.owner?.display_name || playlist.owner?.id || "Unknown";
      return `Playlist • ${owner}`;
    }
    if (type === "album") {
      const album = item as SpotifyAlbum;
      const year = album.release_date?.split("-")[0] || "";
      return `Album • ${year}`;
    }
    if (type === "artist") {
      return "Artist";
    }
    return "";
  };

  const getThumbnailUrl = () => {
    if (item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    return null;
  };

  const getHref = () => {
    if (type === "playlist") {
      return `/playlist/${item.id}`;
    }
    if (type === "album") {
      return `/album/${item.id}`;
    }
    if (type === "artist") {
      return `/artist/${item.id}`;
    }
    return "#";
  };

  const isRoundImage = type === "artist";

  const content = (
    <div
      onClick={() => router.push(getHref())}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        h-16 flex items-center gap-3 px-2 rounded-[4px]
        cursor-pointer transition-colors duration-200
        ${isHovered ? "bg-white/7" : ""}
        ${collapsed ? "justify-center px-0" : ""}
      `}
    >
      {/* Thumbnail */}
      <div
        className={`
          w-12 h-12 flex-shrink-0 relative
          ${isRoundImage ? "rounded-full" : "rounded-[4px]"}
          overflow-hidden
        `}
      >
        {getThumbnailUrl() ? (
          <Image
            src={getThumbnailUrl()!}
            alt={getTitle()}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full bg-[#282828] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#A7A7A7]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
        )}

        {/* Play overlay */}
        {!collapsed && isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4 ml-0.5">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div
              className={`
                text-base font-normal truncate
                ${isActive ? "text-[#1DB954]" : "text-white"}
              `}
            >
              {getTitle()}
            </div>
            <div className="text-sm text-[#A7A7A7] truncate">
              {getSubtitle()}
            </div>
          </div>

          {/* Right side - Playing indicator or empty */}
          <div className="flex-shrink-0">
            {(isPlaying || isHovered) && (
              <PlayingIndicator isPlaying={isPlaying} size="sm" />
            )}
          </div>
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip content={getTitle()} side="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
