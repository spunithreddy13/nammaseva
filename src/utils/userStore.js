/* ─────────────────────────────────────────────
   NammaSeva – Simple localStorage user store
   Persists user auth info and profile data
───────────────────────────────────────────── */

const KEYS = {
  USER:    'ns_user',
  PROFILE: 'ns_profile',
}

/* ── Auth (name + email set at login/register) ── */
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.USER)) || null }
  catch { return null }
}

export const setUser = (data) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(data))
}

/* ── Profile (filled in profile setup wizard) ── */
export const getProfile = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || null }
  catch { return null }
}

export const setProfile = (data) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(data))
}

/* ── Profile completion % ── */
export const getProfileCompletion = () => {
  const p = getProfile()
  if (!p) return 0
  const fields = [
    p.fullName, p.dob, p.gender, p.maritalStatus,
    p.state, p.district, p.language,
    p.caste, p.income, p.occupation,
    p.interests?.length > 0 ? 'yes' : '',
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

/* ── Sign out ── */
export const clearUser = () => {
  localStorage.removeItem(KEYS.USER)
  localStorage.removeItem(KEYS.PROFILE)
}

/* ─────────────────────────────────────────────
   SCHEME ELIGIBILITY MATCHER
   Returns 0-100 match % based on real profile
───────────────────────────────────────────── */

const SCHEME_CRITERIA = {
  1: { // PM-KISAN
    occupations: ['farmer'],
    states: null, // central — all states
    castes: null, // all categories
    incomeMax: '₹5 – 8 Lakhs per year', // up to
    interests: ['agriculture'],
  },
  2: { // Karnataka Raita Siri
    occupations: ['farmer'],
    states: ['Karnataka'],
    castes: null,
    interests: ['agriculture'],
  },
  3: { // NSP Scholarship
    occupations: ['student'],
    states: null,
    castes: ['OBC (Other Backward Class)', 'SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
    interests: ['education'],
  },
  4: { // Ayushman Bharat PMJAY
    occupations: null, // all
    states: null,
    castes: null,
    incomeMax: '₹5 – 8 Lakhs per year',
    interests: ['healthcare'],
  },
  5: { // Gruha Lakshmi
    occupations: null,
    states: ['Karnataka'],
    genders: ['female'],
    interests: ['women'],
  },
  6: { // MUDRA Loan
    occupations: ['business', 'daily', 'other', 'unemployed'],
    states: null,
    castes: null,
    interests: ['business'],
  },
  7: { // PMAY Rural
    occupations: ['farmer', 'daily', 'unemployed'],
    states: null,
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: ['housing'],
  },
  8: { // Anna Bhagya
    occupations: null,
    states: ['Karnataka'],
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: [],
  },
}

const INCOME_ORDER = [
  'Below ₹1 Lakh per year',
  '₹1 – 2.5 Lakhs per year',
  '₹2.5 – 5 Lakhs per year',
  '₹5 – 8 Lakhs per year',
  '₹8 – 12 Lakhs per year',
  'Above ₹12 Lakhs per year',
]

export const calculateMatch = (schemeId, profile) => {
  if (!profile) return null // no profile = no match shown
  const criteria = SCHEME_CRITERIA[schemeId]
  if (!criteria) return null

  let score = 40 // base eligibility
  let factors = 0
  let matched = 0

  // Occupation
  if (criteria.occupations) {
    factors++
    if (criteria.occupations.includes(profile.occupation)) matched++
    else score -= 25 // occupation mismatch is a big deal
  } else {
    score += 10 // open to all occupations → bonus
  }

  // State
  if (criteria.states) {
    factors++
    if (criteria.states.includes(profile.state)) { matched++; score += 20 }
    else { score -= 30 } // state scheme for different state = very low match
  } else {
    score += 8 // central scheme → applies to all
  }

  // Caste
  if (criteria.castes) {
    factors++
    if (criteria.castes.includes(profile.caste)) { matched++; score += 15 }
    else score -= 20
  } else {
    score += 5
  }

  // Gender
  if (criteria.genders) {
    factors++
    if (criteria.genders.includes(profile.gender)) { matched++; score += 15 }
    else score -= 35
  }

  // Income
  if (criteria.incomeMax && profile.income) {
    factors++
    const profileIdx = INCOME_ORDER.indexOf(profile.income)
    const maxIdx = INCOME_ORDER.indexOf(criteria.incomeMax)
    if (profileIdx <= maxIdx) { matched++; score += 10 }
    else score -= 10
  }

  // Interests
  if (criteria.interests?.length > 0 && profile.interests?.length > 0) {
    const interestMatch = criteria.interests.some(i => profile.interests.includes(i))
    if (interestMatch) score += 8
  }

  // Clamp between 5 and 98
  return Math.max(5, Math.min(98, Math.round(score)))
}

/* Overall match score = avg of all scheme matches */
export const getOverallMatchScore = (profile) => {
  if (!profile) return null
  const ids = Object.keys(SCHEME_CRITERIA).map(Number)
  const scores = ids.map(id => calculateMatch(id, profile)).filter(s => s !== null && s > 20)
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
