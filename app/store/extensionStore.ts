import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { BrowserExtension, ExtensionMessage } from "~/types/extensions";

interface ExtensionState {
  extensions: BrowserExtension[];
  messageQueue: ExtensionMessage[];

  installExtension: (
    extension: Omit<BrowserExtension, "id" | "enabled">,
  ) => void;
  uninstallExtension: (id: string) => void;
  toggleExtension: (id: string) => void;
  updateExtension: (id: string, updates: Partial<BrowserExtension>) => void;

  sendMessage: (message: Omit<ExtensionMessage, "id">) => void;
  processMessage: (message: ExtensionMessage) => void;
  clearMessages: () => void;

  updateExtensionStorage: (
    extensionId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
  ) => void;
  clearExtensionStorage: (extensionId: string) => void;
}

export const useExtensionStore = create<ExtensionState>()(
  persist(
    set => ({
      extensions: [],
      messageQueue: [],

      installExtension: extension =>
        set(state => ({
          extensions: [
            ...state.extensions,
            {
              ...extension,
              id: uuidv4(),
              enabled: true,
              settings: {},
              storageData: {},
            },
          ],
        })),

      uninstallExtension: id =>
        set(state => ({
          extensions: state.extensions.filter(ext => ext.id !== id),
        })),

      toggleExtension: id =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, enabled: !ext.enabled } : ext,
          ),
        })),

      updateExtension: (id, updates) =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, ...updates } : ext,
          ),
        })),

      sendMessage: message =>
        set(state => ({
          messageQueue: [...state.messageQueue, { ...message, id: uuidv4() }],
        })),

      processMessage: message =>
        set(state => ({
          messageQueue: state.messageQueue.filter(
            msg => msg.extensionId !== message.extensionId,
          ),
        })),

      clearMessages: () => set({ messageQueue: [] }),

      updateExtensionStorage: (extensionId, data) =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === extensionId
              ? { ...ext, storageData: { ...ext.storageData, ...data } }
              : ext,
          ),
        })),

      clearExtensionStorage: extensionId =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === extensionId ? { ...ext, storageData: {} } : ext,
          ),
        })),
    }),
    {
      name: "bezier-extension-storage",
    },
  ),
);
