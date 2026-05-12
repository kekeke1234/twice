import { useLanguage } from '../context/LanguageContext'
import './BottomNav.css'

export default function BottomNav({ executionData }) {
  const { t } = useLanguage()
  const { variables, stack, queue, memory } = executionData || {}
  const hasData = (memory && memory.length > 0) || (stack && stack.length > 0) || (queue && queue.length > 0) || (variables && Object.keys(variables).length > 0)

  return (
    <div className="bottom-nav">
      <div className="status-group">
        <div className="status-item">
          <span className="dot" />
          {t('connectedToDebugger')}
        </div>
        <div className="status-item">UTF-8</div>
        <div className="status-item">C11</div>
      </div>

      {hasData ? (
        <div className="viz-bar">
          {variables && Object.keys(variables).length > 0 && (
            <div className="viz-bar-item">
              <span className="viz-label">VARS</span>
              <div className="viz-chips">
                {Object.entries(variables).map(([name, val]) => (
                  <span key={name} className="viz-chip">{name}={val}</span>
                ))}
              </div>
            </div>
          )}

          {stack && stack.length > 0 && (
            <div className="viz-bar-item">
              <span className="viz-label">STACK</span>
              <div className="viz-chips">
                {[...stack].reverse().map((item, i) => (
                  <span key={i} className="viz-chip stack-chip">{item}</span>
                ))}
              </div>
            </div>
          )}

          {queue && queue.length > 0 && (
            <div className="viz-bar-item">
              <span className="viz-label">QUEUE</span>
              <div className="viz-chips">
                {queue.map((item, i) => (
                  <span key={i} className="viz-chip queue-chip">{item}</span>
                ))}
              </div>
            </div>
          )}

          {memory && memory.length > 0 && (
            <div className="viz-bar-item">
              <span className="viz-label">MEMORY</span>
              <div className="viz-chips">
                {memory.map((mem, i) => (
                  <span key={i} className="viz-chip mem-chip">{mem.name}:{mem.value}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="status-item text-emerald">
          {t('voltAgentEngine')}
        </div>
      )}
    </div>
  )
}