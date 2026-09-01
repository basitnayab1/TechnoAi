import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border)",
        primary: {
          DEFAULT: "#6d5bff",
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#cbc0ff",
          300: "#ab99ff",
          400: "#8a6fff",
          500: "#6d5bff",
          600: "#5238f5",
          700: "#412bd1",
          800: "#3524a3",
          900: "#2c1f7f",
        },
        accent: {
          DEFAULT: "#00e5c7",
          light: "#6ffbe6",
          dark: "#00b39c",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "gradient-shift": "gradient-shift 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer-wave 3.2s linear infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
        breathe: "hotspot-breathe 2.6s ease-in-out infinite",
        "breathe-delayed": "hotspot-breathe 2.2s ease-in-out 0.45s infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "shimmer-wave": {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 18px 2px rgba(109, 91, 255, 0.35)" },
          "50%": { boxShadow: "0 0 32px 8px rgba(0, 229, 199, 0.45)" },
        },
        "hotspot-breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.35" },
          "50%": { transform: "scale(1.42)", opacity: "0.9" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
