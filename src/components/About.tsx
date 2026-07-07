import './About.css'

const photos = [
  { src: '/images/about-interior.webp', alt: 'Уютный интерьер кофейни «Маркони»' },
  { src: '/images/about-terrace.webp', alt: 'Летняя терраса — можно с собакой' },
  { src: '/images/about-counter.webp', alt: 'Витрина со свежей выпечкой' },
]

export function About() {
  const values = ['Авторская витрина', 'Тёплая атмосфера', 'Семейный подход']

  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <div className="about-text" data-reveal="up">
          <span className="section-label">О нас</span>
          <h2 className="section-title">Семейная кофейня на Гидрострое</h2>
          <p>
            «Маркони» — это мы, Иван и Анастасия. Мы открыли кофейню-пекарню
            в своём районе, чтобы по соседству всегда были свежие круассаны,
            хороший кофе и домашние пельмени — такие, какие лепят для своей семьи.
          </p>
          <p>
            Печём каждое утро, лепим вручную небольшими партиями и знаем
            постоянных гостей по именам. Летом работает терраса — заглядывайте
            с детьми и собаками.
          </p>
          <ul className="about-values" aria-label="Ценности Маркони">
            {values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>

        <ul className="about-photos" aria-label="Фотографии заведения">
          {photos.map((p) => (
            <li key={p.src} data-reveal="up">
              <img
                className="about-photo"
                src={p.src}
                alt={p.alt}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
