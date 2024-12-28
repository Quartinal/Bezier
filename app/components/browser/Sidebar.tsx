import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Clock,
  Download,
  Settings,
  Layout,
  Shield,
  Menu,
} from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useBrowserStore();
  const [activeTab, setActiveTab] = useState<string>("bookmarks");

  const tabs = [
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "history", icon: Clock, label: "History" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "tabGroups", icon: Layout, label: "Tab Groups" },
    { id: "passwords", icon: Shield, label: "Passwords" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 48 }}
      className="h-full bg-ctp-mantle border-r border-ctp-surface0"
    >
      <div className="flex flex-col h-full">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 p-3 hover:bg-ctp-surface0"
        >
          <Menu size={20} />
          {sidebarOpen && <span>Menu</span>}
        </button>

        <div className="flex-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-3 w-full p-3
                hover:bg-ctp-surface0 transition-colors
                ${activeTab === id ? "bg-ctp-surface0" : ""}
              `}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
