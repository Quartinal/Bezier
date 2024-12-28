// app/components/Browser.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrowserStore } from "~/store/browserStore";
import { CommandPalette } from "~/components/ui/CommandPalette";
import { ContextMenuProvider } from "~/components/ui/ContextMenu";
import { ModalProvider } from "~/components/ui/Modal";
import { ToastProvider } from "~/components/ui/Toast";
import { useShortcuts } from "~/hooks/useShortcuts";
import { urlUtils } from "~/lib/urlUtils";

export function Browser() {
  const { tabs, activeTab, addTab, closeTab, updateTab, setActiveTab } =
    useBrowserStore();
  const [, setIsAddressBarFocused] = useState(false);

  useShortcuts([
    {
      key: "t",
      ctrl: true,
      handler: () =>
        addTab({
          url: "browser://newtab",
          title: "New Tab",
          pinned: false,
          muted: false,
          loading: false,
          favicon: "",
          private: false,
          hibernated: false,
        }),
    },
    {
      key: "w",
      ctrl: true,
      handler: () => activeTab && closeTab(activeTab),
    },
    {
      key: "l",
      ctrl: true,
      handler: () => setIsAddressBarFocused(true),
    },
  ]);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleUrlSubmit = (url: string) => {
    if (!activeTab) return;

    const normalizedUrl = urlUtils.normalizeUrl(url);
    if (urlUtils.isValidUrl(normalizedUrl)) {
      updateTab(activeTab, { url: normalizedUrl, loading: true });
      // In a real browser, this would handle the actual navigation
    }
  };

  return (
    <ContextMenuProvider>
      <ModalProvider>
        <ToastProvider>
          <div className="h-screen flex flex-col bg-ctp-base">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-ctp-mantle">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-ctp-surface0 rounded"
                >
                  ←
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="p-2 hover:bg-ctp-surface0 rounded"
                >
                  →
                </button>
                <button
                  onClick={() =>
                    currentTab?.url && handleUrlSubmit(currentTab.url)
                  }
                  className="p-2 hover:bg-ctp-surface0 rounded"
                >
                  ↻
                </button>
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentTab?.url || ""}
                  onChange={e =>
                    currentTab &&
                    updateTab(currentTab.id, { url: e.target.value })
                  }
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleUrlSubmit(e.currentTarget.value);
                    }
                  }}
                  onFocus={() => setIsAddressBarFocused(true)}
                  onBlur={() => setIsAddressBarFocused(false)}
                  className="w-full px-4 py-2 bg-ctp-surface0 rounded"
                  placeholder="Enter URL or search..."
                />
                {currentTab?.loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-ctp-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  addTab({
                    url: "browser://newtab",
                    title: "New Tab",
                    pinned: false,
                    muted: false,
                    loading: false,
                    favicon: "",
                    private: false,
                    hibernated: false,
                  })
                }
                className="p-2 hover:bg-ctp-surface0 rounded"
              >
                +
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex items-center gap-1 p-2 bg-ctp-mantle border-t border-ctp-surface0">
              <AnimatePresence initial={false}>
                {tabs.map(tab => (
                  <motion.div
                    key={tab.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-t cursor-pointer
                      ${activeTab === tab.id ? "bg-ctp-surface0" : "hover:bg-ctp-surface0/50"}
                      ${tab.pinned ? "min-w-[auto]" : "min-w-[200px]"}
                    `}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.favicon && (
                      <img src={tab.favicon} alt="" className="w-4 h-4" />
                    )}
                    {!tab.pinned && (
                      <div className="flex-1 truncate">
                        {tab.title || tab.url}
                      </div>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="p-1 hover:bg-ctp-surface1 rounded"
                    >
                      ×
                    </button>

                    {tab.loading && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ctp-surface1">
                        <div className="w-full h-full bg-ctp-blue animate-progress" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
              <AnimatePresence initial={false}>
                {tabs.map(
                  tab =>
                    tab.id === activeTab && (
                      <motion.div
                        key={tab.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                      >
                        {/* In a real browser, this would be an iframe or webview */}
                        <div className="w-full h-full">
                          {tab.url === "browser://newtab" ? (
                            <iframe
                              src="/newtab"
                              title="New Tab"
                              className="w-full h-full"
                            />
                          ) : tab.url === "browser://settings" ? (
                            <iframe
                              src="/settings"
                              title="Settings"
                              className="w-full h-full"
                            />
                          ) : tab.url === "browser://history" ? (
                            <iframe
                              src="/history"
                              title="History"
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ctp-subtext0">
                              This is a demo browser - actual web content cannot
                              be displayed
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>
          </div>

          <CommandPalette />
        </ToastProvider>
      </ModalProvider>
    </ContextMenuProvider>
  );
}
