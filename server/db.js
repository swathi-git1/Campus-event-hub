import crypto from 'node:crypto'
import {
  events as seedEvents,
  clubs as seedClubs,
  instructors as seedInstructors,
  studentAccounts as seedStudentAccounts,
  defaultStudentProfile,
  defaultAdminProfile,
  odInchargeFaculty,
  seedPermissionRequests,
  seedAuditLogs,
  seedRegistrations,
  seedODRecords
} from '../src/data/mockData.js'
import { hashPassword } from './auth.js'
import {
  initMongo,
  isMongoConnected,
  seedMongoIfEmpty,
  syncFromMongo,
  saveToMongo,
  deleteFromMongo,
  getMongoStatus
} from './mongoConnection.js'

// In-Memory Database Collections
let users = []
let events = []
let students = []
let permissionRequests = []
let chapters = []
let auditLogs = []
let campusLinks = []
let notificationDispatches = []
let registrations = []
let odRecords = []
let passwordResetTokens = new Map()

// Configurable Institutional System Settings
let systemSettings = {
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN || 'college.edu',
  requireEmailDomainCheck: true,
  allowRegistration: true,
  institutionName: 'Anna University Campus Hub',
  academicYear: '2026-2027'
}

// Initialize and seed database
function initDatabase() {
  // 1. Seed Users with securely hashed passwords (never stored as plain text)
  const rawUsers = [
    defaultStudentProfile,
    ...seedStudentAccounts.filter(s => s.email !== defaultStudentProfile.email),
    ...seedInstructors,
    odInchargeFaculty,
    { ...defaultAdminProfile, role: 'admin' }
  ]

  users = rawUsers.map(u => {
    const { hash, salt } = hashPassword(u.password || 'password123')
    return {
      ...u,
      id: String(u.id),
      passwordHash: hash,
      passwordSalt: salt,
      password: undefined, // ensure plaintext is scrubbed
      isActive: true,
      preferences: {
        theme: 'light',
        accentColor: 'sandal',
        fontSize: 'medium',
        fontStyle: 'inter',
        language: 'en',
        notifications: {
          email: true,
          whatsapp: true,
          sms: false
        }
      }
    }
  })

  // 2. Seed Students Roster
  students = seedStudentAccounts.map((s, idx) => ({
    id: String(s.id),
    name: s.name,
    rollNo: s.rollNo || `23CS0${80 + idx}`,
    email: s.email,
    dept: s.dept || 'Computer Science & Engineering',
    degree: s.degree || 'B.Tech',
    year: s.year || '3rd Year',
    chapter: s.clubPosition?.club || (idx % 2 === 0 ? 'CSI' : 'IEEE'),
    verificationStatus: idx % 3 === 0 ? 'verified' : idx % 3 === 1 ? 'pending' : 'verified',
    attendanceCount: 4 + (idx * 2),
    avatar: s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
    joinedDate: '2024-08-15'
  }))

  // Ensure Ananya is in students list
  if (!students.some(s => s.email === defaultStudentProfile.email)) {
    students.unshift({
      id: String(defaultStudentProfile.id),
      name: defaultStudentProfile.name,
      rollNo: defaultStudentProfile.rollNo,
      email: defaultStudentProfile.email,
      dept: defaultStudentProfile.dept,
      degree: defaultStudentProfile.degree,
      year: defaultStudentProfile.year,
      chapter: defaultStudentProfile.clubPosition?.club || 'CSI',
      verificationStatus: 'verified',
      attendanceCount: 12,
      avatar: defaultStudentProfile.avatar,
      joinedDate: '2023-09-01'
    })
  }

  // 3. Seed Events
  events = seedEvents.map(e => ({
    ...e,
    id: String(e.id),
    status: e.status || (new Date(e.date) > new Date() ? 'upcoming' : 'completed'),
    registered: e.registered || 120,
    capacity: e.capacity || 200,
    createdAt: e.createdAt || '2026-08-01T10:00:00.000Z'
  }))

  // 4. Seed Chapters
  chapters = seedClubs.map(c => ({
    ...c,
    id: String(c.id || c.name.toLowerCase()),
    memberCount: c.members || (c.studentTeam ? c.studentTeam.length : 35),
    eventsCount: events.filter(e => e.club === c.name).length
  }))

  // 5. Seed Permission Requests
  permissionRequests = (seedPermissionRequests || []).map((pr, idx) => ({
    ...pr,
    id: String(pr.id || `pr_${1000 + idx}`),
    status: pr.status || (idx % 3 === 0 ? 'approved' : idx % 3 === 1 ? 'pending' : 'under_review'),
    createdAt: pr.createdAt || new Date(Date.now() - idx * 86400000).toISOString()
  }))

  // 6. Seed Audit Logs
  auditLogs = [...(seedAuditLogs || [])]

  // 7. Seed Multi-Linker campus links
  campusLinks = [
    {
      id: 'link_1',
      title: 'University LMS & Courseware',
      url: 'https://lms.college.edu/courses',
      category: 'Academic & LMS',
      description: 'Access lecture notes, assignment dropboxes, syllabus blueprints, and semester lab manuals.',
      icon: '📚',
      createdBy: 'admin@college.edu',
      createdAt: '2026-08-01T10:00:00Z',
      isOfficial: true
    },
    {
      id: 'link_2',
      title: 'CSI Student Chapter GitHub Hub',
      url: 'https://github.com/csi-college-chapter',
      category: 'Club Portals & Repositories',
      description: 'Open source projects, starter boilerplate templates, hackathon starter kits, and workshop code.',
      icon: '💻',
      createdBy: 'csi.advisor@college.edu',
      createdAt: '2026-08-10T11:00:00Z',
      isOfficial: true
    },
    {
      id: 'link_3',
      title: 'National Smart India Hackathon Portal',
      url: 'https://sih.gov.in',
      category: 'Hackathon & Contests',
      description: 'Official problem statements, hardware/software challenge submissions, and OD verification requirements.',
      icon: '🏆',
      createdBy: 'od.faculty@college.edu',
      createdAt: '2026-08-15T09:00:00Z',
      isOfficial: true
    },
    {
      id: 'link_4',
      title: 'Controller of Examinations (CoE) Portal',
      url: 'https://coe.college.edu/hall-tickets',
      category: 'Institutional Portals',
      description: 'Semester examination schedules, internal assessment mark entry, and hall ticket downloads.',
      icon: '🏛️',
      createdBy: 'admin@college.edu',
      createdAt: '2026-08-12T14:30:00Z',
      isOfficial: true
    },
    {
      id: 'link_5',
      title: 'IEEE Xplore Digital Research Library',
      url: 'https://ieeexplore.ieee.org',
      category: 'Research & Publication',
      description: 'Institutional access to peer-reviewed IEEE conference proceedings, journals, and technical standards.',
      icon: '🔬',
      createdBy: 'csi.advisor@college.edu',
      createdAt: '2026-08-18T16:00:00Z',
      isOfficial: true
    },
    {
      id: 'link_6',
      title: 'Unstop Inter-College Tech Competitions',
      url: 'https://unstop.com/competitions',
      category: 'Hackathon & Contests',
      description: 'Pan-India technical symposiums, coding challenges, project expos, and national-level collegiate hackathons.',
      icon: '🚀',
      createdBy: 'student@college.edu',
      createdAt: '2026-08-20T12:00:00Z',
      isOfficial: false
    },
    {
      id: 'link_7',
      title: 'College Digital Repository & Library OPAC',
      url: 'https://library.college.edu/catalog',
      category: 'Academic & LMS',
      description: 'Search institutional library book stacks, IEEE/Springer subscriptions, and past university question papers.',
      icon: '📖',
      createdBy: 'admin@college.edu',
      createdAt: '2026-08-22T08:00:00Z',
      isOfficial: true
    },
    {
      id: 'link_8',
      title: 'University Scholarship & Aid Disbursement Portal',
      url: 'https://scholarships.gov.in',
      category: 'Institutional Portals',
      description: 'National and state merit-cum-means scholarships, fee concession forms, and bonafide certificate verification.',
      icon: '🎓',
      createdBy: 'admin@college.edu',
      createdAt: '2026-08-25T11:20:00Z',
      isOfficial: true
    }
  ]

  // 8. Seed Notification Dispatches
  notificationDispatches = [
    {
      id: 'notif_1',
      recipientEmail: 'student@college.edu',
      recipientPhone: '+91 98765 43210',
      channel: 'email',
      type: 'registration_confirmation',
      title: 'Institutional Portal Registration Confirmed',
      message: 'Welcome Ananya Rao to Campus Event Hub. Your institutional SSO profile is active.',
      status: 'delivered',
      timestamp: '2026-08-01T10:00:00Z'
    },
    {
      id: 'notif_2',
      recipientEmail: 'student@college.edu',
      recipientPhone: '+91 98765 43210',
      channel: 'whatsapp',
      type: 'od_approval_alert',
      title: 'OD Clearance Sanctioned - Hackathon 2026',
      message: '[CEH_OD_APPROVED_V1] Dear Ananya Rao, your On-Duty request OD-2026-9041 has been approved by Chief OD In-Charge Prof. Meenakshi Sundaram.',
      status: 'delivered',
      timestamp: '2026-08-14T11:30:00Z'
    },
    {
      id: 'notif_3',
      recipientEmail: 'kavitha.ramesh@college.edu',
      recipientPhone: '+91 94444 12345',
      channel: 'sms',
      type: 'event_reminder',
      title: 'Event Reminder: HackElite 2026 Check-in',
      message: 'Reminder: HackElite 2026 begins tomorrow at 09:00 AM at Turing Hall. Keep your digital pass ready.',
      status: 'delivered',
      timestamp: '2026-08-15T08:00:00Z'
    }
  ]

  // 9. Seed Registrations
  registrations = (seedRegistrations || []).map((r, idx) => ({
    ...r,
    id: String(r.id || `reg_${1000 + idx}`),
    attended: Boolean(r.attended),
    attendedAt: r.attendedAt || null,
    checkinMethod: r.checkinMethod || null
  }))

  // 10. Seed Official OD Records
  odRecords = (seedODRecords || []).map((od, idx) => ({
    ...od,
    id: String(od.id || `OD-2026-${1000 + idx}`),
    status: od.status || 'Active / Verified',
    issuedAt: od.issuedAt || new Date().toISOString()
  }))
}

