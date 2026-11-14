/* ─────────────────────────────────────────────
   NammaSeva – Dual-Layer Storage Architecture
   1. Cloud Layer: Supabase (PostgreSQL Cloud DB)
   2. Offline/Fast Cache Layer: localStorage
───────────────────────────────────────────── */
import { supabase, isSupabaseConfigured } from './supabaseClient'

const KEYS = {
  USER:    'ns_user',
  PROFILE: 'ns_profile',
  NOTIFS:  'ns_notifications',
  SAVED:   'ns_saved_schemes',
  APPLICATIONS: 'ns_applications',
}

/* ── Helper: Normalized Persistent User Key ── */
export const getUserKey = (user) => {
  const u = user || getUser()
  if (!u) return 'default_user'
  const raw = u.email || u.phone || u.id || u.name || 'default_user'
  return String(raw).toLowerCase().trim().replace(/[^a-z0-9]/g, '_')
}

/* ── Auth (name + email set at login/register) ── */
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.USER)) || null }
  catch { return null }
}

export const setUser = (data) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(data))

  // Seamlessly restore this user's profile and tracked records
  const key = getUserKey(data)
  try {
    const userProfileStr = localStorage.getItem(`ns_profile_${key}`) || localStorage.getItem('ns_last_known_profile')
    if (userProfileStr) {
      localStorage.setItem(KEYS.PROFILE, userProfileStr)
    }
    const userSavedStr = localStorage.getItem(`ns_saved_${key}`)
    if (userSavedStr) {
      localStorage.setItem(KEYS.SAVED, userSavedStr)
    }
    const userAppsStr = localStorage.getItem(`ns_apps_${key}`)
    if (userAppsStr) {
      localStorage.setItem(KEYS.APPLICATIONS, userAppsStr)
    }
  } catch (err) {
    console.warn('Could not restore user profile on login:', err)
  }
}

/* ── Profile (filled in profile setup wizard) ── */
export const getProfile = () => {
  try {
    const direct = JSON.parse(localStorage.getItem(KEYS.PROFILE))
    if (direct && Object.keys(direct).length > 0) return direct

    // 1. Look up user-specific profile
    const user = getUser()
    const key = getUserKey(user)
    if (key) {
      const userProfileStr = localStorage.getItem(`ns_profile_${key}`)
      if (userProfileStr) {
        localStorage.setItem(KEYS.PROFILE, userProfileStr)
        return JSON.parse(userProfileStr)
      }
    }

    // 2. Fallback to last known profile on this device
    const lastKnown = localStorage.getItem('ns_last_known_profile')
    if (lastKnown) {
      localStorage.setItem(KEYS.PROFILE, lastKnown)
      return JSON.parse(lastKnown)
    }

    return null
  } catch {
    return null
  }
}

export const setProfile = (data) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(data))

  // Persist permanently per user key + device fallback so logout NEVER erases it
  const user = getUser()
  const key = getUserKey(user)
  if (key) {
    localStorage.setItem(`ns_profile_${key}`, JSON.stringify(data))
  }
  localStorage.setItem('ns_last_known_profile', JSON.stringify(data))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    if (user?.id) {
      supabase.from('profiles').upsert({
        id: user.id,
        full_name: data.fullName,
        dob: data.dob,
        gender: data.gender,
        marital_status: data.maritalStatus,
        state: data.state,
        district: data.district,
        language: data.language,
        caste: data.caste,
        income: data.income,
        occupation: data.occupation,
        interests: data.interests || []
      }).then(({ error }) => {
        if (error) console.warn('Supabase profile sync error:', error)
      })
    }
  }
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
  // Ensure current profile & data are securely preserved under user key before clearing session
  const user = getUser()
  const key = getUserKey(user)
  const currentProfile = getProfile()
  if (currentProfile && key) {
    localStorage.setItem(`ns_profile_${key}`, JSON.stringify(currentProfile))
    localStorage.setItem('ns_last_known_profile', JSON.stringify(currentProfile))
  }
  const currentSaved = localStorage.getItem(KEYS.SAVED)
  if (currentSaved && key) {
    localStorage.setItem(`ns_saved_${key}`, currentSaved)
  }
  const currentApps = localStorage.getItem(KEYS.APPLICATIONS)
  if (currentApps && key) {
    localStorage.setItem(`ns_apps_${key}`, currentApps)
  }

  // Clear session pointers only
  localStorage.removeItem(KEYS.USER)
  localStorage.removeItem(KEYS.NOTIFS)
}

