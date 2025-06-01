// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9AC9DE",
        "primary-foreground": "#ffffff",
        secondary: "#1F8ECD",
        "secondary-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
};
