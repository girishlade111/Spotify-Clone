'use client';

import { useState, useCallback } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/formatters';

interface PlayerControlsProps {
  variant?: 'normal' | 'large';
}

export function PlayerControls({ variant = 'normal' }: PlayerControlsProps) {
  const player = useSpotifyPlayer();
  const playerStore = usePlayerStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const isLarge = variant === 'large';

  const handleSeek = useCallback(
    (value: number) => {
      if (isDragging) {
        setDragValue(value);
      }
    },
    [isDragging]
  );

  const handleSeekComplete = useCallback(
    (value: number) => {
      setIsDragging(false);
      setDragValue(null);
      player.seek(value);
    },
    [player]
  );

  const handleSeekStart = useCallback(() => {
    setIsDragging(true);
    setDragValue(playerStore.progressMs);
  }, [playerStore.progressMs]);

  const handleShuffleClick = useCallback(() => {
    player.setShuffle(!playerStore.shuffleState);
  }, [player, playerStore.shuffleState]);

  const handleRepeatClick = useCallback(() => {
    const states: Array<'off' | 'context' | 'track'> = ['off', 'context', 'track'];
    const currentIndex = states.indexOf(playerStore.repeatState);
    const nextState = states[(currentIndex + 1) % 3];
    player.setRepeat(nextState);
  }, [player, playerStore.repeatState]);

  const displayProgress = isDragging ? dragValue ?? 0 : playerStore.progressMs;

  return (
    <div className={cn(
      'flex flex-col items-center gap-2 w-full',
      isLarge ? 'gap-4' : 'gap-2'
    )}>
      {/* Control Buttons Row */}
      <div className="flex items-center gap-2">
        {/* Shuffle */}
        <button
          onClick={handleShuffleClick}
          className={cn(
            'relative p-2 text-[#A7A7A7] hover:text-white transition-colors',
            playerStore.shuffleState && 'text-[#1DB954] hover:text-[#1ed760]'
          )}
          title={playerStore.shuffleState ? 'Disable shuffle' : 'Enable shuffle'}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-5 h-5' : 'w-4 h-4')}>
            <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.948l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
            <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.948l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z" />
          </svg>
          {playerStore.shuffleState && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1DB954] rounded-full" />
          )}
        </button>

        {/* Previous */}
        <button
          onClick={player.skipPrevious}
          className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
          title="Previous"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-5 h-5' : 'w-4 h-4')}>
            <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={player.togglePlay}
          disabled={!player.isReady}
          className={cn(
            'flex items-center justify-center rounded-full bg-white text-black',
            'hover:scale-106 active:scale-95 transition-transform duration-100',
            isLarge ? 'w-16 h-16' : 'w-8 h-8'
          )}
          title={player.isPlaying ? 'Pause' : 'Play'}
        >
          {!player.isReady ? (
            // Loading spinner
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : player.isPlaying ? (
            // Pause icon
            <div className="flex gap-0.5">
              <div className={cn(isLarge ? 'w-1 h-4' : 'w-0.5 h-3.5')} bg-black rounded-full />
              <div className={cn(isLarge ? 'w-1 h-4' : 'w-0.5 h-3.5')} bg-black rounded-full />
            </div>
          ) : (
            // Play icon
            <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-6 h-6' : 'w-4 h-4')}>
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={player.skipNext}
          className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
          title="Next"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-5 h-5' : 'w-4 h-4')}>
            <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={handleRepeatClick}
          className={cn(
            'relative p-2 text-[#A7A7A7] hover:text-white transition-colors',
            playerStore.repeatState !== 'off' && 'text-[#1DB954] hover:text-[#1ed760]'
          )}
          title={
            playerStore.repeatState === 'off'
              ? 'Enable repeat'
              : playerStore.repeatState === 'context'
                ? 'Enable repeat one'
                : 'Disable repeat'
          }
        >
          {playerStore.repeatState === 'track' ? (
            // Repeat one icon
            <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-5 h-5' : 'w-4 h-4')}>
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.81 12h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5a2.25 2.25 0 0 0-2.25 2.25v5c0 .414.336.75.75.75s.75-.336.75-.75v-5z" />
              <path d="M9.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 3.5a.5.5 0 0 0-.5.5v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708L9 12.293V10a.5.5 0 0 0-.5-.5z" />
            </svg>
          ) : (
            // Repeat icon
            <svg viewBox="0 0 16 16" fill="currentColor" className={cn(isLarge ? 'w-5 h-5' : 'w-4 h-4')}>
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.81 12h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5a2.25 2.25 0 0 0-2.25 2.25v5c0 .414.336.75.75.75s.75-.336.75-.75v-5z" />
            </svg>
          )}
          {playerStore.repeatState !== 'off' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1DB954] rounded-full" />
          )}
        </button>
      </div>

      {/* Progress Bar Row */}
      <div className="flex items-center gap-2 w-full">
        {/* Current Time */}
        <span className={cn(
          'text-[#A7A7A7] text-xs min-w-10 text-right tabular-nums',
          isLarge && 'text-sm min-w-12'
        )}>
          {formatDuration(displayProgress)}
        </span>

        {/* Slider */}
        <div onMouseDown={handleSeekStart}>
          <Slider
            value={displayProgress}
            max={playerStore.durationMs || 1}
            onChange={handleSeek}
            onChangeComplete={handleSeekComplete}
            showTooltip
            color="#1DB954"
            height={isLarge ? 5 : 4}
          />
        </div>

        {/* Total Duration */}
        <span className={cn(
          'text-[#A7A7A7] text-xs min-w-10 tabular-nums',
          isLarge && 'text-sm min-w-12'
        )}>
          {formatDuration(playerStore.durationMs)}
        </span>
      </div>
    </div>
  );
}
