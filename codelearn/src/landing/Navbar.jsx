import './Navbar.css'

export default function Navbar({ onStart }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo">
          <span className="nav-logo-icon">◈</span>
          C-Visualizer
        </div>
        <ul className="nav-links">
          <li><a href="#features">기능</a></li>
          <li><a href="#target">대상</a></li>
          <li><a href="#problem">왜 필요한가</a></li>
        </ul>
        <button className="nav-cta" onClick={onStart}>무료로 시작하기</button>
      </div>
    </nav>
  )
}
