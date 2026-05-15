import { useState, useEffect, useCallback, useRef } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import { PROBLEMS } from './problems'
import './App.css'
import LeaderboardPage from './pages/LeaderboardPage'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './context/AuthContext'
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

function IDEContent({ editorTheme, code, setCode, currentProblem, setCurrentProblem, terminalOutput, setTerminalOutput, executionData, setExecutionData, navigateTo }) {
  const { t } = useLanguage()
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

  const selectProblem = (id) => {
    const p = PROBLEMS.find(p => p.id === id)
    if (p) {
      setCurrentProblem(p)
      setCode(p.starterCode)
      setTerminalOutput([t('waitingForExecution')])
      setExecutionData({ variables: {}, stack: [], queue: [] })
    }
  }

  const runCode = async () => {
    setTerminalOutput(['$ gcc main.c -o main', '$ ./main', '', 'Compiling...'])

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '177c7e9fe7mshc33b5d4a869679fp1976d7jsnbde38475596c',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: 52,
        source_code: safeBtoa(code),
        stdin: safeBtoa('')
      })
    }

    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true', options)
      const result = await response.json()

      if (result.stdout) {
        const output = safeAtob(result.stdout)
        setTerminalOutput(prev => [...prev, output, '', t('success')])
      } else if (result.compile_output) {
        const error = safeAtob(result.compile_output)
        setTerminalOutput(prev => [...prev, '', 'Compilation Error:', error])
      } else if (result.stderr) {
        const error = safeAtob(result.stderr)
        setTerminalOutput(prev => [...prev, '', 'Runtime Error:', error])
      } else {
        setTerminalOutput(prev => [...prev, '', 'Unknown error occurred'])
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, '', 'Connection error:', error.message])
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
      />
      <div className="workspace">
        <CodeEditor code={code} onChange={setCode} theme={editorTheme} />
        <div className="resize-handle-v" onMouseDown={startResizeV} />
        <RightPanel
          problem={currentProblem}
          terminalOutput={terminalOutput}
          executionData={executionData}
          width={rightPanelWidth}
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
  const [code, setCode] = useState(savedCode || PROBLEMS[0].starterCode);
  const [terminalOutput, setTerminalOutput] = useState(['Waiting for execution...']);
  const [executionData, setExecutionData] = useState({ variables: {}, stack: [], queue: [], memory: [] });
  const [editorTheme, setEditorTheme] = useState(savedTheme || 'default');

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