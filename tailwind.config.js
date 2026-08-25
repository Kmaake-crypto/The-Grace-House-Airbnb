/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E31C5F',
          dark: '#C41854',
          light: '#FF385C',
        },
        teal: {
          DEFAULT: '#016764',  // primary teal from palette
          dark:    '#001E1E',  // deep near-black teal
          mid:     '#014848',  // #014848 midpoint
          muted:   '#005958',  // #005958 softer teal
          light:   '#00595880', // 50% opacity teal for subtle fills
        },
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #001E1E 0%, #016764 100%)',
        'teal-gradient-r': 'linear-gradient(135deg, #016764 0%, #001E1E 100%)',
      },
    },
  },
  plugins: [],
}