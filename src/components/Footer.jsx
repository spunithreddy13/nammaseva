import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const links = {
    Platform: [
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'Browse Schemes', path: '/dashboard' },
      { label: 'Get Recommendations', path: '/profile-setup' },
      { label: 'Track Application', path: '/applications' },
      { label: 'Feedback', path: '/feedback' },
    ],
    Categories: [
      { label: 'Education', path: '/dashboard' },
      { label: 'Healthcare', path: '/dashboard' },
      { label: 'Agriculture', path: '/dashboard' },
      { label: 'Housing', path: '/dashboard' },
      { label: 'Women Empowerment', path: '/dashboard' },
    ],
    States: [
      { label: 'Karnataka', path: '/dashboard' },
      { label: 'Tamil Nadu', path: '/dashboard' },
      { label: 'Andhra Pradesh', path: '/dashboard' },
      { label: 'Telangana', path: '/dashboard' },
      { label: 'Kerala', path: '/dashboard' },
    ],
    Company: [
      { label: 'About Us', path: '/#about' },
      { label: 'Feedback', path: '/feedback' },
      { label: 'Saved Schemes', path: '/saved' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'Contact Us', path: '/feedback' },
    ],
  }

  return (
    <footer className="footer" id="about">
      {/* Top Wave */}
      <div className="footer__wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#071d47"/>
        </svg>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand Column */}
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="url(#fLogoGrad)" />
                    <path d="M20 8L12 14v6l8 6 8-6v-6L20 8z" fill="white" opacity="0.9"/>
                    <path d="M12 20v8l8 4 8-4v-8l-8 6-8-6z" fill="white" opacity="0.6"/>
                    <defs>
                      <linearGradient id="fLogoGrad" x1="0" y1="0" x2="40" y2="40">
                        <stop offset="0%" stopColor="#FF6B00"/>
                        <stop offset="100%" stopColor="#FF8C38"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="footer__logo-text">
                  <span>Namma</span><span className="footer__logo-accent">Seva</span>
                </div>
              </div>
              <p className="footer__tagline">
                Bridging citizens with government schemes through intelligent personalization. 
                Your welfare is our mission.
              </p>

              {/* Newsletter */}
              <div className="footer__newsletter">
                <div className="footer__newsletter-label">Get scheme alerts</div>
                <div className="footer__newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="footer__newsletter-input"
                    id="footer-email-input"
                  />
                  <button className="footer__newsletter-btn" id="footer-subscribe-btn">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social */}
              <div className="footer__socials">
                {[
                  { icon: '𝕏', label: 'Twitter' },
                  { icon: 'in', label: 'LinkedIn' },
                  { icon: 'f', label: 'Facebook' },
                  { icon: '▶', label: 'YouTube' },
                ].map((social, i) => (
                  <a key={i} href="#" className="footer__social-btn" aria-label={social.label}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(links).map(([category, items]) => (
              <div key={category} className="footer__links-col">
                <h4 className="footer__col-title">{category}</h4>
                <ul className="footer__links">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link to={item.path} className="footer__link">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="footer__divider" />

          {/* Bottom Bar */}
          <div className="footer__bottom">
            <div className="footer__bottom-left">
              <span>© {new Date().getFullYear()} NammaSeva. Made with ❤️ in Karnataka, India</span>
            </div>
            <div className="footer__bottom-badges">
              <div className="footer__badge-item">🇮🇳 Government Data Source</div>
              <div className="footer__badge-item">🔒 Secure & Private</div>
              <div className="footer__badge-item">♿ Accessible</div>
            </div>
            <div className="footer__bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
