import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: logo lacivert (royal navy) — marka rengi
        primary: {
          50: '#eef1f8',
          100: '#d6deec',
          200: '#aebdda',
          300: '#7a8fc1',
          400: '#4b66a4',
          500: '#2a4685',
          600: '#1d3370',
          700: '#162659',
          800: '#101c44',
          900: '#0a1330',
        },
        // Secondary: krem/kahve (lacivert ile kontrast için sıcak yan)
        secondary: {
          50: '#faf8f5',
          100: '#f2ede3',
          200: '#e5d9c5',
          300: '#d4bf9f',
          400: '#c0a176',
          500: '#a8845a',
          600: '#8b6b48',
          700: '#6f543a',
          800: '#5c4530',
          900: '#4c3927',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Accent: gold (premium / lacivert ile kısas)
        accent: {
          DEFAULT: '#d4af37',
          light: '#f0d875',
          dark: '#b8941f',
        },
        // Forest: doğa vurguları için (badge, ikon, doğa temalı bölüm)
        forest: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cd',
          300: '#8dd3ab',
          400: '#5ab880',
          500: '#369e5f',
          600: '#277e4a',
          700: '#20653c',
          800: '#1c5132',
          900: '#18432a',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['2.25rem', { lineHeight: '1.3' }],
        'heading-3': ['1.875rem', { lineHeight: '1.4' }],
        'heading-4': ['1.5rem', { lineHeight: '1.5' }],
        body: ['1rem', { lineHeight: '1.75' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
        strong: '0 12px 40px rgba(0, 0, 0, 0.16)',
      },
      screens: {
        xs: '480px',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
        screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px' },
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
        meteor: {
          '0%': {
            transform: 'translate3d(0, 0, 0) rotate(-22deg)',
            opacity: '0',
          },
          '5%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': {
            transform: 'translate3d(140vw, 60vh, 0) rotate(-22deg)',
            opacity: '0',
          },
        },
        'led-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(212,175,55,0.4)',
          },
          '50%': {
            boxShadow: '0 0 40px 8px rgba(212,175,55,0.15)',
          },
        },
      },
      animation: {
        twinkle: 'twinkle 3s ease-in-out infinite',
        meteor: 'meteor 4s linear infinite',
        'led-pulse': 'led-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

export default config;
