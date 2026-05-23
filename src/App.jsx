import { useState, useEffect, useCallback, useRef } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import { PROBLEMS } from './problems'
import { runCode as judge0RunCode, LANGUAGE_IDS } from './services/judge0Service'
import { instrumentStackQueueCode, parseStackQueueOutput } from './services/stackQueueInstrumenter'
import { saveUserCode, loadUserCode, saveUserCodeLocal, loadUserCodeLocal } from './services/userCodeService'
import './App.css'
import LeaderboardPage from './pages/LeaderboardPage'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import memoryChip from './assets/memory-chip.png'

function safeBtoa(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1)
  }))
}

function safeAtob(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

function IDEContent({ editorTheme, code, setCode, currentProblem, setCurrentProblem, terminalOutput, setTerminalOutput, executionData, setExecutionData, navigateTo, hasError, setHasError, showHint, setShowHint, showDictionary, setShowDictionary, onInsertCode }) {
	const { t } = useLanguage()
	const { user } = useAuth()
	const [rightPanelWidth, setRightPanelWidth] = useState(520)
	const [bottomHeight, setBottomHeight] = useState(280)
	const [isResizingH, setIsResizingH] = useState(false)
	const [isResizingV, setIsResizingV] = useState(false)
	const startY = useRef(0)
	const startX = useRef(0)

  const handleMouseMove = useCallback((e) => {
    if (isResizingH) {
      const newHeight = Math.max(150, Math.min(500, bottomHeight + e.clientY - startY.current))
      setBottomHeight(newHeight)
    }
    if (isResizingV) {
      const newWidth = Math.max(280, Math.min(900, rightPanelWidth + startX.current - e.clientX))
      setRightPanelWidth(newWidth)
    }
  }, [isResizingH, isResizingV, bottomHeight, rightPanelWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizingH(false)
    setIsResizingV(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    if (isResizingH || isResizingV) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, isResizingH, isResizingV])

  const startResizeH = (e) => {
    setIsResizingH(true)
    startY.current = e.clientY
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
  }

  const startResizeV = (e) => {
    setIsResizingV(true)
    startX.current = e.clientX
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    if (!user || !currentProblem) return
    const loadCode = async () => {
      const saved = loadUserCodeLocal(user.email, currentProblem.id)
      if (saved) {
        setCode(saved)
      }
    }
    loadCode()
  }, [user, currentProblem?.id])

  useEffect(() => {
    if (!user || !currentProblem || !code) return
    saveUserCodeLocal(user.email, currentProblem.id, code)
  }, [user, currentProblem?.id, code])

  const selectProblem = (id) => {
    const p = PROBLEMS.find(p => p.id === id)
    if (p) {
      setCurrentProblem(p)
      const newCode = p.starterCode;
      setCode(newCode)
      localStorage.setItem('code', newCode);
      localStorage.setItem('problemId', id);
      setTerminalOutput([t('waitingForExecution')])
      setExecutionData({ variables: {}, stack: [], queue: [], memory: [] })
      setHasError(false)
      setShowHint(false)
    }
  }

  const runCode = async () => {
    setTerminalOutput(['$ compiling...', ''])
    setHasError(false)
    setShowHint(false)

    try {
      console.log('code being sent to judge0:', code.substring(0, 400));
      const result = await judge0RunCode(code, 'c');

      if (result.type === 'success') {
        const { stack, queue } = parseStackQueueOutput(result.output);
        console.log('SUCCESS - queue data:', queue);
        setTerminalOutput(prev => [...prev, result.output || '', t('success')]);
        setExecutionData({ variables: {}, stack: [], queue: queue, memory: [] });
      }

      switch (result.type) {
        case 'success':
          break
        case 'compile_error':
          setTerminalOutput(prev => [...prev, '', '💥 컴파일 오류:', result.output])
          setHasError(true)
          break
        case 'runtime_error':
          setTerminalOutput(prev => [...prev, '', '⚡ 실행 오류:', result.output])
          setHasError(true)
          break
        case 'timeout':
          setTerminalOutput(prev => [...prev, '', '⏰ 시간 초과:', result.output])
          setHasError(true)
          break
        default:
          setTerminalOutput(prev => [...prev, '', '❌ 오류:', result.output])
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, '', '🌐 연결 오류: 네트워크를 확인해주세요.'])
    }
  }

  return (
    <div className="app">
      <TopBar
        onHome={() => navigateTo('landing')}
        onRun={runCode}
        onLeaderboard={() => navigateTo('leaderboard')}
        onAuth={() => navigateTo('auth')}
        currentProblem={currentProblem}
        onSelectProblem={selectProblem}
        onInsertCode={onInsertCode}
        showDictionary={showDictionary}
        setShowDictionary={setShowDictionary}
      />
      <div className="workspace">
        <CodeEditor code={code} onChange={setCode} theme={editorTheme} />
        <div className="resize-handle-v" onMouseDown={startResizeV} />
        <RightPanel
          problem={currentProblem}
          terminalOutput={terminalOutput}
          executionData={executionData}
          width={rightPanelWidth}
          hasError={hasError}
          showHint={showHint}
          setShowHint={setShowHint}
        />
      </div>
      <div className="resize-handle-h" onMouseDown={startResizeH} />
      <div className="bottom-viz" style={{ height: bottomHeight }}>
        <div className="viz-section memory-viz-section">
          <span className="viz-section-title">MEMORY</span>
          <div className="viz-content memory-content">
            {executionData.memory && executionData.memory.length > 0 ? (
              executionData.memory.map((mem, i) => (
                <div key={i} className="mem-chip-wrapper">
                  <img src={memoryChip} alt="memory chip" className="mem-chip-img" />
                  <div className="mem-chip-overlay">
                    <span className="mem-chip-addr">{mem.address}</span>
                    <span className="mem-chip-name">{mem.name}</span>
                    <span className="mem-chip-value">{mem.value}</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="viz-empty">{t('noMemoryData')}</span>
            )}
          </div>
        </div>
        <div className="viz-section">
          <span className="viz-section-title">STACK</span>
          <div className="viz-content stack-content">
            {executionData.stack && executionData.stack.length > 0 ? (
              executionData.stack.map((item, i) => (
                <div key={i} className="stack-block">{item}</div>
              ))
            ) : (
              <span className="viz-empty">{t('noStackData')}</span>
            )}
          </div>
        </div>
        <div className="viz-section">
          <span className="viz-section-title">QUEUE</span>
          <div className="viz-content queue-content">
            {executionData.queue && executionData.queue.length > 0 ? (
              executionData.queue.map((item, i) => (
                <div key={i} className="queue-block">{item}</div>
              ))
            ) : (
              <span className="viz-empty">{t('noQueueData')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const savedId = localStorage.getItem('problemId');
  const savedCode = localStorage.getItem('code');
  const savedTheme = localStorage.getItem('editorTheme');
  const initialProblem = savedId ? PROBLEMS.find(p => p.id === savedId) || PROBLEMS[0] : PROBLEMS[0];
  const [page, setPage] = useState('landing');
  const [currentProblem, setCurrentProblem] = useState(initialProblem);
  const [code, setCode] = useState(() => {
    if (initialProblem.starterCode !== savedCode) {
      return initialProblem.starterCode;
    }
    return savedCode || PROBLEMS[0].starterCode;
  });
  const [terminalOutput, setTerminalOutput] = useState(['Waiting for execution...']);
  const [executionData, setExecutionData] = useState({ variables: {}, stack: [], queue: [], memory: [] });
  const [editorTheme, setEditorTheme] = useState(savedTheme || 'default');
  const [hasError, setHasError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

  const handleInsertCode = (code) => {
    setCode(prev => prev + '\n' + code);
    setShowDictionary(false);
  }

  useEffect(() => {
    localStorage.setItem('problemId', currentProblem.id);
  }, [currentProblem.id])

  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code])

  useEffect(() => {
    localStorage.setItem('editorTheme', editorTheme);
  }, [editorTheme])

  useEffect(() => {
    const path = window.location.pathname;
    const initialPage = path === '/ide' ? 'ide' : path === '/leaderboard' ? 'leaderboard' : path === '/auth' ? 'auth' : 'landing';
    setPage(initialPage);
    window.history.replaceState({ page: initialPage }, '');

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page);
      } else {
        setPage('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (p) => {
    setPage(p);
    window.history.pushState({ page: p }, '', p === 'landing' ? '/' : `/${p}`);
    window.scrollTo(0, 0);
  }

  return (
    <LanguageProvider>
    <ThemeProvider>
    <AuthProvider>
      {page === 'auth' ? (
        <AuthPage onNavigate={navigateTo} />
      ) : page === 'ide' ? (
        <IDEContent
          editorTheme={editorTheme}
          setEditorTheme={setEditorTheme}
          code={code}
          setCode={setCode}
          currentProblem={currentProblem}
          setCurrentProblem={setCurrentProblem}
          terminalOutput={terminalOutput}
          setTerminalOutput={setTerminalOutput}
          executionData={executionData}
          setExecutionData={setExecutionData}
          navigateTo={navigateTo}
          hasError={hasError}
          setHasError={setHasError}
          showHint={showHint}
          setShowHint={setShowHint}
          showDictionary={showDictionary}
          setShowDictionary={setShowDictionary}
          onInsertCode={handleInsertCode}
        />
      ) : page === 'leaderboard' ? (
        <LeaderboardPage onNavigate={navigateTo} />
      ) : (
        <LandingPage onStart={() => navigateTo('ide')} onLeaderboard={() => navigateTo('leaderboard')} onAuth={() => navigateTo('auth')} />
      )}
    </AuthProvider>
    </ThemeProvider>
    </LanguageProvider>
  )
}