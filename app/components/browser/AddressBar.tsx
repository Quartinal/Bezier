import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Star, MoreVertical, RefreshCw } from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";

export function AddressBar() {
  const [url, setUrl] = useState("");
  const [_, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeTab, tabs, updateTab } = useBrowserStore();

  const currentTab = tabs.find(tab => tab.id === activeTab);

  useEffect(() => {
    if (currentTab) {
      setUrl(currentTab.url);
    }
  }, [currentTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab) {
      updateTab(activeTab, { url, loading: true });
      // Simulate page load
      setTimeout(() => {
        updateTab(activeTab, { loading: false });
      }, 1000);
    }
    setIsEditing(false);
  };

  return (
    <div
      className="flex items-center h-10 px-2 bg-ctp-mantle 
                    border-b border-ctp-surface0"
    >
      <div
        className="flex items-center flex-1 h-7 px-2 
                      bg-ctp-surface0 rounded"
      >
        {currentTab?.loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={14} />
          </motion.div>
        ) : (
          <Lock size={14} />
        )}

        <form onSubmit={handleSubmit} className="flex-1 ml-2">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="w-full bg-transparent outline-none"
            placeholder="Search or enter address"
          />
        </form>

        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-ctp-surface1">
            <Shield size={14} />
          </button>
          <button className="p-1 rounded hover:bg-ctp-surface1">
            <Star size={14} />
          </button>
        </div>
      </div>

      <button className="ml-2 p-2 rounded hover:bg-ctp-surface0">
        <MoreVertical size={16} />
      </button>
    </div>
  );
}