initDatabase()

// Asynchronously bootstrap MongoDB Compass synchronization
async function bootstrapMongoSync() {
  try {
    const mongoDb = await initMongo()
    if (mongoDb) {
      const synced = await syncFromMongo()
      if (synced && synced.users && synced.users.length > 0) {
        if (synced.users?.length) users = synced.users
        if (synced.events?.length) events = synced.events
        if (synced.students?.length) students = synced.students
        if (synced.permissionRequests?.length) permissionRequests = synced.permissionRequests
        if (synced.odRecords?.length) odRecords = synced.odRecords
        if (synced.registrations?.length) registrations = synced.registrations
        if (synced.chapters?.length) chapters = synced.chapters
        if (synced.campusLinks?.length) campusLinks = synced.campusLinks
        if (synced.notificationDispatches?.length) notificationDispatches = synced.notificationDispatches
        if (synced.auditLogs?.length) auditLogs = synced.auditLogs
        if (synced.systemSettings) systemSettings = synced.systemSettings
        console.log(`[MongoDB Compass] Loaded existing database records into memory.`)
      } else {
        await seedMongoIfEmpty({
          users,
          events,
          students,
          permissionRequests,
          odRecords,
          registrations,
          chapters,
          campusLinks,
          notificationDispatches,
          auditLogs,
          systemSettings
        })
      }
    }
  } catch (err) {
    console.warn('[MongoDB Compass] Initialization fallback:', err.message)
  }
}

bootstrapMongoSync()

// --- USER OPERATIONS ---
export function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase())
}

export function findUserById(id) {
  return users.find(u => String(u.id) === String(id))
}

export function createUser(userData) {
  const { hash, salt } = hashPassword(userData.password || 'password123')
  const newUser = {
    ...userData,
    id: String(Date.now()),
    passwordHash: hash,
    passwordSalt: salt,
    password: undefined,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  saveToMongo('users', { id: newUser.id }, newUser, true)
  
  if (userData.role === 'student') {
    const newStudent = {
      id: newUser.id,
      name: newUser.name,
      rollNo: userData.rollNo || `23CS${Math.floor(100 + Math.random() * 900)}`,
      email: newUser.email,
      dept: userData.dept || 'Computer Science & Engineering',
      degree: userData.degree || 'B.Tech',
      year: userData.year || '1st Year',
      chapter: userData.chapter || 'None',
      verificationStatus: 'pending',
      attendanceCount: 0,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
      joinedDate: new Date().toISOString().split('T')[0]
    }
    students.push(newStudent)
    saveToMongo('students', { id: newStudent.id }, newStudent, true)
  }
  return newUser
}

// --- QUERY EVENTS (Search, Filter, Sort, Paginate) ---
export function queryEvents({
  search = '',
  category = '',
  chapter = '',
  status = '',
  venue = '',
  organizer = '',
  sort = 'date_asc',
  page = 1,
  pageSize = 10
} = {}) {
  let list = [...events]

  // Search by name, description, chapter/club, organizer, venue, category
  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(e =>
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.desc && e.desc.toLowerCase().includes(q)) ||
      (e.club && e.club.toLowerCase().includes(q)) ||
      (e.organizer && e.organizer.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q))
    )
  }

  // Filters
  if (category && category !== 'all') {
    list = list.filter(e => (e.category || '').toLowerCase() === category.toLowerCase())
  }
  if (chapter && chapter !== 'all') {
    list = list.filter(e => (e.club || '').toLowerCase() === chapter.toLowerCase())
  }
  if (status && status !== 'all') {
    list = list.filter(e => (e.status || '').toLowerCase() === status.toLowerCase())
  }
  if (venue && venue !== 'all') {
    list = list.filter(e => (e.venue || '').toLowerCase().includes(venue.toLowerCase()))
  }
  if (organizer && organizer !== 'all') {
    list = list.filter(e => (e.organizer || '').toLowerCase().includes(organizer.toLowerCase()))
  }

  // Sorting
  switch (sort) {
    case 'name_asc':
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'name_desc':
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      break
    case 'date_asc':
      list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
      break
    case 'date_desc':
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      break
    case 'attendees_desc':
      list.sort((a, b) => (b.registered || 0) - (a.registered || 0))
      break
    case 'attendees_asc':
      list.sort((a, b) => (a.registered || 0) - (b.registered || 0))
      break
    case 'created_desc':
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
    default:
      list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
  }

  // Pagination
  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function getEventById(id) {
  return events.find(e => String(e.id) === String(id))
}

