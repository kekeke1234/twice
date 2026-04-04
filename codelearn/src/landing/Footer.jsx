import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <span className="footer-logo-icon">◈</span>
          C-Visualizer
        </div>
        <p className="footer-desc">더 효율적인 C언어 학습 플랫폼</p>
        <div className="footer-meta">
          <span>기획서 초안 작성일: 2026.04.04</span>
          <span className="footer-dot">·</span>
          <span>한국어 / English</span>
          <span className="footer-dot">·</span>
          <span>모바일 지원 예정</span>
        </div>
      </div>
    </footer>
  )
}
