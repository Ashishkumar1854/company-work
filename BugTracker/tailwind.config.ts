import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d7e6ff",
          500: "#2d6cdf",
          600: "#1f57bb",
          700: "#184799"
        }
      }
    }
  },
  plugins: []
};

export default config;