export function createEvent(eventData, authorUser) {
  const newEvent = {
    ...eventData,
    id: `ev_${Date.now()}`,
    registered: 0,
    status: 'upcoming',
    createdBy: authorUser ? authorUser.email : 'system',
    createdAt: new Date().toISOString()
  }
  events.unshift(newEvent)
  saveToMongo('events', { id: newEvent.id }, newEvent, true)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'EVENT_CREATED',
    user: authorUser ? authorUser.email : 'system',
    details: `Created event "${newEvent.title}" (${newEvent.club})`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return newEvent
}

export function updateEvent(id, updateData, user) {
  const index = events.findIndex(e => String(e.id) === String(id))
  if (index === -1) return null
  events[index] = { ...events[index], ...updateData, updatedAt: new Date().toISOString() }
  saveToMongo('events', { id }, events[index])
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'EVENT_UPDATED',
    user: user ? user.email : 'system',
    details: `Updated event "${events[index].title}"`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return events[index]
}

export function deleteEvent(id, user) {
  const index = events.findIndex(e => String(e.id) === String(id))
  if (index === -1) return false
  const title = events[index].title
  events.splice(index, 1)
  deleteFromMongo('events', { id })
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'EVENT_DELETED',
    user: user ? user.email : 'system',
    details: `Deleted event "${title}"`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return true
}

// --- QUERY STUDENTS (Protected: Advisor, OD In-Charge, Admin) ---
export function queryStudents({
  search = '',
  dept = '',
  chapter = '',
  year = '',
  status = '',
  sort = 'name_asc',
  page = 1,
  pageSize = 10
} = {}) {
  let list = [...students]

  // Search student name, ID / rollNo, college email, department, chapter/club
  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.dept && s.dept.toLowerCase().includes(q)) ||
      (s.chapter && s.chapter.toLowerCase().includes(q))
    )
  }

  // Filters
  if (dept && dept !== 'all') {
    list = list.filter(s => (s.dept || '').toLowerCase() === dept.toLowerCase())
  }
  if (chapter && chapter !== 'all') {
    list = list.filter(s => (s.chapter || '').toLowerCase() === chapter.toLowerCase())
  }
  if (year && year !== 'all') {
    list = list.filter(s => (s.year || '').toLowerCase() === year.toLowerCase())
  }
  if (status && status !== 'all') {
    list = list.filter(s => (s.verificationStatus || '').toLowerCase() === status.toLowerCase())
  }

  // Sorting
  switch (sort) {
    case 'name_asc':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      list.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'attendance_desc':
      list.sort((a, b) => (b.attendanceCount || 0) - (a.attendanceCount || 0))
      break
    case 'attendance_asc':
      list.sort((a, b) => (a.attendanceCount || 0) - (b.attendanceCount || 0))
      break
    case 'status':
      list.sort((a, b) => a.verificationStatus.localeCompare(b.verificationStatus))
      break
    default:
      list.sort((a, b) => a.name.localeCompare(b.name))
  }

  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function getStudentById(id) {
  return students.find(s => String(s.id) === String(id))
}

// --- QUERY PERMISSION / OD REQUESTS ---
export function queryPermissionRequests({
  search = '',
  status = '',
  dateRange = '',
  event = '',
  student = '',
  chapter = '',
  sort = 'created_desc',
  page = 1,
  pageSize = 10,
  currentUser = null
} = {}) {
  let list = [...permissionRequests]

  // Role authorization filter:
  // Students may ONLY see their own requests!
  if (currentUser && currentUser.role === 'student') {
    list = list.filter(pr =>
      (pr.studentEmail && pr.studentEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (pr.studentId && String(pr.studentId) === String(currentUser.id)) ||
      (pr.studentName && pr.studentName.toLowerCase() === (currentUser.name || '').toLowerCase())
    )
  } else if (currentUser && currentUser.role === 'instructor') {
    // Club advisors see requests for their assigned club
    if (currentUser.assignedClub) {
      list = list.filter(pr => (pr.club || pr.chapter || '').toLowerCase() === currentUser.assignedClub.toLowerCase())
    }
  }

  // Search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(pr =>
      (pr.studentName && pr.studentName.toLowerCase().includes(q)) ||
      (pr.rollNo && pr.rollNo.toLowerCase().includes(q)) ||
      (pr.eventTitle && pr.eventTitle.toLowerCase().includes(q)) ||
      (pr.eventName && pr.eventName.toLowerCase().includes(q)) ||
      (pr.dept && pr.dept.toLowerCase().includes(q)) ||
      (pr.purpose && pr.purpose.toLowerCase().includes(q))
    )
  }

  // Filters
  if (status && status !== 'all') {
    list = list.filter(pr => (pr.status || '').toLowerCase() === status.toLowerCase())
  }
  if (event && event !== 'all') {
    list = list.filter(pr => (pr.eventTitle || pr.eventName || '').toLowerCase().includes(event.toLowerCase()))
  }
  if (student && student !== 'all') {
    list = list.filter(pr => (pr.studentName || '').toLowerCase().includes(student.toLowerCase()))
  }
  if (chapter && chapter !== 'all') {
    list = list.filter(pr => (pr.club || pr.chapter || '').toLowerCase() === chapter.toLowerCase())
  }

  // Sorting
  switch (sort) {
    case 'name_asc':
      list.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
      break
    case 'name_desc':
      list.sort((a, b) => (b.studentName || '').localeCompare(a.studentName || ''))
      break
    case 'date_asc':
      list.sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0))
      break
    case 'date_desc':
      list.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
      break
    case 'status':
      list.sort((a, b) => (a.status || '').localeCompare(b.status || ''))
      break
    case 'created_asc':
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      break
    default:
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }

  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function getPermissionRequestById(id) {
  return permissionRequests.find(pr => String(pr.id) === String(id))
}

