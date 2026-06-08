# ♿ Acessibilidade & UX

## ✅ Checklist WCAG 2.2 AA
- [ ] Contraste ≥ 4.5:1 (texto), ≥ 3:1 (interface)
- [ ] Foco visível em todos interativos
- [ ] Skip link funcional (`#main-content`)
- [ ] `prefers-reduced-motion` respeitado
- [ ] Touch targets ≥ 44×44px
- [ ] Labels explícitos, erros em texto + cor
- [ ] Menu mobile gerenciável por teclado (`Esc` fecha, foco retorna)
- [ ] `<html lang="pt-BR">` e `meta viewport` corretos

## 🧩 Padrões de Implementação
```css
/* globals.css */
*:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(14, 43, 71, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

### ⚖️ Conformidade Legal
LGPD: banner de cookies não intrusivo + Política de Privacidade no footer.
/acessibilidade: página com nível de conformidade, recursos implementados, canal de contato, data de auditoria.

### 🤖 Instrução para IA
Todo elemento interativo deve ser navegável por Tab/Shift+Tab. Formulários devem usar react-hook-form + zod com feedback claro. Nunca confie apenas em cor para transmitir estado. Teste com axe DevTools antes de finalizar.