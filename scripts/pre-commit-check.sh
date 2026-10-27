#!/usr/bin/env bash
# ==============================================================================
# ASSEC — Pre-Commit Quality Gate & Verification Script
# Executa higienização do Git, Type-Check (TS), Lint, Testes Unitários e Build
# de Produção no Backend (NestJS) e Frontend (Next.js) antes do commit.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
RESET="\033[0m"

step() {
  echo -e "\n${BOLD}${CYAN}▶ $1${RESET}"
}

ok() {
  echo -e "${GREEN}✔ $1${RESET}"
}

fail() {
  echo -e "${RED}✖ ERRO: $1${RESET}" >&2
  exit 1
}

echo -e "${BOLD}======================================================================${RESET}"
echo -e "${BOLD}🛡️  ASSEC — Verificação Completa Pré-Commit (Git, TS, Lint, Test, Build)${RESET}"
echo -e "${BOLD}======================================================================${RESET}"

# ------------------------------------------------------------------------------
# 1. Boas Práticas do Git e Higiene do Repositório
# ------------------------------------------------------------------------------
step "1/6 Verificando higiene do repositório e boas práticas do Git..."

# 1.1. Remover/bloquear arquivos Zone.Identifier (WSL/Windows)
ZONE_FILES="$(find . -path ./node_modules -prune -o -path ./app/web/node_modules -prune -o -path ./backend/node_modules -prune -o -name "*Zone.Identifier*" -print)"
if [[ -n "$ZONE_FILES" ]]; then
  echo -e "${YELLOW}⚠ Encontrados arquivos Zone.Identifier. Removendo automaticamente...${RESET}"
  find . -name "*Zone.Identifier*" -delete
fi

# 1.2. Impedir commit de arquivos .env reais
STAGED_ENV="$(git diff --cached --name-only | grep -E '(^|/)\.env(\..+)?$' | grep -v '\.env\.example$' || true)"
if [[ -n "$STAGED_ENV" ]]; then
  fail "Arquivo(s) .env sensível(is) detectado(s) no stage do Git:\n$STAGED_ENV"
fi

# 1.3. Verificar marcadores de conflito de merge esquecidos
CONFLICT_FILES="$(git grep -l -E '^(<<<<<<<|=======|>>>>>>>)' -- ':!scripts/pre-commit-check.sh' || true)"
if [[ -n "$CONFLICT_FILES" ]]; then
  fail "Marcadores de conflito de merge encontrados nos arquivos:\n$CONFLICT_FILES"
fi

ok "Higiene do Git verificada com sucesso."

# ------------------------------------------------------------------------------
# 2. Backend — TypeScript Type-Check
# ------------------------------------------------------------------------------
step "2/6 [Backend] Verificando tipagem TypeScript (tsc --noEmit)..."
(cd "$ROOT_DIR/backend" && npx tsc --noEmit)
ok "[Backend] Tipagem TypeScript sem erros."

# ------------------------------------------------------------------------------
# 3. Backend — Testes Unitários (Jest) e Build (NestJS)
# ------------------------------------------------------------------------------
step "3/6 [Backend] Executando testes unitários (Jest) e build de produção..."
(cd "$ROOT_DIR/backend" && npm test -- --passWithNoTests && npm run build)
ok "[Backend] Todos os testes passaram e build NestJS concluído."

# ------------------------------------------------------------------------------
# 4. Frontend — TypeScript Type-Check
# ------------------------------------------------------------------------------
step "4/6 [Frontend] Verificando tipagem TypeScript (npm run type-check)..."
(cd "$ROOT_DIR/app/web" && npm run type-check)
ok "[Frontend] Tipagem TypeScript sem erros."

# ------------------------------------------------------------------------------
# 5. Frontend — ESLint
# ------------------------------------------------------------------------------
step "5/6 [Frontend] Executando análise estática ESLint (npm run lint)..."
(cd "$ROOT_DIR/app/web" && npm run lint)
ok "[Frontend] ESLint aprovado sem erros."

# ------------------------------------------------------------------------------
# 6. Frontend — Build de Produção (Next.js)
# ------------------------------------------------------------------------------
step "6/6 [Frontend] Executando build de produção (npm run build)..."
(cd "$ROOT_DIR/app/web" && rm -rf .next && npm run build)
ok "[Frontend] Build de produção Next.js concluído com sucesso."

echo -e "\n${BOLD}${GREEN}======================================================================${RESET}"
echo -e "${BOLD}${GREEN}✅ TODAS AS VERIFICAÇÕES PASSARAM! O repositório está pronto para commit.${RESET}"
echo -e "${BOLD}${GREEN}======================================================================${RESET}"
echo -e "Sugestão de fluxo Git (Conventional Commits):"
echo -e "  git status -s"
echo -e "  git add <arquivos>"
echo -e "  git commit -m \"feat(web,api): apply UX/A11y, technical SEO and SSR performance audit fixes\""
