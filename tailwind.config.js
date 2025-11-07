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
        champagneRose: '#E7C2C2', // Added champagne rosé
        cream: '#F8F5E6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(to right, #FDF2F4, #DB7F8E)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      }
    },
  },
  plugins: [],
};
