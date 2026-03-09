'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePlayerStore } from '@/store/playerStore';
import { useQueueStore } from '@/store/queueStore';
import { useUIStore } from '@/store/uiStore';
import { transferPlayback, setVolume as setVolumeApi, setRepeatMode as setRepeatModeApi, setShuffleMode as setShuffleModeApi, skipToNext as skipToNextApi, skipToPrevious as skipToPreviousApi, seekToPosition as seekToPositionApi, addToQueue as addToQueueApi } from '@/services/spotify';
import toast from 'react-hot-toast';
import type { SpotifyTrack as SpotifyTrackType } from '@/types/spotify';

declare global {
  interface Window {
    Spotify?: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  togglePlay(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  seek(position_ms: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setRepeatMode(mode: number): Promise<void>;
  setShuffle(state: boolean): Promise<void>;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  addListener(event: string, callback: (data: unknown) => void): void;
  removeListener(event: string, callback: (data: unknown) => void): void;
}

interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat_mode: number; // 0=off, 1=context, 2=track
  track_window: {
    current_track: SpotifySDKTrack;
    next_tracks: SpotifySDKTrack[];
    previous_tracks: SpotifySDKTrack[];
  };
  context: {
    uri: string | null;
    type: string | null;
  };
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number | null;
  };
}

interface SpotifySDKTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: { id: string; name: string; images: Array<{ url: string }> };
  duration_ms: number;
  explicit?: boolean;
  popularity?: number;
  disc_number?: number;
  external_ids?: Record<string, string>;
  is_local?: boolean;
  is_playable?: boolean;
  preview_url?: string | null;
  linked_from?: unknown;
  track_number?: number;
  uri?: string;
  type?: string;
  external_urls?: { spotify: string };
}

