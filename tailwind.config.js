/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#111422',
        'dark-card': '#1a1e32',
        'dark-border': '#242a47',
        'dark-text': '#939cc8',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 