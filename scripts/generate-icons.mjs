// Генерация PNG-иконок PWA из SVG. Запуск: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const svg = (pad) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#14100d"/>
  <circle cx="256" cy="256" r="${190 - pad}" fill="#d9995b"/>
  <text x="256" y="${330 - pad * 0.4}" text-anchor="middle" font-family="Georgia, serif"
        font-weight="700" font-size="${240 - pad}" fill="#14100d">М</text>
</svg>`)

await mkdir('public/icons', { recursive: true })

await sharp(svg(0)).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svg(0)).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(svg(40)).resize(512, 512).png().toFile('public/icons/icon-512-maskable.png')
await sharp(svg(0)).resize(180, 180).png().toFile('public/icons/apple-touch-icon.png')

console.log('icons generated')
