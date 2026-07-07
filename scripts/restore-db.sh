#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Использование: ./scripts/restore-db.sh backups/file.sql.gz" >&2
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "✗ Файл не найден: $BACKUP_FILE" >&2
  exit 1
fi

echo "→ Восстанавливаем базу из $BACKUP_FILE"

gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql \
  -U "${POSTGRES_USER:-marconi}" \
  -d "${POSTGRES_DB:-marconi}"

echo "✓ Восстановление завершено"
