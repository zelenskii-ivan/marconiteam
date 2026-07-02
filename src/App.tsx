import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig } from 'framer-motion'
import type { MenuItem } from './data/types'
import { drinks } from './data/drinks'
import { pastries } from './data/pastries'
import { Loader } from './components/Loader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { MenuSection } from './components/MenuSection'
import { ItemModal } from './components/ItemModal'
import { About } from './components/About'
import { Privacy } from './components/Privacy'
import { Footer } from './components/Footer'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MenuItem | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <Header />

      <main>
        <LayoutGroup>
          <Hero />
          <Marquee />
          <MenuSection
            id="drinks"
            label="Напитки"
            title="Что налить?"
            subtitle="Самые популярные напитки нашей кофейни. Нажмите на карточку — покажем рецепт бариста и пищевую ценность."
            items={drinks}
            onSelect={setSelected}
          />
          <MenuSection
            id="pastries"
            label="Выпечка"
            title="Из печи — в руки"
            subtitle="Круассаны, слойки, самса и штрудель. Всё печём на месте, рецепты не скрываем."
            items={pastries}
            onSelect={setSelected}
          />
          <ItemModal item={selected} onClose={() => setSelected(null)} />
        </LayoutGroup>
        <About />
        <Privacy />
      </main>

      <Footer />
    </MotionConfig>
  )
}
