import './TopBar.css'

export default function TopBar({ onHome }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="lesson-title" onClick={onHome} style={{ cursor: 'pointer' }}>C-Visualizer</span>
        <div className="tab active">
          <span className="tab-icon">◻</span>
          main.c
          <span className="tab-close">×</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="top-icons">
          <button className="icon-btn" title="설정">⚙</button>
          <button className="icon-btn" title="저장">💾</button>
          <button className="icon-btn" title="공유">↗</button>
        </div>
        <button className="enroll-btn">무제한 수강하기</button>
        <div className="user-avatar">이</div>
      </div>
    </div>
  )
}
