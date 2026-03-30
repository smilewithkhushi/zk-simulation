import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zk-black': '#0A0A0A',
        'zk-green': '#A8F072',
        'zk-accent': '#6EE03A',
        'zk-charcoal': '#111411',
        'zk-muted': '#2A3D1F',
        'zk-white': '#F0F0F0',
      },
      fontFamily: {
        display: ['var(--font-space)', 'sans-serif'],
        mono: ['var(--font-plex)', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(168,240,114,0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(168,240,114,0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
