import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getProfile, getProfileCompletion, calculateMatch, getOverallMatchScore, clearUser } from '../utils/userStore'
import './DashboardPage.css'

/* ═══════════════════════════════════════════
   SCHEME DATA (with real criteria keys)
═══════════════════════════════════════════ */
const SCHEMES = [
  {
    id: 1, name: 'PM-KISAN Samman Nidhi', gov: 'Central', govLogo: '🇮🇳',
    category: 'Agriculture', categoryColor: '#D97706',
    benefit: '₹6,000/year', benefitType: 'Direct Cash',
    description: 'Income support of ₹6000 per year to all land holding farmer families across India.',
    deadline: '2025-06-30', deadlineDays: 32, tags: ['Farmers', 'Direct Benefit'], saved: false, featured: false,
  },
  {
    id: 2, name: 'Karnataka Raita Siri', gov: 'State', govLogo: '🏛️',
    category: 'Agriculture', categoryColor: '#D97706',
    benefit: '₹10,000/year', benefitType: 'Direct Cash',
    description: 'Financial assistance to farmers in Karnataka for agricultural inputs and equipment.',
    deadline: '2025-07-15', deadlineDays: 47, tags: ['Karnataka', 'Farmers'], saved: false, featured: false,
  },
  {
    id: 3, name: 'National Scholarship Portal', gov: 'Central', govLogo: '🇮🇳',
    category: 'Education', categoryColor: '#4F46E5',
    benefit: '₹15,000/year', benefitType: 'Scholarship',
    description: 'Merit-cum-means scholarships for OBC/SC/ST students pursuing higher education.',
    deadline: '2025-08-31', deadlineDays: 94, tags: ['OBC', 'Students'], saved: false, featured: false,
  },
  {
    id: 4, name: 'Ayushman Bharat PMJAY', gov: 'Central', govLogo: '🇮🇳',
    category: 'Healthcare', categoryColor: '#059669',
    benefit: '₹5 Lakh/year', benefitType: 'Health Cover',
    description: 'World\'s largest health insurance scheme providing ₹5 lakh cover per family per year.',
    deadline: null, deadlineDays: null, tags: ['Health Insurance', 'Cashless'], saved: false, featured: false,
  },
  {
    id: 5, name: 'Karnataka Gruha Lakshmi', gov: 'State', govLogo: '🏛️',
    category: 'Women Empowerment', categoryColor: '#DB2777',
    benefit: '₹2,000/month', benefitType: 'Monthly Cash',
    description: 'Monthly financial assistance of ₹2000 to the head woman of every household in Karnataka.',
    deadline: null, deadlineDays: null, tags: ['Women', 'Karnataka'], saved: false, featured: false,
  },
  {
    id: 6, name: 'MUDRA Loan – Shishu', gov: 'Central', govLogo: '🇮🇳',
    category: 'Business', categoryColor: '#7C3AED',
    benefit: 'Up to ₹50,000', benefitType: 'Collateral-free Loan',
    description: 'Micro loans for small businesses and entrepreneurs to start or expand their venture.',
    deadline: null, deadlineDays: null, tags: ['Entrepreneurs', 'Self-Employed'], saved: false, featured: false,
  },
  {
    id: 7, name: 'PM Awas Yojana (Rural)', gov: 'Central', govLogo: '🇮🇳',
    category: 'Housing', categoryColor: '#DC2626',
    benefit: '₹1.2–1.3 Lakh', benefitType: 'Housing Grant',
    description: 'Housing assistance to build a pucca house with basic amenities for rural households.',
    deadline: '2025-06-15', deadlineDays: 17, tags: ['Rural Housing', 'BPL'], saved: false, featured: false,
  },
  {
    id: 8, name: 'Karnataka Anna Bhagya', gov: 'State', govLogo: '🏛️',
    category: 'Food Security', categoryColor: '#EA580C',
    benefit: '10 kg rice/month', benefitType: 'Food Subsidy',
    description: 'Free rice scheme for BPL families in Karnataka — 10 kg rice per member per month.',
    deadline: null, deadlineDays: null, tags: ['Karnataka', 'BPL', 'Food'], saved: false, featured: false,
  },
]

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Education', 'Housing', 'Business', 'Women Empowerment', 'Food Security']
const GOVTYPES = ['All', 'Central', 'State']

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard', active: true },
  { icon: '🔍', label: 'Browse Schemes', path: '/schemes', active: false },
  { icon: '📑', label: 'My Applications', path: '/applications', active: false },
  { icon: '🔖', label: 'Saved Schemes', path: '/saved', active: false },
  { icon: '👤', label: 'My Profile', path: '/profile-setup', active: false },
  { icon: '🔔', label: 'Notifications', path: '/notifications', active: false },
]

