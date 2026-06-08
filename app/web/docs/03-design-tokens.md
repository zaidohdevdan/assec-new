
---

### 📁 `docs/03-design-tokens.md`
```markdown
# 🎨 Design Tokens

## 🌍 CSS Variables (`src/styles/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #071A2D;
  --color-primary-light: #0a2439;
  --color-secondary: #0E2B47;
  --color-accent: #D4AF37;
  --color-accent-dark: #B8960C;
  --color-accent-light: #F0C75E;
  --color-support: #1E7A46;
  --bg-page: #F8FAFC;
  --bg-surface: #FFFFFF;
  --text-primary: #1F2937;
  --text-secondary: #4B5563;
  --text-muted: #6B7280;
  --border-default: #E5E7EB;
  --border-focus: #0E2B47;
}

tailwind.config.ts
```javascript
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


### 🔤 Tipografia
- Use next/font/google com Merriweather (400,700) e Inter (400,500,600).
- Aplique display: 'swap' e preload: true.
- Exporte variáveis CSS: --font-serif, --font-sans.

### ⚠️ Regras de Uso
- #D4AF37 apenas sobre fundos escuros. Sobre claros, use #B8960C.
- Dourado = decorativo. Nunca para estado ou dado crítico.
- Contraste mínimo: 4.5:1 texto, 3:1 interface.
