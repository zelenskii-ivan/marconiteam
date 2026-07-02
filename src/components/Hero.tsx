import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { PourScene } from './PourScene'
import './Hero.css'

const title = ['Свежая', 'выпечка', 'и кофе', 'с характером']

const beans = [
  { left: '8%', top: '22%', size: 26, delay: 0 },
  { left: '16%', top: '68%', size: 18, delay: 1.2 },
  { left: '82%', top: '18%', size: 22, delay: 0.6 },
  { left: '90%', top: '58%', size: 16, delay: 1.8 },
  { left: '70%', top: '80%', size: 20, delay: 0.3 },
]

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
        <PourScene />
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
