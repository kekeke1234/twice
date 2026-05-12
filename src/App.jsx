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
import { validateCCode } from './cValidator'
import memoryChip from './assets/memory-chip.png'

function IDEContent({ editorTheme, setEditorTheme, code, setCode, currentProblem, setCurrentProblem, terminalOutput, setTerminalOutput, executionData, setExecutionData, navigateTo }) {
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

  const runCode = () => {
    const errors = validateCCode(code)
    if (errors.length > 0) {
      const lines = errors.map(e =>
        e.line > 0 ? `  at main.c:${e.line}: ${e.message}` : `  ${e.message}`
      )
      setTerminalOutput(['$ gcc main.c -o main', '$ ./main', '', ...lines, '', t('compilationFailed')])
      setExecutionData({ variables: {}, stack: [], queue: [], memory: [] })
      return
    }

    setTerminalOutput(['$ gcc main.c -o main', '$ ./main'])

    setTimeout(() => {
      const newExecutionData = { variables: {}, stack: [], queue: [], memory: [] }
      let baseAddr = 0x7ff00000

      const varMatches = code.matchAll(/int\s+(\w+)\s*=\s*(\d+)/g)
      for (const match of varMatches) {
        const name = match[1]
        const val = match[2]
        newExecutionData.variables[name] = val
        newExecutionData.memory.push({
          address: '0x' + (baseAddr).toString(16).toUpperCase(),
          name: name,
          value: val,
          type: 'int'
        })
        baseAddr += 4
      }

      const stackMatches = code.matchAll(/push\((\d+)\)/g)
      for (const match of stackMatches) {
        const val = match[1]
        newExecutionData.stack.push(val)
        newExecutionData.memory.push({
          address: '0x' + (baseAddr).toString(16).toUpperCase(),
          name: `stack[${newExecutionData.stack.length - 1}]`,
          value: val,
          type: 'int'
        })
        baseAddr += 4
      }

      const queueMatches = code.matchAll(/enqueue\((\d+)\)/g)
      for (const match of queueMatches) {
        newExecutionData.queue.push(match[1])
      }

      setExecutionData(newExecutionData)

      if (currentProblem.id === 'hello-world') {
        if (code.includes('printf("Hello, World!\\n")') || code.includes('printf("Hello, World!")')) {
          setTerminalOutput(prev => [...prev, 'Hello, World!', '', t('success')])
        } else {
          setTerminalOutput(prev => [...prev, `Error: Output does not match expected "Hello, World!"`])
        }
      } else if (currentProblem.id === 'variables') {
        if (code.includes('printf("%d\\n", a + b)') || code.includes('printf("%d", 30)') || (newExecutionData.variables.a && newExecutionData.variables.b)) {
          const sum = (parseInt(newExecutionData.variables.a) || 0) + (parseInt(newExecutionData.variables.b) || 0)
          setTerminalOutput(prev => [...prev, sum.toString(), '', t('success')])
        } else {
          setTerminalOutput(prev => [...prev, t('errorSumIncorrect')])
        }
      } else if (currentProblem.id === 'stack') {
        if (newExecutionData.stack.length >= 3) {
          setTerminalOutput(prev => [...prev, 'Stack state updated.', '', t('success')])
        } else {
          setTerminalOutput(prev => [...prev, t('tryPushing')])
        }
      } else if (currentProblem.id === 'queue') {
        if (newExecutionData.queue.length >= 3) {
          setTerminalOutput(prev => [...prev, 'Queue state updated.', '', t('success')])
        } else {
          setTerminalOutput(prev => [...prev, t('tryEnqueuing')])
        }
      } else if (currentProblem.id === 'if-else') {
        if (code.includes('printf("Odd\\n")') || code.includes('printf("Odd")')) {
          setTerminalOutput(prev => [...prev, 'Odd', '', t('success')])
        } else {
          setTerminalOutput(prev => [...prev, t('errorIncorrectLogic')])
        }
      }
    }, 500)
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
  const savedId = localStorage.getItem('problemId')
  const savedCode = localStorage.getItem('code')
  const savedTheme = localStorage.getItem('editorTheme')
  const initialProblem = savedId ? PROBLEMS.find(p => p.id === savedId) || PROBLEMS[0] : PROBLEMS[0]
  const [page, setPage] = useState('landing')
  const [currentProblem, setCurrentProblem] = useState(initialProblem)
  const [code, setCode] = useState(savedCode || PROBLEMS[0].starterCode)
  const [terminalOutput, setTerminalOutput] = useState(['Waiting for execution...'])
  const [executionData, setExecutionData] = useState({ variables: {}, stack: [], queue: [], memory: [] })
  const [editorTheme, setEditorTheme] = useState(savedTheme || 'default')

  useEffect(() => {
    localStorage.setItem('problemId', currentProblem.id)
  }, [currentProblem.id])

  useEffect(() => {
    localStorage.setItem('code', code)
  }, [code])

  useEffect(() => {
    localStorage.setItem('editorTheme', editorTheme)
  }, [editorTheme])

  useEffect(() => {
    const path = window.location.pathname
    const initialPage = path === '/ide' ? 'ide' : path === '/leaderboard' ? 'leaderboard' : path === '/auth' ? 'auth' : 'landing'
    setPage(initialPage)
    window.history.replaceState({ page: initialPage }, '')

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page)
      } else {
        setPage('landing')
      }
    }
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (p) => {
    setPage(p)
    window.history.pushState({ page: p }, '', p === 'landing' ? '/' : `/${p}`)
    window.scrollTo(0, 0)
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