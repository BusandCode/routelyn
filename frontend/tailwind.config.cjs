/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: { lg: '1rem', xl: '1.25rem', '2xl': '1.75rem' },
      boxShadow: {
        sm: '0 2px 12px -2px rgba(70, 50, 120, 0.08)',
        soft: '0 12px 40px -12px rgba(70, 50, 120, 0.18)',
      },
      colors: {
        brand: {
          50: '#effbf3', 100: '#d7f5e0', 200: '#b0eac4', 300: '#7fd9a0', 400: '#4cc37c',
          500: '#27a862', 600: '#1a8a4e', 700: '#166e40', 800: '#155735', 900: '#12462d',
        },
        lavender: {
          50: '#f8f5ff', 100: '#eee8ff', 200: '#ddd2ff', 300: '#c4b0fb',
          400: '#a98ef5', 500: '#8d6ce9',
        },
        // lavender-tinted neutrals: re-tints every existing slate-* class
        slate: {
          50: '#f8f6fc', 100: '#f0ecf8', 200: '#e3ddf0', 300: '#cfc7e2', 400: '#9f96b6',
          500: '#776e8f', 600: '#5c5474', 700: '#463f5d', 800: '#2f2a42', 900: '#1e1a2e',
        },
      },
    },
  },
  plugins: [],
};
