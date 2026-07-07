export type CategoryId = 'pastry' | 'coffee' | 'homemade'

export interface Category {
  id: CategoryId
  label: string
}

export interface MenuItem {
  id: string
  category: CategoryId
  name: string
  description: string
  /** Цена как строка: «от 115 ₽», «490 ₽/кг» */
  price: string
  /** Плейсхолдер до фотосессии: эмодзи на тёплом градиенте */
  emoji: string
  badge?: 'хит' | 'новинка'
  /** Скрыть позицию, не удаляя запись */
  hidden?: boolean
}

export const categories: Category[] = [
  { id: 'pastry', label: 'Выпечка' },
  { id: 'coffee', label: 'Кофе и напитки' },
  { id: 'homemade', label: 'Домашняя продукция' },
]

/**
 * Цены из ТЗ: круассаны от 115 ₽, капучино 220–300 ₽,
 * пельмени 490 ₽/кг, вареники с картофелем 310 ₽/кг.
 * Остальные позиции и цены — черновик, сверить с прайсом заказчика.
 */
export const menu: MenuItem[] = [
  {
    id: 'croissant-classic',
    category: 'pastry',
    name: 'Круассаны в ассортименте',
    description: 'Классический, с шоколадом, миндальный — печём каждое утро',
    price: 'от 115 ₽',
    emoji: '🥐',
    badge: 'хит',
  },
  {
    id: 'cinnamon-bun',
    category: 'pastry',
    name: 'Булочка с корицей',
    description: 'Тёплая, с карамельной корочкой — к утреннему кофе',
    price: '140 ₽',
    emoji: '🌀',
  },
  {
    id: 'khachapuri',
    category: 'pastry',
    name: 'Сытная выпечка',
    description: 'Слойки с сыром и ветчиной, пирожки — спросите на витрине',
    price: 'от 120 ₽',
    emoji: '🥟',
  },
  {
    id: 'dessert',
    category: 'pastry',
    name: 'Десерты дня',
    description: 'Чизкейк, эклеры и сезонные десерты собственного производства',
    price: 'от 180 ₽',
    emoji: '🍰',
  },
  {
    id: 'cappuccino',
    category: 'coffee',
    name: 'Капучино',
    description: 'На зерне свежей обжарки, три объёма — с собой или на террасе',
    price: '220–300 ₽',
    emoji: '☕',
    badge: 'хит',
  },
  {
    id: 'espresso-americano',
    category: 'coffee',
    name: 'Эспрессо / американо',
    description: 'Плотный шот или чёрный кофе — быстро, по пути на работу',
    price: 'от 140 ₽',
    emoji: '🫘',
  },
  {
    id: 'latte-raf',
    category: 'coffee',
    name: 'Латте и раф',
    description: 'Нежные молочные напитки, сиропы на выбор',
    price: 'от 250 ₽',
    emoji: '🥛',
  },
  {
    id: 'tea-cocoa',
    category: 'coffee',
    name: 'Чай и какао',
    description: 'Листовой чай, какао на цельном молоке',
    price: 'от 160 ₽',
    emoji: '🫖',
  },
  {
    id: 'pelmeni',
    category: 'homemade',
    name: 'Пельмени ручной лепки',
    description: 'Свинина + говядина, без сои и ароматизаторов',
    price: '490 ₽/кг',
    emoji: '🥟',
    badge: 'хит',
  },
  {
    id: 'vareniki-potato',
    category: 'homemade',
    name: 'Вареники с картофелем',
    description: 'Домашнее тесто, лепим вручную небольшими партиями',
    price: '310 ₽/кг',
    emoji: '🥔',
  },
  {
    id: 'vareniki-cherry',
    category: 'homemade',
    name: 'Вареники с вишней',
    description: 'Сезонная начинка — уточняйте наличие',
    price: '390 ₽/кг',
    emoji: '🍒',
  },
]
