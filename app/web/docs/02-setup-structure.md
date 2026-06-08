# 🗂️ Estrutura & Configuração

## 📁 Estrutura de Pastas

assec/
├── app/
│   └── web/                          # 🌐 Frontend Next.js (raiz do projeto web)
│       ├── src/
│       │   ├── app/                  # 📄 App Router (Next.js 15)
│       │   │   ├── (public)/         # Route group: páginas públicas (não afeta URL)
│       │   │   │   ├── layout.tsx    # Layout compartilhado (Header + Footer)
│       │   │   │   ├── page.tsx      # Home
│       │   │   │   ├── sobre/
│       │   │   │   ├── beneficios/
│       │   │   │   ├── transparencia/
│       │   │   │   ├── noticias/
│       │   │   │   └── associe-se/
│       │   │   ├── (admin)/          # Route group: área restrita (futuro)
│       │   │   ├── api/              # Webhooks, proxy ou rotas auxiliares
│       │   │   ├── layout.tsx        # Root layout (fonts, metadata, providers)
│       │   │   ├── global-error.tsx  # Error boundary global
│       │   │   ├── not-found.tsx     # 404 customizado
│       │   │   └── loading.tsx       # Skeleton global
│       │   ├── components/           # 🧩 Componentes reutilizáveis (genéricos)
│       │   │   ├── ui/               # shadcn/ui (Button, Card, Input, Dialog...)
│       │   │   ├── layout/           # Header, Footer, MobileNav, SkipLink
│       │   │   ├── sections/         # Hero, Stats, BenefitsGrid, TransparencyList...
│       │   │   └── shared/           # SEO, Breadcrumb, Pagination, Toast
│       │   ├── features/             # 🎯 Lógica de negócio colocalizada
│       │   │   ├── association/      # schema.ts, Form.tsx, ServerAction.ts, index.ts
│       │   │   ├── transparency/     # types.ts, fetchDocuments.ts, Filters.tsx
│       │   │   └── news/             # types.ts, fetchArticles.ts, ArticleCard.tsx
│       │   ├── lib/                  # ⚙️ Utilitários, config, API client, env
│       │   ├── hooks/                # 🪝 Custom hooks (useScroll, useReducedMotion)
│       │   ├── types/                # 📘 Interfaces globais compartilhadas
│       │   ├── styles/               # 🎨 globals.css, tokens CSS
│       │   └── middleware.ts         # 🔒 Edge middleware (auth, redirects, i18n)
│       ├── public/                   # 📦 Assets estáticos (logo, og-image, robots.txt)
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       └── package.json
└── backend/                          # 🔙 Backend existente (API, DB, auth)



## 📝 Metadados (SEO)
- Use `generateMetadata` por página.
- Herde `title` e `description` do layout base.
- Inclua Open Graph, Twitter Cards, `robots: { index: true }`.
- URLs semânticas, hífenadas.

## 🧩 Estrutura das Páginas
- **Home:** Hero institucional → Estatísticas → Benefícios → Transparência destaque → CTA final.
- **Transparência:** Lista de documentos (tipo, tamanho, data, download direto). Paginação ou "Ver mais".
- **Associe-se:** Formulário com Zod + RHF. Validação síncrona no `submit`. Estados claros.
- **Notícias:** Grid com 1 destaque + secundários. Filtros por categoria.

## 🤖 Instrução para IA
Crie páginas usando componentes do design system. Não repita lógica. Mantenha metadados alinhados. Garanta que cada rota tenha pelo menos 1 CTA e navegação previsível.

