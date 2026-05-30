import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { setProfile, getUser, getProfile } from '../utils/userStore'
import './ProfileSetupPage.css'

/* ── Constants ── */
const STATES = ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala']
const LANGUAGES = ['English', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Hindi']
const CASTES = ['General', 'OBC (Other Backward Class)', 'SC (Scheduled Caste)', 'ST (Scheduled Tribe)', 'EWS (Economically Weaker Section)']
const INCOMES = [
  'Below ₹1 Lakh per year',
  '₹1 – 2.5 Lakhs per year',
  '₹2.5 – 5 Lakhs per year',
  '₹5 – 8 Lakhs per year',
  '₹8 – 12 Lakhs per year',
  'Above ₹12 Lakhs per year',
]
const OCCUPATIONS = [
  { value: 'student',    label: 'Student',             icon: '🎓' },
  { value: 'farmer',    label: 'Farmer',               icon: '🌾' },
  { value: 'business',  label: 'Business Owner',       icon: '💼' },
  { value: 'govt',      label: 'Government Employee',  icon: '🏛️' },
  { value: 'private',   label: 'Private Employee',     icon: '🏢' },
  { value: 'daily',     label: 'Daily Wage Worker',    icon: '🔨' },
  { value: 'unemployed',label: 'Unemployed',           icon: '🔍' },
  { value: 'other',     label: 'Other',                icon: '✳️' },
]
const INTERESTS = [
  { value: 'education',   label: 'Education',           icon: '🎓', color: '#4F46E5' },
  { value: 'healthcare',  label: 'Healthcare',          icon: '🏥', color: '#059669' },
  { value: 'agriculture', label: 'Agriculture',         icon: '🌾', color: '#D97706' },
  { value: 'housing',     label: 'Housing',             icon: '🏘️', color: '#DC2626' },
  { value: 'business',    label: 'Business & Startup',  icon: '💼', color: '#7C3AED' },
  { value: 'women',       label: 'Women Empowerment',   icon: '👩', color: '#DB2777' },
  { value: 'senior',      label: 'Senior Citizen',      icon: '👴', color: '#0891B2' },
  { value: 'sports',      label: 'Sports & Youth',      icon: '⚽', color: '#16A34A' },
  { value: 'arts',        label: 'Arts & Culture',      icon: '🎭', color: '#CA8A04' },
  { value: 'skill',       label: 'Skill Development',   icon: '⚡', color: '#EA580C' },
  { value: 'disability',  label: 'Disability Support',  icon: '♿', color: '#6366F1' },
  { value: 'minority',    label: 'Minority Welfare',    icon: '🤝', color: '#0D9488' },
]

const STEPS = [
  { id: 1, label: 'Basic Info',   icon: '👤' },
  { id: 2, label: 'Location',     icon: '📍' },
  { id: 3, label: 'Background',   icon: '📋' },
  { id: 4, label: 'Interests',    icon: '🎯' },
]

/* ── Sub-components ── */
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
    <path d="M5 12l5 5L20 7"/>
  </svg>
)

/* ── Field wrapper ── */
const Field = ({ label, required, hint, children, error }) => (
  <div className={`ps-field ${error ? 'ps-field--error' : ''}`}>
    <div className="ps-field__label-row">
      <label className="ps-field__label">
        {label}
        {required && <span className="ps-field__required">*</span>}
      </label>
      {hint && <span className="ps-field__hint">{hint}</span>}
    </div>
    {children}
    {error && <div className="ps-field__error">{error}</div>}
  </div>
)

