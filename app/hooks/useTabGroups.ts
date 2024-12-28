import { useState, useEffect } from "react";
import { useBrowserStore } from "~/store/browserStore";

export function useTabGroups() {
  const { tabs } = useBrowserStore();
  const [suggestedGroups, setSuggestedGroups] = useState<
    {
      name: string;
      tabs: string[];
    }[]
  >([]);

  useEffect(() => {
    // Group tabs by domain
    const domains = tabs.reduce(
      (acc, tab) => {
        if (!tab.url) return acc;

        try {
          const domain = new URL(tab.url).hostname;
          if (!acc[domain]) {
            acc[domain] = [];
          }
          acc[domain].push(tab.id);
          return acc;
        } catch {
          return acc;
        }
      },
      {} as Record<string, string[]>,
    );

    // Filter groups with more than 2 tabs
    const suggestions = Object.entries(domains)
      .filter(([, tabs]) => tabs.length >= 2)
      .map(([domain, tabs]) => ({
        name: domain,
        tabs,
      }));

    setSuggestedGroups(suggestions);
  }, [tabs]);

  return { suggestedGroups };
}
