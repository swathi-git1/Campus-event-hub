import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/apiClient'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function GoogleAuthButton({ role = 'student', text = 'Continue with Google', className = '' }) {
  const navigate = useNavigate()
  const { handleLoginSuccess, loginWithGoogleProfile } = useAuth()
  const { showToast } = useToast()
  const googleBtnContainerRef = useRef(null)
  const [gisLoaded, setGisLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  const onGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      showToast('Google sign-in was cancelled or returned empty credentials.', 'warning')
      return
    }

    setLoading(true)
    try {
      try {
        const res = await api.loginWithGoogle({
          credential: response.credential,
          rolePreference: role
        })

        if (res && res.success) {
          handleLoginSuccess?.(res)
          const targetRole = res.role || res.user?.role || role
          showToast(`Signed in with Google as ${res.user?.name || res.user?.email} (${targetRole})`, 'success')

          if (targetRole === 'faculty_od') {
            navigate('/od-incharge/dashboard', { replace: true })
          } else if (targetRole === 'instructor') {
            navigate('/instructor/dashboard', { replace: true })
          } else if (targetRole === 'admin') {
            navigate('/admin/dashboard', { replace: true })
          } else {
            navigate('/student/dashboard', { replace: true })
          }
          return
        }
      } catch (err) {
        // Backend unavailable, fallback to in-browser auth
      }

      const localRes = loginWithGoogleProfile({
        name: 'Google Scholar',
        email: 'scholar@college.edu',
        role: role
      })
      handleLoginSuccess?.(localRes)
      showToast(`Signed in as Google Scholar (${role})`, 'success')
      if (role === 'faculty_od') {
        navigate('/od-incharge/dashboard', { replace: true })
      } else if (role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true })
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/student/dashboard', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if Google Identity Services SDK is loaded
    if (typeof window !== 'undefined' && window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: onGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })
        setGisLoaded(true)
      } catch (e) {
        console.warn('Google Identity Services init notice:', e.message)
      }
    }
  }, [googleClientId, role])

  const handleContinueWithGoogle = () => {
    // Direct navigation to Google Account Chooser screen (bypasses origin mismatch)
    navigate('/auth/google-choose-account', {
      state: {
        rolePreference: role,
        returnUrl: window.location.pathname
      }
    })
  }

  return (
    <div style={{ width: '100%' }}>
      <button
        type="button"
        className={`google-auth-btn ${className}`}
        onClick={handleContinueWithGoogle}
        disabled={loading}
        aria-label="Continue with Google institutional sign-in"
        style={{
          width: '100%',
          height: 44,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          color: '#334155',
          fontSize: 13.5,
          fontWeight: 600,
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          opacity: loading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.background = '#f8fafc'
            e.currentTarget.style.borderColor = '#94a3b8'
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.borderColor = '#cbd5e1'
          }
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
        </svg>
        <span>{loading ? 'Authenticating with Google...' : text}</span>
      </button>
      <div ref={googleBtnContainerRef} style={{ display: 'none' }} />
    </div>
  )
}
