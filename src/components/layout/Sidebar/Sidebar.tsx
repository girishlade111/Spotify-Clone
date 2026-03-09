/**
 * Sidebar Component
 */

"use client";

import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useAuth } from "@/hooks/useAuth";
import { SidebarNavItem } from "./SidebarNavItem";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryFilters } from "./LibraryFilters";
import { LibrarySortMenu } from "./LibrarySortMenu";
import { LibraryItem } from "./LibraryItem";

const SIDEBAR_MIN = 72;
const SIDEBAR_COLLAPSED_THRESHOLD = 150;
const SIDEBAR_MAX = 420;

// House icon - outline
function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.0001 3L4.0001 9.8V21H9.0001V15H15.0001V21H20.0001V9.8L12.0001 3ZM18.0001 19H17.0001V15C17.0001 14.4477 16.5524 14 16.0001 14H8.0001C7.44781 14 7.0001 14.4477 7.0001 15V19H6.0001V10.6L12.0001 5.4L18.0001 10.6V19Z" />
    </svg>
  );
}

// House icon - filled
function HouseFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.0001 3L4.0001 9.8V21H9.0001V15H15.0001V21H20.0001V9.8L12.0001 3Z" />
    </svg>
  );
}

// Search icon
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.5332 12.7H12.2065L17.7599 18.2537L18.9432 17.0704L13.3895 11.5167V9.84336C13.3895 6.38903 10.5838 3.58337 7.12949 3.58337C3.67516 3.58337 0.869492 6.38903 0.869492 9.84337C0.869492 13.2977 3.67516 16.1034 7.12949 16.1034C10.5838 16.1034 13.3895 13.2977 13.3895 9.84337H11.7162C11.7162 12.3774 9.66354 14.43 7.12949 14.43C4.59544 14.43 2.54282 12.3774 2.54282 9.84337C2.54282 7.30931 4.59544 5.2567 7.12949 5.2567C9.66354 5.2567 11.7162 7.30931 11.7162 9.84337H10.5332Z" />
    </svg>
  );
}

// Liked Songs gradient thumbnail
function LikedSongsThumbnail() {
  return (
    <div className="w-12 h-12 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#450af5] to-[#c4efd9]">
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M12.0001 21.51L10.8901 20.51C5.33008 15.54 2.00008 12.58 2.00008 8.99997C2.00008 6.23997 4.13008 4.10997 6.89008 4.10997C8.44008 4.10997 10.1801 4.89997 11.5001 6.26997C12.9701 4.80997 14.8201 4.10997 16.6101 4.10997C19.5301 4.10997 21.7501 6.29997 21.7501 9.17997C21.7501 12.69 18.4201 15.65 12.8601 20.62L12.0001 21.51Z" />
      </svg>
    </div>
  );
}

