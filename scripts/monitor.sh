#!/bin/bash
echo "=== 📊 STATUS VPS ==="
free -h
df -h /
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
swapon --show