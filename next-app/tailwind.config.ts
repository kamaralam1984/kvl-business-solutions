import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        bg2: 'rgb(var(--bg-2) / <alpha-value>)',
        bg3: 'rgb(var(--bg-3) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        text2: 'rgb(var(--text-2) / <alpha-value>)',
        primary: { DEFAULT: '#2563eb', 600: '#1d4ed8', 400: '#3b82f6' },
        accent: { DEFAULT: '#f97316', 600: '#ea580c' },
        cyan: { DEFAULT: '#06b6d4', 600: '#0891b2' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui'],
        display: ['var(--font-poppins)', 'system-ui'],
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        'grad-orange': 'linear-gradient(135deg, #f97316, #ea580c)',
        'grad-hero': 'linear-gradient(90deg, #3b82f6, #06b6d4, #22d3ee)',
      },
      boxShadow: {
        'glow-blue': '0 0 50px -10px rgba(59,130,246,0.5)',
        'card': '0 20px 60px -25px rgba(0,0,0,0.6)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 40s linear infinite',
        'pulse-ring': 'pulse-ring 2.5s infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'pulse-ring': { '0%': { transform: 'scale(1)', opacity: '0.5' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
      },
    },
  },
  plugins: [],
};

export default config;
