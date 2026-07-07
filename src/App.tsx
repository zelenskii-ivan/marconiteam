import { useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Menu } from './components/Menu'
import { About } from './components/About'
import { Reviews } from './components/Reviews'
import { FindUs } from './components/FindUs'
import { Footer } from './components/Footer'
import { BottomBar } from './components/BottomBar'
import { Metrika } from './components/Metrika'
import { initScrollGoal } from './utils/analytics'
import { AccountPage } from './account/AccountPage'
import { LegalPage } from './legal/LegalPage'

export default function App() {
  const isAccountPage = window.location.pathname.startsWith('/account')
  const legalSlug = window.location.pathname.startsWith('/legal/')
    ? window.location.pathname.replace('/legal/', '')
    : null

  useEffect(() => initScrollGoal(), [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
        node.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const scroll = Math.min(window.scrollY, 1200)
      document.documentElement.style.setProperty('--scroll-shift', `${scroll}px`)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  if (isAccountPage) {
    return (
      <div className="page-shell">
        <Metrika />
        <AccountPage />
      </div>
    )
  }

  if (legalSlug) {
    return (
      <div className="page-shell">
        <Metrika />
        <LegalPage slug={legalSlug} />
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-glow page-glow--top" aria-hidden="true" />
      <div className="page-glow page-glow--middle" aria-hidden="true" />
      <div className="page-grid" aria-hidden="true" />
      <Metrika />
      <Header />
      <main>
        <Hero />
        <Features />
        <Menu />
        <About />
        <Reviews />
        <FindUs />
      </main>
      <Footer />
      <BottomBar />
    </div>
  )
}
