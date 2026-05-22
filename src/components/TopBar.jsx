import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { PROBLEMS } from '../problems'
import DictionaryModal from './DictionaryModal'
import './TopBar.css'

const CURRICULUM = [
  { chapter: 'chapter1', desc: 'chapter1Desc', topics: 'chapter1Topics', problems: ['hello-world', 'variables', 'operators'] },
  { chapter: 'chapter2', desc: 'chapter2Desc', topics: 'chapter2Topics', problems: ['if-else', 'switch-case', 'for-loop', 'while-loop'] },
  { chapter: 'chapter3', desc: 'chapter3Desc', topics: 'chapter3Topics', problems: ['function-basic', 'recursion'] },
  { chapter: 'chapter4', desc: 'chapter4Desc', topics: 'chapter4Topics', problems: ['array-basics', 'pointer-basics', 'pointer-arithmetic'] },
  { chapter: 'chapter5', desc: 'chapter5Desc', topics: 'chapter5Topics', problems: ['struct-basics', 'malloc-basic'] },
  { chapter: 'chapter6', desc: 'chapter6Desc', topics: 'chapter6Topics', problems: ['linked-list', 'file-io'] },
  { chapter: 'chapter7', desc: 'chapter7Desc', topics: 'chapter7Topics', problems: ['doubly-linked-list', 'stack-calculator', 'bubble-sort', 'quick-sort', 'memory-pool', 'hash-table', 'binary-tree'] },
];

const COLOR_LABELS = {
  '--emerald-signal': 'Primary Accent',
  '--abyss-black': 'Background',
  '--carbon-surface': 'Surface',
  '--warm-charcoal': 'Border',
  '--snow-white': 'Text Primary',
  '--pure-white': 'Text Bright',
  '--warm-parchment': 'Text Secondary',
  '--steel-slate': 'Text Muted',
  '--success-emerald': 'Success',
  '--warning-amber': 'Warning',
  '--danger-coral': 'Danger',
  '--info-teal': 'Info',
  '--soft-purple': 'Purple Accent',
};

export default function TopBar({ onHome, onRun, onLeaderboard, onAuth, currentProblem, onSelectProblem, onInsertCode, showDictionary, setShowDictionary }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { presets, activePreset, applyPreset, updateColor, resetTheme, currentColors } = useTheme();
  const [showProblemList, setShowProblemList] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const toggleChapter = (index) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="logo-section" onClick={onHome}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">CodeLearn <span className="text-emerald">C</span></span>
        </div>
      </div>
      <div className="top-bar-right">
        <button className="leaderboard-btn" onClick={onLeaderboard}>{t('leaderboard')}</button>
        <button className="auth-top-btn" onClick={user ? logout : onAuth}>{user ? t('logout') : t('signIn')}</button>
        <button className="run-btn" onClick={onRun}>{t('runCode')}</button>
        <button
          className={`theme-color-btn`}
          onClick={() => setShowThemePanel(!showThemePanel)}
          title="Customize Theme"
        >
          <span className="color-icon">🎨</span>
        </button>
        <button
          className={`problems-btn ${showProblemList ? 'active' : ''}`}
          onClick={() => setShowProblemList(!showProblemList)}
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="problems-label">{t('curriculum')}</span>
        </button>
        <button
          className={`dict-btn ${showDictionary ? 'active' : ''}`}
          onClick={() => setShowDictionary(!showDictionary)}
          title={t('cDictionary')}
        >
          <span className="dict-icon">📖</span>
          <span className="dict-label">{t('dict')}</span>
        </button>
      </div>
      {showProblemList && <div className="overlay" onClick={() => setShowProblemList(false)} />}
      {showThemePanel && <div className="overlay" onClick={() => setShowThemePanel(false)} />}
      <div className={`problem-drawer ${showProblemList ? 'open' : ''}`}>
        <div className="problem-drawer-header">
          <div className="drawer-header-content">
            <span className="drawer-title">{t('curriculum')}</span>
            <span className="drawer-subtitle">{t('curriculumDesc')}</span>
          </div>
          <button className="drawer-close" onClick={() => setShowProblemList(false)}>×</button>
        </div>
        <div className="problem-drawer-content">
          {CURRICULUM.map((item, index) => (
            <div key={index} className="curriculum-chapter">
              <div className="curriculum-chapter-header" onClick={() => toggleChapter(index)}>
                <span className="curriculum-chapter-num">{index + 1}</span>
                <div className="curriculum-chapter-info">
                  <span className="curriculum-chapter-title">{t(item.chapter)}</span>
                  <span className="curriculum-chapter-desc">{t(item.desc)}</span>
                </div>
                <span className={`expand-icon ${expandedChapter === index ? 'expanded' : ''}`}>▶</span>
              </div>
              {expandedChapter === index && (
                <div className="curriculum-problems">
                  {PROBLEMS.filter(p => item.problems.includes(p.id)).map(p => (
                    <div
                      key={p.id}
                      className={`curriculum-problem-item ${p.id === currentProblem?.id ? 'active' : ''}`}
                      onClick={() => {
                        onSelectProblem(p.id);
                        setShowProblemList(false);
                      }}
                    >
                      <span className="problem-icon">▸</span>
                      <span className="problem-item-title">{p.titleKey ? t(p.titleKey) : p.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={`theme-drawer ${showThemePanel ? 'open' : ''}`}>
        <div className="theme-drawer-header">
          <span className="drawer-title">Theme Settings</span>
          <button className="drawer-close" onClick={() => setShowThemePanel(false)}>×</button>
        </div>
        <div className="theme-drawer-content">
          <div className="preset-section">
            <div className="preset-label">Preset Themes</div>
            <div className="preset-grid">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  className={`preset-btn ${activePreset === key ? 'active' : ''}`}
                  onClick={() => applyPreset(key)}
                >
                  <div className="preset-preview">
                    <span style={{ background: preset.colors['--emerald-signal'] }}></span>
                    <span style={{ background: preset.colors['--abyss-black'] }}></span>
                    <span style={{ background: preset.colors['--carbon-surface'] }}></span>
                    <span style={{ background: preset.colors['--danger-coral'] }}></span>
                  </div>
                  <span className="preset-name">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="color-section">
            <div className="color-section-header">
              <span className="preset-label">Custom Colors</span>
              <button className="reset-btn" onClick={resetTheme}>Reset</button>
            </div>
            <div className="color-grid">
              {Object.entries(COLOR_LABELS).map(([varName, label]) => (
                <div key={varName} className="color-item">
                  <div className="color-preview" style={{ background: currentColors[varName] }}>
                    <input
                      type="color"
                      value={currentColors[varName]}
                      onChange={(e) => updateColor(varName, e.target.value)}
                      className="color-input"
                    />
                  </div>
                  <span className="color-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DictionaryModal
        isOpen={showDictionary}
        onClose={() => setShowDictionary(false)}
        onInsertCode={onInsertCode}
      />
    </div>
  )
}