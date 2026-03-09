/**
 * Main App Layout (Authenticated)
 * Includes Sidebar, TopBar, NowPlayingBar, and FullscreenPlayer
 */

"use client";

import { useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { TopBar } from "@/components/layout/TopBar/TopBar";
import { NowPlayingBar } from "@/components/player/NowPlayingBar";
import { FullscreenPlayer } from "@/components/player/FullscreenPlayer";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { useUIStore } from "@/store/uiStore";
import { QueuePanel } from "@/components/queue/QueuePanel";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightPanel = useUIStore((state) => state.rightPanel);
  const sidebarWidth = useUIStore((state) => state.sidebarWidth);

  // Initialize Spotify player (only called once in root layout)
  useSpotifyPlayer();

  return (
    <>
      <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
        {/* Main Area - 3 Panel Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div
            className="flex-shrink-0 h-full bg-black relative"
            style={{ width: sidebarWidth }}
          >
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#121212] rounded-lg my-2 mr-2 overflow-hidden">
            {/* Top Navigation Bar */}
            <TopBar scrollRef={scrollRef} />

            {/* Scrollable Content Area */}
            <main
              ref={scrollRef}
              className="flex-1 overflow-y-auto"
            >
              {children}
            </main>
          </div>

          {/* Right Panel (Queue/Lyrics) */}
          {rightPanel && (
            <div className="w-80 flex-shrink-0 h-full bg-[#121212] rounded-lg my-2 overflow-hidden">
              {rightPanel === 'queue' && <QueuePanel />}
              {rightPanel === 'lyrics' && (
                <div className="p-4 text-white">Lyrics Panel (Coming Soon)</div>
              )}
              {rightPanel === 'nowplaying' && (
                <div className="p-4 text-white">Now Playing View (Coming Soon)</div>
              )}
            </div>
          )}
        </div>

        {/* Now Playing Bar */}
        <NowPlayingBar />
      </div>

      {/* Fullscreen Player Overlay */}
      <FullscreenPlayer />
    </>
  );
}
