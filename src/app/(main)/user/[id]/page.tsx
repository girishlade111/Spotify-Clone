'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserProfile, getUserPlaylists, getFollowedArtists } from '@/services/spotify';
import { ArtistAvatar } from '@/components/ui/SpotifyImage';
import { EmptyStates, EmptyLibrary } from '@/components/ui/EmptyState';
import { formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export default function UserProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const userId = params.id as string;
  const isOwnProfile = userId === 'me' || userId === session?.userId;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!session?.accessToken,
  });

  const { data: playlists } = useQuery({
    queryKey: ['user-playlists', userId],
    queryFn: () => getUserPlaylists(userId, 20),
    enabled: !!session?.accessToken && !!userId,
  });

  const { data: followedArtists } = useQuery({
    queryKey: ['followed-artists', userId],
    queryFn: () => getFollowedArtists(20),
    enabled: !!session?.accessToken && isOwnProfile,
  });

  const displayName = user?.display_name || user?.id || 'User';
  const followerCount = user?.followers?.total || 0;
  const playlistCount = playlists?.total || 0;
  const followingCount = followedArtists?.total || 0;

  if (userLoading) {
    return (
      <div className="p-6">
        {EmptyStates.loading()}
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-[#121212] p-6">
        <div className="flex items-end gap-6">
          {/* Avatar */}
          <div className="w-48 h-48 flex-shrink-0">
            {user?.images?.[0]?.url ? (
              <ArtistAvatar
                src={user.images[0].url}
                alt={displayName}
                size="xl"
              />
            ) : (
              <ArtistAvatar
                name={displayName}
                size="xl"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col pb-2">
            <span className="text-sm font-medium text-white uppercase">
              {isOwnProfile ? 'Profile' : 'Profile'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[96px] font-black text-white mt-2 truncate">
              {displayName}
            </h1>
            <div className="flex items-center gap-2 mt-4 text-sm text-[#A7A7A7]">
              <span>{formatNumber(followerCount)} followers</span>
              {isOwnProfile && (
                <>
                  <span>•</span>
                  <span>{formatNumber(followingCount)} following</span>
                </>
              )}
              <span>•</span>
              <span>{playlistCount} public playlists</span>
            </div>
          </div>
        </div>
      </div>

      {/* Public Playlists Section */}
      {playlists && playlists.items.length > 0 && (
        <section className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Public playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlists.items.map((playlist) => (
              <div
                key={playlist.id}
                className="group bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
              >
                <div className="relative aspect-square mb-4 rounded overflow-hidden shadow-lg">
                  {playlist.images?.[0]?.url ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#A7A7A7]">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-white truncate">{playlist.name}</h3>
                <p className="text-sm text-[#A7A7A7] mt-1 line-clamp-2">
                  {playlist.description || 'Playlist'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Following Section (only for own profile) */}
      {isOwnProfile && followedArtists && followedArtists.items.length > 0 && (
        <section className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Following</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {followedArtists.items.map((artist) => (
              <div
                key={artist.id}
                className="group bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  {artist.images?.[0]?.url ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#535353] flex items-center justify-center text-white text-2xl font-bold">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-white truncate">{artist.name}</h3>
                <p className="text-sm text-[#A7A7A7] mt-1">Artist</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty States */}
      {playlists?.items.length === 0 && (
        <section className="p-6">
          {EmptyStates.emptyPlaylist()}
        </section>
      )}
    </div>
  );
}
