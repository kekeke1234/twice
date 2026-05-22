import { useLanguage } from '../context/LanguageContext';
import './RightPanel.css';

export default function RightPanel({ problem, terminalOutput, width, hasError, showHint, setShowHint }) {
  const { t } = useLanguage();

  return (
    <div className="right-panel" style={{ width }}>
      <div className="panel-section problem-section">
        <div className="section-header">
          <span className="label">{t('problemInfo')}</span>
        </div>
        <div className="problem-info">
          <h3 className="problem-title">{problem.titleKey ? t(problem.titleKey) : problem.title}</h3>
          <p className="problem-desc">{problem.descKey ? t(problem.descKey) : problem.description}</p>
        </div>
      </div>

      <div className="panel-section terminal-section">
        <div className="section-header">
          <span className="label">{t('terminal')}</span>
        </div>
        <div className="terminal-view">
          {terminalOutput.map((line, i) => (
            <div key={i} className={`term-line ${line.startsWith('$') ? '' : 'output'}`}>
              {line}
            </div>
          ))}
          {hasError && !showHint && problem.hintKey && (
            <button className="hint-button" onClick={() => setShowHint(true)}>
              💡 {t('showHint')}
            </button>
          )}
          {showHint && problem.hintKey && (
            <div className="hint-content">
              <span className="hint-label">💡 {t('hint')}:</span>
              <span>{t(problem.hintKey)}</span>
            </div>
          )}
          <div className="term-line cursor">_</div>
        </div>
      </div>
    </div>
  );
}