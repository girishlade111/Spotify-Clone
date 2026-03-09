/**
 * Track Row Component
 * Individual track row in track lists
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayingIndicator } from "@/components/ui/PlayingIndicator";
import { HeartButton } from "@/components/ui/HeartButton";
import { IconButton } from "@/components/ui/IconButton";
import { formatDuration } from "@/lib/formatters";
import type { SpotifyTrack } from "@/types/spotify";

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  showArtwork?: boolean;
  showAlbum?: boolean;
  showDateAdded?: boolean;
  addedAt?: string;
  contextUri: string;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onMoreClick?: (e: React.MouseEvent) => void;
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function ExplicitBadge() {
  return (
    <span className="inline-flex items-center justify-center w-3 h-3 bg-[#A7A7A7] text-[#121212] text-[8px] font-bold rounded-[2px] ml-1">
      E
    </span>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }
  if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function TrackRow({
  track,
  index,
  showArtwork = false,
  showAlbum = false,
  showDateAdded = false,
  addedAt,
  contextUri,
  isActive,
  isPlaying,
  onPlay,
  onMoreClick,
}: TrackRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  const trackNumber = track.track_number || index + 1;

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMoreClick?.(e);
  };

  const handleDoubleClick = () => {
    onPlay();
  };

  // Grid columns based on what's shown
  const gridTemplate = showAlbum
    ? "16px minmax(0, 4fr) minmax(0, 2fr) minmax(0, 1fr) auto"
    : "16px minmax(0, 4fr) minmax(0, 1fr) auto";

  return (
    <div
      role="row"
      tabIndex={0}
      onClick={onPlay}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleRightClick}
      className="grid items-center h-14 px-4 rounded-[4px] cursor-pointer transition-colors hover:bg-white/10"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {/* Column 1: Index/Indicator */}
      <div className="flex items-center justify-center w-4">
        {isActive && isPlaying ? (
          <PlayingIndicator isPlaying={true} size="sm" />
        ) : isActive ? (
          <span className="text-[#1DB954] text-base">
            {isHovered ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
          </span>
        ) : isHovered ? (
          <span className="text-white">
            <PlayIcon size={16} />
          </span>
        ) : (
          <span className="text-[#A7A7A7] text-base">{trackNumber}</span>
        )}
      </div>

      {/* Column 2: Track Info */}
      <div className="flex items-center gap-3 min-w-0">
        {showArtwork && track.album?.images?.[0]?.url && (
          <div className="w-10 h-10 rounded-[4px] overflow-hidden flex-shrink-0 relative">
            <Image
              src={track.album.images[0].url}
              alt={track.album.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span
              className={`text-base font-normal truncate ${
                isActive ? "text-[#1DB954]" : "text-white"
              }`}
            >
              {track.name}
            </span>
            {track.explicit && <ExplicitBadge />}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {track.artists?.map((artist, i) => (
              <span key={artist.id}>
                <Link
                  href={`/artist/${artist.id}`}
                  className="text-sm text-[#A7A7A7] hover:text-white hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {artist.name}
                </Link>
                {i < track.artists.length - 1 && (
                  <span className="text-[#A7A7A7]">, </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Album */}
      {showAlbum && track.album && (
        <Link
          href={`/album/${track.album.id}`}
          className="text-sm text-[#A7A7A7] hover:text-white hover:underline truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {track.album.name}
        </Link>
      )}

      {/* Column 4: Date Added */}
      {showDateAdded && addedAt && (
        <span className="text-sm text-[#A7A7A7]">
          {formatRelativeTime(addedAt)}
        </span>
      )}

      {/* Column 5: Duration + Heart + More */}
      <div className="flex items-center justify-end gap-4">
        <HeartButton trackId={track.id} size="sm" />
        <span className="text-sm text-[#A7A7A7] min-w-[40px] text-right">
          {formatDuration(track.duration_ms)}
        </span>
        <IconButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          }
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick?.(e);
          }}
          className={isHovered ? "opacity-100" : "opacity-0"}
          size="sm"
        />
      </div>
    </div>
  );
}
