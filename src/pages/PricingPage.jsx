import { useLanguage } from '../context/LanguageContext';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
import './PricingPage.css';

export default function PricingPage({ onNavigate }) {
  const { t } = useLanguage();
  return (
    <div className="pricing-page">
      <Navbar
        onStart={() => onNavigate('ide')}
        onPricing={() => onNavigate('pricing')}
        onHome={() => onNavigate('landing')}
      />

      <main className="pricing-content">
        <header className="pricing-header">
          <div className="overline">TRANSPARENT PRICING</div>
          <h1 className="pricing-title" dangerouslySetInnerHTML={{ __html: t('pricingTitle') }} />
          <p className="pricing-sub">{t('choosePlan')}</p>
        </header>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-name">{t('student')}</h3>
            <div className="plan-price">{t('studentPrice')}<span className="period">/mo</span></div>
            <p className="plan-desc">{t('studentDesc')}</p>
            <ul className="plan-features">
              <li>✓ Basic Memory Visualization</li>
              <li>✓ Limited Stack Tracing</li>
              <li>✓ Community Support</li>
            </ul>
            <button className="plan-btn" disabled>{t('getStarted')}</button>
          </div>

          <div className="pricing-card highlighted">
            <div className="badge">{t('mostPopular')}</div>
            <h3 className="plan-name">{t('proLearner')}</h3>
            <div className="plan-price">{t('proPrice')}<span className="period">/mo</span></div>
            <p className="plan-desc">{t('proDesc')}</p>
            <ul className="plan-features">
              <li>✓ Full Heap & Stack Tracking</li>
              <li>✓ AI Code Explainer</li>
              <li>✓ Multi-file Projects</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="plan-btn active" disabled>{t('tryProFree')}</button>
          </div>

          <div className="pricing-card">
            <h3 className="plan-name">{t('university')}</h3>
            <div className="plan-price">{t('uniPrice')}<span className="period">/mo</span></div>
            <p className="plan-desc">{t('uniDesc')}</p>
            <ul className="plan-features">
              <li>✓ Shared Workspaces</li>
              <li>✓ Admin Dashboard</li>
              <li>✓ Dedicated Instance</li>
              <li>✓ Custom Onboarding</li>
            </ul>
            <button className="plan-btn" disabled>{t('contactSales')}</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
