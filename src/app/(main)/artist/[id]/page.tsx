/**
 * Artist Page
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageGradient, TrackList } from "@/components/content";
import { Button, IconButton, FollowButton, Skeleton } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";
import { usePlayerStore } from "@/store/playerStore";
import { formatNumber } from "@/lib/formatters";
import type { SpotifyArtist, SpotifyTrack } from "@/types/spotify";

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1">
      <svg viewBox="0 0 24 24" fill="#3D91F4" className="w-4 h-4">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      <span className="text-xs font-bold text-white">Verified Artist</span>
    </div>
  );
}

function ShuffleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  );
}

export default function ArtistPage() {
  const params = useParams();
  const id = params.id as string;
  const { setPageDominantColor } = useUIStore();
  const { currentTrack, isPlaying, contextUri } = usePlayerStore();
  const [showAllTracks, setShowAllTracks] = useState(false);

  // Fetch artist data
  const { data: artist, isLoading: artistLoading } = useQuery<SpotifyArtist>({
    queryKey: ["artist", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        id,
        name: "Artist Name",
        images: [{ url: "", height: 640, width: 640 }],
        genres: ["pop", "rock"],
        followers: { total: 10000000 },
        popularity: 85,
        uri: `spotify:artist:${id}`,
        type: "artist",
        external_urls: { spotify: "" },
      } as SpotifyArtist;
    },
  });

  // Fetch top tracks
  const { data: topTracks, isLoading: tracksLoading } = useQuery<SpotifyTrack[]>({
    queryKey: ["artist-top-tracks", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return Array.from({ length: 10 }).map((_, i) => ({
        id: `track-${i}`,
        name: `Top Track ${i + 1}`,
        artists: [{ id, name: artist?.name || "Artist", uri: "", type: "artist", external_urls: { spotify: "" } }],
        album: { id: `album-${i}`, name: `Album ${i + 1}`, images: [{ url: "", height: 640, width: 640 }] },
        duration_ms: 200000 + i * 10000,
        explicit: false,
        popularity: 90 - i * 5,
        preview_url: null,
        track_number: i + 1,
        uri: `spotify:track:track-${i}`,
        type: "track",
        is_playable: true,
        is_local: false,
        external_urls: { spotify: "" },
      })) as SpotifyTrack[];
    },
    enabled: !!artist,
  });

  // Set page dominant color from artist image
  useEffect(() => {
    if (artist?.images?.[0]?.url) {
      // In a real app, extract dominant color
      setPageDominantColor("#535353");
    }
  }, [artist?.images?.[0]?.url, setPageDominantColor]);

  const isCurrentArtist = contextUri === artist?.uri;
  const isPlayingThis = isCurrentArtist && isPlaying;

  const handlePlay = () => {
    console.log("Play artist:", id);
  };

  const displayedTracks = showAllTracks ? (topTracks || []) : (topTracks || []).slice(0, 5);

  if (artistLoading) {
    return (
      <div className="relative">
        <div className="h-[340px] bg-[#282828] animate-pulse" />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#282828] rounded-full animate-pulse" />
            <div className="w-32 h-10 bg-[#282828] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Artist not found</h1>
        <p className="text-[#A7A7A7]">This artist may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {/* Hero Section with Background Image */}
      <div className="relative h-[340px] overflow-hidden">
        {artist.images?.[0]?.url ? (
          <Image
            src={artist.images[0].url}
            alt={artist.name}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#535353] to-[#121212]" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-[#121212]" />

        {/* Content at Bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <VerifiedBadge />
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-tight mt-2 drop-shadow-[0_4px_64px_rgba(0,0,0,0.5)]">
            {artist.name}
          </h1>
          <p className="text-base text-white/70 mt-2">
            {formatNumber(artist.followers?.total || 0)} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Play Button */}
        <button
          type="button"
          onClick={handlePlay}
          className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-[1.04] hover:bg-[#1ED760] transition-all"
        >
          {isPlayingThis ? (
            <PauseIcon size={28} />
          ) : (
            <PlayIcon size={28} />
          )}
        </button>

        {/* Shuffle Button */}
        <IconButton
          icon={<ShuffleIcon size={20} />}
          size="lg"
          tooltip="Shuffle"
        />

        {/* Follow Button */}
        <FollowButton
          type="artist"
          id={artist.id}
          size="md"
        />

        {/* More Options */}
        <IconButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          }
          size="lg"
          tooltip="More options"
        />
      </div>

      {/* Popular Section */}
      <div className="px-6 pb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>

        {tracksLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-[#282828] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Artist Track Rows */}
            <div className="flex flex-col">
              {displayedTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="grid items-center h-14 px-4 rounded-[4px] cursor-pointer hover:bg-white/10 transition-colors"
                  style={{ gridTemplateColumns: "16px 1fr auto auto" }}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-4 text-[#A7A7A7] text-base font-normal">
                    {index + 1}
                  </div>

                  {/* Track Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-normal text-white truncate">
                          {track.name}
                        </span>
                        {track.explicit && (
                          <span className="inline-flex items-center justify-center w-3 h-3 bg-[#A7A7A7] text-[#121212] text-[8px] font-bold rounded-[2px]">
                            E
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Play Count */}
                  <div className="text-sm text-[#A7A7A7] px-4">
                    {formatNumber(10000000 - index * 500000)}
                  </div>

                  {/* Duration + Heart */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#A7A7A7] min-w-[40px] text-right">
                      {Math.floor(track.duration_ms / 60000)}:
                      {(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* See More / Show Less */}
            <button
              type="button"
              onClick={() => setShowAllTracks(!showAllTracks)}
              className="mt-4 text-sm font-bold text-[#A7A7A7] hover:text-white transition-colors"
            >
              {showAllTracks ? "Show less" : "See more"}
            </button>
          </>
        )}
      </div>

      {/* About Section */}
      <div className="px-6 pb-8">
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>

        <div className="relative">
          {artist.images?.[1]?.url && (
            <div className="w-full max-h-[500px] rounded-[8px] overflow-hidden mb-4">
              <Image
                src={artist.images[1].url}
                alt={artist.name}
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-[#A7A7A7] space-y-4">
            <p className="text-base leading-relaxed line-clamp-4">
              {artist.name} is a {artist.genres?.join(", ") || "popular"} artist 
              with {formatNumber(artist.followers?.total || 0)} followers on Spotify.
              Known for their unique sound and captivating performances, they have
              become one of the most streamed artists globally.
            </p>
          </div>

          <p className="text-[#A7A7A7] mt-4">
            <span className="text-white font-bold">{formatNumber(artist.followers?.total || 0)}</span> Followers
          </p>
        </div>
      </div>
    </div>
  );
}
