import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './AuthPages.css'

const states = [
  { value: '', label: 'Select your state' },
  { value: 'karnataka', label: '🏛️ Karnataka' },
  { value: 'tamil-nadu', label: '🌺 Tamil Nadu' },
  { value: 'andhra-pradesh', label: '🎭 Andhra Pradesh' },
  { value: 'telangana', label: '🏙️ Telangana' },
  { value: 'kerala', label: '🌴 Kerala' },
]

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', state: '', agreedToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calcStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981']

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) errs.fullName = 'Full name must be at least 2 characters'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit Indian mobile number'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.state) errs.state = 'Please select your state'
    if (!form.agreedToTerms) errs.agreedToTerms = 'You must agree to the Terms & Privacy Policy'
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(prev => ({ ...prev, [name]: val }))
    if (name === 'password') setPasswordStrength(calcStrength(value))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    alert('Registration successful! (Backend integration coming soon)')
  }

  const Field = ({ name, label, type = 'text', placeholder, icon, showToggle, showState, extraLabel }) => (
    <div className={`auth-field ${focusedField === name ? 'auth-field--focused' : ''} ${errors[name] ? 'auth-field--error' : ''} ${form[name] ? 'auth-field--filled' : ''}`}>
      <div className="auth-field__label-row">
        <label className="auth-field__label" htmlFor={`reg-${name}`}>{label}</label>
        {extraLabel}
      </div>
      <div className="auth-field__input-wrap">
        {icon && <div className="auth-field__icon">{icon}</div>}
        {showState ? (
          <select
            id={`reg-${name}`}
            name={name}
            className="auth-field__input auth-field__select"
            value={form[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
          >
            {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        ) : (
          <input
            id={`reg-${name}`}
            name={name}
            type={showToggle === 'password' ? (showPassword ? 'text' : 'password') : showToggle === 'confirm' ? (showConfirm ? 'text' : 'password') : type}
            className="auth-field__input"
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            autoComplete={name === 'password' ? 'new-password' : name === 'confirmPassword' ? 'new-password' : name}
          />
        )}
        {showToggle === 'password' && (
          <button type="button" className="auth-field__toggle" onClick={() => setShowPassword(!showPassword)} id="toggle-new-password-btn" aria-label="Toggle password visibility">
            <EyeIcon open={showPassword} />
          </button>
        )}
        {showToggle === 'confirm' && (
          <button type="button" className="auth-field__toggle" onClick={() => setShowConfirm(!showConfirm)} id="toggle-confirm-password-btn" aria-label="Toggle confirm password visibility">
            <EyeIcon open={showConfirm} />
          </button>
        )}
        {form[name] && !errors[name] && !showToggle && !showState && (
          <div className="auth-field__check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          </div>
        )}
      </div>
      {errors[name] && (
        <div className="auth-field__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          {errors[name]}
        </div>
      )}
    </div>
  )

  return (
    <div className="auth-page auth-page--register">
      <Navbar />

      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__grid" />
      </div>

      <div className="auth-container auth-container--register">

        {/* Form Panel */}
        <div className="auth-panel auth-panel--form auth-panel--form-wide">
          <div className="auth-form-wrap">
            {/* Header */}
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
                    <circle cx="20" cy="20" r="20" fill="url(#rgGrad)" />
                    <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
                    <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
                    <defs>
                      <linearGradient id="rgGrad" x1="0" y1="0" x2="40" y2="40">
                        <stop offset="0%" stopColor="#FF6B00"/>
                        <stop offset="100%" stopColor="#FF8C38"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <h1 className="auth-form__title">Create Account</h1>
              <p className="auth-form__subtitle">Join thousands of citizens finding their government benefits</p>
            </div>

            {/* Social Buttons */}
            <div className="auth-social-btns">
              <button className="auth-social-btn" id="google-register-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button className="auth-social-btn auth-social-btn--aadhaar" id="aadhaar-register-btn" type="button">
                <div className="aadhaar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" opacity="0.15"/>
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="11" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M15 9h3M15 12h2M15 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M5 17c0-2.21 1.79-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                Register with Aadhaar
                <span className="aadhaar-badge">🔒 Secure</span>
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider__line" />
              <span className="auth-divider__text">or register with email</span>
              <div className="auth-divider__line" />
            </div>

            {/* Form */}
            <form className="auth-form auth-form--register" onSubmit={handleSubmit} noValidate>
              {/* Two-column layout */}
              <div className="auth-form__grid">
                {/* Full Name */}
                <Field name="fullName" label="Full Name" placeholder="Rajesh Kumar" icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                }/>

                {/* Phone */}
                <Field name="phone" label="Phone Number" type="tel" placeholder="98765 43210" icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                }/>
              </div>

              {/* Email */}
              <Field name="email" label="Email Address" type="email" placeholder="you@example.com" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              }/>

              {/* State */}
              <Field name="state" label="State" showState icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              }/>

              <div className="auth-form__grid">
                {/* Password */}
                <div>
                  <Field name="password" label="Password" placeholder="Create a strong password" showToggle="password" icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  }/>
                  {/* Password Strength */}
                  {form.password && (
                    <div className="auth-strength">
                      <div className="auth-strength__bars">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="auth-strength__bar"
                            style={{ background: i <= passwordStrength ? strengthColor[passwordStrength] : '#E5E7EB' }}
                          />
                        ))}
                      </div>
                      <span className="auth-strength__label" style={{ color: strengthColor[passwordStrength] }}>
                        {strengthLabel[passwordStrength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <Field name="confirmPassword" label="Confirm Password" placeholder="Repeat your password" showToggle="confirm" icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                }/>
              </div>

              {/* Terms Checkbox */}
              <div className={`auth-checkbox ${errors.agreedToTerms ? 'auth-checkbox--error' : ''}`}>
                <label className="auth-checkbox__label" htmlFor="reg-terms">
                  <input
                    type="checkbox"
                    id="reg-terms"
                    name="agreedToTerms"
                    checked={form.agreedToTerms}
                    onChange={handleChange}
                    className="auth-checkbox__input"
                  />
                  <span className="auth-checkbox__custom">
                    {form.agreedToTerms && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    )}
                  </span>
                  <span className="auth-checkbox__text">
                    I agree to the{' '}
                    <a href="/terms" className="auth-checkbox__link">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="auth-checkbox__link">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <div className="auth-field__error" style={{ marginTop: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                    {errors.agreedToTerms}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`auth-submit-btn ${loading ? 'auth-submit-btn--loading' : ''}`}
                id="register-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <><div className="auth-spinner" />Creating Your Account...</>
                ) : (
                  <>
                    Create Free Account
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-form__footer-link">
              Already have an account?{' '}
              <Link to="/login" id="go-to-login-link">Sign In →</Link>
            </p>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="auth-panel auth-panel--brand auth-panel--brand-right">
          <div className="auth-brand">
            <div className="auth-brand__badge">✨ 100% Free · No Credit Card</div>
            <h2 className="auth-brand__title">
              What You'll Get with <span>NammaSeva</span>
            </h2>

            <div className="auth-benefits">
              {[
                { icon: '🎯', title: 'Personalized Matches', desc: 'Get schemes ranked by how well they fit your profile — not a generic list.' },
                { icon: '⚡', title: 'Instant Results', desc: 'See your matched schemes in under 3 minutes after answering a short quiz.' },
                { icon: '📋', title: 'Application Guides', desc: 'Step-by-step instructions and document checklists for every scheme.' },
                { icon: '🔔', title: 'New Scheme Alerts', desc: 'Get notified when new schemes that match your profile are launched.' },
                { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and never shared without your consent.' },
                { icon: '🌐', title: 'Multi-language', desc: 'Available in Kannada, Telugu, Tamil, Malayalam, and Hindi.' },
              ].map((b, i) => (
                <div key={i} className="auth-benefit-item">
                  <div className="auth-benefit-icon">{b.icon}</div>
                  <div>
                    <div className="auth-benefit-title">{b.title}</div>
                    <div className="auth-benefit-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-trust-bar">
              <div className="auth-trust-bar__item">
                <strong>1,200+</strong><span>Citizens</span>
              </div>
              <div className="auth-trust-bar__divider" />
              <div className="auth-trust-bar__item">
                <strong>500+</strong><span>Schemes</span>
              </div>
              <div className="auth-trust-bar__divider" />
              <div className="auth-trust-bar__item">
                <strong>4.9★</strong><span>Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default RegisterPage
