export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0d0d0d',
        'surface-2': '#141414',
        border: '#1a1a1a',
        'border-light': '#2a2a2a',
        foreground: '#ffffff',
        muted: '#666666',
        'muted-light': '#999999',
      },
      fontFamily: {
        fa: ['Vazirmatn', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
      },
    },
  },
}