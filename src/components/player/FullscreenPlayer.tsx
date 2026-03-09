'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { useUIStore } from '@/store/uiStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { PlayerControls } from '@/components/player/PlayerControls';
import { QueueItem } from '@/components/queue/QueueItem';
import { cn } from '@/lib/utils';

export function FullscreenPlayer() {
  const player = useSpotifyPlayer();
  const playerStore = usePlayerStore();
  const uiStore = useUIStore();
  const libraryStore = useLibraryStore();

  const [activeTab, setActiveTab] = useState<'queue' | 'lyrics' | 'about'>('queue');

  const currentTrack = playerStore.currentTrack;
  const isLiked = currentTrack ? libraryStore.isTrackLiked(currentTrack.id) : false;
  const dominantColor = uiStore.pageDominantColor;

  const handleToggleLike = () => {
    if (currentTrack) {
      libraryStore.toggleLikedTrack(currentTrack.id);
    }
  };

  const handleClose = () => {
    playerStore.toggleFullscreen();
  };

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {playerStore.isFullscreenOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{
            background: `linear-gradient(180deg, ${dominantColor}26 0%, #000000 100%)`,
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 left-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Minimize"
            title="Minimize"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
          </button>

          {/* Main Content */}
          <div className="flex gap-16 max-w-[1100px] w-full h-full max-h-[800px]">
            {/* Left Column - Album Art */}
            <div className="max-w-[480px] flex-shrink-0 flex flex-col justify-center">
              <motion.div
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl"
                style={{
                  boxShadow: '0 4px 60px rgba(0,0,0,0.6)',
                }}
                animate={{
                  scale: player.isPlaying ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src={currentTrack.album?.images?.[0]?.url || '/placeholder-album.jpg'}
                  alt={currentTrack.album?.name || 'Album art'}
                  fill
                  className="object-cover"
                  priority
                  sizes="480px"
                />
              </motion.div>
            </div>

            {/* Right Column - Controls & Info */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              {/* Top Section - Track Info & Actions */}
              <div className="space-y-4">
                {/* Title & Artist */}
                <div>
                  <h1 className="text-2xl font-bold text-white truncate">
                    {currentTrack.name}
                  </h1>
                  <div className="flex items-center gap-1 mt-1">
                    {currentTrack.artists?.map((artist, index) => (
                      <span key={artist.id} className="flex items-center">
                        <Link
                          href={`/artist/${artist.id}`}
                          className="text-lg text-[#A7A7A7] hover:text-white hover:underline transition-colors"
                        >
                          {artist.name}
                        </Link>
                        {index < currentTrack.artists.length - 1 && (
                          <span className="text-[#A7A7A7]">, </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleToggleLike}
                    className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isLiked ? '#1DB954' : 'currentColor'}
                      className="w-6 h-6"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>

                  <button
                    className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
                    aria-label="Add to playlist"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </button>

                  <button
                    className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
                    aria-label="More options"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Middle Section - Player Controls */}
              <div className="flex-1 flex flex-col justify-center">
                <PlayerControls variant="large" />
              </div>

              {/* Bottom Section - Tabs */}
              <div className="border-t border-white/10 pt-4">
                {/* Tab Headers */}
                <div className="flex gap-8 mb-4">
                  <button
                    onClick={() => setActiveTab('queue')}
                    className={cn(
                      'text-base font-medium transition-colors',
                      activeTab === 'queue'
                        ? 'text-white'
                        : 'text-[#A7A7A7] hover:text-white'
                    )}
                  >
                    Queue
                  </button>
                  <button
                    onClick={() => setActiveTab('lyrics')}
                    className={cn(
                      'text-base font-medium transition-colors',
                      activeTab === 'lyrics'
                        ? 'text-white'
                        : 'text-[#A7A7A7] hover:text-white'
                    )}
                  >
                    Lyrics
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={cn(
                      'text-base font-medium transition-colors',
                      activeTab === 'about'
                        ? 'text-white'
                        : 'text-[#A7A7A7] hover:text-white'
                    )}
                  >
                    About the artist
                  </button>
                </div>

                {/* Tab Content */}
                <div className="h-48 overflow-y-auto">
                  {activeTab === 'queue' && (
                    <div className="space-y-1">
                      {currentTrack && (
                        <div className="px-2">
                          <p className="text-xs font-medium uppercase tracking-wider text-[#A7A7A7] mb-2">
                            Now playing
                          </p>
                          <QueueItem track={currentTrack} isCurrentTrack />
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'lyrics' && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#A7A7A7] mb-3">
                        <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                      </svg>
                      <p className="text-sm text-[#A7A7A7]">Lyrics not available</p>
                    </div>
                  )}

                  {activeTab === 'about' && currentTrack.artists?.[0] && (
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden bg-[#282828]">
                        <div className="w-full h-full flex items-center justify-center text-[#A7A7A7]">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white">
                          {currentTrack.artists[0].name}
                        </h3>
                        <p className="text-sm text-[#A7A7A7] line-clamp-2">
                          Artist bio would appear here...
                        </p>
                        <Link
                          href={`/artist/${currentTrack.artists[0].id}`}
                          className="text-sm text-white hover:underline mt-2 inline-block"
                        >
                          See full artist profile →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
