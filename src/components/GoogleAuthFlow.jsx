import { useGoogleLogin } from '@react-oauth/google'
import { useState, useEffect } from 'react'
import './GoogleAuthFlow.css'

const CLIENT_ID_SET = !!(
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE'
)

/* ── Google "G" icon ── */
const GoogleG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

/* ── Setup instructions shown when no Client ID is configured ── */
const SetupGuide = ({ onClose }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])
  const handleClose = () => { setVisible(false); setTimeout(onClose, 300) }

  return (
    <div className={`gaf-overlay ${visible ? 'gaf-overlay--visible' : ''}`} onClick={handleClose}>
      <div className={`gaf-popup ${visible ? 'gaf-popup--visible' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="gaf-header">
          <GoogleG size={28} />
          <button className="gaf-header__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="gaf-body">
          <div className="gaf-title-block">
            <h2 className="gaf-title">Google Sign-In</h2>
            <p className="gaf-subtitle">Setup required — takes 2 minutes</p>
          </div>

          <div className="gaf-setup-steps">
            <div className="gaf-setup-step">
              <div className="gaf-setup-num">1</div>
              <div>
                Go to{' '}
                <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">
                  console.cloud.google.com
                </a>
              </div>
            </div>
            <div className="gaf-setup-step">
              <div className="gaf-setup-num">2</div>
              <div>Create a project → <strong>APIs &amp; Services</strong> → <strong>Credentials</strong></div>
            </div>
            <div className="gaf-setup-step">
              <div className="gaf-setup-num">3</div>
              <div>Click <strong>Create Credentials</strong> → <strong>OAuth 2.0 Client ID</strong> → Web application</div>
            </div>
            <div className="gaf-setup-step">
              <div className="gaf-setup-num">4</div>
              <div>
                Add these <strong>Authorized JavaScript origins</strong>:
                <div className="gaf-setup-code">http://localhost:5173</div>
                <div className="gaf-setup-code">https://your-app.vercel.app</div>
              </div>
            </div>
            <div className="gaf-setup-step">
              <div className="gaf-setup-num">5</div>
              <div>
                Copy the <strong>Client ID</strong> and paste it in your <code>.env</code> file:
                <div className="gaf-setup-code">VITE_GOOGLE_CLIENT_ID=your-client-id-here</div>
              </div>
            </div>
          </div>

          <div className="gaf-actions" style={{ justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button className="gaf-btn gaf-btn--text" onClick={handleClose}>Close</button>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="gaf-btn gaf-btn--primary"
              style={{ textDecoration: 'none' }}
            >
              Open Google Console →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Success screen after real OAuth ── */
const SuccessScreen = ({ user, onClose }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`gaf-overlay ${visible ? 'gaf-overlay--visible' : ''}`}>
      <div className={`gaf-popup ${visible ? 'gaf-popup--visible' : ''}`}>
        <div className="gaf-body gaf-body--success">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="gaf-success-photo"
            />
          ) : (
            <div className="gaf-success-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke="#e8f5e9" strokeWidth="4"/>
                <circle className="gaf-success-circle" cx="28" cy="28" r="26" fill="none" stroke="#34A853" strokeWidth="4"
                  strokeDasharray="163" strokeDashoffset="163" strokeLinecap="round"/>
                <path className="gaf-success-check" d="M17 28l8 8 14-14" fill="none" stroke="#34A853" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="30"/>
              </svg>
            </div>
          )}
          <h2 className="gaf-success-title">You're signed in!</h2>
          <p className="gaf-success-sub">Welcome, {user?.given_name || user?.name?.split(' ')[0]} 👋</p>
          <p className="gaf-success-email">{user?.email}</p>
          <p className="gaf-success-redirect">Redirecting to NammaSeva…</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN COMPONENT — Real Google OAuth
════════════════════════════════════════════ */
const GoogleAuthFlow = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState('idle') // idle | loading | success | setup
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  /* If no Client ID configured, show setup guide */
  if (!CLIENT_ID_SET) {
    return <SetupGuide onClose={onClose} />
  }

  /* Real Google Login — opens native Google account picker */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setStep('loading')
      try {
        /* Fetch user profile from Google */
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const profile = await res.json()
        setUser(profile)
        setStep('success')
        onSuccess && onSuccess(profile)
      } catch {
        setError('Could not fetch your profile. Please try again.')
        setStep('error')
      }
    },
    onError: (err) => {
      if (err.error !== 'access_denied') {
        setError('Sign-in failed. Please try again.')
        setStep('error')
      } else {
        onClose()
      }
    },
    flow: 'implicit',
  })

  /* Trigger login immediately when component mounts */
  useEffect(() => {
    const t = setTimeout(() => login(), 100)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (step === 'success' && user) {
    return <SuccessScreen user={user} onClose={onClose} />
  }

  if (step === 'loading') {
    return (
      <div className="gaf-overlay gaf-overlay--visible">
        <div className="gaf-popup gaf-popup--visible">
          <div className="gaf-body gaf-body--signing">
            <div className="gaf-signing-dots">
              <span /><span /><span />
            </div>
            <p className="gaf-signing-msg">Signing you in with Google…</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="gaf-overlay gaf-overlay--visible" onClick={onClose}>
        <div className="gaf-popup gaf-popup--visible" onClick={e => e.stopPropagation()}>
          <div className="gaf-header">
            <GoogleG size={28} />
            <button className="gaf-header__close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="gaf-body" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <p style={{ color: '#d93025', fontWeight: 600, marginBottom: 8 }}>{error}</p>
            <div className="gaf-actions" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="gaf-btn gaf-btn--primary" onClick={() => { setError(null); setStep('idle'); setTimeout(() => login(), 100) }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* idle — show a brief loading state while popup opens */
  return (
    <div className="gaf-overlay gaf-overlay--visible">
      <div className="gaf-popup gaf-popup--visible">
        <div className="gaf-body gaf-body--signing">
          <GoogleG size={40} />
          <p className="gaf-signing-msg" style={{ marginTop: 16 }}>
            Opening Google sign-in…
          </p>
          <p style={{ fontSize: 13, color: '#9aa0a6', marginTop: 4 }}>
            A popup window will appear
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoogleAuthFlow
