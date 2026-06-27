/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A', // near-black background
        accent: '#00FF85', // electric athletic green
        bone: '#F5F3EE', // warm off-white for display headings
        muted: '#8A8A8A', // secondary text
        card: '#141414', // card backgrounds
        surface: '#181818', // slightly raised surfaces
        line: '#222222', // borders and hairlines
      },
      fontFamily: {
        display: ['Ortica', 'ui-sans-serif', 'sans-serif'],
        angular: ['"Ortica Angular"', 'Ortica', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        btn: '6px',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
