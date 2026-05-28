import { useEffect, useRef, useState } from 'react'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="8" y="6" width="32" height="36" rx="4" fill="currentColor" opacity="0.1"/>
        <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="24" cy="20" r="7" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="3" fill="currentColor"/>
      </svg>
    ),
    title: 'Create Your Profile',
    description: 'Tell us about yourself — your profession, income, location, family size, and needs. It takes just 3 minutes.',
    color: '#0B2D6B',
    accent: 'rgba(11, 45, 107, 0.1)',
    details: ['Name & Demographics', 'Occupation & Income', 'Location (District/State)', 'Family & Dependents'],
  },
  {
    number: '02',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.1"/>
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="36" cy="12" r="4" fill="currentColor" opacity="0.6"/>
        <path d="M36 8v-2M40 12h2M36 16v2M32 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Get AI Recommendations',
    description: 'Our smart algorithm matches your profile with 500+ schemes and ranks them by relevance and benefit amount.',
    color: '#FF6B00',
    accent: 'rgba(255, 107, 0, 0.1)',
    details: ['Eligibility Analysis', 'Benefit Calculation', 'Priority Ranking', 'Personalized Score'],
  },
  {
    number: '03',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="36" height="28" rx="4" fill="currentColor" opacity="0.1"/>
        <rect x="6" y="8" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 24h20M14 18h12M14 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="38" cy="38" r="8" fill="currentColor"/>
        <path d="M35 38l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Apply for Schemes',
    description: 'Access direct application links, document checklists, and step-by-step guides for each scheme you qualify for.',
    color: '#10B981',
    accent: 'rgba(16, 185, 129, 0.1)',
    details: ['Direct Apply Links', 'Document Checklist', 'Step-by-Step Guide', 'Track Application'],
  },
]

const HowItWorks = () => {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState([false, false, false])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible([true, true, true]), 100)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hiw section" id="how-it-works" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">
            How <span className="text-gradient">NammaSeva</span> Works
          </h2>
          <p className="section-subtitle">
            From signup to scheme application in just three simple steps. No bureaucracy, no confusion.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="hiw__steps">
          {/* Connector Line */}
          <div className="hiw__connector">
            <div className="hiw__connector-line" />
            <div className="hiw__connector-progress" style={{ left: `${activeStep * 50}%` }} />
          </div>

          {steps.map((step, i) => (
            <div
              key={i}
              className={`hiw__step ${visible[i] ? 'hiw__step--visible' : ''} ${activeStep === i ? 'hiw__step--active' : ''}`}
              style={{ transitionDelay: `${i * 0.2}s` }}
              onClick={() => setActiveStep(i)}
            >
              {/* Step Number */}
              <div className="hiw__step-num" style={{ color: step.color }}>
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="hiw__step-icon"
                style={{
                  background: step.accent,
                  color: step.color,
                  boxShadow: activeStep === i ? `0 8px 30px ${step.accent}` : 'none'
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="hiw__step-title">{step.title}</h3>
              <p className="hiw__step-desc">{step.description}</p>

              {/* Detail Pills */}
              <div className="hiw__step-details">
                {step.details.map((detail, j) => (
                  <span key={j} className="hiw__detail-pill" style={{ color: step.color, background: step.accent }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                    {detail}
                  </span>
                ))}
              </div>

              {/* Active Indicator */}
              <div className="hiw__step-indicator" style={{ background: step.color }} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="hiw__cta">
          <div className="hiw__cta-content">
            <div className="hiw__cta-icon">🚀</div>
            <div>
              <h3>Ready to find your schemes?</h3>
              <p>Join 1,200+ citizens who have already discovered their government benefits</p>
            </div>
          </div>
          <a href="#register" className="btn btn--saffron btn--lg" id="hiw-cta-btn">
            Start for Free →
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
