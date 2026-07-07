import { business } from '../data/business'
import { IconArrow, IconStar } from './Icons'
import './Reviews.css'

/* Черновик — заменить реальными отзывами с Яндекс Карт (с согласия авторов) */
const reviews = [
  {
    author: 'Екатерина',
    text: 'Очень уютное место рядом с домом. Круассаны всегда свежие, капучино отличный. Приятно, что можно зайти с собакой на террасу.',
  },
  {
    author: 'Дмитрий',
    text: 'Беру кофе с собой каждое утро по пути на работу. Быстро, вкусно, бариста уже помнит мой заказ.',
  },
  {
    author: 'Марина',
    text: 'Пельмени ручной лепки — как у бабушки! Берём домой каждую неделю. Чувствуется, что делают на совесть, без всякой химии.',
  },
  {
    author: 'Алексей',
    text: 'Удобно заехать с коляской — всё на одном уровне, персонал приветливый. Кофе отличный, булочки свежайшие. Рекомендую соседям.',
  },
]

export function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <div data-reveal="up">
          <span className="section-label">Отзывы</span>
          <h2 className="section-title">Нас рекомендуют соседи</h2>
        </div>

        <div className="reviews-badge" data-reveal="up">
          <span className="reviews-rating">
            <IconStar size={22} />
            {business.rating}
          </span>
          <span className="reviews-award">
            награда «{business.award}» на Яндекс Картах
          </span>
        </div>

        <ul className="reviews-grid">
          {reviews.map((r) => (
            <li key={r.author} className="review" data-reveal="up">
              <p className="review-text">{r.text}</p>
              <p className="review-author">
                {r.author}
                <span className="review-source">Яндекс Карты</span>
              </p>
            </li>
          ))}
        </ul>

        <a
          className="reviews-link"
          href={business.yandexMapsSearch}
          target="_blank"
          rel="noopener"
          data-reveal="up"
        >
          Все отзывы на Яндекс Картах
          <IconArrow size={18} />
        </a>
      </div>
    </section>
  )
}
