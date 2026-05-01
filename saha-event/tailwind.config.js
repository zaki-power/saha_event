/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a0533",        // very dark purple - backgrounds
        'primary-mid': "#6B21A8",  // medium purple - buttons, accents
        accent: "#F59E0B",         // gold - highlights, hover states
        'accent-pink': "#EC4899",  // pink - gradients, decorations
        'text-light': "#f3e8ff",   // light purple - text on dark
        'card-bg': 'rgba(255,255,255,0.05)',  // glassmorphism cards
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
}