/* ─────────────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────────────── */

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'scheme_match', title: 'New Scheme Match!', description: 'Ayushman Bharat PMJAY perfectly matches your profile.', timeAgo: '2 hours ago', read: false, link: '/scheme/4' },
  { id: 'n2', type: 'deadline', title: 'Deadline Approaching', description: 'Only 3 days left to apply for PM-KISAN Samman Nidhi.', timeAgo: '1 day ago', read: false, link: '/scheme/1' },
  { id: 'n3', type: 'application_update', title: 'Application Update', description: 'Your application for Karnataka Raita Siri is under review.', timeAgo: '2 days ago', read: true, link: '/dashboard' },
  { id: 'n4', type: 'ngo_scheme', title: 'New NGO Scheme Added', description: 'Tata Trusts Education Grant is now available in your state.', timeAgo: '3 days ago', read: true, link: '/scheme/105' },
  { id: 'n5', type: 'profile_incomplete', title: 'Profile Incomplete', description: 'Add your exact annual income to get more accurate scheme matches.', timeAgo: '1 week ago', read: true, link: '/profile-setup' },
]

export const getNotifications = () => {
  try {
    const stored = localStorage.getItem(KEYS.NOTIFS)
    if (stored) return JSON.parse(stored)
    // If no notifications exist, set mock data
    localStorage.setItem(KEYS.NOTIFS, JSON.stringify(MOCK_NOTIFICATIONS))
    return MOCK_NOTIFICATIONS
  } catch {
    return MOCK_NOTIFICATIONS
  }
}

export const markAsRead = (id) => {
  const notifs = getNotifications()
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n)
  localStorage.setItem(KEYS.NOTIFS, JSON.stringify(updated))
  // Dispatch an event so Navbar can update its badge
  window.dispatchEvent(new Event('ns_notifs_updated'))
}

