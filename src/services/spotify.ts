import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyPagingObject,
  SpotifyArtist,
  SpotifyRecentlyPlayed,
  SpotifyPlaylistTrack,
  SpotifyPlaylist,
  SpotifyAlbum,
  SpotifySimplifiedAlbum,
  SpotifyCategory,
  SpotifySearchResults,
  SpotifyRecommendations,
  SpotifyPlaybackState,
  SpotifyDevice,
  SpotifyQueue,
  SpotifyShow,
  SpotifyEpisode,
} from '@/types/spotify';
import { get, post, put, del } from '@/lib/axios';

// ─── USER ───

export async function getCurrentUser(): Promise<SpotifyUser> {
  return get<SpotifyUser>('/me');
}

export async function getUserTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 20
): Promise<SpotifyPagingObject<SpotifyTrack>> {
  return get<SpotifyPagingObject<SpotifyTrack>>('/me/top/tracks', {
    params: { time_range: timeRange, limit },
  });
}

export async function getUserTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 20
): Promise<SpotifyPagingObject<SpotifyArtist>> {
  return get<SpotifyPagingObject<SpotifyArtist>>('/me/top/artists', {
    params: { time_range: timeRange, limit },
  });
}

export async function getRecentlyPlayed(limit = 20): Promise<SpotifyRecentlyPlayed> {
  return get<SpotifyRecentlyPlayed>('/me/player/recently-played', {
    params: { limit },
  });
}

// ─── LIBRARY ───

