/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2D6A4F',
        'brand-green': '#1B4332',
        background: {
          light: '#F9F8F3',
          dark: '#132210',
        },
        'earthy-sage': '#E7EBE0',
        'card-accent': '#F1F2EE',
        surface: {
          light: '#ffffff',
          dark: '#1e311a',
        },
        text: {
          main: '#1B4332',
          secondary: '#4A5D54',
        },
        border: {
          light: '#dde6db',
          dark: '#2a4425',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
