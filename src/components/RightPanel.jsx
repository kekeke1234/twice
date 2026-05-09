import { useState, useCallback, useEffect, useRef } from 'react'
import './RightPanel.css'
import queueIcon from '../assets/queue-icon.png'

export default function RightPanel({ problem, problems, onSelectProblem, terminalOutput, executionData }) {
  const { variables, stack, queue, memory } = executionData || { variables: {}, stack: [], queue: [], memory: [] }
  const [width, setWidth] = useState(520)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startW = useRef(0)

  const handleMouseDown = useCallback((e) => {
    dragging.current = true
    startX.current = e.clientX
    startW.current = width
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [width])

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return
    const delta = startX.current - e.clientX
    const newW = Math.max(280, Math.min(900, startW.current + delta))
    setWidth(newW)
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className="right-panel" style={{ width }}>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      <div className="panel-section">
        <div className="section-header">
          <span className="label">PROBLEM INFO</span>
        </div>
        <div className="problem-info">
          <h3 className="problem-title">{problem.title}</h3>
          <p className="problem-desc">{problem.description}</p>
        </div>
      </div>

      <div className="panel-section">
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

      <div className="panel-section">
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

      <div className="panel-section scrollable">
        <div className="section-header">
          <span className="label">VISUALIZATION</span>
        </div>
        <div className="viz-container">
          {memory && memory.length > 0 && (
            <div className="viz-item">
              <h4>Memory Block Map</h4>
              <div className="memory-map-visual">
                {memory.map((mem, i) => (
                  <div key={i} className="mem-block-wrapper">
                    <div className="mem-addr-label">{mem.address}</div>
                    <div className="mem-block-chip">
                      <div className="mem-chip-content">
                        <span className="mem-chip-name">{mem.name}</span>
                        <div className="mem-chip-divider"></div>
                        <span className="mem-chip-val">{mem.value}</span>
                      </div>
                      <div className="mem-chip-pins">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stack.length > 0 && (
            <div className="viz-item">
              <h4>Stack</h4>
              <div className="stack-viz">
                {[...stack].reverse().map((item, i) => (
                  <div key={i} className="stack-block">{item}</div>
                ))}
              </div>
            </div>
          )}

          {queue.length > 0 && (
            <div className="viz-item">
              <h4>Queue</h4>
              <div className="queue-viz">
                {queue.map((item, i) => (
                  <div key={i} className="queue-block">
                    <span className="queue-val">{item}</span>
                    <img src={queueIcon} alt="" className="queue-icon" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(variables).length === 0 && stack.length === 0 && queue.length === 0 && (
            <div className="viz-placeholder">Run code to see visualization</div>
          )}
        </div>
      </div>
    </div>
  )
}
