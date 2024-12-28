import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { Search, Star, Clock } from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";
import { fuzzySearch } from "~/lib/fuzzySearch";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { tabs, bookmarks, history } = useBrowserStore();

  const commands: CommandItem[] = [
    ...tabs.map(tab => ({
      id: `tab-${tab.id}`,
      title: tab.title,
      subtitle: tab.url,
      icon: tab.favicon && <img src={tab.favicon} className="w-4 h-4" />,
      category: "Tabs",
      action: () => {
        // Switch to tab
      },
    })),
    ...bookmarks.map(bookmark => ({
      id: `bookmark-${bookmark.id}`,
      title: bookmark.title,
      subtitle: bookmark.url,
      icon: <Star size={16} />,
      category: "Bookmarks",
      action: () => {
        // Open bookmark
      },
    })),
    ...history.map(entry => ({
      id: `history-${entry.id}`,
      title: entry.title,
      subtitle: entry.url,
      icon: <Clock size={16} />,
      category: "History",
      action: () => {
        // Open history entry
      },
    })),
  ];

  const filteredCommands = fuzzySearch(commands, search, {
    keys: ["title", "subtitle"],
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed left-1/2 top-[20%] w-[640px] -translate-x-1/2"
          >
            <Command className="rounded-lg border border-ctp-surface0 bg-ctp-mantle shadow-xl">
              <div className="flex items-center border-b border-ctp-surface0 px-3">
                <Search className="h-5 w-5 text-ctp-subtext0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search tabs, bookmarks, history..."
                  className="flex-1 bg-transparent px-2 py-4 outline-none placeholder:text-ctp-subtext0"
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length === 0 && (
                  <div className="py-14 text-center text-sm text-ctp-subtext0">
                    No results found.
                  </div>
                )}

                {["Tabs", "Bookmarks", "History"].map(category => {
                  const categoryCommands = filteredCommands.filter(
                    c => c.category === category,
                  );

                  if (categoryCommands.length === 0) return null;

                  return (
                    <Command.Group
                      key={category}
                      heading={
                        <div className="px-2 py-1 text-xs font-medium text-ctp-subtext0">
                          {category}
                        </div>
                      }
                    >
                      {categoryCommands.map(command => (
                        <Command.Item
                          key={command.id}
                          onSelect={() => {
                            command.action();
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer aria-selected:bg-ctp-surface0"
                        >
                          {command.icon}
                          <div className="flex-1 overflow-hidden">
                            <div className="truncate">{command.title}</div>
                            {command.subtitle && (
                              <div className="text-sm text-ctp-subtext0 truncate">
                                {command.subtitle}
                              </div>
                            )}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
