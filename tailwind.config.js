/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#37ec13',
        background: {
          light: '#f6f8f6',
          dark: '#132210',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e311a',
        },
        text: {
          primary: '#121811',
          secondary: '#688961',
        },
        border: {
          light: '#dde6db',
          dark: '#2a4425',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
