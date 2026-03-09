// ─── LAYOUT CONSTANTS ───

export const SIDEBAR_MIN = 72;
export const SIDEBAR_DEFAULT = 280;
export const SIDEBAR_MAX = 420;
export const SIDEBAR_COLLAPSED_THRESHOLD = 150;

export const TOPBAR_HEIGHT = 64;
export const NOWPLAYING_HEIGHT = 72;

export const CARD_MIN_WIDTH = 150;
export const CARD_ASPECT_RATIO = 1;

// ─── PLAYER CONSTANTS ───

export const DEFAULT_VOLUME = 50;
export const VOLUME_STEP = 5;
export const SEEK_STEP_MS = 15000; // 15 seconds

// ─── GENRE COLORS ───
// Spotify's official genre colors for browse categories

export const GENRE_COLORS = {
  pop: '#C10B5B',
  'hip-hop': '#BA5D07',
  'dance-electronic': '#537AA1',
  rnb: '#006450',
  indie: '#0D73EC',
  rock: '#E61E32',
  latin: '#E8115B',
  podcasts: '#2D46B9',
  mood: '#4B917D',
  country: '#1E3264',
  jazz: '#503750',
  classical: '#3D4B8E',
  'k-pop': '#8400E7',
  chill: '#1E3264',
  gaming: '#148A08',
  soul: '#C39B77',
  metal: '#666666',
  alternative: '#8D67AB',
  focus: '#0D73EC',
  wellness: '#566575',
  workout: '#E73C6E',
} as const;

// ─── BRAND COLORS ───

export const SPOTIFY_GREEN = '#1DB954';
export const SPOTIFY_BLACK = '#000000';
export const SPOTIFY_DARK_GRAY = '#121212';
export const SPOTIFY_LIGHT_GRAY = '#282828';
export const SPOTIFY_WHITE = '#FFFFFF';

// ─── API CONSTANTS ───

export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';

// ─── PAGINATION ───

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

// ─── LOCAL STORAGE KEYS ───

export const STORAGE_KEYS = {
  UI_STORE: 'spotify-clone-ui',
  PLAYER_STORE: 'spotify-clone-player',
  LIBRARY_STORE: 'spotify-clone-library',
  QUEUE_STORE: 'spotify-clone-queue',
} as const;
