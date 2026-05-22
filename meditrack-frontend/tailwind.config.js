module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], 
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",   
        secondary: "#16A34A", 
        accent: "#0D9488",    
        warning: "#F59E0B",   
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
