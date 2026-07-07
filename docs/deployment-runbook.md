# Deployment Runbook

Краткий технический регламент для staging / production запуска проекта `Маркони`.

## 1. Что подготовить заранее

- сервер с Docker и Docker Compose
- DNS домена, направленный на сервер
- `.env` с production-секретами
- SMTP/SMS/monitoring решения по фактическому контуру
- ответственный email для privacy-обращений

## 2. Обязательные production-параметры

Основа:

- `VITE_SITE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `PERSONAL_DATA_CONSENT_VERSION`
- `MARKETING_CONSENT_VERSION`
- `PRIVACY_CONTACT_EMAIL`

Безопасность:

- `EXPOSE_DEBUG_OTP=false`
- сильный пароль PostgreSQL
- реальный `SMS_PROVIDER` вместо `log`

## 3. Порядок выкладки

1. Скопировать проект на сервер.
2. Создать `.env` на основе `.env.production.example`.
3. Прогнать `./scripts/release-check.sh .env`.
4. Выполнить `docker compose --env-file .env build`.
5. Выполнить `docker compose --env-file .env up -d`.
6. Прогнать `./scripts/smoke-check.sh`.
7. Проверить `GET /api/health` и `GET /api/ready`.
8. Подключить HTTPS и включить HSTS.

## 4. После выкладки

- проверить вход в `/account`
- проверить создание privacy request
- проверить backup базы
- включить внешний uptime-monitoring
- проверить логи `docker compose logs -f api web db`

## 5. Бэкапы и восстановление

Ручной backup:

```bash
./scripts/backup-db.sh
```

Восстановление:

```bash
./scripts/restore-db.sh backups/marconi-db-YYYYMMDD-HHMMSS.sql.gz
```

Для продакшена нужен регулярный backup job вне ручного режима.

## 6. Что ещё обязательно до настоящего продакшена

- финальные юридические документы с реальными реквизитами
- реальный SMS-шлюз
- внешний мониторинг и алерты
- политика хранения и удаления персональных данных
- регламент обработки экспортов и удалений по 152-ФЗ
