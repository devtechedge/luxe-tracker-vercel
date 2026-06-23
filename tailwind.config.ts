import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0e17',
        foreground: '#e2e8f0',
        card: '#0d1220',
        primary: '#f97316',
        'primary-foreground': '#ffffff',
        destructive: '#ef4444',
        border: 'rgba(255,255,255,0.05)',
        input: 'rgba(255,255,255,0.05)',
        ring: '#f97316',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
