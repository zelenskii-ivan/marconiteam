import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import './Hero.css'

const title = ['Свежая', 'выпечка', 'и кофе', 'с характером']

const beans = [
  { left: '8%', top: '22%', size: 26, delay: 0 },
  { left: '16%', top: '68%', size: 18, delay: 1.2 },
  { left: '82%', top: '18%', size: 22, delay: 0.6 },
  { left: '90%', top: '58%', size: 16, delay: 1.8 },
  { left: '70%', top: '80%', size: 20, delay: 0.3 },
]

function Steam({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.path
      d={`M ${x} 96 C ${x - 10} 72, ${x + 10} 56, ${x} 34 C ${x - 8} 20, ${x + 6} 10, ${x} 0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0], y: [-2, -14] }}
      transition={{ duration: 3.2, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '38%'])
  const yCup = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-24%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-glow hero-glow--1" />
      <div className="hero-glow hero-glow--2" />

      {!reduced &&
        beans.map((b, i) => (
          <motion.span
            key={i}
            className="hero-bean"
            style={{ left: b.left, top: b.top, fontSize: b.size }}
            animate={{ y: [0, -18, 0], rotate: [0, 20, -12, 0] }}
            transition={{ duration: 7 + i, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            🫘
          </motion.span>
        ))}

      <motion.div className="hero-content container" style={{ y: yText, opacity }}>
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          Кофейня · Пекарня · с 7:30 ежедневно
        </motion.p>

        <h1 className="hero-title">
          {title.map((wordText, i) => (
            <span className="hero-title-line" key={i}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 1.7 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {wordText}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          Печём круассаны 72 слоя, варим кофе на зерне собственной обжарки
          и делимся рецептами каждой позиции — вместе с пищевой ценностью.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <motion.a href="#drinks" className="btn btn--primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            Меню напитков
          </motion.a>
          <motion.a href="#pastries" className="btn btn--ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            Выпечка
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div className="hero-cup" style={{ y: yCup }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="hero-cup-svg">
          <g className="hero-steam">
            <Steam x={80} delay={0} />
            <Steam x={104} delay={1.1} />
            <Steam x={126} delay={2.2} />
          </g>
          <ellipse cx="100" cy="182" rx="64" ry="9" fill="rgba(0,0,0,0.35)" />
          <path
            d="M 46 108 L 56 176 Q 58 184 68 184 L 132 184 Q 142 184 144 176 L 154 108 Z"
            fill="#f5ead9"
          />
          <path d="M 46 108 L 154 108 L 151 126 L 49 126 Z" fill="#d9995b" />
          <path
            d="M 154 116 Q 182 118 178 140 Q 174 160 148 156"
            fill="none"
            stroke="#f5ead9"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <text x="100" y="160" textAnchor="middle" fontSize="26" fontFamily="Georgia, serif" fill="#14100d" fontWeight="700">
            М
          </text>
        </svg>
      </motion.div>

      <motion.a
        href="#drinks"
        className="hero-scroll"
        aria-label="Прокрутить к меню"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
        листайте
      </motion.a>
    </section>
  )
}
