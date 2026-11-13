import { useEffect, useRef, useState } from 'react'
import { SCHEMES } from '../data/schemes'
import './StatsSection.css'

const statsData = [
  {
    value: SCHEMES.length,
    suffix: '+',
    label: 'Verified Schemes',
    sublabel: 'Central, State & Top NGOs',
    icon: '📋',
    color: '#FF6B00',
    bg: 'rgba(255, 107, 0, 0.08)',
  },
  {
    value: 7,
    suffix: '',
    label: 'Welfare Categories',
    sublabel: 'Education, Health, Agriculture & more',
    icon: '🏷️',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    value: 4,
    suffix: '',
    label: 'Native Languages',
    sublabel: 'English, ಕನ್ನಡ, తెలుగు, தமிழ்',
    icon: '🗣️',
    color: '#0B2D6B',
    bg: 'rgba(11, 45, 107, 0.08)',
  },
  {
    value: 100,
    suffix: '%',
    label: 'Free & Direct',
    sublabel: 'Official portals with zero ads',
    icon: '🛡️',
    color: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.08)',
  },
]

const categoryDefs = [
  { icon: '🎓', name: 'Education', key: 'Education', color: '#4F46E5' },
  { icon: '💼', name: 'Business & Startup', key: 'Business', color: '#EA580C' },
  { icon: '🌾', name: 'Agriculture', key: 'Agriculture', color: '#D97706' },
  { icon: '🏥', name: 'Healthcare', key: 'Healthcare', color: '#059669' },
  { icon: '👩‍💼', name: 'Women Empowerment', key: 'Women Empowerment', color: '#DB2777' },
  { icon: '🏘️', name: 'Housing', key: 'Housing', color: '#DC2626' },
  { icon: '🍚', name: 'Food Security', key: 'Food Security', color: '#EA580C' },
]

const categories = categoryDefs.map(cat => ({
  ...cat,
  count: `${SCHEMES.filter(s => s.category === cat.key).length} schemes`
}))

function CountUp({ target, suffix, isVisible }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isVisible, target])

  return (
    <span className="stats__count">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const StatsSection = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats section" id="stats" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Verified Platform Metrics</div>
          <h2 className="section-title">
            Curated For <span className="text-gradient">Real Citizen Impact</span>
          </h2>
          <p className="section-subtitle">
            Every scheme in our database is verified against official Government Gazettes, with direct links to application portals and zero advertisements.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats__grid">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className={`stats__card ${isVisible ? 'stats__card--visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="stats__icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <CountUp target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              <div className="stats__label">{stat.label}</div>
              <div className="stats__sublabel">{stat.sublabel}</div>
              <div className="stats__bar" style={{ background: stat.bg }}>
                <div
                  className="stats__bar-fill"
                  style={{
                    background: stat.color,
                    width: isVisible ? '80%' : '0%',
                    transitionDelay: `${i * 0.15 + 0.5}s`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Categories Marquee */}
        <div className="stats__categories-wrap">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <div className="section-label">Browse Categories</div>
            <h2 className="section-title">
              Schemes For <span className="text-gradient">Every Need</span>
            </h2>
          </div>
          <div className="stats__marquee">
            <div className="stats__marquee-track">
              {[...categories, ...categories].map((cat, i) => (
                <div key={i} className="stats__category-chip" style={{ borderColor: `${cat.color}30` }}>
                  <span className="stats__category-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                    {cat.icon}
                  </span>
                  <div>
                    <div className="stats__category-name">{cat.name}</div>
                    <div className="stats__category-count" style={{ color: cat.color }}>{cat.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* State Coverage Banner */}
        <div className="stats__states">
          <div className="stats__states-label">Currently covering</div>
          {['Karnataka 🏛️', 'Tamil Nadu 🌺', 'Andhra Pradesh 🎭', 'Telangana 🏙️', 'Kerala 🌴'].map((state, i) => (
            <div key={i} className="stats__state-badge">
              {state}
            </div>
          ))}
          <div className="stats__states-more">+ More soon</div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
