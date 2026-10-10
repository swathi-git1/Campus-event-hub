// Institutional API Client with Automatic JWT Injection and Refresh Handling

const TOKEN_KEY = 'ceh_access_token_v1'
const REFRESH_KEY = 'ceh_refresh_token_v1'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

class ApiClient {
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  }

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }

    const token = this.getAccessToken()
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`
    }

    let response = await fetch(url, {
      ...options,
      headers
    })

    // Handle Rate Limiting (429)
    if (response.status === 429) {
      const data = await response.json().catch(() => ({}))
      const message = data.error || 'Too many requests. Please wait a moment and try again.'
      if (typeof window !== 'undefined' && window.__showToast) {
        window.__showToast(message, 'warning')
      }
      throw new Error(message)
    }

    // Handle Expired Token (401) with Automatic Refresh
    if (response.status === 401 && !options._retry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem(REFRESH_KEY)
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          })

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json()
            if (refreshData.accessToken) {
              this.setTokens(refreshData.accessToken)
              // Retry original request with new token
              return this.request(endpoint, { ...options, _retry: true })
            }
          }
        } catch (e) {
          console.warn('Token refresh failed:', e)
        }
      }
      // If refresh fails or no refresh token, log out
      this.clearTokens()
    }

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const errorMsg = data.error || `Request failed with status ${response.status}`
      throw new Error(errorMsg)
    }

    return data
  }

  // --- AUTH METHODS ---
  async login(email, password, role) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    })
    if (data.accessToken) {
      this.setTokens(data.accessToken, data.refreshToken)
    }
    return data
  }

  async loginWithGoogle(googleData) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData)
    })
    if (data.accessToken) {
      this.setTokens(data.accessToken, data.refreshToken)
    }
    return data
  }

  async register(formData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    if (data.accessToken) {
      this.setTokens(data.accessToken, data.refreshToken)
    }
    return data
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }

  async resetPassword(identifier, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ code: identifier, newPassword })
    })
  }

  async getAuthConfig() {
    return this.request('/auth/config')
  }

  async getMe() {
    return this.request('/auth/me')
  }

  async logout() {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      })
    } finally {
      this.clearTokens()
    }
  }

  // --- EVENTS ---
  async getEvents(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/events${qStr}`)
  }

  async getEvent(id) {
    return this.request(`/events/${id}`)
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
  }

  async updateEvent(id, updateData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    })
  }

  // --- STUDENTS ---
  async getStudents(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/students${qStr}`)
  }

  async getStudent(id) {
    return this.request(`/students/${id}`)
  }

  // --- PERMISSION / OD REQUESTS ---
  async getPermissionRequests(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/permission-requests${qStr}`)
  }

  async createPermissionRequest(requestData) {
    return this.request('/permission-requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    })
  }

  async approvePermissionRequest(id, remarks) {
    return this.request(`/permission-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ remarks })
    })
  }

  async rejectPermissionRequest(id, reason) {
    return this.request(`/permission-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }

  async submitProof(id, proofData) {
    return this.request(`/permission-requests/${id}/proof`, {
      method: 'POST',
      body: JSON.stringify(proofData)
    })
  }

  async verifyProof(id, isApproved, remarks) {
    return this.request(`/permission-requests/${id}/verify-proof`, {
      method: 'POST',
      body: JSON.stringify({ isApproved, remarks })
    })
  }

  async issueOD(id, odData) {
    return this.request(`/permission-requests/${id}/issue-od`, {
      method: 'POST',
      body: JSON.stringify(odData)
    })
  }

  // --- OFFICIAL OD RECORDS ---
  async getODRecords(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/od-records${qStr}`)
  }

  async getODRecord(id) {
    return this.request(`/od-records/${id}`)
  }

  // --- REGISTRATIONS & ATTENDANCE ---
  async getRegistrations(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/registrations${qStr}`)
  }

  async registerForEvent(regData) {
    return this.request('/registrations', {
      method: 'POST',
      body: JSON.stringify(regData)
    })
  }

  async markAttendance(regId, isPresent, method) {
    return this.request(`/registrations/${regId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ isPresent, method })
    })
  }

  async selfCheckinWithPin(eventId, pin) {
    return this.request('/registrations/self-checkin', {
      method: 'POST',
      body: JSON.stringify({ eventId, pin })
    })
  }

  // --- SYSTEM SETTINGS ---
  async getSystemSettings() {
    return this.request('/settings/system')
  }

  async updateSystemSettings(settings) {
    return this.request('/settings/system', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }

  // --- CHAPTERS ---
  async getChapters(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/chapters${qStr}`)
  }

  // --- AI ASSISTANT ---
  async chatWithAssistant(message) {
    return this.request('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // --- USER SETTINGS & SECURITY ---
  async changePassword(oldPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword })
    })
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    })
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  async getAllUsers() {
    return this.request('/users')
  }

  async toggleUserStatus(userId) {
    return this.request(`/users/${userId}/toggle-status`, {
      method: 'POST'
    })
  }

  // --- MULTI-LINKER CAMPUS RESOURCES ---
  async getLinks(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v)
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : ''
    return this.request(`/links${qStr}`)
  }

  async createLink(linkData) {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(linkData)
    })
  }

  async updateLink(id, linkData) {
    return this.request(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(linkData)
    })
  }

  async deleteLink(id) {
    return this.request(`/links/${id}`, {
      method: 'DELETE'
    })
  }

  // --- NOTIFICATIONS & AUDIT ---
  async getNotifications(limit = 50) {
    return this.request(`/notifications?limit=${limit}`)
  }

  async getNotificationProviders() {
    return this.request('/notifications/providers')
  }

  async getNotificationDirectLinks(params) {
    return this.request('/notifications/direct-links', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  }

  async dispatchNotification(payload) {
    return this.request('/notifications/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async triggerODWorkflowNotification(request, action, remarks) {
    return this.request('/notifications/workflow/od', {
      method: 'POST',
      body: JSON.stringify({ request, action, remarks })
    })
  }

  async triggerWinnerWorkflowNotification(event, winner) {
    return this.request('/notifications/workflow/winner', {
      method: 'POST',
      body: JSON.stringify({ event, winner })
    })
  }

  async getAuditLogs(limit = 30) {
    return this.request(`/audit-logs?limit=${limit}`)
  }

  // --- STATS ---
  async getStats() {
    return this.request('/stats')
  }

  // --- SYSTEM & AUTH CONFIGURATION ---
  async getAuthConfig() {
    return this.request('/auth/config')
  }

  async getSystemSettings() {
    return this.request('/settings/system')
  }

  async updateSystemSettings(settings) {
    return this.request('/settings/system', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }
}

export const api = new ApiClient()

