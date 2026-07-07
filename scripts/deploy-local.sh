#!/usr/bin/env bash
# Локальная проверка прод-сборки в Docker
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Сборка образа..."
docker compose build

echo "→ Запуск на http://localhost:8080"
docker compose up -d

echo "→ Проверка HTTP..."
sleep 2
curl -sf -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080/

echo "✓ Готово. Остановить: docker compose down"
