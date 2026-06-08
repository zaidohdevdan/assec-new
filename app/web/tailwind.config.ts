import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', light: 'var(--color-primary-light)' },
        secondary: { DEFAULT: 'var(--color-secondary)', light: 'var(--color-secondary-light)' },
        accent: { DEFAULT: 'var(--color-accent)', dark: 'var(--color-accent-dark)', light: 'var(--color-accent-light)' },
        support: { DEFAULT: 'var(--color-support)', light: 'var(--color-support-light)' },
        bg: { page: 'var(--bg-page)', surface: 'var(--bg-surface)' },
        text: { primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)' },
        border: { DEFAULT: 'var(--border-default)', focus: 'var(--border-focus)' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section-sm': '3rem',
        'section-md': '4rem',
        'section-lg': '5rem',
      },
      borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem' },
    },
  },
  plugins: [],
} satisfies Config;
