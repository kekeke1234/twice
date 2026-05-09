import './Navbar.css'

export default function Navbar({ onStart, onPricing, onHome }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo" onClick={onHome} style={{ cursor: 'pointer' }}>
          <span className="nav-logo-icon">⚡</span>
          CodeLearn <span style={{ color: 'var(--emerald-signal)', marginLeft: '4px' }}>C</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li onClick={onPricing} style={{ cursor: 'pointer' }}><a>Pricing</a></li>
          <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
        <button className="nav-cta" onClick={onStart}>Get Started</button>
      </div>
    </nav>
  )
}
