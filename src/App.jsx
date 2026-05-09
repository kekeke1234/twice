import { useState, useEffect } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import BottomNav from './components/BottomNav'
import PricingPage from './pages/PricingPage'
import { PROBLEMS } from './problems'
import './App.css'
import LeaderboardPage from './pages/LeaderboardPage'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { validateCCode } from './cValidator'

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

  // Persist problem and code across refreshes
  useEffect(() => {
    localStorage.setItem('problemId', currentProblem.id)
  }, [currentProblem.id])

  useEffect(() => {
    localStorage.setItem('code', code)
  }, [code])

  useEffect(() => {
    localStorage.setItem('editorTheme', editorTheme)
  }, [editorTheme])

  // Handle browser back/forward buttons and initial page load
  useEffect(() => {
    const path = window.location.pathname
    const initialPage = path === '/ide' ? 'ide' : path === '/pricing' ? 'pricing' : path === '/leaderboard' ? 'leaderboard' : path === '/auth' ? 'auth' : 'landing'
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

  const selectProblem = (id) => {
    const p = PROBLEMS.find(p => p.id === id)
    if (p) {
      setCurrentProblem(p)
      setCode(p.starterCode)
      setTerminalOutput(['Waiting for execution...'])
      setExecutionData({ variables: {}, stack: [], queue: [] })
    }
  }

  const runCode = () => {
    const errors = validateCCode(code)
    if (errors.length > 0) {
      const lines = errors.map(e =>
        e.line > 0 ? `  at main.c:${e.line}: ${e.message}` : `  ${e.message}`
      )
      setTerminalOutput(['$ gcc main.c -o main', '$ ./main', '', ...lines, '', 'Compilation failed.'])
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
          setTerminalOutput(prev => [...prev, 'Hello, World!', '', 'Success! Problem solved.'])
        } else {
          setTerminalOutput(prev => [...prev, 'Error: Output does not match expected "Hello, World!"'])
        }
      } else if (currentProblem.id === 'variables') {
        if (code.includes('printf("%d\\n", a + b)') || code.includes('printf("%d", 30)') || (newExecutionData.variables.a && newExecutionData.variables.b)) {
          const sum = (parseInt(newExecutionData.variables.a) || 0) + (parseInt(newExecutionData.variables.b) || 0)
          setTerminalOutput(prev => [...prev, sum.toString(), '', 'Success! Problem solved.'])
        } else {
          setTerminalOutput(prev => [...prev, 'Error: Sum not printed correctly.'])
        }
      } else if (currentProblem.id === 'stack') {
        if (newExecutionData.stack.length >= 3) {
          setTerminalOutput(prev => [...prev, 'Stack state updated.', '', 'Success! Problem solved.'])
        } else {
          setTerminalOutput(prev => [...prev, 'Try pushing 10, 20, and 30 to the stack.'])
        }
      } else if (currentProblem.id === 'queue') {
        if (newExecutionData.queue.length >= 3) {
          setTerminalOutput(prev => [...prev, 'Queue state updated.', '', 'Success! Problem solved.'])
        } else {
          setTerminalOutput(prev => [...prev, 'Try enqueuing 1, 2, and 3 to the queue.'])
        }
      } else if (currentProblem.id === 'if-else') {
        if (code.includes('printf("Odd\\n")') || code.includes('printf("Odd")')) {
          setTerminalOutput(prev => [...prev, 'Odd', '', 'Success! Problem solved.'])
        } else {
          setTerminalOutput(prev => [...prev, 'Error: Incorrect logic or output.'])
        }
      }
    }, 500)
  }

  return (
    <LanguageProvider>
    <AuthProvider>
      {page === 'auth' ? (
        <AuthPage onNavigate={navigateTo} />
      ) : page === 'ide' ? (
        <div className="app">
          <TopBar onHome={() => navigateTo('landing')} onRun={runCode} onLeaderboard={() => navigateTo('leaderboard')} onAuth={() => navigateTo('auth')} editorTheme={editorTheme} onThemeChange={setEditorTheme} />
          <div className="workspace">
            <CodeEditor code={code} onChange={setCode} theme={editorTheme} />
            <RightPanel 
              problem={currentProblem} 
              problems={PROBLEMS}
              onSelectProblem={selectProblem}
              terminalOutput={terminalOutput}
              executionData={executionData}
            />
          </div>
          <BottomNav />
        </div>
      ) : page === 'pricing' ? (
        <PricingPage onNavigate={navigateTo} />
      ) : page === 'leaderboard' ? (
        <LeaderboardPage onNavigate={navigateTo} />
      ) : (
        <LandingPage onStart={() => navigateTo('ide')} onPricing={() => navigateTo('pricing')} onLeaderboard={() => navigateTo('leaderboard')} onAuth={() => navigateTo('auth')} />
      )}
    </AuthProvider>
    </LanguageProvider>
  )
}
