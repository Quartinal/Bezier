import { useEffect } from "react";

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
}

export function useShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        shortcut =>
          shortcut.key.toLowerCase() === e.key.toLowerCase() &&
          !!shortcut.ctrl === (e.ctrlKey || e.metaKey) &&
          !!shortcut.shift === e.shiftKey &&
          !!shortcut.alt === e.altKey,
      );

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.handler();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
