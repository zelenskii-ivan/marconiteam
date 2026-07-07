import './Features.css'

const features = [
  {
    accent: 'Хрустяще',
    title: 'Свежая выпечка каждый день',
    text: 'Круассаны и булочки печём на месте с самого утра — от 115 ₽.',
  },
  {
    accent: 'Бодряще',
    title: 'Кофе с собой',
    text: 'Капучино 220–300 ₽ на зерне свежей обжарки. По пути на работу — за пару минут.',
  },
  {
    accent: 'По-домашнему',
    title: 'Продукция ручной лепки',
    text: 'Пельмени и вареники как дома: без сои и ароматизаторов.',
  },
  {
    accent: 'По-соседски',
    title: 'Летняя терраса',
    text: 'Можно с собакой. Заведение доступно для колясок и маломобильных гостей.',
  },
]

export function Features() {
  return (
    <section className="section features" aria-label="Наши преимущества">
      <div className="container">
        <div className="features-intro" data-reveal="up">
          <span className="section-label">Почему к нам возвращаются</span>
          <h2 className="section-title">Место для утреннего ритуала и тёплых встреч</h2>
        </div>
        <ul className="features-grid">
          {features.map((f) => (
            <li key={f.title} className="feature" data-reveal="up">
              <span className="feature-emoji" aria-hidden="true">{f.accent}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
