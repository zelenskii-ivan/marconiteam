import { motion } from 'framer-motion'
import './Privacy.css'

const points = [
  {
    icon: '🍪',
    title: 'Cookies — только в витрине',
    text: 'Сайт не устанавливает cookies, не использует localStorage для отслеживания и не хранит ничего о вас.',
  },
  {
    icon: '🚫',
    title: 'Ноль трекеров и аналитики',
    text: 'Никаких счётчиков, пикселей, рекламных сетей и сторонних скриптов. Всё загружается только с нашего домена.',
  },
  {
    icon: '🛡️',
    title: 'Строгая Content Security Policy',
    text: 'CSP запрещает выполнение чужого кода, встраивание сайта во фреймы и отправку форм на сторонние адреса.',
  },
  {
    icon: '📵',
    title: 'Мы не собираем персональные данные',
    text: 'На сайте нет форм, регистрации и личных кабинетов. Заказ и вопросы — по телефону или у стойки: так данные вообще не попадают в интернет.',
  },
]

export function Privacy() {
  return (
    <section className="section privacy" id="privacy">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">Персональные данные</span>
          <h2 className="section-title">Приватность по умолчанию</h2>
          <p className="section-sub">
            Лучший способ защитить персональные данные — не собирать их. Этот сайт
            спроектирован по принципу privacy by design.
          </p>
        </motion.div>

        <div className="privacy-grid">
          {points.map((p, i) => (
            <motion.article
              className="privacy-card"
              key={p.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="privacy-icon" aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="privacy-title">{p.title}</h3>
              <p className="privacy-text">{p.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
