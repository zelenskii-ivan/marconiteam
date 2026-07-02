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
        <motion.svg
          viewBox="0 0 80 84"
          className="loader-cupsvg"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <defs>
            <clipPath id="loader-cup-clip">
              <path d="M24 32 L28 64 Q29 69 34 69 L46 69 Q51 69 52 64 L56 32 Z" />
            </clipPath>
          </defs>
          {/* Струя */}
          <motion.line
            x1="40"
            y1="6"
            x2="40"
            y2="34"
            stroke="#8a5a36"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ pathLength: { duration: 0.35, delay: 0.3 }, opacity: { duration: 1.4, times: [0, 0.85, 1], delay: 0.3 } }}
          />
          {/* Кофе наполняет чашку */}
          <g clipPath="url(#loader-cup-clip)">
            <motion.rect
              x="20"
              width="40"
              height="44"
              fill="#6f4a2f"
              initial={{ y: 70 }}
              animate={{ y: 36 }}
              transition={{ duration: 1.1, delay: 0.45, ease: 'easeOut' }}
            />
          </g>
          {/* Контур чашки */}
          <path
            d="M22 30 L26.5 64.5 Q28 71 34 71 L46 71 Q52 71 53.5 64.5 L58 30"
            fill="none"
            stroke="#f5ead9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M57 38 Q 68 39 66.5 47 Q 65 55 54 53"
            fill="none"
            stroke="#f5ead9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.svg>
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
