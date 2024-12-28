import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";
import type { TabGroup as TabGroupType } from "~/types/browser";

interface TabGroupProps {
  group: TabGroupType;
  onEditGroup: (group: TabGroupType) => void;
}

export function TabGroup({ group, onEditGroup }: TabGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tabs } = useBrowserStore();

  const groupTabs = tabs.filter(tab => tab.groupId === group.id);

  return (
    <div className="mb-2">
      <div
        className="flex items-center gap-2 p-2 rounded cursor-pointer 
                   hover:bg-ctp-surface0"
        style={{ borderLeft: `3px solid ${group.color}` }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-ctp-surface1"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>

        <span className="flex-1 font-medium">{group.name}</span>

        <span className="text-sm text-ctp-subtext0">
          {groupTabs.length} tabs
        </span>

        <button
          onClick={() => onEditGroup(group)}
          className="p-1 rounded hover:bg-ctp-surface1"
        >
          <Settings size={16} />
        </button>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-4"
          >
            <div
              className={`
                grid gap-2 p-2
                ${group.layout === "grid" ? "grid-cols-2" : "grid-cols-1"}
              `}
            >
              {groupTabs.map(tab => (
                <motion.div
                  key={tab.id}
                  layoutId={tab.id}
                  className="flex items-center gap-2 p-2 rounded 
                           bg-ctp-surface0 hover:bg-ctp-surface1"
                >
                  {tab.favicon && (
                    <img src={tab.favicon} alt="" className="w-4 h-4" />
                  )}
                  <span className="flex-1 truncate text-sm">{tab.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
