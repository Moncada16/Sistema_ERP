/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      backgroundColor: {
        dark: {
          primary: '#1f2937',
          secondary: '#111827',
          accent: '#3b82f6',
        },
      },
      textColor: {
        dark: {
          primary: '#f9fafb',
          secondary: '#e5e7eb',
          accent: '#60a5fa',
        },
      },
      borderColor: {
        dark: {
          primary: '#374151',
          secondary: '#1f2937',
          accent: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}