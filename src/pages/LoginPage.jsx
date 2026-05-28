import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useToast } from '../components/Toast'
import GoogleAuthFlow from '../components/GoogleAuthFlow'
import './AuthPages.css'

/* ── Icons outside component to prevent remount ── */
const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
    <path d="M22 6l-10 7L2 6"/>
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)


/* ── Aadhaar Modal ── */
const AadhaarLoginModal = ({ onClose }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])
  const handleClose = () => { setVisible(false); setTimeout(onClose, 300) }
  return (
    <div className={`gaf-overlay ${visible ? 'gaf-overlay--visible' : ''}`} onClick={handleClose}>
      <div className={`gaf-popup ${visible ? 'gaf-popup--visible' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="gaf-header">
          <div style={{ fontSize: 28 }}>🪪</div>
          <button className="gaf-header__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="gaf-body">
          <div className="gaf-title-block">
            <h2 className="gaf-title">Login with Aadhaar</h2>
            <p className="gaf-subtitle">Secure OTP-based authentication via <strong>UIDAI</strong></p>
          </div>
          <div className="gaf-signing-perms" style={{ marginBottom: 16 }}>
            <p className="gaf-signing-perms__title">How it works</p>
            {[
              { icon: '🪪', text: 'Enter your 12-digit Aadhaar number' },
              { icon: '📱', text: 'Receive OTP on Aadhaar-linked mobile' },
              { icon: '✅', text: 'Verify and login securely' },
            ].map((s, i) => (
              <div className="gaf-perm-item" key={i}>
                <span className="gaf-perm-icon">{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(26,115,232,0.06)', border: '1px solid rgba(26,115,232,0.15)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#374151', marginBottom: 20 }}>
            🔒 <strong>100% Secure</strong> · UIDAI certified · No Aadhaar data stored on NammaSeva servers
          </div>
          <div className="gaf-actions" style={{ justifyContent: 'flex-end', gap: 12 }}>
            <button className="gaf-btn gaf-btn--text" onClick={handleClose}>Cancel</button>
            <button className="gaf-btn gaf-btn--primary" onClick={handleClose} style={{ background: 'linear-gradient(135deg,#0B2D6B,#1a3d8a)', boxShadow: '0 4px 14px rgba(11,45,107,0.3)' }}>
              Coming Soon
            </button>
          </div>
          <div className="gaf-footer" style={{ marginTop: 16 }}>
            <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
            <span>•</span>
            <a href="#" onClick={e => e.preventDefault()}>UIDAI Guidelines</a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════ */
const LoginPage = () => {
  const toast = useToast()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [showAadhaarModal, setShowAadhaarModal] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.identifier.trim()) errs.identifier = 'Email or phone is required'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.show({ type: 'error', title: 'Check your details', message: 'Please fix the errors before continuing.' })
      return
    }
    setLoading(true)
    toast.show({ type: 'info', title: 'Signing in...', message: 'Verifying your credentials.' })
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    toast.show({ type: 'success', title: 'Welcome back! 🎉', message: 'Login successful. Redirecting to your dashboard.' })
  }

  const handleGoogle = () => {
    setShowGoogleModal(true)
  }

  const handleGoogleSuccess = (account) => {
    toast.show({
      type: 'success',
      title: `Welcome, ${account.name.split(' ')[0]}! 🎉`,
      message: `Signed in as ${account.email}. Redirecting to your dashboard…`,
    })
  }

  const handleAadhaar = () => {
    setShowAadhaarModal(true)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    toast.show({
      type: 'info',
      title: 'Password Reset',
      message: 'Enter your registered email and we\'ll send a reset link. (Feature coming soon)',
    })
  }

  return (
    <div className="auth-page">
      <Navbar />

      {showGoogleModal && (
        <GoogleAuthFlow
          mode="login"
          onClose={() => setShowGoogleModal(false)}
          onSuccess={handleGoogleSuccess}
        />
      )}
      {showAadhaarModal && <AadhaarLoginModal onClose={() => setShowAadhaarModal(false)} />}

      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__grid" />
      </div>

      <div className="auth-container">
        {/* ── Brand Panel ── */}
        <div className="auth-panel auth-panel--brand">
          <div className="auth-brand">
            <div className="auth-brand__badge">🇮🇳 For Every Indian Citizen</div>
            <h2 className="auth-brand__title">
              Welcome Back to <span>NammaSeva</span>
            </h2>
            <p className="auth-brand__desc">
              Login to access your personalized government scheme recommendations. Your benefits are waiting.
            </p>

            <div className="auth-brand__stats">
              {[
                { icon: '📋', val: '500+', label: 'Schemes' },
                { icon: '👥', val: '1,200+', label: 'Citizens' },
                { icon: '🏛️', val: '5', label: 'States' },
              ].map((s, i) => (
                <div key={i} className="auth-brand__stat">
                  <div className="auth-brand__stat-icon">{s.icon}</div>
                  <div className="auth-brand__stat-val">{s.val}</div>
                  <div className="auth-brand__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-float-card auth-float-card--1">
            <span>✅</span><span>Scheme Matched!</span>
          </div>
          <div className="auth-float-card auth-float-card--2">
            <span>⚡</span><span>3 min to find schemes</span>
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className="auth-panel auth-panel--form">
          <div className="auth-form-wrap">
            <div className="auth-form__header">
              <Link to="/" className="auth-form__back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back to Home
              </Link>
              <div className="auth-form__logo">
                <div className="auth-logo-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="url(#lgGrad)" />
                    <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
                    <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
                    <defs>
                      <linearGradient id="lgGrad" x1="0" y1="0" x2="40" y2="40">
                        <stop offset="0%" stopColor="#FF6B00"/>
                        <stop offset="100%" stopColor="#FF8C38"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <h1 className="auth-form__title">Sign In</h1>
              <p className="auth-form__subtitle">Enter your credentials to access your account</p>
            </div>

            {/* Social Buttons */}
            <div className="auth-social-btns">
              <button className="auth-social-btn" id="google-login-btn" type="button" onClick={handleGoogle}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button className="auth-social-btn auth-social-btn--aadhaar" id="aadhaar-login-btn" type="button" onClick={handleAadhaar}>
                <div className="aadhaar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" opacity="0.15"/>
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="11" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M15 9h3M15 12h2M15 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M5 17c0-2.21 1.79-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                Login with Aadhaar
                <span className="aadhaar-badge">🔒 Secure</span>
              </button>
            </div>

            <div className="auth-divider">
              <div className="auth-divider__line" />
              <span className="auth-divider__text">or continue with email</span>
              <div className="auth-divider__line" />
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email/Phone */}
              <div className={`auth-field ${focusedField === 'identifier' ? 'auth-field--focused' : ''} ${errors.identifier ? 'auth-field--error' : ''} ${form.identifier ? 'auth-field--filled' : ''}`}>
                <label className="auth-field__label" htmlFor="login-identifier">Email or Phone Number</label>
                <div className="auth-field__input-wrap">
                  <div className="auth-field__icon"><IconEmail /></div>
                  <input
                    id="login-identifier"
                    name="identifier"
                    type="text"
                    className="auth-field__input"
                    placeholder="you@example.com or 98765 43210"
                    value={form.identifier}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                  />
                  {form.identifier && !errors.identifier && (
                    <div className="auth-field__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                    </div>
                  )}
                </div>
                {errors.identifier && (
                  <div className="auth-field__error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    {errors.identifier}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className={`auth-field ${focusedField === 'password' ? 'auth-field--focused' : ''} ${errors.password ? 'auth-field--error' : ''} ${form.password ? 'auth-field--filled' : ''}`}>
                <div className="auth-field__label-row">
                  <label className="auth-field__label" htmlFor="login-password">Password</label>
                  <a href="#" className="auth-field__forgot" id="forgot-password-link" onClick={handleForgotPassword}>
                    Forgot Password?
                  </a>
                </div>
                <div className="auth-field__input-wrap">
                  <div className="auth-field__icon"><IconLock /></div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-field__input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPassword(p => !p)} id="toggle-password-btn" aria-label="Toggle password visibility">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {errors.password && (
                  <div className="auth-field__error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    {errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`auth-submit-btn ${loading ? 'auth-submit-btn--loading' : ''}`}
                id="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <><div className="auth-spinner" />Signing In...</>
                ) : (
                  <>Sign In to NammaSeva
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-form__footer-link">
              Don't have an account?{' '}
              <Link to="/register" id="go-to-register-link">Register Free →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
