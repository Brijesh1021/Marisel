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
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      dropShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.4)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-rose': '0 0 15px rgba(244, 63, 94, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