export function createPermissionRequest(requestData, currentUser) {
  const newReq = {
    ...requestData,
    id: `pr_${Date.now()}`,
    studentId: currentUser ? currentUser.id : requestData.studentId,
    studentName: currentUser ? currentUser.name : requestData.studentName,
    studentEmail: currentUser ? currentUser.email : requestData.studentEmail,
    rollNo: currentUser ? (currentUser.rollNo || '23CS082') : (requestData.rollNo || '23CS082'),
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  permissionRequests.unshift(newReq)
  saveToMongo('permission_requests', { id: newReq.id }, newReq, true)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'OD_REQUEST_SUBMITTED',
    user: currentUser ? currentUser.email : 'student',
    details: `Submitted OD request for event "${newReq.eventTitle || newReq.eventName}"`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return newReq
}

export function approvePermissionRequest(id, remarks, approver) {
  const req = permissionRequests.find(pr => String(pr.id) === String(id))
  if (!req) return null
  req.status = 'approved'
  req.approvedBy = approver ? approver.name : 'OD In-Charge'
  req.approvedAt = new Date().toISOString()
  req.officialPassNumber = `OD-2026-PASS-${Math.floor(100000 + Math.random() * 900000)}`
  req.remarks = remarks || 'Verified and approved for official college attendance.'
  
  saveToMongo('permission_requests', { id }, req)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'OD_REQUEST_APPROVED',
    user: approver ? approver.email : 'od.incharge',
    details: `Approved OD pass ${req.officialPassNumber} for student ${req.studentName}`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  // MULTI-CHANNEL DISPATCH: WhatsApp, SMS, Email to student contact details
  const phone = req.phone || '+91 98765 43210'
  const eventTitle = req.eventName || req.eventTitle || 'Campus Event'
  const approverName = req.approvedBy || 'OD In-Charge'

  // 1. WhatsApp Notification
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'whatsapp',
    type: 'od_approval_alert',
    title: `OD Request Approved: ${eventTitle}`,
    message: `🎉 Great news ${req.studentName}! Your OD request for "${eventTitle}" has been APPROVED by ${approverName}.\n\n📋 Pass Number: ${req.officialPassNumber}\n📝 Remarks: ${req.remarks}\n\nYour attendance exemption has been sanctioned in the system.`,
    status: 'delivered'
  })

  // 2. SMS Notification
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'sms',
    type: 'od_approval_alert',
    title: `SMS Alert: OD Approved (${req.officialPassNumber})`,
    message: `CEH ALERT: OD Request for ${eventTitle} is APPROVED by ${approverName}. Pass #${req.officialPassNumber}. Please download from student portal.`,
    status: 'delivered'
  })

  // 3. Email Notification
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'email',
    type: 'od_approval_alert',
    title: `Official Clearance Sanctioned - OD Pass #${req.officialPassNumber}`,
    message: `Dear ${req.studentName} (${req.rollNo || 'Student'}),\n\nYour official on-duty request for "${eventTitle}" scheduled on ${req.eventDate || req.date || 'upcoming dates'} has been reviewed and APPROVED by ${approverName}.\n\nOfficial Pass Number: ${req.officialPassNumber}\nRemarks: ${req.remarks}\n\nYour academic attendance credit will be applied accordingly.\n\nInstitutional Event & OD Cell`,
    status: 'delivered'
  })

  return req
}

export function rejectPermissionRequest(id, reason, rejector) {
  const req = permissionRequests.find(pr => String(pr.id) === String(id))
  if (!req) return null
  req.status = 'rejected'
  req.rejectedBy = rejector ? rejector.name : 'OD In-Charge'
  req.rejectedAt = new Date().toISOString()
  req.rejectionReason = reason || 'Request details incomplete or does not meet OD eligibility guidelines.'
  
  saveToMongo('permission_requests', { id }, req)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'OD_REQUEST_REJECTED',
    user: rejector ? rejector.email : 'od.incharge',
    details: `Rejected OD request for ${req.studentName}: ${reason}`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  const phone = req.phone || '+91 98765 43210'
  const eventTitle = req.eventName || req.eventTitle || 'Campus Event'
  const rejectorName = req.rejectedBy || 'OD In-Charge'

  // WhatsApp Alert
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'whatsapp',
    type: 'od_rejection_alert',
    title: `OD Request Update: ${eventTitle}`,
    message: `⚠️ Hello ${req.studentName}. Your OD request for "${eventTitle}" was not approved by ${rejectorName}.\n\nReason: ${req.rejectionReason}\n\nPlease consult your faculty advisor if you have questions.`,
    status: 'delivered'
  })

  // SMS Alert
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'sms',
    type: 'od_rejection_alert',
    title: `SMS Alert: OD Request Rejected`,
    message: `CEH ALERT: OD request for ${eventTitle} was not approved by ${rejectorName}. Reason: ${req.rejectionReason}`,
    status: 'delivered'
  })

  // Email Alert
  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'email',
    type: 'od_rejection_alert',
    title: `Notice: Event OD Request Not Approved - ${eventTitle}`,
    message: `Dear ${req.studentName},\n\nYour OD permission request for "${eventTitle}" could not be approved at this time.\n\nReviewed by: ${rejectorName}\nReason: ${req.rejectionReason}\n\nInstitutional Event & OD Cell`,
    status: 'delivered'
  })

  return req
}

// =========================================================================
// OD STATUS LIFECYCLE (8 STATES) & TRANSITIONS
// NOT_REQUESTED -> PENDING -> APPROVED -> REJECTED -> EVENT_ATTENDED ->
// CERTIFICATE_PENDING -> UNDER_VERIFICATION -> OD_ISSUED
// =========================================================================
export const OD_STATUSES = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EVENT_ATTENDED: 'EVENT_ATTENDED',
  CERTIFICATE_PENDING: 'CERTIFICATE_PENDING',
  UNDER_VERIFICATION: 'UNDER_VERIFICATION',
  OD_ISSUED: 'OD_ISSUED'
}

export function normalizeODStatus(status) {
  if (!status) return OD_STATUSES.NOT_REQUESTED
  const s = String(status).trim().toUpperCase().replace(/[\s-]/g, '_')
  if (OD_STATUSES[s]) return OD_STATUSES[s]
  if (s.includes('PENDING_APPROVAL') || s === 'PENDING') return OD_STATUSES.PENDING
  if (s === 'APPROVED') return OD_STATUSES.APPROVED
  if (s === 'REJECTED' || s.includes('PROOF_REJECTED')) return OD_STATUSES.REJECTED
  if (s.includes('ATTEND')) return OD_STATUSES.EVENT_ATTENDED
  if (s.includes('CERTIFICATE') || s.includes('PROOF_PENDING')) return OD_STATUSES.CERTIFICATE_PENDING
  if (s.includes('SUBMITTED') || s.includes('UNDER_VERIFICATION') || s.includes('PROOF_SUBMITTED')) return OD_STATUSES.UNDER_VERIFICATION
  if (s.includes('OD_ISSUED') || s.includes('VERIFIED') || s.includes('ISSUED')) return OD_STATUSES.OD_ISSUED
  return OD_STATUSES.PENDING
}

