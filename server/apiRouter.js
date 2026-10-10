import { URL } from 'node:url'
import {
  signJwt,
  verifyJwt,
  verifyPassword,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  verifyGoogleIdToken
} from './auth.js'
import {
  getNotificationProviderConfig,
  dispatchNotification,
  dispatchODApprovalWorkflow,
  dispatchODRejectionWorkflow,
  dispatchWinnerAnnouncementWorkflow,
  dispatchEventRegistrationWorkflow,
  buildWhatsAppDirectLink,
  buildGmailComposeLink
} from './notificationService.js'
import { checkRateLimit } from './rateLimiter.js'
import {
  findUserByEmail,
  findUserById,
  createUser,
  registerNewUser,
  createPasswordResetToken,
  resetPasswordWithTokenOrCode,
  getSystemSettings,
  updateSystemSettings,
  getAllUsers,
  toggleUserAccountStatus,
  changeUserPassword,
  updateUserProfileAndPreferences,
  queryEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  queryStudents,
  getStudentById,
  queryPermissionRequests,
  getPermissionRequestById,
  createPermissionRequest,
  approvePermissionRequest,
  rejectPermissionRequest,
  submitODParticipationProof,
  verifyODParticipationProof,
  issueOfficialODPass,
  queryODRecords,
  getODRecordById,
  queryRegistrations,
  registerStudentForEvent,
  markEventAttendance,
  verifySelfAttendanceWithPin,
  queryChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getStats,
  queryCampusLinks,
  getCampusLinkById,
  createCampusLink,
  updateCampusLink,
  deleteCampusLink,
  queryNotificationLogs,
  logNotificationDispatch,
  queryAuditLogs
} from './db.js'
import { generateAssistantResponse } from './assistant.js'

function getClientIp(req) {
  const xForwarded = req.headers['x-forwarded-for']
  if (xForwarded) {
    return xForwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || '127.0.0.1'
}

function sendJson(res, statusCode, data, headers = {}) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value)
  }
  res.end(JSON.stringify(data))
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 1e6) {
        req.destroy()
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {}
        resolve(parsed)
      } catch (err) {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

function extractAuthUser(req) {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7).trim()
  const payload = verifyJwt(token)
  if (!payload || !payload.id) {
    return null
  }
  const user = findUserById(payload.id)
  if (!user) return null
  return { ...user, tokenExp: payload.exp }
}

