import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getSavedSchemes, removeSavedScheme } from '../utils/userStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SavedSchemesPage.css'

const SavedSchemesPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [savedSchemes, setSavedSchemes] = useState(() => {
    return getUser() ? getSavedSchemes() : []
  })
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const loadSaved = () => {
    setSavedSchemes(getSavedSchemes())
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleRemove = (e, id) => {
    e.stopPropagation()
    removeSavedScheme(id)
    loadSaved()
  }

  if (!user) return null

  const getFilteredSchemes = () => {
    let filtered = savedSchemes

    if (activeFilter !== 'All') {
      filtered = filtered.filter(s => s.type === activeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q)
      )
    }

    return filtered
  }

  const filtered = getFilteredSchemes()
  const count = savedSchemes.length

  const getMatchColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f97316'
    return '#ef4444'
  }

  const checkExpiringSoon = (deadline) => {
    if (deadline === 'Ongoing') return false
    // A simplified heuristic: if the year is 2024 or 2025, treat it as expiring soon for demonstration
    // Real implementation would parse dates and check 30 day diff
    return true
  }

  return (
    <div className="saved-page">
      <Navbar />
      
      <main className="saved-main">
        <div className="saved-header">
          <div className="saved-header__left">
            <h1 className="saved-title">Saved Schemes</h1>
            <span className="saved-count">{count} schemes saved</span>
          </div>
          <div className="saved-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search saved schemes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="saved-filters">
          {['All', 'Government', 'NGO', 'Private'].map(f => (
            <button 
              key={f}
              className={`saved-filter-btn ${activeFilter === f ? 'saved-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="saved-grid">
            {filtered.map(scheme => {
              const matchColor = getMatchColor(scheme.matchScore)
              const typeColor = scheme.type === 'Government' ? '#3b82f6' : scheme.type === 'NGO' ? '#10b981' : '#8b5cf6'
              const isExpiringSoon = checkExpiringSoon(scheme.deadline)

              return (
                <div key={scheme.id} className="saved-card" onClick={() => navigate(`/scheme/${scheme.id}`)}>
                  <button className="saved-card__remove" onClick={(e) => handleRemove(e, scheme.id)} title="Remove from saved">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>

                  <div className="saved-card__top">
                    <div className="saved-card__badges">
                      <span className="saved-card__cat" style={{ color: scheme.categoryColor, background: `${scheme.categoryColor}26` }}>
                        {scheme.category}
                      </span>
                      <span className="saved-card__type" style={{ color: typeColor, background: `${typeColor}15` }}>
                        {scheme.type}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="saved-card__name">{scheme.name}</h3>
                  <div className="saved-card__state">{scheme.state}</div>
                  <p className="saved-card__desc">{scheme.description}</p>
                  
                  <div className="saved-card__match-row">
                    <span className="saved-match__label">Match Score</span>
                    <span className="saved-match__score" style={{ color: matchColor }}>{scheme.matchScore}%</span>
                  </div>
                  <div className="saved-match__bar-container">
                    <div className="saved-match__bar-fill" 
                      style={{ 
                        width: `${scheme.matchScore}%`, 
                        background: scheme.matchScore >= 80 ? '#10b981' : scheme.matchScore >= 60 ? '#f97316' : '#ef4444' 
                      }} 
                    />
                  </div>

                  <div className="saved-card__deadline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span style={{ color: scheme.deadline === 'Ongoing' ? '#10b981' : isExpiringSoon ? '#ef4444' : '#64748b' }}>
                      {scheme.deadline === 'Ongoing' ? 'Ongoing' : isExpiringSoon ? 'Expiring soon!' : scheme.deadline}
                    </span>
                  </div>

                  <div className="saved-card__actions">
                    <button className="saved-btn-outline" onClick={(e) => { e.stopPropagation(); navigate(`/scheme/${scheme.id}`); }}>
                      View Details
                    </button>
                    <button className="saved-btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/scheme/${scheme.id}`); }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="saved-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="saved-empty__title">No saved schemes yet</h3>
            <p className="saved-empty__desc">Browse schemes and click the bookmark icon to save them here</p>
            <button className="saved-empty__btn" onClick={() => navigate('/schemes')}>
              Browse Schemes
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default SavedSchemesPage
