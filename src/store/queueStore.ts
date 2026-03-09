import { create } from 'zustand';
import type { SpotifyTrack } from '@/types/spotify';

interface QueueStore {
  manualQueue: SpotifyTrack[];
  autoQueue: SpotifyTrack[];
  history: SpotifyTrack[];
  autoQueueSource: string | null;

  // Actions
  addToManualQueue: (track: SpotifyTrack) => void;
  removeFromManualQueue: (index: number) => void;
  reorderManualQueue: (fromIndex: number, toIndex: number) => void;
  clearManualQueue: () => void;
  setAutoQueue: (tracks: SpotifyTrack[], sourceName: string) => void;
  addToHistory: (track: SpotifyTrack) => void;
  clearHistory: () => void;
}

const initialState = {
  manualQueue: [] as SpotifyTrack[],
  autoQueue: [] as SpotifyTrack[],
  history: [] as SpotifyTrack[],
  autoQueueSource: null,
};

export const useQueueStore = create<QueueStore>()((set, get) => ({
  ...initialState,

  addToManualQueue: (track) => {
    set((state) => ({
      manualQueue: [...state.manualQueue, track],
    }));
  },

  removeFromManualQueue: (index) => {
    set((state) => ({
      manualQueue: state.manualQueue.filter((_, i) => i !== index),
    }));
  },

  reorderManualQueue: (fromIndex, toIndex) => {
    set((state) => {
      const newQueue = [...state.manualQueue];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      return { manualQueue: newQueue };
    });
  },

  clearManualQueue: () => set({ manualQueue: [] }),

  setAutoQueue: (tracks, sourceName) => {
    set({ autoQueue: tracks, autoQueueSource: sourceName });
  },

  addToHistory: (track) => {
    set((state) => ({
      history: [track, ...state.history].slice(0, 50), // Keep last 50 tracks
    }));
  },

  clearHistory: () => set({ history: [] }),
}));
