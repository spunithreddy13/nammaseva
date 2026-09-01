import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
]

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('ns_language') || 'en'
  })

  const changeLang = (code) => {
    setLang(code)
    localStorage.setItem('ns_language', code)
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
