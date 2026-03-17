/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",    
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3C50E0',
                boxdark: '#24303F',
                'boxdark-2': '#1A222C',
            },
        },
    },
    plugins: [],
}