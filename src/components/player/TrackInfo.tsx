'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { cn } from '@/lib/utils';

interface TrackInfoProps {
  onExpand?: () => void;
}

export function TrackInfo({ onExpand }: TrackInfoProps) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const { toggleLikedTrack, isTrackLiked } = useLibraryStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!currentTrack) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-[#282828] rounded" />
        <div className="flex flex-col gap-1">
          <div className="w-24 h-4 bg-[#282828] rounded" />
          <div className="w-16 h-3 bg-[#282828] rounded" />
        </div>
      </div>
    );
  }

  const isLiked = isTrackLiked(currentTrack.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikedTrack(currentTrack.id);
  };

  const handleImageClick = () => {
    onExpand?.();
  };

  return (
    <div
      className="flex items-center gap-3.5 min-w-0 max-w-[30%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album Art */}
      <div
        className="relative w-14 h-14 flex-shrink-0 rounded cursor-pointer group"
        onClick={handleImageClick}
      >
        <Image
          src={currentTrack.album?.images?.[0]?.url || '/placeholder-album.jpg'}
          alt={currentTrack.album?.name || 'Album art'}
          fill
          className="object-cover rounded"
          sizes="56px"
        />
        {/* Hover overlay with expand icon */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 rounded flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M7 14l5-5 5 5H7zm5-9L5 12h14L12 5z" />
          </svg>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Track Title */}
        <Link
          href={`/album/${currentTrack.album?.id}`}
          className="text-sm font-normal text-white truncate hover:underline block"
          title={currentTrack.name}
        >
          {currentTrack.name}
        </Link>

        {/* Artists */}
        <div className="flex items-center gap-1 text-xs text-[#A7A7A7] truncate">
          {currentTrack.artists?.map((artist, index) => (
            <span key={artist.id} className="flex items-center">
              <Link
                href={`/artist/${artist.id}`}
                className="hover:text-white hover:underline truncate"
                title={artist.name}
              >
                {artist.name}
              </Link>
              {index < currentTrack.artists.length - 1 && (
                <span className="flex-shrink-0">, </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Heart Button */}
      <button
        onClick={handleHeartClick}
        className="flex-shrink-0 w-4 h-4 text-[#A7A7A7] hover:text-white transition-colors"
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <svg
          viewBox="0 0 16 16"
          fill={isLiked ? '#1DB954' : 'currentColor'}
          className="w-full h-full"
        >
          <path d="M1.69 2A4.582 4.582 0 018 2.023c1.136-1.014 2.664-1.58 4.18-1.493 2.576.148 4.316 2.508 3.808 5.008-.35 1.723-1.358 3.228-2.548 4.538-1.232 1.354-2.73 2.533-4.193 3.682a1.698 1.698 0 01-2.494 0c-1.463-1.15-2.96-2.328-4.193-3.682-1.19-1.31-2.198-2.815-2.548-4.538C-.5 3.043 1.24.683 3.816.535 4.588.49 5.36.618 6.08.89L8 1.613l1.92-.723A4.582 4.582 0 0114.31 2c2.576.148 4.316 2.508 3.808 5.008-.35 1.723-1.358 3.228-2.548 4.538-1.232 1.354-2.73 2.533-4.193 3.682a1.698 1.698 0 01-2.494 0c-1.463-1.15-2.96-2.328-4.193-3.682-1.19-1.31-2.198-2.815-2.548-4.538C-.5 3.043 1.24.683 3.816.535 4.588.49 5.36.618 6.08.89L8 1.613l1.92-.723z" />
        </svg>
      </button>
    </div>
  );
}
