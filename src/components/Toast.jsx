import { useState, useEffect, useCallback } from 'react'
import './Toast.css'

/* ── Toast Context & Hook ── */
import { createContext, useContext } from 'react'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

/* ── Individual Toast ── */
const ToastItem = ({ id, type, title, message, icon, onRemove }) => {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 4000)
    return () => clearTimeout(t)
  }, [id, onRemove])

  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  }

  return (
    <div className={`toast toast--${type}`}>
      <div className={`toast__icon-wrap toast__icon-wrap--${type}`}>
        {icon || icons[type]}
      </div>
      <div className="toast__body">
        {title && <div className="toast__title">{title}</div>}
        {message && <div className="toast__message">{message}</div>}
      </div>
      <button className="toast__close" onClick={() => onRemove(id)} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div className="toast__progress" />
    </div>
  )
}

/* ── Toast Provider ── */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback(({ type = 'info', title, message, icon }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, icon }])
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
