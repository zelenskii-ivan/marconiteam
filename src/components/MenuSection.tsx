import { motion } from 'framer-motion'
import type { MenuItem } from '../data/types'
import { MenuCard } from './MenuCard'
import './MenuSection.css'

interface Props {
  id: string
  label: string
  title: string
  subtitle: string
  items: MenuItem[]
  onSelect: (item: MenuItem) => void
}

export function MenuSection({ id, label, title, subtitle, items, onSelect }: Props) {
  return (
    <section className="section menu-section" id={id}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-sub">{subtitle}</p>
        </motion.div>

        <div className="menu-grid">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}
