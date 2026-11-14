/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Design tokens del semáforo (SPEC 8). Solo LevelBadge los combina con ícono y texto.
      colors: {
        level: {
          normal: '#15803d',
          caution: '#ca8a04',
          alert: '#ea580c',
          critical: '#dc2626',
          nodata: '#6b7280',
        },
        emergency: '#b91c1c',
      },
    },
  },
  plugins: [],
}
