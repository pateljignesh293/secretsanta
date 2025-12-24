/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                christmas: {
                    red: '#C31432',
                    green: '#165E3D',
                    gold: '#FFD700',
                    snow: '#F8F9FA',
                },
            },
            animation: {
                'snow-fall': 'snowFall 10s linear infinite',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                snowFall: {
                    '0%': { transform: 'translateY(-10vh) translateX(0)' },
                    '100%': { transform: 'translateY(100vh) translateX(10vw)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
        },
    },
    plugins: [],
}
