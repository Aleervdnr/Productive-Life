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
    }
  },
  plugins: [
    require('daisyui'),
  ],

}
