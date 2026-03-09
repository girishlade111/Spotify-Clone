'use client';

import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDuration } from '@/lib/formatters';
import type { SpotifyTrack } from '@/types/spotify';

interface QueueItemProps {
  track: SpotifyTrack;
  isCurrentTrack?: boolean;
  isDraggable?: boolean;
  onRemove?: () => void;
}

export function QueueItem({
  track,
  isCurrentTrack = false,
  isDraggable = false,
  onRemove,
}: QueueItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: track.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 h-14 px-4 rounded hover:bg-white/10 cursor-pointer transition-colors"
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#A7A7A7]">
            <path d="M5 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM5 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </div>
      )}

      {/* Album Art */}
      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden">
        <Image
          src={track.album?.images?.[0]?.url || '/placeholder-album.jpg'}
          alt={track.album?.name || 'Album art'}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-sm text-white truncate">{track.name}</span>
        <span className="text-xs text-[#A7A7A7] truncate">
          {track.artists?.map((a) => a.name).join(', ')}
        </span>
      </div>

      {/* Duration */}
      <span className="text-xs text-[#A7A7A7] tabular-nums">
        {formatDuration(track.duration_ms)}
      </span>

      {/* Remove Button */}
      {isDraggable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-[#A7A7A7] hover:text-white transition-all"
          aria-label="Remove from queue"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M3.465 1.586a.5.5 0 0 0-.707.708L4.414 4 2.758 5.656a.5.5 0 1 0 .707.708L5.12 4.707l1.656 1.656a.5.5 0 1 0 .708-.707L5.828 4l1.656-1.656a.5.5 0 0 0-.707-.708L5.12 3.293 3.465 1.586zM2 9.5A.5.5 0 0 1 2.5 9h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
