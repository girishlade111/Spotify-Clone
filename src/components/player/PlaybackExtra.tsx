'use client';

import { useState, useRef, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useUIStore } from '@/store/uiStore';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { Slider } from '@/components/ui/Slider';
import { DeviceMenu } from '@/components/player/DeviceMenu';
import { cn } from '@/lib/utils';

export function PlaybackExtra() {
  const player = useSpotifyPlayer();
  const playerStore = usePlayerStore();
  const uiStore = useUIStore();

  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const deviceButtonRef = useRef<HTMLButtonElement>(null);

  const handleVolumeChange = (value: number) => {
    player.setVolume(value / 100);
    if (playerStore.isMuted && value > 0) {
      // Unmute when volume is adjusted
      playerStore.setVolume(value);
    }
  };

  const handleVolumeIconClick = () => {
    playerStore.toggleMute();
  };

  const handleNowPlayingClick = () => {
    uiStore.setRightPanel(uiStore.rightPanel === 'nowplaying' ? null : 'nowplaying');
  };

  const handleQueueClick = () => {
    uiStore.setRightPanel(uiStore.rightPanel === 'queue' ? null : 'queue');
  };

  const handleDeviceClick = () => {
    setShowDeviceMenu(!showDeviceMenu);
  };

  const handleExpandClick = () => {
    playerStore.toggleFullscreen();
  };

  // Close device menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDeviceMenu &&
        deviceButtonRef.current &&
        !deviceButtonRef.current.contains(event.target as Node)
      ) {
        setShowDeviceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDeviceMenu]);

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    const volume = playerStore.isMuted ? 0 : playerStore.volumePercent;

    if (volume === 0) {
      // Volume X (muted)
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M11.537.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L2.46 8.939A.75.75 0 0 1 2.246 8.41V3.25a3.25 3.25 0 0 1 3.25-3.25h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.5 1.5a1.75 1.75 0 0 0-1.75 1.75v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L7.87 1.5H5.5Zm6.22 3.28-1.22 1.22a3.73 3.73 0 0 1 0 5.22l1.22 1.22a5.23 5.23 0 0 0 0-7.66Zm-1.22 6.44-1.22 1.22a6.73 6.73 0 0 0 0-9.88l-1.22 1.22a5.23 5.23 0 0 1 0 7.44Z" />
        </svg>
      );
    } else if (volume <= 33) {
      // Volume 1 (low)
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M9.741.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L.664 8.939A.75.75 0 0 1 .45 8.41V3.25A3.25 3.25 0 0 1 3.7 0h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.379 1.5a1.75 1.75 0 0 0-1.75 1.75v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L7.67 1.5H5.38Zm6.34 3.28a5.23 5.23 0 0 1 0 7.66l-1.22-1.22a3.73 3.73 0 0 0 0-5.22l1.22-1.22Z" />
        </svg>
      );
    } else if (volume <= 66) {
      // Volume 2 (medium)
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M9.942.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L.865 8.939A.75.75 0 0 1 .65 8.41V3.25A3.25 3.25 0 0 1 3.9 0h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.58 1.5A1.75 1.75 0 0 0 3.83 3.25v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L7.87 1.5H5.58Zm6.14 3.28a5.23 5.23 0 0 1 0 7.66l-1.22-1.22a3.73 3.73 0 0 0 0-5.22l1.22-1.22Zm1.22-1.22a6.73 6.73 0 0 1 0 9.88l-1.22-1.22a5.23 5.23 0 0 0 0-7.44l1.22-1.22Z" />
        </svg>
      );
    } else {
      // Volume 3 (high)
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M10.143.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L1.066 8.939A.75.75 0 0 1 .85 8.41V3.25A3.25 3.25 0 0 1 4.1 0h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.78 1.5A1.75 1.75 0 0 0 4.03 3.25v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L8.07 1.5H5.78Zm6.14 3.28a5.23 5.23 0 0 1 0 7.66l-1.22-1.22a3.73 3.73 0 0 0 0-5.22l1.22-1.22Zm1.22-1.22a6.73 6.73 0 0 1 0 9.88l-1.22-1.22a5.23 5.23 0 0 0 0-7.44l1.22-1.22Zm1.22-1.22a8.23 8.23 0 0 1 0 12.32l-1.22-1.22a6.73 6.73 0 0 0 0-9.88l1.22-1.22Z" />
        </svg>
      );
    }
  };

  const currentVolume = playerStore.isMuted ? 0 : playerStore.volumePercent;

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Now Playing View Toggle */}
      <button
        onClick={handleNowPlayingClick}
        className={cn(
          'p-2 text-[#A7A7A7] hover:text-white transition-colors',
          uiStore.rightPanel === 'nowplaying' && 'text-[#1DB954]'
        )}
        title="Now Playing View"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M15 14H1v-1.5h14V14zm0-4.5H1V8h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 0h9a2.5 2.5 0 0 1 2.5 2.5v1.5H1V2.5z" />
        </svg>
      </button>

      {/* Queue Toggle */}
      <button
        onClick={handleQueueClick}
        className={cn(
          'p-2 text-[#A7A7A7] hover:text-white transition-colors',
          uiStore.rightPanel === 'queue' && 'text-[#1DB954]'
        )}
        title="Queue"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
          <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
        </svg>
      </button>

      {/* Connect to Device */}
      <div className="relative">
        <button
          ref={deviceButtonRef}
          onClick={handleDeviceClick}
          className={cn(
            'p-2 text-[#A7A7A7] hover:text-white transition-colors',
            player.deviceId && 'text-[#1DB954]'
          )}
          title="Connect to a device"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0A1.75 1.75 0 0 0 0 4.25v1.5h.5v3h-.5v1.5a1.75 1.75 0 0 0 1.75 1.75h.276c.134 0 .262.032.376.088L4 12.75V3.25l-1.148.662A.75.75 0 0 1 2.5 4H1.75z" />
          </svg>
        </button>

        {/* Device Menu Popup */}
        {showDeviceMenu && (
          <DeviceMenu onClose={() => setShowDeviceMenu(false)} />
        )}
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleVolumeIconClick}
          className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
          title={playerStore.isMuted ? 'Unmute' : 'Mute'}
        >
          {getVolumeIcon()}
        </button>

        <div className="w-[93px]">
          <Slider
            value={currentVolume}
            max={100}
            onChange={handleVolumeChange}
            color="#1DB954"
            height={4}
          />
        </div>
      </div>

      {/* Fullscreen/Expand */}
      <button
        onClick={handleExpandClick}
        className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
        title="Full Screen"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3.769.016C4.256-.195 4.82.25 4.82.796v2.837a.75.75 0 0 1-1.5 0V1.867a.044.044 0 0 0-.016-.038.047.047 0 0 0-.04-.01H.796a.75.75 0 0 1 0-1.5h2.973zM.016 3.769C-.195 4.256.25 4.82.796 4.82h2.837a.75.75 0 0 0 0-1.5H1.867a.044.044 0 0 1-.038-.016.047.047 0 0 1-.01-.04V.796a.75.75 0 0 0-1.5 0v2.973zM16.016 3.769c-.211.487-.656.042-.656-.504V.428a.044.044 0 0 0-.016-.038.047.047 0 0 0-.04-.01h-2.837a.75.75 0 0 1 0-1.5h2.973c.546 0 .991.445.991.991v2.973c0 .546-.445.991-.991.991h-2.973a.75.75 0 0 0 0 1.5h2.973c.546 0 .991-.445.991-.991V.796c0-.546-.445-.991-.991-.991h-2.973a.75.75 0 0 0 0 1.5h2.837a.047.047 0 0 1 .04-.01.044.044 0 0 1 .016-.038v2.837a.75.75 0 0 0 1.5 0V.796c0-.546-.445-.991-.991-.991h-2.973a.75.75 0 0 0 0 1.5h2.837c.015 0 .029.005.04.01a.044.044 0 0 1 .016.038v2.973c0 .546.445.991.991.991h2.973a.75.75 0 0 0 0-1.5h-2.837a.047.047 0 0 1-.04-.01.044.044 0 0 1-.016-.038V.796zM3.769 15.984c.487.211.931-.234.931-.78V12.367a.75.75 0 0 0-1.5 0v1.767a.044.044 0 0 1-.016.038.047.047 0 0 1-.04.01H.796a.75.75 0 0 1 0 1.5h2.973zM16.016 12.231c-.211-.487-.656-.042-.656.504v2.837a.044.044 0 0 1-.016.038.047.047 0 0 1-.04.01h-2.837a.75.75 0 0 0 0 1.5h2.973c.546 0 .991-.445.991-.991v-2.973c0-.546-.445-.991-.991-.991h-2.973a.75.75 0 0 0 0 1.5h2.837a.047.047 0 0 0 .04-.01.044.044 0 0 0 .016-.038v-2.837a.75.75 0 0 0 1.5 0v2.973c0 .546-.445.991-.991.991h-2.973a.75.75 0 0 0 0-1.5h2.837a.047.047 0 0 0 .04-.01.044.044 0 0 0 .016-.038v-2.837z" />
        </svg>
      </button>
    </div>
  );
}
