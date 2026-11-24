/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        creme: '#FFF8F0',
        terracota: {
          DEFAULT: '#C0563B',
          escuro: '#8F3A26',
          claro: '#F3D9D0',
        },
        verde: {
          DEFAULT: '#2F6B4F',
          claro: '#DDEBE2',
        },
        amarelo: {
          DEFAULT: '#F2B84B',
          claro: '#FDF0D2',
        },
        marrom: {
          DEFAULT: '#4A2E22',
          claro: '#7A5A4A',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        cartao: '0 2px 12px rgba(74, 46, 34, 0.08)',
      },
    },
  },
  plugins: [],
}
