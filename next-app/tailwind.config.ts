import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1360px' } },
    extend: {
      colors: {
        bg:       'rgb(var(--bg) / <alpha-value>)',
        bg2:      'rgb(var(--bg-2) / <alpha-value>)',
        bg3:      'rgb(var(--bg-3) / <alpha-value>)',
        surface:  'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface-2) / <alpha-value>)',
        border:   'rgb(var(--border) / <alpha-value>)',
        text:     'rgb(var(--text) / <alpha-value>)',
        text2:    'rgb(var(--text-2) / <alpha-value>)',
        text3:    'rgb(var(--text-3) / <alpha-value>)',
        gold:     '#c8a870',
        'gold-light': '#e8c890',
        ink:      '#0a0a0a',
        chalk:    '#f8f8f6',
        primary:  { DEFAULT: '#2563eb', 600: '#1d4ed8', 400: '#3b82f6' },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem,8vw,7rem)', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-xl':  ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg':  ['clamp(2rem,4vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      boxShadow: {
        'sm-dark':  '0 1px 3px rgba(0,0,0,0.4)',
        'md-dark':  '0 4px 20px rgba(0,0,0,0.5)',
        'lg-dark':  '0 20px 60px rgba(0,0,0,0.6)',
        'xl-dark':  '0 30px 80px rgba(0,0,0,0.7)',
        'card':     '0 1px 0 rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.6)',
        'glow-gold': '0 0 40px rgba(200,168,112,0.25)',
        'light-card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)',
        'light-card-hover': '0 4px 30px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-up':      'fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':      'fadeIn 0.5s ease both',
        'slide-left':   'slideLeft 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'float-fast':   'float 4s ease-in-out infinite',
        'marquee':      'marquee 40s linear infinite',
        'marquee-rev':  'marqueeRev 45s linear infinite',
        'shimmer-gold': 'shimmerGold 3.5s linear infinite',
        'grain':        'grain 8s steps(10) infinite',
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'number-count': 'fadeUp 0.6s ease both',
        'line-draw':    'lineDraw 1.2s cubic-bezier(0.22,1,0.36,1) both',
        'spin-slow':    'spin-slow 12s linear infinite',
        'breathe':      'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRev: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmerGold: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%,-3%)' },
          '20%': { transform: 'translate(3%,2%)' },
          '30%': { transform: 'translate(-1%,4%)' },
          '40%': { transform: 'translate(2%,-1%)' },
          '50%': { transform: 'translate(-3%,2%)' },
          '60%': { transform: 'translate(2%,3%)' },
          '70%': { transform: 'translate(-1%,-2%)' },
          '80%': { transform: 'translate(3%,-3%)' },
          '90%': { transform: 'translate(-2%,1%)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.4', transform: 'scale(0.85)' },
        },
        lineDraw: {
          '0%':   { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':     { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
