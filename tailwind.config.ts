import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff7fb',
          100: '#fde8f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777'
        },
        honey: '#f9e7a8',
        mint: '#c8f3dc'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(236, 72, 153, 0.10)',
        card: '0 10px 30px rgba(31, 41, 55, 0.08)'
      },
      keyframes: {
        'page-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' }
        },
        bloom: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '45%': { opacity: '1' },
          '100%': { transform: 'scale(1.18)', opacity: '0' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.08)' },
          '50%': { transform: 'scale(0.98)' },
          '75%': { transform: 'scale(1.05)' }
        }
      },
      animation: {
        'page-in': 'page-in 420ms ease-out both',
        float: 'float 5s ease-in-out infinite',
        bloom: 'bloom 2.8s ease-out infinite',
        heartbeat: 'heartbeat 1.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
