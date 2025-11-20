import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'point-blue': '#0189F0',
        'mult-red': '#F66859',
        'xmult-purple': '#7A73BB',
        'money-yellow': '#EEB741',
      },
    },
  },
  plugins: [],
};
export default config;
