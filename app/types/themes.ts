export interface Theme {
  id: string;
  name: string;
  colors: {
    base: string;
    mantle: string;
    crust: string;
    surface0: string;
    surface1: string;
    surface2: string;
    text: string;
    subtext0: string;
    subtext1: string;
    overlay0: string;
    overlay1: string;
    overlay2: string;
    blue: string;
    lavender: string;
    sapphire: string;
    sky: string;
    teal: string;
    green: string;
    yellow: string;
    peach: string;
    maroon: string;
    red: string;
    mauve: string;
    pink: string;
    flamingo: string;
    rosewater: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  customProperties?: Record<string, string>;
  metadata?: {
    author?: string;
    description?: string;
    version?: string;
    createdAt: number;
    updatedAt: number;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  theme: Theme;
  preview?: string;
}
