/**
 * Единая точка правды о заведении: контакты, график, ссылки.
 * Все правки контактов и графика — только здесь.
 */
export const business = {
  name: 'Маркони',
  fullName: 'Кофейня-пекарня «Маркони»',
  slogan: 'Кофе и выпечка на Гидрострое',
  /** Публичный URL — задаётся в .env (VITE_SITE_URL) */
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://marcony-krd.ru',
  city: 'Краснодар',
  address: 'ул. им. Валерия Гассия, 4/7к1',
  addressNote: 'подъезд 2 · район Гидростроителей',
  phoneDisplay: '+7 (989) 289-47-77',
  phoneHref: 'tel:+79892894777',
  telegramUrl: 'https://t.me/+79892894777',
  whatsappUrl: 'https://wa.me/79892894777',

  /** График работы: ежедневно. Час открытия уточняется у заказчика. */
  hours: { open: 8, close: 22 },
  hoursDisplay: 'ежедневно 8:00–22:00',

  rating: 4.8,
  award: 'Хорошее место 2026',

  yandexMapsSearch:
    'https://yandex.ru/maps/?text=' +
    encodeURIComponent('Маркони кофейня Краснодар улица имени Валерия Гассия 4/7к1'),
  yandexMapsWidget:
    'https://yandex.ru/map-widget/v1/?text=' +
    encodeURIComponent('Краснодар, улица имени Валерия Гассия, 4/7к1') +
    '&z=17',
  routeUrl:
    'https://yandex.ru/maps/?rtext=~' +
    encodeURIComponent('Краснодар, улица имени Валерия Гассия, 4/7к1') +
    '&rtt=auto',

  nearestStop: 'Остановка «Улица Валерия Гассия» — 350 м пешком',
  parking: 'Бесплатная парковка вдоль дома',
  accessibility: 'Доступно для колясок и маломобильных гостей',
  petsAllowed: 'Можно с собакой — ждём на летней террасе',
  payment: 'Наличные · карта · QR-код (СБП)',
} as const
