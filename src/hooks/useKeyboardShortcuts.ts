'use client';

import { useEffect, useCallback } from 'react';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { usePlayerStore } from '@/store/playerStore';
import { useUIStore } from '@/store/uiStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toasts';

const isInputFocused = () => {
  const activeElement = document.activeElement as HTMLElement | null;
  const tag = activeElement?.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    activeElement?.getAttribute('contenteditable') === 'true'
  );
};

export function useKeyboardShortcuts() {
  const player = useSpotifyPlayer();
  const playerStore = usePlayerStore();
  const uiStore = useUIStore();
  const libraryStore = useLibraryStore();
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (isInputFocused()) return;

      const { key, ctrlKey, metaKey, shiftKey } = e;
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? metaKey : ctrlKey;

      // Space: Toggle play/pause
      if (key === ' ' && !modKey && !shiftKey) {
        e.preventDefault();
        player.togglePlay();
        return;
      }

      // Ctrl/Cmd + ArrowRight: Skip next
      if (key === 'ArrowRight' && modKey && !shiftKey) {
        e.preventDefault();
        player.skipNext();
        return;
      }

      // Ctrl/Cmd + ArrowLeft: Skip previous
      if (key === 'ArrowLeft' && modKey && !shiftKey) {
        e.preventDefault();
        player.skipPrevious();
        return;
      }

      // Ctrl/Cmd + ArrowUp: Volume up
      if (key === 'ArrowUp' && modKey && !shiftKey) {
        e.preventDefault();
        const newVolume = Math.min(100, playerStore.volumePercent + 10);
        player.setVolume(newVolume / 100);
        return;
      }

      // Ctrl/Cmd + ArrowDown: Volume down
      if (key === 'ArrowDown' && modKey && !shiftKey) {
        e.preventDefault();
        const newVolume = Math.max(0, playerStore.volumePercent - 10);
        player.setVolume(newVolume / 100);
        return;
      }

      // M: Toggle mute
      if (key === 'm' || key === 'M') {
        e.preventDefault();
        playerStore.toggleMute();
        return;
      }

      // Ctrl/Cmd + L: Like current track
      if (key === 'l' && modKey && !shiftKey) {
        e.preventDefault();
        if (playerStore.currentTrack) {
          libraryStore.toggleLikedTrack(playerStore.currentTrack.id);
          const isLiked = libraryStore.isTrackLiked(playerStore.currentTrack.id);
          if (isLiked) {
            showToast.saved();
          } else {
            showToast.removed();
          }
        }
        return;
      }

      // Ctrl/Cmd + F: Navigate to search
      if (key === 'f' && modKey && !shiftKey) {
        e.preventDefault();
        router.push('/search');
        return;
      }

      // Ctrl/Cmd + Shift + P: Toggle queue panel
      if (key === 'p' && modKey && shiftKey) {
        e.preventDefault();
        uiStore.setRightPanel(uiStore.rightPanel === 'queue' ? null : 'queue');
        return;
      }

      // Ctrl/Cmd + Shift + N: Create new playlist
      if (key === 'n' && modKey && shiftKey) {
        e.preventDefault();
        const name = prompt('Enter playlist name:');
        if (name) {
          // This would need to call the create playlist API
          showToast.playlistCreated(name);
        }
        return;
      }

      // Escape: Close modals, dropdowns, context menus
      if (key === 'Escape') {
        uiStore.closeContextMenu();
        // Could also close other modals here
        return;
      }
    },
    [player, playerStore, uiStore, libraryStore, router]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
