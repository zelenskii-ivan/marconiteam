import { motion } from 'framer-motion'
import './Loader.css'

const word = 'МАРКОНИ'

export function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      aria-hidden="true"
    >
      <div className="loader-inner">
        <motion.div
          className="loader-cup"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          ☕️
        </motion.div>
        <div className="loader-word">
          {word.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="loader-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          кофейня · пекарня
        </motion.p>
      </div>
    </motion.div>
  )
}
