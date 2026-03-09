/**
 * Track List Component
 * Table-like list of tracks with header row
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { TrackRow } from "./TrackRow";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SpotifyTrack } from "@/types/spotify";

interface TrackListItem {
  track: SpotifyTrack;
  addedAt?: string;
}

interface TrackListProps {
  tracks: TrackListItem[];
  contextUri: string;
  showArtwork?: boolean;
  showAlbum?: boolean;
  showDateAdded?: boolean;
  isLoading?: boolean;
  onTrackPlay?: (track: SpotifyTrack, index: number) => void;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

function TrackRowSkeleton() {
  return (
    <div
      className="grid items-center h-14 px-4 rounded-[4px]"
      style={{
        gridTemplateColumns: "16px minmax(0, 4fr) minmax(0, 2fr) minmax(0, 1fr) auto",
      }}
    >
      <div className="flex items-center justify-center w-4">
        <Skeleton width={16} height={16} variant="rect" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} variant="rect" />
        <div className="flex-1">
          <Skeleton width={200} height={16} className="mb-2" />
          <Skeleton width={120} height={12} />
        </div>
      </div>
      <Skeleton width={100} height={14} />
      <Skeleton width={80} height={14} />
      <div className="flex items-center justify-end gap-4">
        <Skeleton width={20} height={20} variant="circle" />
        <Skeleton width={40} height={14} />
        <Skeleton width={16} height={16} variant="circle" />
      </div>
    </div>
  );
}

export function TrackList({
  tracks,
  contextUri,
  showArtwork = false,
  showAlbum = false,
  showDateAdded = false,
  isLoading = false,
  onTrackPlay,
}: TrackListProps) {
  const { currentTrack, isPlaying } = usePlayerStore();
  const [visibleCount, setVisibleCount] = useState(100);
  const listRef = useRef<HTMLDivElement>(null);

  // Infinite scroll - load more tracks when near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 500;

      if (nearBottom && visibleCount < tracks.length) {
        setVisibleCount((prev) => Math.min(prev + 50, tracks.length));
      }
    };

    const element = listRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [tracks.length, visibleCount]);

  const handleTrackPlay = (track: SpotifyTrack, index: number) => {
    onTrackPlay?.(track, index);
  };

  const handleMoreClick = (e: React.MouseEvent, track: SpotifyTrack) => {
    e.stopPropagation();
    // TODO: Open context menu
    console.log("More clicked for track:", track.id);
  };

  // Grid columns for header
  const headerGrid = showAlbum
    ? "16px minmax(0, 4fr) minmax(0, 2fr) minmax(0, 1fr) auto"
    : "16px minmax(0, 4fr) minmax(0, 1fr) auto";

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {/* Header */}
        <div
          className="grid h-9 px-4 text-xs font-bold text-[#A7A7A7] uppercase tracking-wider sticky top-16 z-10"
          style={{ gridTemplateColumns: headerGrid }}
        >
          <div className="flex items-center justify-center">#</div>
          <div>Title</div>
          {showAlbum && <div>Album</div>}
          {showDateAdded && <div>Date Added</div>}
          <div className="flex items-center justify-end">
            <ClockIcon />
          </div>
        </div>

        {/* Skeletons */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="py-1">
            <TrackRowSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex flex-col">
      {/* Header */}
      <div
        className="grid h-9 px-4 text-xs font-bold text-[#A7A7A7] uppercase tracking-wider sticky top-16 z-10 hover:[&_*]:text-white transition-colors"
        style={{ gridTemplateColumns: headerGrid }}
      >
        <div className="flex items-center justify-center">#</div>
        <div>Title</div>
        {showAlbum && <div>Album</div>}
        {showDateAdded && <div>Date Added</div>}
        <div className="flex items-center justify-end">
          <ClockIcon />
        </div>
      </div>

      {/* Track Rows */}
      <div className="flex flex-col gap-1 py-2">
        {tracks.slice(0, visibleCount).map((item, index) => (
          <TrackRow
            key={`${item.track.id}-${index}`}
            track={item.track}
            index={index}
            showArtwork={showArtwork}
            showAlbum={showAlbum}
            showDateAdded={showDateAdded}
            addedAt={item.addedAt}
            contextUri={contextUri}
            isActive={currentTrack?.id === item.track.id}
            isPlaying={isPlaying}
            onPlay={() => handleTrackPlay(item.track, index)}
            onMoreClick={(e) => handleMoreClick(e, item.track)}
          />
        ))}
      </div>

      {/* Load more indicator */}
      {visibleCount < tracks.length && (
        <div className="py-4 text-center">
          <span className="text-sm text-[#A7A7A7]">
            Loading more tracks...
          </span>
        </div>
      )}
    </div>
  );
}