export function useSpotifyPlayer() {
  const { data: session } = useSession();
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerStore = usePlayerStore();
  const queueStore = useQueueStore();
  const uiStore = useUIStore();

  const isPremiumRequired = useRef(false);

  const initializePlayer = useCallback(async () => {
    if (!window.Spotify || !session?.accessToken) return;

    try {
      const player = new window.Spotify.Player({
        name: 'Spotify Web Clone',
        getOAuthToken: (cb) => {
          cb(session.accessToken ?? '');
        },
        volume: playerStore.volumePercent / 100,
      });

      player.addListener('ready', async (data: unknown) => {
        const { device_id } = data as { device_id: string };
        console.log('Spotify player ready with device ID:', device_id);
        playerStore.setDeviceId(device_id);
        playerStore.setPlayerReady(true);

        // Transfer playback to this device (don't force play)
        try {
          await transferPlayback(device_id, false);
        } catch (error) {
          console.error('Failed to transfer playback:', error);
        }
      });

      player.addListener('not_ready', (data: unknown) => {
        const { device_id } = data as { device_id: string };
        console.log('Device went offline:', device_id);
        playerStore.setPlayerReady(false);
      });

      player.addListener('player_state_changed', (state: unknown) => {
        const sdkState = state as SpotifyPlaybackState | null;
        if (!sdkState) return;

        // Update player store from SDK state
        // Convert SDK track to our SpotifyTrack type
        const sdkTrack = sdkState.track_window.current_track;
        if (sdkTrack) {
          playerStore.setCurrentTrack({
            ...sdkTrack,
            explicit: sdkTrack.explicit ?? false,
            popularity: sdkTrack.popularity ?? 0,
            disc_number: sdkTrack.disc_number ?? 1,
            external_ids: sdkTrack.external_ids ?? {},
            is_local: sdkTrack.is_local ?? false,
            is_playable: sdkTrack.is_playable ?? true,
            preview_url: sdkTrack.preview_url ?? null,
            linked_from: sdkTrack.linked_from,
          } as SpotifyTrackType);
        }
        playerStore.setIsPlaying(!sdkState.paused);
        playerStore.setProgress(sdkState.position);
        playerStore.setDuration(sdkState.duration);
        playerStore.setShuffle(sdkState.shuffle);

        // Map repeat mode: 0=off, 1=context, 2=track
        const repeatState =
          sdkState.repeat_mode === 0
            ? 'off'
            : sdkState.repeat_mode === 1
              ? 'context'
              : 'track';
        playerStore.setRepeat(repeatState);

        // Update queue
        queueStore.setAutoQueue(
          sdkState.track_window.next_tracks.map((track) => ({
            ...track,
            explicit: track.explicit ?? false,
            popularity: track.popularity ?? 0,
            disc_number: track.disc_number ?? 1,
            external_ids: track.external_ids ?? {},
            is_local: track.is_local ?? false,
            is_playable: track.is_playable ?? true,
            preview_url: track.preview_url ?? null,
            linked_from: track.linked_from,
            track_number: track.track_number ?? 1,
            uri: track.uri ?? `spotify:track:${track.id}`,
            type: 'track' as const,
            external_urls: track.external_urls ?? { spotify: '' },
          } as SpotifyTrackType)),
          sdkState.context?.uri ?? ''
        );
      });

      player.addListener('initialization_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Initialization error:', message);
      });

      player.addListener('authentication_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Authentication error:', message);
        toast.error('Authentication failed. Please log in again.');
      });

      player.addListener('account_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Account error:', message);
        isPremiumRequired.current = true;
        toast.error('Spotify Premium required for playback');
        playerStore.setPlayerReady(false);
      });

      // Connect to Spotify
      const connected = await player.connect();
      if (connected) {
        console.log('Successfully connected to Spotify');
        playerRef.current = player;
      } else {
        console.error('Failed to connect to Spotify');
      }
    } catch (error) {
      console.error('Failed to initialize player:', error);
    }
  }, [session?.accessToken, playerStore, queueStore]);

  // Load SDK script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already loaded
    if (window.Spotify) {
      initializePlayer();
      return;
    }

    // Set up ready callback
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK ready');
      initializePlayer();
    };

    // Load script dynamically
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [initializePlayer]);

  // Progress interval - updates progress every 500ms when playing
  useEffect(() => {
    if (playerStore.isPlaying && playerStore.isPlayerReady) {
      progressIntervalRef.current = setInterval(() => {
        playerStore.setProgress(playerStore.progressMs + 500);
      }, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playerStore.isPlaying, playerStore.isPlayerReady, playerStore.progressMs, playerStore]);

  // Sync with actual position every 5 seconds
  useEffect(() => {
    if (!playerStore.isPlaying || !playerStore.isPlayerReady || !playerRef.current) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      return;
    }

    syncIntervalRef.current = setInterval(async () => {
      try {
        const state = await playerRef.current?.getCurrentState();
        if (state) {
          playerStore.setProgress(state.position);
        }
      } catch (error) {
        console.error('Failed to sync position:', error);
      }
    }, 5000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [playerStore.isPlaying, playerStore.isPlayerReady, playerStore]);

  // Player control functions
  const togglePlay = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      await playerRef.current.togglePlay();
    } catch (error) {
      console.error('Failed to toggle play:', error);
    }
  }, []);

  const skipNext = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      // Add current track to history before skipping
      if (playerStore.currentTrack) {
        queueStore.addToHistory(playerStore.currentTrack);
      }
      await playerRef.current.nextTrack();
    } catch (error) {
      console.error('Failed to skip next:', error);
    }
  }, [playerStore.currentTrack, queueStore]);

  const skipPrevious = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      // If more than 3 seconds in, restart current track
      if (playerStore.progressMs > 3000) {
        await playerRef.current.seek(0);
      } else {
        await playerRef.current.previousTrack();
      }
    } catch (error) {
      console.error('Failed to skip previous:', error);
    }
  }, [playerStore.progressMs]);

  const seek = useCallback(async (positionMs: number) => {
    if (!playerRef.current) return;

    try {
      await playerRef.current.seek(positionMs);
      playerStore.setProgress(positionMs);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }, [playerStore]);

  const setVolume = useCallback(async (fraction: number) => {
    if (!playerRef.current) return;

    try {
      await playerRef.current.setVolume(fraction);
      playerStore.setVolume(Math.round(fraction * 100));
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }, [playerStore]);

  const setShuffle = useCallback(async (state: boolean) => {
    const deviceId = playerStore.deviceId;
    try {
      await setShuffleModeApi(state, deviceId ?? undefined);
      playerStore.setShuffle(state);
    } catch (error) {
      console.error('Failed to set shuffle:', error);
    }
  }, [playerStore.deviceId, playerStore]);

  const setRepeat = useCallback(async (state: 'off' | 'context' | 'track') => {
    const deviceId = playerStore.deviceId;
    const modeMap = { off: 0, context: 1, track: 2 };
    try {
      if (playerRef.current) {
        await playerRef.current.setRepeatMode(modeMap[state]);
      }
      playerStore.setRepeat(state);
    } catch (error) {
      console.error('Failed to set repeat:', error);
    }
  }, [playerStore.deviceId, playerStore]);

  const addToQueue = useCallback(async (uri: string) => {
    const deviceId = playerStore.deviceId;
    try {
      await addToQueueApi(uri, deviceId ?? undefined);
      toast.success('Added to queue');
    } catch (error) {
      console.error('Failed to add to queue:', error);
      toast.error('Failed to add to queue');
    }
  }, [playerStore.deviceId]);

  return {
    isReady: playerStore.isPlayerReady,
    isPlaying: playerStore.isPlaying,
    currentTrack: playerStore.currentTrack,
    progressMs: playerStore.progressMs,
    durationMs: playerStore.durationMs,
    volumePercent: playerStore.volumePercent,
    isMuted: playerStore.isMuted,
    shuffleState: playerStore.shuffleState,
    repeatState: playerStore.repeatState,
    deviceId: playerStore.deviceId,
    isPremiumRequired: isPremiumRequired.current,
    togglePlay,
    skipNext,
    skipPrevious,
    seek,
    setVolume,
    setShuffle,
    setRepeat,
    addToQueue,
  };
}
