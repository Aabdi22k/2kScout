/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        'md2': '1150px',
        'lg2': '1720px' 
      },
    },
  },
  plugins: [],
}