/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: 'rgb(var(--color-bg-dark) / <alpha-value>)',
          lighter: 'rgb(var(--color-bg-dark-lighter) / <alpha-value>)',
          lightest: 'rgb(var(--color-bg-dark-lightest) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        slate: {
          100: 'rgb(var(--color-text-100) / <alpha-value>)',
          200: 'rgb(var(--color-text-200) / <alpha-value>)',
          300: 'rgb(var(--color-text-300) / <alpha-value>)',
          400: 'rgb(var(--color-text-400) / <alpha-value>)',
          500: 'rgb(var(--color-text-500) / <alpha-value>)',
          600: 'rgb(var(--color-border-600) / <alpha-value>)',
          700: 'rgb(var(--color-border-700) / <alpha-value>)',
          800: 'rgb(var(--color-border-800) / <alpha-value>)',
          900: 'rgb(var(--color-border-900) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
        black: 'rgb(var(--color-black) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}
