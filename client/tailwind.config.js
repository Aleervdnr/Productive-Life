/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-100': '#9B9BA5',// Text light o text item inactive
        'dark-200': '#37373F',// Borders Inputs
        'dark-400': '#2A2B31',// SideBar Background
        'dark-500': '#232429',// Background
        'violet-main': '#7E73FF',// Violeta principal
        'green-complete': '#20692C',// Verde task completed
      },
      fontSize: {
        'xxs': 'clamp(0.625rem, 1.2vw, 0.75rem)',  // Mín: 10px, Máx: 12px
        'xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',  // Mín: 12px, Máx: 14px
        'sm': 'clamp(0.875rem, 1.6vw, 1rem)',  // Mín: 14px, Máx: 16px
        'base': 'clamp(1rem, 1.8vw, 1.125rem)',  // Mín: 16px, Máx: 18px
        'lg': 'clamp(1.125rem, 2vw, 1.25rem)',  // Mín: 18px, Máx: 20px
        'xl': 'clamp(1.25rem, 2.2vw, 1.5rem)',  // Mín: 20px, Máx: 24px
        '2xl': 'clamp(1.5rem, 2.5vw, 1.75rem)',  // Mín: 24px, Máx: 28px
        '3xl': 'clamp(1.75rem, 3vw, 2rem)',  // Mín: 28px, Máx: 32px
      },
    }
  },
  plugins: [
    require('daisyui'),
  ],

}