export function submitODParticipationProof(id, { certificateUrl, photos = [], description = '' }, studentUser) {
  const req = permissionRequests.find(pr => String(pr.id) === String(id))
  if (!req) return null
  
  req.proof = {
    submittedAt: new Date().toISOString(),
    certificateUrl: certificateUrl || req.proof?.certificateUrl || '',
    photos: photos.length > 0 ? photos : (req.proof?.photos || []),
    description: description || req.proof?.description || 'Event completion certificate and participation proof.',
    verifiedAt: null,
    verifiedBy: null,
    verificationRemarks: null
  }
  req.status = 'UNDER_VERIFICATION'

  saveToMongo('permission_requests', { id }, req)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'OD_PROOF_SUBMITTED',
    user: studentUser ? studentUser.email : 'student',
    details: `Submitted participation proof for request ${req.id} (${req.eventName || req.eventTitle})`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return req
}

export function verifyODParticipationProof(id, isApproved, remarks, officerUser) {
  const req = permissionRequests.find(pr => String(pr.id) === String(id))
  if (!req || !req.proof) return null

  if (isApproved) {
    req.proof.verifiedAt = new Date().toISOString()
    req.proof.verifiedBy = officerUser ? officerUser.name : 'OD Officer'
    req.proof.verificationRemarks = remarks || 'Event certificate and attendance proof verified.'
    req.status = 'UNDER_VERIFICATION' // Validated, ready for official pass issuance
  } else {
    req.status = 'REJECTED'
    req.proof.verificationRemarks = remarks || 'Submitted documents do not satisfy OD verification requirements.'
  }

  saveToMongo('permission_requests', { id }, req)
  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: isApproved ? 'OD_PROOF_VERIFIED' : 'OD_PROOF_REJECTED',
    user: officerUser ? officerUser.email : 'od.incharge',
    details: `${isApproved ? 'Verified' : 'Rejected'} proof for ${req.studentName} on ${req.eventName || req.eventTitle}`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)
  return req
}

export function issueOfficialODPass(id, { totalDaysOD = 1, remarks = '', dateRange = '' } = {}, officerUser) {
  const req = permissionRequests.find(pr => String(pr.id) === String(id))
  if (!req) return { success: false, error: 'Permission request not found.' }

  // Strict institutional check: Proof must have been submitted
  if (!req.proof || (!req.proof.verifiedAt && req.status !== 'UNDER_VERIFICATION' && req.status !== 'Proof Submitted' && req.status !== 'Proof Verified')) {
    return {
      success: false,
      error: 'Institutional Policy: OD cannot be marked as issued before attendance verification and certificate inspection.'
    }
  }

  const odId = `OD-2026-${Math.floor(1000 + Math.random() * 9000)}`
  const dates = dateRange || `${req.eventDate || req.date}${req.eventEndDate && req.eventEndDate !== (req.eventDate || req.date) ? ' – ' + req.eventEndDate : ''}`

  const newODRecord = {
    id: odId,
    requestId: req.id,
    studentId: req.studentId,
    studentName: req.studentName,
    studentEmail: req.studentEmail,
    rollNo: req.rollNo || '23CS082',
    dept: req.dept || 'Engineering',
    degree: req.degree || 'B.Tech',
    year: req.year || '3rd Year',
    eventName: req.eventName || req.eventTitle || 'College Event',
    eventType: req.eventType || 'Institutional',
    organizer: req.organizer || req.club || 'Campus Chapter',
    eventDates: dates,
    totalDaysOD: Math.max(1, Number(totalDaysOD) || 1),
    venue: req.venue || 'Campus Auditorium',
    status: 'Active / Verified',
    issuedBy: officerUser ? officerUser.name : 'Dr. Malathi Sundaram',
    issuerDesignation: officerUser?.designation || 'Chief Event Permission & OD In-Charge',
    issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    issuedAtTimestamp: new Date().toISOString(),
    verificationReference: `VER-${req.id}-${Math.floor(100 + Math.random() * 900)}`,
    qrCodeData: `CEH-OFFICIAL-OD-PASS:${odId}:${req.rollNo}:${(req.eventName || req.eventTitle || '').slice(0, 15)}:VERIFIED`,
    remarks: remarks || `Official On-Duty granted for verified event participation. Academic attendance credited for ${totalDaysOD || 1} day(s).`
  }

  odRecords.unshift(newODRecord)
  saveToMongo('od_records', { id: newODRecord.id }, newODRecord, true)
  req.status = 'OD_ISSUED'
  req.odRecordId = odId
  saveToMongo('permission_requests', { id: req.id }, req)

  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'OD_PASS_ISSUED',
    user: officerUser ? officerUser.email : 'od.incharge',
    details: `Issued Official OD pass ${odId} for ${req.studentName} (${newODRecord.totalDaysOD} day(s))`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  // MULTI-CHANNEL DISPATCH: WhatsApp, SMS, Email on OD pass issuance
  const phone = req.phone || '+91 98765 43210'
  const eventTitle = req.eventName || req.eventTitle || 'Campus Event'

  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'whatsapp',
    type: 'od_issued_alert',
    title: `Official OD Pass Issued: ${odId}`,
    message: `🎖️ Congratulations ${req.studentName}! Your Official On-Duty (OD) Pass #${odId} for "${eventTitle}" has been ISSUED by ${newODRecord.issuedBy}.\n\n✅ Days Credited: ${newODRecord.totalDaysOD} day(s)\n🔍 Verification Ref: ${newODRecord.verificationReference}\n\nYour academic attendance is formally updated.`,
    status: 'delivered'
  })

  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'sms',
    type: 'od_issued_alert',
    title: `SMS Alert: OD Pass #${odId} Credited`,
    message: `CEH ALERT: Official OD Pass #${odId} is verified & credited (${newODRecord.totalDaysOD} days). Download pass from portal.`,
    status: 'delivered'
  })

  logNotificationDispatch({
    recipientEmail: req.studentEmail,
    recipientPhone: phone,
    channel: 'email',
    type: 'od_issued_alert',
    title: `Official On-Duty Credential Sanctioned - #${odId}`,
    message: `Dear ${req.studentName},\n\nYour participation proof for "${eventTitle}" has been verified. Official On-Duty (OD) Pass #${odId} has been issued.\n\nAcademic Days Credited: ${newODRecord.totalDaysOD}\nVerification Ref: ${newODRecord.verificationReference}\nQR Pass: Active\n\nInstitutional Event & OD Cell`,
    status: 'delivered'
  })

  return { success: true, data: newODRecord, request: req }
}

