/**
 * Context Menu Component
 * Right-click context menu with portal rendering
 */

"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { SpotifyTrack, SpotifyPlaylist } from "@/types/spotify";

export interface ContextMenuItemType {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  subItems?: ContextMenuItemType[];
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemType[];
  onClose: () => void;
}

function ContextMenuItem({
  item,
  onClose,
}: {
  item: ContextMenuItemType;
  onClose: () => void;
}) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);

  if (item.divider) {
    return <div className="h-px bg-white/10 my-1" />;
  }

  const handleClick = () => {
    item.onClick?.();
    onClose();
  };

  const content = (
    <div
      role="menuitem"
      tabIndex={-1}
      onClick={item.disabled ? undefined : handleClick}
      onMouseEnter={() => item.subItems && setShowSubmenu(true)}
      onMouseLeave={() => item.subItems && setShowSubmenu(false)}
      className={`
        h-10 px-3 flex items-center gap-3 rounded-[2px]
        cursor-pointer transition-colors
        ${item.disabled ? "opacity-50 cursor-default" : "hover:bg-white/10"}
        ${item.danger ? "text-[#F15E6C]" : "text-[#EBEBEB]"}
      `}
    >
      {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
      <span className="flex-1 text-sm font-normal">{item.label}</span>
      {item.subItems && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="relative" ref={submenuRef}>
      {item.href ? (
        <Link
          href={item.href}
          className="block"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {content}
        </Link>
      ) : (
        content
      )}

      {showSubmenu && item.subItems && (
        <div className="absolute left-full top-0 ml-1 bg-[#282828] rounded-[4px] shadow-[0_16px_24px_rgba(0,0,0,0.3)] z-[10000] overflow-hidden min-w-[196px]">
          {item.subItems.map((subItem, i) => (
            <ContextMenuItem key={i} item={subItem} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  // Auto-adjust position to keep menu in viewport
  const menuWidth = 208;
  const menuMaxHeight = 400;
  const adjustedX = Math.min(x, typeof window !== "undefined" ? window.innerWidth - menuWidth - 10 : x);
  const adjustedY = Math.min(y, typeof window !== "undefined" ? window.innerHeight - menuMaxHeight - 10 : y);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed bg-[#282828] rounded-[4px] shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)] z-[9999] overflow-hidden min-w-[196px] max-w-[250px] py-1"
        style={{
          left: adjustedX,
          top: adjustedY,
        }}
        role="menu"
      >
        {items.map((item, index) => (
          <ContextMenuItem key={index} item={item} onClose={onClose} />
        ))}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// Context menu items factory for tracks
export function getTrackContextMenuItems(
  track: SpotifyTrack,
  playlistId?: string,
  isOwner?: boolean,
  userPlaylists: SpotifyPlaylist[] = []
): ContextMenuItemType[] {
  const items: ContextMenuItemType[] = [];

  // Add to queue
  items.push({
    label: "Add to queue",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
      </svg>
    ),
    onClick: () => {
      console.log("Add to queue:", track.id);
    },
  });

  // Save to Liked Songs
  items.push({
    label: "Save to your Liked Songs",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    onClick: () => {
      console.log("Save track:", track.id);
    },
  });

  // Add to playlist submenu
  items.push({
    label: "Add to playlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
    subItems: [
      {
        label: "New playlist",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        ),
        onClick: () => {
          console.log("Create new playlist");
        },
      },
      ...userPlaylists.map((playlist) => ({
        label: playlist.name,
        onClick: () => {
          console.log("Add to playlist:", playlist.id);
        },
      })),
    ],
  });

  // Remove from playlist (if owner)
  if (playlistId && isOwner) {
    items.push({
      label: "Remove from this playlist",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      ),
      danger: true,
      onClick: () => {
        console.log("Remove from playlist:", playlistId, track.id);
      },
    });
  }

  // Divider
  items.push({ divider: true });

  // Go to song radio
  items.push({
    label: "Go to song radio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5v9z" />
      </svg>
    ),
    onClick: () => {
      window.location.href = `/playlist/radio:${track.id}`;
    },
  });

  // Go to artist
  track.artists?.forEach((artist) => {
    items.push({
      label: `Go to artist: ${artist.name}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
        </svg>
      ),
      href: `/artist/${artist.id}`,
    });
  });

  // Go to album
  if (track.album) {
    items.push({
      label: `Go to album: ${track.album.name}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      ),
      href: `/album/${track.album.id}`,
    });
  }

  // Show credits
  items.push({
    label: "Show credits",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
      </svg>
    ),
    onClick: () => {
      console.log("Show credits for:", track.id);
    },
  });

  // Divider
  items.push({ divider: true });

  // Share submenu
  items.push({
    label: "Share",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
      </svg>
    ),
    subItems: [
      {
        label: "Copy song link",
        onClick: () => {
          navigator.clipboard.writeText(`https://open.spotify.com/track/${track.id}`);
        },
      },
      {
        label: "Copy embed code",
        onClick: () => {
          const embed = `<iframe src="https://open.spotify.com/embed/track/${track.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
          navigator.clipboard.writeText(embed);
        },
      },
    ],
  });

  // Open in Desktop App
  items.push({
    label: "Open in Desktop App",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
      </svg>
    ),
    onClick: () => {
      window.location.href = `spotify:track:${track.id}`;
    },
  });

  return items;
}
