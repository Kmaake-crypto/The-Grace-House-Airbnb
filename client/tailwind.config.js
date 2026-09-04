/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E31C5F',
          dark:    '#C41854',
          light:   '#FF385C',
        },
        teal: {
          DEFAULT: '#016764',
          dark:    '#001E1E',
          mid:     '#014848',
          muted:   '#005958',
          light:   '#00595880',
        },
      },
      backgroundImage: {
        'teal-gradient':   'linear-gradient(135deg, #001E1E 0%, #016764 100%)',
        'teal-gradient-r': 'linear-gradient(135deg, #016764 0%, #001E1E 100%)',
      },
    },
  },
  plugins: [],
}
