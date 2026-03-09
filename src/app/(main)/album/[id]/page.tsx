/**
 * Album Page
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageGradient, TrackList } from "@/components/content";
import { Button, IconButton, HeartButton } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";
import { usePlayerStore } from "@/store/playerStore";
import { useLibraryStore } from "@/store/libraryStore";
import { extractDominantColor } from "@/lib/colorExtractor";
import { formatDuration } from "@/lib/formatters";
import type { SpotifyAlbum } from "@/types/spotify";

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

export default function AlbumPage() {
  const params = useParams();
  const id = params.id as string;
  const { setPageDominantColor } = useUIStore();
  const { currentTrack, isPlaying, contextUri } = usePlayerStore();
  const { isAlbumSaved } = useLibraryStore();
  const [dominantColor, setDominantColor] = useState("#535353");

  // Fetch album data
  const { data: album, isLoading } = useQuery<SpotifyAlbum>({
    queryKey: ["album", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        id,
        name: "Album Name",
        album_type: "album",
        artists: [
          {
            id: "artist1",
            name: "Artist Name",
            uri: "spotify:artist:artist1",
            type: "artist",
            external_urls: { spotify: "" },
          },
        ],
        images: [{ url: "", height: 640, width: 640 }],
        release_date: "2024-01-01",
        release_date_precision: "day",
        total_tracks: 12,
        tracks: {
          total: 12,
          items: [],
          limit: 50,
          offset: 0,
          next: null,
          previous: null,
          href: "",
        },
        uri: `spotify:album:${id}`,
        type: "album",
        external_urls: { spotify: "" },
        label: "Record Label",
        copyrights: [
          { text: "© 2024 Record Label", type: "C" },
          { text: "℗ 2024 Record Label", type: "P" },
        ],
        genres: [],
        popularity: 0,
      } as SpotifyAlbum;
    },
  });

  // Extract dominant color from album image
  useEffect(() => {
    if (album?.images?.[0]?.url) {
      extractDominantColor(album.images[0].url).then((color) => {
        setDominantColor(color);
        setPageDominantColor(color);
      });
    }
  }, [album?.images?.[0]?.url, setPageDominantColor]);

  const isSaved = album ? isAlbumSaved(album.id) : false;
  const isCurrentAlbum = contextUri === album?.uri;
  const isPlayingThis = isCurrentAlbum && isPlaying;

  const handlePlay = () => {
    // TODO: Start playback
    console.log("Play album:", id);
  };

  const getAlbumTypeLabel = () => {
    if (!album) return "ALBUM";
    const type = album.album_type.toLowerCase();
    if (type === "single") return "SINGLE";
    if (type === "compilation") return "COMPILATION";
    return "ALBUM";
  };

  const getReleaseYear = () => {
    if (!album?.release_date) return "";
    return album.release_date.split("-")[0];
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

  if (!album) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Album not found</h1>
        <p className="text-[#A7A7A7]">This album may have been removed.</p>
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
            {album.images?.[0]?.url ? (
              <Image
                src={album.images[0].url}
                alt={album.name}
                width={232}
                height={232}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#A7A7A7" className="w-20 h-20">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {getAlbumTypeLabel()}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight">
              {album.name}
            </h1>

            {/* Meta Row */}
            <div className="flex items-center gap-1 flex-wrap mt-2 text-sm">
              {album.artists?.map((artist, i) => (
                <span key={artist.id} className="flex items-center gap-1">
                  <Link
                    href={`/artist/${artist.id}`}
                    className="font-bold text-white hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist.name}
                  </Link>
                  {i < album.artists.length - 1 && (
                    <span className="text-[#A7A7A7]">,</span>
                  )}
                </span>
              ))}
              {getReleaseYear() && (
                <>
                  <span className="text-[#A7A7A7]">•</span>
                  <span className="text-[#A7A7A7]]">{getReleaseYear()}</span>
                </>
              )}
              <span className="text-[#A7A7A7]">•</span>
              <span className="text-[#A7A7A7]">
                {album.total_tracks}{" "}
                {album.total_tracks === 1 ? "song" : "songs"}
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

          {/* Save Album Button */}
          <HeartButton trackId={album.id} size="lg" />

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
            contextUri={album.uri}
            showArtwork={false}
            showAlbum={false}
            showDateAdded={false}
            isLoading={isLoading}
          />
        </div>

        {/* Copyright Section */}
        {album.copyrights && album.copyrights.length > 0 && (
          <div className="px-6 pb-8">
            <div className="text-[11px] text-[#A7A7A7] space-y-1">
              {album.copyrights.map((copyright, i) => (
                <div key={i}>
                  {copyright.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