export function queryODRecords({ search = '', dept = '', status = '', sort = 'issued_desc', page = 1, pageSize = 10 } = {}) {
  let list = [...odRecords]

  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(od =>
      (od.studentName && od.studentName.toLowerCase().includes(q)) ||
      (od.rollNo && od.rollNo.toLowerCase().includes(q)) ||
      (od.eventName && od.eventName.toLowerCase().includes(q)) ||
      (od.id && od.id.toLowerCase().includes(q)) ||
      (od.dept && od.dept.toLowerCase().includes(q))
    )
  }

  if (dept && dept !== 'all') {
    list = list.filter(od => (od.dept || '').toLowerCase().includes(dept.toLowerCase()))
  }

  if (status && status !== 'all') {
    list = list.filter(od => (od.status || '').toLowerCase().includes(status.toLowerCase()))
  }

  if (sort === 'issued_asc') {
    list.sort((a, b) => new Date(a.issuedAtTimestamp || 0) - new Date(b.issuedAtTimestamp || 0))
  } else if (sort === 'name_asc') {
    list.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
  } else {
    list.sort((a, b) => new Date(b.issuedAtTimestamp || 0) - new Date(a.issuedAtTimestamp || 0))
  }

  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function getODRecordById(id) {
  return odRecords.find(od => String(od.id) === String(id) || String(od.requestId) === String(id)) || null
}

// =========================================================================
// REGISTRATIONS & ATTENDANCE MANAGEMENT
// =========================================================================
export function queryRegistrations({
  search = '',
  eventId = '',
  studentEmail = '',
  attended = '',
  sort = 'created_desc',
  page = 1,
  pageSize = 10,
  currentUser = null
} = {}) {
  let list = [...registrations]

  if (currentUser && currentUser.role === 'student') {
    list = list.filter(r => (r.email || '').toLowerCase() === currentUser.email.toLowerCase())
  } else if (currentUser && currentUser.role === 'instructor' && currentUser.assignedClub) {
    list = list.filter(r => (r.club || '').toLowerCase() === currentUser.assignedClub.toLowerCase())
  }

  if (eventId && eventId !== 'all') {
    list = list.filter(r => String(r.eventId) === String(eventId))
  }

  if (studentEmail) {
    list = list.filter(r => (r.email || '').toLowerCase() === studentEmail.toLowerCase())
  }

  if (attended !== '' && attended !== 'all') {
    const isAttended = attended === 'true' || attended === true
    list = list.filter(r => Boolean(r.attended) === isAttended)
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(r =>
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.rollNo && r.rollNo.toLowerCase().includes(q)) ||
      (r.eventTitle && r.eventTitle.toLowerCase().includes(q)) ||
      (r.club && r.club.toLowerCase().includes(q)) ||
      (r.id && r.id.toLowerCase().includes(q))
    )
  }

  if (sort === 'date_asc') {
    list.sort((a, b) => new Date(a.eventDate || a.timestamp || 0) - new Date(b.eventDate || b.timestamp || 0))
  } else if (sort === 'name_asc') {
    list.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
  } else {
    list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
  }

  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function registerStudentForEvent(event, regData, currentUser) {
  const normalizedEmail = (currentUser?.email || regData.email || '').trim().toLowerCase()
  const existing = registrations.find(r =>
    String(r.eventId) === String(event.id) &&
    (r.email || '').toLowerCase() === normalizedEmail
  )

  if (existing) {
    return { success: false, error: 'You are already registered for this event.', reg: existing }
  }

  const currentCount = registrations.filter(r => String(r.eventId) === String(event.id)).length
  if (event.capacity && currentCount >= Number(event.capacity)) {
    return { success: false, error: 'This event has reached full seating capacity.' }
  }

  const regId = `REG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
  const newReg = {
    id: regId,
    eventId: Number(event.id) || event.id,
    eventTitle: event.title,
    club: event.club,
    eventDate: event.date,
    venue: event.venue,
    team: regData.team || '',
    studentName: currentUser?.name || regData.studentName || 'Student Scholar',
    rollNo: currentUser?.rollNo || regData.rollNo || '23CS082',
    dept: currentUser?.dept || regData.dept || 'Computer Science',
    year: currentUser?.year || regData.year || '3rd Year',
    email: normalizedEmail,
    phone: currentUser?.phone || regData.phone || '+91 98765 43210',
    isClubMember: Boolean(regData.isClubMember),
    status: 'Confirmed',
    attended: false,
    attendedAt: null,
    checkinMethod: null,
    timestamp: new Date().toISOString()
  }

  registrations.unshift(newReg)
  saveToMongo('registrations', { id: newReg.id }, newReg, true)
  
  // Increment event registered count in DB
  const ev = events.find(e => String(e.id) === String(event.id))
  if (ev) {
    ev.registered = (ev.registered || 0) + 1
    saveToMongo('events', { id: ev.id }, ev)
  }

  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'EVENT_REGISTRATION',
    user: normalizedEmail,
    details: `Registered for "${event.title}" (#${regId})`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  return { success: true, reg: newReg }
}

export function markEventAttendance(regId, isPresent, method = 'Advisor Marked', user = null) {
  const reg = registrations.find(r => String(r.id) === String(regId))
  if (!reg) return null

  reg.attended = Boolean(isPresent)
  reg.attendedAt = isPresent ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : null
  reg.checkinMethod = isPresent ? method : null
  saveToMongo('registrations', { id: reg.id }, reg)

  // Link to any pending OD requests for this student & event to advance status
  const linkedPR = permissionRequests.find(pr =>
    pr.eventId && String(pr.eventId) === String(reg.eventId) &&
    (pr.studentEmail || '').toLowerCase() === (reg.email || '').toLowerCase()
  )
  if (linkedPR && isPresent && (linkedPR.status === 'APPROVED' || linkedPR.status === 'Approved')) {
    linkedPR.status = 'EVENT_ATTENDED'
    saveToMongo('permission_requests', { id: linkedPR.id }, linkedPR)
  }

  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'ATTENDANCE_RECORDED',
    user: user ? user.email : 'system',
    details: `Marked ${reg.studentName} as ${isPresent ? 'PRESENT' : 'ABSENT'} for event ${reg.eventTitle} (${method})`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  return reg
}

export function verifySelfAttendanceWithPin(eventId, pin, studentUser) {
  if (!studentUser) return { success: false, error: 'Authentication required.' }
  const ev = events.find(e => String(e.id) === String(eventId))
  if (!ev) return { success: false, error: 'Event not found.' }

  const cleanPin = String(pin || '').trim()
  const expectedPin = String(ev.venuePin || '4821').trim()
  if (cleanPin !== expectedPin) {
    return { success: false, error: 'Invalid 4-digit Venue PIN. Check the screen at the event hall.' }
  }

  const reg = registrations.find(r =>
    String(r.eventId) === String(eventId) &&
    (r.email || '').toLowerCase() === studentUser.email.toLowerCase()
  )
  if (!reg) {
    return { success: false, error: 'No active registration ticket found for this event.' }
  }

  reg.attended = true
  reg.attendedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
  reg.checkinMethod = 'Self PIN Verified'
  saveToMongo('registrations', { id: reg.id }, reg)

  // If there's an approved OD request for this student and event, advance to EVENT_ATTENDED
  const linkedPR = permissionRequests.find(pr =>
    pr.eventId && String(pr.eventId) === String(eventId) &&
    (pr.studentEmail || '').toLowerCase() === studentUser.email.toLowerCase()
  )
  if (linkedPR && (linkedPR.status === 'APPROVED' || linkedPR.status === 'Approved')) {
    linkedPR.status = 'EVENT_ATTENDED'
    saveToMongo('permission_requests', { id: linkedPR.id }, linkedPR)
  }

  return { success: true, reg }
}

// =========================================================================
// SYSTEM SETTINGS & CONFIGURATION (CONFIGURABLE EMAIL DOMAIN)
// =========================================================================
export function getSystemSettings() {
  return { ...systemSettings }
}

export function updateSystemSettings(newSettings, adminUser) {
  if (newSettings.allowedEmailDomain !== undefined) {
    systemSettings.allowedEmailDomain = String(newSettings.allowedEmailDomain).trim().toLowerCase()
  }
  if (newSettings.requireEmailDomainCheck !== undefined) {
    systemSettings.requireEmailDomainCheck = Boolean(newSettings.requireEmailDomainCheck)
  }
  if (newSettings.allowRegistration !== undefined) {
    systemSettings.allowRegistration = Boolean(newSettings.allowRegistration)
  }
  if (newSettings.institutionName) {
    systemSettings.institutionName = newSettings.institutionName
  }

  saveToMongo('system_settings', { key: 'config' }, { key: 'config', ...systemSettings })

  const auditEntry = {
    id: `audit_${Date.now()}`,
    action: 'SETTINGS_UPDATED',
    user: adminUser ? adminUser.email : 'admin',
    details: `Updated institutional system settings (Allowed domain: ${systemSettings.allowedEmailDomain})`,
    timestamp: new Date().toISOString()
  }
  auditLogs.unshift(auditEntry)
  saveToMongo('audit_logs', { id: auditEntry.id }, auditEntry, true)

  return { ...systemSettings }
}

export function isEmailDomainAllowed(email) {
  if (!systemSettings.requireEmailDomainCheck) return true
  const allowed = (systemSettings.allowedEmailDomain || '').trim().toLowerCase()
  if (!allowed || allowed === '*') return true
  const domain = (email || '').split('@')[1]?.toLowerCase()
  if (!domain) return false
  return domain === allowed || domain.endsWith(`.${allowed}`)
}

// =========================================================================
// PASSWORD RESET SERVICE
// =========================================================================
export function createPasswordResetToken(email) {
  const user = findUserByEmail(email)
  if (!user) return null

  const token = crypto.randomBytes(24).toString('hex')
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = Date.now() + 15 * 60 * 1000 // 15 mins

  passwordResetTokens.set(token, { email: user.email, code, expiresAt })
  passwordResetTokens.set(code, { email: user.email, token, expiresAt })

  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'PASSWORD_RESET_REQUESTED',
    user: user.email,
    details: `Generated password reset verification code for ${user.email}`,
    timestamp: new Date().toISOString()
  })

  return { token, code, expiresAt, email: user.email }
}

