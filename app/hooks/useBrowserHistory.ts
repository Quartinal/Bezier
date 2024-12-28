import { useEffect } from "react";
import { useBrowserStore } from "~/store/browserStore";

export function useBrowserHistory() {
  const { addHistoryEntry, tabs, activeTab } = useBrowserStore();

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab || !currentTab.url || currentTab.private) return;

    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      if (duration >= 1000) {
        // Only record if spent more than 1 second
        addHistoryEntry({
          url: currentTab.url,
          title: currentTab.title || currentTab.url,
          duration,
        });
      }
    };
  }, [activeTab, addHistoryEntry, tabs]);
}
