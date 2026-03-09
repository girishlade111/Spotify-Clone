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

export type SimplifiedTrack = SpotifySimplifiedTrack;
export type SimplifiedAlbum = SpotifySimplifiedAlbum;
export type SimplifiedArtist = SpotifySimplifiedArtist;
