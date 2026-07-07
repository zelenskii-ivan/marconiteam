import './LegalPage.css'
import { getLegalDocument } from './legalContent'

interface LegalPageProps {
  slug: string
}

export function LegalPage({ slug }: LegalPageProps) {
  const document = getLegalDocument(slug)

  if (!document) {
    return (
      <main className="legal-shell">
        <div className="legal container">
          <a href="/" className="legal-back">На главную</a>
          <h1>Документ не найден</h1>
          <p>Проверьте адрес страницы или вернитесь в личный кабинет.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="legal-shell">
      <div className="legal-glow legal-glow--top" aria-hidden="true" />
      <div className="legal-glow legal-glow--bottom" aria-hidden="true" />

      <article className="legal container">
        <div className="legal-topbar">
          <a href="/account" className="legal-back">В личный кабинет</a>
          <a href="/" className="legal-back">На главную</a>
        </div>

        <header className="legal-hero" data-reveal>
          <p className="legal-kicker">Юридический документ</p>
          <h1>{document.title}</h1>
          <p>{document.intro}</p>

          <div className="legal-meta">
            <span>Версия {document.version}</span>
            <span>Действует с {document.effectiveDate}</span>
            <span>Требует финальной юридической верификации</span>
          </div>
        </header>

        <div className="legal-sections">
          {document.sections.map((section) => (
            <section key={section.title} className="legal-card" data-reveal>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}
