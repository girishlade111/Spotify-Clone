/**
 * UI Types
 */

export type LibraryFilter = "all" | "playlists" | "podcasts" | "artists" | "albums";
export type LibrarySort = "recents" | "recently-added" | "alphabetical" | "creator";
export type RightPanel = "queue" | "lyrics" | "nowplaying" | null;

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode | string;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
  subItems?: ContextMenuItem[];
}
