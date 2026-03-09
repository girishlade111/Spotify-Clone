/**
 * Search Results Page - Shows results for a query
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { search } from "@/services/spotify";
import { MusicCard } from "@/components/content/MusicCard";
import { SearchSkeleton } from "@/components/search/SearchSkeleton";
import { TopResultCard } from "@/components/search/TopResultCard";
import { SearchSection } from "@/components/search/SearchSection";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const { data: results, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query, ["track", "album", "artist", "playlist", "show", "episode"], 10),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  if (!query) {
    router.push("/search");
    return null;
  }

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (error || !results) {
    return (
      <div className="p-6">
        <div className="text-white text-center py-12">
          <p className="text-lg mb-2">No results found</p>
          <p className="text-[#A7A7A7]">Try searching for something else</p>
        </div>
      </div>
    );
  }

  const tracks = results.tracks?.items || [];
  const albums = results.albums?.items || [];
  const artists = results.artists?.items || [];
  const playlists = results.playlists?.items || [];
  const shows = results.shows?.items || [];
  const episodes = results.episodes?.items || [];

  // Get top result (first track or artist)
  const topResult = tracks[0] || artists[0] || albums[0] || playlists[0];

  return (
    <div className="p-6">
      {/* Top Result + Songs Section */}
      {topResult && (
        <div className="grid grid-cols-[1.5fr_1fr] gap-6 mb-8">
          {/* Top Result Card */}
          {topResult && (
            <TopResultCard
              item={topResult}
              type={
                "name" in topResult && "artists" in topResult
                  ? "track"
                  : "followers" in topResult
                  ? "artist"
                  : "tracks" in topResult
                  ? "playlist"
                  : "album"
              }
            />
          )}

          {/* Songs List */}
          {tracks.length > 0 && (
            <div>
              <h2 className="text-[20px] font-bold text-white mb-4">Songs</h2>
              <div className="space-y-2">
                {tracks.slice(0, 4).map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer group"
                  >
                    <img
                      src={track.album.images[2]?.url || track.album.images[0]?.url}
                      alt={track.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-normal text-white truncate">
                        {track.name}
                      </div>
                      <div className="text-xs text-[#A7A7A7] truncate">
                        {track.artists.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                    <div className="text-sm text-[#A7A7A7]">
                      {Math.floor(track.duration_ms / 1000 / 60)}:
                      {String(Math.floor((track.duration_ms / 1000) % 60)).padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <SearchSection
          title="Artists"
          items={artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || "",
            type: "artist" as const,
            uri: artist.uri,
          }))}
          cardType="artist"
          onShowAll={() => {}}
        />
      )}

      {/* Albums Section */}
      {albums.length > 0 && (
        <SearchSection
          title="Albums"
          items={albums.map((album) => ({
            id: album.id,
            name: album.name,
            image: album.images[0]?.url || "",
            type: "album" as const,
            uri: album.uri,
            artists: album.artists.map((a) => a.name).join(", "),
          }))}
          cardType="music"
          onShowAll={() => {}}
        />
      )}

      {/* Playlists Section */}
      {playlists.length > 0 && (
        <SearchSection
          title="Playlists"
          items={playlists.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images[0]?.url || "",
            type: "playlist" as const,
            uri: playlist.uri,
            description: playlist.description || "",
          }))}
          cardType="music"
          onShowAll={() => {}}
        />
      )}

      {/* Podcasts & Shows Section */}
      {shows.length > 0 && (
        <SearchSection
          title="Podcasts & Shows"
          items={shows.map((show) => ({
            id: show.id,
            name: show.name,
            image: show.images[0]?.url || "",
            type: "playlist" as const,
            uri: show.uri,
            description: show.publisher,
          }))}
          cardType="music"
          onShowAll={() => {}}
        />
      )}

      {/* Episodes Section */}
      {episodes.length > 0 && (
        <SearchSection
          title="Episodes"
          items={episodes.map((episode) => ({
            id: episode.id,
            name: episode.name,
            image: episode.images[0]?.url || "",
            type: "playlist" as const,
            uri: episode.uri,
            description: episode.description || "",
          }))}
          cardType="music"
          onShowAll={() => {}}
        />
      )}

      {/* No results message */}
      {!tracks.length && !albums.length && !artists.length && !playlists.length && !shows.length && !episodes.length && (
        <div className="text-center py-12">
          <p className="text-white text-lg mb-2">No results found for &quot;{query}&quot;</p>
          <p className="text-[#A7A7A7]">Please make sure your words are spelled correctly or use less or different keywords.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResultsContent />
    </Suspense>
  );
}
