import './RightPanel.css'

export default function RightPanel({ problem, problems, onSelectProblem, terminalOutput, executionData, width }) {
  return (
    <div className="right-panel" style={{ width }}>
      <div className="panel-section problem-section">
        <div className="section-header">
          <span className="label">PROBLEM INFO</span>
        </div>
        <div className="problem-info">
          <h3 className="problem-title">{problem.title}</h3>
          <p className="problem-desc">{problem.description}</p>
        </div>
      </div>

      <div className="panel-section problem-list-section">
        <div className="section-header">
          <span className="label">PROBLEM LIST</span>
        </div>
        <div className="problem-list">
          {problems.map((p) => (
            <div
              key={p.id}
              className={`problem-item ${p.id === problem.id ? 'active' : ''}`}
              onClick={() => onSelectProblem(p.id)}
            >
              {p.title}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section terminal-section">
        <div className="section-header">
          <span className="label">TERMINAL</span>
        </div>
        <div className="terminal-view">
          {terminalOutput.map((line, i) => (
            <div key={i} className={`term-line ${line.startsWith('$') ? '' : 'output'}`}>
              {line}
            </div>
          ))}
          <div className="term-line cursor">_</div>
        </div>
      </div>
    </div>
  )
}