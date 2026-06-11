/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A', // near-black background
        accent: '#00FF85', // electric athletic green
        muted: '#888888', // secondary text
        card: '#141414', // card backgrounds
        line: '#1F1F1F', // borders
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
      },
    },
  },
  plugins: [],
};
