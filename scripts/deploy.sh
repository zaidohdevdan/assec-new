#!/bin/bash
# deploy.sh - Script de deploy automatizado
# ✅ CORREÇÃO: Lê variáveis do .env em vez de usar valores hardcoded

set -e

# ✅ CORREÇÃO: Carrega variáveis do .env
set -a
source /home/deploy/assecce/.env
set +a

cd /home/deploy/assecce || exit 1

echo "🚀 Iniciando deploy..."

# ============================================
# BACKUP DO BANCO
# ============================================
echo "💾 Backup do banco ${DB_NAME}..."
mkdir -p /home/deploy/backups
docker exec assec-postgres-prod pg_dump -U ${DB_USER} ${DB_NAME} | gzip -9 > /home/deploy/backups/assec_$(date +%Y%m%d_%H%M).sql.gz
find /home/deploy/backups -name "assec_*.sql.gz" -mtime +2 -delete

# ============================================
# ATUALIZAR CÓDIGO
# ============================================
if [ -d .git ]; then
    echo "📥 Atualizando código do Git..."
    git fetch origin main
    BEFORE=$(git rev-parse HEAD)
    git reset --hard origin/main
    AFTER=$(git rev-parse HEAD)

    if [ "$BEFORE" = "$AFTER" ]; then
        echo "⚠️ Nenhuma alteração no Git. Saindo..."
        exit 0
    fi

    echo "✅ Código atualizado: ${BEFORE:0:7} → ${AFTER:0:7}"
else
    echo "ℹ️ Diretório não é um repositório Git. Pulando atualização via Git..."
fi

# ============================================
# BUILD E DEPLOY
# ============================================
echo "🐳 Fazendo build das imagens..."
docker compose build --no-cache backend frontend

echo "🔄 Reiniciando serviços..."
docker compose down
docker compose up -d

# ============================================
# HEALTH CHECK
# ============================================
echo "⏳ Aguardando serviços iniciarem..."
sleep 15

# Verifica se todos os containers estão rodando
SERVICES=("assec-postgres-prod" "assec-backend-prod" "assec-frontend-prod" "assec-nginx-prod")
for service in "${SERVICES[@]}"; do
    if ! docker ps --format '{{.Names}}' | grep -q "^${service}$"; then
        echo "❌ Container $service não está rodando!"
        exit 1
    fi
done

# Verifica endpoint de health
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://assecce.com.br/health || echo "000")
if [ "$HTTP_CODE" != "200" ]; then
    echo "⚠️ Health check retornou HTTP $HTTP_CODE"
    echo "📋 Logs do backend:"
    docker logs --tail 50 assec-backend-prod
    exit 1
fi

# ============================================
# LIMPEZA
# ============================================
echo "🧹 Limpando imagens antigas..."
docker image prune -f

echo "✅ Deploy concluído com sucesso!"
echo "🌐 https://assecce.com.br"