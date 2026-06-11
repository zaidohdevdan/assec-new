#!/bin/bash
set -e
echo "🚀 Iniciando deploy..."
cd /home/deploy/assecce || exit 1

echo "💾 Backup do banco..."
mkdir -p /home/deploy/backups
docker exec assec-postgres-prod pg_dump -U assec assec_db | gzip -9 > /home/deploy/backups/assec_$(date +%Y%m%d).sql.gz
find /home/deploy/backups -name "assec_*.sql.gz" -mtime +2 -delete

echo "📥 Atualizando código..."
git fetch origin main
git reset --hard origin/main

echo "🐳 Rebuild e restart..."
docker compose down
docker compose build --no-cache backend frontend
docker compose up -d

echo "⏳ Aguardando saúde dos serviços..."
sleep 15
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://assecce.com.br/health || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Deploy concluído com sucesso!"
else
    echo "⚠️ Health check falhou (HTTP $HTTP_CODE). Verifique os logs."
fi