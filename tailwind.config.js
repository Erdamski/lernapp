/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'monospace'],
        display: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Baloo 2"', '"Fredoka"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Hintergrund (siehe STYLEGUIDE.md)
        bg: {
          deep: '#0a0e27',
          mid: '#1a1d3a',
          card: '#23264a',
        },
        // Pixel-Tinten (Borders, Outlines)
        ink: {
          DEFAULT: '#0a0a14',
          soft: '#1e1b4b',
        },
        // Marken-Indigo
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        accent: {
          coin: '#fbbf24',
          star: '#facc15',
          success: '#10b981',
          danger: '#ef4444',
          warn: '#f97316',
          magic: '#a855f7',
        },
      },
      borderRadius: {
        pixel: '0px',
        chunk: '6px',
        soft: '12px',
      },
      boxShadow: {
        'pixel-sm': '0 3px 0 0 var(--tw-shadow-color)',
        'pixel-md': '0 5px 0 0 var(--tw-shadow-color)',
        'pixel-lg': '0 7px 0 0 var(--tw-shadow-color)',
      },
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        pop: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        shake: 'shake 0.4s ease-in-out',
        glow: 'glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(250,204,21,0.6))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(250,204,21,0.9))' },
        },
      },
    },
  },
  plugins: [],
};
