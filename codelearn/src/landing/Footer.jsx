import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-logo-icon">⚡</span>
            CodeLearn <span className="text-emerald">C</span>
          </div>
          <p className="footer-desc">The deep-space command terminal for learning C. Track memory with surgical precision.</p>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#docs">Documentation</a>
          </div>
          <div className="link-group">
            <h4>Social</h4>
            <a href="https://github.com">GitHub</a>
            <a href="https://discord.com">Discord</a>
            <a href="https://x.com">X / Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-inner">
          <p>© 2026 CodeLearn. All rights reserved.</p>
          <div className="footer-meta">
            <span>v1.0.4-stable</span>
            <span className="dot" />
            <span>Built with Emerald Signal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
