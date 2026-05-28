import { useState, useEffect, useRef } from 'react'
import './Testimonials.css'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Farmer, Tumkur',
    avatar: 'R',
    avatarColor: '#059669',
    quote: 'NammaSeva helped me discover PM-KISAN and Karnataka Raita Siri schemes I had no idea existed. I received ₹8,000 in my bank account within a month!',
    benefit: '₹8,000 received',
    scheme: 'PM-KISAN + Raita Siri',
    rating: 5,
  },
  {
    name: 'Priya Venkatesh',
    role: 'Student, Bengaluru',
    avatar: 'P',
    avatarColor: '#7C3AED',
    quote: 'As a first-generation college student, I had no guidance on scholarships. NammaSeva matched me with 4 scholarships I qualify for. I applied to all of them!',
    benefit: '4 scholarships',
    scheme: 'NSP + Karnataka Vidya Siri',
    rating: 5,
  },
  {
    name: 'Meena Krishnaswamy',
    role: 'Small Business Owner, Mysuru',
    avatar: 'M',
    avatarColor: '#DC2626',
    quote: 'Getting a government loan seemed impossible before. NammaSeva showed me Mudra Yojana and helped me understand the application process step by step.',
    benefit: '₹5L business loan',
    scheme: 'PMMY - Mudra Yojana',
    rating: 5,
  },
  {
    name: 'Suresh Reddy',
    role: 'Daily Wage Worker, Kalaburagi',
    avatar: 'S',
    avatarColor: '#0891B2',
    quote: 'I was spending hours at govt offices for ration card and pension schemes. NammaSeva told me exactly which office to go to and what documents to bring.',
    benefit: 'Pension + Ration Card',
    scheme: 'NPS + NFSA',
    rating: 5,
  },
  {
    name: 'Anitha Nair',
    role: 'Teacher, Dakshina Kannada',
    avatar: 'A',
    avatarColor: '#D97706',
    quote: 'Within 5 minutes of creating my profile, I had a list of 12 government schemes I qualify for. The recommendations were incredibly accurate for my situation.',
    benefit: '12 schemes matched',
    scheme: 'Various Education Schemes',
    rating: 5,
  },
]

const Testimonials = () => {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActive(prev => (prev + 1) % testimonials.length)
      }, 4000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPaused])

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Success Stories</div>
          <h2 className="section-title">
            Real People, <span className="text-gradient">Real Benefits</span>
          </h2>
          <p className="section-subtitle">
            Thousands of citizens have discovered and applied for schemes that changed their lives.
          </p>
        </div>

        <div
          className="testimonials__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Card */}
          <div className="testimonials__main">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`testimonials__card ${i === active ? 'testimonials__card--active' : i === (active - 1 + testimonials.length) % testimonials.length ? 'testimonials__card--prev' : ''}`}
              >
                {/* Quote Mark */}
                <div className="testimonials__quote-mark">"</div>

                {/* Stars */}
                <div className="testimonials__stars">
                  {'★'.repeat(t.rating)}
                </div>

                {/* Quote */}
                <blockquote className="testimonials__text">
                  {t.quote}
                </blockquote>

                {/* Benefit Tags */}
                <div className="testimonials__tags">
                  <span className="testimonials__tag testimonials__tag--benefit">
                    🎯 {t.benefit}
                  </span>
                  <span className="testimonials__tag testimonials__tag--scheme">
                    📋 {t.scheme}
                  </span>
                </div>

                {/* Author */}
                <div className="testimonials__author">
                  <div
                    className="testimonials__avatar"
                    style={{ background: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="testimonials__name">{t.name}</div>
                    <div className="testimonials__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side Previews */}
          <div className="testimonials__sidebar">
            {testimonials.map((t, i) => (
              <button
                key={i}
                className={`testimonials__thumb ${i === active ? 'testimonials__thumb--active' : ''}`}
                onClick={() => { setActive(i); setIsPaused(true); }}
              >
                <div
                  className="testimonials__thumb-avatar"
                  style={{ background: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div className="testimonials__thumb-info">
                  <div className="testimonials__thumb-name">{t.name}</div>
                  <div className="testimonials__thumb-role">{t.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="testimonials__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonials__dot ${i === active ? 'testimonials__dot--active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
