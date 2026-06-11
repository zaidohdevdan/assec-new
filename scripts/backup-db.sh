#!/bin/bash
# backup-db.sh - Backup comprimido e rotacionado
# ✅ CORREÇÃO: Lê variáveis do .env em vez de usar valores hardcoded

set -e

# ✅ CORREÇÃO: Carrega variáveis do .env
set -a
source /home/deploy/assecce/.env
set +a

BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M)
BACKUP_FILE="$BACKUP_DIR/assec_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

# ✅ CORREÇÃO: Usa variáveis do .env
echo "💾 Iniciando backup do banco ${DB_NAME}..."
docker exec assec-postgres-prod pg_dump -U ${DB_USER} ${DB_NAME} | gzip -9 > "$BACKUP_FILE"

# Calcula tamanho
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

# Mantém apenas últimos 2 backups (economia de disco)
find "$BACKUP_DIR" -name "assec_*.sql.gz" -mtime +2 -delete

echo "✅ Backup criado: $BACKUP_FILE ($SIZE)"
echo "📦 Backups mantidos: 2 dias"