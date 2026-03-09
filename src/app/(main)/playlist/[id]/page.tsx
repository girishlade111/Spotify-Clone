/**
 * Playlist Page
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageGradient, TrackList } from "@/components/content";
import { Button, IconButton, FollowButton, HeartButton } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";
import { usePlayerStore } from "@/store/playerStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useAuth } from "@/hooks/useAuth";
import { extractDominantColor } from "@/lib/colorExtractor";
import { formatDuration } from "@/lib/formatters";
import type { SpotifyPlaylist, SpotifyTrack } from "@/types/spotify";

// Placeholder gradient for playlists without images
function getGradientForName(name: string) {
  const colors = [
    ["#450af5", "#c4efd9"],
    ["#8e44ad", "#f39c12"],
    ["#e74c3c", "#f1948a"],
    ["#3498db", "#85c1e9"],
    ["#1abc9c", "#76d7c4"],
  ];
  const index = name.length % colors.length;
  return colors[index];
}

function PlaylistPlaceholder({ name }: { name: string }) {
  const [color1, color2] = getGradientForName(name);
  
  return (
    <div
      className="w-[232px] h-[232px] rounded-[4px] flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-20 h-20 opacity-50">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </div>
  );
}

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

function ShuffleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  );
}

export default function PlaylistPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { setPageDominantColor } = useUIStore();
  const { currentTrack, isPlaying, contextUri, shuffleState } = usePlayerStore();
  const { isPlaylistFollowed } = useLibraryStore();
  const [dominantColor, setDominantColor] = useState("#535353");

  // Fetch playlist data
  const { data: playlist, isLoading } = useQuery<SpotifyPlaylist>({
    queryKey: ["playlist", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return getPlaylist(id);

      // Mock data for now
      return {
        id,
        name: "Today's Top Hits",
        description: "The hottest tracks right now.",
        images: [{ url: "", height: 640, width: 640 }],
        owner: {
          id: "spotify",
          display_name: "Spotify",
          uri: "spotify:user:spotify",
          type: "user",
          external_urls: { spotify: "" },
        },
        tracks: {
          total: 50,
          items: [],
          limit: 50,
          offset: 0,
          next: null,
          previous: null,
          href: "",
        },
        followers: { href: null, total: 32000000 },
        public: true,
        collaborative: false,
        uri: `spotify:playlist:${id}`,
        type: "playlist",
        external_urls: { spotify: "" },
        snapshot_id: "",
      } as SpotifyPlaylist;
    },
  });

  // Extract dominant color from playlist image
  useEffect(() => {
    if (playlist?.images?.[0]?.url) {
      extractDominantColor(playlist.images[0].url).then((color) => {
        setDominantColor(color);
        setPageDominantColor(color);
      });
    }
  }, [playlist?.images?.[0]?.url, setPageDominantColor]);

  // Calculate total duration
  const getTotalDuration = () => {
    if (!playlist?.tracks?.items) return "0 min";
    // TODO: Calculate from actual tracks
    return "2 hr 30 min";
  };

  const isFollowing = playlist ? isPlaylistFollowed(playlist.id) : false;
  const isCurrentPlaylist = contextUri === playlist?.uri;
  const isPlayingThis = isCurrentPlaylist && isPlaying;

  const handlePlay = () => {
    // TODO: Start playback
    console.log("Play playlist:", id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex gap-6 mb-8">
          <div className="w-[232px] h-[232px] bg-[#282828] rounded-[4px] animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-20 bg-[#282828] rounded mb-4 animate-pulse" />
            <div className="h-20 w-full bg-[#282828] rounded mb-4 animate-pulse" />
            <div className="h-4 w-64 bg-[#282828] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Playlist not found</h1>
        <p className="text-[#A7A7A7]">This playlist may have been removed or is private.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      <PageGradient color={dominantColor} />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-end gap-6 p-6 min-h-[340px]">
          {/* Cover Image */}
          <div className="w-[232px] h-[232px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-[4px] overflow-hidden flex-shrink-0">
            {playlist.images?.[0]?.url ? (
              <Image
                src={playlist.images[0].url}
                alt={playlist.name}
                width={232}
                height={232}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <PlaylistPlaceholder name={playlist.name} />
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Playlist
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p
                className="text-sm text-white/70 mt-4 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: playlist.description }}
              />
            )}

            {/* Meta Row */}
            <div className="flex items-center gap-1 flex-wrap mt-2 text-sm">
              {playlist.owner && (
                <>
                  <div className="w-[22px] h-[22px] rounded-full bg-[#535353] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {playlist.owner.display_name?.[0]?.toUpperCase() || "S"}
                    </span>
                  </div>
                  <Link
                    href={`/user/${playlist.owner.id}`}
                    className="font-bold text-white hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {playlist.owner.display_name || "Spotify"}
                  </Link>
                  <span className="text-[#A7A7A7]">•</span>
                </>
              )}
              <span className="text-[#A7A7A7]">
                {playlist.followers?.total?.toLocaleString()} likes
              </span>
              <span className="text-[#A7A7A7]">•</span>
              <span className="text-[#A7A7A7]">
                {playlist.tracks?.total || 0} songs,{" "}
                {getTotalDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4 px-6 pb-4">
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
            active={shuffleState}
            size="lg"
            tooltip="Shuffle"
          />

          {/* Follow Button */}
          <FollowButton
            type="playlist"
            id={playlist.id}
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

        {/* Track List */}
        <div className="px-6 pb-12">
          <TrackList
            tracks={[]}
            contextUri={playlist.uri}
            showArtwork={true}
            showAlbum={true}
            showDateAdded={true}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
