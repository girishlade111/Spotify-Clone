'use client';

import { usePlayerStore } from '@/store/playerStore';
import { TrackInfo } from '@/components/player/TrackInfo';
import { PlayerControls } from '@/components/player/PlayerControls';
import { PlaybackExtra } from '@/components/player/PlaybackExtra';
import { cn } from '@/lib/utils';

export function NowPlayingBar() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  return (
    <div
      className={cn(
        'h-[72px] bg-[#181818] border-t border-[#282828]',
        'flex items-center px-4 z-[100]'
      )}
    >
      <div className="w-full grid grid-cols-[1fr_minmax(0,722px)_1fr] gap-4">
        {/* Left Section - Track Info */}
        <div className="flex items-center min-w-0">
          {currentTrack ? (
            <TrackInfo onExpand={() => usePlayerStore.getState().toggleFullscreen()} />
          ) : (
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-[#282828] rounded" />
              <div className="flex flex-col gap-1">
                <div className="w-24 h-4 bg-[#282828] rounded" />
                <div className="w-16 h-3 bg-[#282828] rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Center Section - Player Controls */}
        <div className="flex items-center justify-center">
          <PlayerControls />
        </div>

        {/* Right Section - Playback Extra */}
        <div className="flex items-center justify-end min-w-0">
          <PlaybackExtra />
        </div>
      </div>
    </div>
  );
}