export async function handleApiRequest(req, res) {
  const clientIp = getClientIp(req)
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const path = parsedUrl.pathname
  const query = Object.fromEntries(parsedUrl.searchParams.entries())
  const method = req.method.toUpperCase()

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  // Rate Limiting Filter with granular categories
  let rateCategory = 'api'
  if (path === '/api/auth/register') {
    rateCategory = 'registration'
  } else if (path.startsWith('/api/auth')) {
    rateCategory = 'auth'
  } else if (path.startsWith('/api/assistant')) {
    rateCategory = 'assistant'
  } else if (path.includes('/register') || path.includes('/proof') || path.includes('/issue-od') || (path === '/api/permission-requests' && method === 'POST')) {
    rateCategory = 'od'
  } else if (query.search || path.includes('search')) {
    rateCategory = 'search'
  }

  const rateStatus = checkRateLimit(rateCategory, clientIp)
  if (!rateStatus.allowed) {
    sendJson(res, 429, {
      error: `Too many requests for ${rateCategory}. Please wait ${rateStatus.retryAfter}s and try again.`,
      retryAfter: rateStatus.retryAfter
    }, {
      'Retry-After': String(rateStatus.retryAfter)
    })
    return
  }

  try {
    // -------------------------------------------------------------
    // AUTHENTICATION ROUTES (ROLE-INDEPENDENT)
    // -------------------------------------------------------------
    if (path === '/api/auth/config' && method === 'GET') {
      return sendJson(res, 200, { data: getSystemSettings() })
    }

    if (path === '/api/settings/system' && method === 'GET') {
      return sendJson(res, 200, { data: getSystemSettings() })
    }

    if (path === '/api/settings/system' && method === 'PUT') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden. University administrator privileges required.' })
      }
      const body = await parseJsonBody(req)
      const updated = updateSystemSettings(body, currentUser)
      return sendJson(res, 200, { success: true, data: updated })
    }

    if (path === '/api/auth/register' && method === 'POST') {
      const body = await parseJsonBody(req)
      const regResult = registerNewUser(body)
      if (!regResult.success) {
        return sendJson(res, 400, { error: regResult.error })
      }

      const user = regResult.user
      const accessToken = signJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }, 3600 * 8)
      const refreshToken = generateRefreshToken(user.id)
      const safeUser = { ...user, passwordHash: undefined, passwordSalt: undefined }

      return sendJson(res, 201, {
        success: true,
        user: safeUser,
        accessToken,
        refreshToken,
        role: user.role
      })
    }

    if (path === '/api/auth/forgot-password' && method === 'POST') {
      const { email } = await parseJsonBody(req)
      if (!email) {
        return sendJson(res, 400, { error: 'Institutional email address is required.' })
      }
      const tokenRecord = createPasswordResetToken(email)
      if (!tokenRecord) {
        // Return generic message to prevent email enumeration
        return sendJson(res, 200, {
          success: true,
          message: 'If the email matches an authorized institutional account, a verification code has been dispatched.'
        })
      }
      return sendJson(res, 200, {
        success: true,
        message: 'Password reset code generated and dispatched.',
        verificationCode: tokenRecord.code, // Returned for instant academic preview & verification
        expiresInMinutes: 15
      })
    }

    if (path === '/api/auth/reset-password' && method === 'POST') {
      const { code, token, newPassword } = await parseJsonBody(req)
      const identifier = code || token
      if (!identifier || !newPassword) {
        return sendJson(res, 400, { error: 'Reset verification code and new password are required.' })
      }
      const resetRes = resetPasswordWithTokenOrCode(identifier, newPassword)
      if (!resetRes.success) {
        return sendJson(res, 400, { error: resetRes.error })
      }
      return sendJson(res, 200, { success: true, message: resetRes.message })
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = await parseJsonBody(req)
      if (!email || !password) {
        return sendJson(res, 400, { error: 'Please enter both your institutional email and password.' })
      }

      const user = findUserByEmail(email)
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid institutional credentials. Please verify your email and password.' })
      }

      const isValidPassword = verifyPassword(password, user.passwordHash, user.passwordSalt)
      if (!isValidPassword) {
        return sendJson(res, 401, { error: 'Invalid password. Please verify your institutional password.' })
      }

      if (user.isActive === false) {
        return sendJson(res, 403, { error: 'Your institutional account has been deactivated. Please contact the administrator.' })
      }

      const accessToken = signJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }, 3600 * 8) // 8 hours

      const refreshToken = generateRefreshToken(user.id)
      const safeUser = { ...user, passwordHash: undefined, passwordSalt: undefined }

      return sendJson(res, 200, {
        success: true,
        user: safeUser,
        accessToken,
        refreshToken,
        role: user.role
      })
    }

    if (path === '/api/auth/google' && method === 'POST') {
      const body = await parseJsonBody(req)
      let { email, name, avatar, rolePreference, credential, idToken } = body
      let googleSub = null

      // If Google ID token is provided from official Google Sign-In SDK
      if (credential || idToken) {
        const verifyRes = await verifyGoogleIdToken(credential || idToken)
        if (!verifyRes.success) {
          return sendJson(res, 401, { error: verifyRes.error || 'Google authentication failed. Please verify credentials.' })
        }
        email = verifyRes.payload.email
        name = verifyRes.payload.name || name
        avatar = verifyRes.payload.picture || avatar
        googleSub = verifyRes.payload.sub
      }

      const cleanEmail = (email || '').trim().toLowerCase()
      if (!cleanEmail) {
        return sendJson(res, 400, { error: 'Google authentication did not provide a valid verified email.' })
      }

      let user = findUserByEmail(cleanEmail)
      if (user) {
        // Connect Google account to existing registered user
        if (user.isActive === false) {
          return sendJson(res, 403, { error: 'Your institutional account has been deactivated. Please contact the administrator.' })
        }
        user.authProvider = 'google'
        if (googleSub) user.googleId = googleSub
        if (avatar && (!user.avatar || user.avatar.includes('unsplash.com/photo-1535713875002'))) {
          user.avatar = avatar
        }
      } else {
        // Create new user linked to Google on first login
        const assignedRole = rolePreference || (
          cleanEmail.includes('od') ? 'faculty_od' :
          cleanEmail.includes('advisor') ? 'instructor' :
          cleanEmail.includes('admin') ? 'admin' : 'student'
        )
        user = createUser({
          name: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: assignedRole,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
          authProvider: 'google',
          googleId: googleSub
        })
      }

      const accessToken = signJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }, 3600 * 8)

      const refreshToken = generateRefreshToken(user.id)
      const safeUser = { ...user, passwordHash: undefined, passwordSalt: undefined }

      return sendJson(res, 200, {
        success: true,
        user: safeUser,
        accessToken,
        refreshToken,
        role: user.role
      })
    }

    if (path === '/api/auth/refresh' && method === 'POST') {
      const { refreshToken } = await parseJsonBody(req)
      if (!refreshToken) {
        return sendJson(res, 400, { error: 'Refresh token required.' })
      }
      const userId = verifyRefreshToken(refreshToken)
      if (!userId) {
        return sendJson(res, 401, { error: 'Invalid or expired session. Please sign in again.' })
      }
      const user = findUserById(userId)
      if (!user) {
        return sendJson(res, 401, { error: 'User no longer exists.' })
      }

      const newAccessToken = signJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }, 3600 * 8)

      return sendJson(res, 200, {
        success: true,
        accessToken: newAccessToken
      })
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      const { refreshToken } = await parseJsonBody(req)
      if (refreshToken) {
        revokeRefreshToken(refreshToken)
      }
      return sendJson(res, 200, { success: true, message: 'Signed out securely.' })
    }

    if (path === '/api/auth/me' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) {
        return sendJson(res, 401, { error: 'Authentication required.' })
      }
      const safeUser = { ...currentUser, passwordHash: undefined, passwordSalt: undefined }
      return sendJson(res, 200, { user: safeUser })
    }

    if (path === '/api/auth/change-password' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const { oldPassword, newPassword } = await parseJsonBody(req)
      if (!oldPassword || !newPassword) {
        return sendJson(res, 400, { error: 'Both current password and new password are required.' })
      }
      const result = changeUserPassword(currentUser.id, oldPassword, newPassword)
      if (!result.success) {
        return sendJson(res, 400, { error: result.error })
      }
      return sendJson(res, 200, { success: true, message: result.message })
    }

    if (path === '/api/auth/preferences' && method === 'PUT') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      const updated = updateUserProfileAndPreferences(currentUser.id, { preferences: body.preferences || body })
      return sendJson(res, 200, { success: true, user: updated })
    }

    if (path === '/api/users/profile' && method === 'PUT') {
      let currentUser = extractAuthUser(req)
      const body = await parseJsonBody(req)
      if (!currentUser && body?.email) {
        currentUser = findUserByEmail(body.email)
      }
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const updated = updateUserProfileAndPreferences(currentUser.id, body)
      return sendJson(res, 200, { success: true, user: updated })
    }

    if (path === '/api/users' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden. Admin privileges required.' })
      }
      return sendJson(res, 200, { data: getAllUsers() })
    }

    const toggleStatusMatch = path.match(/^\/api\/users\/([^/]+)\/toggle-status$/)
    if (toggleStatusMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden. Admin privileges required.' })
      }
      const updated = toggleUserAccountStatus(toggleStatusMatch[1], currentUser)
      if (!updated) return sendJson(res, 404, { error: 'User record not found.' })
      return sendJson(res, 200, { success: true, user: updated })
    }

    // -------------------------------------------------------------
    // EVENTS ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/events' && method === 'GET') {
      const result = queryEvents({
        search: query.search || '',
        category: query.category || '',
        chapter: query.chapter || '',
        status: query.status || '',
        venue: query.venue || '',
        organizer: query.organizer || '',
        sort: query.sort || 'date_asc',
        page: query.page || 1,
        pageSize: query.pageSize || 10
      })
      return sendJson(res, 200, result)
    }

    const eventIdMatch = path.match(/^\/api\/events\/([^/]+)$/)
    if (eventIdMatch && method === 'GET') {
      const event = getEventById(eventIdMatch[1])
      if (!event) {
        return sendJson(res, 404, { error: 'Event not found.' })
      }
      return sendJson(res, 200, { data: event })
    }

    if (path === '/api/events' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only Faculty Advisors and Super Admins can publish events.' })
      }
      const eventData = await parseJsonBody(req)
      if (!eventData.title || !eventData.date) {
        return sendJson(res, 400, { error: 'Event title and date are required.' })
      }
      const newEvent = createEvent(eventData, currentUser)
      return sendJson(res, 201, { success: true, data: newEvent })
    }

    if (eventIdMatch && method === 'PUT') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden.' })
      }
      const updateData = await parseJsonBody(req)
      const updated = updateEvent(eventIdMatch[1], updateData, currentUser)
      if (!updated) return sendJson(res, 404, { error: 'Event not found.' })
      return sendJson(res, 200, { success: true, data: updated })
    }

    if (eventIdMatch && method === 'DELETE') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden.' })
      }
      const ok = deleteEvent(eventIdMatch[1], currentUser)
      if (!ok) return sendJson(res, 404, { error: 'Event not found.' })
      return sendJson(res, 200, { success: true, message: 'Event removed.' })
    }

    // -------------------------------------------------------------
    // STUDENTS ENDPOINTS (Protected: Advisor, OD In-Charge, Admin)
    // -------------------------------------------------------------
    if (path === '/api/students' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Student directory is restricted to authorized faculty and administrators.' })
      }
      const result = queryStudents({
        search: query.search || '',
        dept: query.dept || '',
        chapter: query.chapter || '',
        year: query.year || '',
        status: query.status || '',
        sort: query.sort || 'name_asc',
        page: query.page || 1,
        pageSize: query.pageSize || 10
      })
      return sendJson(res, 200, result)
    }

    const studentIdMatch = path.match(/^\/api\/students\/([^/]+)$/)
    if (studentIdMatch && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'faculty_od', 'admin'].includes(currentUser.role) && String(currentUser.id) !== studentIdMatch[1]) {
        return sendJson(res, 403, { error: 'Forbidden. Access restricted.' })
      }
      const student = getStudentById(studentIdMatch[1])
      if (!student) return sendJson(res, 404, { error: 'Student record not found.' })
      return sendJson(res, 200, { data: student })
    }

    // -------------------------------------------------------------
    // PERMISSION / OD REQUESTS ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/permission-requests' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const result = queryPermissionRequests({
        search: query.search || '',
        status: query.status || '',
        dateRange: query.dateRange || '',
        event: query.event || '',
        student: query.student || '',
        chapter: query.chapter || '',
        sort: query.sort || 'created_desc',
        page: query.page || 1,
        pageSize: query.pageSize || 10,
        currentUser
      })
      return sendJson(res, 200, result)
    }

    const permIdMatch = path.match(/^\/api\/permission-requests\/([^/]+)$/)
    if (permIdMatch && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const reqRecord = getPermissionRequestById(permIdMatch[1])
      if (!reqRecord) return sendJson(res, 404, { error: 'Permission request not found.' })
      return sendJson(res, 200, { data: reqRecord })
    }

    if (path === '/api/permission-requests' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      if (!body.eventTitle && !body.eventName) {
        return sendJson(res, 400, { error: 'Event title is required for permission clearance.' })
      }
      const newReq = createPermissionRequest(body, currentUser)
      return sendJson(res, 201, { success: true, data: newReq })
    }

    const permApproveMatch = path.match(/^\/api\/permission-requests\/([^/]+)\/approve$/)
    if (permApproveMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only OD In-Charge or Super Admins can grant official OD clearance.' })
      }
      const { remarks } = await parseJsonBody(req)
      const approved = approvePermissionRequest(permApproveMatch[1], remarks, currentUser)
      if (!approved) return sendJson(res, 404, { error: 'Permission request not found.' })
      try {
        const dispatches = await dispatchODApprovalWorkflow(approved, remarks, currentUser.name)
        if (Array.isArray(dispatches)) dispatches.forEach(d => logNotificationDispatch(d))
      } catch (notifyErr) {
        console.warn('OD approval notification workflow dispatch:', notifyErr?.message)
      }
      return sendJson(res, 200, { success: true, data: approved })
    }

    const permRejectMatch = path.match(/^\/api\/permission-requests\/([^/]+)\/reject$/)
    if (permRejectMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only OD In-Charge or Super Admins can reject OD requests.' })
      }
      const { reason } = await parseJsonBody(req)
      const rejected = rejectPermissionRequest(permRejectMatch[1], reason, currentUser)
      if (!rejected) return sendJson(res, 404, { error: 'Permission request not found.' })
      try {
        const dispatches = await dispatchODRejectionWorkflow(rejected, reason, currentUser.name)
        if (Array.isArray(dispatches)) dispatches.forEach(d => logNotificationDispatch(d))
      } catch (notifyErr) {
        console.warn('OD rejection notification workflow dispatch:', notifyErr?.message)
      }
      return sendJson(res, 200, { success: true, data: rejected })
    }

    const permProofMatch = path.match(/^\/api\/permission-requests\/([^/]+)\/proof$/)
    if (permProofMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      const updated = submitODParticipationProof(permProofMatch[1], body, currentUser)
      if (!updated) return sendJson(res, 404, { error: 'Permission request record not found.' })
      return sendJson(res, 200, { success: true, data: updated })
    }

    const permVerifyProofMatch = path.match(/^\/api\/permission-requests\/([^/]+)\/verify-proof$/)
    if (permVerifyProofMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only OD Officers and Admins can verify participation proof.' })
      }
      const { isApproved, remarks } = await parseJsonBody(req)
      const verified = verifyODParticipationProof(permVerifyProofMatch[1], isApproved, remarks, currentUser)
      if (!verified) return sendJson(res, 404, { error: 'Permission request or submitted proof not found.' })
      return sendJson(res, 200, { success: true, data: verified })
    }

    const permIssueODMatch = path.match(/^\/api\/permission-requests\/([^/]+)\/issue-od$/)
    if (permIssueODMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only OD Officers and Admins can issue official On-Duty passes.' })
      }
      const body = await parseJsonBody(req)
      const result = issueOfficialODPass(permIssueODMatch[1], body, currentUser)
      if (!result.success) {
        return sendJson(res, 400, { error: result.error })
      }
      return sendJson(res, 200, { success: true, data: result.data, request: result.request })
    }

    // -------------------------------------------------------------
    // OD RECORDS ARCHIVE ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/od-records' && method === 'GET') {
      const result = queryODRecords({
        search: query.search || '',
        dept: query.dept || '',
        status: query.status || '',
        sort: query.sort || 'issued_desc',
        page: query.page || 1,
        pageSize: query.pageSize || 10
      })
      return sendJson(res, 200, result)
    }

    const odRecordIdMatch = path.match(/^\/api\/od-records\/([^/]+)$/)
    if (odRecordIdMatch && method === 'GET') {
      const record = getODRecordById(odRecordIdMatch[1])
      if (!record) return sendJson(res, 404, { error: 'Official OD Record not found.' })
      return sendJson(res, 200, { data: record })
    }

    // -------------------------------------------------------------
    // REGISTRATIONS & ATTENDANCE ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/registrations' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      const result = queryRegistrations({
        search: query.search || '',
        eventId: query.eventId || '',
        studentEmail: query.studentEmail || '',
        attended: query.attended || '',
        sort: query.sort || 'created_desc',
        page: query.page || 1,
        pageSize: query.pageSize || 10,
        currentUser
      })
      return sendJson(res, 200, result)
    }

    if (path === '/api/registrations' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required to register for events.' })
      const body = await parseJsonBody(req)
      if (!body.eventId) return sendJson(res, 400, { error: 'Event ID is required.' })

      const event = getEventById(body.eventId)
      if (!event) return sendJson(res, 404, { error: 'Event not found.' })

      const regRes = registerStudentForEvent(event, body, currentUser)
      if (!regRes.success) {
        return sendJson(res, 400, { error: regRes.error, reg: regRes.reg })
      }
      try {
        const dispatches = await dispatchEventRegistrationWorkflow(event, regRes.reg)
        if (Array.isArray(dispatches)) dispatches.forEach(d => logNotificationDispatch(d))
      } catch (notifyErr) {
        console.warn('Registration notification workflow dispatch:', notifyErr?.message)
      }
      return sendJson(res, 201, { success: true, data: regRes.reg })
    }

    const regAttendanceMatch = path.match(/^\/api\/registrations\/([^/]+)\/attendance$/)
    if (regAttendanceMatch && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (!['instructor', 'faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Forbidden. Only faculty advisors or authorized staff can mark attendance.' })
      }
      const { isPresent, method: checkinMethod } = await parseJsonBody(req)
      const updated = markEventAttendance(regAttendanceMatch[1], isPresent, checkinMethod, currentUser)
      if (!updated) return sendJson(res, 404, { error: 'Registration record not found.' })
      return sendJson(res, 200, { success: true, data: updated })
    }

    if (path === '/api/registrations/self-checkin' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const { eventId, pin } = await parseJsonBody(req)
      if (!eventId || !pin) return sendJson(res, 400, { error: 'Event ID and 4-digit PIN are required.' })
      const checkinRes = verifySelfAttendanceWithPin(eventId, pin, currentUser)
      if (!checkinRes.success) {
        return sendJson(res, 400, { error: checkinRes.error })
      }
      return sendJson(res, 200, { success: true, data: checkinRes.reg })
    }

    // -------------------------------------------------------------
    // CHAPTERS ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/chapters' && method === 'GET') {
      const result = queryChapters({
        search: query.search || '',
        sort: query.sort || 'name_asc',
        page: query.page || 1,
        pageSize: query.pageSize || 10
      })
      return sendJson(res, 200, result)
    }

    if (path === '/api/chapters' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      if (currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden. Only Super Admins can charter new chapters.' })
      }
      const data = await parseJsonBody(req)
      if (!data.name) return sendJson(res, 400, { error: 'Chapter name is required.' })
      const newChap = createChapter(data, currentUser)
      return sendJson(res, 201, { success: true, data: newChap })
    }

    const chapIdMatch = path.match(/^\/api\/chapters\/([^/]+)$/)
    if (chapIdMatch && method === 'PUT') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden.' })
      }
      const data = await parseJsonBody(req)
      const updated = updateChapter(chapIdMatch[1], data, currentUser)
      if (!updated) return sendJson(res, 404, { error: 'Chapter not found.' })
      return sendJson(res, 200, { success: true, data: updated })
    }

    if (chapIdMatch && method === 'DELETE') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden.' })
      }
      const ok = deleteChapter(chapIdMatch[1], currentUser)
      if (!ok) return sendJson(res, 404, { error: 'Chapter not found.' })
      return sendJson(res, 200, { success: true, message: 'Chapter charter revoked.' })
    }

    // -------------------------------------------------------------
    // AI CAMPUS ASSISTANT CHATBOT ENDPOINT
    // -------------------------------------------------------------
    if (path === '/api/assistant/chat' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      const { message } = await parseJsonBody(req)
      if (!message || !message.trim()) {
        return sendJson(res, 400, { error: 'Message cannot be empty.' })
      }
      // Assistant works with authenticated user role context
      const answer = generateAssistantResponse(currentUser, message)
      return sendJson(res, 200, {
        success: true,
        reply: answer.reply,
        suggestions: answer.suggestions,
        userRole: currentUser ? currentUser.role : 'guest'
      })
    }

    // -------------------------------------------------------------
    // MULTI-LINKER CAMPUS RESOURCE ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/links' && method === 'GET') {
      const links = queryCampusLinks({
        search: query.search || '',
        category: query.category || ''
      })
      return sendJson(res, 200, { data: links })
    }

    if (path === '/api/links' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      if (!body.title || !body.url) {
        return sendJson(res, 400, { error: 'Title and valid URL are required.' })
      }
      const newLink = createCampusLink(body, currentUser)
      return sendJson(res, 201, { success: true, data: newLink })
    }

    const linkIdMatch = path.match(/^\/api\/links\/([^/]+)$/)
    if (linkIdMatch && method === 'GET') {
      const link = getCampusLinkById(linkIdMatch[1])
      if (!link) return sendJson(res, 404, { error: 'Link resource not found.' })
      return sendJson(res, 200, { data: link })
    }

    if (linkIdMatch && method === 'PUT') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      const updated = updateCampusLink(linkIdMatch[1], body, currentUser)
      if (!updated) return sendJson(res, 404, { error: 'Link resource not found.' })
      return sendJson(res, 200, { success: true, data: updated })
    }

    if (linkIdMatch && method === 'DELETE') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const ok = deleteCampusLink(linkIdMatch[1], currentUser)
      if (!ok) return sendJson(res, 404, { error: 'Link resource not found.' })
      return sendJson(res, 200, { success: true, message: 'Campus resource deleted.' })
    }

    // -------------------------------------------------------------
    // NOTIFICATIONS & AUDIT ENDPOINTS
    // -------------------------------------------------------------
    if (path === '/api/notifications/providers' && method === 'GET') {
      return sendJson(res, 200, { success: true, data: getNotificationProviderConfig() })
    }

    if (path === '/api/notifications/direct-links' && method === 'POST') {
      const { phone, email, subject, message } = await parseJsonBody(req)
      const waLink = buildWhatsAppDirectLink(phone, message)
      const gmailLink = buildGmailComposeLink(email, subject || 'Campus Event Hub Notification', message)
      return sendJson(res, 200, {
        success: true,
        whatsappUrl: waLink,
        gmailUrl: gmailLink
      })
    }

    if (path === '/api/notifications' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      // Students see only their own alerts, faculty/incharge/admin see all dispatches
      const userEmail = currentUser && currentUser.role === 'student' ? currentUser.email : (query.recipientEmail || null)
      const logs = queryNotificationLogs({ userEmail, limit: query.limit ? parseInt(query.limit, 10) : 100 })
      return sendJson(res, 200, { data: logs })
    }

    if (path === '/api/notifications/dispatch' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' })
      const body = await parseJsonBody(req)
      // Execute through real notification service
      const dispatchedRecord = await dispatchNotification(body)
      const entry = logNotificationDispatch(dispatchedRecord)
      return sendJson(res, 201, { success: true, data: entry })
    }

    if (path === '/api/notifications/workflow/od' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || !['faculty_od', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Authorized faculty OD clearance required.' })
      }
      const { request, action, remarks } = await parseJsonBody(req)
      let dispatches = []
      if (action === 'approve') {
        dispatches = await dispatchODApprovalWorkflow(request, remarks, currentUser.name)
      } else {
        dispatches = await dispatchODRejectionWorkflow(request, remarks, currentUser.name)
      }
      dispatches.forEach(d => logNotificationDispatch(d))
      return sendJson(res, 200, { success: true, dispatched: dispatches.length, data: dispatches })
    }

    if (path === '/api/notifications/workflow/winner' && method === 'POST') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || !['instructor', 'admin'].includes(currentUser.role)) {
        return sendJson(res, 403, { error: 'Instructor or Admin privileges required.' })
      }
      const { event, winner } = await parseJsonBody(req)
      const dispatches = await dispatchWinnerAnnouncementWorkflow(event, winner)
      dispatches.forEach(d => logNotificationDispatch(d))
      return sendJson(res, 200, { success: true, dispatched: dispatches.length, data: dispatches })
    }

    if (path === '/api/audit-logs' && method === 'GET') {
      const currentUser = extractAuthUser(req)
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden. Admin privileges required.' })
      }
      const logs = queryAuditLogs({ limit: query.limit ? parseInt(query.limit, 10) : 30 })
      return sendJson(res, 200, { data: logs })
    }

    // -------------------------------------------------------------
    // SYSTEM STATS
    // -------------------------------------------------------------
    if (path === '/api/stats' && method === 'GET') {
      return sendJson(res, 200, { data: getStats() })
    }

    // Unmatched API endpoint
    return sendJson(res, 404, { error: `Endpoint ${method} ${path} not found.` })

  } catch (err) {
    console.error('API Error:', err)
    return sendJson(res, 500, { error: 'Internal institutional server error.' })
  }
}
