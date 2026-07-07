/**
 * Цели аналитики (раздел 10.3 ТЗ): звонок, Telegram, WhatsApp, маршрут, скролл 75%.
 * Подключается через VITE_YM_COUNTER_ID в .env
 */
export type Goal = 'call' | 'telegram' | 'whatsapp' | 'route' | 'scroll75'

export function trackGoal(goal: Goal) {
  const id = window.YM_COUNTER_ID
  if (typeof window.ym === 'function' && id) {
    window.ym(id, 'reachGoal', goal)
  }
}

/** Одноразовая цель «прокрутил 75% страницы» */
export function initScrollGoal() {
  let fired = false
  const onScroll = () => {
    if (fired) return
    const scrolled = window.scrollY + window.innerHeight
    if (scrolled >= document.documentElement.scrollHeight * 0.75) {
      fired = true
      trackGoal('scroll75')
      window.removeEventListener('scroll', onScroll)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}

declare global {
  interface Window {
    ym?: (id: number, action: string, params?: Record<string, unknown> | string) => void
    YM_COUNTER_ID?: number
  }
}
