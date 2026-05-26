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
        cream: {
          50: '#fdfaf5',
          100: '#faf3e8',
          200: '#f5e6d0',
          300: '#edd5b3',
          DEFAULT: '#f5e6d0',
        },
        rose: {
          dusty: '#c9848a',
          light: '#e8b4b8',
          pale: '#f2d5d7',
        },
        brown: {
          soft: '#8b6355',
          warm: '#a07060',
          light: '#c4a49a',
          dark: '#5c3d2e',
        },
        teal: {
          DEFAULT: '#4A9B9B',
          light: '#6bb5b5',
          pale: '#d6eeee',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
