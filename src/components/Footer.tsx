import { business } from '../data/business'
import { trackGoal } from '../utils/analytics'
import { IconPhone, IconTelegram, IconWhatsApp } from './Icons'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div data-reveal="up">
          <p className="footer-logo">Маркони</p>
          <p className="footer-text">
            Кофейня-пекарня в районе Гидростроителей. Свежая выпечка, кофе
            с собой и домашняя продукция ручной лепки.
          </p>
        </div>

        <div data-reveal="up">
          <p className="footer-head">Контакты</p>
          <ul className="footer-list">
            <li>
              <a href={business.phoneHref} onClick={() => trackGoal('call')}>
                <IconPhone size={17} />
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={business.telegramUrl}
                target="_blank"
                rel="noopener"
                onClick={() => trackGoal('telegram')}
              >
                <IconTelegram size={17} />
                Telegram
              </a>
            </li>
            <li>
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener"
                onClick={() => trackGoal('whatsapp')}
              >
                <IconWhatsApp size={17} />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div data-reveal="up">
          <p className="footer-head">Адрес и режим</p>
          <p className="footer-text">
            {business.city}, {business.address}
            <br />
            {business.addressNote}
          </p>
          <p className="footer-text">{business.hoursDisplay}</p>
        </div>

        <div data-reveal="up">
          <p className="footer-head">Оплата</p>
          <p className="footer-text">{business.payment}</p>
          <p className="footer-text">{business.accessibility}</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {business.fullName}</span>
        <span>Сайт не собирает персональные данные</span>
      </div>
    </footer>
  )
}
