import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './AuthPage.css'

export default function AuthPage({ onNavigate }) {
  const { user, signup, login } = useAuth()
  const { t } = useLanguage()
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
          <h2>{t('welcome')}, {user.nickname}!</h2>
          <p className="auth-sub">{t('youAreLoggedIn')}</p>
          <div className="auth-links">
            <button className="auth-btn" onClick={() => onNavigate('ide')}>{t('goToIDE')}</button>
            <button className="auth-btn secondary" onClick={() => onNavigate('leaderboard')}>{t('leaderboard')}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>{t('login')}</button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError('') }}>{t('signUp')}</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">{t('email')}</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          {mode === 'signup' && (
            <>
              <label className="auth-label">{t('nickname')}</label>
              <input className="auth-input" type="text" value={nickname} onChange={e => setNickname(e.target.value)} required placeholder={t('yourDisplayName')} />
            </>
          )}

          <label className="auth-label">{t('password')}</label>
          <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">{mode === 'signup' ? t('createAccount') : t('login')}</button>
        </form>
      </div>
    </div>
  )
}
