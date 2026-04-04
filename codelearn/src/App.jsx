import { useState } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [page, setPage] = useState('landing')

  if (page === 'ide') {
    return (
      <div className="app">
        <TopBar onHome={() => setPage('landing')} />
        <div className="workspace">
          <CodeEditor />
          <RightPanel />
        </div>
        <BottomNav />
      </div>
    )
  }

  return <LandingPage onStart={() => setPage('ide')} />
}
