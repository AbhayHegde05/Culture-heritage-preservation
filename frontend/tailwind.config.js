/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Indian Cultural Heritage Theme - Saffron, White, Green with Indian aesthetics
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Saffron
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Indian Red
          600: '#dc2626',
          700: '#b91c1c', // Deep Maroon
          800: '#991b1b',
          900: '#7f1d1d',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a', // Indian Green
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
        // Special cultural colors
        parchment: {
          light: '#fff9f0',
          DEFAULT: '#ffedd5',
          dark: '#fed7aa',
        },
        ochre: {
          light: '#fdba74',
          DEFAULT: '#f97316',
          dark: '#ea580c',
        },
        indigo: {
          light: '#818cf8',
          DEFAULT: '#4338ca',
          dark: '#312e81',
        },
        terracotta: {
          light: '#fb923c',
          DEFAULT: '#ea580c',
          dark: '#c2410c',
        },
        forest: {
          light: '#22c55e',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        }
      },
      fontFamily: {
        // Ancient Manuscript Style Fonts
        display: ['Cinzel', 'serif'], // For headings - elegant ancient style
        serif: ['Cormorant Garamond', 'serif'], // For body text - classic manuscript
        sans: ['Lato', 'sans-serif'], // For UI elements - clean but warm
        manuscript: ['Cinzel Decorative', 'serif'], // For special titles
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
