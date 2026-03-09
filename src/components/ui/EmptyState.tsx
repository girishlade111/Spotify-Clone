/**
 * Empty State Component
 * Reusable empty state for lists and pages
 */

"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="text-[#A7A7A7] mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-[#A7A7A7] text-base max-w-md mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

// Pre-built empty states for common scenarios

export const EmptyStates = {
  emptyLibrary: () => (
    <EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      }
      title="It's a bit quiet in here"
      description="Start following some artists to fill in the gaps"
    />
  ),

  emptySearch: () => (
    <EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      }
      title="Play what you love"
      description="Search for songs, podcasts, artists, or playlists"
    />
  ),

  emptyPlaylist: () => (
    <EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      }
      title="This is still empty"
      description="Find something to add using the search bar above"
    />
  ),

  noDevices: () => (
    <EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
        </svg>
      }
      title="No devices found"
      description="Open Spotify on another device to connect"
    />
  ),

  noResults: () => (
    <EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      }
      title="No results found"
      description="Try different keywords or check your spelling"
    />
  ),

  loading: () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#A7A7A7] mt-4">Loading...</p>
    </div>
  ),
};

// Named exports for convenience
export function EmptyLibrary() {
  return <EmptyStates.emptyLibrary />;
}

export function EmptySearch() {
  return <EmptyStates.emptySearch />;
}

export function EmptyPlaylist() {
  return <EmptyStates.emptyPlaylist />;
}

export function NoDevices() {
  return <EmptyStates.noDevices />;
}

export function NoResults() {
  return <EmptyStates.noResults />;
}
