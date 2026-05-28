import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    // On auth pages, always show scrolled style
    if (isAuthPage) setScrolled(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthPage])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Schemes', href: '/#stats' },
    { label: 'About', href: '/#about' },
  ]

  return (
    <nav className={`navbar ${scrolled || isAuthPage ? 'navbar--scrolled' : ''}`}>
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

        {/* CTA Buttons */}
        <div className="navbar__actions">
          <Link to="/login" className="btn btn--ghost" id="nav-login-btn">Login</Link>
          <Link to="/register" className="btn btn--saffron" id="nav-register-btn">
            <span>Register Free</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
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
          <Link to="/login" className="btn btn--ghost-dark" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="btn btn--saffron" onClick={() => setMenuOpen(false)}>Register Free</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
