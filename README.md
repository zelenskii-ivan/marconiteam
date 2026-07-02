# Маркони — кофейня и пекарня

Максимально анимированный сайт-витрина кофейни-пекарни «Маркони»: меню напитков
и выпечки с рецептами и пищевой ценностью каждой позиции. Работает как PWA —
на iPhone устанавливается как приложение.

## Стек

- **Vite + React 19 + TypeScript** — сборка и UI
- **Framer Motion** — все анимации (параллакс, shared-element переходы, stagger-реveal, 3D-tilt)
- **vite-plugin-pwa (Workbox)** — офлайн-режим и установка на домашний экран
- **@fontsource** — самостоятельно хостимые шрифты (никаких запросов к Google Fonts)

## Запуск

```bash
npm install
npm run dev        # разработка, http://localhost:5173
npm run build      # прод-сборка в dist/
npm run preview    # локальный просмотр прод-сборки (нужен для проверки PWA)
```

Иконки PWA перегенерировать: `node scripts/generate-icons.mjs`.

## Структура (модульная)

```
src/
  data/            # данные меню — правятся без кода
    types.ts       # типы MenuItem / Recipe / Nutrition
    drinks.ts      # напитки
    pastries.ts    # выпечка
  components/      # каждый блок = компонент + свой CSS
    Loader         # интро-заставка
    Header         # шапка (прячется при скролле вниз)
    Hero           # первый экран: пар, параллакс, зёрна
    Marquee        # бегущая строка
    MenuSection    # секция меню (переиспользуется для напитков и выпечки)
    MenuCard       # карточка с 3D-tilt
    ItemModal      # модалка: рецепт + пищевая ценность (shared-element)
    NutritionFacts # анимированные шкалы Б/Ж/У
    About          # о пекарне
    Privacy        # раздел о персональных данных
    Footer
  styles/global.css  # токены дизайна (цвета, шрифты, радиусы)
```

Чтобы добавить позицию в меню — достаточно дописать объект в `src/data/drinks.ts`
или `src/data/pastries.ts`: карточка, модалка, рецепт и КБЖУ появятся автоматически.

## Как устанавливается на iPhone

Открыть сайт в Safari → «Поделиться» → «На экран “Домой”». Сайт запускается
в полноэкранном режиме (standalone), работает офлайн благодаря service worker,
учитывает вырез экрана (safe-area) и настройку «уменьшение движения».

## Защита данных (privacy by design)

- Сайт **не собирает персональные данные**: нет форм, cookies, localStorage-трекинга.
- **Ноль сторонних запросов**: шрифты и все ресурсы хостятся локально.
- Строгая **Content Security Policy** в `index.html`: только собственные скрипты,
  запрет фреймов (`frame-ancestors 'none'`), запрет отправки форм (`form-action 'none'`).
- `Referrer-Policy: no-referrer`.
- При деплое рекомендуется продублировать CSP HTTP-заголовком и добавить
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
