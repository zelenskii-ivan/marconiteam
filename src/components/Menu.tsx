import { useState } from 'react'
import { categories, menu, type CategoryId } from '../data/menu'
import './Menu.css'

const categoryMeta: Record<CategoryId, {
  image: string
  kicker: string
  title: string
  text: string
}> = {
  pastry: {
    image: '/images/menu-pastry.webp',
    kicker: 'Хрустящая витрина',
    title: 'Круассаны, булочки и десерты на каждый день',
    text: 'Масляные слои, карамельная корочка и десерты, которые хочется сначала сфотографировать, а потом повторить.',
  },
  coffee: {
    image: '/images/menu-coffee.webp',
    kicker: 'Барная классика',
    title: 'Кофе, который работает и утром, и на прогулке',
    text: 'От плотного эспрессо до мягкого латте и холодных напитков: всё подаём быстро, красиво и стабильно вкусно.',
  },
  homemade: {
    image: '/images/menu-homemade.webp',
    kicker: 'Домашний комфорт',
    title: 'Ручная лепка и еда, которую хочется взять домой',
    text: 'Пельмени и вареники лепим небольшими партиями, чтобы дома у вас тоже был кусочек Маркони.',
  },
}

export function Menu() {
  const [active, setActive] = useState<CategoryId>('pastry')
  const activeCategory = categories.find((category) => category.id === active) ?? categories[0]
  const activeMeta = categoryMeta[active]

  return (
    <section className="section menu" id="menu">
      <div className="container">
        <div data-reveal="up">
          <span className="section-label">Меню</span>
          <h2 className="section-title">Что попробовать</h2>
          <p className="section-sub">
            Печём и лепим на месте. Полное меню — на витрине, заказ — по телефону
            или в мессенджерах.
          </p>
        </div>

        <div className="menu-tabs" role="tablist" aria-label="Категории меню">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={active === c.id}
              aria-controls={`panel-${c.id}`}
              className={`menu-tab ${active === c.id ? 'menu-tab--active' : ''}`}
              onClick={() => setActive(c.id)}
            >
              <span
                className="menu-tab-thumb"
                style={{ backgroundImage: `url(${categoryMeta[c.id].image})` }}
                aria-hidden="true"
              />
              <span className="menu-tab-label">{c.label}</span>
            </button>
          ))}
        </div>

        <article
          className="menu-showcase"
          data-reveal="up"
          style={{ backgroundImage: `url(${activeMeta.image})` }}
        >
          <div className="menu-showcase-overlay">
            <p className="menu-showcase-kicker">{activeMeta.kicker}</p>
            <h3 className="menu-showcase-title">{activeMeta.title}</h3>
            <p className="menu-showcase-text">{activeMeta.text}</p>
            <p className="menu-showcase-caption">Сейчас открыта вкладка: {activeCategory.label}</p>
          </div>
        </article>

        {categories.map((c) => (
          <ul
            key={c.id}
            role="tabpanel"
            id={`panel-${c.id}`}
            aria-labelledby={`tab-${c.id}`}
            className="menu-grid"
            hidden={active !== c.id}
          >
            {menu
              .filter((item) => item.category === c.id && !item.hidden)
              .map((item) => (
                <li key={item.id} className="menu-card" data-reveal="up">
                  {item.badge && <span className="menu-card-badge">{item.badge}</span>}
                  <span
                    className="menu-card-art"
                    style={{ backgroundImage: `url(${categoryMeta[c.id].image})` }}
                    aria-hidden="true"
                  >
                    <span className="menu-card-emoji">{item.emoji}</span>
                  </span>
                  <span className="menu-card-body">
                    <span className="menu-card-name">{item.name}</span>
                    <span className="menu-card-desc">{item.description}</span>
                    <span className="menu-card-price">{item.price}</span>
                  </span>
                </li>
              ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
