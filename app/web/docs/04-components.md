
---

### 📁 `docs/04-components.md`
```markdown
# 🧩 Componentes Base

## 🎯 Diretrizes
- shadcn/ui como base. Customize via `src/components/ui/`.
- Todos componentes devem aceitar `className`, `asChild` (se aplicável) e props de HTML nativo.
- Estados: `default`, `hover`, `focus-visible`, `disabled`, `loading`, `error`.

## 🔘 Button
- Variantes: `primary`, `secondary`, `outline`, `ghost`
- Tamanhos: `sm`, `md`, `lg`
- Foco: `ring-2 ring-border-focus ring-offset-2`
- Loading: spinner discreto + `disabled`

## 📦 Card
- Base: `bg-bg-surface border border-border rounded-lg shadow-sm`
- Hover: `shadow-md` ou `border-l-4 border-l-accent`
- Padding interno: `p-4` a `p-6`

## 📝 Input + Label + Error
- Label sempre visível (`htmlFor` + `id`)
- Error: `border-state-error`, mensagem abaixo com ícone
- Hint: oculto quando há erro
- `aria-invalid`, `aria-describedby` obrigatórios

## 🧭 Header & Footer
- Header: sticky, `z-50`, sombra ao scrollar. Logo esquerda, nav centro, CTA direita.
- Mobile: drawer com `aria-expanded`, `aria-controls`, foco gerenciado.
- Footer: 4 colunas (Instituição, Links, Transparência, Redes), barra inferior com © e acessibilidade.

## 🎨 Animações
- Permitidas: fade-in, slide suave (≤8px), hover discreto.
- Respeite `@media (prefers-reduced-motion: reduce)` desabilitando transições.
- Use Framer Motion apenas em seções principais, nunca em microinterações.

## 🤖 Instrução para IA
Gere cada componente em arquivo separado. Exporte default. Use TypeScript estrito. Inclua props de acessibilidade.