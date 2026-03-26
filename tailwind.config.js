module.exports = {
  content: [
    "./apps/web/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
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
          900: "#173b28"
        }
      },
      boxShadow: {
        soft: "0 20px 80px rgba(22, 59, 40, 0.12)"
      }
    }
  },
  plugins: []
};

