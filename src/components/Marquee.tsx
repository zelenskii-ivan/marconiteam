import './Marquee.css'

const row1 = [
  'Круассаны',
  'Эспрессо',
  'Штрудель',
  'Капучино',
  'Самса',
  'Раф',
  'Слойки',
  'Матча',
]

const row2 = [
  'Свежая обжарка',
  '72 слоя',
  'Латте-арт',
  'Печём с 7:30',
  'Ваниль Мадагаскара',
  'Сицилийская фисташка',
]

function Track({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const row = items.map((t, i) => (
    <span className="marquee-item" key={i}>
      {t} <span className="marquee-dot">✦</span>
    </span>
  ))

  return (
    <div className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''}`}>
      {row}
      {row}
    </div>
  )
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <Track items={row1} />
      <Track items={row2} reverse />
    </div>
  )
}
