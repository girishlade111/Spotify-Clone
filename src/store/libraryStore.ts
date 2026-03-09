import { create } from 'zustand';
import type { SpotifyPlaylist, SpotifyAlbum, SpotifyArtist } from '@/types/spotify';

interface LibraryStore {
  playlists: SpotifyPlaylist[];
  savedAlbums: SpotifyAlbum[];
  followedArtists: SpotifyArtist[];
  likedTrackIds: Set<string>;
  savedAlbumIds: Set<string>;
  followedArtistIds: Set<string>;
  followedPlaylistIds: Set<string>;
  isLoading: boolean;

  // Actions
  setPlaylists: (playlists: SpotifyPlaylist[]) => void;
  setSavedAlbums: (albums: SpotifyAlbum[]) => void;
  setFollowedArtists: (artists: SpotifyArtist[]) => void;
  setLikedTrackIds: (ids: string[]) => void;
  toggleLikedTrack: (id: string) => void;
  toggleSavedAlbum: (id: string) => void;
  toggleFollowedArtist: (id: string) => void;
  toggleFollowedPlaylist: (id: string) => void;
  isTrackLiked: (id: string) => boolean;
  isAlbumSaved: (id: string) => boolean;
  isArtistFollowed: (id: string) => boolean;
  isPlaylistFollowed: (id: string) => boolean;
}

const initialState = {
  playlists: [] as SpotifyPlaylist[],
  savedAlbums: [] as SpotifyAlbum[],
  followedArtists: [] as SpotifyArtist[],
  likedTrackIds: new Set<string>(),
  savedAlbumIds: new Set<string>(),
  followedArtistIds: new Set<string>(),
  followedPlaylistIds: new Set<string>(),
  isLoading: false,
};

export const useLibraryStore = create<LibraryStore>()((set, get) => ({
  ...initialState,

  setPlaylists: (playlists) => set({ playlists }),

  setSavedAlbums: (albums) => {
    set({
      savedAlbums: albums,
      savedAlbumIds: new Set(albums.map((a) => a.id)),
    });
  },

  setFollowedArtists: (artists) => {
    set({
      followedArtists: artists,
      followedArtistIds: new Set(artists.map((a) => a.id)),
    });
  },

  setLikedTrackIds: (ids) => set({ likedTrackIds: new Set(ids) }),

  toggleLikedTrack: (id) => {
    const { likedTrackIds } = get();
    const newSet = new Set(likedTrackIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    set({ likedTrackIds: newSet });
  },

  toggleSavedAlbum: (id) => {
    const { savedAlbumIds, savedAlbums } = get();
    const newSet = new Set(savedAlbumIds);
    if (newSet.has(id)) {
      newSet.delete(id);
      set({
        savedAlbumIds: newSet,
        savedAlbums: savedAlbums.filter((a) => a.id !== id),
      });
    } else {
      newSet.add(id);
      set({ savedAlbumIds: newSet });
      // Note: Full album object would need to be fetched separately
    }
  },

  toggleFollowedArtist: (id) => {
    const { followedArtistIds, followedArtists } = get();
    const newSet = new Set(followedArtistIds);
    if (newSet.has(id)) {
      newSet.delete(id);
      set({
        followedArtistIds: newSet,
        followedArtists: followedArtists.filter((a) => a.id !== id),
      });
    } else {
      newSet.add(id);
      set({ followedArtistIds: newSet });
    }
  },

  toggleFollowedPlaylist: (id) => {
    const { followedPlaylistIds } = get();
    const newSet = new Set(followedPlaylistIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    set({ followedPlaylistIds: newSet });
  },

  isTrackLiked: (id) => get().likedTrackIds.has(id),

  isAlbumSaved: (id) => get().savedAlbumIds.has(id),

  isArtistFollowed: (id) => get().followedArtistIds.has(id),

  isPlaylistFollowed: (id) => get().followedPlaylistIds.has(id),
}));
