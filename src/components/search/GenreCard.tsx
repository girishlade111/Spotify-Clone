/**
 * Genre Card Component - Colorful genre browsing card
 */

"use client";

import Image from "next/image";

interface GenreCardProps {
  id: string;
  name: string;
  color: string;
  onClick?: () => void;
}

export function GenreCard({ id, name, color, onClick }: GenreCardProps) {
  // Use a placeholder image for genre cards
  // In production, you'd fetch actual genre images from Spotify API
  const imageUrl = `https://t.scdn.co/images/${id}.jpeg`;

  return (
    <div
      onClick={onClick}
      className="relative aspect-[1/0.6] rounded-[8px] cursor-pointer overflow-hidden transition-transform hover:scale-[1.02] hover:brightness-110"
      style={{ backgroundColor: color }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Genre Name */}
      <h3 className="absolute top-4 left-4 text-[24px] font-bold text-white leading-tight max-w-[70%]">
        {name}
      </h3>

      {/* Rotated Album Image */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 rotate-[25deg] shadow-lg">
        <Image
          src={imageUrl}
          alt={name}
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-[4px]"
          unoptimized
          onError={(e) => {
            // Fallback to a solid color pattern if image fails
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
