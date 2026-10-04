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
        paper: {
          light: "#FFFDF9",
          base: "#FFF8E7",
          dark: "#F7F1E3",
          lines: "#E5DEC9",
        },
        ink: {
          navy: "#1F2937",
          brown: "#6B4F3A",
          muted: "#64748B",
        },
        accent: {
          mustard: "#F4B942",
          coral: "#FF6B6B",
          sage: "#9DC08B",
          sky: "#7DD3FC",
          terminal: "#34D399",
        },
        darkbg: {
          base: "#0B1120",
          card: "#131C31",
          border: "#1E293B",
          subtle: "#1E2A44",
        },
      },
      fontFamily: {
        hand: ["var(--font-caveat)", "cursive"],
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        pixel: ["var(--font-press-start)", "monospace"],
      },
      boxShadow: {
        scrapbook: "2px 4px 16px rgba(0, 0, 0, 0.10), 1px 2px 4px rgba(0, 0, 0, 0.05)",
        polaroid: "3px 8px 24px -4px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        sticky: "2px 8px 20px rgba(0,0,0,0.16), inset 0 -2px 4px rgba(0,0,0,0.06)",
        sticker: "0 4px 8px rgba(0, 0, 0, 0.12)",
        diecut: "0 0 0 3px #ffffff, 0 4px 10px rgba(0,0,0,0.18)",
        card3d: "0 20px 40px -15px rgba(0,0,0,0.3)",
      },
      animation: {
        "float-slow": "floatSlow 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "tape-wobble": "tapeWobble 6s ease-in-out infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        tapeWobble: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
