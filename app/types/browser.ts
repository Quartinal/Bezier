export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  groupId?: string;
  previewImage?: string;
  lastAccessed: number;
  pinned: boolean;
  muted: boolean;
  loading: boolean;
  private: boolean;
  hibernated: boolean;
  customColor?: string;
  notes?: string;
}

export interface TabGroup {
  id: string;
  name: string;
  color: string;
  tabs: string[];
  collapsed: boolean;
  layout: "grid" | "vertical" | "horizontal";
  customIcon?: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  tags: string[];
  createdAt: number;
  lastVisited?: number;
  customIcon?: string;
  notes?: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  timestamp: number;
  visitCount: number;
  duration?: number;
  referrer?: string;
  tags?: string[];
}

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  progress: number;
  status: "pending" | "downloading" | "paused" | "completed" | "error";
  speed: number;
  timeRemaining: number;
  size: number;
  downloadedSize: number;
  startTime: number;
  endTime?: number;
  error?: string;
  chunks: {
    id: string;
    start: number;
    end: number;
    progress: number;
  }[];
}

export interface TabHibernationRule {
  id: string;
  name: string;
  conditions: {
    inactiveTime: number;
    maxTabs: number;
    excludeDomains: string[];
  };
  condition: string;
  action: "hibernate" | "close";
  value: number;
  isEnabled: boolean;
}

export interface KeyboardShortcut {
  id: string;
  name: string;
  description: string;
  keys: string[];
  action: string;
  category: string;
  custom: boolean;
}

export interface PasswordEntry {
  id: string;
  domain: string;
  username: string;
  password: string;
  notes?: string;
  lastUsed: number;
  strength: number;
  tags: string[];
  customFields: {
    name: string;
    value: string;
  }[];
}
