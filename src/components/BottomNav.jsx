import './BottomNav.css'

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="status-item">
        <span className="dot" />
        Connected to Debugger
      </div>
      <div className="status-item">
        UTF-8
      </div>
      <div className="status-item">
        C11
      </div>
      <div className="status-item text-emerald">
        VoltAgent Engine v1.0.4
      </div>
    </div>
  )
}
