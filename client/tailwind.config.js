/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated colors for the Dark Theme
        primary: '#111827',     // Very Dark Gray/Almost Black for main background
        accent: '#6366f1',      // Deep Violet/Indigo for main buttons/links
        'accent-hover': '#4f46e5',
        surface: '#1f2937',     // Darker Gray for cards/sections (was off-white)
        text: '#e5e7eb',        // Light Gray for body text
        highlight: '#818cf8',   // Light Indigo for key text/Logo
        danger: '#ef4444',      // Red for Logout button
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}