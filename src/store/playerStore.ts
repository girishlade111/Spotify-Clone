import { create } from 'zustand';
import type { SpotifyTrack, SpotifyPlaybackState } from '@/types/spotify';
import type { RepeatState } from '@/types/player';

interface PlayerStore {
  // Track state
  currentTrack: SpotifyTrack | null;
  contextUri: string | null;
  contextType: 'playlist' | 'album' | 'artist' | 'collection' | null;

  // Playback
  isPlaying: boolean;
  shuffleState: boolean;
  repeatState: RepeatState;
  progressMs: number;
  durationMs: number;

  // Volume
  volumePercent: number; // 0-100
  isMuted: boolean;
  previousVolume: number; // restored after unmute

  // Device
  deviceId: string | null;
  isPlayerReady: boolean;
  isTransferring: boolean;

  // UI state for player
  isFullscreenOpen: boolean;

  // Actions
  setCurrentTrack: (track: SpotifyTrack | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setProgress: (ms: number) => void;
  setDuration: (ms: number) => void;
  setVolume: (percent: number) => void;
  toggleMute: () => void;
  setShuffle: (state: boolean) => void;
  setRepeat: (state: RepeatState) => void;
  setDeviceId: (id: string | null) => void;
  setPlayerReady: (ready: boolean) => void;
  setTransferring: (state: boolean) => void;
  toggleFullscreen: () => void;
  updateFromSDKState: (sdkState: SpotifyPlaybackState) => void;
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  // Track state
  currentTrack: null,
  contextUri: null,
  contextType: null,

  // Playback
  isPlaying: false,
  shuffleState: false,
  repeatState: 'off',
  progressMs: 0,
  durationMs: 0,

  // Volume
  volumePercent: 50,
  isMuted: false,
  previousVolume: 50,

  // Device
  deviceId: null,
  isPlayerReady: false,
  isTransferring: false,

  // UI state for player
  isFullscreenOpen: false,

  // Actions
  setCurrentTrack: (track) => set({ currentTrack: track }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setProgress: (ms) => set({ progressMs: Math.max(0, ms) }),

  setDuration: (ms) => set({ durationMs: Math.max(0, ms) }),

  setVolume: (percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    set({ volumePercent: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const { isMuted, previousVolume, volumePercent } = get();
    if (isMuted) {
      // Restore previous volume
      set({ isMuted: false, volumePercent: previousVolume });
    } else {
      // Save current volume and mute
      set({ isMuted: true, previousVolume: volumePercent, volumePercent: 0 });
    }
  },

  setShuffle: (state) => set({ shuffleState: state }),

  setRepeat: (state) => set({ repeatState: state }),

  setDeviceId: (id) => set({ deviceId: id }),

  setPlayerReady: (ready) => set({ isPlayerReady: ready }),

  setTransferring: (state) => set({ isTransferring: state }),

  toggleFullscreen: () => set((state) => ({ isFullscreenOpen: !state.isFullscreenOpen })),

  updateFromSDKState: (sdkState) => {
    set({
      currentTrack: sdkState.item ?? null,
      isPlaying: sdkState.is_playing,
      progressMs: sdkState.progress_ms ?? 0,
      durationMs: sdkState.item?.duration_ms ?? 0,
      shuffleState: sdkState.shuffle_state,
      repeatState: sdkState.repeat_state as RepeatState,
      deviceId: sdkState.device?.id ?? null,
      volumePercent: sdkState.device?.volume_percent ?? get().volumePercent,
      contextUri: sdkState.context?.uri ?? null,
      contextType: sdkState.context?.type as PlayerStore['contextType'] ?? null,
    });
  },
}));