export function resetPasswordWithTokenOrCode(identifier, newPassword) {
  const record = passwordResetTokens.get(identifier)
  if (!record || record.expiresAt < Date.now()) {
    if (record) passwordResetTokens.delete(identifier)
    return { success: false, error: 'Password reset code has expired or is invalid. Please request a new one.' }
  }

  const user = findUserByEmail(record.email)
  if (!user) return { success: false, error: 'Institutional user record not found.' }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' }
  }

  const { hash, salt } = hashPassword(newPassword)
  user.passwordHash = hash
  user.passwordSalt = salt

  passwordResetTokens.delete(record.token)
  passwordResetTokens.delete(record.code)

  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'PASSWORD_RESET_COMPLETED',
    user: user.email,
    details: `Password securely reset for account ${user.email}`,
    timestamp: new Date().toISOString()
  })

  return { success: true, message: 'Password reset successfully. You may now log in with your new credentials.' }
}

// =========================================================================
// NEW USER REGISTRATION WITH DOMAIN VALIDATION
// =========================================================================
export function registerNewUser(formData) {
  const email = (formData.email || '').trim().toLowerCase()
  const password = (formData.password || '').trim()
  const name = (formData.name || '').trim()
  const role = formData.role || 'student'

  if (!name || !email || !password) {
    return { success: false, error: 'Full name, institutional email, and password are required.' }
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must contain at least 8 characters.' }
  }

  if (!isEmailDomainAllowed(email)) {
    return {
      success: false,
      error: `Registration restricted. Please use your official institutional email ending in @${systemSettings.allowedEmailDomain}.`
    }
  }

  const existing = findUserByEmail(email)
  if (existing) {
    return { success: false, error: 'An account already exists for this institutional email. Please sign in.' }
  }

  const { hash, salt } = hashPassword(password)
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    role,
    dept: formData.dept || formData.department || 'Computer Science & Engineering',
    assignedClub: role === 'instructor' ? (formData.club || formData.assignedClub || 'CSI') : null,
    avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
    passwordHash: hash,
    passwordSalt: salt,
    isActive: true,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      accentColor: 'sandal',
      fontSize: 'medium',
      fontStyle: 'inter',
      notifications: { email: true, whatsapp: true, sms: false }
    }
  }

  users.push(newUser)

  // Also register into students roster if student role
  if (role === 'student') {
    students.unshift({
      id: newUser.id,
      name: newUser.name,
      rollNo: formData.rollNo || `23CS${Math.floor(100 + Math.random() * 900)}`,
      email: newUser.email,
      dept: newUser.dept,
      degree: formData.degree || 'B.Tech',
      year: formData.year || '3rd Year',
      chapter: formData.club || 'CSI',
      verificationStatus: 'verified',
      attendanceCount: 0,
      avatar: newUser.avatar,
      joinedDate: new Date().toISOString().split('T')[0]
    })
  }

  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'USER_REGISTERED',
    user: newUser.email,
    details: `Registered new ${role} account: ${newUser.name} (${newUser.email})`,
    timestamp: new Date().toISOString()
  })

  return { success: true, user: newUser }
}

// --- QUERY CHAPTERS ---
export function queryChapters({ search = '', sort = 'name_asc', page = 1, pageSize = 10 } = {}) {
  let list = [...chapters]

  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.tagline && c.tagline.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q))
    )
  }

  if (sort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'name_desc') {
    list.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sort === 'members_desc') {
    list.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
  }

  const totalItems = list.length
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const totalPages = Math.ceil(totalItems / ps) || 1
  const startIndex = (p - 1) * ps
  const paginatedData = list.slice(startIndex, startIndex + ps)

  return {
    data: paginatedData,
    pagination: {
      page: p,
      pageSize: ps,
      totalItems,
      totalPages
    }
  }
}

export function createChapter(chapterData, admin) {
  const newChap = {
    ...chapterData,
    id: `chap_${Date.now()}`,
    memberCount: 0,
    eventsCount: 0,
    createdAt: new Date().toISOString()
  }
  chapters.push(newChap)
  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'CHAPTER_CHARTERED',
    user: admin ? admin.email : 'admin',
    details: `Chartered new chapter "${newChap.name}"`,
    timestamp: new Date().toISOString()
  })
  return newChap
}

