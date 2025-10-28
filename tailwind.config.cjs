module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0b0d0f",
          2: "#0f1113",
          3: "#121416"
        },
        gold: {
          DEFAULT: "#FFD54A",
          2: "#E4B83B",
          3: "#B78F23"
        },
        glass: "rgba(255,255,255,0.04)"
      },
      boxShadow: {
        "wet-lg": "0 20px 40px rgba(0,0,0,0.6), inset 0 -2px 8px rgba(255,255,255,0.03)"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px"
      }
    }
  },
  plugins: []
};
