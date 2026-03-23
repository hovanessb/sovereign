import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Brand Colors ──────────────────────────────────────────────────────
      colors: {
        obsidian: {
          DEFAULT: "#050505",
          50: "#0d0d0d",
          100: "#111111",
          200: "#1a1a1a",
          300: "#222222",
          400: "#2e2e2e",
        },
        charcoal: {
          DEFAULT: "#1c1c1c",
          light: "#2a2a2a",
          muted: "#3d3d3d",
        },
        gold: {
          // liquid metal spectrum
          whisper: "#c8a96e",
          soft: "#d4a853",
          DEFAULT: "#c9922a",
          warm: "#e2a840",
          bright: "#f0c060",
          forge: "#ff9500",
          molten: "#ff6a00",
        },
        ash: "#c8c8c8",
        ivory: "#ece8e1",
        smoke: "#2d2d2d",
      },

      // ─── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        spectral: ["var(--font-spectral)", "Georgia", "serif"],
        geist: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "display": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "1.05" }],
        "headline": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1" }],
      },

      // ─── Letter Spacing ─────────────────────────────────────────────────────
      letterSpacing: {
        sovereign: "0.2em",   // brand name / hero
        ultrawide: "0.35em",  // subheading / taglines
        vault: "0.15em",  // section labels
        price: "0.05em",  // product prices
      },

      // ─── Gradients & Backgrounds ────────────────────────────────────────────
      backgroundImage: {
        "gold-linear": "linear-gradient(135deg, #c8a96e 0%, #f0c060 40%, #c9922a 70%, #8b5e1a 100%)",
        "gold-radial": "radial-gradient(ellipse at center, #e2a840 0%, #c9922a 45%, #050505 100%)",
        "forge-glow": "radial-gradient(ellipse at bottom, rgba(255,106,0,0.25) 0%, transparent 65%)",
        "metal-sheen": "linear-gradient(90deg, transparent 0%, rgba(201,146,42,0.15) 50%, transparent 100%)",
        "obsidian-fade": "linear-gradient(to bottom, transparent 0%, #050505 100%)",
        "edge-vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.85) 100%)",
      },

      // ─── Spacing & Sizing ───────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      // ─── Border & Ring ──────────────────────────────────────────────────────
      borderColor: {
        "gold-dim": "rgba(201,146,42,0.3)",
        "gold-subtle": "rgba(201,146,42,0.15)",
        "gold-bright": "rgba(240,192,96,0.7)",
      },
      ringColor: {
        gold: "#c9922a",
      },

      // ─── Box Shadow ─────────────────────────────────────────────────────────
      boxShadow: {
        "gold-sm": "0 0 12px rgba(201,146,42,0.25)",
        "gold-md": "0 0 30px rgba(201,146,42,0.35)",
        "gold-lg": "0 0 60px rgba(201,146,42,0.4), 0 0 120px rgba(201,146,42,0.15)",
        "forge": "0 0 80px rgba(255,106,0,0.45), 0 0 160px rgba(201,146,42,0.2)",
        "inset-gold": "inset 0 1px 0 rgba(201,146,42,0.4)",
        "card": "0 4px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      },

      // ─── Animations ─────────────────────────────────────────────────────────
      keyframes: {
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "forge-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0% 0 0)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "forge-pulse": "forge-pulse 4s ease-in-out infinite",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "reveal": "reveal 1.2s cubic-bezier(0.77,0,0.175,1) forwards",
        "border-flow": "border-flow 4s linear infinite",
      },

      // ─── Transition Timing ──────────────────────────────────────────────────
      transitionTimingFunction: {
        "expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic": "cubic-bezier(0.77, 0, 0.175, 1)",
      },

      // ─── Z-Index ────────────────────────────────────────────────────────────
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
