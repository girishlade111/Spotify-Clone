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
  Pop: '#C10B5B',
  'Hip-Hop': '#BA5D07',
  Rock: '#E8115B',
  'Latin Music': '#E1118C',
  'Dance/Electronic': '#F05D22',
  Mood: '#8D67AB',
  'Indie': '#608108',
  'R&B': '#DC148C',
  'K-Pop': '#9757D7',
  Country: '#D65F2E',
  Jazz: '#477D95',
  Classical: '#516894',
  Metal: '#666666',
  'Chill': '#566575',
  'Workout': '#E73C6E',
  'Focus': '#0D73EC',
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
