#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="${1:-http://localhost:8080}"

echo "→ Проверка главной страницы"
curl -fsS "$BASE_URL/" > /dev/null

echo "→ Проверка кабинета"
curl -fsS "$BASE_URL/account" > /dev/null

echo "→ Проверка юридических страниц"
curl -fsS "$BASE_URL/legal/privacy" > /dev/null
curl -fsS "$BASE_URL/legal/marketing" > /dev/null

echo "→ Проверка API health"
curl -fsS "$BASE_URL/api/health" > /dev/null

echo "→ Проверка API readiness"
curl -fsS "$BASE_URL/api/ready" > /dev/null

echo "✓ Smoke-check пройден для $BASE_URL"
