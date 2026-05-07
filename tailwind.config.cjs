/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          black: "#050505",
          dark: "#0a0a0a",
          surface: "#121212",
          accent: "#00f2ff", // Cyan
          purple: "#7000ff",
          blue: "#0066ff",
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f2ff, 0 0 10px #00f2ff' },
          '100%': { boxShadow: '0 0 20px #00f2ff, 0 0 40px #00f2ff' },
        }
      }
    },
  },
  plugins: [],
}
