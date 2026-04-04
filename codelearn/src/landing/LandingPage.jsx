import './LandingPage.css'
import Navbar from './Navbar'
import Hero from './Hero'
import Problem from './Problem'
import Features from './Features'
import Target from './Target'
import CTA from './CTA'
import Footer from './Footer'

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <Navbar onStart={onStart} />
      <Hero onStart={onStart} />
      <Problem />
      <Features />
      <Target />
      <CTA onStart={onStart} />
      <Footer />
    </div>
  )
}
