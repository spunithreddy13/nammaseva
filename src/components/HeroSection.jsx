import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeroSection.css'

const HeroSection = () => {
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const particles = Array.from({ length: 18 }, (_, i) => i)

  const badges = [
    { icon: '🏛️', text: 'Karnataka' },
    { icon: '📋', text: '500+ Schemes' },
    { icon: '⚡', text: 'Instant Match' },
  ]

  const floatingCards = [
    { icon: '🎓', title: 'Education', schemes: '42 Schemes', color: '#4F46E5' },
    { icon: '🏥', title: 'Healthcare', schemes: '38 Schemes', color: '#059669' },
    { icon: '🌾', title: 'Agriculture', schemes: '56 Schemes', color: '#D97706' },
    { icon: '🏘️', title: 'Housing', schemes: '29 Schemes', color: '#DC2626' },
  ]

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Animated Particles */}
      <div className="hero__particles">
        {particles.map((i) => (
          <div
            key={i}
            className="hero__particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>

      {/* Background Orbs */}
      <div
        className="hero__orb hero__orb--1"
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
      />
      <div
        className="hero__orb hero__orb--2"
        style={{ transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)` }}
      />
      <div
        className="hero__orb hero__orb--3"
        style={{ transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)` }}
      />

      {/* Grid Pattern */}
      <div className="hero__grid" />

      <div className="hero__container container">
        {/* Left Content */}
        <div className="hero__content">
          {/* Badges */}
          <div className="hero__badges animate-fadeInDown">
            {badges.map((badge, i) => (
              <span key={i} className="hero__badge" style={{ animationDelay: `${i * 0.1}s` }}>
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="hero__headline animate-fadeInUp delay-200">
            Find Government
            <span className="hero__headline-accent">
              <span className="text-shimmer"> Schemes</span>
            </span>
            <br />
            <span className="hero__headline-sub">Made For </span>
            <span className="hero__headline-you">You</span>
          </h1>

          {/* Subtext */}
          <p className="hero__subtext animate-fadeInUp delay-300">
            Your personalized guide to government schemes across{' '}
            <strong>Karnataka and South India</strong>. Answer a few questions and discover
            schemes you qualify for — from education to healthcare, farming to housing.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta animate-fadeInUp delay-400">
            <Link to="/register" className="btn btn--saffron btn--xl hero__btn-primary" id="hero-get-started-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Get Started Free
            </Link>
            <a href="#how-it-works" className="btn btn--ghost btn--xl hero__btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              See How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="hero__trust animate-fadeInUp delay-500">
            <div className="hero__trust-avatars">
              {[1,2,3,4].map(i => (
                <div key={i} className="hero__avatar" style={{ background: `hsl(${i * 60}, 60%, 55%)` }}>
                  {['R','S','P','A'][i-1]}
                </div>
              ))}
            </div>
            <div className="hero__trust-text">
              <span className="hero__trust-count">1,200+</span>
              <span className="hero__trust-label">citizens already benefiting</span>
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-rating">
              <div className="hero__stars">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero__visual animate-fadeInRight delay-300">
          {/* Main Phone Mockup */}
          <div className="hero__phone">
            <div className="hero__phone-inner">
              {/* App Screen */}
              <div className="hero__app-screen">
                <div className="hero__app-header">
                  <div className="hero__app-logo-mini">NS</div>
                  <div>
                    <div className="hero__app-greeting">Namaste, Ravi! 👋</div>
                    <div className="hero__app-sub">3 new schemes available</div>
                  </div>
                  <div className="hero__app-bell">🔔</div>
                </div>

                <div className="hero__app-match">
                  <div className="hero__match-label">Your Match Score</div>
                  <div className="hero__match-score">
                    <div className="hero__match-ring">
                      <svg viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                        <circle cx="40" cy="40" r="32" fill="none" stroke="url(#ringGrad)" strokeWidth="6"
                          strokeDasharray="201" strokeDashoffset="40" strokeLinecap="round"
                          transform="rotate(-90 40 40)"/>
                        <defs>
                          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FF6B00"/>
                            <stop offset="100%" stopColor="#FF8C38"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="hero__match-number">87%</div>
                    </div>
                  </div>
                </div>

                <div className="hero__app-schemes">
                  {floatingCards.map((card, i) => (
                    <div key={i} className="hero__scheme-item" style={{ animationDelay: `${i * 0.15}s` }}>
                      <div className="hero__scheme-icon" style={{ background: card.color + '20', color: card.color }}>
                        {card.icon}
                      </div>
                      <div className="hero__scheme-info">
                        <div className="hero__scheme-name">{card.title}</div>
                        <div className="hero__scheme-count">{card.schemes}</div>
                      </div>
                      <div className="hero__scheme-arrow">→</div>
                    </div>
                  ))}
                </div>

                <div className="hero__app-footer">
                  <div className="hero__app-btn">Apply Now</div>
                  <div className="hero__app-btn hero__app-btn--ghost">View All</div>
                </div>
              </div>
            </div>

            {/* Phone Glow */}
            <div className="hero__phone-glow" />
          </div>

          {/* Floating Badge Cards */}
          <div className="hero__float-badge hero__float-badge--tl animate-float">
            <div className="hero__float-icon">✅</div>
            <div className="hero__float-text">
              <strong>Scheme Matched!</strong>
              <span>PM Fasal Bima Yojana</span>
            </div>
          </div>

          <div className="hero__float-badge hero__float-badge--br animate-float" style={{ animationDelay: '1s' }}>
            <div className="hero__float-icon">🎉</div>
            <div className="hero__float-text">
              <strong>₹2.4L Benefit</strong>
              <span>Agriculture subsidy</span>
            </div>
          </div>

          <div className="hero__float-badge hero__float-badge--bl animate-float" style={{ animationDelay: '2s' }}>
            <div className="hero__float-icon">⚡</div>
            <div className="hero__float-text">
              <strong>3 min quiz</strong>
              <span>to get matched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll animate-bounce">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>

      {/* Wave */}
      <div className="hero__wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z" fill="var(--off-white)"/>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
