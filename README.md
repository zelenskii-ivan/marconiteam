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
npm install
cp .env.example .env          # задайте VITE_SITE_URL и VITE_YM_COUNTER_ID
npm run dev                   # http://localhost:5173
```

## Сборка

```bash
npm run build                 # dist/ + генерация иконок и WebP
npm run preview               # локальный просмотр dist/
```

Перед первым запуском dev без сборки выполните `npm run images` — создаст плейсхолдеры в `public/images/`.

## Деплой в продакшен

### Вариант A — Docker (рекомендуется)

```bash
# Локальная проверка
./scripts/deploy-local.sh     # http://localhost:8080

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
