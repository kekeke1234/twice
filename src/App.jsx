import { useState, useEffect } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import BottomNav from './components/BottomNav'
import PricingPage from './pages/PricingPage'
import { PROBLEMS } from './problems'
import './App.css'

export default function App() {
  const [page, setPage] = useState('landing')
  const [currentProblem, setCurrentProblem] = useState(PROBLEMS[0])
  const [code, setCode] = useState(PROBLEMS[0].starterCode)
  const [terminalOutput, setTerminalOutput] = useState(['Waiting for execution...'])
  const [executionData, setExecutionData] = useState({ variables: {}, stack: [], queue: [], memory: [] })

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page)
      } else {
        setPage('landing')
      }
    }
    window.addEventListener('popstate', handlePopState)
    
    // Initial state
    window.history.replaceState({ page: 'landing' }, '')
    
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
    setTerminalOutput(['$ gcc main.c -o main', '$ ./main'])
    
    setTimeout(() => {
      const newExecutionData = { variables: {}, stack: [], queue: [], memory: [] }
      let baseAddr = 0x7ff00000
      
      // Simple variable extraction (int x = value)
      const varMatches = code.matchAll(/int\s+(\w+)\s*=\s*(\d+)/g)
      for (const match of varMatches) {
        const name = match[1]
        const val = match[2]
        newExecutionData.variables[name] = val
        
        // Add to memory map
        newExecutionData.memory.push({
          address: '0x' + (baseAddr).toString(16).toUpperCase(),
          name: name,
          value: val,
          type: 'int'
        })
        baseAddr += 4 // Simulate 4-byte int
      }

      // Simple stack extraction (push(value))
      const stackMatches = code.matchAll(/push\((\d+)\)/g)
      for (const match of stackMatches) {
        const val = match[1]
        newExecutionData.stack.push(val)
        
        // Add stack items to memory too
        newExecutionData.memory.push({
          address: '0x' + (baseAddr).toString(16).toUpperCase(),
          name: `stack[${newExecutionData.stack.length - 1}]`,
          value: val,
          type: 'int'
        })
        baseAddr += 4
      }

      // Simple queue extraction (enqueue(value))
      const queueMatches = code.matchAll(/enqueue\((\d+)\)/g)
      for (const match of queueMatches) {
        newExecutionData.queue.push(match[1])
      }

      setExecutionData(newExecutionData)

      // Very simple simulation of C code execution
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

  if (page === 'ide') {
    return (
      <div className="app">
        <TopBar onHome={() => navigateTo('landing')} onRun={runCode} />
        <div className="workspace">
          <CodeEditor code={code} onChange={setCode} />
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
    )
  }

  if (page === 'pricing') {
    return <PricingPage onNavigate={navigateTo} />
  }

  return <LandingPage onStart={() => navigateTo('ide')} onPricing={() => navigateTo('pricing')} />
}
