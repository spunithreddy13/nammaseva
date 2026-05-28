import { useEffect, useRef, useState } from 'react'
import './StatsSection.css'

const statsData = [
  {
    value: 500,
    suffix: '+',
    label: 'Government Schemes',
    sublabel: 'Across all categories',
    icon: '📋',
    color: '#FF6B00',
    bg: 'rgba(255, 107, 0, 0.08)',
  },
  {
    value: 5,
    suffix: '',
    label: 'States Covered',
    sublabel: 'Karnataka, TN, AP, Telangana, Kerala',
    icon: '🗺️',
    color: '#0B2D6B',
    bg: 'rgba(11, 45, 107, 0.08)',
  },
  {
    value: 10,
    suffix: '+',
    label: 'Scheme Categories',
    sublabel: 'From education to housing',
    icon: '🏷️',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    value: 1200,
    suffix: '+',
    label: 'Citizens Helped',
    sublabel: 'And growing every day',
    icon: '👥',
    color: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.08)',
  },
]

const categories = [
  { icon: '🎓', name: 'Education', count: '68 schemes', color: '#4F46E5' },
  { icon: '🏥', name: 'Healthcare', count: '54 schemes', color: '#059669' },
  { icon: '🌾', name: 'Agriculture', count: '82 schemes', color: '#D97706' },
  { icon: '🏘️', name: 'Housing', count: '37 schemes', color: '#DC2626' },
  { icon: '👩‍💼', name: 'Women', count: '45 schemes', color: '#DB2777' },
  { icon: '👶', name: 'Child Welfare', count: '29 schemes', color: '#0891B2' },
  { icon: '🧓', name: 'Senior Citizens', count: '22 schemes', color: '#7C3AED' },
  { icon: '⚡', name: 'Energy', count: '18 schemes', color: '#65A30D' },
  { icon: '🏭', name: 'Business', count: '48 schemes', color: '#EA580C' },
  { icon: '🎨', name: 'Arts & Culture', count: '14 schemes', color: '#C026D3' },
]

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
          <div className="section-label">Impact & Reach</div>
          <h2 className="section-title">
            Trusted by Thousands of <span className="text-gradient">Citizens</span>
          </h2>
          <p className="section-subtitle">
            Our platform covers schemes from Central and State governments, ensuring comprehensive coverage for every citizen.
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
