/**
 * Spotify API TypeScript Types
 */

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifyCopyright {
  text: string;
  type: "C" | "P";
}

export interface SpotifyLinkedTrack {
  id: string;
  uri: string;
  type: "track";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifySimplifiedArtist {
  id: string;
  name: string;
  uri: string;
  type: "artist";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  followers: SpotifyFollowers;
  popularity: number;
  uri: string;
  type: "artist";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifySimplifiedAlbum {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation" | "appears_on";
  artists: SpotifySimplifiedArtist[];
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  uri: string;
  type: "album";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyAlbum extends SpotifySimplifiedAlbum {
  tracks: SpotifyPagingObject<SpotifySimplifiedTrack>;
  label: string;
  copyrights: SpotifyCopyright[];
  genres: string[];
  popularity: number;
}

export interface SpotifySimplifiedTrack {
  id: string;
  name: string;
  artists: SpotifySimplifiedArtist[];
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  uri: string;
  type: "track";
  is_playable: boolean;
  is_local: boolean;
  external_urls: SpotifyExternalUrls;
  linked_from?: SpotifyLinkedTrack;
}

export interface SpotifyTrack extends SpotifySimplifiedTrack {
  album: SpotifyAlbum;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  disc_number: number;
}

export interface SpotifyPlaylistOwner {
  id: string;
  display_name: string | null;
  uri: string;
  type: "user";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyPlaylistTrackItem {
  added_at: string;
  added_by: SpotifyPlaylistOwner;
  is_local: boolean;
  track: SpotifyTrack | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: SpotifyPlaylistOwner;
  tracks: SpotifyPagingObject<SpotifyPlaylistTrackItem>;
  public: boolean | null;
  collaborative: boolean;
  followers: SpotifyFollowers;
  uri: string;
  type: "playlist";
  external_urls: SpotifyExternalUrls;
  snapshot_id: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email?: string;
  images: SpotifyImage[];
  followers: SpotifyFollowers;
  product: "free" | "open" | "premium";
  country: string;
  uri: string;
  type: "user";
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
}

export interface SpotifyPlaybackContext {
  type: "artist" | "playlist" | "album" | "show" | "episode" | "collection" | null;
  uri: string | null;
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
  context: SpotifyPlaybackContext | null;
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: "off" | "context" | "track";
  timestamp: number;
}

export interface SpotifyPagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  href: string;
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  added_by: SpotifyPlaylistOwner;
  track: SpotifyTrack | null;
  is_local: boolean;
}

export interface SpotifySearchResults {
  tracks: SpotifyPagingObject<SpotifyTrack>;
  albums: SpotifyPagingObject<SpotifySimplifiedAlbum>;
  artists: SpotifyPagingObject<SpotifyArtist>;
  playlists: SpotifyPagingObject<SpotifyPlaylist>;
  shows: SpotifyPagingObject<SpotifyShow>;
  episodes: SpotifyPagingObject<SpotifyEpisode>;
}

export interface SpotifyRecentlyPlayedContext {
  type: string;
  href: string;
  external_urls: SpotifyExternalUrls;
  uri: string;
}

export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context: SpotifyRecentlyPlayedContext | null;
}

export interface SpotifyRecentlyPlayed {
  items: SpotifyRecentlyPlayedItem[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export interface SpotifyRecommendationSeed {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string | null;
  id: string;
  initialPoolSize: number;
  type: "artist" | "track" | "genre";
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
  seeds: SpotifyRecommendationSeed[];
}

export interface SpotifyShow {
  id: string;
  name: string;
  description: string | null;
  publisher: string;
  images: SpotifyImage[];
  total_episodes: number;
  uri: string;
  type: "show";
  external_urls: SpotifyExternalUrls;
  available_markets: string[];
  copyrights: SpotifyCopyright[];
  explicit: boolean;
  episodes?: SpotifyPagingObject<SpotifyEpisode>;
  html_description: string;
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string | null;
  duration_ms: number;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  uri: string;
  type: "episode";
  show: SpotifyShow;
  audio_preview_url: string | null;
  external_urls: SpotifyExternalUrls;
  html_description: string;
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  resume_point?: {
    fully_played: boolean;
    resume_position_ms: number;
  };
  explicit: boolean;
}

export interface SpotifyCategory {
  id: string;
  name: string;
  icons: SpotifyImage[];
  href: string;
}

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
}

export type SimplifiedTrack = SpotifySimplifiedTrack;
export type SimplifiedAlbum = SpotifySimplifiedAlbum;
export type SimplifiedArtist = SpotifySimplifiedArtist;
