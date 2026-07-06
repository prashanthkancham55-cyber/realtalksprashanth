import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        hero:    ['Playfair Display', 'serif'],
      },
      colors: {
        navy: {
          950: '#030e1f',
          900: '#061326',
          800: '#0B1E3A',
          700: '#102448',
          600: '#163057',
          500: '#1e3a6e',
        },
        gold: {
          300: '#FFF0A0',
          400: '#FFD740',
          500: '#E0C040',
          600: '#C4A020',
          700: '#A08010',
          800: '#7A6008',
        },
        brand: {
          purple:       '#7C3AED',
          'purple-light': '#a78bfa',
          'purple-dark':  '#5b21b6',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #FFD740 0%, #E0C040 50%, #C4A020 100%)',
        'purple-gradient': 'linear-gradient(135deg, #a78bfa 0%, #7C3AED 100%)',
        'navy-gradient':   'linear-gradient(180deg, #030e1f 0%, #061326 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)'  },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer:          'shimmer 2s infinite',
        float:            'float 3.5s ease-in-out infinite',
      },
      boxShadow: {
        gold:      '0 0 40px rgba(224,192,64,0.22)',
        'gold-lg': '0 0 80px rgba(224,192,64,0.32)',
        purple:    '0 0 40px rgba(124,58,237,0.2)',
        'purple-lg':'0 0 80px rgba(124,58,237,0.25)',
        glass:     '0 8px 32px rgba(0,0,0,0.45)',
        'glass-lg':'0 20px 60px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
