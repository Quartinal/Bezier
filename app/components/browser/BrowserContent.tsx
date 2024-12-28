import { motion, AnimatePresence } from "framer-motion";
import { useBrowserStore } from "~/store/browserStore";

export function BrowserContent() {
  const { activeTab, tabs } = useBrowserStore();
  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex-1 bg-ctp-base overflow-hidden">
      <AnimatePresence mode="wait">
        {currentTab && (
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {currentTab.loading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-16 h-16 border-4 border-ctp-blue 
                           border-t-transparent rounded-full"
                />
              </div>
            ) : currentTab.url ? (
              <iframe
                src={currentTab.url}
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-4">New Tab</h1>
                <p className="text-ctp-subtext0">
                  Enter a URL or search term above to get started
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
