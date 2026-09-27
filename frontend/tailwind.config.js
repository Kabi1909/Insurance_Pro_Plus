/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
        },
        secondary: '#0F766E',
        accent: '#F59E0B',
        success: '#16A34A',
        error: '#DC2626',
        card: '#FFFFFF',
        textMain: '#0F172A',
        textSecondary: '#64748B',
        borderMain: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
