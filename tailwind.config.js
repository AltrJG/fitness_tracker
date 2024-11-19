/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00fff5',
          secondary: '#ff00ff',
          accent: '#7928ca',
          dark: '#0a0a0a',
          light: '#f0f0f0',
        },
      },
      fontFamily: {
        cyber: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 5px theme(colors.cyber.primary), 0 0 20px theme(colors.cyber.primary)',
        'neon-lg': '0 0 10px theme(colors.cyber.primary), 0 0 40px theme(colors.cyber.primary)',
      },
    },
  },
  plugins: [],
};