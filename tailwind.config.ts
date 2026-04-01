import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#18181B", soft: "#52525B", muted: "#71717A" },
        surface: { DEFAULT: "#FEFDFB", "2": "#F9F8F6", card: "#FFFFFF" },
        accent: { DEFAULT: "#F97316", hover: "#EA580C", light: "#FFF7ED", border: "#FDBA74" },
        sky: "#0EA5E9",
        border: { DEFAULT: "#E4E4E7", strong: "#D4D4D8" },
        protocol: {
          adcp: { bg: "#dbeafe", text: "#1d4ed8" },
          mcp: { bg: "#d1fae5", text: "#065f46" },
          ucp: { bg: "#fef3c7", text: "#92400e" },
          artf: { bg: "#fce7f3", text: "#9d174d" },
          a2a: { bg: "#ede9fe", text: "#5b21b6" },
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "serif"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
