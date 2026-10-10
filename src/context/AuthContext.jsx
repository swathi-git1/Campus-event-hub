import React, { createContext, useContext, useEffect, useState } from 'react'
import { instructors, defaultStudentProfile, studentAccounts, defaultAdminProfile, odInchargeFaculty } from '../data/mockData'
import { api } from '../utils/apiClient'

const AuthContext = createContext(null)

const ACCOUNT_KEY = 'ceh_accounts_v1'
const SESSION_KEY = 'ceh_session_v1'
const RECENT_KEY = 'ceh_recent_users_v1'

const decode = value => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(value))))
  } catch (e) {
    try {
      return JSON.parse(Buffer.from(value, 'base64').toString('utf8'))
    } catch {
      return {}
    }
  }
}

const readAccounts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || 'null')
    if (Array.isArray(stored) && stored.length) {
      const hasOD = stored.some(a => (a.email || '').toLowerCase() === odInchargeFaculty.email.toLowerCase())
      if (!hasOD) {
        return [...stored, odInchargeFaculty]
      }
      return stored
    }
  } catch (e) {
    // Reset malformed account storage
  }
  return [...studentAccounts, ...instructors, { ...defaultAdminProfile, role: 'admin' }, odInchargeFaculty]
}

const rememberAccount = account => {
  if (!account || !account.email) return
  const accounts = readAccounts().filter(item => item?.email && item.email.toLowerCase() !== account.email.toLowerCase())
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...accounts, account]))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedSession = localStorage.getItem(SESSION_KEY)
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        if (session.user?.email) {
          if (session.token && typeof session.token === 'string') {
            const parts = session.token.split('.')
            if (parts.length === 3) {
              const payload = decode(parts[1])
              const expMs = (payload.exp ? payload.exp * 1000 : 0) || payload.exp || 0
              if (expMs > Date.now() || !payload.exp) {
                return session.user
              }
            } else {
              return session.user
            }
          } else {
            return session.user
          }
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    const storedUser = localStorage.getItem('ceh_user')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {}
    }
    return null
  })

  // Validate server session on startup
  useEffect(() => {
    const checkServerSession = async () => {
      if (api.getAccessToken()) {
        try {
          const me = await api.getMe()
          if (me?.user) {
            setUser(me.user)
          }
        } catch (e) {
          // Token invalid or expired
        }
      }
    }
    checkServerSession()
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('ceh_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('ceh_user')
    }
  }, [user])

  const establishSession = (account, token) => {
    const sessionToken = token || api.getAccessToken() || `fallback_tok_${Date.now()}`
    if (token) {
      api.setTokens(token)
    }
    const session = { user: account, token: sessionToken, issuedAt: Date.now() }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    const nextRecent = [
      { email: account.email, name: account.name, role: account.role, lastAccessed: new Date().toISOString() },
      ...recent.filter(item => item.email !== account.email)
    ].slice(0, 8)
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent))
    
    setUser(account)
    return session
  }

  const handleLoginSuccess = (authRes) => {
    if (authRes?.user) {
      const token = authRes.accessToken || authRes.token || `fallback_google_${Date.now()}`
      establishSession(authRes.user, token)
    }
  }

  const loginWithGoogleProfile = (accountProfile) => {
    const role = accountProfile.role || 'student'
    const account = {
      id: accountProfile.id || `google_${accountProfile.email.split('@')[0]}`,
      name: accountProfile.name || 'Google User',
      email: accountProfile.email,
      role: role,
      dept: accountProfile.dept || 'Campus Event Hub',
      avatar: accountProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
      isGoogleAuth: true
    }
    rememberAccount(account)
    const session = establishSession(account)
    return {
      success: true,
      user: session.user,
      role: session.user.role,
      token: session.token
    }
  }

  const login = async (explicitRole, formData = {}) => {
    const email = (formData.email || '').trim().toLowerCase()
    const password = (formData.password || '').trim()

    if (!email || !password) {
      return { success: false, error: 'Please enter both your email address and password.' }
    }

    // 1. Try server API login with real JWT issuance
    try {
      const serverRes = await api.login(email, password, explicitRole)
      if (serverRes && serverRes.success && serverRes.accessToken) {
        const session = establishSession(serverRes.user, serverRes.accessToken)
        return {
          success: true,
          user: session.user,
          role: session.user.role,
          token: session.token
        }
      }
    } catch (err) {
      // If error is 401 or invalid credentials, return server message
      if (err.message && (err.message.includes('Invalid') || err.message.includes('password'))) {
        return { success: false, error: err.message }
      }
    }

    // 2. Fallback to local accounts matching if server API network glitch occurs
    const account = readAccounts().find(item => item.email.toLowerCase() === email)
    if (!account || account.password !== password) {
      return { success: false, error: 'Invalid college email or password. Please verify institutional credentials.' }
    }
    if (explicitRole && account.role !== explicitRole) {
      return { success: false, error: `This account belongs to the ${account.role} portal.` }
    }

    const session = establishSession({ ...account, password: undefined })
    return { success: true, user: session.user, role: session.user.role, token: session.token }
  }

  const register = async (roleOrData, optionalData = {}) => {
    let role = typeof roleOrData === 'string' ? roleOrData : (roleOrData?.role || 'student')
    let formData = typeof roleOrData === 'object' && roleOrData !== null ? roleOrData : optionalData

    const email = (formData.email || '').trim().toLowerCase()
    const password = (formData.password || '').trim()
    const name = (formData.name || '').trim()

    if (!name || !email || password.length < 8) {
      return { success: false, error: 'Full name, institutional email, and a password of at least 8 characters are required.' }
    }

    // 1. Try server registration
    try {
      const serverRes = await api.register({ ...formData, role })
      if (serverRes && serverRes.success && serverRes.accessToken) {
        const session = establishSession(serverRes.user, serverRes.accessToken)
        return { success: true, user: session.user, role: session.user.role, token: session.token }
      }
    } catch (err) {
      if (err.message && (err.message.includes('restricted') || err.message.includes('already exists') || err.message.includes('characters'))) {
        return { success: false, error: err.message }
      }
    }

    // 2. Fallback to local accounts matching if offline
    if (readAccounts().some(item => item.email.toLowerCase() === email)) {
      return { success: false, error: 'An account already exists for this email. Please sign in.' }
    }
    const account = {
      id: `${role}_${Date.now()}`,
      name,
      email,
      password,
      role,
      dept: formData.department || formData.dept || 'Engineering',
      assignedClub: role === 'instructor' ? (formData.club || 'CSI') : undefined,
      clubPosition: null,
      createdAt: new Date().toISOString()
    }
    rememberAccount(account)
    const session = establishSession({ ...account, password: undefined })
    return { success: true, user: session.user, role, token: session.token }
  }

  const forgotPassword = async (email) => {
    try {
      const res = await api.forgotPassword(email)
      return res
    } catch (err) {
      return { success: false, error: err.message || 'Unable to request password reset.' }
    }
  }

  const resetPassword = async (codeOrToken, newPassword) => {
    try {
      const res = await api.resetPassword(codeOrToken, newPassword)
      return res
    } catch (err) {
      return { success: false, error: err.message || 'Failed to reset password.' }
    }
  }

  const loginWithOAuth = async (provider) => {
    const email = `scholar.${provider.toLowerCase()}@college.edu`
    try {
      const res = await api.loginWithGoogle({
        email,
        name: `${provider} Institutional Scholar`,
        rolePreference: 'student'
      })
      if (res.success) {
        handleLoginSuccess(res)
        return { success: true, user: res.user, role: res.role, token: res.accessToken }
      }
    } catch (e) {
      // Fallback
    }

    const account = {
      id: `oauth_${provider}_${Date.now()}`,
      name: `${provider} Institutional Scholar`,
      email,
      role: 'student',
      dept: 'Computer Science & Engineering',
      clubPosition: null,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
      isOAuth: true
    }
    rememberAccount(account)
    const session = establishSession(account)
    return { success: true, user: session.user, role: session.user.role, token: session.token }
  }

  const updateProfile = async (profileData) => {
    let resolvedEmail = profileData?.email || user?.email
    if (!resolvedEmail && typeof window !== 'undefined') {
      try {
        const storedUser = JSON.parse(localStorage.getItem('ceh_user') || '{}')
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}')
        resolvedEmail = storedUser?.email || session?.user?.email
      } catch (err) {}
    }

    let updatedUser = { ...(user || {}), ...profileData }
    if (resolvedEmail) {
      updatedUser.email = resolvedEmail
    }

    // 1. Try server API update
    try {
      const res = await api.updateProfile({
        email: resolvedEmail,
        id: user?.id,
        ...profileData
      })
      if (res && res.user) {
        // Merge backend response while guaranteeing profileData values take precedence
        updatedUser = { ...updatedUser, ...res.user, ...profileData }
      }
    } catch (e) {
      console.warn('Backend updateProfile notice (using offline local session sync):', e?.message || e)
    }

    // 2. Synchronize local state and storage
    setUser(updatedUser)

    const storedSession = localStorage.getItem(SESSION_KEY)
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        session.user = updatedUser
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } catch (e) {}
    }
    localStorage.setItem('ceh_user', JSON.stringify(updatedUser))
    rememberAccount(updatedUser)

    return { success: true, user: updatedUser }
  }

  const logout = async () => {
    try {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      await api.logout()
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('ceh_user')
    api.clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        loginWithOAuth,
        loginWithGoogleProfile,
        handleLoginSuccess,
        updateProfile,
        getAccounts: () => readAccounts(),
        getRecentUsers: () => JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
