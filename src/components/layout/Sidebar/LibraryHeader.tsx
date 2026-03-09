/**
 * Library Header Component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";

const SIDEBAR_MAX = 420;

interface LibraryHeaderProps {
  collapsed: boolean;
}

export function LibraryHeader({ collapsed }: LibraryHeaderProps) {
  const router = useRouter();
  const { setSidebarWidth, expandSidebar } = useUIStore();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleExpand = () => {
    setSidebarWidth(SIDEBAR_MAX);
  };

  const handleCreateClick = () => {
    setShowCreateMenu(true);
    // In a real app, this would show a dropdown menu
    setTimeout(() => setShowCreateMenu(false), 2000);
  };

  if (collapsed) {
    return (
      <div className="h-11 flex items-center justify-center px-2">
        <Tooltip content="Your Library" side="right">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-[#A7A7A7] hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
            </svg>
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="h-11 flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/collection")}
          className="flex items-center gap-3 text-[#A7A7A7] hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
          </svg>
          <span className="text-base font-bold">Your Library</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Create playlist or folder">
          <button
            type="button"
            onClick={handleCreateClick}
            className="w-8 h-8 flex items-center justify-center text-[#A7A7A7] hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6zm-9 9V4h16v16H2zm1 0h14V5H3v15zm16 0h4v4h-4v-4z" />
            </svg>
          </button>
        </Tooltip>

        <Tooltip content="Enlarge Your Library">
          <button
            type="button"
            onClick={handleExpand}
            className="w-8 h-8 flex items-center justify-center text-[#A7A7A7] hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M9 18V6h12v12H9zm-1 1H7V5h1v14zm14 0H8v-1h14v1z" />
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
