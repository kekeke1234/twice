import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-logo-icon">⚡</span>
            CodeLearn <span className="text-emerald">C</span>
          </div>
          <p className="footer-desc">{t('heroSub')}</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>{t('product')}</h4>
            <a href="#features">{t('features')}</a>
            <a href="#docs">{t('documentation')}</a>
          </div>
          <div className="link-group">
            <h4>{t('social')}</h4>
            <a href="https://github.com">{t('github')}</a>
            <a href="https://discord.com">{t('discord')}</a>
            <a href="https://x.com">{t('twitter')}</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-inner">
          <p>© 2026 CodeLearn. {t('allRightsReserved')}</p>
          <div className="footer-meta">
            <span>v1.0.4-stable</span>
            <span className="dot" />
            <span>{t('builtWith')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
