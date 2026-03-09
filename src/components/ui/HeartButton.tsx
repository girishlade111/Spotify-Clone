/**
 * Heart Button Component
 * Like/unlike tracks with optimistic updates
 */

"use client";

import { useState } from "react";
import { useLibraryStore } from "@/store/libraryStore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface HeartButtonProps {
  trackId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function HeartOutlineIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M12.0001 21.51L10.8901 20.51C5.33008 15.54 2.00008 12.58 2.00008 8.99997C2.00008 6.23997 4.13008 4.10997 6.89008 4.10997C8.44008 4.10997 10.1801 4.89997 11.5001 6.26997C12.9701 4.80997 14.8201 4.10997 16.6101 4.10997C19.5301 4.10997 21.7501 6.29997 21.7501 9.17997C21.7501 12.69 18.4201 15.65 12.8601 20.62L12.0001 21.51Z" />
    </svg>
  );
}

function HeartFilledIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M12.0001 21.51L10.8901 20.51C5.33008 15.54 2.00008 12.58 2.00008 8.99997C2.00008 6.23997 4.13008 4.10997 6.89008 4.10997C8.44008 4.10997 10.1801 4.89997 11.5001 6.26997C12.9701 4.80997 14.8201 4.10997 16.6101 4.10997C19.5301 4.10997 21.7501 6.29997 21.7501 9.17997C21.7501 12.69 18.4201 15.65 12.8601 20.62L12.0001 21.51Z" />
    </svg>
  );
}

export function HeartButton({ trackId, size = "md", className = "" }: HeartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isTrackLiked, toggleLikedTrack } = useLibraryStore();
  const isLiked = isTrackLiked(trackId);

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const iconSize = sizeMap[size];

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    toggleLikedTrack(trackId);
    setIsAnimating(true);

    const wasLiked = isLiked;
    
    // Show toast
    if (!wasLiked) {
      toast.success("Saved to Your Liked Songs", {
        icon: "💚",
        duration: 2000,
      });
    } else {
      toast("Removed from Liked Songs", {
        duration: 2000,
      });
    }

    // TODO: Call actual API to save/remove track
    // For now, just keep the optimistic update
    // On error, revert: toggleLikedTrack(trackId);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center transition-colors ${className}`}
      whileTap={{ scale: isLiked ? 0.8 : 1.3 }}
      animate={isAnimating ? { scale: isLiked ? 0.8 : 1.3 } : { scale: 1 }}
      initial={false}
    >
      {isLiked ? (
        <HeartFilledIcon size={iconSize} />
      ) : (
        <HeartOutlineIcon size={iconSize} />
      )}
    </motion.button>
  );
}
