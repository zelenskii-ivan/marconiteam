import { useEffect } from 'react'

const counterId = import.meta.env.VITE_YM_COUNTER_ID
  ? Number(import.meta.env.VITE_YM_COUNTER_ID)
  : 0

/** Асинхронная загрузка Яндекс Метрики (раздел 10 ТЗ) */
export function Metrika() {
  useEffect(() => {
    if (!counterId) return

    window.YM_COUNTER_ID = counterId

    const w = window as Window & { ym?: YmFn }
    w.ym =
      w.ym ||
      function (...args: unknown[]) {
        ;(w.ym!.a = w.ym!.a || []).push(args)
      }

    if (!document.querySelector('script[src="https://mc.yandex.ru/metrika/tag.js"]')) {
      const s = document.createElement('script')
      s.async = true
      s.src = 'https://mc.yandex.ru/metrika/tag.js'
      document.head.appendChild(s)
    }

    w.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    })
  }, [])

  if (!counterId) return null

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${counterId}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  )
}

type YmFn = ((id: number, action: string, params?: Record<string, unknown> | string) => void) & {
  a?: unknown[]
}
