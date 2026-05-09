import { useState } from 'react'
import LandingPage from './landing/LandingPage'
import TopBar from './components/TopBar'
import CodeEditor from './components/CodeEditor'
import RightPanel from './components/RightPanel'
import BottomNav from './components/BottomNav'
import PricingPage from './pages/PricingPage'
import './App.css'

export default function App() {
  const [page, setPage] = useState('landing')

  const navigateTo = (p) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  if (page === 'ide') {
    return (
      <div className="app">
        <TopBar onHome={() => navigateTo('landing')} />
        <div className="workspace">
          <CodeEditor />
          <RightPanel />
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
