/**
 * Генерация WebP-плейсхолдеров до фотосессии заказчика.
 * Запуск: node scripts/generate-images.mjs
 * После фотосессии замените файлы в public/images/ (имена сохранить).
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { constants } from 'node:fs'

const OUT = 'public/images'

/** SVG с тёплым градиентом и подписью */
function placeholder({ w, h, stops, label, emoji }) {
  const [c1, c2, c3] = stops
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="r" cx="80%" cy="15%" r="60%">
      <stop offset="0%" stop-color="rgba(217,160,91,0.45)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r)"/>
  <text x="${w / 2}" y="${h / 2 - (emoji ? 20 : 0)}"
        text-anchor="middle" font-size="${Math.min(w, h) * 0.14}">${emoji ?? ''}</text>
  <text x="${w / 2}" y="${h * 0.72}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${Math.max(14, w * 0.028)}"
        fill="rgba(62,46,35,0.55)">${label}</text>
</svg>`)
}

const images = [
  { file: 'hero', w: 1920, h: 1080, stops: ['#e8d5bc', '#d9b48c', '#c98d5f'], label: 'Маркони — витрина', emoji: '☕' },
  { file: 'hero-mobile', w: 800, h: 900, stops: ['#e8d5bc', '#d9b48c', '#c98d5f'], label: 'Маркони', emoji: '☕' },
  { file: 'about-interior', w: 600, h: 800, stops: ['#e9d8bf', '#cfa878', '#b87a4a'], label: 'Интерьер', emoji: '🪴' },
  { file: 'about-terrace', w: 600, h: 800, stops: ['#dfd8bd', '#adaa7d', '#8a8b62'], label: 'Терраса', emoji: '🌿' },
  { file: 'about-counter', w: 600, h: 800, stops: ['#e5cbb4', '#bd8258', '#a66b42'], label: 'Витрина', emoji: '🥐' },
  { file: 'menu-pastry', w: 1600, h: 900, stops: ['#edd8bd', '#daaa77', '#bd7b49'], label: 'Выпечка', emoji: '🥐' },
  { file: 'menu-coffee', w: 1600, h: 900, stops: ['#e0c4a7', '#b48058', '#7f563a'], label: 'Кофе', emoji: '☕' },
  { file: 'menu-homemade', w: 1600, h: 900, stops: ['#eadfca', '#c4b08c', '#8a7657'], label: 'Домашнее', emoji: '🥟' },
  { file: 'og', w: 1200, h: 630, stops: ['#f7f1e8', '#e8d5bc', '#b85c38'], label: 'Кофейня-пекарня «Маркони»', emoji: '' },
]

await mkdir(OUT, { recursive: true })

for (const img of images) {
  const output = `${OUT}/${img.file}.webp`
  try {
    await access(output, constants.F_OK)
    console.log(`skip ${img.file}.webp`)
    continue
  } catch {}

  const svg = placeholder(img)
  await sharp(svg)
    .webp({ quality: 82 })
    .toFile(output)
  console.log(`✓ ${img.file}.webp`)
}

console.log('Done — замените файлы реальными фото, сохранив имена.')
