import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, Key } from "lucide-react";
import type { PasswordEntry } from "~/types/browser";

export function PasswordManager() {
  const [search, _] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(
    null,
  );
  const [showPasswords, setShowPasswords] = useState(false);

  // Mock password entries
  const passwords: PasswordEntry[] = [];

  const filteredPasswords = passwords.filter(
    entry =>
      entry.domain.toLowerCase().includes(search.toLowerCase()) ||
      entry.username.toLowerCase().includes(search.toLowerCase()),
  );

  const strengthColor = (strength: number) => {
    if (strength >= 80) return "bg-ctp-green";
    if (strength >= 60) return "bg-ctp-yellow";
    if (strength >= 40) return "bg-ctp-peach";
    return "bg-ctp-red";
  };

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Password Manager</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2 px-4 py-2 bg-ctp-surface0 rounded"
          >
            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPasswords ? "Hide Passwords" : "Show Passwords"}
          </button>
          <button
            onClick={() =>
              setSelectedEntry({
                id: crypto.randomUUID(),
                domain: "",
                username: "",
                password: "",
                notes: "",
                lastUsed: Date.now(),
                strength: 0,
                tags: [],
                customFields: [],
              })
            }
            className="px-4 py-2 bg-ctp-blue text-white rounded"
          >
            Add Password
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredPasswords.map(entry => (
          <motion.div
            key={entry.id}
            layoutId={entry.id}
            className="flex items-center gap-4 p-4 bg-ctp-surface0 rounded"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-ctp-surface1 rounded">
              <Key size={16} />
            </div>

            <div className="flex-1">
              <div className="font-medium">{entry.domain}</div>
              <div className="text-sm text-ctp-subtext0">{entry.username}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    {showPasswords ? entry.password : "••••••••"}
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(entry.password)
                    }
                    className="p-1 hover:bg-ctp-surface1 rounded"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="w-32 h-1 bg-ctp-surface1 rounded-full mt-1">
                  <div
                    className={`h-full rounded-full ${strengthColor(
                      entry.strength,
                    )}`}
                    style={{ width: `${entry.strength}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedEntry(entry)}
                className="px-3 py-1 hover:bg-ctp-surface1 rounded"
              >
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-[500px] bg-ctp-mantle rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {selectedEntry.id ? "Edit Password" : "New Password"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Domain</label>
                <input
                  type="text"
                  value={selectedEntry.domain}
                  onChange={e =>
                    setSelectedEntry({
                      ...selectedEntry,
                      domain: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  value={selectedEntry.username}
                  onChange={e =>
                    setSelectedEntry({
                      ...selectedEntry,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={selectedEntry.password}
                    onChange={e =>
                      setSelectedEntry({
                        ...selectedEntry,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Notes</label>
                <textarea
                  value={selectedEntry.notes}
                  onChange={e =>
                    setSelectedEntry({
                      ...selectedEntry,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-ctp-surface1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save password logic here
                  setSelectedEntry(null);
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
