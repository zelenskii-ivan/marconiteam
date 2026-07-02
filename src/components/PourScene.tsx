import { motion, useReducedMotion } from 'framer-motion'

/** Сцена: турка наливает кофе в чашку, брызги, волны, пар */

const wave1 =
  'M96 234 Q 128 226 160 234 T 224 234 L 224 305 L 96 305 Z'
const wave2 =
  'M96 237 Q 128 244 160 237 T 224 237 L 224 305 L 96 305 Z'

const drops = [
  { x: -30, y: -36, r: 4.5, delay: 0 },
  { x: 28, y: -42, r: 4, delay: 0.3 },
  { x: -44, y: -20, r: 3.2, delay: 0.65 },
  { x: 42, y: -24, r: 4.2, delay: 0.95 },
  { x: -16, y: -52, r: 3, delay: 1.3 },
  { x: 18, y: -58, r: 3.4, delay: 1.6 },
  { x: 34, y: -46, r: 2.8, delay: 1.9 },
]

function SteamCurl({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.path
      d={`M ${x} 196 C ${x - 9} 176, ${x + 9} 162, ${x} 142 C ${x - 7} 128, ${x + 5} 118, ${x} 106`}
      fill="none"
      stroke="rgba(245,234,217,0.55)"
      strokeWidth="4.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0], y: [-2, -16] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function PourScene() {
  const reduced = useReducedMotion()

  return (
    <svg viewBox="0 0 320 380" className="pour-scene" aria-hidden="true">
      <defs>
        <clipPath id="cup-clip">
          <path d="M104 210 L111 290 Q 113 298 123 298 L197 298 Q 207 298 209 290 L216 210 Z" />
        </clipPath>
        <linearGradient id="coffee-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a36" />
          <stop offset="1" stopColor="#3b2417" />
        </linearGradient>
      </defs>

      {/* Пар */}
      {!reduced && (
        <g>
          <SteamCurl x={118} delay={0.4} />
          <SteamCurl x={202} delay={1.6} />
        </g>
      )}

      {/* Турка */}
      <motion.g
        animate={reduced ? undefined : { rotate: [-2, 2, -2] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '30% 60%' }}
      >
        <path d="M30 22 L70 36" stroke="#d9995b" strokeWidth="9" strokeLinecap="round" />
        <path d="M66 34 L152 10 L166 62 L88 86 Z" fill="#d9995b" />
        <path d="M66 34 L152 10 L156 24 L70 48 Z" fill="#e8b478" />
      </motion.g>

      {/* Струя кофе */}
      <motion.path
        d="M164 64 C 163 110, 161 160, 160 208"
        fill="none"
        stroke="#6f4a2f"
        strokeWidth="7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2.3, duration: 0.5, ease: 'easeIn' }}
      />
      {!reduced && (
        <motion.path
          d="M164 64 C 163 110, 161 160, 160 208"
          fill="none"
          stroke="#c9986a"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="10 16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9, strokeDashoffset: [0, -52] }}
          transition={{
            opacity: { delay: 2.8, duration: 0.3 },
            strokeDashoffset: { duration: 0.45, repeat: Infinity, ease: 'linear', delay: 2.8 },
          }}
        />
      )}

      {/* Брызги от струи */}
      {!reduced &&
        drops.map((d, i) => (
          <motion.circle
            key={i}
            cx={160}
            cy={210}
            r={d.r}
            fill="#8a5a36"
            initial={{ opacity: 0 }}
            animate={{
              x: [0, d.x * 0.65, d.x],
              y: [0, d.y, 10],
              opacity: [0, 1, 0],
              scale: [1, 1, 0.5],
            }}
            transition={{
              duration: 1.05,
              delay: 2.9 + d.delay,
              repeat: Infinity,
              repeatDelay: 0.9,
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Чашка */}
      <ellipse cx="160" cy="314" rx="72" ry="10" fill="rgba(0,0,0,0.35)" />
      <path
        d="M100 208 L108 292 Q 110 302 122 302 L198 302 Q 210 302 212 292 L220 208 Z"
        fill="#f5ead9"
      />
      <path
        d="M216 222 Q 250 224 246 248 Q 242 272 208 266"
        fill="none"
        stroke="#f5ead9"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Кофе в чашке: волна */}
      <g clipPath="url(#cup-clip)">
        <motion.path
          fill="url(#coffee-grad)"
          initial={{ d: wave1, y: 60 }}
          animate={
            reduced
              ? { y: 0 }
              : { d: [wave1, wave2, wave1], y: 0 }
          }
          transition={{
            y: { delay: 2.5, duration: 1.4, ease: 'easeOut' },
            d: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 },
          }}
        />
        {/* Всплеск в точке падения струи */}
        {!reduced && (
          <motion.ellipse
            cx="160"
            cy="236"
            rx="14"
            ry="4"
            fill="#c9986a"
            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 2.9 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        )}
      </g>

      {/* Ободок чашки */}
      <path d="M100 208 L220 208" stroke="#d9995b" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
