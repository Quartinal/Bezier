import { type HTMLMotionProps, motion } from "framer-motion";
import { Plus, X, Volume2, VolumeX, Pin } from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";
import { useTabGestures } from "~/hooks/useTabGestures";

export function TabBar() {
  const { tabs, addTab, closeTab, muteTab } = useBrowserStore();

  return (
    <div className="flex items-center h-10 bg-ctp-mantle border-b border-ctp-surface0">
      <div className="flex-1 flex items-center overflow-x-auto hide-scrollbar">
        {tabs.map(tab => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { bind, dragRef } = useTabGestures(tab.id);

          return (
            <motion.div
              key={tab.id}
              ref={dragRef}
              layoutId={tab.id}
              {...(bind() as HTMLMotionProps<"div">)}
              className={`
                relative flex items-center min-w-[200px] max-w-[300px] h-9
                px-3 py-1 mr-1 rounded-t cursor-default select-none
                ${tab.isActive ? "bg-ctp-surface0" : "bg-ctp-mantle hover:bg-ctp-surface0/50"}
              `}
            >
              {tab.favicon && (
                <img src={tab.favicon} alt="" className="w-4 h-4 mr-2" />
              )}

              <span className="flex-1 truncate text-sm">
                {tab.title || "New Tab"}
              </span>

              <div className="flex items-center gap-1 ml-2">
                {tab.pinned && <Pin size={14} className="text-ctp-blue" />}

                <button
                  onClick={() => muteTab(tab.id)}
                  className="p-1 rounded hover:bg-ctp-surface1"
                >
                  {tab.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <button
                  onClick={() => closeTab(tab.id)}
                  className="p-1 rounded hover:bg-ctp-surface1"
                >
                  <X size={14} />
                </button>
              </div>

              {tab.isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-ctp-blue"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() =>
          addTab({
            url: "https://www.google.com",
            title: "New Tab",
            pinned: false,
            muted: false,
            loading: false,
            private: false,
            hibernated: false,
          })
        }
        className="flex items-center justify-center w-10 h-10 
                   hover:bg-ctp-surface0 transition-colors"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
