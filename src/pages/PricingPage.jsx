import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import './PricingPage.css'

export default function PricingPage({ onNavigate }) {
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
          <h1 className="pricing-title">Ready to master <span className="text-emerald">Memory</span>?</h1>
          <p className="pricing-sub">Choose the plan that fits your learning journey.</p>
        </header>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-name">Student</h3>
            <div className="plan-price">$0<span className="period">/mo</span></div>
            <p className="plan-desc">Perfect for students starting their C journey.</p>
            <ul className="plan-features">
              <li>✓ Basic Memory Visualization</li>
              <li>✓ Limited Stack Tracing</li>
              <li>✓ Community Support</li>
            </ul>
            <button className="plan-btn" disabled>Get Started</button>
          </div>

          <div className="pricing-card highlighted">
            <div className="badge">MOST POPULAR</div>
            <h3 className="plan-name">Pro Learner</h3>
            <div className="plan-price">$12<span className="period">/mo</span></div>
            <p className="plan-desc">Advanced features for serious developers.</p>
            <ul className="plan-features">
              <li>✓ Full Heap & Stack Tracking</li>
              <li>✓ AI Code Explainer</li>
              <li>✓ Multi-file Projects</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="plan-btn active" disabled>Try Pro Free</button>
          </div>

          <div className="pricing-card">
            <h3 className="plan-name">University</h3>
            <div className="plan-price">$49<span className="period">/mo</span></div>
            <p className="plan-desc">For classrooms and learning groups.</p>
            <ul className="plan-features">
              <li>✓ Shared Workspaces</li>
              <li>✓ Admin Dashboard</li>
              <li>✓ Dedicated Instance</li>
              <li>✓ Custom Onboarding</li>
            </ul>
            <button className="plan-btn" disabled>Contact Sales</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
