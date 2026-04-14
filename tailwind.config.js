/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        garden: {
          green: '#86efac',
          emerald: '#10b981',
          sage: '#9ca3af',
          rose: '#fda4af',
          lavender: '#c4b5fd',
          sky: '#7dd3fc',
        },
        soft: {
          lavender: '#e8e3f3',
          mint: '#d4f1e8',
          peach: '#ffe5d9',
          cream: '#fff8f0',
          rose: '#ffe4e6',
          sky: '#e0f2fe',
        },
        /* Warm light surfaces + deep ink night (not flat grey) */
        sand: {
          50: '#faf7f2',
          100: '#f3ece3',
          200: '#e5d9c8',
          300: '#d4c4a8',
        },
        night: {
          950: '#060a12',
          900: '#0a1020',
          800: '#0f172a',
          700: '#152238',
          600: '#1c2d4a',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(14, 165, 233, 0.35)',
        'glow-dark': '0 0 28px -8px rgba(56, 189, 248, 0.25)',
        card: '0 4px 24px -4px rgba(28, 25, 23, 0.08)',
        'card-dark': '0 8px 32px -8px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float-soft': 'floatSoft 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

