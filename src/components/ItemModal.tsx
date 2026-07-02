import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MenuItem } from '../data/types'
import { NutritionFacts } from './NutritionFacts'
import './ItemModal.css'

interface Props {
  item: MenuItem | null
  onClose: () => void
}

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const listItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

export function ItemModal({ item, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            layoutId={`card-${item.id}`}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Закрыть">
              ✕
            </button>

            <div
              className="modal-hero"
              style={{ background: `radial-gradient(circle at 30% 25%, ${item.gradient[1]}, ${item.gradient[0]})` }}
            >
              <motion.span
                className="modal-emoji"
                initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              >
                {item.emoji}
              </motion.span>
              <div className="modal-hero-text">
                <span className="modal-tagline">{item.tagline}</span>
                <h3 className="modal-name">{item.name}</h3>
                <span className="modal-price">{item.price} ₽</span>
              </div>
            </div>

            <div className="modal-body">
              <motion.p
                className="modal-desc"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
              >
                {item.description}
              </motion.p>

              <div className="modal-columns">
                <div>
                  <h4 className="modal-h4">Рецепт</h4>
                  <motion.ul className="modal-chips" variants={listStagger} initial="hidden" animate="show">
                    {item.recipe.ingredients.map((ing) => (
                      <motion.li key={ing} variants={listItem}>
                        {ing}
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.ol className="modal-steps" variants={listStagger} initial="hidden" animate="show">
                    {item.recipe.steps.map((step, i) => (
                      <motion.li key={i} variants={listItem}>
                        <span className="modal-step-num">{i + 1}</span>
                        {step}
                      </motion.li>
                    ))}
                  </motion.ol>
                </div>

                <div>
                  <h4 className="modal-h4">Пищевая ценность</h4>
                  <NutritionFacts nutrition={item.nutrition} />
                  <p className="modal-note">
                    Значения ориентировочные и могут немного отличаться от партии к партии.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
