import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

const translations = {
  en: {
    features: 'Features',
    leaderboard: 'Leaderboard',
    pricing: 'Pricing',
    signIn: 'Sign In',
    github: 'GitHub',
    getStarted: 'Get Started',
    startCoding: 'Start Coding',
    learnMore: 'Learn More',
  },
  ko: {
    features: '기능',
    leaderboard: '리더보드',
    pricing: '가격',
    signIn: '로그인',
    github: '깃허브',
    getStarted: '시작하기',
    startCoding: '코딩 시작',
    learnMore: '자세히 보기',
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}