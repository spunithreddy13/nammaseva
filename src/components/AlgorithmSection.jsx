import React, { useState } from 'react'
import './AlgorithmSection.css'

const AlgorithmSection = () => {
  const [activeTab, setActiveTab] = useState('logic')

  return (
    <section className="algo-section section" id="how-it-works-logic">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Transparent Architecture</div>
          <h2 className="section-title">
            How The <span className="text-gradient">Matching Algorithm</span> Works
          </h2>
          <p className="section-subtitle">
            No black-box guesses and no random recommendations. NammaSeva implements a deterministic, multi-factor eligibility verification engine based on official Government Gazettes.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="algo-tabs">
          <button
            className={`algo-tab-btn ${activeTab === 'logic' ? 'algo-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('logic')}
          >
            ⚖️ 1. Two-Tier Eligibility Logic
          </button>
          <button
            className={`algo-tab-btn ${activeTab === 'scoring' ? 'algo-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('scoring')}
          >
            📊 2. Weighted Scoring Formula
          </button>
          <button
            className={`algo-tab-btn ${activeTab === 'inclusion' ? 'algo-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('inclusion')}
          >
            🌐 3. Rural & Multilingual Accessibility
          </button>
        </div>

        {/* Tab 1: Two-Tier Logic */}
        {activeTab === 'logic' && (
          <div className="algo-content-grid">
            <div className="algo-card algo-card--highlight">
              <div className="algo-card__badge algo-card__badge--red">Tier 1: Hard Disqualification (Zero-Tolerance)</div>
              <h3 className="algo-card__title">Statutory Rule Gatekeeper</h3>
              <p className="algo-card__desc">
                If an applicant fails any statutory legal requirement, the scheme is immediately assigned a <strong>0% Match</strong> and filtered out of recommendations.
              </p>
              <ul className="algo-rules-list">
                <li>
                  <span className="algo-rule-icon">🚫</span>
                  <div>
                    <strong>Caste / Category Reservation:</strong>
                    <span>General category students are not shown SC/ST reserved scholarships (and vice-versa). Open merit schemes remain visible to all.</span>
                  </div>
                </li>
                <li>
                  <span className="algo-rule-icon">🚫</span>
                  <div>
                    <strong>Income Ceiling Check:</strong>
                    <span>If annual family income exceeds the scheme cap (e.g. ₹2.5 Lakh for EWS), the system returns 0% match.</span>
                  </div>
                </li>
                <li>
                  <span className="algo-rule-icon">🚫</span>
                  <div>
                    <strong>Occupation & Gender Prerequisite:</strong>
                    <span>Farmer subsidies (PM-KISAN) require farmer occupation; women-specific initiatives (Gruha Lakshmi) require female applicant status.</span>
                  </div>
                </li>
                <li>
                  <span className="algo-rule-icon">🚫</span>
                  <div>
                    <strong>State Jurisdiction:</strong>
                    <span>State-specific welfare (e.g. Karnataka Raita Siri) is restricted to domiciled residents of that state.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="algo-card">
              <div className="algo-card__badge algo-card__badge--green">Tier 2: Compatibility Scoring</div>
              <h3 className="algo-card__title">Soft Alignment & Prioritization</h3>
              <p className="algo-card__desc">
                Once an applicant passes all statutory barriers, the scheme enters compatibility ranking based on how closely it serves the citizen's immediate needs.
              </p>
              <div className="algo-flowchart">
                <div className="algo-flow-step">
                  <div className="algo-flow-num">Step 1</div>
                  <div className="algo-flow-text">Base Qualification (+40%)</div>
                </div>
                <div className="algo-flow-arrow">↓</div>
                <div className="algo-flow-step">
                  <div className="algo-flow-num">Step 2</div>
                  <div className="algo-flow-text">Demographic & Domicile Bonuses (+35%)</div>
                </div>
                <div className="algo-flow-arrow">↓</div>
                <div className="algo-flow-step">
                  <div className="algo-flow-num">Step 3</div>
                  <div className="algo-flow-text">Interest & Sector Relevance (+10%–20%)</div>
                </div>
                <div className="algo-flow-arrow">↓</div>
                <div className="algo-flow-result">
                  🎯 Final Personal Score: <strong>50% to 98% Match</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scoring Formula */}
        {activeTab === 'scoring' && (
          <div className="algo-content-grid">
            <div className="algo-card">
              <div className="algo-card__badge algo-card__badge--blue">Mathematical Formula</div>
              <h3 className="algo-card__title">Eligibility Formulation</h3>
              <p className="algo-card__desc">
                The overall match score <em>S</em> is computed as a bounded piecewise function:
              </p>
              <div className="algo-code-block">
                <code>
                  {`if (isDisqualified(user, scheme)) {
  Score = 0; // Filtered out of 'For You'
} else {
  Score = 40 (Base)
        + OccupationWeight (15)
        + DomicileWeight (20)
        + CategoryWeight (20)
        + IncomeProximityWeight (15)
        + UserInterestsBonus (10);
  Score = Clamp(Score, 0, 98);
}`}
                </code>
              </div>
              <div className="algo-math-legend">
                <div className="algo-legend-item">
                  <span className="algo-dot algo-dot--green"></span>
                  <span><strong>75%–98% Match:</strong> High Priority & Direct Fit</span>
                </div>
                <div className="algo-legend-item">
                  <span className="algo-dot algo-dot--orange"></span>
                  <span><strong>50%–74% Match:</strong> Moderate Fit (May need specific docs)</span>
                </div>
                <div className="algo-legend-item">
                  <span className="algo-dot algo-dot--red"></span>
                  <span><strong>0%:</strong> Legally Ineligible (Disqualified)</span>
                </div>
              </div>
            </div>

            <div className="algo-card">
              <div className="algo-card__badge algo-card__badge--purple">Audit Trail & Verification</div>
              <h3 className="algo-card__title">100% Direct Official Sources</h3>
              <p className="algo-card__desc">
                NammaSeva acts as an intelligent discovery layer. Every single scheme in the database connects directly to official government endpoints:
              </p>
              <div className="algo-sources-grid">
                <div className="algo-source-item">
                  <span className="algo-source-logo">🇮🇳</span>
                  <div>
                    <strong>scholarships.gov.in</strong>
                    <span>National Scholarship Portal (Central Sector & Pre/Post Matric)</span>
                  </div>
                </div>
                <div className="algo-source-item">
                  <span className="algo-source-logo">🌾</span>
                  <div>
                    <strong>pmkisan.gov.in</strong>
                    <span>Ministry of Agriculture DBT Direct Beneficiary Transfers</span>
                  </div>
                </div>
                <div className="algo-source-item">
                  <span className="algo-source-logo">🏛️</span>
                  <div>
                    <strong>ahara.karnataka.gov.in</strong>
                    <span>Karnataka Food & Civil Supplies Department (Anna Bhagya)</span>
                  </div>
                </div>
                <div className="algo-source-item">
                  <span className="algo-source-logo">💼</span>
                  <div>
                    <strong>mudra.org.in</strong>
                    <span>Pradhan Mantri MUDRA Yojana Micro-Enterprises Portal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rural & Multilingual Inclusion */}
        {activeTab === 'inclusion' && (
          <div className="algo-content-grid">
            <div className="algo-card">
              <div className="algo-card__badge algo-card__badge--green">Academic & Ground Reality</div>
              <h3 className="algo-card__title">Designed for Everyday Indian Citizens</h3>
              <p className="algo-card__desc">
                Government schemes often remain unclaimed not due to lack of need, but because of complex language barriers and complicated eligibility criteria. NammaSeva solves this with three pillars:
              </p>
              <div className="algo-pillars">
                <div className="algo-pillar">
                  <div className="algo-pillar__icon">🗣️</div>
                  <div className="algo-pillar__content">
                    <h4>4 Regional Languages</h4>
                    <p>Instant full-page localized translation in Kannada (ಕನ್ನಡ), Telugu (తెలుగు), Tamil (தமிழ்), and English.</p>
                  </div>
                </div>
                <div className="algo-pillar">
                  <div className="algo-pillar__icon">📁</div>
                  <div className="algo-pillar__content">
                    <h4>Pre-Visit Document Checklist</h4>
                    <p>Interactive checkbox list so citizens know exactly what certificates to take to Gram One, Bangalore One, or CSC kiosks before travelling.</p>
                  </div>
                </div>
                <div className="algo-pillar">
                  <div className="algo-pillar__icon">🚫</div>
                  <div className="algo-pillar__content">
                    <h4>Zero Advertisements & Privacy-First</h4>
                    <p>No ads, no clickbait links, no selling of user phone numbers, and no middlemen asking for commission.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="algo-card">
              <div className="algo-card__badge algo-card__badge--blue">Evaluation & Research Value</div>
              <h3 className="algo-card__title">Answers to Common Review Questions</h3>
              <div className="algo-qa-list">
                <div className="algo-qa-item">
                  <strong>Q: How can non-English speakers use this?</strong>
                  <p>A: One-click native language toggle translates the entire dashboard into regional South Indian scripts with recognizable visual symbols.</p>
                </div>
                <div className="algo-qa-item">
                  <strong>Q: How do you prevent users from applying to wrong schemes?</strong>
                  <p>A: The Tier-1 rule engine immediately disqualifies mismatches on caste, income, and state, avoiding wasted time and application rejections.</p>
                </div>
                <div className="algo-qa-item">
                  <strong>Q: Where is citizen data stored?</strong>
                  <p>A: Client-side local persistence ensures sensitive financial & demographic data never leaves the user's browser without explicit authorization.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AlgorithmSection
