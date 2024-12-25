// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberpunk: {
          neonPurple: '#9b59b6',
          neonPink: '#ff6ec7',
          neonBlue: '#1f8ef1',
          neonCyan: '#17c0eb',
          darkPurple: '#2c3e50',
          deepBlack: '#000000',
          darkGray: '#34495e',
          background: '#0f0f0f',
        },
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px #ff6ec7, 0 0 20px #1f8ef1, 0 0 30px #17c0eb',
      },
    },
  },
  plugins: [],
}
