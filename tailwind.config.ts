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
          muted: "#6B7280",
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
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.1)",
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
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        liveBannerPulse: {
          "0%, 100%": { boxShadow: "0 10px 25px -5px rgba(249,94,46,0.25)" },
          "50%": { boxShadow: "0 10px 25px -5px rgba(249,94,46,0.45)" },
        },
        // Join button spring press
        joinSpring: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.92)" },
          "60%": { transform: "scale(1.05)" },
          "80%": { transform: "scale(0.98)" },
          "100%": { transform: "scale(1)" },
        },
        // Checkmark draw-in for joined state
        checkDraw: {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
        // Celebration particles on join
        joinCelebrate: {
          "0%": { opacity: "1", transform: "scale(0) translateY(0)" },
          "50%": { opacity: "1", transform: "scale(1) translateY(-12px)" },
          "100%": { opacity: "0", transform: "scale(0.5) translateY(-20px)" },
        },
        // Emoji reaction pop (stronger than generic bounce)
        emojiPop: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.35)" },
          "50%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        // Count number fade-slide
        countSlideIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Nav tap ripple
        navTap: {
          "0%": { transform: "scale(0.92)", opacity: "0.7" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Plus button gentle rotation on hover
        plusInvite: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(90deg)" },
        },
        // Toggle thumb spring
        toggleSpring: {
          "0%": { transform: "translateX(var(--toggle-from)) scale(1)" },
          "40%": { transform: "translateX(var(--toggle-to)) scale(1.1, 0.9)" },
          "70%": { transform: "translateX(var(--toggle-to)) scale(0.95, 1.05)" },
          "100%": { transform: "translateX(var(--toggle-to)) scale(1)" },
        },
        // Gentle idle bounce for empty states
        gentleBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        // Distance number tick
        numberTick: {
          "0%": { opacity: "0.4", transform: "translateY(var(--tick-dir, -6px))" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Landing page — mesh gradient blob float
        meshFloat: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -25px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.97)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        // Landing page — phone mockup bob
        phoneFloat: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0)" },
        },
        // Landing page — hero text clip-path reveal
        textReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0 0)", opacity: "1" },
        },
        // Landing page — hero gradient colour shift
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "live-pulse": "pulse 2s ease-in-out infinite",
        pop: "pop 300ms ease-out",
        "emoji-bounce": "bounce 200ms ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.4s ease-out both",
        marquee: "marquee 20s linear infinite",
        "live-banner-pulse": "liveBannerPulse 3s ease-in-out infinite",
        "join-spring": "joinSpring 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "check-draw": "checkDraw 350ms ease-out forwards",
        "join-celebrate": "joinCelebrate 600ms ease-out forwards",
        "emoji-pop": "emojiPop 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "count-slide-in": "countSlideIn 200ms ease-out",
        "nav-tap": "navTap 250ms ease-out",
        "number-tick": "numberTick 200ms ease-out",
        "gentle-bounce": "gentleBounce 2s ease-in-out infinite",
        "mesh-float": "meshFloat 18s ease-in-out infinite",
        "phone-float": "phoneFloat 6s ease-in-out infinite",
        "text-reveal": "textReveal 0.8s ease-out both",
        "gradient-shift": "gradientShift 20s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
