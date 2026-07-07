import { business } from '../data/business'
import { trackGoal } from '../utils/analytics'
import { IconClock, IconPin, IconRoute } from './Icons'
import './FindUs.css'

export function FindUs() {
  const notes = [
    business.nearestStop,
    business.parking,
    business.accessibility,
    business.petsAllowed,
  ]

  return (
    <section className="section findus" id="contacts">
      <div className="container">
        <div data-reveal="up">
          <span className="section-label">Как нас найти</span>
          <h2 className="section-title">Мы на Гидрострое</h2>
          <p className="section-sub">
            Всё сделано так, чтобы вам было удобно заглянуть по пути: быстро припарковаться,
            забрать заказ навынос или остаться на чашку кофе.
          </p>
        </div>

        <div className="findus-grid">
          <div className="findus-info" data-reveal="up">
            <p className="findus-row">
              <IconPin size={22} />
              <span>
                <strong>
                  {business.city}, {business.address}
                </strong>
                <br />
                {business.addressNote}
              </span>
            </p>
            <p className="findus-row">
              <IconClock size={22} />
              <span>{business.hoursDisplay}</span>
            </p>
            <ul className="findus-notes">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <a
              className="btn btn--primary"
              href={business.routeUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackGoal('route')}
            >
              <IconRoute size={20} />
              Построить маршрут
            </a>
          </div>

          <div className="findus-map" data-reveal="up">
            <iframe
              src={business.yandexMapsWidget}
              title="Кофейня-пекарня «Маркони» на карте"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}
