import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSchemeById, getSimilarSchemes, checkCriterion, SCHEMES } from '../data/schemes'
import { getProfile, calculateMatch, isSchemesSaved, saveScheme, removeSavedScheme } from '../utils/userStore'
import ApplyHelperBot from '../components/ApplyHelperBot'
import './SchemeDetailPage.css'

/* ── Small helper components ── */
const PassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M7 12l3.5 3.5L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const FailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
    <path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)
const UnknownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/>
    <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="700" fill="#d97706">?</text>
  </svg>
)

/* ── Match Arc ── */
const MatchArc = ({ score, size = 120 }) => {
  const r = (size / 2) - 12
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#FF6B00' : '#f59e0b'
  const label = score >= 75 ? 'High Match' : score >= 50 ? 'Moderate Match' : 'Low Match'
  return (
    <div className="sdp-arc-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8eef8" strokeWidth="10"/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x={size/2} y={size/2 - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill={color} fontFamily="Poppins,sans-serif">{score}%</text>
        <text x={size/2} y={size/2 + 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Poppins,sans-serif">MATCH</text>
      </svg>
      <div className="sdp-arc-label" style={{ color }}>{label}</div>
    </div>
  )
}

/* ── Mini scheme card ── */
const MiniSchemeCard = ({ scheme, matchScore, onClick }) => (
  <div className="sdp-similar-card" onClick={onClick}>
    <div className="sdp-similar-card__top">
      <span className="sdp-similar-card__gov">{scheme.govLogo} {scheme.gov}</span>
      {matchScore !== null && (
        <span className="sdp-similar-card__match" style={{ color: matchScore >= 70 ? '#22c55e' : '#FF6B00' }}>
          {matchScore}%
        </span>
      )}
    </div>
    <div className="sdp-similar-card__cat" style={{ color: scheme.categoryColor, background: `${scheme.categoryColor}15` }}>
      {scheme.categoryIcon} {scheme.category}
    </div>
    <h4 className="sdp-similar-card__name">{scheme.name}</h4>
    <div className="sdp-similar-card__benefit">{scheme.benefit}</div>
    <div className="sdp-similar-card__cta">View Details →</div>
  </div>
)

/* ════════════════════════════════════════════
   SCHEME DETAIL PAGE
════════════════════════════════════════════ */
const SchemeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const scheme   = getSchemeById(id)
  const profile  = getProfile()
  const matchScore = scheme ? calculateMatch(scheme.id, profile) : null
  const similar  = scheme ? getSimilarSchemes(scheme) : []

  const [saved, setSaved] = useState(scheme ? isSchemesSaved(scheme.id) : false)

  useEffect(() => {
    if (scheme) setSaved(isSchemesSaved(scheme.id))
  }, [scheme])

  const handleToggleSave = () => {
    if (!scheme) return
    if (saved) {
      removeSavedScheme(scheme.id)
    } else {
      saveScheme({
        id: scheme.id,
        name: scheme.name,
        category: scheme.category,
        categoryColor: scheme.categoryColor,
        type: scheme.type === 'private' ? 'Private' : scheme.type === 'ngo' ? 'NGO' : 'Government',
        matchScore: matchScore || 0,
        deadline: scheme.deadlineDays ? `${scheme.deadlineDays} Days left` : 'Ongoing',
        description: scheme.description,
        state: scheme.gov || 'Central'
      })
    }
    setSaved(!saved)
  }
  const [checkedDocs, setCheckedDocs] = useState({})
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showHelperBot, setShowHelperBot] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  if (!scheme) {
    return (
      <div className="sdp-notfound">
        <div className="sdp-notfound__icon">🔍</div>
        <h2>Scheme Not Found</h2>
        <p>We couldn't find this scheme. It may have been moved or removed.</p>
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    )
  }

  const criteria = scheme.eligibilityCriteria.map(c => ({
    ...c,
    status: checkCriterion(c, profile),
  }))
  const passCount    = criteria.filter(c => c.status === 'pass').length
  const failCount    = criteria.filter(c => c.status === 'fail').length
  const unknownCount = criteria.filter(c => c.status === 'unknown').length

  const toggleDoc = (id) => setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }))
  const checkedCount = Object.values(checkedDocs).filter(Boolean).length

  const handleShare = async () => {
    const text = `Check out ${scheme.name} — ${scheme.benefit} benefit!\n${window.location.href}`
    if (navigator.share) {
      await navigator.share({ title: scheme.name, text, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const matchColor = matchScore === null ? '#94a3b8' : matchScore >= 75 ? '#22c55e' : matchScore >= 50 ? '#FF6B00' : '#f59e0b'

  return (
    <div className="sdp-page">

      {/* ════ TOP NAV ════ */}
      <div className="sdp-topnav">
        <button className="sdp-back-btn" onClick={() => navigate('/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <div className="sdp-topnav__actions">
          <button className={`sdp-action-btn ${saved ? 'sdp-action-btn--saved' : ''}`} onClick={handleToggleSave}>
            {saved ? '🔖 Saved' : '🏷️ Save'}
          </button>
          <button className="sdp-action-btn" onClick={handleShare}>
            {copied ? '✅ Copied!' : '📤 Share'}
          </button>
        </div>
      </div>

      <div className="sdp-layout">

        {/* ════ LEFT — MAIN CONTENT ════ */}
        <div className="sdp-content">

          {/* ── Hero Card ── */}
          <div className="sdp-hero">
            <div className="sdp-hero__top">
              <div className="sdp-hero__gov-badge">
                <span className="sdp-hero__gov-logo">{scheme.govLogo}</span>
                <div>
                  <div className="sdp-hero__gov-type">{scheme.gov} Government Scheme</div>
                  <div className="sdp-hero__ministry">{scheme.ministry}</div>
                </div>
              </div>
              <div className="sdp-hero__meta">
                <span className="sdp-hero__year">Since {scheme.launchedYear}</span>
                {scheme.deadline && (
                  <span className={`sdp-hero__deadline ${scheme.deadlineDays <= 20 ? 'sdp-hero__deadline--urgent' : ''}`}>
                    ⏰ {scheme.deadlineDays} days left
                  </span>
                )}
              </div>
            </div>

            <span className="sdp-hero__cat" style={{ background: `${scheme.categoryColor}18`, color: scheme.categoryColor }}>
              {scheme.categoryIcon} {scheme.category}
            </span>
            <h1 className="sdp-hero__name">{scheme.name}</h1>

            <div className="sdp-hero__benefit-row">
              <div className="sdp-hero__benefit">
                <div className="sdp-hero__benefit-amount">{scheme.benefit}</div>
                <div className="sdp-hero__benefit-type">{scheme.benefitType}</div>
              </div>
              <div className="sdp-hero__benefit-breakdown">
                <div className="sdp-hero__breakdown-label">How it's given</div>
                <div className="sdp-hero__breakdown-val">{scheme.benefitBreakdown}</div>
              </div>
            </div>

            <div className="sdp-hero__tags">
              {scheme.tags.map(t => <span key={t} className="sdp-hero__tag">{t}</span>)}
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <div className="sdp-tabs">
            {[
              { id: 'overview', label: '📄 Overview' },
              { id: 'eligibility', label: '✅ Eligibility' },
              { id: 'documents', label: '📁 Documents' },
              { id: 'apply', label: '🚀 How to Apply' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`sdp-tab ${activeTab === tab.id ? 'sdp-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="sdp-tab-content">
              <div className="sdp-section">
                <h2 className="sdp-section__title">About This Scheme</h2>
                <p className="sdp-section__text">{scheme.description}</p>
              </div>

              <div className="sdp-contact-card">
                <h3 className="sdp-contact-card__title">📞 Need Help?</h3>
                <div className="sdp-contact-card__items">
                  {scheme.helpline && (
                    <div className="sdp-contact-item">
                      <span className="sdp-contact-item__label">Helpline</span>
                      <a href={`tel:${scheme.helpline}`} className="sdp-contact-item__val">{scheme.helpline}</a>
                    </div>
                  )}
                  {scheme.email && (
                    <div className="sdp-contact-item">
                      <span className="sdp-contact-item__label">Email</span>
                      <a href={`mailto:${scheme.email}`} className="sdp-contact-item__val">{scheme.email}</a>
                    </div>
                  )}
                  <div className="sdp-contact-item">
                    <span className="sdp-contact-item__label">Official Website</span>
                    <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="sdp-contact-item__val sdp-contact-item__val--link">
                      {scheme.officialUrl.replace('https://', '')} ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Eligibility Tab ── */}
          {activeTab === 'eligibility' && (
            <div className="sdp-tab-content">
              {!profile && (
                <div className="sdp-profile-prompt" onClick={() => navigate('/profile-setup')}>
                  <div className="sdp-profile-prompt__icon">👤</div>
                  <div className="sdp-profile-prompt__text">
                    <strong>Complete your profile</strong> to see if you personally qualify for each criterion.
                  </div>
                  <button className="sdp-profile-prompt__btn">Set Up Profile →</button>
                </div>
              )}

              {profile && (
                <div className="sdp-elig-summary">
                  <div className="sdp-elig-summary__item sdp-elig-summary__item--pass">
                    <PassIcon /><span>{passCount} criteria met</span>
                  </div>
                  {failCount > 0 && (
                    <div className="sdp-elig-summary__item sdp-elig-summary__item--fail">
                      <FailIcon /><span>{failCount} not met</span>
                    </div>
                  )}
                  {unknownCount > 0 && (
                    <div className="sdp-elig-summary__item sdp-elig-summary__item--unknown">
                      <UnknownIcon /><span>{unknownCount} unknown</span>
                    </div>
                  )}
                </div>
              )}

              <div className="sdp-section">
                <h2 className="sdp-section__title">Eligibility Criteria</h2>
                <div className="sdp-criteria-list">
                  {criteria.map(c => (
                    <div key={c.id} className={`sdp-criterion sdp-criterion--${c.status}`}>
                      <div className="sdp-criterion__icon">
                        {c.status === 'pass' ? <PassIcon /> : c.status === 'fail' ? <FailIcon /> : <UnknownIcon />}
                      </div>
                      <div className="sdp-criterion__body">
                        <span className="sdp-criterion__emoji">{c.icon}</span>
                        <span className="sdp-criterion__label">{c.label}</span>
                      </div>
                      <div className="sdp-criterion__status-text">
                        {c.status === 'pass' && <span className="sdp-status--pass">✓ Met</span>}
                        {c.status === 'fail' && <span className="sdp-status--fail">✗ Not met</span>}
                        {c.status === 'unknown' && <span className="sdp-status--unknown">Add to profile</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Documents Tab ── */}
          {activeTab === 'documents' && (
            <div className="sdp-tab-content">
              <div className="sdp-section">
                <div className="sdp-section__header-row">
                  <h2 className="sdp-section__title">Required Documents</h2>
                  <span className="sdp-doc-progress">
                    {checkedCount}/{scheme.documents.length} ready
                  </span>
                </div>
                <p className="sdp-section__subtitle">Check off the documents you already have ready.</p>

                <div className="sdp-doc-list">
                  {scheme.documents.map(doc => (
                    <div
                      key={doc.id}
                      className={`sdp-doc-item ${checkedDocs[doc.id] ? 'sdp-doc-item--checked' : ''}`}
                      onClick={() => toggleDoc(doc.id)}
                    >
                      <div className={`sdp-doc-check ${checkedDocs[doc.id] ? 'sdp-doc-check--done' : ''}`}>
                        {checkedDocs[doc.id] && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M5 12l5 5L20 7"/>
                          </svg>
                        )}
                      </div>
                      <div className="sdp-doc-info">
                        <span className="sdp-doc-name">{doc.label}</span>
                        {doc.required ? (
                          <span className="sdp-doc-tag sdp-doc-tag--required">Required</span>
                        ) : (
                          <span className="sdp-doc-tag sdp-doc-tag--optional">Optional</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {checkedCount === scheme.documents.length && (
                  <div className="sdp-doc-complete">
                    🎉 All documents ready! You can now apply.
                  </div>
                )}

                {checkedCount > 0 && checkedCount < scheme.documents.filter(d => d.required).length && (
                  <div className="sdp-doc-missing">
                    ⚠️ {scheme.documents.filter(d => d.required).length - checkedCount} required documents still missing.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── How to Apply Tab ── */}
          {activeTab === 'apply' && (
            <div className="sdp-tab-content">
              <div className="sdp-section">
                <h2 className="sdp-section__title">Step-by-Step Application Guide</h2>
                <div className="sdp-steps">
                  {scheme.applySteps.map((s, i) => (
                    <div key={s.step} className="sdp-step">
                      <div className="sdp-step__line">
                        <div className="sdp-step__bubble">{s.step}</div>
                        {i < scheme.applySteps.length - 1 && <div className="sdp-step__connector" />}
                      </div>
                      <div className="sdp-step__body">
                        <div className="sdp-step__title">{s.title}</div>
                        <div className="sdp-step__desc">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sdp-apply-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Apply on Official Website
                </a>
                <button className="sdp-apply-btn" style={{ background: '#ecfdf5', color: '#059669', marginLeft: '12px', border: '1px solid #10b981' }} onClick={() => setShowHelperBot(true)}>
                  Apply Helper 📋
                </button>
                <p className="sdp-apply-note">
                  You will be redirected to the official government portal. NammaSeva does not process applications directly.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* ════ RIGHT — SIDEBAR ════ */}
        <div className="sdp-sidebar">

          {/* Match Score Card */}
          <div className="sdp-match-card">
            <div className="sdp-match-card__header">Your Eligibility Score</div>
            {profile && matchScore !== null ? (
              <>
                <MatchArc score={matchScore} size={130} />
                <div className="sdp-match-card__breakdown">
                  <div className="sdp-match-card__row">
                    <PassIcon /><span>{passCount} criteria met</span>
                  </div>
                  {failCount > 0 && <div className="sdp-match-card__row"><FailIcon /><span>{failCount} criteria not met</span></div>}
                  {unknownCount > 0 && <div className="sdp-match-card__row"><UnknownIcon /><span>{unknownCount} — update profile</span></div>}
                </div>
                {failCount > 0 && (
                  <div className="sdp-match-card__tip">
                    💡 Your profile has criteria that don't match. You may still apply — check the eligibility tab.
                  </div>
                )}
              </>
            ) : (
              <div className="sdp-match-card__noprofile" onClick={() => navigate('/profile-setup')}>
                <div className="sdp-match-card__noprofile-icon">👤</div>
                <div className="sdp-match-card__noprofile-text">Complete your profile to see your personal eligibility score</div>
                <button className="sdp-match-card__noprofile-btn">Set Up Profile →</button>
              </div>
            )}
          </div>

          {/* Quick Action */}
          <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="sdp-apply-btn-sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Apply on Official Site
          </a>

          <button className="sdp-apply-btn-sidebar" style={{ marginTop: '8px', background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' }} onClick={() => setShowHelperBot(true)}>
            Apply Helper 📋
          </button>

          <div className="sdp-sidebar-actions">
            <button className={`sdp-sidebar-btn ${saved ? 'sdp-sidebar-btn--active' : ''}`} onClick={handleToggleSave}>
              {saved ? '🔖 Saved' : '🏷️ Save Scheme'}
            </button>
            <button className="sdp-sidebar-btn" onClick={handleShare}>
              {copied ? '✅ Link Copied!' : '📤 Share Scheme'}
            </button>
          </div>

          {/* Scheme Info */}
          <div className="sdp-info-card">
            <h3 className="sdp-info-card__title">Scheme Info</h3>
            <div className="sdp-info-rows">
              <div className="sdp-info-row"><span>Type</span><strong>{scheme.gov} Scheme</strong></div>
              <div className="sdp-info-row"><span>Category</span><strong>{scheme.category}</strong></div>
              <div className="sdp-info-row"><span>Benefit</span><strong>{scheme.benefit}</strong></div>
              <div className="sdp-info-row"><span>Since</span><strong>{scheme.launchedYear}</strong></div>
              <div className="sdp-info-row"><span>Helpline</span><strong><a href={`tel:${scheme.helpline}`}>{scheme.helpline}</a></strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ SIMILAR SCHEMES ════ */}
      {similar.length > 0 && (
        <div className="sdp-similar-section">
          <div className="sdp-similar-section__header">
            <h2 className="sdp-similar-section__title">Similar Schemes You Might Qualify For</h2>
          </div>
          <div className="sdp-similar-grid">
            {similar.map(s => (
              <MiniSchemeCard
                key={s.id}
                scheme={s}
                matchScore={calculateMatch(s.id, profile)}
                onClick={() => navigate(`/scheme/${s.id}`)}
              />
            ))}
          </div>
        </div>
      )}
      
      {showHelperBot && <ApplyHelperBot scheme={scheme} onClose={() => setShowHelperBot(false)} />}
    </div>
  )
}

export default SchemeDetailPage
