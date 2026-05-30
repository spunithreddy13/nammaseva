import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './DashboardPage.css'

/* ═══════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════ */
const USER = {
  name: 'Rajesh Kumar',
  firstName: 'Rajesh',
  location: 'Bengaluru, Karnataka',
  occupation: 'Farmer',
  income: '₹1–2.5 Lakhs/year',
  caste: 'OBC',
  avatar: null,
  profileCompletion: 78,
  matchScore: 87,
}

const SCHEMES = [
  {
    id: 1,
    name: 'PM-KISAN Samman Nidhi',
    shortName: 'PM-KISAN',
    gov: 'Central',
    govLogo: '🇮🇳',
    category: 'Agriculture',
    categoryColor: '#D97706',
    benefit: '₹6,000/year',
    benefitType: 'Direct Cash',
    match: 94,
    description: 'Income support of ₹6000 per year to all land holding farmer families across the country.',
    deadline: '2025-06-30',
    deadlineDays: 32,
    tags: ['Farmers', 'Direct Benefit Transfer'],
    saved: false,
    applied: false,
    state: null,
    featured: true,
  },
  {
    id: 2,
    name: 'Karnataka Raita Siri',
    shortName: 'Raita Siri',
    gov: 'State',
    govLogo: '🏛️',
    category: 'Agriculture',
    categoryColor: '#D97706',
    benefit: '₹10,000/year',
    benefitType: 'Direct Cash',
    match: 91,
    description: 'Financial assistance to farmers in Karnataka for agricultural inputs and equipment.',
    deadline: '2025-07-15',
    deadlineDays: 47,
    tags: ['Karnataka', 'Farmers', 'OBC'],
    saved: true,
    applied: false,
    state: 'Karnataka',
    featured: true,
  },
  {
    id: 3,
    name: 'National Scholarship Portal',
    shortName: 'NSP Scholarship',
    gov: 'Central',
    govLogo: '🇮🇳',
    category: 'Education',
    categoryColor: '#4F46E5',
    benefit: '₹15,000/year',
    benefitType: 'Scholarship',
    match: 76,
    description: 'Merit-cum-means scholarships for OBC students pursuing higher education.',
    deadline: '2025-08-31',
    deadlineDays: 94,
    tags: ['OBC', 'Students', 'Higher Education'],
    saved: false,
    applied: true,
    state: null,
    featured: false,
  },
  {
    id: 4,
    name: 'Ayushman Bharat PMJAY',
    shortName: 'PMJAY',
    gov: 'Central',
    govLogo: '🇮🇳',
    category: 'Healthcare',
    categoryColor: '#059669',
    benefit: '₹5 Lakh/year',
    benefitType: 'Health Cover',
    match: 89,
    description: 'World\'s largest health insurance scheme providing ₹5 lakh cover per family per year.',
    deadline: null,
    deadlineDays: null,
    tags: ['Health Insurance', 'Cashless Treatment'],
    saved: false,
    applied: false,
    state: null,
    featured: true,
  },
  {
    id: 5,
    name: 'Karnataka Gruha Lakshmi',
    shortName: 'Gruha Lakshmi',
    gov: 'State',
    govLogo: '🏛️',
    category: 'Women Empowerment',
    categoryColor: '#DB2777',
    benefit: '₹2,000/month',
    benefitType: 'Monthly Cash',
    match: 62,
    description: 'Monthly financial assistance of ₹2000 to the head woman of every household in Karnataka.',
    deadline: null,
    deadlineDays: null,
    tags: ['Women', 'Karnataka', 'Monthly Benefit'],
    saved: false,
    applied: false,
    state: 'Karnataka',
    featured: false,
  },
  {
    id: 6,
    name: 'MUDRA Loan - Shishu',
    shortName: 'MUDRA Loan',
    gov: 'Central',
    govLogo: '🇮🇳',
    category: 'Business',
    categoryColor: '#7C3AED',
    benefit: 'Up to ₹50,000',
    benefitType: 'Collateral-free Loan',
    match: 71,
    description: 'Micro loans for small businesses and entrepreneurs to start or expand their business.',
    deadline: null,
    deadlineDays: null,
    tags: ['Entrepreneurs', 'Small Business', 'Self-Employed'],
    saved: false,
    applied: false,
    state: null,
    featured: false,
  },
  {
    id: 7,
    name: 'PM Awas Yojana (Rural)',
    shortName: 'PMAY Rural',
    gov: 'Central',
    govLogo: '🇮🇳',
    category: 'Housing',
    categoryColor: '#DC2626',
    benefit: '₹1.2–1.3 Lakh',
    benefitType: 'Housing Grant',
    match: 83,
    description: 'Housing assistance for rural households to build a pucca house with basic amenities.',
    deadline: '2025-06-15',
    deadlineDays: 17,
    tags: ['Rural Housing', 'BPL Families'],
    saved: true,
    applied: false,
    state: null,
    featured: false,
  },
  {
    id: 8,
    name: 'Karnataka Anna Bhagya',
    shortName: 'Anna Bhagya',
    gov: 'State',
    govLogo: '🏛️',
    category: 'Food Security',
    categoryColor: '#EA580C',
    benefit: '10 kg rice/month',
    benefitType: 'Food Subsidy',
    match: 88,
    description: 'Free rice scheme for BPL families in Karnataka — 10 kg rice per member per month.',
    deadline: null,
    deadlineDays: null,
    tags: ['Karnataka', 'BPL', 'Food'],
    saved: false,
    applied: false,
    state: 'Karnataka',
    featured: false,
  },
]

