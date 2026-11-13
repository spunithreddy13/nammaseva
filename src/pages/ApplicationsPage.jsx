import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getApplications, saveApplication, updateApplicationStatus, deleteApplication } from '../utils/userStore'
import { SCHEMES } from '../data/schemes'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ApplicationsPage.css'

const STATUS_CONFIG = {
  approved:     { label: 'Approved',     color: '#10b981', bg: '#f0fdf4' },
  pending:      { label: 'Pending',      color: '#f59e0b', bg: '#fffbeb' },
  rejected:     { label: 'Rejected',     color: '#ef4444', bg: '#fef2f2' },
  under_review: { label: 'Under Review', color: '#3b82f6', bg: '#eff6ff' }
}

const ApplicationsPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [applications, setApplications] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  // Modal State for logging a new application
  const [showModal, setShowModal] = useState(false)
  const [selectedSchemeId, setSelectedSchemeId] = useState(SCHEMES[0]?.id || '')
  const [customRefNo, setCustomRefNo] = useState('')
  const [customStatus, setCustomStatus] = useState('pending')
  const [customNotes, setCustomNotes] = useState('')

  const loadApps = () => {
    setApplications(getApplications())
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      loadApps()
    }

    const handleUpdate = () => loadApps()
    window.addEventListener('ns_apps_updated', handleUpdate)
    return () => window.removeEventListener('ns_apps_updated', handleUpdate)
  }, [user, navigate])

  if (!user) return null

  const stats = {
    total: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    pending: applications.filter(a => a.status === 'pending').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  }

  const filters = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected']

  const getFilteredApps = () => {
    if (activeFilter === 'All') return applications
    const match = activeFilter.toLowerCase().replace(' ', '_')
    return applications.filter(a => a.status === match)
  }

  const filteredApps = getFilteredApps()

  const handleCreateApplication = (e) => {
    e.preventDefault()
    const scheme = SCHEMES.find(s => s.id === Number(selectedSchemeId))
    if (!scheme) return

    saveApplication({
      schemeId: scheme.id,
      schemeName: scheme.name,
      category: scheme.category,
      categoryColor: scheme.categoryColor,
      referenceNo: customRefNo.trim() || `NS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: customStatus,
      notes: customNotes.trim()
    })

    setShowModal(false)
    setCustomRefNo('')
    setCustomNotes('')
    loadApps()
  }

  const handleStatusChange = (id, newStatus) => {
    updateApplicationStatus(id, newStatus)
    loadApps()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application record?')) {
      deleteApplication(id)
      loadApps()
    }
  }

  const renderTimeline = (timeline = []) => {
    return (
      <div className="app-card__timeline">
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1
          const isCurrent = !item.done && (index === 0 || timeline[index-1].done)
          
          return (
            <div key={index} className="app-timeline__step-wrap">
              <div className="app-timeline__node-container">
                <div className={`app-timeline__circle ${item.done ? 'app-timeline__circle--done' : isCurrent ? 'app-timeline__circle--current' : 'app-timeline__circle--future'}`}>
                  {item.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  {isCurrent && <div className="app-timeline__pulse"></div>}
                </div>
                {!isLast && <div className={`app-timeline__line ${item.done ? 'app-timeline__line--done' : ''}`} />}
              </div>
              <div className="app-timeline__content">
                <div className={`app-timeline__label ${item.done ? 'app-timeline__label--done' : isCurrent ? 'app-timeline__label--current' : ''}`}>
                  {item.step}
                </div>
                {item.date && <div className="app-timeline__date">{item.date}</div>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="app-page">
      <Navbar />
      
      <main className="app-main">
        <div className="app-header-row">
          <div className="app-header">
            <h1 className="app-title">My Applications</h1>
            <p className="app-subtitle">Track your real government portal application reference numbers and progress.</p>
          </div>
          <button className="app-add-btn" onClick={() => setShowModal(true)}>
            ➕ Log An Application
          </button>
        </div>

        <div className="app-stats">
          <div className="app-stats__card">
            <div className="app-stats__num">{stats.total}</div>
            <div className="app-stats__label">Total Tracked</div>
          </div>
          <div className="app-stats__card">
            <div className="app-stats__num">{stats.approved}</div>
            <div className="app-stats__label">Approved</div>
          </div>
          <div className="app-stats__card">
            <div className="app-stats__num">{stats.pending}</div>
            <div className="app-stats__label">Pending</div>
          </div>
          <div className="app-stats__card">
            <div className="app-stats__num">{stats.rejected}</div>
            <div className="app-stats__label">Rejected</div>
          </div>
        </div>

        <div className="app-filters">
          {filters.map(f => (
            <button 
              key={f}
              className={`app-filter-btn ${activeFilter === f ? 'app-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="app-list">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => {
              const conf = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
              return (
                <div key={app.id} className="app-card">
                  <div className="app-card__top">
                    <div className="app-card__title-row">
                      <h3 className="app-card__name">{app.schemeName}</h3>
                      <div className="app-card__badges">
                        <span className="app-card__cat" style={{ color: app.categoryColor, background: `${app.categoryColor}15` }}>{app.category}</span>
                        <span className="app-card__status" style={{ color: conf.color, background: conf.bg }}>{conf.label}</span>
                      </div>
                    </div>
                    <div className="app-card__ref">Ack / Ref No: <strong>{app.referenceNo}</strong></div>
                  </div>

                  <div className="app-card__meta">
                    <div className="app-card__date"><span>Date Logged:</span> {app.appliedDate}</div>
                    <div className="app-card__date"><span>Last Updated:</span> {app.lastUpdated}</div>
                    {app.notes && <div className="app-card__notes"><span>Note:</span> {app.notes}</div>}
                  </div>

                  {renderTimeline(app.timeline)}

                  <div className="app-card__footer-row">
                    <div className="app-card__status-changer">
                      <span>Update Status:</span>
                      <select 
                        value={app.status} 
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="app-card__status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="app-card__actions">
                      <button className="app-btn-outline" onClick={() => navigate(`/scheme/${app.schemeId}`)}>
                        View Scheme
                      </button>
                      <button className="app-btn-delete" onClick={() => handleDelete(app.id)} title="Delete Application">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="app-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 className="app-empty__title">No Applications Recorded</h3>
              <p className="app-empty__desc">
                Keep track of your real applications! When you apply on an official portal (like NSP, PM-KISAN, or Gram One), record the acknowledgment number here to monitor your progress.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                <button className="app-empty__btn" onClick={() => setShowModal(true)}>
                  ➕ Log Application
                </button>
                <button className="app-btn-outline" style={{ background: 'white' }} onClick={() => navigate('/dashboard')}>
                  Browse Schemes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Logging Application */}
      {showModal && (
        <div className="app-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="app-modal" onClick={e => e.stopPropagation()}>
            <div className="app-modal__header">
              <h3>Log Government Application</h3>
              <button className="app-modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateApplication} className="app-modal__form">
              <div className="app-modal__field">
                <label>Select Applied Scheme *</label>
                <select 
                  value={selectedSchemeId} 
                  onChange={e => setSelectedSchemeId(e.target.value)}
                  required
                >
                  {SCHEMES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="app-modal__field">
                <label>Portal Application / Acknowledgment No. *</label>
                <input 
                  type="text" 
                  placeholder="e.g. NSP-2025-98124 or KA-CSC-4412" 
                  value={customRefNo}
                  onChange={e => setCustomRefNo(e.target.value)}
                  required
                />
                <span className="app-modal__hint">Received from the official portal or CSC Gram One operator</span>
              </div>

              <div className="app-modal__field">
                <label>Current Status</label>
                <select 
                  value={customStatus} 
                  onChange={e => setCustomStatus(e.target.value)}
                >
                  <option value="pending">Pending (Submitted)</option>
                  <option value="under_review">Under Review / Verification</option>
                  <option value="approved">Approved & Sanctioned</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="app-modal__field">
                <label>Notes / Submission Centre (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Biometric done at Tumkur Gram One office" 
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                />
              </div>

              <div className="app-modal__actions">
                <button type="button" className="app-btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="app-empty__btn" style={{ padding: '10px 24px' }}>
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ApplicationsPage