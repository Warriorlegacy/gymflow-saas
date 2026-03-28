module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: "#f1f8f4",
          100: "#dcefe2",
          200: "#badfc6",
          300: "#8cc8a2",
          400: "#57aa78",
          500: "#338d5a",
          600: "#256f46",
          700: "#1f5939",
          800: "#1a4730",
          900: "#173b28",
          950: "#0d2418"
        },
        surface: {
          50: "#f8faf9",
          100: "#f1f5f3",
          200: "#e8ede9",
        }
      },
      boxShadow: {
        soft: "0 2px 16px rgba(22, 59, 40, 0.06)",
        card: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(22, 59, 40, 0.06)",
        "card-hover": "0 24px 64px -16px rgba(22, 59, 40, 0.14), 0 8px 24px -8px rgba(0, 0, 0, 0.06)",
        glow: "0 0 48px rgba(51, 141, 90, 0.12)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.05)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 20% 50%, rgba(51, 141, 90, 0.12) 0%, transparent 50%)",
        "hero-glow-right": "radial-gradient(circle at 80% 20%, rgba(51, 141, 90, 0.08) 0%, transparent 40%)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    }
  },
  plugins: []
};
