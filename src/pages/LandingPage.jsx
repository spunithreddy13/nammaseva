import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import StatsSection from '../components/StatsSection'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  )
}

/* Inline CTA Banner Component */
const CTABanner = () => (
  <section className="cta-banner">
    <div className="container">
      <div className="cta-banner__inner">
        {/* Decorative elements */}
        <div className="cta-banner__orb cta-banner__orb--1" />
        <div className="cta-banner__orb cta-banner__orb--2" />

        <div className="cta-banner__content">
          <div className="cta-banner__icon">🇮🇳</div>
          <h2 className="cta-banner__title">
            Don't Miss Out on Benefits You Deserve
          </h2>
          <p className="cta-banner__subtitle">
            The average citizen misses ₹40,000+ in annual government benefits simply because they don't know what they qualify for.
            <strong> NammaSeva changes that.</strong>
          </p>

          <div className="cta-banner__actions">
            <a href="#register" className="btn btn--saffron btn--xl" id="cta-banner-register-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Find My Schemes Now
            </a>
            <a href="#how-it-works" className="btn btn--ghost btn--xl">
              Learn More
            </a>
          </div>

          <div className="cta-banner__features">
            {['Free to use', 'No documents needed to start', '3-minute quiz', 'Instant results'].map((f, i) => (
              <div key={i} className="cta-banner__feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default LandingPage
