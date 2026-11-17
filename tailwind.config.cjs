/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#153e35', deep: '#12362e' },
        green: { DEFAULT: '#236a4d', hover: '#19563d' },
        mint: { DEFAULT: '#d8e9c9', bright: '#c9e2b5' },
        sage: '#eaf1dc',
        pine: '#205638',
        cream: '#f7f8f0',
        ink: '#233c2d',
        muted: '#76836e',
        line: { DEFAULT: '#e3e8df', strong: '#b5c0b3' },
        soft: '#f0f4ec',
        danger: { DEFAULT: '#a43b3b', soft: '#fff0ef' },
        amber: { DEFAULT: '#8b6020', soft: '#fbf2e0' },
        blue: { DEFAULT: '#3b6289', soft: '#edf3fa' },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'IRANSansX', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        'mydiet-sm': '9px',
        mydiet: '18px',
        'mydiet-lg': '22px',
      },
      spacing: {
        sidebar: '248px',
      },
    },
  },
  plugins: [],
}
