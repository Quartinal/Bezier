/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Tab } from "./browser";

export interface BrowserExtension {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  icon: string;
  background?: boolean;
  contentScripts: {
    matches: string[];
    js: string[];
    css: string[];
  }[];
  manifest: Record<string, any>;
  settings?: Record<string, any>;
  storageData?: Record<string, any>;
}

export interface ExtensionMessage {
  type: string;
  payload: any;
  extensionId: string;
  tabId?: string;
}

export interface ExtensionAPI {
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    remove: (key: string) => Promise<void>;
    clear: () => Promise<void>;
  };
  tabs: {
    query: (queryInfo: any) => Promise<Tab[]>;
    create: (createProperties: any) => Promise<Tab>;
    remove: (tabId: string) => Promise<void>;
    update: (tabId: string, updateProperties: any) => Promise<Tab>;
  };
  runtime: {
    sendMessage: (message: ExtensionMessage) => Promise<any>;
    onMessage: {
      addListener: (callback: (message: ExtensionMessage) => void) => void;
      removeListener: (callback: (message: ExtensionMessage) => void) => void;
    };
  };
}
