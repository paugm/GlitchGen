module.exports = {
  content: ["./public/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#f0f4f8",
        "card-bg": "#ffffff",
        "header-bg": "#f8fafc",
        border: "#e2e8f0",
        "sidebar-bg": "#2c3e50",
        "sidebar-text": "#ecf0f1",
        indigo: {
          600: "var(--theme-color)",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        sidebar: "0 0 15px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        rainbow: "rainbow 5s ease infinite",
        "glitch-1": "glitch-1 3s infinite linear alternate-reverse",
        "glitch-2": "glitch-2 2.5s infinite linear alternate-reverse",
      },
      backgroundSize: {
        "600%": "600% 600%",
      },
      gradientColorStops: (theme) => ({
        indigo: {
          600: "#4f46e5",
          800: "#3730a3",
        },
      }),
    },
  },
  plugins: [],
};
