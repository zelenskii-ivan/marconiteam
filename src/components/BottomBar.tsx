import { business } from '../data/business'
import { trackGoal } from '../utils/analytics'
import { IconPhone, IconTelegram } from './Icons'
import './BottomBar.css'

/** Закреплённая нижняя панель на мобильном (раздел 5 ТЗ) */
export function BottomBar() {
  return (
    <nav className="bottombar" aria-label="Быстрые действия">
      <a
        className="bottombar-btn bottombar-btn--call"
        href={business.phoneHref}
        onClick={() => trackGoal('call')}
      >
        <IconPhone size={20} />
        Позвонить
      </a>
      <a
        className="bottombar-btn bottombar-btn--order"
        href={business.telegramUrl}
        target="_blank"
        rel="noopener"
        onClick={() => trackGoal('telegram')}
      >
        <IconTelegram size={20} />
        Заказать
      </a>
    </nav>
  )
}
