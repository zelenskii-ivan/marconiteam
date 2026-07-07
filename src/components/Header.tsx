import { useEffect, useState } from 'react'
import { business } from '../data/business'
import { trackGoal } from '../utils/analytics'
import { IconPhone } from './Icons'
import './Header.css'

const links = [
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О нас' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-inner container">
        <a className="header-logo" href="#top" onClick={() => setOpen(false)}>
          <span className="header-logo-mark" aria-hidden="true">М</span>
          Маркони
        </a>

        <nav
          id="site-nav"
          className={`header-nav ${open ? 'header-nav--open' : ''}`}
          aria-label="Основная навигация"
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className={`header-burger ${open ? 'header-burger--open' : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <a
          className="header-phone"
          href={business.phoneHref}
          aria-label={`Позвонить: ${business.phoneDisplay}`}
          onClick={() => trackGoal('call')}
        >
          <IconPhone size={20} />
          <span className="header-phone-num">{business.phoneDisplay}</span>
        </a>
      </div>
    </header>
  )
}
