import React from 'react'
import useTranslation from '../hooks/useTranslation'
import './KioskDocumentSlip.css'

export const KioskDocumentSlip = ({ scheme, profile, onClose }) => {
  const { t } = useTranslation()

  if (!scheme) return null

  const handlePrint = () => {
    window.print()
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const slipRef = `NS-CSC-${scheme.id}-${Math.floor(1000 + Math.random() * 9000)}`

  return (
    <div className="kiosk-modal-overlay" onClick={onClose}>
      <div className="kiosk-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="kiosk-modal-header">
          <div className="kiosk-modal-title">
            <span>📑</span>
            <span>Gram One / CSC Citizen Document Slip Preview</span>
          </div>
          <div className="kiosk-modal-actions">
            <button className="kiosk-btn-print" onClick={handlePrint}>
              🖨️ Print / Save as PDF
            </button>
            <button className="kiosk-btn-close" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body / Paper */}
        <div className="kiosk-modal-body">
          <div className="kiosk-paper" id="kiosk-printable-slip">

            {/* Official Header */}
            <div className="kiosk-header">
              <div className="kiosk-header__brand">
                <span className="kiosk-header__logo">🇮🇳</span>
                <div>
                  <h1 className="kiosk-header__title">NAMMASEVA (ನಮ್ಮಸೇವಾ)</h1>
                  <div className="kiosk-header__sub">
                    Direct Citizen Schemes & Verification Desk | Rural Kiosk Facilitation Slip
                  </div>
                </div>
              </div>
              <div className="kiosk-header__meta">
                <div>Date: <strong>{currentDate}</strong></div>
                <div>Ref Slip: <span className="kiosk-header__ref">{slipRef}</span></div>
                <div>Valid for: <strong>Gram One / CSC / MeeSeva</strong></div>
              </div>
            </div>

            {/* Purpose Banner */}
            <div className="kiosk-badge-banner">
              OFFICIAL DOCUMENT VERIFICATION & OPERATOR SUBMISSION ACKNOWLEDGEMENT SLIP
            </div>

            {/* Scheme Metadata */}
            <div className="kiosk-section-title">1. Selected Scheme Particulars</div>
            <div className="kiosk-grid-two">
              <div className="kiosk-field">
                <span className="kiosk-field-label">Scheme Title</span>
                <span className="kiosk-field-val">{scheme.name}</span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">Governing Body / Ministry</span>
                <span className="kiosk-field-val">{scheme.ministry || `${scheme.gov} Government`}</span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">Entitled Financial Benefit</span>
                <span className="kiosk-field-val" style={{ color: '#16a34a', fontWeight: '700' }}>
                  {scheme.benefit}
                </span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">Helpline / Portal</span>
                <span className="kiosk-field-val">{scheme.helpline || '1902'} | {scheme.officialUrl}</span>
              </div>
            </div>

            {/* Citizen Particulars */}
            <div className="kiosk-section-title">2. Citizen / Beneficiary Particulars</div>
            <div className="kiosk-grid-two">
              <div className="kiosk-field">
                <span className="kiosk-field-label">Applicant Name</span>
                <span className="kiosk-field-val">
                  {profile?.name ? profile.name : '__________________________________'}
                </span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">Contact Mobile</span>
                <span className="kiosk-field-val">
                  {profile?.mobile || profile?.phone ? (profile.mobile || profile.phone) : '__________________________________'}
                </span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">District & State</span>
                <span className="kiosk-field-val">
                  {profile?.district ? `${profile.district}, ${profile.state || 'Karnataka'}` : (profile?.state || 'Karnataka, India')}
                </span>
              </div>
              <div className="kiosk-field">
                <span className="kiosk-field-label">Occupation / Category</span>
                <span className="kiosk-field-val">
                  {profile?.occupation ? profile.occupation : 'Citizen Beneficiary'} {profile?.category ? `(${profile.category})` : ''}
                </span>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="kiosk-section-title">3. Required Documents Verification Checklist</div>
            <table className="kiosk-table">
              <thead>
                <tr>
                  <th style={{ width: '38px', textAlign: 'center' }}>#</th>
                  <th>Required Document Name</th>
                  <th style={{ width: '85px', textAlign: 'center' }}>Requirement</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Citizen Ready</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Operator Verified</th>
                </tr>
              </thead>
              <tbody>
                {scheme.documents && scheme.documents.length > 0 ? (
                  scheme.documents.map((doc, idx) => (
                    <tr key={doc.id || idx}>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{idx + 1}</td>
                      <td>
                        <strong>{doc.label}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: doc.required ? '#fee2e2' : '#f1f5f9',
                          color: doc.required ? '#b91c1c' : '#475569'
                        }}>
                          {doc.required ? 'MANDATORY' : 'OPTIONAL'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="kiosk-check-box"></span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="kiosk-check-box"></span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '12px' }}>
                      Standard documents (Aadhaar Card, Bank Passbook, Ration Card) required.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Instructions */}
            <div className="kiosk-instructions">
              <strong>📌 Critical Instructions for Citizen & Kiosk Operator:</strong>
              <ul>
                <li>Citizen must carry original documents and 2 self-attested photocopies to the nearest Gram One / CSC Centre.</li>
                <li>Ensure applicant bank account is Aadhaar-seeded with active NPCI DBT status for electronic benefit transfer.</li>
                <li>The Kiosk Operator must retain a copy of this checklist and issue the Government Portal Acknowledgment Number.</li>
              </ul>
            </div>

            {/* CSC Operator Verification */}
            <div className="kiosk-operator-box">
              <div>
                <div style={{ fontWeight: '700', color: '#0B2D6B', marginBottom: '6px' }}>
                  4. Gram One / CSC Operator Verification
                </div>
                <div style={{ lineHeight: '1.8' }}>
                  Kiosk Operator Name: __________________________________<br/>
                  Gram One / CSC Centre ID: __________________________________<br/>
                  Submission Reference No: __________________________________<br/>
                  Operator Signature: __________________________________
                </div>
              </div>
              <div>
                <div className="kiosk-stamp-box">
                  OFFICIAL KIOSK STAMP / SEAL
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default KioskDocumentSlip
