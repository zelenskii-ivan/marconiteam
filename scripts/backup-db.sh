#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p backups

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="backups/marconi-db-$STAMP.sql.gz"

echo "→ Создаём резервную копию PostgreSQL в $BACKUP_FILE"

docker compose exec -T db pg_dump \
  -U "${POSTGRES_USER:-marconi}" \
  -d "${POSTGRES_DB:-marconi}" \
  --no-owner \
  --no-privileges | gzip > "$BACKUP_FILE"

echo "✓ Резервная копия готова: $BACKUP_FILE"
