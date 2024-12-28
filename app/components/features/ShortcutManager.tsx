import { useState } from "react";
import { motion } from "framer-motion";
import type { KeyboardShortcut } from "~/types/browser";

export function ShortcutManager() {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [recording, setRecording] = useState<string | null>(null);
  const [editingShortcut, setEditingShortcut] =
    useState<KeyboardShortcut | null>(null);

  const categories = [
    "Navigation",
    "Tabs",
    "Bookmarks",
    "History",
    "Tools",
    "Custom",
  ];

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
        <button
          onClick={() =>
            setEditingShortcut({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              keys: [],
              action: "",
              category: "Custom",
              custom: true,
            })
          }
          className="px-4 py-2 bg-ctp-blue text-white rounded"
        >
          Add Custom Shortcut
        </button>
      </div>

      <div className="space-y-6">
        {categories.map(category => {
          const categoryShortcuts = shortcuts.filter(
            s => s.category === category,
          );

          return (
            <div key={category}>
              <h3 className="font-medium mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map(shortcut => (
                  <motion.div
                    key={shortcut.id}
                    layoutId={shortcut.id}
                    className="flex items-center justify-between p-3 bg-ctp-surface0 rounded"
                  >
                    <div>
                      <div className="font-medium">{shortcut.name}</div>
                      <div className="text-sm text-ctp-subtext0">
                        {shortcut.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {recording === shortcut.id ? (
                        <div className="px-3 py-2 bg-ctp-surface1 rounded text-sm">
                          Press your shortcut...
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-ctp-surface1 rounded text-sm"
                            >
                              {key}
                            </span>
                          ))}
                        </div>
                      )}

                      {shortcut.custom && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRecording(shortcut.id)}
                            className="p-2 hover:bg-ctp-surface1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setShortcuts(
                                shortcuts.filter(s => s.id !== shortcut.id),
                              );
                            }}
                            className="p-2 hover:bg-ctp-surface1 rounded text-ctp-red"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editingShortcut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-[500px] bg-ctp-mantle rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {editingShortcut.id ? "Edit Shortcut" : "New Shortcut"}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="shortcut-name"
                  className="block mb-1 font-medium"
                >
                  Name
                </label>
                <input
                  id="shortcut-name"
                  type="text"
                  value={editingShortcut.name}
                  onChange={e =>
                    setEditingShortcut({
                      ...editingShortcut,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="shortcut-description"
                  className="block mb-1 font-medium"
                >
                  Description
                </label>
                <input
                  id="shortcut-description"
                  type="text"
                  value={editingShortcut.description}
                  onChange={e =>
                    setEditingShortcut({
                      ...editingShortcut,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="shortcut-action"
                  className="block mb-1 font-medium"
                >
                  Action
                </label>
                <input
                  id="shortcut-action"
                  type="text"
                  value={editingShortcut.action}
                  onChange={e =>
                    setEditingShortcut({
                      ...editingShortcut,
                      action: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="shortcut-keys"
                  className="block mb-1 font-medium"
                >
                  Shortcut
                </label>
                <button
                  id="shortcut-keys"
                  onClick={() => setRecording(editingShortcut.id)}
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded text-left"
                >
                  {editingShortcut.keys.length > 0
                    ? editingShortcut.keys.join(" + ")
                    : "Click to record shortcut"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingShortcut(null)}
                className="px-4 py-2 bg-ctp-surface1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingShortcut.id) {
                    setShortcuts(
                      shortcuts.map(s =>
                        s.id === editingShortcut.id ? editingShortcut : s,
                      ),
                    );
                  } else {
                    setShortcuts([...shortcuts, editingShortcut]);
                  }
                  setEditingShortcut(null);
                }}
                className="px-4 py-2 bg-ctp-blue text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
