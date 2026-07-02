import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { value: '72', label: 'слоя в каждом круассане' },
  { value: '7:30', label: 'первая выпечка каждый день' },
  { value: '9', label: 'напитков на зерне своей обжарки' },
  { value: '0', label: 'заготовок «со вчера»' },
]

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">О нас</span>
          <h2 className="section-title">Пекарня, которой нечего скрывать</h2>
          <p className="section-sub">
            «Маркони» — маленькая кофейня-пекарня с открытой кухней. Мы публикуем
            рецепты и пищевую ценность каждой позиции, потому что уверены в своих
            продуктах: сливочное масло 82,5%, зерно свежей обжарки и никаких смесей
            быстрого приготовления.
          </p>
        </motion.div>

        <div className="about-stats">
          {stats.map((s, i) => (
            <motion.div
              className="about-stat"
              key={s.label}
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
