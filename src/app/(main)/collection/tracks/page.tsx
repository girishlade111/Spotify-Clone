'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { getSavedTracks, startPlayback } from '@/services/spotify';
import { TrackList } from '@/components/content/TrackList';
import { EmptyStates } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { SpotifyPlaylistTrack } from '@/types/spotify';

export default function LikedSongsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(0);
  const [allTracks, setAllTracks] = useState<SpotifyPlaylistTrack[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'recents' | 'title' | 'artist' | 'album'>('recents');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { likedTrackIds, toggleLikedTrack } = useLibraryStore();

  // Fetch saved tracks
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['saved-tracks', offset],
    queryFn: () => getSavedTracks(50, offset),
    enabled: !!session?.accessToken,
  });

  // Load more tracks when data changes
  useEffect(() => {
    if (data) {
      setAllTracks((prev) => {
        const newTracks = data.items.filter(
          (item) => !prev.find((p) => p.track?.id === item.track?.id)
        );
        if (newTracks.length === 0) {
          setHasMore(false);
        }
        return [...prev, ...newTracks];
      });

      if (data.items.length < 50) {
        setHasMore(false);
      }
    }
  }, [data]);

  // Infinite scroll
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !hasMore || isLoading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        setOffset((prev) => prev + 50);
      }
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  // Sort tracks
  const sortedTracks = useCallback(() => {
    const tracks = [...allTracks];
    switch (sortBy) {
      case 'title':
        return tracks.sort((a, b) =>
          (a.track?.name || '').localeCompare(b.track?.name || '')
        );
      case 'artist':
        return tracks.sort((a, b) => {
          const artistA = a.track?.artists?.[0]?.name || '';
          const artistB = b.track?.artists?.[0]?.name || '';
          return artistA.localeCompare(artistB);
        });
      case 'album':
        return tracks.sort((a, b) =>
          (a.track?.album?.name || '').localeCompare(b.track?.album?.name || '')
        );
      case 'recents':
      default:
        return tracks; // Already in reverse chronological order
    }
  }, [allTracks, sortBy]);

  const handlePlayAll = async () => {
    if (sortedTracks().length === 0) return;

    const firstTrack = sortedTracks()[0].track;
    if (firstTrack) {
      setCurrentTrack(firstTrack);
      setIsPlaying(true);

      try {
        await startPlayback(undefined, undefined, [firstTrack.uri]);
      } catch (error) {
        console.error('Failed to start playback:', error);
      }
    }
  };

  const handleUnlike = (trackId: string) => {
    toggleLikedTrack(trackId);
  };

  const sortOptions = [
    { value: 'recents', label: 'Custom order' },
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'album', label: 'Album' },
  ];

  const username = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';

  if (isLoading && allTracks.length === 0) {
    return (
      <div className="p-6">
        {EmptyStates.loading()}
      </div>
    );
  }

  if (allTracks.length === 0) {
    return (
      <div className="p-6">
        {EmptyStates.emptyLibrary()}
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Special Gradient Header */}
      <div
        className="min-h-[340px] flex items-end p-6"
        style={{
          background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)',
        }}
      >
        {/* Album Art */}
        <div
          className="w-[232px] h-[232px] flex-shrink-0 rounded shadow-2xl flex items-center justify-center mr-6"
          style={{
            background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)',
            boxShadow: '0 4px 60px rgba(0,0,0,0.5)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Metadata */}
        <div className="flex flex-col pb-4">
          <span className="text-sm font-medium text-white uppercase">Playlist</span>
          <h1 className="text-4xl md:text-6xl lg:text-[96px] font-black text-white mt-2 max-w-full truncate">
            Liked Songs
          </h1>
          <div className="flex items-center gap-1 mt-4 text-sm text-white">
            <span className="font-bold">{username}</span>
            <span>•</span>
            <span>{allTracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-b from-black/20 to-[#121212]">
        {/* Play Button */}
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          aria-label="Play all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-black">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
            aria-label="Sort options"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
            </svg>
          </button>

          {showSortMenu && (
            <div className="absolute top-full left-0 mt-2 bg-[#282828] rounded shadow-xl py-2 z-10 min-w-[160px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as typeof sortBy);
                    setShowSortMenu(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors',
                    sortBy === option.value ? 'text-white' : 'text-[#A7A7A7]'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-6">
        <TrackList
          tracks={sortedTracks().map((item) => ({
            track: item.track!,
            addedAt: item.added_at,
          })).filter((item) => item.track)}
          contextUri="spotify:collection:tracks"
          showArtwork
          showAlbum
          showDateAdded
        />
      </div>
    </div>
  );
}
