import './LandingPage.css'
import Navbar from './Navbar'
import Hero from './Hero'
import Problem from './Problem'
import Features from './Features'
import Target from './Target'
import CTA from './CTA'
import Footer from './Footer'

export default function LandingPage({ onStart, onLeaderboard, onAuth }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="landing">
      <Navbar onStart={onStart} onLeaderboard={onLeaderboard} onAuth={onAuth} onHome={scrollToTop} />
      <Hero onStart={onStart} />
      <Problem />
      <Features />
      <Target />
      <CTA onStart={onStart} />
      <Footer />
    </div>
  )
}
