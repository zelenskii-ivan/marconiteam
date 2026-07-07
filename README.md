# Кофейня-пекарня «Маркони» — сайт

Одностраничный лендинг для кофейни-пекарни в Краснодаре (район Гидростроителей).
Mobile-first, PWA, готов к деплою в Docker.

## Стек

- **Vite + React 19 + TypeScript** — фронтенд и сборка
- **vite-plugin-pwa** — офлайн и установка на домашний экран
- **nginx** — продакшен-сервер (Docker)
- **Яндекс Метрика** — аналитика и цели (опционально, через `.env`)

## Быстрый старт

```bash
cd /Users/ivanzelenskiy/Projects/marconi-bakery
npm install
cp .env.example .env          # задайте VITE_SITE_URL и VITE_YM_COUNTER_ID
docker compose up -d db       # поднимает локальный PostgreSQL для кабинета
npm run dev:api               # API: http://localhost:3000
npm run dev                   # фронтенд: http://localhost:5173
```

`npm run dev` нужно запускать именно из папки проекта. Ошибка `ENOENT ... /Users/ivanzelenskiy/package.json` означает, что команда была выполнена уровнем выше, не в репозитории.

## Сборка

```bash
npm run build                 # dist/ + генерация иконок и WebP
npm run build:api             # dist-api/
npm run preview               # локальный просмотр dist/
```

Перед первым запуском dev без сборки выполните `npm run images` — создаст плейсхолдеры в `public/images/`.

## Деплой в продакшен

### Вариант A — Docker (рекомендуется)

```bash
# Локальная проверка
./scripts/deploy-local.sh     # http://localhost:8080
./scripts/smoke-check.sh      # smoke-check основных экранов и API
./scripts/backup-db.sh        # резервная копия PostgreSQL

# На сервере (Timeweb, REG.RU, Yandex Cloud)
docker compose build
docker compose up -d
```

Проброс HTTPS — через reverse proxy хостера или certbot на nginx. После включения TLS раскомментируйте в `nginx/`:
- редирект HTTP→HTTPS в `default.conf`
- `Strict-Transport-Security` в `security-headers.conf`

### Вариант B — статика

Загрузите содержимое `dist/` на хостинг. Настройте:
- редирект всех маршрутов на `index.html` (SPA)
- заголовки из `nginx/security-headers.conf`

### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_SITE_URL` | Публичный URL (`https://marcony-krd.ru`) — canonical, OG, sitemap |
| `VITE_YM_COUNTER_ID` | Номер счётчика Яндекс Метрики |
| `VITE_API_PROXY_TARGET` | Локальный адрес API для Vite (`http://localhost:3000`) |
| `POSTGRES_DB` | Имя базы PostgreSQL для личного кабинета |
| `POSTGRES_USER` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL |
| `DATABASE_URL` | Строка подключения API к PostgreSQL |
| `PERSONAL_DATA_CONSENT_VERSION` | Версия согласия на обработку ПДн |
| `MARKETING_CONSENT_VERSION` | Версия маркетингового согласия |
| `PRIVACY_CONTACT_EMAIL` | Email для privacy-обращений и статусов по ПДн |
| `SMS_PROVIDER` | Провайдер OTP, сейчас `log` для dev/stage |
| `EXPOSE_DEBUG_OTP` | Показывать OTP в dev-ответе API |

## Эксплуатация

- `GET /api/health` — liveness-check API
- `GET /api/ready` — readiness-check API с проверкой базы
- `npm run smoke` — быстрый smoke-check сайта, кабинета и API
- `./scripts/backup-db.sh` — ручной backup PostgreSQL в `backups/`

## Личный кабинет

Собрана production-ready основа личного кабинета с авторизацией по SMS-коду, сессиями в `httpOnly` cookie, адресами, избранным, заказами и privacy-запросами.

Что уже есть:
- `/account` — вход и кабинет клиента
- `Fastify + PostgreSQL` API под `/api`
- логирование согласий, экспорт данных и заявка на удаление
- история privacy-запросов и контакт для обращений по ПДн
- Docker-схема `web + api + db`

Что нужно перед реальным продакшен-запуском:
- подключить настоящий SMS-шлюз вместо `SMS_PROVIDER=log`
- опубликовать тексты согласий и политики обработки ПДн
- назначить ответственного за обработку заявок на удаление/экспорт
- настроить бэкапы PostgreSQL и мониторинг API

## Редактирование контента

Без CMS на первом этапе — правки в файлах данных, затем `npm run build`:

| Файл | Что менять |
|------|------------|
| `src/data/business.ts` | Телефон, адрес, график, ссылки |
| `src/data/menu.ts` | Позиции меню, цены, категории |
| `src/components/Reviews.tsx` | Отзывы |
| `src/components/About.tsx` | Текст «О нас» |
| `public/images/*.webp` | Фото (сохраните имена файлов) |

### Замена фото

1. Положите WebP в `public/images/` с теми же именами:
   - `hero.webp`, `hero-mobile.webp` — первый экран
   - `about-interior.webp`, `about-terrace.webp`, `about-counter.webp`
   - `og.webp` — превью в соцсетях (1200×630)
2. Пересоберите: `npm run build`

## Аналитика и мониторинг

**Яндекс Метрика** — задайте `VITE_YM_COUNTER_ID` в `.env`. Цели:
`call`, `telegram`, `whatsapp`, `route`, `scroll75`

**UptimeRobot** — добавьте мониторинг URL сайта (проверка каждые 5 мин), уведомление в Telegram владельцу.

**Яндекс Вебмастер / Google Search Console** — подтвердите домен, отправьте sitemap: `https://ваш-домен/sitemap.xml`

## Структура проекта

```
src/
  data/           # business.ts, menu.ts — контакты и меню
  components/     # блоки лендинга
  utils/          # schedule.ts, analytics.ts
public/
  images/         # WebP-фото
  icons/          # PWA-иконки (генерируются)
nginx/            # конфиг продакшен-сервера
scripts/          # generate-icons, generate-images, deploy-local
```

## Чеклист перед публикацией

- [ ] Заменить плейсхолдер-фото реальными кадрами
- [ ] Сверить цены в `menu.ts` с прайсом
- [ ] Уточнить график работы в `business.ts`
- [ ] Заменить черновые отзывы реальными с Яндекс Карт
- [ ] Зарегистрировать домен, настроить DNS
- [ ] Задать `VITE_SITE_URL` и собрать заново
- [ ] Подключить Яндекс Метрику
- [ ] Настроить UptimeRobot
- [ ] Добавить сайт в Яндекс Вебмастер
- [ ] Проверить PageSpeed (цель ≥ 85 mobile)

## CMS (следующий этап)

ТЗ предусматривает админ-панель для владельца. Текущая версия — статический сайт с правкой данных в репозитории. Для CMS рекомендуется **Directus** или **Strapi** + автоматическая пересборка при изменении контента.