// Your Episodes gradient thumbnail
function YourEpisodesThumbnail() {
  return (
    <div className="w-12 h-12 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#056952] to-[#a8edcd]">
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M17.5 1H6.5C3.46743 1 1 3.46743 1 6.5V17.5C1 20.5326 3.46743 23 6.5 23H17.5C20.5326 23 23 20.5326 23 17.5V6.5C23 3.46743 20.5326 1 17.5 1ZM6.5 3H17.5C19.433 3 21 4.567 21 6.5V17.5C21 19.433 19.433 21 17.5 21H6.5C4.567 21 3 19.433 3 17.5V6.5C3 4.567 4.567 3 6.5 3ZM12 5C10.8954 5 10 5.89543 10 7V17C10 18.1046 10.8954 19 12 19C13.1046 19 14 18.1046 14 17V7C14 5.89543 13.1046 5 12 5ZM7 9C5.89543 9 5 9.89543 5 11V17C5 18.1046 5.89543 19 7 19C8.10457 19 9 18.1046 9 17V11C9 9.89543 8.10457 9 7 9ZM17 9C15.8954 9 15 9.89543 15 11V17C15 18.1046 15.8954 19 17 19C18.1046 19 19 18.1046 19 17V11C19 9.89543 18.1046 9 17 9Z" />
      </svg>
    </div>
  );
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const {
    sidebarWidth,
    setSidebarWidth,
    libraryFilter,
    librarySort,
  } = useUIStore();
  const { playlists, savedAlbums, followedArtists } = useLibraryStore();

  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isCollapsed = sidebarWidth < SIDEBAR_COLLAPSED_THRESHOLD;

  // Filter and sort library items
  const getLibraryItems = () => {
    let items: Array<{
      item: typeof playlists[number] | typeof savedAlbums[number] | typeof followedArtists[number];
      type: "playlist" | "album" | "artist";
    }> = [];

    if (libraryFilter === "all" || libraryFilter === "playlists") {
      items.push(...playlists.map((p) => ({ item: p, type: "playlist" as const })));
    }

    if (libraryFilter === "all" || libraryFilter === "albums") {
      items.push(...savedAlbums.map((a) => ({ item: a, type: "album" as const })));
    }

    if (libraryFilter === "artists") {
      items.push(...followedArtists.map((a) => ({ item: a, type: "artist" as const })));
    }

    // Sort
    if (librarySort === "alphabetical") {
      items.sort((a, b) => a.item.name.localeCompare(b.item.name));
    } else if (librarySort === "creator") {
      items.sort((a, b) => {
        const aOwner = "owner" in a.item ? a.item.owner?.display_name || "" : "";
        const bOwner = "owner" in b.item ? b.item.owner?.display_name || "" : "";
        return aOwner.localeCompare(bOwner);
      });
    }
    // recents and recently-added use the order from the store

    return items;
  };

  const libraryItems = getLibraryItems();

  // Resize handle logic
  useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) return;

    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      isResizing = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= SIDEBAR_MIN && newWidth <= SIDEBAR_MAX) {
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    handle.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [setSidebarWidth]);

  return (
    <>
      <aside
        className="h-full flex flex-col bg-black"
        style={{ width: sidebarWidth }}
      >
        {/* Home & Search Nav */}
        <div className="bg-black rounded-[8px] p-2 mb-2">
          <SidebarNavItem
            href="/"
            icon={<HouseIcon />}
            activeIcon={<HouseFilledIcon />}
            label="Home"
            collapsed={isCollapsed}
          />
          <SidebarNavItem
            href="/search"
            icon={<SearchIcon />}
            label="Search"
            collapsed={isCollapsed}
          />
        </div>

        {/* Library Section */}
        <div className="bg-black rounded-[8px] p-2 flex-1 flex flex-col overflow-hidden">
          <LibraryHeader collapsed={isCollapsed} />

          <LibraryFilters collapsed={isCollapsed} />

          <LibrarySortMenu collapsed={isCollapsed} />

          {/* Library List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
            {/* Pinned Items */}
            {!isCollapsed && (
              <>
                {/* Liked Songs */}
                <div
                  onClick={() => router.push("/collection/tracks")}
                  className="h-16 flex items-center gap-3 px-2 rounded-[4px] cursor-pointer hover:bg-white/7 transition-colors"
                >
                  <LikedSongsThumbnail />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-normal text-white truncate">
                      Liked Songs
                    </div>
                    <div className="text-sm text-[#A7A7A7] truncate">
                      Playlist • {user?.display_name || user?.email || "User"}
                    </div>
                  </div>
                </div>

                {/* Your Episodes */}
                <div
                  onClick={() => router.push("/collection/episodes")}
                  className="h-16 flex items-center gap-3 px-2 rounded-[4px] cursor-pointer hover:bg-white/7 transition-colors"
                >
                  <YourEpisodesThumbnail />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-normal text-white truncate">
                      Your Episodes
                    </div>
                    <div className="text-sm text-[#A7A7A7] truncate">
                      Your episodes • {user?.display_name || user?.email || "User"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 my-1 mx-2" />
              </>
            )}

            {/* User Library Items */}
            {libraryItems.map(({ item, type }) => (
              <LibraryItem
                key={`${type}-${item.id}`}
                item={item}
                type={type}
                isActive={false}
                isPlaying={false}
                collapsed={isCollapsed}
              />
            ))}

            {libraryItems.length === 0 && !isCollapsed && (
              <div className="px-4 py-8 text-center">
                <p className="text-[#A7A7A7] text-sm">
                  {libraryFilter === "all"
                    ? "Create or find playlists to see them here"
                    : `No ${libraryFilter} yet`}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className="w-[1px] h-full hover:w-1 hover:bg-white/20 transition-all cursor-col-resize flex-shrink-0"
        style={{ width: "1px" }}
      />
    </>
  );
}
