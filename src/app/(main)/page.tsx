/**
 * Home Page - Complete Spotify home experience
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getRecentlyPlayed,
  getUserTopTracks,
  getUserTopArtists,
  getFeaturedPlaylists,
  getNewReleases,
  getCurrentUserPlaylists,
  getRecommendations,
} from "@/services/spotify";
import { usePlayerStore } from "@/store/playerStore";
import { ShortcutTile } from "@/components/content/ShortcutTile";
import { SectionRow } from "@/components/content/SectionRow";
import { HomeSkeleton } from "@/components/content/HomeSkeleton";
import type { SpotifyTrack, SpotifyArtist, SpotifyPlaylist, SpotifySimplifiedAlbum } from "@/types/spotify";

function getGreeting(): string {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");

  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setContextUri = usePlayerStore((state) => state.contextUri);
  const setContextType = usePlayerStore((state) => state.contextType);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Fetch recently played for shortcut tiles
  const { data: recentlyPlayed, isLoading: recentlyPlayedLoading } = useQuery({
    queryKey: ["recently-played"],
    queryFn: () => getRecentlyPlayed(6),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top artists for "Made for You"
  const { data: topArtists } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getUserTopArtists("medium_term", 6),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch featured playlists
  const { data: featuredPlaylists } = useQuery({
    queryKey: ["featured-playlists"],
    queryFn: () => getFeaturedPlaylists(6),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 15,
  });

  // Fetch new releases
  const { data: newReleases } = useQuery({
    queryKey: ["new-releases"],
    queryFn: () => getNewReleases(6),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch user playlists
  const { data: userPlaylists } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: () => getCurrentUserPlaylists(10),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top tracks for recommendations seed
  const { data: topTracks } = useQuery({
    queryKey: ["top-tracks"],
    queryFn: () => getUserTopTracks("medium_term", 5),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch recommendations based on top tracks
  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const seedTrackIds = topTracks?.items.slice(0, 5).map((t) => t.id) || [];
      if (seedTrackIds.length === 0) return { tracks: [], seeds: [] };
      return getRecommendations(seedTrackIds, [], [], 10);
    },
    enabled: !!session?.accessToken && !!topTracks?.items.length,
    staleTime: 1000 * 60 * 30,
  });

  // Build shortcut tiles from recently played
  const shortcutTiles = useMemo(() => {
    if (!recentlyPlayed?.items?.length) return [];
    return recentlyPlayed.items.slice(0, 6).map((item) => ({
      id: item.track.id,
      name: item.track.name,
      image: item.track.album.images[0]?.url || "",
      uri: item.track.uri,
      type: "track" as const,
    }));
  }, [recentlyPlayed]);

  // Handle playing a track
  const handlePlayTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Handle playing a playlist/album
  const handlePlayContext = (
    uri: string,
    type: "playlist" | "album" | "artist",
    tracks: SpotifyTrack[]
  ) => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  if (recentlyPlayedLoading) {
    return (
      <div className="p-6">
        <HomeSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 pb-8">
      {/* Greeting */}
      <h1 className="text-[clamp(20px,3vw,32px)] font-bold text-white mb-6">
        {greeting}
      </h1>

      {/* Shortcut Tiles */}
      {shortcutTiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {shortcutTiles.map((tile) => (
            <ShortcutTile
              key={tile.id}
              id={tile.id}
              name={tile.name}
              image={tile.image}
              uri={tile.uri}
              type={tile.type}
            />
          ))}
        </div>
      )}

      {/* Made For You section */}
      {topArtists?.items && topArtists.items.length > 0 && (
        <SectionRow
          title="Made for you"
          items={topArtists.items.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || "",
            type: "artist" as const,
            uri: artist.uri,
          }))}
          cardType="artist"
          onShowAll={() => router.push("/search")}
        />
      )}

      {/* Daily Mix / Featured Playlists */}
      {featuredPlaylists?.playlists?.items && (
        <SectionRow
          title="Featured Playlists"
          items={featuredPlaylists.playlists.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images[0]?.url || "",
            type: "playlist" as const,
            uri: playlist.uri,
            description: playlist.description || "",
          }))}
          cardType="music"
          onShowAll={() => router.push("/search")}
        />
      )}

      {/* Popular Artists */}
      {topArtists?.items && (
        <SectionRow
          title="Popular Artists"
          items={topArtists.items.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || "",
            type: "artist" as const,
            uri: artist.uri,
          }))}
          cardType="artist"
          onShowAll={() => router.push("/search")}
        />
      )}

      {/* New Releases */}
      {newReleases?.items && (
        <SectionRow
          title="New Releases"
          items={newReleases.items.map((album) => ({
            id: album.id,
            name: album.name,
            image: album.images[0]?.url || "",
            type: "album" as const,
            uri: album.uri,
            artists: album.artists.map((a) => a.name).join(", "),
          }))}
          cardType="music"
          onShowAll={() => router.push("/search")}
        />
      )}

      {/* Recommended for Today */}
      {recommendations?.tracks && recommendations.tracks.length > 0 && (
        <SectionRow
          title="Recommended for today"
          items={recommendations.tracks.map((track) => ({
            id: track.id,
            name: track.name,
            image: track.album.images[0]?.url || "",
            type: "track" as const,
            uri: track.uri,
            artists: track.artists.map((a) => a.name).join(", "),
          }))}
          cardType="music"
          onShowAll={() => router.push("/search")}
        />
      )}

      {/* Your Playlists */}
      {userPlaylists?.items && userPlaylists.items.length > 0 && (
        <SectionRow
          title="Your Playlists"
          items={userPlaylists.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images[0]?.url || "",
            type: "playlist" as const,
            uri: playlist.uri,
            description: playlist.description || "",
          }))}
          cardType="music"
          onShowAll={() => router.push("/collection/tracks")}
        />
      )}

      {/* Trending */}
      {featuredPlaylists?.playlists?.items && (
        <SectionRow
          title="Trending Now"
          items={featuredPlaylists.playlists.items.slice(0, 5).map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images[0]?.url || "",
            type: "playlist" as const,
            uri: playlist.uri,
            description: playlist.description || "",
          }))}
          cardType="music"
          onShowAll={() => router.push("/search")}
        />
      )}
    </div>
  );
}