export async function getSavedTracks(
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyPlaylistTrack>> {
  return get<SpotifyPagingObject<SpotifyPlaylistTrack>>('/me/tracks', {
    params: { limit, offset },
  });
}

export async function checkSavedTracks(ids: string[]): Promise<boolean[]> {
  return get<boolean[]>('/me/tracks/contains', {
    params: { ids: ids.join(',') },
  });
}

export async function saveTracks(ids: string[]): Promise<void> {
  await put('/me/tracks', null, {
    params: { ids: ids.join(',') },
  });
}

export async function removeSavedTracks(ids: string[]): Promise<void> {
  await del('/me/tracks', {
    params: { ids: ids.join(',') },
  });
}

export async function getSavedAlbums(
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<{ album: SpotifyAlbum }>> {
  return get<SpotifyPagingObject<{ album: SpotifyAlbum }>>('/me/albums', {
    params: { limit, offset },
  });
}

export async function checkSavedAlbums(ids: string[]): Promise<boolean[]> {
  return get<boolean[]>('/me/albums/contains', {
    params: { ids: ids.join(',') },
  });
}

export async function saveAlbum(id: string): Promise<void> {
  await put('/me/albums', null, { params: { ids: id } });
}

export async function removeAlbum(id: string): Promise<void> {
  await del('/me/albums', { params: { ids: id } });
}

export async function getFollowedArtists(
  limit = 50,
  after?: string
): Promise<SpotifyPagingObject<SpotifyArtist>> {
  const params: Record<string, string | number> = { type: 'artist', limit };
  if (after) params.after = after;

  const response = await get<{ artists: SpotifyPagingObject<SpotifyArtist> }>('/me/following', {
    params,
  });
  return response.artists;
}

export async function checkFollowingArtists(ids: string[]): Promise<boolean[]> {
  return get<boolean[]>('/me/following/contains', {
    params: { type: 'artist', ids: ids.join(',') },
  });
}

export async function followArtist(id: string): Promise<void> {
  await put('/me/following', null, {
    params: { type: 'artist', ids: id },
  });
}

export async function unfollowArtist(id: string): Promise<void> {
  await del('/me/following', {
    params: { type: 'artist', ids: id },
  });
}

export async function checkFollowingPlaylist(playlistId: string): Promise<boolean> {
  const userId = 'me'; // Current user
  const result = await get<boolean[]>(`/users/${userId}/playlists/${playlistId}/followers/contains`);
  return result[0];
}

export async function followPlaylist(playlistId: string): Promise<void> {
  await put(`/playlists/${playlistId}/followers`, { public: true });
}

export async function unfollowPlaylist(playlistId: string): Promise<void> {
  await del(`/playlists/${playlistId}/followers`);
}

// ─── PLAYLISTS ───

export async function getCurrentUserPlaylists(
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyPlaylist>> {
  return get<SpotifyPagingObject<SpotifyPlaylist>>('/me/playlists', {
    params: { limit, offset },
  });
}

export async function getPlaylist(id: string): Promise<SpotifyPlaylist> {
  return get<SpotifyPlaylist>(`/playlists/${id}`);
}

export async function getPlaylistTracks(
  id: string,
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyPlaylistTrack>> {
  return get<SpotifyPagingObject<SpotifyPlaylistTrack>>(`/playlists/${id}/tracks`, {
    params: { limit, offset },
  });
}

export async function createPlaylist(
  userId: string,
  name: string,
  description = '',
  isPublic = false
): Promise<SpotifyPlaylist> {
  return post<SpotifyPlaylist>(`/users/${userId}/playlists`, {
    name,
    description,
    public: isPublic,
  });
}

export async function updatePlaylist(
  id: string,
  data: { name?: string; description?: string; public?: boolean }
): Promise<void> {
  await put(`/playlists/${id}`, data);
}

export async function addTracksToPlaylist(
  id: string,
  uris: string[],
  position?: number
): Promise<void> {
  await post(`/playlists/${id}/tracks`, { uris, position });
}

export async function removeTracksFromPlaylist(
  id: string,
  tracks: Array<{ uri: string }>
): Promise<void> {
  await del(`/playlists/${id}/tracks`, {
    data: { tracks },
  });
}

export async function uploadPlaylistCover(id: string, base64Image: string): Promise<void> {
  await put(`/playlists/${id}/images`, base64Image, {
    headers: { 'Content-Type': 'image/jpeg' },
  });
}

// ─── ALBUMS ───

export async function getAlbum(id: string): Promise<SpotifyAlbum> {
  return get<SpotifyAlbum>(`/albums/${id}`);
}

export async function getAlbumTracks(
  id: string,
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyTrack>> {
  return get<SpotifyPagingObject<SpotifyTrack>>(`/albums/${id}/tracks`, {
    params: { limit, offset },
  });
}

export async function getNewReleases(
  limit = 20,
  offset = 0
): Promise<SpotifyPagingObject<SpotifySimplifiedAlbum>> {
  return get<SpotifyPagingObject<SpotifySimplifiedAlbum>>('/browse/new-releases', {
    params: { limit, offset },
  });
}

export async function getSeveralAlbums(ids: string[]): Promise<SpotifyAlbum[]> {
  const response = await get<{ albums: SpotifyAlbum[] }>('/albums', {
    params: { ids: ids.join(',') },
  });
  return response.albums;
}

// ─── ARTISTS ───

export async function getArtist(id: string): Promise<SpotifyArtist> {
  return get<SpotifyArtist>(`/artists/${id}`);
}

export async function getArtistTopTracks(
  id: string,
  market = 'US'
): Promise<{ tracks: SpotifyTrack[] }> {
  return get<{ tracks: SpotifyTrack[] }>(`/artists/${id}/top-tracks`, {
    params: { market },
  });
}

export async function getArtistAlbums(
  id: string,
  includeGroups = 'album,single',
  limit = 20,
  offset = 0
): Promise<SpotifyPagingObject<SpotifySimplifiedAlbum>> {
  return get<SpotifyPagingObject<SpotifySimplifiedAlbum>>(`/artists/${id}/albums`, {
    params: { include_groups: includeGroups, limit, offset },
  });
}

export async function getRelatedArtists(id: string): Promise<{ artists: SpotifyArtist[] }> {
  return get<{ artists: SpotifyArtist[] }>(`/artists/${id}/related-artists`);
}

export async function getSeveralArtists(ids: string[]): Promise<SpotifyArtist[]> {
  const response = await get<{ artists: SpotifyArtist[] }>('/artists', {
    params: { ids: ids.join(',') },
  });
  return response.artists;
}

// ─── SEARCH ───

export async function search(
  query: string,
  types: string[] = ['track', 'album', 'artist', 'playlist', 'show', 'episode'],
  limit = 20,
  offset = 0
): Promise<SpotifySearchResults> {
  return get<SpotifySearchResults>('/search', {
    params: { q: query, type: types.join(','), limit, offset },
  });
}

// ─── BROWSE ───

export async function getFeaturedPlaylists(
  limit = 20
): Promise<{ message: string; playlists: SpotifyPagingObject<SpotifyPlaylist> }> {
  return get<{ message: string; playlists: SpotifyPagingObject<SpotifyPlaylist> }>(
    '/browse/featured-playlists',
    { params: { limit } }
  );
}

export async function getCategories(
  limit = 50
): Promise<SpotifyPagingObject<SpotifyCategory>> {
  return get<SpotifyPagingObject<SpotifyCategory>>('/browse/categories', {
    params: { limit },
  });
}

export async function getCategoryPlaylists(
  categoryId: string,
  limit = 20
): Promise<SpotifyPagingObject<SpotifyPlaylist>> {
  return get<SpotifyPagingObject<SpotifyPlaylist>>(
    `/browse/categories/${categoryId}/playlists`,
    { params: { limit } }
  );
}

export async function getNewReleasesFeatured(
  limit = 20
): Promise<SpotifyPagingObject<SpotifySimplifiedAlbum>> {
  return get<SpotifyPagingObject<SpotifySimplifiedAlbum>>('/browse/new-releases', {
    params: { limit },
  });
}

export async function getRecommendations(
  seedArtists: string[],
  seedTracks: string[],
  seedGenres: string[],
  limit = 20
): Promise<SpotifyRecommendations> {
  return get<SpotifyRecommendations>('/recommendations', {
    params: {
      seed_artists: seedArtists.join(','),
      seed_tracks: seedTracks.join(','),
      seed_genres: seedGenres.join(','),
      limit,
    },
  });
}

// ─── PLAYBACK ───

export async function getPlaybackState(): Promise<SpotifyPlaybackState | null> {
  try {
    return get<SpotifyPlaybackState>('/me/player');
  } catch {
    return null;
  }
}

export async function getAvailableDevices(): Promise<{ devices: SpotifyDevice[] }> {
  return get<{ devices: SpotifyDevice[] }>('/me/player/devices');
}

export async function transferPlayback(deviceId: string, play = true): Promise<void> {
  await put('/me/player', { device_ids: [deviceId], play });
}

export async function startPlayback(
  deviceId?: string,
  contextUri?: string,
  uris?: string[],
  offset?: { position?: number; uri?: string },
  positionMs = 0
): Promise<void> {
  const params: Record<string, string | number> = {};
  if (deviceId) params.device_id = deviceId;

  await put('/me/player/play', null, {
    params,
    data: {
      context_uri: contextUri,
      uris,
      offset,
      position_ms: positionMs,
    },
  });
}

export async function pausePlayback(deviceId?: string): Promise<void> {
  const params: Record<string, string> = {};
  if (deviceId) params.device_id = deviceId;
  await put('/me/player/pause', null, { params });
}

export async function skipToNext(deviceId?: string): Promise<void> {
  const params: Record<string, string> = {};
  if (deviceId) params.device_id = deviceId;
  await post('/me/player/next', null, { params });
}

export async function skipToPrevious(deviceId?: string): Promise<void> {
  const params: Record<string, string> = {};
  if (deviceId) params.device_id = deviceId;
  await post('/me/player/previous', null, { params });
}

export async function seekToPosition(positionMs: number, deviceId?: string): Promise<void> {
  const params: Record<string, string | number> = { position_ms: positionMs };
  if (deviceId) params.device_id = deviceId;
  await put('/me/player/seek', null, { params });
}

export async function setRepeatMode(
  state: 'track' | 'context' | 'off',
  deviceId?: string
): Promise<void> {
  const params: Record<string, string> = { state };
  if (deviceId) params.device_id = deviceId;
  await put('/me/player/repeat', null, { params });
}

export async function setShuffleMode(state: boolean, deviceId?: string): Promise<void> {
  const params: Record<string, string | boolean> = { state };
  if (deviceId) params.device_id = deviceId;
  await put('/me/player/shuffle', null, { params });
}

export async function setVolume(volumePercent: number, deviceId?: string): Promise<void> {
  const params: Record<string, string | number> = { volume_percent: volumePercent };
  if (deviceId) params.device_id = deviceId;
  await put('/me/player/volume', null, { params });
}

export async function addToQueue(uri: string, deviceId?: string): Promise<void> {
  const params: Record<string, string> = { uri };
  if (deviceId) params.device_id = deviceId;
  await post('/me/player/queue', null, { params });
}

export async function getQueue(): Promise<SpotifyQueue> {
  return get<SpotifyQueue>('/me/player/queue');
}

// ─── SHOWS / PODCASTS ───

export async function getShow(id: string): Promise<SpotifyShow> {
  return get<SpotifyShow>(`/shows/${id}`);
}

export async function getShowEpisodes(
  id: string,
  limit = 50,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyEpisode>> {
  return get<SpotifyPagingObject<SpotifyEpisode>>(`/shows/${id}/episodes`, {
    params: { limit, offset },
  });
}

export async function getEpisode(id: string): Promise<SpotifyEpisode> {
  return get<SpotifyEpisode>(`/episodes/${id}`);
}

export async function getSavedShows(): Promise<SpotifyPagingObject<{ show: SpotifyShow }>> {
  return get<SpotifyPagingObject<{ show: SpotifyShow }>>('/me/shows');
}

// ─── USER PROFILE ───

export async function getUserProfile(userId: string): Promise<SpotifyUser> {
  return get<SpotifyUser>(`/users/${userId}`);
}

export async function getUserPlaylists(
  userId: string,
  limit = 20,
  offset = 0
): Promise<SpotifyPagingObject<SpotifyPlaylist>> {
  return get<SpotifyPagingObject<SpotifyPlaylist>>(`/users/${userId}/playlists`, {
    params: { limit, offset },
  });
}
