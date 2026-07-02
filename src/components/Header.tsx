import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import './Header.css'

const links = [
  { href: '#drinks', label: 'Напитки' },
  { href: '#pastries', label: 'Выпечка' },
  { href: '#about', label: 'О нас' },
  { href: '#privacy', label: 'Данные' },
]

export function Header() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160 && !open)
    setScrolled(y > 24)
  })

  return (
    <motion.header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="header-inner container">
        <a className="header-logo" href="#top" onClick={() => setOpen(false)}>
          <span className="header-logo-mark">М</span>
          Маркони
        </a>

        <nav className={`header-nav ${open ? 'header-nav--open' : ''}`} aria-label="Основная навигация">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              initial={false}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
            >
              {l.label}
            </motion.a>
          ))}
        </nav>

        <button
          className={`header-burger ${open ? 'header-burger--open' : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </motion.header>
  )
}
