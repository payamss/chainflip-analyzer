import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#58A6FF',
        secondary: '#161B22',
        accent: '#21262D',

        border: '#30363D',
        textLight: '#C9D1D9',
        textGray: '#8B949E',
        hover: '#1F6FEB',
        'bg-header-pink': '##FF33AF',
      },
    },
  },
  plugins: [],
} satisfies Config;
