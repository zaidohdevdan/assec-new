#!/bin/bash
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "⚠️ Disco em $DISK_USAGE%. Limpando..."
    docker image prune -af --filter "until=24h"
    docker volume prune -f
    docker builder prune -af --filter "until=24h"
    find /var/log -type f -name "*.log" -mtime +3 -delete
    journalctl --vacuum-time=1d
    echo "✅ Limpeza concluída."
else
    echo "✅ Disco OK ($DISK_USAGE%)."
fi