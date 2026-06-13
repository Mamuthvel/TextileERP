/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
        },
        amber: {
          400: '#f5b942',
          500: '#f0a020',
          600: '#d6850f',
        },
        teal: {
          400: '#3ddad7',
          500: '#22b8b5',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(34,184,181,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,184,181,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,185,66,0.25), 0 4px 24px -4px rgba(245,185,66,0.15)',
      },
    },
  },
  plugins: [],
};
