import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage({ onNavigate }) {
  const { user, signup, login } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const fn = mode === 'signup' ? signup : login
    const params = mode === 'signup' ? [email, password, nickname] : [email, password]
    const result = fn(...params)
    if (!result.ok) {
      setError(result.error)
    }
  }

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Welcome, {user.nickname}!</h2>
          <p className="auth-sub">You are logged in.</p>
          <div className="auth-links">
            <button className="auth-btn" onClick={() => onNavigate('ide')}>Go to IDE</button>
            <button className="auth-btn secondary" onClick={() => onNavigate('leaderboard')}>Leaderboard</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>Login</button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError('') }}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          {mode === 'signup' && (
            <>
              <label className="auth-label">Nickname</label>
              <input className="auth-input" type="text" value={nickname} onChange={e => setNickname(e.target.value)} required placeholder="Your display name" />
            </>
          )}

          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">{mode === 'signup' ? 'Create Account' : 'Login'}</button>
        </form>
      </div>
    </div>
  )
}
