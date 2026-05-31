import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getNotifications, markAsRead, markAllAsRead, removeNotification } from '../utils/userStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './NotificationsPage.css'

const ICONS = {
  scheme_match: '✨',
  deadline: '⏰',
  application_update: '📋',
  ngo_scheme: '🌱',
  profile_incomplete: '👤'
}

const COLORS = {
  scheme_match: '#FF6B00',
  deadline: '#ef4444',
  application_update: '#3b82f6',
  ngo_scheme: '#10b981',
  profile_incomplete: '#8b5cf6'
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(() => {
    return getUser() ? getNotifications() : []
  })
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()
  const user = getUser()
  const userEmail = user?.email

  const loadNotifs = React.useCallback(() => {
    setNotifications(getNotifications())
  }, [])

  useEffect(() => {
    if (!userEmail) {
      navigate('/login')
    }
  }, [userEmail, navigate])

  const handleNotifClick = (notif) => {
    if (!notif.read) {
      markAsRead(notif.id)
      loadNotifs()
    }
    navigate(notif.link)
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
    loadNotifs()
  }

  const handleDismiss = (e, id) => {
    e.stopPropagation()
    removeNotification(id)
    loadNotifs()
  }

  const filters = ['All', 'Schemes', 'Deadlines', 'Applications']

  const getFilteredNotifs = () => {
    if (activeFilter === 'All') return notifications
    if (activeFilter === 'Schemes') return notifications.filter(n => n.type === 'scheme_match' || n.type === 'ngo_scheme')
    if (activeFilter === 'Deadlines') return notifications.filter(n => n.type === 'deadline')
    if (activeFilter === 'Applications') return notifications.filter(n => n.type === 'application_update')
    return notifications
  }

  const filteredNotifs = getFilteredNotifs()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notif-page">
      <Navbar />
      
      <main className="notif-main">
        <div className="notif-header">
          <div className="notif-header__left">
            <h1 className="notif-title">Notifications</h1>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount} New</span>}
          </div>
          {unreadCount > 0 && (
            <button className="notif-mark-read" onClick={handleMarkAllRead}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notif-filters">
          {filters.map(f => (
            <button 
              key={f} 
              className={`notif-filter-btn ${activeFilter === f ? 'notif-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map(n => (
              <div 
                key={n.id} 
                className={`notif-card ${!n.read ? 'notif-card--unread' : ''}`}
                onClick={() => handleNotifClick(n)}
              >
                <div className="notif-card__icon" style={{ color: COLORS[n.type], background: `${COLORS[n.type]}15` }}>
                  {ICONS[n.type] || '🔔'}
                </div>
                <div className="notif-card__content">
                  <div className="notif-card__header">
                    <h3 className="notif-card__title">{n.title}</h3>
                    <span className="notif-card__time">{n.timeAgo}</span>
                  </div>
                  <p className="notif-card__desc">{n.description}</p>
                </div>
                {!n.read && <div className="notif-card__dot"></div>}
                <button className="notif-card__dismiss" onClick={(e) => handleDismiss(e, n.id)} aria-label="Dismiss">
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="notif-empty">
              <div className="notif-empty__illustration">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  <circle cx="18" cy="6" r="3" fill="#e2e8f0" stroke="none"></circle>
                </svg>
              </div>
              <h3 className="notif-empty__title">You're all caught up!</h3>
              <p className="notif-empty__desc">There are no {activeFilter.toLowerCase()} notifications at the moment.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default NotificationsPage
