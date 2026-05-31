import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../utils/userStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ApplicationsPage.css'

const MOCK_APPLICATIONS = [
  {
    id: 'app_001',
    schemeName: 'Ayushman Bharat PMJAY',
    category: 'Health',
    categoryColor: '#10b981',
    appliedDate: '2024-01-15',
    status: 'approved',
    lastUpdated: '2024-02-01',
    timeline: [
      { step: 'Applied', done: true, date: '15 Jan' },
      { step: 'Under Review', done: true, date: '20 Jan' },
      { step: 'Approved', done: true, date: '1 Feb' }
    ],
    referenceNo: 'NS-2024-001'
  },
  {
    id: 'app_002',
    schemeName: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    categoryColor: '#f59e0b',
    appliedDate: '2024-02-10',
    status: 'pending',
    lastUpdated: '2024-02-10',
    timeline: [
      { step: 'Applied', done: true, date: '10 Feb' },
      { step: 'Under Review', done: false, date: '' },
      { step: 'Decision', done: false, date: '' }
    ],
    referenceNo: 'NS-2024-002'
  },
  {
    id: 'app_003',
    schemeName: 'Karnataka Raita Siri',
    category: 'Agriculture',
    categoryColor: '#f59e0b',
    appliedDate: '2024-01-05',
    status: 'under_review',
    lastUpdated: '2024-01-20',
    timeline: [
      { step: 'Applied', done: true, date: '5 Jan' },
      { step: 'Under Review', done: true, date: '20 Jan' },
      { step: 'Decision', done: false, date: '' }
    ],
    referenceNo: 'NS-2024-003'
  },
  {
    id: 'app_004',
    schemeName: 'Tata Trusts Education Grant',
    category: 'Education',
    categoryColor: '#3b82f6',
    appliedDate: '2023-12-01',
    status: 'rejected',
    lastUpdated: '2024-01-10',
    timeline: [
      { step: 'Applied', done: true, date: '1 Dec' },
      { step: 'Under Review', done: true, date: '15 Dec' },
      { step: 'Rejected', done: true, date: '10 Jan' }
    ],
    referenceNo: 'NS-2023-004'
  }
]

const STATUS_CONFIG = {
  approved:     { label: 'Approved',     color: '#10b981', bg: '#f0fdf4' },
  pending:      { label: 'Pending',      color: '#f59e0b', bg: '#fffbeb' },
  rejected:     { label: 'Rejected',     color: '#ef4444', bg: '#fef2f2' },
  under_review: { label: 'Under Review', color: '#3b82f6', bg: '#eff6ff' }
}

const ApplicationsPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const stats = {
    total: MOCK_APPLICATIONS.length,
    approved: MOCK_APPLICATIONS.filter(a => a.status === 'approved').length,
    pending: MOCK_APPLICATIONS.filter(a => a.status === 'pending').length,
    rejected: MOCK_APPLICATIONS.filter(a => a.status === 'rejected').length
  }

  const filters = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected']

  const getFilteredApps = () => {
    if (activeFilter === 'All') return MOCK_APPLICATIONS
    const match = activeFilter.toLowerCase().replace(' ', '_')
    return MOCK_APPLICATIONS.filter(a => a.status === match)
  }

  const filteredApps = getFilteredApps()

  const renderTimeline = (timeline) => {
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
        <div className="app-header">
          <h1 className="app-title">My Applications</h1>
        </div>

        <div className="app-stats">
          <div className="app-stats__card">
            <div className="app-stats__num">{stats.total}</div>
            <div className="app-stats__label">Total Applied</div>
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
              const conf = STATUS_CONFIG[app.status]
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
                    <div className="app-card__ref">Ref: {app.referenceNo}</div>
                  </div>

                  <div className="app-card__meta">
                    <div className="app-card__date"><span>Applied:</span> {app.appliedDate}</div>
                    <div className="app-card__date"><span>Last Updated:</span> {app.lastUpdated}</div>
                  </div>

                  {renderTimeline(app.timeline)}

                  <div className="app-card__actions">
                    <button className="app-btn-outline" onClick={() => navigate(`/scheme/${parseInt(app.id.split('_')[1], 10)}`)}>
                      View Details
                    </button>
                    <button className="app-btn-primary" onClick={() => window.open('#', '_blank')}>
                      Track on Portal
                    </button>
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
              <h3 className="app-empty__title">No applications found</h3>
              <p className="app-empty__desc">You have no {activeFilter.toLowerCase() === 'all' ? '' : activeFilter.toLowerCase()} applications at the moment.</p>
              <button className="app-empty__btn" onClick={() => navigate('/schemes')}>
                Browse Schemes
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ApplicationsPage
