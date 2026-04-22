/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal & Culturally Rich Theme
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b', // Royal Crimson
          900: '#7f1d1d',
        },
        secondary: {
          50: '#fff9f0', // Creamy Ivory
          100: '#fff7ed',
          200: '#ffedd5',
          300: '#fed7aa',
          400: '#fdba74',
          500: '#fb923c',
          600: '#f97316',
          700: '#ea580c',
          800: '#c2410c',
          900: '#9a3412',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309', // Antique Gold
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // Special royal colors
        parchment: {
          light: '#fff9f0',
          DEFAULT: '#fff9f0', // Creamy Ivory
          dark: '#ffedd5',
        },
        charcoal: {
          DEFAULT: '#2d2d3a',
        },
        gold: {
          light: '#fde68a',
          DEFAULT: '#b45309',
          dark: '#92400e',
        },
        maroon: {
          light: '#b91c1c',
          DEFAULT: '#991b1b',
          dark: '#7f1d1d',
        }
      },
      fontFamily: {
        // Royal Heritage Fonts
        display: ['Playfair Display', 'serif'], // For headings - elegant royal style
        serif: ['Lora', 'serif'], // For body text - classic manuscript
        sans: ['Inter', 'sans-serif'], // For UI elements - clean modern
        royal: ['Playfair Display', 'serif'], // For special titles
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
