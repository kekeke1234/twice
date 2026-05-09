import './TopBar.css'

export default function TopBar({ onHome, onRun }) {
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
        <button className="run-btn" onClick={onRun}>Run Code</button>
        <button className="share-btn">Share</button>
      </div>
    </div>
  )
}
