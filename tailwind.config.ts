import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cross-gold": "#D4A853",
        "accent-green": "#15803D",
        "accent-blue": "#60A5FA",
        "accent-purple": "#A78BFA",
        surface: "#0D0D0D",
        "surface-2": "#141414",
        "surface-3": "#1A1A1A",
        "text-primary": "#F0EDE8",
        "text-muted": "#9CA3AF",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(212, 168, 83, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(212, 168, 83, 0.6)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        crossGlow: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 8px rgba(212, 168, 83, 0.6))",
          },
          "50%": {
            filter: "drop-shadow(0 0 20px rgba(212, 168, 83, 0.9))",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "cross-glow": "crossGlow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 168, 83, 0.15) 0%, rgba(212, 168, 83, 0.05) 40%, transparent 70%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(212, 168, 83, 0.1) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
