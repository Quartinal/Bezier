import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Folder, Search, Grid, List } from "lucide-react";
import { useBrowserStore } from "~/store/browserStore";

export function BookmarkManager() {
  const { bookmarks } = useBrowserStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const folders = Array.from(
    new Set(bookmarks.map(b => b.folderId).filter(Boolean)),
  );

  const filteredBookmarks = bookmarks.filter(
    bookmark =>
      (!selectedFolder || bookmark.folderId === selectedFolder) &&
      (bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Bookmarks</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ctp-subtext0"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="pl-10 pr-4 py-2 bg-ctp-surface0 rounded w-64"
            />
          </div>

          <div className="flex rounded bg-ctp-surface0">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-ctp-surface1" : ""}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-ctp-surface1" : ""}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-48">
          <div className="font-medium mb-2">Folders</div>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded
                ${!selectedFolder ? "bg-ctp-surface0" : "hover:bg-ctp-surface0"}`}
            >
              <Star size={16} />
              <span>All Bookmarks</span>
            </button>
            {folders.map(folderId => (
              <button
                key={folderId}
                onClick={() => setSelectedFolder(folderId!)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded
                  ${selectedFolder === folderId ? "bg-ctp-surface0" : "hover:bg-ctp-surface0"}`}
              >
                <Folder size={16} />
                <span>Folder Name</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {view === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredBookmarks.map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  layoutId={bookmark.id}
                  className="p-4 bg-ctp-surface0 rounded"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {bookmark.favicon && (
                      <img src={bookmark.favicon} alt="" className="w-4 h-4" />
                    )}
                    <div className="font-medium truncate">{bookmark.title}</div>
                  </div>
                  <div className="text-sm text-ctp-subtext0 truncate">
                    {bookmark.url}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookmarks.map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  layoutId={bookmark.id}
                  className="flex items-center gap-4 p-3 bg-ctp-surface0 rounded"
                >
                  {bookmark.favicon && (
                    <img src={bookmark.favicon} alt="" className="w-4 h-4" />
                  )}
                  <div>
                    <div className="font-medium">{bookmark.title}</div>
                    <div className="text-sm text-ctp-subtext0">
                      {bookmark.url}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
