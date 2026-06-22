/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bone-white': '#fffdf9',
        'slate-veil': '#495764',
        'carbon': '#101010',
        'obsidian': '#000000',
        'graphite': '#403f3f',
        'gunmetal-blue': '#6f879c',
      },
      fontFamily: {
        'neue-montreal': ['"Neue Montreal"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        '16': '16px',
        '20': '20px',
        '40': '40px',
        '56': '56px',
        '60': '60px',
        '64': '64px',
        '72': '72px',
        '108': '108px',
      },
    },
  },
  plugins: [],
}
