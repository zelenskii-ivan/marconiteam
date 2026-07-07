import { useEffect, useState } from 'react'
import { business } from '../data/business'
import { useOpenStatus } from '../utils/schedule'
import { trackGoal } from '../utils/analytics'
import {
  IconClock,
  IconDog,
  IconMouse,
  IconPastry,
  IconPhone,
  IconPin,
  IconStar,
  IconTelegram,
  IconWhatsApp,
} from './Icons'
import './Hero.css'

export function Hero() {
  const status = useOpenStatus()
  const [scrolled, setScrolled] = useState(false)
  const quickFacts = ['Завтраки весь день', 'Заказ в 2 тапа']
  const highlights = [
    { icon: IconClock, value: business.hoursDisplay.split(' ')[1], label: 'каждый день' },
    { icon: IconStar, value: `${business.rating}/5`, label: 'по отзывам гостей' },
    { icon: IconPastry, value: 'Свежая выпечка', label: 'печём несколько раз в день' },
    { icon: IconDog, value: 'Dog-friendly', label: 'рады гостям с питомцами' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero" id="top">
      <picture className="hero-photo">
        <source media="(max-width: 767px)" srcSet="/images/hero-mobile.webp" type="image/webp" />
        <img
          src="/images/hero.webp"
          alt="Кофейня-пекарня «Маркони» — свежая выпечка и кофе на Гидрострое"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      <div className="hero-content container">
        <div className="hero-copy" data-reveal="hero">
          <div className="hero-badges" aria-label="Быстрые преимущества">
            <p className={`hero-status ${status.isOpen ? 'hero-status--open' : 'hero-status--closed'}`}>
              <span className="hero-status-dot" aria-hidden="true" />
              {status.text}
            </p>
            {quickFacts.map((fact) => (
              <p key={fact} className="hero-chip">{fact}</p>
            ))}
          </div>

          <h1 className="hero-title">{business.name}</h1>
          <p className="hero-slogan">Место, где начинается доброе утро</p>

          <p className="hero-sub">
            Свежий кофе, горячая выпечка, ароматные десерты и уютная атмосфера
            каждый день на Гидрострое.
          </p>

          <a
            className="hero-address"
            href={business.yandexMapsSearch}
            target="_blank"
            rel="noopener"
          >
            <IconPin size={18} />
            <span>
              {business.city}, {business.address}, {business.addressNote.split(' · ')[0]}
            </span>
          </a>

          <div className="hero-cta">
            <a
              className="btn btn--primary"
              href={business.telegramUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackGoal('telegram')}
            >
              <IconTelegram size={20} />
              Telegram
            </a>
            <a
              className="btn btn--outline btn--wa"
              href={business.whatsappUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackGoal('whatsapp')}
            >
              <IconWhatsApp size={20} />
              WhatsApp
            </a>
            <a
              className="btn btn--outline"
              href={business.phoneHref}
              onClick={() => trackGoal('call')}
            >
              <IconPhone size={20} />
              {business.phoneDisplay}
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Ключевая информация" data-reveal="hero">
          <p className="hero-panel-kicker">Сегодня в Маркони</p>
          <ul className="hero-highlights">
            {highlights.map((item) => (
              <li key={item.label}>
                <item.icon size={20} />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <a
          className={`hero-scroll ${scrolled ? 'hero-scroll--hidden' : ''}`}
          href="#menu"
          aria-label="Листайте вниз к меню"
        >
          <span className="hero-scroll-mouse" aria-hidden="true">
            <IconMouse size={28} />
          </span>
          <span>Листайте вниз</span>
        </a>
      </div>
    </section>
  )
}
