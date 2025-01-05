/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-green',
    'bg-yellow',
    'bg-red',
    'text-green-800',
    'text-yellow-800',
    'text-red-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

