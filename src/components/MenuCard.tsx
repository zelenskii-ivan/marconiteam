import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MenuItem } from '../data/types'
import './MenuCard.css'

interface Props {
  item: MenuItem
  onSelect: (item: MenuItem) => void
}

export function MenuCard({ item, onSelect }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || !ref.current || e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  function onPointerLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.button
      ref={ref}
      className="menu-card"
      layoutId={`card-${item.id}`}
      onClick={() => onSelect(item)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      aria-haspopup="dialog"
    >
      {item.popular && <span className="menu-card-badge">хит</span>}

      <span
        className="menu-card-art"
        style={{ background: `radial-gradient(circle at 35% 30%, ${item.gradient[1]}, ${item.gradient[0]})` }}
      >
        <motion.span
          className="menu-card-emoji"
          whileHover={reduced ? undefined : { scale: 1.15, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        >
          {item.emoji}
        </motion.span>
      </span>

      <span className="menu-card-body">
        <span className="menu-card-tagline">{item.tagline}</span>
        <span className="menu-card-name">{item.name}</span>
        <span className="menu-card-meta">
          <span>{item.nutrition.kcal} ккал · {item.nutrition.serving}</span>
          <span className="menu-card-price">{item.price} ₽</span>
        </span>
      </span>

      <span className="menu-card-more">рецепт и состав →</span>
    </motion.button>
  )
}
