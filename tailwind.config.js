/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{js,ts,jsx,tsx}'
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

