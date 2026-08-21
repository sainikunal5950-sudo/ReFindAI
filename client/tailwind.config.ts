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
        // Backgrounds
        "bg-primary": "#0A0A0F",
        "bg-secondary": "#0D0F14",
        "bg-card": "#12141C",
        "bg-card-2": "#161925",
        // Accents
        "electric-blue": "#3B82F6",
        "electric-blue-dark": "#2563EB",
        "cyan-glow": "#06B6D4",
        // Text
        "text-primary": "#F5F5F7",
        "text-secondary": "#A1A1AA",
        // Semantic
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
        // Borders
        "border-subtle": "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "blue-glow": "0 0 20px rgba(59,130,246,0.35)",
        "blue-glow-lg": "0 0 40px rgba(59,130,246,0.45)",
        "cyan-glow": "0 0 20px rgba(6,182,212,0.35)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(135deg, #3B82F6, #06B6D4)",
        "blue-gradient-dark": "linear-gradient(135deg, #2563EB, #0891B2)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      },
      backdropBlur: {
        xs: "4px",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-28px) scale(1.04)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
