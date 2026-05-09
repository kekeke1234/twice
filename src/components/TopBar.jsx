import './TopBar.css'

export default function TopBar({ onHome, onRun, onLeaderboard, onAuth, editorTheme, onThemeChange }) {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="logo-section" onClick={onHome}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">CodeLearn <span className="text-emerald">C</span></span>
        </div>
      </div>
      <div className="top-bar-center">
        <div className="file-tabs">
          <div className="tab active">main.c</div>
          <div className="tab">utils.h</div>
        </div>
      </div>
      <div className="top-bar-right">
        <select
          className="theme-select"
          value={editorTheme || 'default'}
          onChange={(e) => onThemeChange && onThemeChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="monokai">Monokai</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="dracula">Dracula</option>
          <option value="solarized">Solarized</option>
        </select>
        <button className="leaderboard-btn" onClick={onLeaderboard}>Leaderboard</button>
        <button className="auth-top-btn" onClick={onAuth}>Sign In</button>
        <button className="run-btn" onClick={onRun}>Run Code</button>
        <button className="share-btn">Share</button>
      </div>
    </div>
  )
}
