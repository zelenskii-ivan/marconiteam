import { motion } from 'framer-motion'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="footer-logo">Маркони</p>
          <p className="footer-text">
            Кофейня-пекарня. Печём и варим для вас каждый день с 7:30 до 21:00.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="footer-head">Адрес</p>
          <p className="footer-text">ул. Пекарская, 7</p>
          <p className="footer-text">ежедневно 7:30–21:00</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="footer-head">Связь</p>
          <p className="footer-text">
            <a href="tel:+70000000000">+7 (000) 000-00-00</a>
          </p>
          <p className="footer-text">заказ по телефону или у стойки</p>
        </motion.div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Маркони</span>
        <span>Сайт не собирает персональные данные</span>
      </div>
    </footer>
  )
}
