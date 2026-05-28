import { useState, useEffect } from 'react'
import './GoogleAuthFlow.css'

/* ── Animated Google "G" SVG ── */
const GoogleG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

/* ── Fake demo accounts ── */
const DEMO_ACCOUNTS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    avatar: 'RS',
    avatarColor: '#1a73e8',
  },
  {
    id: 2,
    name: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    avatar: 'PN',
    avatarColor: '#059669',
  },
]

/* ── Steps ── */
const STEP = {
  PICKER: 'picker',
  SIGNING_IN: 'signing_in',
  SUCCESS: 'success',
}

const GoogleAuthFlow = ({ onClose, onSuccess, mode = 'login' }) => {
  const [step, setStep] = useState(STEP.PICKER)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [useOtherEmail, setUseOtherEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [visible, setVisible] = useState(false)

  /* mount animation */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const handleAccountSelect = (account) => {
    setSelectedAccount(account)
    setStep(STEP.SIGNING_IN)
    /* simulate OAuth flow */
    setTimeout(() => {
      setStep(STEP.SUCCESS)
      setTimeout(() => {
        handleClose()
        onSuccess && onSuccess(account)
      }, 1800)
    }, 2200)
  }

  const handleOtherEmail = (e) => {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Enter a valid Gmail address')
      return
    }
    setEmailError('')
    const fakeAccount = {
      id: 99,
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      avatar: email[0].toUpperCase(),
      avatarColor: '#7C3AED',
    }
    handleAccountSelect(fakeAccount)
  }

  return (
    <div className={`gaf-overlay ${visible ? 'gaf-overlay--visible' : ''}`} onClick={handleClose}>
      <div
        className={`gaf-popup ${visible ? 'gaf-popup--visible' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in with Google"
      >
        {/* Header */}
        <div className="gaf-header">
          <div className="gaf-header__logo">
            <GoogleG size={28} />
          </div>
          <button className="gaf-header__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── STEP: Account Picker ── */}
        {step === STEP.PICKER && (
          <div className="gaf-body gaf-body--picker">
            <div className="gaf-title-block">
              <h2 className="gaf-title">Sign in</h2>
              <p className="gaf-subtitle">to continue to <strong>NammaSeva</strong></p>
            </div>

            {!useOtherEmail ? (
              <>
                <p className="gaf-hint">Choose an account</p>
                <div className="gaf-accounts">
                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.id}
                      className="gaf-account"
                      onClick={() => handleAccountSelect(acc)}
                    >
                      <div className="gaf-account__avatar" style={{ background: acc.avatarColor }}>
                        {acc.avatar}
                      </div>
                      <div className="gaf-account__info">
                        <span className="gaf-account__name">{acc.name}</span>
                        <span className="gaf-account__email">{acc.email}</span>
                      </div>
                      <svg className="gaf-account__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  ))}

                  <button
                    className="gaf-account gaf-account--other"
                    onClick={() => setUseOtherEmail(true)}
                  >
                    <div className="gaf-account__avatar gaf-account__avatar--other">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                    <div className="gaf-account__info">
                      <span className="gaf-account__name">Use another account</span>
                    </div>
                    <svg className="gaf-account__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              /* Other email form */
              <form className="gaf-email-form" onSubmit={handleOtherEmail} noValidate>
                <div className={`gaf-email-field ${emailError ? 'gaf-email-field--error' : ''}`}>
                  <label className="gaf-email-label" htmlFor="gaf-email-input">Email address</label>
                  <div className="gaf-email-input-wrap">
                    <input
                      id="gaf-email-input"
                      type="email"
                      className="gaf-email-input"
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError('') }}
                      autoFocus
                      autoComplete="email"
                    />
                  </div>
                  {emailError && <p className="gaf-email-error">{emailError}</p>}
                </div>

                <p className="gaf-forgot-link">
                  <a href="#" onClick={e => e.preventDefault()}>Forgot email?</a>
                </p>

                <p className="gaf-note">
                  Not your computer? Use a Private Window to sign in.{' '}
                  <a href="#" onClick={e => e.preventDefault()}>Learn more</a>
                </p>

                <div className="gaf-actions">
                  <button type="button" className="gaf-btn gaf-btn--text" onClick={() => setUseOtherEmail(false)}>
                    Back
                  </button>
                  <button type="submit" className="gaf-btn gaf-btn--primary">
                    Next
                  </button>
                </div>
              </form>
            )}

            <div className="gaf-footer">
              <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
              <span>•</span>
              <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
            </div>
          </div>
        )}

        {/* ── STEP: Signing In ── */}
        {step === STEP.SIGNING_IN && (
          <div className="gaf-body gaf-body--signing">
            <div className="gaf-signing-avatar" style={{ background: selectedAccount?.avatarColor }}>
              {selectedAccount?.avatar}
            </div>
            <h2 className="gaf-signing-name">{selectedAccount?.name}</h2>
            <p className="gaf-signing-email">{selectedAccount?.email}</p>

            <div className="gaf-signing-dots">
              <span /><span /><span />
            </div>
            <p className="gaf-signing-msg">Signing you in…</p>

            <div className="gaf-signing-perms">
              <p className="gaf-signing-perms__title">NammaSeva will receive:</p>
              <div className="gaf-perm-item">
                <span className="gaf-perm-icon">📧</span>
                <span>Your email address</span>
              </div>
              <div className="gaf-perm-item">
                <span className="gaf-perm-icon">👤</span>
                <span>Your basic profile info</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: Success ── */}
        {step === STEP.SUCCESS && (
          <div className="gaf-body gaf-body--success">
            <div className="gaf-success-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke="#e8f5e9" strokeWidth="4"/>
                <circle className="gaf-success-circle" cx="28" cy="28" r="26" fill="none" stroke="#34A853" strokeWidth="4"
                  strokeDasharray="163" strokeDashoffset="163" strokeLinecap="round"/>
                <path className="gaf-success-check" d="M17 28l8 8 14-14" fill="none" stroke="#34A853" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="30"/>
              </svg>
            </div>
            <h2 className="gaf-success-title">You're signed in!</h2>
            <p className="gaf-success-sub">Welcome, {selectedAccount?.name.split(' ')[0]} 👋</p>
            <p className="gaf-success-redirect">Redirecting to NammaSeva…</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleAuthFlow
