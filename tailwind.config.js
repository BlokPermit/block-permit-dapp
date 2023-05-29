/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/react-tailwindcss-select/dist/index.esm.js"
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                'main': {
                    50: "#fe9360",
                    100: "#f78172",
                    200: "#f78172",
                    300: "#f99d91",
                    400: "#f78172",
                    500: "#faaba1"
                },
            },
        },

    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