const RECENTLY_VIEWED = [
  { id: 10, name: 'Atal Pension Yojana', category: 'Pension', match: 78, viewedAgo: '2 hours ago' },
  { id: 11, name: 'Skill India Mission', category: 'Education', match: 65, viewedAgo: 'Yesterday' },
  { id: 12, name: 'MNREGS Work Guarantee', category: 'Employment', match: 81, viewedAgo: '2 days ago' },
]

const DEADLINES = SCHEMES.filter(s => s.deadlineDays && s.deadlineDays < 50).sort((a, b) => a.deadlineDays - b.deadlineDays)

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard', active: true },
  { icon: '🔍', label: 'Browse Schemes', path: '/schemes', active: false },
  { icon: '📑', label: 'My Applications', path: '/applications', active: false },
  { icon: '🔖', label: 'Saved Schemes', path: '/saved', active: false },
  { icon: '👤', label: 'My Profile', path: '/profile-setup', active: false },
  { icon: '🔔', label: 'Notifications', path: '/notifications', active: false },
  { icon: '⚙️', label: 'Settings', path: '/settings', active: false },
]

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Education', 'Housing', 'Business', 'Women Empowerment']
const GOVTYPES = ['All', 'Central', 'State']

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */

const MatchRing = ({ score, size = 80 }) => {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#22c55e' : score >= 65 ? '#FF6B00' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="db-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={color}>{score}%</text>
    </svg>
  )
}

