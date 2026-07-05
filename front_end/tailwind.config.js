/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight:{
        '14':'3.5rem',
        '24': '6rem'
      },
      boxShadow: {
        'input': 'inset 0 1px 1px rgba(0,0,0,.075)',
        'input-focus':'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(51,102,153,.6)'
      },
    },
  },
  plugins: [],
}

