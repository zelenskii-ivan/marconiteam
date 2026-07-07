#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${1:-.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ Не найден файл окружения: $ENV_FILE" >&2
  exit 1
fi

echo "→ Проверка env-файла: $ENV_FILE"

required_vars=(
  VITE_SITE_URL
  POSTGRES_DB
  POSTGRES_USER
  POSTGRES_PASSWORD
  DATABASE_URL
  PERSONAL_DATA_CONSENT_VERSION
  MARKETING_CONSENT_VERSION
  PRIVACY_CONTACT_EMAIL
  SMS_PROVIDER
  EXPOSE_DEBUG_OTP
)

for key in "${required_vars[@]}"; do
  if ! grep -Eq "^${key}=.+" "$ENV_FILE"; then
    echo "✗ Отсутствует обязательная переменная: $key" >&2
    exit 1
  fi
done

if grep -Eq '^EXPOSE_DEBUG_OTP=true$' "$ENV_FILE"; then
  echo "✗ В production нельзя оставлять EXPOSE_DEBUG_OTP=true" >&2
  exit 1
fi

if grep -Eq '^POSTGRES_PASSWORD=(CHANGE_ME_STRONG_PASSWORD|marconi_dev_password)$' "$ENV_FILE"; then
  echo "✗ Нужно заменить пароль PostgreSQL на production-секрет" >&2
  exit 1
fi

if grep -Eq '^SMS_PROVIDER=log$' "$ENV_FILE"; then
  echo "! Предупреждение: SMS_PROVIDER=log. Для настоящего продакшена нужен реальный SMS-провайдер."
fi

echo "→ Проверка docker compose"
docker compose --env-file "$ENV_FILE" config -q

echo "→ Проверка production-сборок"
npm run build > /dev/null
npm run build:api > /dev/null

echo "✓ Release-check пройден"
