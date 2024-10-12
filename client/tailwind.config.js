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
        xs:"clamp(0.4rem, 0.71vi + 0.23rem, 0.6rem)",
        sm: 'clamp(0.6rem, 0.35vi + 0.52rem, 0.8rem)',
        base: 'clamp(0.75rem, 0.44vi + 0.65rem, 1rem)',
        md:'clamp(0.94rem, 0.55vi + 0.81rem, 1.25rem)',
        lg:'clamp(1.17rem, 0.69vi + 1.01rem, 1.56rem);',
        xl: 'clamp(1.46rem, 0.86vi + 1.26rem, 1.95rem)',
        '2xl': 'clamp(1.83rem, 1.08vi + 1.58rem, 2.44rem)',
        '3xl': 'clamp(2.29rem, 1.35vi + 1.97rem, 3.05rem)',
      }
      // --fs-sm: clamp(0.6rem, 0.35vi + 0.52rem, 0.8rem);
      // --fs-base: clamp(0.75rem, 0.44vi + 0.65rem, 1rem);
      // --fs-md: clamp(0.94rem, 0.55vi + 0.81rem, 1.25rem);
      // --fs-lg: clamp(1.17rem, 0.69vi + 1.01rem, 1.56rem);
      // --fs-xl: clamp(1.46rem, 0.86vi + 1.26rem, 1.95rem);
      // --fs-xxl: clamp(1.83rem, 1.08vi + 1.58rem, 2.44rem);
      // --fs-xxxl: clamp(2.29rem, 1.35vi + 1.97rem, 3.05rem);
    }
  },
  plugins: [
    require('daisyui'),
  ],

}
