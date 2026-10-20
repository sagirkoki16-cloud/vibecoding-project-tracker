/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0F766E',
        brandHover: '#115E59',

        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceMuted: '#F1F5F9',
        border: '#CBD5E1',

        textPrimary: '#0F172A',
        textSecondary: '#475569',

        feature: '#1D4ED8',
        featureSurface: '#DBEAFE',
        bug: '#BE123C',
        bugSurface: '#FFE4E6',

        dueCalm: '#334155',
        dueCalmSurface: '#F1F5F9',
        dueWarning: '#92400E',
        dueWarningSurface: '#FEF3C7',
        dueOverdue: '#991B1B',
        dueOverdueSurface: '#FEE2E2',
        dueNeutral: '#475569',
        dueNeutralSurface: '#E2E8F0',
      },
      fontFamily: {
        sans: ['system-ui', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};