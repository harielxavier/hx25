/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#B68C8C',
        rose: {
          light: '#FDF2F4',
          DEFAULT: '#DB7F8E',
          dark: '#B68C8C'
        },
        cream: '#F8F5E6',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif']
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(to right, #FDF2F4, #DB7F8E)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      }
    },
  },
  plugins: [],
};