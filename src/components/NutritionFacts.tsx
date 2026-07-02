import { motion } from 'framer-motion'
import type { Nutrition } from '../data/types'
import './NutritionFacts.css'

/** Референсные максимумы для визуальной шкалы (г на порцию) */
const scale = { protein: 20, fat: 30, carbs: 50 }

const rows = [
  { key: 'protein', label: 'Белки', color: 'var(--pistachio)' },
  { key: 'fat', label: 'Жиры', color: 'var(--caramel)' },
  { key: 'carbs', label: 'Углеводы', color: 'var(--cherry)' },
] as const

export function NutritionFacts({ nutrition }: { nutrition: Nutrition }) {
  return (
    <div className="nutrition">
      <div className="nutrition-head">
        <div>
          <motion.span
            className="nutrition-kcal"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 16 }}
          >
            {nutrition.kcal}
          </motion.span>
          <span className="nutrition-kcal-label">ккал</span>
        </div>
        <span className="nutrition-serving">порция {nutrition.serving}</span>
      </div>

      <div className="nutrition-bars">
        {rows.map((row, i) => {
          const value = nutrition[row.key]
          const pct = Math.min(100, (value / scale[row.key]) * 100)
          return (
            <div className="nutrition-row" key={row.key}>
              <span className="nutrition-label">{row.label}</span>
              <div className="nutrition-track">
                <motion.div
                  className="nutrition-fill"
                  style={{ background: row.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <motion.span
                className="nutrition-value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.12 }}
              >
                {value.toLocaleString('ru-RU')} г
              </motion.span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
