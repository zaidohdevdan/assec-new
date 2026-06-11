#!/bin/bash
mkdir -p /home/deploy/backups
docker exec assec-postgres-prod pg_dump -U assec assec_db | gzip -9 > /home/deploy/backups/assec_$(date +%Y%m%d_%H%M).sql.gz
find /home/deploy/backups -name "assec_*.sql.gz" -mtime +2 -delete
echo "✅ Backup realizado e rotacionado."