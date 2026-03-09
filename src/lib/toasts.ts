import toast, { ToastOptions } from 'react-hot-toast';

const toastStyle: ToastOptions = {
  style: {
    background: '#333',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  duration: 3000,
};

const errorToastStyle: ToastOptions = {
  ...toastStyle,
  style: {
    ...toastStyle.style,
    background: '#E91429',
  },
  duration: 4000,
};

export const showToast = {
  saved: (name?: string) =>
    toast('Saved to Your Liked Songs', {
      ...toastStyle,
      icon: '💚',
      duration: 2500,
    }),

  removed: () =>
    toast('Removed from Your Liked Songs', {
      ...toastStyle,
      duration: 2500,
    }),

  addedToPlaylist: (playlistName: string) =>
    toast(`Added to ${playlistName}`, {
      ...toastStyle,
      icon: '💚',
      duration: 2500,
    }),

  addedToQueue: () =>
    toast('Added to queue', {
      ...toastStyle,
      icon: '📋',
      duration: 2000,
    }),

  removedFromQueue: () =>
    toast('Removed from queue', {
      ...toastStyle,
      duration: 2000,
    }),

  followedArtist: (name: string) =>
    toast(`Following ${name}`, {
      ...toastStyle,
      icon: '💚',
      duration: 2500,
    }),

  unfollowedArtist: (name: string) =>
    toast(`Unfollowed ${name}`, {
      ...toastStyle,
      duration: 2500,
    }),

  copiedLink: () =>
    toast('Link copied to clipboard', {
      ...toastStyle,
      duration: 2000,
    }),

  playbackError: () =>
    toast.error('Spotify Premium required for playback', {
      ...errorToastStyle,
      duration: 5000,
    }),

  tokenExpired: () =>
    toast.error('Session expired, please log in again', {
      ...errorToastStyle,
      duration: 4000,
    }),

  networkError: () =>
    toast.error('Connection lost. Retrying...', {
      ...errorToastStyle,
      duration: 3000,
    }),

  playlistCreated: (name: string) =>
    toast(`Created playlist "${name}"`, {
      ...toastStyle,
      icon: '🎵',
      duration: 3000,
    }),

  deviceConnected: (name: string) =>
    toast(`Listening on ${name}`, {
      ...toastStyle,
      icon: '🔊',
      duration: 2500,
    }),

  premiumRequired: () =>
    toast('Premium required for this feature', {
      ...toastStyle,
      icon: '⚠️',
      duration: 4000,
    }),

  shuffleEnabled: () =>
    toast('Shuffle enabled', {
      ...toastStyle,
      duration: 1500,
    }),

  shuffleDisabled: () =>
    toast('Shuffle disabled', {
      ...toastStyle,
      duration: 1500,
    }),

  repeatEnabled: (mode: string) =>
    toast(`Repeat ${mode}`, {
      ...toastStyle,
      duration: 1500,
    }),

  success: (message: string) =>
    toast.success(message, {
      ...toastStyle,
    }),

  error: (message: string) =>
    toast.error(message, {
      ...errorToastStyle,
    }),

  info: (message: string) =>
    toast(message, {
      ...toastStyle,
    }),
};
