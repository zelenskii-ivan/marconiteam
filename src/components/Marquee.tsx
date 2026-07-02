import './Marquee.css'

const items = [
  'Круассаны',
  'Эспрессо',
  'Штрудель',
  'Капучино',
  'Самса',
  'Раф',
  'Слойки',
  'Матча',
]

export function Marquee() {
  const row = items.map((t, i) => (
    <span className="marquee-item" key={i}>
      {t} <span className="marquee-dot">✦</span>
    </span>
  ))

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  )
}
