# 🤖 Guia de Execução para IA

Este design system foi estruturado para ser consumido por assistentes de código. Siga a ordem abaixo ao gerar o projeto:

1. `01-project-overview.md` → Entenda o escopo, stack e regra de ouro.
2. `02-setup-structure.md` → Crie a estrutura de pastas e arquivos de configuração.
3. `03-design-tokens.md` → Configure CSS variables, Tailwind e tipografia.
4. `04-components.md` → Gere componentes base (Button, Card, Input, Header, Footer).
5. `05-pages-routes.md` → Crie as páginas do App Router e metadados SEO.
6. `06-accessibility-ux.md` → Aplique acessibilidade, validação de formulários e testes.

## 🎯 Diretrizes para a IA
- ✅ Siga tokens e hierarquia exatamente como definidos.
- ✅ Priorize HTML semântico, ARIA e foco visível.
- ✅ Use `next/font` para tipografia, nunca `@import` ou `<link>` manuais.
- ✅ Mantenha componentes desacoplados e reutilizáveis.
- ❌ Nunca use glassmorphism, gradientes agressivos ou animações chamativas.
- ❌ Não ignore `prefers-reduced-motion` ou contraste WCAG.
- 🔄 Após gerar cada arquivo, execute `npm run type-check` e `npm run lint` para validar.