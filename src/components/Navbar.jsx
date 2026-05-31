import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUser, clearUser, getNotifications } from '../utils/userStore'
import './Navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const isSolidNavbar = ['/login', '/register', '/dashboard', '/notifications', '/profile-setup'].includes(location.pathname) || location.pathname.startsWith('/scheme')
  const user = getUser()
  const userEmail = user?.email

  const updateNotifCount = React.useCallback(() => {
    if (!userEmail) return
    const notifs = getNotifications()
    setUnreadCount(notifs.filter(n => !n.read).length)
  }, [userEmail])

  useEffect(() => {
    updateNotifCount()
    window.addEventListener('ns_notifs_updated', updateNotifCount)
    return () => window.removeEventListener('ns_notifs_updated', updateNotifCount)
  }, [updateNotifCount])

  const handleLogout = () => {
    clearUser()
    window.location.href = '/'
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Schemes', href: '/#stats' },
    { label: 'About', href: '/#about' },
  ]

  return (
    <nav className={`navbar ${scrolled || isSolidNavbar ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
              <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
              <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#FF6B00"/>
                  <stop offset="100%" stopColor="#FF8C38"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="navbar__logo-text">
            <span className="logo-namma">Namma</span>
            <span className="logo-seva">Seva</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons / Actions */}
        <div className="navbar__actions">
          {user && (
            <button className="navbar__bell" onClick={() => navigate('/notifications')} aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && <span className="navbar__bell-badge">{unreadCount}</span>}
            </button>
          )}

          {!user ? (
            <>
              <Link to="/login" className="btn btn--ghost" id="nav-login-btn">Login</Link>
              <Link to="/register" className="btn btn--saffron" id="nav-register-btn">
                <span>Register Free</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/dashboard" className="btn btn--saffron" id="nav-dashboard-btn">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn--ghost" style={{ padding: '8px 16px', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>Logout</button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div className="navbar__mobile-actions">
          {user ? (
            <>
              <button className="navbar__bell" onClick={() => { setMenuOpen(false); navigate('/notifications') }} style={{ width: '100%', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Notifications {unreadCount > 0 && <span style={{ background: '#FF6B00', padding: '2px 8px', borderRadius: '100px', fontSize: '12px' }}>{unreadCount} New</span>}
                </span>
              </button>
              <Link to="/dashboard" className="btn btn--saffron" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn--ghost-dark" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost-dark" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn--saffron" onClick={() => setMenuOpen(false)}>Register Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
