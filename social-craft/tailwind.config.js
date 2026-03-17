// ============================================
// FILE: tailwind.config.js
// PURPOSE: Defines Social Craft design tokens and Tailwind content scanning
// USES: src app/components/lib files for utility class generation
// ============================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1d4ed8",
          secondary: "#2563eb",
        },
        ink: "#0b1220",
        gray: {
          body: "#334155",
          muted: "#64748b",
        },
        bg: "#f2f4f7",
        white: "#ffffff",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        serif: ["Fraunces", "serif"],
      },
      borderRadius: {
        card: "22px",
        btn: "14px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 18px 44px rgba(15, 23, 42, 0.10)",
        card2: "0 26px 78px rgba(15, 23, 42, 0.14)",
      },
    },
  },
  plugins: [],
};