const SchemeCard = ({ scheme, onSave, onView }) => {
  const matchColor = scheme.match >= 85 ? '#22c55e' : scheme.match >= 70 ? '#FF6B00' : '#6366f1'
  const urgency = scheme.deadlineDays
    ? scheme.deadlineDays <= 20 ? 'urgent' : scheme.deadlineDays <= 45 ? 'soon' : ''
    : ''

  return (
    <div className={`db-scheme-card ${scheme.featured ? 'db-scheme-card--featured' : ''}`}>
      {scheme.featured && <div className="db-scheme-card__featured-badge">⭐ Top Match</div>}
      {urgency === 'urgent' && (
        <div className="db-scheme-card__deadline db-scheme-card__deadline--urgent">
          🔴 {scheme.deadlineDays}d left
        </div>
      )}
      {urgency === 'soon' && (
        <div className="db-scheme-card__deadline db-scheme-card__deadline--soon">
          🟡 {scheme.deadlineDays}d left
        </div>
      )}

      <div className="db-scheme-card__top">
        <div className="db-scheme-card__gov">
          <span className="db-scheme-card__gov-logo">{scheme.govLogo}</span>
          <span className="db-scheme-card__gov-type">{scheme.gov} Govt.</span>
        </div>
        <div className="db-scheme-card__match" style={{ color: matchColor }}>
          <span className="db-scheme-card__match-num">{scheme.match}%</span>
          <span className="db-scheme-card__match-label">match</span>
        </div>
      </div>

      <div className="db-scheme-card__body">
        <span className="db-scheme-card__cat" style={{ background: `${scheme.categoryColor}15`, color: scheme.categoryColor }}>
          {scheme.category}
        </span>
        <h3 className="db-scheme-card__name">{scheme.name}</h3>
        <p className="db-scheme-card__desc">{scheme.description}</p>
      </div>

      <div className="db-scheme-card__benefit">
        <div className="db-scheme-card__benefit-amount">{scheme.benefit}</div>
        <div className="db-scheme-card__benefit-type">{scheme.benefitType}</div>
      </div>

      <div className="db-scheme-card__match-bar">
        <div className="db-scheme-card__match-bar-fill" style={{ width: `${scheme.match}%`, background: matchColor }} />
      </div>

      <div className="db-scheme-card__tags">
        {scheme.tags.slice(0, 2).map(t => (
          <span key={t} className="db-scheme-card__tag">{t}</span>
        ))}
      </div>

      <div className="db-scheme-card__actions">
        <button className="db-scheme-card__view" onClick={() => onView(scheme)}>
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <button
          className={`db-scheme-card__save ${scheme.saved ? 'db-scheme-card__save--saved' : ''}`}
          onClick={() => onSave(scheme.id)}
          aria-label={scheme.saved ? 'Unsave' : 'Save'}
        >
          {scheme.saved ? '🔖' : '🔕'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD PAGE
═══════════════════════════════════════════ */
const DashboardPage = () => {
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState(SCHEMES)
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeGov, setActiveGov] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notifRef = useRef(null)

  // Close notif on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSave = (id) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, saved: !s.saved } : s))
  }

  const handleView = (scheme) => {
    // future: navigate to scheme detail
    console.log('Viewing', scheme.name)
  }

  const filtered = schemes.filter(s => {
    const catOk = activeFilter === 'All' || s.category === activeFilter
    const govOk = activeGov === 'All' || s.gov === activeGov
    const searchOk = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    return catOk && govOk && searchOk
  })

  const savedCount = schemes.filter(s => s.saved).length
  const appliedCount = schemes.filter(s => s.applied).length

  const initials = USER.name.split(' ').map(n => n[0]).join('')

  return (
    <div className="db-page">

      {/* ── Sidebar Overlay (mobile) ── */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════════ TOP HEADER ════════════ */}
      <header className="db-header">
        <div className="db-header__left">
          <button className="db-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className="db-header__brand" onClick={() => navigate('/')}>
            <div className="db-header__brand-logo">
              <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
                <circle cx="20" cy="20" r="20" fill="url(#dbGrad)" />
                <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
                <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
                <defs>
                  <linearGradient id="dbGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#FF6B00"/>
                    <stop offset="100%" stopColor="#FF8C38"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="db-header__brand-name">NammaSeva</span>
          </div>
        </div>

        <div className="db-header__center">
          <div className="db-search">
            <svg className="db-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="db-search__input"
              type="text"
              placeholder="Search schemes, categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="db-search__clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        <div className="db-header__right">
          {/* Notification Bell */}
          <div className="db-notif-wrap" ref={notifRef}>
            <button
              className={`db-notif-btn ${notifOpen ? 'db-notif-btn--active' : ''}`}
              onClick={() => setNotifOpen(o => !o)}
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="db-notif-badge">3</span>
            </button>
            {notifOpen && (
              <div className="db-notif-panel">
                <div className="db-notif-panel__header">
                  <span>Notifications</span>
                  <span className="db-notif-panel__count">3 new</span>
                </div>
                {[
                  { icon: '🎯', text: 'New scheme matched your profile: PMAY Urban', time: '10 min ago', unread: true },
                  { icon: '⚠️', text: 'PMAY Rural deadline in 17 days!', time: '1 hour ago', unread: true },
                  { icon: '✅', text: 'Your NSP Scholarship application was received', time: 'Yesterday', unread: true },
                ].map((n, i) => (
                  <div key={i} className={`db-notif-item ${n.unread ? 'db-notif-item--unread' : ''}`}>
                    <div className="db-notif-item__icon">{n.icon}</div>
                    <div className="db-notif-item__body">
                      <div className="db-notif-item__text">{n.text}</div>
                      <div className="db-notif-item__time">{n.time}</div>
                    </div>
                  </div>
                ))}
                <button className="db-notif-panel__all">View all notifications</button>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="db-avatar" onClick={() => navigate('/profile-setup')}>
            {USER.avatar ? (
              <img src={USER.avatar} alt={USER.name} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>
      </header>

      <div className="db-layout">

        {/* ════════════ LEFT SIDEBAR ════════════ */}
        <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar--open' : ''}`}>
          <div className="db-sidebar__inner">

            {/* Profile Card */}
            <div className="db-profile-card">
              <div className="db-profile-card__avatar">
                {USER.avatar ? (
                  <img src={USER.avatar} alt={USER.name} />
                ) : (
                  <span>{initials}</span>
                )}
                <div className="db-profile-card__badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              </div>
              <div className="db-profile-card__info">
                <div className="db-profile-card__name">{USER.name}</div>
                <div className="db-profile-card__loc">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {USER.location}
                </div>
                <div className="db-profile-card__tags">
                  <span>{USER.occupation}</span>
                  <span>{USER.caste}</span>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="db-profile-completion">
                <div className="db-profile-completion__row">
                  <span>Profile Complete</span>
                  <span>{USER.profileCompletion}%</span>
                </div>
                <div className="db-profile-completion__bar">
                  <div
                    className="db-profile-completion__fill"
                    style={{ width: `${USER.profileCompletion}%` }}
                  />
                </div>
                <button className="db-profile-completion__cta" onClick={() => navigate('/profile-setup')}>
                  Complete Profile →
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="db-stats">
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#0B2D6B' }}>{schemes.length}</div>
                <div className="db-stat__label">Matched</div>
              </div>
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#FF6B00' }}>{savedCount}</div>
                <div className="db-stat__label">Saved</div>
              </div>
              <div className="db-stat">
                <div className="db-stat__num" style={{ color: '#22c55e' }}>{appliedCount}</div>
                <div className="db-stat__label">Applied</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="db-nav">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.label}
                  className={`db-nav-item ${item.active ? 'db-nav-item--active' : ''}`}
                  onClick={() => { navigate(item.path); setSidebarOpen(false) }}
                >
                  <span className="db-nav-item__icon">{item.icon}</span>
                  <span className="db-nav-item__label">{item.label}</span>
                  {item.active && <span className="db-nav-item__dot" />}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button className="db-logout" onClick={() => navigate('/')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ════════════ MAIN CONTENT ════════════ */}
        <main className="db-main">

          {/* ── Welcome Banner ── */}
          <div className="db-welcome">
            <div className="db-welcome__left">
              <h1 className="db-welcome__title">
                Namaste, <span>{USER.firstName}</span>! 👋
              </h1>
              <p className="db-welcome__sub">
                We found <strong>{schemes.length} schemes</strong> that match your profile in <strong>Karnataka</strong>.
              </p>
              <div className="db-welcome__completion">
                <div className="db-welcome__completion-text">
                  Profile {USER.profileCompletion}% complete — add more details to unlock better matches
                </div>
                <div className="db-welcome__bar">
                  <div className="db-welcome__bar-fill" style={{ width: `${USER.profileCompletion}%` }} />
                </div>
              </div>
            </div>
            <div className="db-welcome__right">
              <div className="db-match-score-card">
                <MatchRing score={USER.matchScore} size={90} />
                <div className="db-match-score-card__info">
                  <div className="db-match-score-card__label">Eligibility</div>
                  <div className="db-match-score-card__title">Match Score</div>
                  <div className="db-match-score-card__sub">Based on your profile</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Deadline Alert Banner ── */}
          {DEADLINES.length > 0 && (
            <div className="db-deadline-banner">
              <div className="db-deadline-banner__icon">⚠️</div>
              <div className="db-deadline-banner__text">
                <strong>Deadline Alert:</strong>{' '}
                {DEADLINES[0].name} closes in <strong>{DEADLINES[0].deadlineDays} days</strong>.
                Don't miss out!
              </div>
              <button className="db-deadline-banner__btn">Apply Now →</button>
            </div>
          )}

          {/* ── Filters ── */}
          <div className="db-filters">
            <div className="db-filters__row">
              <div className="db-filter-group">
                <span className="db-filter-group__label">Scheme Type:</span>
                <div className="db-filter-pills">
                  {GOVTYPES.map(g => (
                    <button
                      key={g}
                      className={`db-filter-pill ${activeGov === g ? 'db-filter-pill--active' : ''}`}
                      onClick={() => setActiveGov(g)}
                    >
                      {g === 'Central' ? '🇮🇳 ' : g === 'State' ? '🏛️ ' : ''}{g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="db-filter-group">
                <span className="db-filter-group__label">Results:</span>
                <span className="db-filter-count">{filtered.length} schemes</span>
              </div>
            </div>
            <div className="db-filter-cats">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`db-cat-pill ${activeFilter === cat ? 'db-cat-pill--active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Recommended Section ── */}
          <section className="db-section">
            <div className="db-section__header">
              <div className="db-section__title-wrap">
                <h2 className="db-section__title">🎯 Recommended For You</h2>
                <span className="db-section__badge">{filtered.length} schemes</span>
              </div>
              <div className="db-section__sort">
                <span>Sort by:</span>
                <select className="db-sort-select">
                  <option>Best Match</option>
                  <option>Deadline First</option>
                  <option>Highest Benefit</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty__icon">🔍</div>
                <div className="db-empty__title">No schemes found</div>
                <div className="db-empty__sub">Try adjusting your filters</div>
                <button className="db-empty__btn" onClick={() => { setActiveFilter('All'); setActiveGov('All'); setSearchQuery('') }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="db-schemes-grid">
                {filtered.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onSave={handleSave}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Deadline Approaching ── */}
          <section className="db-section">
            <div className="db-section__header">
              <div className="db-section__title-wrap">
                <h2 className="db-section__title">⏰ Deadline Approaching</h2>
                <span className="db-section__badge db-section__badge--red">Act Fast!</span>
              </div>
            </div>
            <div className="db-deadline-list">
              {DEADLINES.map(scheme => (
                <div key={scheme.id} className="db-deadline-item">
                  <div className="db-deadline-item__left">
                    <div className={`db-deadline-item__urgency ${scheme.deadlineDays <= 20 ? 'urgent' : 'soon'}`}>
                      {scheme.deadlineDays}d
                    </div>
                    <div>
                      <div className="db-deadline-item__name">{scheme.name}</div>
                      <div className="db-deadline-item__meta">
                        <span style={{ background: `${scheme.categoryColor}15`, color: scheme.categoryColor }} className="db-deadline-item__cat">
                          {scheme.category}
                        </span>
                        <span className="db-deadline-item__benefit">{scheme.benefit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="db-deadline-item__right">
                    <div className="db-deadline-item__match">{scheme.match}% match</div>
                    <button className="db-deadline-item__btn">Apply →</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recently Viewed ── */}
          <section className="db-section">
            <div className="db-section__header">
              <div className="db-section__title-wrap">
                <h2 className="db-section__title">🕒 Recently Viewed</h2>
              </div>
              <button className="db-section__link">View History</button>
            </div>
            <div className="db-recent-list">
              {RECENTLY_VIEWED.map(s => (
                <div key={s.id} className="db-recent-item">
                  <div className="db-recent-item__icon">📄</div>
                  <div className="db-recent-item__info">
                    <div className="db-recent-item__name">{s.name}</div>
                    <div className="db-recent-item__meta">
                      <span className="db-recent-item__cat">{s.category}</span>
                      <span className="db-recent-item__time">{s.viewedAgo}</span>
                    </div>
                  </div>
                  <div className="db-recent-item__match">{s.match}%</div>
                  <button className="db-recent-item__btn">View →</button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="db-footer">
            <span>© 2025 NammaSeva</span>
            <span>·</span>
            <span>Empowering citizens through accessible governance</span>
          </div>

        </main>
      </div>
    </div>
  )
}

export default DashboardPage
