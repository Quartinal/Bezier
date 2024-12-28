import { useState, useEffect } from "react";
import { useThemeStore } from "~/store/themeStore";

export function useThemeDetector() {
  const { setTheme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      // Update theme based on system preference
      if (e.matches) {
        setTheme(
          useThemeStore.getState().customThemes.find(t => t.name === "Dark") ||
            useThemeStore.getState().currentTheme,
        );
      } else {
        setTheme(
          useThemeStore.getState().customThemes.find(t => t.name === "Light") ||
            useThemeStore.getState().currentTheme,
        );
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [setTheme]);

  return isDark;
}
