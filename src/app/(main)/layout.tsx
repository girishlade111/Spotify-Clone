/**
 * Main App Layout (Authenticated)
 * Includes Sidebar, TopBar, and main content area
 */

"use client";

import { useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-screen flex bg-black overflow-hidden">
      {/* Left Sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
    </div>
  );
}