export const markAllAsRead = () => {
  const notifs = getNotifications()
  const updated = notifs.map(n => ({ ...n, read: true }))
  localStorage.setItem(KEYS.NOTIFS, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_notifs_updated'))
}

export const removeNotification = (id) => {
  const notifs = getNotifications()
  const updated = notifs.filter(n => n.id !== id)
  localStorage.setItem(KEYS.NOTIFS, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_notifs_updated'))
}

/* ─────────────────────────────────────────────
   SCHEME ELIGIBILITY MATCHER
   Returns 0-100 match % based on real profile
───────────────────────────────────────────── */

const SCHEME_CRITERIA = {
  1: { // PM-KISAN
    occupations: ['farmer'],
    states: null,
    castes: null, // all categories
    incomeMax: '₹5 – 8 Lakhs per year',
    interests: ['agriculture'],
  },
  2: { // Karnataka Raita Siri
    occupations: ['farmer'],
    states: ['Karnataka'],
    castes: null,
    interests: ['agriculture'],
  },
  3: { // NSP OBC/SC/ST Scholarship
    occupations: ['student'],
    states: null,
    castes: ['OBC (Other Backward Class)', 'SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
    interests: ['education'],
  },
  4: { // Ayushman Bharat PMJAY
    occupations: null,
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
    castes: ['SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: ['housing'],
  },
  8: { // Anna Bhagya
    occupations: null,
    states: ['Karnataka'],
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: ['food'],
  },
  9: { // PM-USP Central Sector Scholarship (Open to General, EWS, OBC, SC, ST)
    occupations: ['student'],
    states: null,
    castes: ['General', 'EWS (Economically Weaker Section)', 'OBC (Other Backward Class)', 'SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
    interests: ['education'],
  },
  10: { // Dr. Ambedkar Post-Matric Scholarship for EWS / General
    occupations: ['student'],
    states: null,
    castes: ['General', 'EWS (Economically Weaker Section)'],
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: ['education'],
  },
  11: { // PM YASASVI OBC Scholarship
    occupations: ['student'],
    states: null,
    castes: ['OBC (Other Backward Class)'],
    incomeMax: '₹2.5 – 5 Lakhs per year',
    interests: ['education'],
  },
  12: { // National Overseas Scholarship for SC / ST
    occupations: ['student'],
    states: null,
    castes: ['SC (Scheduled Caste)', 'ST (Scheduled Tribe)'],
    interests: ['education'],
  },
  // ── Private Schemes ──
  101: { occupations: ['farmer'], states: null, castes: null, interests: ['agriculture'] }, // SBI KCC
  102: { occupations: ['business', 'other', 'daily'], states: null, castes: null, interests: ['business'] }, // HDFC MSME
  103: { occupations: null, states: null, castes: null, interests: ['healthcare'] }, // Star Health
  104: { occupations: ['business', 'other'], states: null, castes: null, interests: ['business'] }, // Startup Seed Fund
  // ── NGO Schemes ──
  105: { occupations: ['student'], states: null, castes: null, interests: ['education'] }, // Tata Trusts (Open to All including General)
  106: { occupations: ['student'], states: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala'], castes: null, interests: ['education'] }, // Infosys Foundation
  107: { occupations: ['farmer', 'business', 'daily', 'other', 'unemployed'], states: null, genders: ['female'], interests: ['business'] }, // Rang De
  108: { occupations: ['student'], states: null, incomeMax: '₹2.5 – 5 Lakhs per year', interests: ['education'] }, // Pratham
  109: { occupations: null, states: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala'], genders: ['female'], interests: ['women'] }, // Grameen MF
  110: { occupations: ['student'], states: ['Karnataka', 'Tamil Nadu', 'Telangana'], castes: null, interests: ['education'] }, // Wipro Cares
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

  // 1. Strict Occupation Check
  if (criteria.occupations && criteria.occupations.length > 0) {
    if (!criteria.occupations.includes(profile.occupation)) {
      return 0 // Disqualified: Wrong occupation
    }
    score += 15
  }

  // 2. Strict Gender Check
  if (criteria.genders && criteria.genders.length > 0) {
    if (!criteria.genders.includes(profile.gender)) {
      return 0 // Disqualified: Wrong gender (e.g. Male for Women-only scheme)
    }
    score += 15
  }

  // 3. Strict Caste / Category Check
  if (criteria.castes && criteria.castes.length > 0) {
    if (!criteria.castes.includes(profile.caste)) {
      return 0 // Disqualified: Scheme is reserved for other caste categories
    }
    score += 20
  } else {
    score += 5 // Open to all castes (including General)
  }

  // 4. Strict State Check
  if (criteria.states && criteria.states.length > 0) {
    if (!criteria.states.includes(profile.state)) {
      return 0 // Disqualified: Scheme is restricted to specific state(s)
    }
    score += 20
  } else {
    score += 10 // Central scheme
  }

  // 5. Income Ceiling Check
  if (criteria.incomeMax && profile.income) {
    const profileIdx = INCOME_ORDER.indexOf(profile.income)
    const maxIdx = INCOME_ORDER.indexOf(criteria.incomeMax)
    if (profileIdx <= maxIdx) {
      score += 15
    } else {
      return 0 // Disqualified: Income exceeds maximum ceiling for this scheme
    }
  }

  // 6. Interest Match Bonus
  if (criteria.interests?.length > 0 && profile.interests?.length > 0) {
    const interestMatch = criteria.interests.some(i => profile.interests.includes(i))
    if (interestMatch) score += 10
  }

  return Math.max(0, Math.min(98, Math.round(score)))
}

/* Overall match score = avg of all scheme matches */
export const getOverallMatchScore = (profile) => {
  if (!profile) return null
  const ids = Object.keys(SCHEME_CRITERIA).map(Number)
  const scores = ids.map(id => calculateMatch(id, profile)).filter(s => s !== null && s > 20)
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/* ─────────────────────────────────────────────
   SAVED SCHEMES
───────────────────────────────────────────── */

const MOCK_SAVED_SCHEMES = [
  {
    id: 4,
    name: 'Ayushman Bharat PMJAY',
    category: 'Health',
    categoryColor: '#10b981',
    type: 'Government',
    matchScore: 92,
    deadline: '31 March 2025',
    savedDate: '2024-01-10',
    description: 'Health coverage up to ₹5 lakh per family per year for secondary and tertiary care.',
    state: 'Central',
  },
  {
    id: 1,
    name: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    categoryColor: '#f59e0b',
    type: 'Government',
    matchScore: 87,
    deadline: 'Ongoing',
    savedDate: '2024-01-15',
    description: '₹6000 per year direct income support to farmer families in three installments.',
    state: 'Central',
  },
  {
    id: 105,
    name: 'Tata Trusts Education Grant',
    category: 'Education',
    categoryColor: '#3b82f6',
    type: 'NGO',
    matchScore: 78,
    deadline: '15 April 2025',
    savedDate: '2024-02-01',
    description: 'Merit-based education grants for underprivileged students across India.',
    state: 'All India',
  },
  {
    id: 6,
    name: 'MUDRA Loan Scheme',
    category: 'Business',
    categoryColor: '#8b5cf6',
    type: 'Government',
    matchScore: 71,
    deadline: 'Ongoing',
    savedDate: '2024-02-10',
    description: 'Loans up to ₹10 lakh for non-corporate small business enterprises.',
    state: 'Central',
  },
]

export const getSavedSchemes = () => {
  try {
    const stored = localStorage.getItem(KEYS.SAVED)
    if (stored !== null) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
    return []
  } catch {
    return []
  }
}

export const saveScheme = (scheme) => {
  const saved = getSavedSchemes()
  const exists = saved.find(s => s.id === scheme.id)
  if (exists) return
  const item = { ...scheme, savedDate: new Date().toISOString().split('T')[0] }
  const updated = [...saved, item]
  localStorage.setItem(KEYS.SAVED, JSON.stringify(updated))
  const key = getUserKey()
  if (key) localStorage.setItem(`ns_saved_${key}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_saved_updated'))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    const user = getUser()
    supabase.from('saved_schemes').upsert({
      id: `saved_${user?.id || 'anon'}_${scheme.id}`,
      user_id: user?.id || null,
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      category: scheme.category,
      category_color: scheme.categoryColor,
      type: scheme.type,
      match_score: scheme.matchScore || 0,
      deadline: scheme.deadline,
      description: scheme.description,
      state: scheme.state
    }).then(({ error }) => {
      if (error) console.warn('Supabase saveScheme error:', error)
    })
  }
}

export const removeSavedScheme = (id) => {
  const saved = getSavedSchemes()
  const updated = saved.filter(s => s.id !== id)
  localStorage.setItem(KEYS.SAVED, JSON.stringify(updated))
  const key = getUserKey()
  if (key) localStorage.setItem(`ns_saved_${key}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_saved_updated'))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    supabase.from('saved_schemes').delete().eq('scheme_id', id).then(({ error }) => {
      if (error) console.warn('Supabase removeSavedScheme error:', error)
    })
  }
}

export const isSchemesSaved = (id) => {
  const saved = getSavedSchemes()
  return saved.some(s => s.id === id)
}

/* ─────────────────────────────────────────────
   REAL APPLICATION TRACKER STORE
───────────────────────────────────────────── */

export const getApplications = () => {
  try {
    const stored = localStorage.getItem(KEYS.APPLICATIONS)
    if (stored !== null) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
    return []
  } catch {
    return []
  }
}

export const saveApplication = (application) => {
  const apps = getApplications()
  const existingIdx = apps.findIndex(a => a.id === application.id || (application.schemeId && a.schemeId === application.schemeId))
  
  let updated
  let appToSync
  if (existingIdx >= 0) {
    updated = [...apps]
    appToSync = {
      ...updated[existingIdx],
      ...application,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    updated[existingIdx] = appToSync
  } else {
    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    appToSync = {
      id: application.id || `app_${Date.now()}`,
      schemeId: application.schemeId,
      schemeName: application.schemeName,
      category: application.category || 'General',
      categoryColor: application.categoryColor || '#4F46E5',
      appliedDate: application.appliedDate || today.toISOString().split('T')[0],
      lastUpdated: today.toISOString().split('T')[0],
      status: application.status || 'pending',
      referenceNo: application.referenceNo || `NS-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timeline: application.timeline || [
        { step: 'Applied', done: true, date: formattedDate },
        { step: 'Under Review', done: false, date: '' },
        { step: 'Decision', done: false, date: '' }
      ],
      notes: application.notes || ''
    }
    updated = [appToSync, ...apps]
  }

  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated))
  const key = getUserKey()
  if (key) localStorage.setItem(`ns_apps_${key}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_apps_updated'))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    const user = getUser()
    supabase.from('applications').upsert({
      id: appToSync.id,
      user_id: user?.id || null,
      scheme_id: appToSync.schemeId,
      scheme_name: appToSync.schemeName,
      category: appToSync.category,
      category_color: appToSync.categoryColor,
      reference_no: appToSync.referenceNo,
      status: appToSync.status,
      applied_date: appToSync.appliedDate,
      last_updated: appToSync.lastUpdated,
      timeline: appToSync.timeline,
      notes: appToSync.notes
    }).then(({ error }) => {
      if (error) console.warn('Supabase saveApplication error:', error)
    })
  }

  return updated
}

export const updateApplicationStatus = (id, newStatus) => {
  const apps = getApplications()
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const updated = apps.map(app => {
    if (app.id !== id) return app
    
    let timeline = [...(app.timeline || [])]
    if (newStatus === 'under_review') {
      timeline = [
        { step: 'Applied', done: true, date: timeline[0]?.date || today },
        { step: 'Under Review', done: true, date: today },
        { step: 'Decision', done: false, date: '' }
      ]
    } else if (newStatus === 'approved') {
      timeline = [
        { step: 'Applied', done: true, date: timeline[0]?.date || today },
        { step: 'Under Review', done: true, date: timeline[1]?.date || today },
        { step: 'Approved', done: true, date: today }
      ]
    } else if (newStatus === 'rejected') {
      timeline = [
        { step: 'Applied', done: true, date: timeline[0]?.date || today },
        { step: 'Under Review', done: true, date: timeline[1]?.date || today },
        { step: 'Rejected', done: true, date: today }
      ]
    } else {
      timeline = [
        { step: 'Applied', done: true, date: timeline[0]?.date || today },
        { step: 'Under Review', done: false, date: '' },
        { step: 'Decision', done: false, date: '' }
      ]
    }

    return {
      ...app,
      status: newStatus,
      timeline,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  })

  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated))
  const key = getUserKey()
  if (key) localStorage.setItem(`ns_apps_${key}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_apps_updated'))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    const updatedApp = updated.find(a => a.id === id)
    if (updatedApp) {
      supabase.from('applications').update({
        status: newStatus,
        timeline: updatedApp.timeline,
        last_updated: updatedApp.lastUpdated
      }).eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase updateApplicationStatus error:', error)
      })
    }
  }

  return updated
}

export const deleteApplication = (id) => {
  const apps = getApplications()
  const updated = apps.filter(a => a.id !== id)
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated))
  const key = getUserKey()
  if (key) localStorage.setItem(`ns_apps_${key}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('ns_apps_updated'))

  // Cloud sync if Supabase is connected
  if (isSupabaseConfigured() && supabase) {
    supabase.from('applications').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase deleteApplication error:', error)
    })
  }

  return updated
}

/* ─────────────────────────────────────────────
   INITIAL SUPABASE CLOUD SYNC
   Pulls down latest cloud records into local cache
───────────────────────────────────────────── */
export const syncWithSupabase = async () => {
  if (!isSupabaseConfigured() || !supabase) return false
  try {
    // 1. Sync applications
    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!appsError && appsData && appsData.length > 0) {
      const mappedApps = appsData.map(a => ({
        id: a.id,
        schemeId: a.scheme_id,
        schemeName: a.scheme_name,
        category: a.category,
        categoryColor: a.category_color,
        referenceNo: a.reference_no,
        status: a.status,
        appliedDate: a.applied_date,
        lastUpdated: a.last_updated,
        timeline: a.timeline,
        notes: a.notes
      }))
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(mappedApps))
      window.dispatchEvent(new Event('ns_apps_updated'))
    }

    // 2. Sync saved schemes
    const { data: savedData, error: savedError } = await supabase
      .from('saved_schemes')
      .select('*')
    
    if (!savedError && savedData && savedData.length > 0) {
      const mappedSaved = savedData.map(s => ({
        id: s.scheme_id,
        name: s.scheme_name,
        category: s.category,
        categoryColor: s.category_color,
        type: s.type,
        matchScore: s.match_score,
        deadline: s.deadline,
        description: s.description,
        state: s.state,
        savedDate: s.saved_date
      }))
      localStorage.setItem(KEYS.SAVED, JSON.stringify(mappedSaved))
      window.dispatchEvent(new Event('ns_saved_updated'))
    }

    return true
  } catch (err) {
    console.warn('Sync with Supabase failed:', err)
    return false
  }
}
