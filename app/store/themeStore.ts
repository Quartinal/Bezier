import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Theme, ThemePreset } from "~/types/themes";

interface ThemeState {
  currentTheme: Theme;
  customThemes: Theme[];
  presets: ThemePreset[];

  setTheme: (theme: Theme) => void;
  addCustomTheme: (theme: Omit<Theme, "id">) => void;
  updateCustomTheme: (id: string, updates: Partial<Theme>) => void;
  removeCustomTheme: (id: string) => void;
  addPreset: (preset: Omit<ThemePreset, "id">) => void;
  removePreset: (id: string) => void;
}

const defaultTheme: Theme = {
  id: "default",
  name: "Default",
  colors: {
    base: "#24273a",
    mantle: "#1e2030",
    crust: "#181926",
    surface0: "#363a4f",
    surface1: "#494d64",
    surface2: "#5b6078",
    text: "#cad3f5",
    subtext0: "#a5adcb",
    subtext1: "#b8c0e0",
    overlay0: "#6e738d",
    overlay1: "#8087a2",
    overlay2: "#939ab7",
    blue: "#8aadf4",
    lavender: "#b7bdf8",
    sapphire: "#7dc4e4",
    sky: "#91d7e3",
    teal: "#8bd5ca",
    green: "#a6da95",
    yellow: "#eed49f",
    peach: "#f5a97f",
    maroon: "#ee99a0",
    red: "#ed8796",
    mauve: "#c6a0f6",
    pink: "#f5bde6",
    flamingo: "#f0c6c6",
    rosewater: "#f4dbd6",
  },
  fonts: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      currentTheme: defaultTheme,
      customThemes: [],
      presets: [],

      setTheme: theme => set({ currentTheme: theme }),

      addCustomTheme: theme =>
        set(state => ({
          customThemes: [...state.customThemes, { ...theme, id: uuidv4() }],
        })),

      updateCustomTheme: (id, updates) =>
        set(state => ({
          customThemes: state.customThemes.map(theme =>
            theme.id === id ? { ...theme, ...updates } : theme,
          ),
        })),

      removeCustomTheme: id =>
        set(state => ({
          customThemes: state.customThemes.filter(theme => theme.id !== id),
        })),

      addPreset: preset =>
        set(state => ({
          presets: [...state.presets, { ...preset, id: uuidv4() }],
        })),

      removePreset: id =>
        set(state => ({
          presets: state.presets.filter(preset => preset.id !== id),
        })),
    }),
    {
      name: "bezier-theme-storage",
    },
  ),
);
