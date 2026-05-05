import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#e8f4fc',
          100: '#c5e0f5',
          200: '#8ec5e8',
          500: '#1d6fa4',
          600: '#165a87',
          700: '#104566',
        },
        medical: {
          green:  '#0f7b5a',
          orange: '#c45c00',
          red:    '#b91c1c',
          purple: '#6d28d9',
        }
      },
      borderRadius: {
        'xl2': '16px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(30,50,80,0.06)',
        'card-lg': '0 8px 32px rgba(30,50,80,0.10)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config