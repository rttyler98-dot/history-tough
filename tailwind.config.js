/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|from|via|to)-(amber|orange|indigo|purple|zinc|stone|neutral|red|teal|emerald)-(200|300|400|500|700|800|900)/,
    },
    'bg-gradient-to-tr',
    'bg-gradient-to-tl',
    'bg-gradient-to-bl',
    'bg-gradient-to-br',
    'to-black'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
