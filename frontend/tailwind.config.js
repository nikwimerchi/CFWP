/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
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
                secondary: '#80CAEE',
                success: '#219653',
                danger: '#D34053',
                warning: '#FFA70B',
                boxdark: '#24303F',
                'boxdark-2': '#1A222C',
                body: '#64748B',
                bodydark: '#AEB7C0',
                bodydark1: '#DEE4EE',
                bodydark2: '#8A99AF',
                'gray-2': '#F7F9FC',
                meta: {
                    1: '#DC3545',
                    2: '#EFF4FB',
                    3: '#10B981',
                    4: '#313D4A',
                    5: '#259AE6',
                },
                stroke: '#E2E8F0',
                strokedark: '#2E3A47',
            },
        },
    },
    plugins: [],
}