import { useLanguage } from '../context/LanguageContext'
import './CTA.css'

export default function CTA({ onStart }) {
  const { t } = useLanguage()
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-badge">{t('ctaBadge')}</div>
        <h2 className="cta-title" dangerouslySetInnerHTML={{ __html: t('ctaTitle') }} />
        <p className="cta-sub" dangerouslySetInnerHTML={{ __html: t('ctaSub') }} />
        <div className="cta-btns">
          <button className="cta-btn-primary" onClick={onStart}>
            {t('startFreeTrial')}
          </button>
        </div>
        <p className="cta-note">{t('noSignupRequired')}</p>
      </div>
    </section>
  )
}
