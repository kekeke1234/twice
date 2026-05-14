import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onStart, onHome, onLeaderboard, onAuth }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo" onClick={onHome} style={{ cursor: 'pointer' }}>
          <span className="nav-logo-icon">⚡</span>
          CodeLearn <span style={{ color: 'var(--emerald-signal)', marginLeft: '4px' }}>C</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">{t('features')}</a></li>
          <li><a style={{ cursor: 'pointer' }} onClick={onLeaderboard}>{t('leaderboard')}</a></li>
          <li><a style={{ cursor: 'pointer' }} onClick={onAuth}>{t('signIn')}</a></li>
          <li><a href="https://github.com" target="_blank" rel="noreferrer">{t('github')}</a></li>
          <li>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'var(--carbon-surface)',
                color: 'var(--snow-white)',
                border: '1px solid var(--warm-charcoal)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              <option value="en">EN</option>
              <option value="ko">KO</option>
            </select>
          </li>
        </ul>
        <button className="nav-cta" onClick={onStart}>{t('getStarted')}</button>
      </div>
    </nav>
  );
}