/* ═══════════════════════════════════════════
   MATCH RING SVG
═══════════════════════════════════════════ */
const MatchRing = ({ score, size = 88 }) => {
  const r = (size / 2) - 9
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#FF6B00' : '#f59e0b'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7"/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" fontSize="16" fontWeight="800" fill={color} fontFamily="Poppins,sans-serif">{score}%</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="Poppins,sans-serif">MATCH</text>
    </svg>
  )
}

/* ═══════════════════════════════════════════
   SCHEME CARD
═══════════════════════════════════════════ */
const SchemeCard = ({ scheme, matchScore, onSave, hasProfile }) => {
  const urgency = scheme.deadlineDays
    ? scheme.deadlineDays <= 20 ? 'urgent' : scheme.deadlineDays <= 50 ? 'soon' : ''
    : ''
  const matchColor = matchScore >= 75 ? '#22c55e' : matchScore >= 50 ? '#FF6B00' : '#94a3b8'

  return (
    <div className={`db-scheme-card ${matchScore >= 80 ? 'db-scheme-card--top' : ''}`}>
      {matchScore >= 80 && <div className="db-scheme-card__featured-badge">⭐ Top Match</div>}
      {urgency === 'urgent' && <div className="db-scheme-card__deadline db-scheme-card__deadline--urgent">🔴 {scheme.deadlineDays}d left</div>}
      {urgency === 'soon' && !urgency !== 'urgent' && <div className="db-scheme-card__deadline db-scheme-card__deadline--soon">🟡 {scheme.deadlineDays}d left</div>}

      <div className="db-scheme-card__top">
        <div className="db-scheme-card__gov">
          <span className="db-scheme-card__gov-logo">{scheme.govLogo}</span>
          <span className="db-scheme-card__gov-type">{scheme.gov} Govt.</span>
        </div>
        {hasProfile && matchScore !== null ? (
          <div className="db-scheme-card__match" style={{ color: matchColor }}>
            <span className="db-scheme-card__match-num">{matchScore}%</span>
            <span className="db-scheme-card__match-label">match</span>
          </div>
        ) : (
          <div className="db-scheme-card__match-na">
            <span>—</span>
          </div>
        )}
      </div>

      <div className="db-scheme-card__body">
        <span className="db-scheme-card__cat" style={{ background: `${scheme.categoryColor}18`, color: scheme.categoryColor }}>
          {scheme.category}
        </span>
        <h3 className="db-scheme-card__name">{scheme.name}</h3>
        <p className="db-scheme-card__desc">{scheme.description}</p>
      </div>

      <div className="db-scheme-card__benefit">
        <div className="db-scheme-card__benefit-amount">{scheme.benefit}</div>
        <div className="db-scheme-card__benefit-type">{scheme.benefitType}</div>
      </div>

      {hasProfile && matchScore !== null && (
        <div className="db-scheme-card__match-bar">
          <div className="db-scheme-card__match-bar-fill" style={{ width: `${matchScore}%`, background: matchColor }} />
        </div>
      )}

      <div className="db-scheme-card__tags">
        {scheme.tags.slice(0, 2).map(t => (
          <span key={t} className="db-scheme-card__tag">{t}</span>
        ))}
      </div>

      <div className="db-scheme-card__actions">
        <button className="db-scheme-card__view">
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button
          className={`db-scheme-card__save ${scheme.saved ? 'db-scheme-card__save--saved' : ''}`}
          onClick={() => onSave(scheme.id)}
          title={scheme.saved ? 'Unsave' : 'Save'}
        >
          {scheme.saved ? '🔖' : '🏷️'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
const DashboardPage = () => {
  const navigate = useNavigate()
  const notifRef = useRef(null)

  // Read REAL data from localStorage
  const user    = getUser()
  const profile = getProfile()
  const completion = getProfileCompletion()
  const overallMatch = profile ? getOverallMatchScore(profile) : null

  // If not logged in at all, redirect to login
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const [schemes, setSchemes] = useState(SCHEMES)
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeGov, setActiveGov] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSave = (id) => setSchemes(prev => prev.map(s => s.id === id ? { ...s, saved: !s.saved } : s))

  const handleSignOut = () => {
    clearUser()
    navigate('/')
  }

  // Compute match scores for all schemes
  const schemesWithMatch = schemes.map(s => ({
    ...s,
    matchScore: calculateMatch(s.id, profile),
  }))

  // Filter
  const filtered = schemesWithMatch.filter(s => {
    const catOk = activeFilter === 'All' || s.category === activeFilter
    const govOk = activeGov === 'All' || s.gov === activeGov
    const searchOk = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
    return catOk && govOk && searchOk
  })

  // Sort: highest match first (if profile available), otherwise by id
  const sorted = [...filtered].sort((a, b) => {
    if (profile && a.matchScore !== null && b.matchScore !== null) return b.matchScore - a.matchScore
    return a.id - b.id
  })

  const savedCount = schemes.filter(s => s.saved).length
  const deadlines = schemesWithMatch.filter(s => s.deadlineDays && s.deadlineDays < 50).sort((a, b) => a.deadlineDays - b.deadlineDays)

  // Display name: prefer profile full name, else user name from login
  const displayName = profile?.fullName || user?.name || 'User'
  const firstName = displayName.split(' ')[0]
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (!user) return null

  return (
    <div className="db-page">
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ════ HEADER ════ */}
      <header className="db-header">
        <div className="db-header__left">
          <button className="db-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className="db-header__brand" onClick={() => navigate('/')}>
            <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
              <circle cx="20" cy="20" r="20" fill="url(#hGrad)"/>
              <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
              <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
              <defs><linearGradient id="hGrad" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#FF6B00"/><stop offset="100%" stopColor="#FF8C38"/></linearGradient></defs>
            </svg>
            <span className="db-header__brand-name">NammaSeva</span>
          </div>
        </div>

        <div className="db-header__center">
          <div className="db-search">
            <svg className="db-search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="db-search__input" type="text" placeholder="Search schemes, categories…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <button className="db-search__clear" onClick={() => setSearchQuery('')}>✕</button>}
          </div>
        </div>

        <div className="db-header__right">
          <div className="db-notif-wrap" ref={notifRef}>
            <button className={`db-notif-btn ${notifOpen ? 'db-notif-btn--active' : ''}`} onClick={() => setNotifOpen(o => !o)}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {!profile && <span className="db-notif-badge">1</span>}
            </button>
            {notifOpen && (
              <div className="db-notif-panel">
                <div className="db-notif-panel__header"><span>Notifications</span></div>
                {!profile ? (
                  <div className="db-notif-item db-notif-item--unread" onClick={() => { navigate('/profile-setup'); setNotifOpen(false) }}>
                    <div className="db-notif-item__icon">👤</div>
                    <div className="db-notif-item__body">
                      <div className="db-notif-item__text">Complete your profile to see personalized scheme matches</div>
                      <div className="db-notif-item__time">Tap to set up profile →</div>
                    </div>
                  </div>
                ) : (
                  <div className="db-notif-item">
                    <div className="db-notif-item__icon">✅</div>
                    <div className="db-notif-item__body">
                      <div className="db-notif-item__text">Your profile is set up. Schemes are matched!</div>
                      <div className="db-notif-item__time">Just now</div>
                    </div>
                  </div>
                )}
                <button className="db-notif-panel__all">View all</button>
              </div>
            )}
          </div>
          <div className="db-avatar" onClick={() => navigate('/profile-setup')}>
            {user.picture ? <img src={user.picture} alt={displayName} /> : <span>{initials}</span>}
          </div>
        </div>
      </header>

      <div className="db-layout">

        {/* ════ SIDEBAR ════ */}
        <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar--open' : ''}`}>
          <div className="db-sidebar__inner">

            <div className="db-profile-card">
              <div className="db-profile-card__avatar">
                {user.picture ? <img src={user.picture} alt={displayName} /> : <span>{initials}</span>}
                {profile && (
                  <div className="db-profile-card__badge">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
              </div>
              <div className="db-profile-card__name">{displayName}</div>
              {profile ? (
                <>
                  <div className="db-profile-card__loc">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {profile.district ? `${profile.district}, ` : ''}{profile.state || 'India'}
                  </div>
                  <div className="db-profile-card__tags">
                    {profile.occupation && <span style={{ textTransform: 'capitalize' }}>{profile.occupation}</span>}
                    {profile.caste && <span>{profile.caste.split('(')[0].trim()}</span>}
                  </div>
                </>
              ) : (
                <div className="db-profile-card__loc" style={{ opacity: 0.7 }}>Profile not set up yet</div>
              )}

              <div className="db-profile-completion">
                <div className="db-profile-completion__row">
                  <span>Profile Complete</span>
                  <span>{completion}%</span>
                </div>
                <div className="db-profile-completion__bar">
                  <div className="db-profile-completion__fill" style={{ width: `${completion}%` }} />
                </div>
                {completion < 100 && (
                  <button className="db-profile-completion__cta" onClick={() => { navigate('/profile-setup'); setSidebarOpen(false) }}>
                    {completion === 0 ? 'Set Up Profile →' : 'Complete Profile →'}
                  </button>
                )}
              </div>
            </div>

            <div className="db-stats">
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#0B2D6B' }}>{profile ? sorted.filter(s => s.matchScore >= 50).length : '—'}</div>
                <div className="db-stat__label">Eligible</div>
              </div>
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#FF6B00' }}>{savedCount}</div>
                <div className="db-stat__label">Saved</div>
              </div>
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#22c55e' }}>0</div>
                <div className="db-stat__label">Applied</div>
              </div>
            </div>

            <nav className="db-nav">
              {NAV_ITEMS.map(item => (
                <button key={item.label} className={`db-nav-item ${item.active ? 'db-nav-item--active' : ''}`}
                  onClick={() => { navigate(item.path); setSidebarOpen(false) }}>
                  <span className="db-nav-item__icon">{item.icon}</span>
                  <span className="db-nav-item__label">{item.label}</span>
                  {item.active && <span className="db-nav-item__dot" />}
                </button>
              ))}
            </nav>

            <button className="db-logout" onClick={handleSignOut}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <main className="db-main">

          {/* Welcome Banner */}
          <div className="db-welcome">
            <div className="db-welcome__left">
              <h1 className="db-welcome__title">Namaste, <span>{firstName}</span>! 👋</h1>
              {profile ? (
                <p className="db-welcome__sub">
                  We found <strong>{sorted.filter(s => s.matchScore >= 50).length} schemes</strong> you may be eligible for
                  {profile.state ? <> in <strong>{profile.state}</strong></> : ''}.
                </p>
              ) : (
                <p className="db-welcome__sub">
                  Complete your profile below to see <strong>personalised scheme matches</strong> based on your actual details.
                </p>
              )}
              <div className="db-welcome__completion">
                <div className="db-welcome__completion-text">
                  {completion === 0
                    ? 'Profile not set up — set it up to unlock scheme matches'
                    : completion < 100
                    ? `Profile ${completion}% complete — add more details for better accuracy`
                    : 'Profile complete ✅ — matches are based on your details'}
                </div>
                <div className="db-welcome__bar">
                  <div className="db-welcome__bar-fill" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>

            <div className="db-welcome__right">
              {overallMatch !== null ? (
                <div className="db-match-score-card">
                  <MatchRing score={overallMatch} size={92} />
                  <div className="db-match-score-card__info">
                    <div className="db-match-score-card__label">Your Eligibility</div>
                    <div className="db-match-score-card__title">Match Score</div>
                    <div className="db-match-score-card__sub">Based on your profile</div>
                  </div>
                </div>
              ) : (
                <div className="db-match-score-card db-match-score-card--empty" onClick={() => navigate('/profile-setup')}>
                  <div className="db-match-score-card__empty-icon">👤</div>
                  <div className="db-match-score-card__info">
                    <div className="db-match-score-card__title">Set Up Profile</div>
                    <div className="db-match-score-card__sub">To see your match score</div>
                    <div className="db-match-score-card__cta">Tap to start →</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* No profile banner */}
          {!profile && (
            <div className="db-setup-banner" onClick={() => navigate('/profile-setup')}>
              <div className="db-setup-banner__icon">📋</div>
              <div className="db-setup-banner__text">
                <strong>Your profile is not set up yet.</strong>{' '}
                Tell us about yourself — your location, income, occupation — and we'll show only the schemes you actually qualify for.
              </div>
              <button className="db-setup-banner__btn">Complete Profile →</button>
            </div>
          )}

          {/* Deadline Alert */}
          {deadlines.length > 0 && profile && (
            <div className="db-deadline-banner">
              <div className="db-deadline-banner__icon">⚠️</div>
              <div className="db-deadline-banner__text">
                <strong>Deadline Alert:</strong> {deadlines[0].name} closes in <strong>{deadlines[0].deadlineDays} days</strong>. Don't miss out!
              </div>
              <button className="db-deadline-banner__btn">Apply Now →</button>
            </div>
          )}

          {/* Filters */}
          <div className="db-filters">
            <div className="db-filters__row">
              <div className="db-filter-group">
                <span className="db-filter-group__label">Type:</span>
                <div className="db-filter-pills">
                  {GOVTYPES.map(g => (
                    <button key={g} className={`db-filter-pill ${activeGov === g ? 'db-filter-pill--active' : ''}`} onClick={() => setActiveGov(g)}>
                      {g === 'Central' ? '🇮🇳 ' : g === 'State' ? '🏛️ ' : ''}{g}
                    </button>
                  ))}
                </div>
              </div>
              <span className="db-filter-count">{sorted.length} schemes</span>
            </div>
            <div className="db-filter-cats">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`db-cat-pill ${activeFilter === cat ? 'db-cat-pill--active' : ''}`} onClick={() => setActiveFilter(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Schemes */}
          <section className="db-section">
            <div className="db-section__header">
              <div className="db-section__title-wrap">
                <h2 className="db-section__title">
                  {profile ? '🎯 Recommended For You' : '📋 All Schemes'}
                </h2>
                {profile && <span className="db-section__badge">{sorted.filter(s => s.matchScore >= 50).length} eligible</span>}
              </div>
              {profile && (
                <div className="db-section__sort">
                  <span>Sorted by: Best Match</span>
                </div>
              )}
            </div>

            {sorted.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty__icon">🔍</div>
                <div className="db-empty__title">No schemes found</div>
                <div className="db-empty__sub">Try adjusting your filters</div>
                <button className="db-empty__btn" onClick={() => { setActiveFilter('All'); setActiveGov('All'); setSearchQuery('') }}>Clear Filters</button>
              </div>
            ) : (
              <div className="db-schemes-grid">
                {sorted.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    matchScore={scheme.matchScore}
                    hasProfile={!!profile}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Deadlines section */}
          {profile && deadlines.length > 0 && (
            <section className="db-section">
              <div className="db-section__header">
                <div className="db-section__title-wrap">
                  <h2 className="db-section__title">⏰ Deadline Approaching</h2>
                  <span className="db-section__badge db-section__badge--red">Act Fast!</span>
                </div>
              </div>
              <div className="db-deadline-list">
                {deadlines.map(scheme => (
                  <div key={scheme.id} className="db-deadline-item">
                    <div className="db-deadline-item__left">
                      <div className={`db-deadline-item__urgency ${scheme.deadlineDays <= 20 ? 'urgent' : 'soon'}`}>
                        {scheme.deadlineDays}d
                      </div>
                      <div>
                        <div className="db-deadline-item__name">{scheme.name}</div>
                        <div className="db-deadline-item__meta">
                          <span style={{ background: `${scheme.categoryColor}15`, color: scheme.categoryColor }} className="db-deadline-item__cat">{scheme.category}</span>
                          <span className="db-deadline-item__benefit">{scheme.benefit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="db-deadline-item__right">
                      {scheme.matchScore !== null && (
                        <div className="db-deadline-item__match" style={{ color: scheme.matchScore >= 60 ? '#22c55e' : '#94a3b8' }}>
                          {scheme.matchScore}% match
                        </div>
                      )}
                      <button className="db-deadline-item__btn">Apply →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="db-footer">
            <span>© 2025 NammaSeva</span>
            <span>·</span>
            <span>Match scores are calculated based on your profile details</span>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
