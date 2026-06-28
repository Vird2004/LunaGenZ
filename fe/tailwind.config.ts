import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        foreground: "#FFFFFF",
        primary: "#2D1B4E",
        accent: "#FFD700",
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at bottom, #2D1B4E 0%, #0B0F19 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
