import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './RoastSection.css'

/** Секция обжарки: пламя, которое превращается в кофейное зерно и обратно */

const flameLayers = [
  {
    d: 'M120 56 C 152 98, 172 142, 163 184 C 157 216, 140 234, 120 236 C 100 234, 83 216, 77 184 C 68 142, 88 98, 120 56 Z',
    fill: '#d9663a',
    dur: 0.75,
  },
  {
    d: 'M120 96 C 143 126, 156 156, 150 186 C 146 210, 134 224, 120 226 C 106 224, 94 210, 90 186 C 84 156, 97 126, 120 96 Z',
    fill: '#f2913d',
    dur: 0.6,
  },
  {
    d: 'M120 136 C 134 154, 141 172, 137 192 C 134 208, 128 216, 120 218 C 112 216, 106 208, 103 192 C 99 172, 106 154, 120 136 Z',
    fill: '#ffd166',
    dur: 0.5,
  },
]

const sparks = [
  { x: 96, delay: 0, drift: 14 },
  { x: 112, delay: 0.5, drift: -10 },
  { x: 128, delay: 0.2, drift: 12 },
  { x: 144, delay: 0.8, drift: -14 },
  { x: 104, delay: 1.1, drift: 8 },
  { x: 136, delay: 1.4, drift: -8 },
]

function FireBean() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'fire' | 'bean'>('fire')

  useEffect(() => {
    if (reduced) {
      setPhase('bean')
      return
    }
    const t = setInterval(() => setPhase((p) => (p === 'fire' ? 'bean' : 'fire')), 3200)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <div className="firebean">
      <div className="firebean-glow" data-phase={phase} />
      <svg viewBox="0 0 240 300" className="firebean-svg" aria-hidden="true">
        <ellipse cx="120" cy="262" rx="76" ry="12" fill="rgba(0,0,0,0.4)" />

        {/* Ударная волна при каждом превращении */}
        {!reduced && (
          <motion.circle
            key={phase}
            cx="120"
            cy="160"
            r="46"
            fill="none"
            stroke={phase === 'bean' ? '#ffd166' : '#d9663a'}
            strokeWidth="3"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        )}

        <AnimatePresence mode="wait">
          {phase === 'fire' ? (
            <motion.g
              key="fire"
              initial={{ scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.1, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            >
              {flameLayers.map((l, i) => (
                <motion.path
                  key={i}
                  d={l.d}
                  fill={l.fill}
                  animate={{ scaleY: [1, 1.09, 0.95, 1.05, 1], skewX: [0, -3, 3, -2, 0] }}
                  transition={{ duration: l.dur, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                />
              ))}
              {sparks.map((s, i) => (
                <motion.circle
                  key={`s${i}`}
                  cx={s.x}
                  cy={230}
                  r="3"
                  fill="#ffd166"
                  animate={{
                    y: [0, -110, -170],
                    x: [0, s.drift, -s.drift * 0.4],
                    opacity: [0, 1, 0],
                    scale: [1, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.6,
                    delay: s.delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.g>
          ) : (
            <motion.g
              key="bean"
              initial={{ scale: 0, rotate: -140 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 100, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <ellipse cx="120" cy="158" rx="56" ry="76" fill="#6f4a2f" />
              <ellipse cx="102" cy="128" rx="16" ry="26" fill="rgba(245,234,217,0.16)" />
              <path
                d="M120 84 C 96 130, 144 186, 120 232"
                fill="none"
                stroke="#3b2417"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Жар от свежеобжаренного зерна */}
              {!reduced && (
                <motion.ellipse
                  cx="120"
                  cy="158"
                  rx="56"
                  ry="76"
                  fill="none"
                  stroke="#f2913d"
                  strokeWidth="2"
                  animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              )}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  )
}

const roastChips = ['Светлая — для фильтра', 'Средняя — для эспрессо', 'Тёмная — для рафа']

export function RoastSection() {
  return (
    <section className="section roast" id="roast">
      <div className="container roast-grid">
        <motion.div
          className="roast-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <FireBean />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">Обжарка</span>
          <h2 className="section-title">Огонь превращается в зерно</h2>
          <p className="section-sub">
            Обжариваем зерно сами, небольшими партиями, каждые три дня. Ростер стоит
            прямо за баром — смотрите, слушайте первый крэк и забирайте самое свежее
            зерно домой.
          </p>
          <div className="roast-chips">
            {roastChips.map((c, i) => (
              <motion.span
                key={c}
                className="roast-chip"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
