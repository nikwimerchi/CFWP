/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3c50e0',
        body: '#64748b',
        bodydark: '#aeb7c0',
        boxdark: '#24303f',
        meta: {
          4: '#313d4a',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}