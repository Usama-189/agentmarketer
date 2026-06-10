/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16241C",
        awning: "#1F6B47",
        awningdark: "#174F35",
        mint: "#EAF4EE",
        amber: "#E8A33D",
        paper: "#FFFFFF"
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "sans-serif"],
        body: ['"Public Sans"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
