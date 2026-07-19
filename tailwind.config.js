/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2ff',
          100: '#dde5f9',
          200: '#bccdf3',
          300: '#8aaae9',
          400: '#5580db',
          500: '#3461cc',
          600: '#2448b0',
          700: '#1e3a8f',
          800: '#0d1f5c',
          900: '#050b18',
          950: '#020810',
        },
        gold: {
          50:  '#fffde7',
          100: '#fff9c4',
          200: '#fff176',
          300: '#ffe834',
          400: '#f0c040',
          500: '#d4af37',
          600: '#c09b2d',
          700: '#9e7a1e',
          800: '#7c5d12',
          900: '#5a420a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f0c040, #d4af37)',
        'navy-gradient': 'linear-gradient(180deg, #020810 0%, #050b18 50%, #0d1630 100%)',
      },
    },
  },
  plugins: [],
};
