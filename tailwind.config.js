// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          auroraTeal: '#2EC4B6',
          solarAmber: '#F4A261',
          emberRed: '#E76F51',
          mellowGold: '#F6BD60',
          jadeGreen: '#06D6A0',
          abyss: '#0B0F14',
          deepNavy: '#0E1522',
          slate: '#4B5A6F',
          fog: '#9FB0C2',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Sans SC', 'serif'],
        sans: ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 14px rgba(46, 196, 182, 0.35), 0 0 32px rgba(244, 162, 97, 0.25)',
      },
    },
  },
  plugins: [],
}
