interface IconProps {
  size?: number
  className?: string
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
}

export function IconPhone({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5.5 3h3l1.7 4.2-2 1.5a12.5 12.5 0 0 0 5.6 5.6l1.5-2L19.5 14v3.5a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7 2 2 0 0 1 5.5 3Z" />
    </svg>
  )
}

export function IconTelegram({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M21 4.5 3.4 11.2c-.8.3-.8 1.4 0 1.7l4.4 1.5 1.6 4.9c.2.8 1.2 1 1.8.4l2.4-2.4 4.5 3.2c.6.4 1.5.1 1.6-.7L21.9 5.6c.2-.8-.5-1.4-.9-1.1Z" />
      <path d="m8 14.3 9.5-7.8" />
    </svg>
  )
}

export function IconWhatsApp({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9 8.8c-.3 1.8 2.7 6 5.7 6.3l1-1.3-2-1.2-.8.7c-.9-.4-1.9-1.5-2.3-2.4l.8-.7-1.1-2-1.3.6Z" />
    </svg>
  )
}

export function IconPin({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21s6.5-5.5 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.3" r="2.3" />
    </svg>
  )
}

export function IconClock({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function IconStar({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="m12 2.8 2.6 5.7 6.2.7-4.6 4.2 1.2 6.1L12 16.4l-5.4 3.1 1.2-6.1-4.6-4.2 6.2-.7L12 2.8Z" />
    </svg>
  )
}

export function IconRoute({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="6" cy="18.5" r="2.5" />
      <circle cx="18" cy="5.5" r="2.5" />
      <path d="M8.5 18.5h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7h6" />
    </svg>
  )
}

export function IconPastry({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 15.5c2.1-.3 3.7-1.5 4.8-3.7 1-2.2 2.5-3.6 4.4-4.3 2-.7 3.9-.6 5.8.2" />
      <path d="M5 19h14" />
      <path d="M7 15.5c1 .2 2 .2 3 0 1.1-.2 2.1-.2 3.2 0 1 .2 2 .2 2.8 0" />
      <path d="M14.8 6.2c.6-.8 1.5-1.3 2.7-1.4" />
    </svg>
  )
}

export function IconDog({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 10.5V7.8c0-1 .5-1.9 1.3-2.4l1.7-1.1 1.7 1.1c.8.5 1.3 1.4 1.3 2.4v2.7" />
      <path d="M6 10.5h8.5a2.5 2.5 0 0 1 2.5 2.5v1a4.5 4.5 0 0 1-4.5 4.5H9A4 4 0 0 1 5 14.5v-1A3 3 0 0 1 8 10.5Z" />
      <path d="M8.2 6.5 6 5.3v3.2" />
      <path d="m13.8 6.5 2.2-1.2v3.2" />
      <circle cx="10" cy="13.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="13.2" cy="13.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconMouse({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="7" y="3.5" width="10" height="17" rx="5" />
      <path d="M12 7v3" />
    </svg>
  )
}

export function IconArrow({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