/* ════════════════════════════════════════════
   PROFILE SETUP PAGE
════════════════════════════════════════════ */
const ProfileSetupPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const fileRef = useRef(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const savedUser    = getUser()
  const savedProfile = getProfile()          // existing saved profile (if editing)
  const isEditing    = !!savedProfile        // true when coming back to update

  const [form, setForm] = useState(() => {
    if (savedProfile) {
      // ── Pre-fill ALL fields from saved profile ──
      return {
        fullName:      savedProfile.fullName      || savedUser?.name || '',
        dob:           savedProfile.dob           || '',
        gender:        savedProfile.gender        || '',
        maritalStatus: savedProfile.maritalStatus || '',
        photo:         null,                         // can't restore File object
        state:         savedProfile.state         || '',
        district:      savedProfile.district      || '',
        pincode:       savedProfile.pincode        || '',
        language:      savedProfile.language      || '',
        caste:         savedProfile.caste         || '',
        familySize:    savedProfile.familySize    ?? 3,
        income:        savedProfile.income        || '',
        occupation:    savedProfile.occupation    || '',
        interests:     savedProfile.interests     || [],
      }
    }
    // ── New user: only pre-fill name from login ──
    return {
      fullName: savedUser?.name || '',
      dob: '', gender: '', maritalStatus: '', photo: null,
      state: '', district: '', pincode: '', language: '',
      caste: '', familySize: 3, income: '', occupation: '',
      interests: [],
    }
  })

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  /* ── Photo upload ── */
  const handlePhoto = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      toast.show({ type: 'error', title: 'File too large', message: 'Please choose an image under 5MB.' })
      return
    }
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    set('photo', file)
  }, [])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handlePhoto(e.dataTransfer.files[0])
  }

  /* ── Interest toggle ── */
  const toggleInterest = (val) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(val)
        ? prev.interests.filter(i => i !== val)
        : [...prev.interests, val],
    }))
    if (errors.interests) setErrors(prev => ({ ...prev, interests: '' }))
  }

  /* ── Validation ── */
  const validate = () => {
    const errs = {}
    if (step === 1) {
      if (!form.fullName.trim() || form.fullName.trim().length < 2) errs.fullName = 'Enter your full name (min 2 chars)'
      if (!form.dob) errs.dob = 'Date of birth is required'
      else {
        const age = Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000))
        if (age < 5 || age > 120) errs.dob = 'Enter a valid date of birth'
      }
      if (!form.gender) errs.gender = 'Please select your gender'
      if (!form.maritalStatus) errs.maritalStatus = 'Please select your marital status'
    }
    if (step === 2) {
      if (!form.state) errs.state = 'Please select your state'
      if (!form.district.trim()) errs.district = 'Enter your district'
      if (!form.language) errs.language = 'Please select a language'
    }
    if (step === 3) {
      if (!form.caste) errs.caste = 'Please select your category'
      if (!form.income) errs.income = 'Please select income range'
      if (!form.occupation) errs.occupation = 'Please select your occupation'
    }
    if (step === 4) {
      if (form.interests.length === 0) errs.interests = 'Select at least one interest'
    }
    return errs
  }

  const handleNext = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.show({ type: 'error', title: 'Please fill all fields', message: 'Fix the highlighted fields to continue.' })
      return
    }
    setErrors({})
    if (step < 4) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setErrors({})
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    toast.show({ type: 'info', title: 'Saving your profile…', message: 'Almost there!' })
    await new Promise(r => setTimeout(r, 1800))
    // Save real profile data to localStorage
    setProfile({
      fullName:      form.fullName.trim(),
      dob:           form.dob,
      gender:        form.gender,
      maritalStatus: form.maritalStatus,
      state:         form.state,
      district:      form.district,
      pincode:       form.pincode,
      language:      form.language,
      caste:         form.caste,
      familySize:    form.familySize,
      income:        form.income,
      occupation:    form.occupation,
      interests:     form.interests,
    })
    setSaving(false)
    toast.show({
      type: 'success',
      title: isEditing ? 'Profile Updated! ✅' : 'Profile Complete! 🎉',
      message: isEditing
        ? 'Your details have been saved. Recalculating your scheme matches…'
        : 'Finding schemes that match your profile…',
    })
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="ps-page">
      {/* ── Background ── */}
      <div className="ps-bg">
        <div className="ps-bg__orb ps-bg__orb--1" />
        <div className="ps-bg__orb ps-bg__orb--2" />
        <div className="ps-bg__grid" />
      </div>

      <div className="ps-container">

        {/* ── Header ── */}
        <div className="ps-header">
          <div className="ps-header__logo" onClick={() => navigate('/')}>
            <div className="ps-logo-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#psGrad)" />
                <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
                <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
                <defs>
                  <linearGradient id="psGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#FF6B00"/>
                    <stop offset="100%" stopColor="#FF8C38"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="ps-logo-text">NammaSeva</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isEditing && (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: 8, background: 'white', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: '#64748b',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Dashboard
              </button>
            )}
            <div className="ps-header__tag">{isEditing ? '✏️ Edit Profile' : 'Profile Setup'}</div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="ps-progress-wrap">
          <div className="ps-progress-bar">
            <div className="ps-progress-bar__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="ps-steps">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={[
                  'ps-step',
                  step === s.id ? 'ps-step--active' : '',
                  step > s.id ? 'ps-step--done' : '',
                ].join(' ')}
              >
                <div className="ps-step__bubble">
                  {step > s.id ? <CheckIcon /> : <span>{s.icon}</span>}
                </div>
                <span className="ps-step__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div className="ps-card" key={step}>

          {/* ──────────────── STEP 1: Basic Info ──────────────── */}
          {step === 1 && (
            <div className="ps-step-content">
              <div className="ps-step-header">
                <div className="ps-step-icon">👤</div>
                <div>
                  <h2 className="ps-step-title">Basic Information</h2>
                  <p className="ps-step-subtitle">Tell us a bit about yourself</p>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="ps-photo-section">
                <div
                  className={`ps-photo-drop ${dragOver ? 'ps-photo-drop--dragover' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="ps-photo-preview" />
                  ) : (
                    <div className="ps-photo-placeholder">
                      <div className="ps-photo-icon">📷</div>
                      <div className="ps-photo-text">
                        <strong>Upload Photo</strong>
                        <span>Drag & drop or click • JPG, PNG up to 5MB</span>
                      </div>
                    </div>
                  )}
                  {photoPreview && (
                    <div className="ps-photo-overlay">
                      <span>Change Photo</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => handlePhoto(e.target.files[0])}
                />
                <p className="ps-photo-skip">Optional — you can add this later</p>
              </div>

              {/* Fields */}
              <div className="ps-fields">
                <Field label="Full Name" required error={errors.fullName}>
                  <div className="ps-input-wrap">
                    <span className="ps-input-icon">👤</span>
                    <input
                      className="ps-input"
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={form.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </Field>

                <div className="ps-grid-2">
                  <Field label="Date of Birth" required error={errors.dob}>
                    <div className="ps-input-wrap">
                      <span className="ps-input-icon">🎂</span>
                      <input
                        className="ps-input"
                        type="date"
                        value={form.dob}
                        onChange={e => set('dob', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </Field>

                  <Field label="Gender" required error={errors.gender}>
                    <div className="ps-gender-group">
                      {[
                        { value: 'male',   label: 'Male',   icon: '👨' },
                        { value: 'female', label: 'Female', icon: '👩' },
                        { value: 'other',  label: 'Other',  icon: '🧑' },
                      ].map(g => (
                        <button
                          key={g.value}
                          type="button"
                          className={`ps-gender-btn ${form.gender === g.value ? 'ps-gender-btn--active' : ''}`}
                          onClick={() => set('gender', g.value)}
                        >
                          <span>{g.icon}</span>
                          <span>{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                {/* Marital Status */}
                <Field label="Marital Status" required error={errors.maritalStatus}>
                  <div className="ps-marital-group">
                    {[
                      { value: 'single',   label: 'Single',   icon: '🧑' },
                      { value: 'married',  label: 'Married',  icon: '💑' },
                      { value: 'widowed',  label: 'Widowed',  icon: '🕊️' },
                      { value: 'divorced', label: 'Divorced', icon: '📋' },
                    ].map(m => (
                      <button
                        key={m.value}
                        type="button"
                        className={`ps-marital-btn ${form.maritalStatus === m.value ? 'ps-marital-btn--active' : ''}`}
                        onClick={() => set('maritalStatus', m.value)}
                      >
                        <span className="ps-marital-icon">{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: Location ──────────────── */}
          {step === 2 && (
            <div className="ps-step-content">
              <div className="ps-step-header">
                <div className="ps-step-icon">📍</div>
                <div>
                  <h2 className="ps-step-title">Your Location</h2>
                  <p className="ps-step-subtitle">Helps us find schemes in your area</p>
                </div>
              </div>

              <div className="ps-fields">
                <Field label="State" required error={errors.state}>
                  <div className="ps-input-wrap ps-input-wrap--select">
                    <span className="ps-input-icon">🗺️</span>
                    <select
                      className="ps-input ps-select"
                      value={form.state}
                      onChange={e => set('state', e.target.value)}
                    >
                      <option value="">Select your state</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="ps-select-arrow"><ChevronDown /></span>
                  </div>
                </Field>

                <div className="ps-grid-2">
                  <Field label="District" required error={errors.district}>
                    <div className="ps-input-wrap">
                      <span className="ps-input-icon">📌</span>
                      <input
                        className="ps-input"
                        type="text"
                        placeholder="e.g. Bengaluru Urban"
                        value={form.district}
                        onChange={e => set('district', e.target.value)}
                      />
                    </div>
                  </Field>

                  <Field label="Pincode" hint="Optional">
                    <div className="ps-input-wrap">
                      <span className="ps-input-icon">🔢</span>
                      <input
                        className="ps-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="e.g. 560001"
                        value={form.pincode}
                        onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Preferred Language" required error={errors.language} hint="For scheme notifications">
                  <div className="ps-lang-group">
                    {LANGUAGES.map(l => (
                      <button
                        key={l}
                        type="button"
                        className={`ps-lang-btn ${form.language === l ? 'ps-lang-btn--active' : ''}`}
                        onClick={() => set('language', l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: Background ──────────────── */}
          {step === 3 && (
            <div className="ps-step-content">
              <div className="ps-step-header">
                <div className="ps-step-icon">📋</div>
                <div>
                  <h2 className="ps-step-title">Your Background</h2>
                  <p className="ps-step-subtitle">Used only to match eligible government schemes</p>
                </div>
              </div>

              <div className="ps-privacy-note">
                🔒 Your data is encrypted and never shared with third parties
              </div>

              <div className="ps-fields">
                <Field label="Caste Category" required error={errors.caste}>
                  <div className="ps-input-wrap ps-input-wrap--select">
                    <span className="ps-input-icon">🏷️</span>
                    <select
                      className="ps-input ps-select"
                      value={form.caste}
                      onChange={e => set('caste', e.target.value)}
                    >
                      <option value="">Select category</option>
                      {CASTES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="ps-select-arrow"><ChevronDown /></span>
                  </div>
                </Field>

                {/* Family Size */}
                <Field label="Family Size" required error={errors.familySize} hint="Including yourself">
                  <div className="ps-stepper">
                    <button
                      type="button"
                      className="ps-stepper__btn"
                      onClick={() => set('familySize', Math.max(1, form.familySize - 1))}
                      disabled={form.familySize <= 1}
                      aria-label="Decrease"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                    </button>
                    <div className="ps-stepper__display">
                      <span className="ps-stepper__number">{form.familySize}</span>
                      <span className="ps-stepper__label">
                        {form.familySize === 1 ? 'Only you' : `${form.familySize} members`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ps-stepper__btn"
                      onClick={() => set('familySize', Math.min(20, form.familySize + 1))}
                      disabled={form.familySize >= 20}
                      aria-label="Increase"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                    <div className="ps-stepper__dots">
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <button
                          key={n}
                          type="button"
                          className={`ps-stepper__dot ${form.familySize === n ? 'ps-stepper__dot--active' : form.familySize > n ? 'ps-stepper__dot--past' : ''}`}
                          onClick={() => set('familySize', n)}
                          aria-label={`${n} members`}
                        />
                      ))}
                      {form.familySize > 8 && (
                        <span className="ps-stepper__more">+{form.familySize - 8}</span>
                      )}
                    </div>
                  </div>
                </Field>

                <Field label="Annual Family Income" required error={errors.income}>
                  <div className="ps-income-group">
                    {INCOMES.map(inc => (
                      <button
                        key={inc}
                        type="button"
                        className={`ps-income-btn ${form.income === inc ? 'ps-income-btn--active' : ''}`}
                        onClick={() => set('income', inc)}
                      >
                        {form.income === inc && <span className="ps-income-check"><CheckIcon /></span>}
                        {inc}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Occupation" required error={errors.occupation}>
                  <div className="ps-occupation-grid">
                    {OCCUPATIONS.map(occ => (
                      <button
                        key={occ.value}
                        type="button"
                        className={`ps-occ-btn ${form.occupation === occ.value ? 'ps-occ-btn--active' : ''}`}
                        onClick={() => set('occupation', occ.value)}
                      >
                        <span className="ps-occ-icon">{occ.icon}</span>
                        <span className="ps-occ-label">{occ.label}</span>
                        {form.occupation === occ.value && (
                          <span className="ps-occ-check"><CheckIcon /></span>
                        )}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: Interests ──────────────── */}
          {step === 4 && (
            <div className="ps-step-content">
              <div className="ps-step-header">
                <div className="ps-step-icon">🎯</div>
                <div>
                  <h2 className="ps-step-title">Your Interests</h2>
                  <p className="ps-step-subtitle">Select all the areas you'd like scheme recommendations for</p>
                </div>
              </div>

              {errors.interests && (
                <div className="ps-error-banner">{errors.interests}</div>
              )}

              <div className="ps-interest-count">
                {form.interests.length === 0
                  ? 'Select at least 1 category'
                  : `${form.interests.length} category${form.interests.length > 1 ? 'ies' : 'y'} selected`
                }
              </div>

              <div className="ps-interests-grid">
                {INTERESTS.map(item => {
                  const selected = form.interests.includes(item.value)
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`ps-interest-card ${selected ? 'ps-interest-card--selected' : ''}`}
                      onClick={() => toggleInterest(item.value)}
                      style={selected ? {
                        borderColor: item.color,
                        background: `${item.color}12`,
                      } : {}}
                    >
                      <div
                        className="ps-interest-icon"
                        style={{ background: selected ? `${item.color}20` : '#f1f5f9', color: item.color }}
                      >
                        {item.icon}
                      </div>
                      <span className="ps-interest-label">{item.label}</span>
                      {selected && (
                        <div className="ps-interest-check" style={{ background: item.color }}>
                          <CheckIcon />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Summary Preview */}
              {form.interests.length > 0 && (
                <div className="ps-summary">
                  <div className="ps-summary__title">Profile Summary</div>
                  <div className="ps-summary__rows">
                    {form.fullName && <div className="ps-summary__row"><span>Name</span><strong>{form.fullName}</strong></div>}
                    {form.state && <div className="ps-summary__row"><span>Location</span><strong>{form.district ? `${form.district}, ` : ''}{form.state}</strong></div>}
                    {form.occupation && <div className="ps-summary__row"><span>Occupation</span><strong>{OCCUPATIONS.find(o => o.value === form.occupation)?.label}</strong></div>}
                    {form.maritalStatus && <div className="ps-summary__row"><span>Marital</span><strong style={{ textTransform: 'capitalize' }}>{form.maritalStatus}</strong></div>}
                    {form.familySize && <div className="ps-summary__row"><span>Family</span><strong>{form.familySize} {form.familySize === 1 ? 'member' : 'members'}</strong></div>}
                    {form.income && <div className="ps-summary__row"><span>Income</span><strong>{form.income}</strong></div>}
                    <div className="ps-summary__row">
                      <span>Interests</span>
                      <div className="ps-summary__tags">
                        {form.interests.map(i => {
                          const item = INTERESTS.find(x => x.value === i)
                          return (
                            <span key={i} className="ps-summary__tag" style={{ background: `${item?.color}18`, color: item?.color }}>
                              {item?.icon} {item?.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div className="ps-nav">
            {step > 1 ? (
              <button className="ps-btn ps-btn--ghost" onClick={handleBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back
              </button>
            ) : (
              <button className="ps-btn ps-btn--ghost" onClick={() => navigate(-1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button className="ps-btn ps-btn--primary" onClick={handleNext}>
                Continue
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button
                className={`ps-btn ps-btn--primary ps-btn--finish ${saving ? 'ps-btn--loading' : ''}`}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <><div className="ps-spinner" /> Saving Profile…</>
                ) : (
                  <>
                    Find My Schemes 🎯
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* ── Step Hint ── */}
        <div className="ps-hint">
          Step {step} of {STEPS.length} — {step < 4 ? 'Almost there!' : 'Last step!'}
        </div>

      </div>
    </div>
  )
}

export default ProfileSetupPage
