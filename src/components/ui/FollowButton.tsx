/**
 * Follow Button Component
 * Follow/unfollow artists, playlists, albums
 */

"use client";

import { useState } from "react";
import { useLibraryStore } from "@/store/libraryStore";
import toast from "react-hot-toast";

interface FollowButtonProps {
  type: "artist" | "playlist" | "album";
  id: string;
  size?: "sm" | "md";
  className?: string;
}

export function FollowButton({
  type,
  id,
  size = "md",
  className = "",
}: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    isArtistFollowed,
    isPlaylistFollowed,
    isAlbumSaved,
    toggleFollowedArtist,
    toggleFollowedPlaylist,
    toggleSavedAlbum,
  } = useLibraryStore();

  const isFollowing =
    type === "artist"
      ? isArtistFollowed(id)
      : type === "playlist"
      ? isPlaylistFollowed(id)
      : isAlbumSaved(id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic update
    if (type === "artist") {
      toggleFollowedArtist(id);
    } else if (type === "playlist") {
      toggleFollowedPlaylist(id);
    } else {
      toggleSavedAlbum(id);
    }

    // Show toast
    if (!isFollowing) {
      toast.success(`Following ${type}`, {
        duration: 2000,
      });
    } else {
      toast(`Unfollowed ${type}`, {
        duration: 2000,
      });
    }

    // TODO: Call actual API
  };

  const sizeClasses = {
    sm: "h-8 px-4 text-[13px]",
    md: "h-10 px-6 text-[14px]",
  };

  const getButtonText = () => {
    if (!isFollowing) {
      return type === "album" ? "Save" : "Follow";
    }
    if (isHovered) {
      return type === "album" ? "Unsave" : "Unfollow";
    }
    return type === "album" ? "Saved" : "Following";
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${sizeClasses[size]}
        rounded-full border border-[#727272]
        bg-transparent font-bold
        transition-all duration-200
        hover:border-white
        ${isFollowing && isHovered ? "text-[#F15E6C]" : "text-white"}
        ${className}
      `}
    >
      {getButtonText()}
    </button>
  );
}
