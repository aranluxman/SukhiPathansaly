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
        luxury: {
          black: '#0a0a0a',
          card: '#111111',
          gold: '#c9a84c',
          'gold-light': '#e8c96d',
          text: '#f5f5f5',
          muted: '#888888',
          line: 'rgba(201, 168, 76, 0.2)'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', '"Playfair Display"', 'serif']
      },
      boxShadow: {
        gold: '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-strong': '0 0 28px rgba(201, 168, 76, 0.25)',
        card: '0 18px 45px rgba(0, 0, 0, 0.35)'
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
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'strike-in': {
          '0%': { backgroundSize: '0% 1px' },
          '100%': { backgroundSize: '100% 1px' }
        }
      },
      animation: {
        'page-in': 'page-in 420ms ease-out both',
        float: 'float 5s ease-in-out infinite',
        bloom: 'bloom 2.8s ease-out infinite',
        heartbeat: 'heartbeat 1.8s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite',
        'strike-in': 'strike-in 260ms ease-out both'
      }
    }
  },
  plugins: []
};

export default config;
