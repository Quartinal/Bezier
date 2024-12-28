import type { Config } from "tailwindcss";
import catppuccin from "@catppuccin/tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
    keyframes: {
      fadeIn: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
      fadeOut: {
        from: { opacity: "1" },
        to: { opacity: "0" },
      },
    },
    animation: {
      fadeIn: "fadeIn 200ms ease-out",
      fadeOut: "fadeOut 200ms ease-out",
    },
  },
  plugins: [
    catppuccin({
      prefix: "ctp",
      defaultFlavour: "macchiato",
    }),
  ],
} satisfies Config;
