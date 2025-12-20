// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          teal: '#22d3ee',
          mint: '#14f1d9',
          amber: '#f59e0b',
          rose: '#fb7185',
          slate: '#0f172a',
          night: '#0b0f1a',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Manrope', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.18), 0 0 40px rgba(251, 113, 133, 0.12)',
      },
    },
  },
  plugins: [],
}
