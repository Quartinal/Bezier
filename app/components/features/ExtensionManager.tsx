import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExtensionStore } from "~/store/extensionStore";
import type { BrowserExtension } from "~/types/extensions";

export function ExtensionManager() {
  const { extensions, uninstallExtension, toggleExtension } =
    useExtensionStore();
  const [selectedExtension, setSelectedExtension] =
    useState<BrowserExtension | null>(null);

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Extensions</h2>
        <button
          onClick={() => setSelectedExtension(null)}
          className="px-4 py-2 bg-ctp-blue text-white rounded"
        >
          Add New Extension
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {extensions.map(extension => (
          <motion.div
            key={extension.id}
            layoutId={extension.id}
            className="p-4 bg-ctp-surface0 rounded"
          >
            <div className="flex items-center gap-3 mb-3">
              {extension.icon && (
                <img
                  src={extension.icon}
                  alt=""
                  className="w-10 h-10 rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{extension.name}</h3>
                <div className="text-sm text-ctp-subtext0">
                  v{extension.version}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExtension(extension.id)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    extension.enabled ? "bg-ctp-blue" : "bg-ctp-surface1"
                  }`}
                >
                  <motion.div
                    animate={{ x: extension.enabled ? 16 : 2 }}
                    className="w-5 h-5 bg-white rounded-full"
                  />
                </button>
                <button
                  onClick={() => setSelectedExtension(extension)}
                  className="p-2 hover:bg-ctp-surface1 rounded"
                >
                  <span className="sr-only">Settings</span>
                  {/* Settings icon */}
                </button>
              </div>
            </div>

            <div className="text-sm text-ctp-subtext0 mb-3">
              {extension.description}
            </div>

            <div className="flex flex-wrap gap-1">
              {extension.permissions.map(permission => (
                <span
                  key={permission}
                  className="px-2 py-1 text-xs bg-ctp-surface1 rounded"
                >
                  {permission}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedExtension && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="w-[600px] bg-ctp-mantle rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">
                {selectedExtension.name} Settings
              </h3>

              {/* Extension settings form */}
              <div className="space-y-4">
                {Object.entries(selectedExtension.settings || {}).map(
                  ([key, value]) => (
                    <div key={key}>
                      <label className="block mb-1 font-medium">{key}</label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={() => {
                          // Update extension settings
                        }}
                        className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedExtension(null)}
                  className="px-4 py-2 bg-ctp-surface1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => uninstallExtension(selectedExtension.id)}
                  className="px-4 py-2 bg-ctp-red text-white rounded"
                >
                  Uninstall
                </button>
                <button
                  onClick={() => {
                    // Save extension settings
                    setSelectedExtension(null);
                  }}
                  className="px-4 py-2 bg-ctp-blue text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
