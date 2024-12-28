import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Tab,
  TabGroup,
  Bookmark,
  HistoryEntry,
  DownloadItem,
} from "~/types/browser";

interface BrowserState {
  tabs: Tab[];
  tabGroups: TabGroup[];
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  downloads: DownloadItem[];
  sidebarOpen: boolean;
  activeTab: string | null;

  addTab: (tab: Omit<Tab, "id" | "isActive" | "lastAccessed">) => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setActiveTab: (id: string) => void;
  pinTab: (id: string) => void;
  muteTab: (id: string) => void;
  hibernateTab: (id: string) => void;

  initializeTabs: (tabs: Tab[]) => void;

  addTabGroup: (
    name: string,
    color: string,
    layout?: TabGroup["layout"],
  ) => void;
  removeTabGroup: (id: string) => void;
  moveTabToGroup: (tabId: string, groupId: string) => void;
  updateTabGroup: (id: string, updates: Partial<TabGroup>) => void;

  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;

  addHistoryEntry: (
    entry: Omit<HistoryEntry, "id" | "timestamp" | "visitCount">,
  ) => void;
  clearHistory: () => void;
  removeHistoryEntry: (id: string) => void;

  startDownload: (url: string, filename: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  removeDownload: (id: string) => void;
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void;

  toggleSidebar: () => void;
}

export const useBrowserStore = create<BrowserState>()(
  persist(
    set => ({
      tabs: [],
      tabGroups: [],
      bookmarks: [],
      history: [],
      downloads: [],
      sidebarOpen: false,
      activeTab: null,

      addTab: tab =>
        set(state => {
          const newTab: Tab = {
            ...tab,
            id: uuidv4(),
            isActive: true,
            lastAccessed: Date.now(),
            pinned: false,
            muted: false,
            loading: false,
            private: false,
            hibernated: false,
          };
          return {
            tabs: state.tabs
              .map(t => ({ ...t, isActive: false }))
              .concat(newTab),
            activeTab: newTab.id,
          };
        }),

      closeTab: id =>
        set(state => {
          const tabIndex = state.tabs.findIndex(t => t.id === id);
          const newTabs = state.tabs.filter(t => t.id !== id);

          let newActiveTab = state.activeTab;
          if (id === state.activeTab && newTabs.length > 0) {
            const nextTab = newTabs[Math.min(tabIndex, newTabs.length - 1)];
            newActiveTab = nextTab.id;
            newTabs[newTabs.findIndex(t => t.id === nextTab.id)].isActive =
              true;
          }

          return {
            tabs: newTabs,
            activeTab: newActiveTab,
          };
        }),

      updateTab: (id, updates) =>
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === id ? { ...tab, ...updates } : tab,
          ),
        })),

      setActiveTab: id =>
        set(state => ({
          tabs: state.tabs.map(tab => ({
            ...tab,
            isActive: tab.id === id,
            lastAccessed: tab.id === id ? Date.now() : tab.lastAccessed,
          })),
          activeTab: id,
        })),

      pinTab: id =>
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === id ? { ...tab, pinned: !tab.pinned } : tab,
          ),
        })),

      muteTab: id =>
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === id ? { ...tab, muted: !tab.muted } : tab,
          ),
        })),

      hibernateTab: id =>
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === id ? { ...tab, hibernated: !tab.hibernated } : tab,
          ),
        })),

      initializeTabs: tabs => set({ tabs }),

      addTabGroup: (name, color, layout = "vertical") =>
        set(state => ({
          tabGroups: [
            ...state.tabGroups,
            {
              id: uuidv4(),
              name,
              color,
              layout,
              tabs: [],
              collapsed: false,
              createdAt: Date.now(),
            },
          ],
        })),

      removeTabGroup: id =>
        set(state => ({
          tabGroups: state.tabGroups.filter(group => group.id !== id),
          tabs: state.tabs.map(tab =>
            tab.groupId === id ? { ...tab, groupId: undefined } : tab,
          ),
        })),

      moveTabToGroup: (tabId, groupId) =>
        set(state => ({
          tabGroups: state.tabGroups.map(group => ({
            ...group,
            tabs:
              group.id === groupId
                ? [...group.tabs, tabId]
                : group.tabs.filter(id => id !== tabId),
          })),
          tabs: state.tabs.map(tab =>
            tab.id === tabId ? { ...tab, groupId } : tab,
          ),
        })),

      updateTabGroup: (id, updates) =>
        set(state => ({
          tabGroups: state.tabGroups.map(group =>
            group.id === id ? { ...group, ...updates } : group,
          ),
        })),

      addBookmark: bookmark =>
        set(state => ({
          bookmarks: [
            ...state.bookmarks,
            {
              ...bookmark,
              id: uuidv4(),
              createdAt: Date.now(),
              tags: bookmark.tags || [],
            },
          ],
        })),

      removeBookmark: id =>
        set(state => ({
          bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id),
        })),

      updateBookmark: (id, updates) =>
        set(state => ({
          bookmarks: state.bookmarks.map(bookmark =>
            bookmark.id === id ? { ...bookmark, ...updates } : bookmark,
          ),
        })),

      addHistoryEntry: entry =>
        set(state => {
          const existingEntry = state.history.find(h => h.url === entry.url);
          if (existingEntry) {
            return {
              history: state.history.map(h =>
                h.id === existingEntry.id
                  ? {
                      ...h,
                      visitCount: h.visitCount + 1,
                      timestamp: Date.now(),
                    }
                  : h,
              ),
            };
          }
          return {
            history: [
              {
                ...entry,
                id: uuidv4(),
                timestamp: Date.now(),
                visitCount: 1,
              },
              ...state.history,
            ],
          };
        }),

      clearHistory: () => set({ history: [] }),

      removeHistoryEntry: id =>
        set(state => ({
          history: state.history.filter(entry => entry.id !== id),
        })),

      startDownload: (url, filename) =>
        set(state => ({
          downloads: [
            {
              id: uuidv4(),
              url,
              filename,
              progress: 0,
              status: "pending",
              speed: 0,
              timeRemaining: 0,
              size: 0,
              downloadedSize: 0,
              startTime: Date.now(),
              chunks: [],
            },
            ...state.downloads,
          ],
        })),

      pauseDownload: id =>
        set(state => ({
          downloads: state.downloads.map(download =>
            download.id === id ? { ...download, status: "paused" } : download,
          ),
        })),

      resumeDownload: id =>
        set(state => ({
          downloads: state.downloads.map(download =>
            download.id === id
              ? { ...download, status: "downloading" }
              : download,
          ),
        })),

      cancelDownload: id =>
        set(state => ({
          downloads: state.downloads.filter(download => download.id !== id),
        })),

      removeDownload: id =>
        set(state => ({
          downloads: state.downloads.filter(download => download.id !== id),
        })),

      updateDownload: (id, updates) =>
        set(state => ({
          downloads: state.downloads.map(download =>
            download.id === id ? { ...download, ...updates } : download,
          ),
        })),

      toggleSidebar: () =>
        set(state => ({
          sidebarOpen: !state.sidebarOpen,
        })),
    }),
    {
      name: "bezier-browser-storage",
    },
  ),
);
