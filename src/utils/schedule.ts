import { useEffect, useState } from 'react'
import { business } from '../data/business'

export interface OpenStatus {
  isOpen: boolean
  /** «Открыто до 22:00» или «Закрыто · откроемся в 8:00» */
  text: string
}

function compute(now: Date): OpenStatus {
  const { open, close } = business.hours
  const h = now.getHours() + now.getMinutes() / 60
  const isOpen = h >= open && h < close
  return {
    isOpen,
    text: isOpen ? `Открыто до ${close}:00` : `Откроемся в ${open}:00`,
  }
}

/** Динамический индикатор «Сейчас открыто/закрыто» (раздел 5 ТЗ) */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState(() => compute(new Date()))

  useEffect(() => {
    const id = setInterval(() => setStatus(compute(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])

  return status
}
