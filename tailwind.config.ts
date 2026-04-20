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
        kith: {
          orange: "#F95E2E",
          black: "#1B1C1F",
          "gray-light": "#BFCCD9",
          white: "#FFFFFF",
          surface: "#F6F7F8",
          text: "#2D2D2D",
          muted: "#8A8F99",
        },
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        pill: "100px",
        input: "12px",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0" },
        },
        pop: {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        bounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.4)" },
        },
      },
      animation: {
        "live-pulse": "pulse 2s ease-in-out infinite",
        pop: "pop 300ms ease-out",
        "emoji-bounce": "bounce 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
