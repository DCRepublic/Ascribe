// tailwind.config.js
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-sans)"],
      },
      colors: {
        accent: {
          500: "#f46523" /* this is our accent */,
        },
      },
      // I want to add some custom rules for column-rule aka column borders here so that we can have a visible border between
      // the sidebar and the rest of the page, but I don't know how to properly code custom rules. My last attempt crashed the site
    },
  },
  darkMode: "class",
  keyframes: {
    appear: {
      "0%": {
        opacity: "0",
      },
      "100%": {
        opacity: "1",
      },
    },
  },
  animation: {
    appear: "appear 5s ease-in-out",
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "rgb(240, 235, 248)", // main background
            background_navbar: "#B594B6", // navbar
            sidebar_background: "#B594B6", // sidebar
            background_layer: "#31425E", // unsure
            foreground: "#2F344B", // text colors
            light_foreground: "#F1F1F1", // unsure
            primary: {
              DEFAULT: "#9FADBC", // unsure
              foreground: "#31425E", // unsure
            },
            secondary: "#B594B6", // affects the Get Started Button and other highlighted buttons
            focus: "#3E5641", // unsure
          },
        },
        dark: {
          colors: {
            background: "#0a313b", // affects main section background, below navbar
            background_navbar: "#2F232B", // obviously affects the navbar background
            sidebar_background: "#2F232B", // affects the colors of the sidebar
            background_layer: "#2C2C33", // seemingly affects nothing
            foreground: "#D9D9D9", // affects text colors throughout the page
            light_foreground: "#181C25", // no effect
            primary: {
              DEFAULT: "#9FADBC", // no effect
              foreground: "#1D2125", // no effect
            },
            secondary: "#AD9BAA", // for some reason, changes the coloring of the "HOME" txt in the navbar
            focus: "#F46523", // also seems to have no effect
          },
        },
      },
    }),
  ],
};
