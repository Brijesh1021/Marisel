/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#060a17',
          900: '#0b1329',
          850: '#101a38',
          800: '#162347',
          700: '#1e2d59',
          600: '#2b3f75',
        },
        cyan: {
          400: '#38bdf8',
          500: '#06b6d4',
          600: '#0891b2',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
