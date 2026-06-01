#!/bin/bash

# run-all.sh — inicia backend (porta 3001) e frontend (porta 3000) simultaneamente
# Uso: ./run-all.sh [--verbose]

set -e

VERBOSE=false
if [[ "$1" == "--verbose" ]]; then
  VERBOSE=true
fi

# Cores ANSI
BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m' # No Color

# Função de cleanup
cleanup() {
  echo -e "${RED}🛑 Parando backend e frontend...${NC}"
  pkill -f "cd backend && npm run start:dev" 2>/dev/null || true
  pkill -f "cd ../app/web && npm run dev" 2>/dev/null || true
  pkill -f "node_modules/.bin/nest" 2>/dev/null || true
  pkill -f "vite --port=3000" 2>/dev/null || true
  exit 0
}

# Captura Ctrl+C
trap cleanup SIGINT SIGTERM

# Verifica portas
check_port() {
  local port=$1
  local service=$2
  if lsof -i :$port >/dev/null 2>&1; then
    echo -e "${RED}❌ Porta $port ocupada por $service. Pare o processo e tente novamente.${NC}"
    exit 1
  fi
}

check_port 3001 "backend"
check_port 3000 "frontend"

echo -e "🚀 Iniciando ASSEC — backend + frontend..."
echo -e "   Backend: ${BLUE}http://localhost:3001${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Health check: ${YELLOW}/health${NC} (aguardando backend ficar pronto...)"
echo ""

# Inicia backend
if [ "$VERBOSE" = true ]; then
  echo -e "[${BLUE}BACKEND${NC}] Iniciando (logs ativos)..."
  cd backend && npm run start:dev 2>&1 | sed 's/^/[BACKEND] /' | awk '{print "\033[1;34m" $0 "\033[0m"}' &
else
  echo -e "[${BLUE}BACKEND${NC}] Iniciando (modo silencioso)..."
  cd backend && npm run start:dev > /dev/null 2>&1 &
fi
BACKEND_PID=$!

# Aguarda health check
HEALTH_TIMEOUT=60
for i in $(seq 1 $HEALTH_TIMEOUT); do
  if curl -sf http://localhost:3001/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend pronto! Iniciando frontend...${NC}"
    break
  fi
  if [ $i -eq $HEALTH_TIMEOUT ]; then
    echo -e "${RED}❌ Timeout: /health não respondeu após $HEALTH_TIMEOUT segundos. Verifique se o backend subiu corretamente.${NC}"
    cleanup
  fi
  sleep 1
done

# Inicia frontend
if [ "$VERBOSE" = true ]; then
  echo -e "[${GREEN}FRONTEND${NC}] Iniciando (logs ativos)..."
  cd ../app/web && npm run dev 2>&1 | sed 's/^/[FRONTEND] /' | awk '{print "\033[1;32m" $0 "\033[0m"}' &
else
  echo -e "[${GREEN}FRONTEND${NC}] Iniciando (modo silencioso)..."
  cd ../app/web && npm run dev > /dev/null 2>&1 &
fi
FRONTEND_PID=$!

echo -e "${GREEN}✅ Serviços iniciados. Pressione Ctrl+C para parar.${NC}"

# Mantém o script vivo até ser interrompido
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
