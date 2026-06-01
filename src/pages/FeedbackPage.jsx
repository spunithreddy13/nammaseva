import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getSavedSchemes } from '../utils/userStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './FeedbackPage.css'

const SCHEME_OPTIONS = [
  'PM-KISAN Samman Nidhi', 
  'Ayushman Bharat PMJAY', 
  'Karnataka Raita Siri', 
  'NSP Scholarship',
  'Tata Trusts Education Grant', 
  'MUDRA Loan Scheme',
  'Gruha Lakshmi', 
  'Infosys Foundation Scholarship'
]

const SCHEME_EXP_TAGS = [
  'Easy to Apply', 'Got the Benefit', 'Documents Were Clear',
  'Process Was Slow', 'Helpful Staff', 'Website Confusing',
  'Would Recommend', 'Need More Info'
]

const APP_EXP_TAGS = [
  'AI Chatbot', 'Scheme Matching', 'Easy Navigation',
  'Language Support', 'Notifications', 'Saved Schemes',
  'Application Tracking', 'Document Checklist'
]

const SCHEME_RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" }
const APP_RATING_LABELS = { 1: "Very Poor", 2: "Poor", 3: "Okay", 4: "Good", 5: "Excellent" }

const FeedbackPage = () => {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // --- SECTION 1 STATE ---
  const [selectedScheme, setSelectedScheme] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [schemeSearch, setSchemeSearch] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setSchemeSearch('')
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  const [schemeRating, setSchemeRating] = useState(0)
  const [schemeHover, setSchemeHover] = useState(0)
  const [schemeTags, setSchemeTags] = useState([])
  const [schemeComment, setSchemeComment] = useState('')
  const [schemeToast, setSchemeToast] = useState(false)

  // --- SECTION 2 STATE ---
  const [appOverall, setAppOverall] = useState(0)
  const [appOverallHover, setAppOverallHover] = useState(0)
  
  const [appEase, setAppEase] = useState(0)
  const [appEaseHover, setAppEaseHover] = useState(0)
  
  const [appRecs, setAppRecs] = useState(0)
  const [appRecsHover, setAppRecsHover] = useState(0)
  
  const [appChatbot, setAppChatbot] = useState(0)
  const [appChatbotHover, setAppChatbotHover] = useState(0)

  const [appTags, setAppTags] = useState([])
  const [appComment, setAppComment] = useState('')
  const [appRecommend, setAppRecommend] = useState('')
  const [appToast, setAppToast] = useState(false)

  if (!user) return null

  // --- HELPERS ---
  const saveToLocalStorage = (type, data) => {
    const existing = JSON.parse(localStorage.getItem('ns_feedback') || '[]')
    existing.push({ type, date: new Date().toISOString(), userId: user.id || 'anonymous', ...data })
    localStorage.setItem('ns_feedback', JSON.stringify(existing))
  }

  const toggleTag = (tag, currentTags, setTags) => {
    if (currentTags.includes(tag)) {
      setTags(currentTags.filter(t => t !== tag))
    } else {
      setTags([...currentTags, tag])
    }
  }

  const renderStars = (rating, hover, setRating, setHover, labels, sizeClass = '') => {
    return (
      <div className="feedback-stars-container">
        <div className="feedback-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`feedback-star ${sizeClass} ${star <= (hover || rating) ? 'feedback-star--filled' : ''}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        {labels && (hover || rating) ? (
          <div className="feedback-star-label">{labels[hover || rating]}</div>
        ) : labels ? (
          <div className="feedback-star-label">&nbsp;</div>
        ) : null}
      </div>
    )
  }

  // --- SUBMITS ---
  const handleSchemeSubmit = () => {
    if (!selectedScheme || schemeRating === 0) return

    saveToLocalStorage('scheme', {
      scheme: selectedScheme,
      rating: schemeRating,
      tags: schemeTags,
      comment: schemeComment
    })

    setSchemeToast(true)
    setTimeout(() => setSchemeToast(false), 3000)

    setSelectedScheme('')
    setSchemeRating(0)
    setSchemeHover(0)
    setSchemeTags([])
    setSchemeComment('')
  }

  const handleAppSubmit = () => {
    if (appOverall === 0) return

    saveToLocalStorage('app', {
      overall: appOverall,
      ease: appEase,
      recommendations: appRecs,
      chatbot: appChatbot,
      tags: appTags,
      comment: appComment,
      recommendToOthers: appRecommend
    })

    setAppToast(true)
    setTimeout(() => setAppToast(false), 3000)

    setAppOverall(0)
    setAppOverallHover(0)
    setAppEase(0)
    setAppRecs(0)
    setAppChatbot(0)
    setAppTags([])
    setAppComment('')
    setAppRecommend('')
  }

  return (
    <div className="feedback-page">
      <Navbar />
      
      <main className="feedback-main">
        {/* SECTION 1: RATE A SCHEME */}
        <section className="feedback-section">
          <div className="feedback-section__header">
            <h2>Rate a Scheme</h2>
            <p>Help others by sharing your experience</p>
          </div>

          <div className="feedback-field" style={{ position: 'relative' }} ref={dropdownRef}>
            <input 
              type="text"
              className="feedback-select"
              placeholder="Search or select a scheme..."
              value={isDropdownOpen ? schemeSearch : selectedScheme}
              onChange={(e) => {
                setSchemeSearch(e.target.value)
                setIsDropdownOpen(true)
                if (!e.target.value) setSelectedScheme('')
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && (
              <div className="feedback-dropdown">
                {SCHEME_OPTIONS.filter(opt => opt.toLowerCase().includes(schemeSearch.toLowerCase())).length > 0 ? (
                  SCHEME_OPTIONS.filter(opt => opt.toLowerCase().includes(schemeSearch.toLowerCase())).map(opt => (
                    <div 
                      key={opt} 
                      className="feedback-dropdown__item"
                      onClick={() => {
                        setSelectedScheme(opt)
                        setSchemeSearch('')
                        setIsDropdownOpen(false)
                      }}
                    >
                      {opt}
                    </div>
                  ))
                ) : (
                  <div className="feedback-dropdown__empty">No schemes found</div>
                )}
              </div>
            )}
          </div>

          <div className="feedback-field">
            {renderStars(schemeRating, schemeHover, setSchemeRating, setSchemeHover, SCHEME_RATING_LABELS)}
          </div>

          <div className="feedback-field">
            <label className="feedback-label">What was your experience?</label>
            <div className="feedback-tags">
              {SCHEME_EXP_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`feedback-tag ${schemeTags.includes(tag) ? 'feedback-tag--selected' : ''}`}
                  onClick={() => toggleTag(tag, schemeTags, setSchemeTags)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-field">
            <label className="feedback-label">Tell us more (optional)</label>
            <textarea
              className="feedback-textarea"
              rows={4}
              placeholder="Share your experience with this scheme..."
              maxLength={500}
              value={schemeComment}
              onChange={(e) => setSchemeComment(e.target.value)}
            />
            <div className="feedback-char-count">{schemeComment.length}/500</div>
          </div>

          <button 
            className="feedback-submit"
            disabled={!selectedScheme || schemeRating === 0}
            onClick={handleSchemeSubmit}
          >
            Submit Scheme Feedback
          </button>
        </section>

        {/* SECTION 2: APP FEEDBACK */}
        <section className="feedback-section">
          <div className="feedback-section__header">
            <h2>How is your NammaSeva experience?</h2>
            <p>Your feedback helps us improve</p>
          </div>

          <div className="feedback-field">
            {renderStars(appOverall, appOverallHover, setAppOverall, setAppOverallHover, APP_RATING_LABELS)}
          </div>

          <div className="feedback-field feedback-categories">
            <div className="feedback-category-row">
              <span>Ease of Use</span>
              {renderStars(appEase, appEaseHover, setAppEase, setAppEaseHover, null, 'feedback-star--mini')}
            </div>
            <div className="feedback-category-row">
              <span>Scheme Recommendations</span>
              {renderStars(appRecs, appRecsHover, setAppRecs, setAppRecsHover, null, 'feedback-star--mini')}
            </div>
            <div className="feedback-category-row">
              <span>AI Chatbot (SevAI)</span>
              {renderStars(appChatbot, appChatbotHover, setAppChatbot, setAppChatbotHover, null, 'feedback-star--mini')}
            </div>
          </div>

          <div className="feedback-field">
            <label className="feedback-label">What do you like most?</label>
            <div className="feedback-tags">
              {APP_EXP_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`feedback-tag ${appTags.includes(tag) ? 'feedback-tag--selected' : ''}`}
                  onClick={() => toggleTag(tag, appTags, setAppTags)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-field">
            <label className="feedback-label">Any suggestions or features you'd like?</label>
            <textarea
              className="feedback-textarea"
              rows={4}
              placeholder="Tell us what would make NammaSeva better..."
              maxLength={500}
              value={appComment}
              onChange={(e) => setAppComment(e.target.value)}
            />
            <div className="feedback-char-count">{appComment.length}/500</div>
          </div>

          <div className="feedback-field">
            <label className="feedback-label">Would you recommend NammaSeva to others?</label>
            <div className="feedback-recommend">
              {[
                { id: 'yes', text: '👍 Yes, definitely' },
                { id: 'maybe', text: '🤔 Maybe' },
                { id: 'no', text: '👎 Not really' }
              ].map(btn => (
                <button
                  key={btn.id}
                  className={`feedback-recommend__btn ${appRecommend === btn.id ? 'feedback-recommend__btn--selected' : ''}`}
                  onClick={() => setAppRecommend(btn.id)}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="feedback-submit"
            disabled={appOverall === 0}
            onClick={handleAppSubmit}
          >
            Submit App Feedback
          </button>
        </section>

      </main>

      <Footer />

      {/* TOASTS */}
      <div className={`feedback-toast ${schemeToast ? 'feedback-toast--visible' : ''}`}>
        ✓ Thank you! Your feedback helps the community
      </div>
      <div className={`feedback-toast ${appToast ? 'feedback-toast--visible' : ''}`} style={{ bottom: appToast ? '30px' : '-100px' }}>
        ✓ Thank you for your feedback! We'll keep improving.
      </div>
    </div>
  )
}

export default FeedbackPage
