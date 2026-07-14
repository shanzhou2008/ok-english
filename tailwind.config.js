/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C5CFC",
          light: "#9D85FD",
          dark: "#6344E8",
        },
        secondary: { DEFAULT: "#FF6B9D" },
        accent: { DEFAULT: "#00C9A7" },
        warm: { DEFAULT: "#FFA94D" },
        success: { DEFAULT: "#00B894" },
        info: { DEFAULT: "#4D9DE0" },
        cream: "#F0F4FF",
        "card-bg": "#FFFFFF",
        "text-primary": "#1A1A2E",
        "text-secondary": "#6B7280",
        gold: "#FFD700",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      fontFamily: {
        rounded: ['"Nunito"', '"PingFang SC"', '"Microsoft YaHei"', "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(124,92,252,0.08)",
        "card-hover": "0 8px 32px rgba(124,92,252,0.12)",
        button: "0 4px 14px rgba(124,92,252,0.3)",
        soft: "0 2px 8px rgba(0,0,0,0.04)",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
