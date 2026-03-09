import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LibraryFilter, LibrarySort, RightPanel, ContextMenuItem } from '@/types/ui';

interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

interface UIStore {
  sidebarWidth: number;
  isSidebarCollapsed: boolean;
  rightPanel: RightPanel;
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  pageScrollY: number;
  pageDominantColor: string;
  isLibraryExpanded: boolean;
  activeContextMenu: ContextMenuState | null;

  // Actions
  setSidebarWidth: (w: number) => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  setRightPanel: (panel: RightPanel) => void;
  setLibraryFilter: (filter: LibraryFilter) => void;
  setLibrarySort: (sort: LibrarySort) => void;
  setPageScrollY: (y: number) => void;
  setPageDominantColor: (color: string) => void;
  toggleLibraryExpanded: () => void;
  openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
}

const SIDEBAR_MIN = 72;
const SIDEBAR_COLLAPSED_THRESHOLD = 150;
const SIDEBAR_DEFAULT = 280;

const initialState = {
  sidebarWidth: SIDEBAR_DEFAULT,
  isSidebarCollapsed: false,
  rightPanel: null,
  libraryFilter: 'all' as LibraryFilter,
  librarySort: 'recents' as LibrarySort,
  pageScrollY: 0,
  pageDominantColor: '#535353',
  isLibraryExpanded: false,
  activeContextMenu: null,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSidebarWidth: (w) => {
        const clamped = Math.max(SIDEBAR_MIN, Math.min(420, w));
        set({
          sidebarWidth: clamped,
          isSidebarCollapsed: clamped < SIDEBAR_COLLAPSED_THRESHOLD,
        });
      },

      collapseSidebar: () => {
        set({ sidebarWidth: SIDEBAR_MIN, isSidebarCollapsed: true });
      },

      expandSidebar: () => {
        set({ sidebarWidth: SIDEBAR_DEFAULT, isSidebarCollapsed: false });
      },

      setRightPanel: (panel) => {
        const { rightPanel: currentPanel } = get();
        // Toggle off if same panel
        set({ rightPanel: panel === currentPanel ? null : panel });
      },

      setLibraryFilter: (filter) => set({ libraryFilter: filter }),

      setLibrarySort: (sort) => set({ librarySort: sort }),

      setPageScrollY: (y) => set({ pageScrollY: y }),

      setPageDominantColor: (color) => set({ pageDominantColor: color }),

      toggleLibraryExpanded: () =>
        set((state) => ({ isLibraryExpanded: !state.isLibraryExpanded })),

      openContextMenu: (x, y, items) => set({ activeContextMenu: { x, y, items } }),

      closeContextMenu: () => set({ activeContextMenu: null }),
    }),
    {
      name: 'spotify-clone-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarWidth: state.sidebarWidth,
        libraryFilter: state.libraryFilter,
        librarySort: state.librarySort,
        volumePercent: 50, // This will be synced from player store if needed
      }),
    }
  )
);
