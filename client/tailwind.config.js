/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#1C1D21',
      },
      textColor: {
        'secondary': '#838488',
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false }
}