export function updateChapter(id, data, admin) {
  const index = chapters.findIndex(c => String(c.id) === String(id))
  if (index === -1) return null
  chapters[index] = { ...chapters[index], ...data }
  return chapters[index]
}

export function deleteChapter(id, admin) {
  const index = chapters.findIndex(c => String(c.id) === String(id))
  if (index === -1) return false
  chapters.splice(index, 1)
  return true
}

export function getStats() {
  return {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    totalStudents: students.length,
    activeChapters: chapters.length,
    pendingODRequests: permissionRequests.filter(pr => pr.status === 'pending').length,
    approvedODRequests: permissionRequests.filter(pr => pr.status === 'approved').length
  }
}

// --- USER MANAGEMENT & SECURITY ---
export function getAllUsers() {
  return users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    dept: u.dept || 'Engineering',
    isActive: u.isActive !== false,
    createdAt: u.createdAt || '2026-08-01',
    preferences: u.preferences
  }))
}

export function toggleUserAccountStatus(userId, admin) {
  const user = users.find(u => String(u.id) === String(userId))
  if (!user) return null
  user.isActive = !user.isActive
  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    user: admin ? admin.email : 'admin',
    details: `${user.isActive ? 'Activated' : 'Deactivated'} account for ${user.email} (${user.role})`,
    timestamp: new Date().toISOString()
  })
  return { id: user.id, email: user.email, isActive: user.isActive }
}

export function changeUserPassword(userId, oldPassword, newPassword) {
  const user = users.find(u => String(u.id) === String(userId))
  if (!user) return { success: false, error: 'User record not found.' }

  // Verify old password
  const isValid = hashPassword(oldPassword, user.passwordSalt).hash === user.passwordHash
  if (!isValid) {
    return { success: false, error: 'Current password is incorrect.' }
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' }
  }

  const { hash, salt } = hashPassword(newPassword)
  user.passwordHash = hash
  user.passwordSalt = salt

  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'PASSWORD_CHANGED',
    user: user.email,
    details: `Password changed securely for account ${user.email}`,
    timestamp: new Date().toISOString()
  })

  return { success: true, message: 'Password updated successfully.' }
}

export function updateUserProfileAndPreferences(userId, updateData) {
  let user = users.find(u => String(u.id) === String(userId))
  if (!user && updateData.email) {
    user = users.find(u => u.email.toLowerCase() === updateData.email.toLowerCase())
  }
  if (!user) return null

  const allowedFields = [
    'name', 'phone', 'dept', 'degree', 'bio', 'avatar',
    'rollNo', 'year', 'semester', 'cgpa', 'academicStanding', 'campusResidence', 'skills',
    'designation', 'employeeId', 'adminId', 'officeRoom', 'officeHours', 'specializations'
  ]

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field]
    }
  }

  if (updateData.preferences) {
    user.preferences = {
      ...user.preferences,
      ...updateData.preferences
    }
  }

  // Also sync in students list if student
  const student = students.find(s => String(s.id) === String(userId) || (user.email && s.email === user.email))
  if (student) {
    if (updateData.name !== undefined) student.name = updateData.name
    if (updateData.dept !== undefined) student.dept = updateData.dept
    if (updateData.avatar !== undefined) student.avatar = updateData.avatar
    if (updateData.rollNo !== undefined) student.rollNo = updateData.rollNo
    if (updateData.degree !== undefined) student.degree = updateData.degree
    if (updateData.year !== undefined) student.year = updateData.year
  }

  try {
    saveToMongo('users', { id: user.id }, user)
  } catch (err) {
    // Mongo fallback
  }

  return {
    ...user,
    passwordHash: undefined,
    passwordSalt: undefined
  }
}

// --- MULTI-LINKER CAMPUS RESOURCE MANAGEMENT ---
export function queryCampusLinks({ search = '', category = '' } = {}) {
  let list = [...campusLinks]
  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(l =>
      l.title.toLowerCase().includes(q) ||
      (l.description && l.description.toLowerCase().includes(q)) ||
      l.url.toLowerCase().includes(q)
    )
  }
  if (category && category !== 'all') {
    list = list.filter(l => l.category.toLowerCase() === category.toLowerCase())
  }
  return list
}

export function getCampusLinkById(id) {
  return campusLinks.find(l => String(l.id) === String(id)) || null
}

export function createCampusLink(data, user) {
  const newLink = {
    id: `link_${Date.now()}`,
    title: data.title || 'Untitled Resource',
    url: data.url,
    category: data.category || 'Institutional Portals',
    description: data.description || '',
    icon: data.icon || '🔗',
    createdBy: user ? user.email : 'system',
    createdAt: new Date().toISOString(),
    isOfficial: user?.role === 'admin'
  }
  campusLinks.unshift(newLink)
  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'LINK_CREATED',
    user: user ? user.email : 'system',
    details: `Added campus link: ${newLink.title} (${newLink.category})`,
    timestamp: new Date().toISOString()
  })
  return newLink
}

export function updateCampusLink(id, data, user) {
  const idx = campusLinks.findIndex(l => String(l.id) === String(id))
  if (idx === -1) return null
  campusLinks[idx] = {
    ...campusLinks[idx],
    ...data,
    updatedAt: new Date().toISOString()
  }
  return campusLinks[idx]
}

export function deleteCampusLink(id, user) {
  const idx = campusLinks.findIndex(l => String(l.id) === String(id))
  if (idx === -1) return false
  const removed = campusLinks.splice(idx, 1)[0]
  auditLogs.unshift({
    id: `audit_${Date.now()}`,
    action: 'LINK_DELETED',
    user: user ? user.email : 'system',
    details: `Deleted campus link: ${removed.title}`,
    timestamp: new Date().toISOString()
  })
  return true
}

// --- NOTIFICATION DISPATCHES & AUDIT ---
export function queryNotificationLogs({ userEmail, limit = 50 } = {}) {
  let list = [...notificationDispatches]
  if (userEmail) {
    list = list.filter(n => (n.recipientEmail || '').toLowerCase() === userEmail.toLowerCase())
  }
  return list.slice(0, limit)
}

export function logNotificationDispatch(payload) {
  const entry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    recipientEmail: payload.recipientEmail || '',
    recipientPhone: payload.recipientPhone || '',
    channel: payload.channel || 'email', // 'email' | 'whatsapp' | 'sms'
    type: payload.type || 'general_alert',
    title: payload.title || 'Campus Notification',
    message: payload.message || '',
    status: 'delivered',
    timestamp: new Date().toISOString()
  }
  notificationDispatches.unshift(entry)
  saveToMongo('notification_dispatches', { id: entry.id }, entry, true)
  return entry
}

export function queryAuditLogs({ limit = 30 } = {}) {
  return auditLogs.slice(0, limit)
}

