# CLAUDE.md - ASSEC Backend

## Visao Geral

Backend NestJS 11 + Prisma + PostgreSQL para o sistema ASSEC.
Porta: 3001 | Banco: PostgreSQL (Docker, porta 15432)

## Como Rodar

```bash
# Subir banco
docker compose up -d

# Instalar dependencias
cd backend && npm install

# Migrations + Seed
npx prisma migrate dev
npx prisma db seed

# Dev
npm run start:dev

# Testes
npm test
```

## Estrutura

```
src/
  auth/          # Login, registro, JWT guard
  users/         # CRUD usuarios
  contact/       # Mensagens de contato
  schedules/     # Agendamentos (auth required)
  inns/          # Pousadas (CRUD aberto)
  notices/       # Avisos (CRUD aberto)
  common/pipes/  # ZodValidationPipe
prisma/
  schema.prisma  # 5 models: User, ContactMessage, Schedule, Inn, Notice
  seed.ts        # Dados iniciais (admin, usuarios demo, etc)
```

## Tasks (Prioridade)

### P0 - Seguranca (Critico) ✅

- [x] **Remover .env do historico do git** - .gitignore ja tem `.env`, repo sem commits anteriores
- [x] **Usar @nestjs/config** - `ConfigModule.forRoot({ isGlobal: true })` no AppModule, `@nestjs/config` nas dependencias
- [x] **Remover JWT secret hardcoded** - `auth.module.ts` usa `config.getOrThrow<string>('JWT_SECRET')` sem fallback
- [x] **Corrigir CORS** - `main.ts` le de `FRONTEND_URL` via ConfigService
- [x] **Proteger endpoints de Inns e Notices** - POST/PUT/DELETE com `AuthGuard + RolesGuard + @Roles(Role.ADMIN)`. GET aberto (leitura publica)
- [x] **Proteger GET /users** - `@UseGuards(AuthGuard)` no nivel do controller
- [x] **Implementar RolesGuard** - `RolesGuard` com decorator `@Roles()` usando `Reflector`
- [x] **Verificar ownership em schedules** - `schedules.service.ts` verifica `schedule.userId !== userId` em update/remove e lanca `ForbiddenException`

### P1 - Validacao e Correcoes

- [ ] **Validar body em Inns e Notices** - Controllers aceitam `Prisma.InnCreateInput` sem nenhuma validacao Zod
- [ ] **Validar body em Schedules update** - `PUT /schedules/:id` aceita `Partial<>` sem validacao
- [ ] **Impedir role escalation no register** - Garantir que `POST /auth/register` nunca aceite `role: 'ADMIN'` no body (o Zod schema atual nao inclui role, mas Prisma type aceita)
- [ ] **Padronizar idioma das mensagens de erro** - Metade em ingles, metade em portugues. Escolher um e manter consistente
- [ ] **Mudar date/time de Schedule para tipos nativos** - Schema usa `String` para date e time. Deveria usar `DateTime` do Prisma para permitir queries por data, ordenacao e constraints

### P2 - Funcionalidades Faltantes

- [ ] **Endpoints de update/delete para Users** - Nao existe `PUT /users/:id`, `DELETE /users/:id`, nem troca de senha
- [ ] **Paginacao em listagens** - Todos os `findAll` retornam tudo. Implementar `skip`/`take` com query params
- [ ] **Filtro/busca em listagens** - Nenhum endpoint suporta filtros (por status, data, tipo, etc)
- [ ] **Gerenciamento de mensagens de contato** - Nao existe endpoint para marcar como lida, deletar ou responder
- [ ] **Soft delete para Inns e Notices** - Modelos tem campo `active` mas `remove()` faz hard delete. Deveria setar `active: false`
- [ ] **Password reset / Email verification** - Nenhum mecanismo de recuperacao de senha ou verificacao de email
- [ ] **Refresh token** - JWT expira em 1h sem mecanismo de refresh

### P3 - Qualidade e Infraestrutura

- [ ] **Completar testes unitarios** - Stubs vazios: `users.controller`, `contact.controller`, `contact.service`, `prisma.service`. Zero testes: `schedules/`, `inns/`, `notices/`
- [ ] **Testes e2e** - So existe teste para `GET /`. Precisa de cobertura dos fluxos principais (auth, CRUD schedules, CRUD inns/notices)
- [ ] **Testar ZodValidationPipe** - Nenhum teste para o pipe de validacao
- [ ] **Filtro global de excecoes** - Criar `AllExceptionsFilter` para formato consistente de erros
- [ ] **Logging** - Nenhum middleware/interceptor de request logging
- [ ] **Rate limiting** - Sem throttling em login, registro e contato
- [ ] **Swagger/OpenAPI** - Nenhum documentation da API
- [ ] **Health check** - Nenhum endpoint `GET /health`
- [ ] **Helmet** - Falta middleware de security headers
- [ ] **Remover dependencias desnecessarias** - `pg` nao e usado diretamente (Prisma cuida disso), `@types/mocha` esta no projeto que usa Jest

### P4 - Schema e Migration

- [ ] **Adicionar cascading delete** - User -> Schedule nao tem `onDelete`. Deletar usuario vai falhar com foreign key constraint
- [ ] **Adicionar indexes** - So existem unique constraints. Considerar indexes em campos de busca frequente (email, status, date)
- [ ] **Configurar seed no package.json** - Falta `"prisma": { "seed": "ts-node prisma/seed.ts" }` no package.json
