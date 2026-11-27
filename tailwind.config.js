import typography from '@tailwindcss/typography';
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'] },
    colors: {
      brand: { 50: '#eef3ff', 100: '#dbe6ff', 500: '#3b6df0', 600: '#2457d6', 700: '#1c45ad' },
      ink: { 950: '#0c0e12', 900: '#12151b', 800: '#191d25', 700: '#232833', 600: '#2f3542' },
    },
  } },
  plugins: [typography],
};
