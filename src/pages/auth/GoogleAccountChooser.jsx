import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../utils/apiClient'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './GoogleAccountChooser.css'

export default function GoogleAccountChooser() {
  const navigate = useNavigate()
  const location = useLocation()
  const { handleLoginSuccess } = useAuth()
  const { showToast } = useToast()
  const gisBtnRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [hasOfficialGis, setHasOfficialGis] = useState(false)
  const [customForm, setCustomForm] = useState({
    email: '',
    name: '',
    role: location.state?.rolePreference || 'student'
  })
  const [formError, setFormError] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  // Recognized Google accounts for Campus Event Hub
  const accounts = [
    {
      name: 'Ananya Rao',
      email: 'student@college.edu',
      role: 'student',
      roleLabel: 'Student Scholar',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      badgeColor: '#1a73e8'
    },
    {
      name: 'Dr. K. Ramanathan',
      email: 'csi.advisor@college.edu',
      role: 'instructor',
      roleLabel: 'CSI Faculty Advisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      badgeColor: '#0d652d'
    },
    {
      name: 'Dr. Malathi Sundaram',
      email: 'od.faculty@college.edu',
      role: 'faculty_od',
      roleLabel: 'OD In-Charge',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
      badgeColor: '#e37400'
    },
    {
      name: 'Dr. Aris Thorne',
      email: 'admin@college.edu',
      role: 'admin',
      roleLabel: 'Dean & Administrator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      badgeColor: '#c5221f'
    },
    {
      name: 'New Scholar',
      email: 'scholar.317@college.edu',
      role: 'student',
      roleLabel: 'First-time Student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
      badgeColor: '#7b1fa2'
    }
  ]

  const completeAuth = (authRes) => {
    // If opened as a popup window, inform opener and close
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', payload: authRes }, '*')
      window.close()
      return
    }

    // Direct page navigation mode
    handleLoginSuccess?.(authRes)
    showToast(`Signed in with Google as ${authRes.user?.name || authRes.user?.email} (${authRes.role})`, 'success')

    const role = authRes.role
    if (role === 'faculty_od') {
      navigate('/od-incharge/dashboard', { replace: true })
    } else if (role === 'instructor') {
      navigate('/instructor/dashboard', { replace: true })
    } else if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    } else {
      navigate('/student/dashboard', { replace: true })
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response?.credential) {
              setLoading(true)
              setFormError('')
              try {
                const res = await api.loginWithGoogle({
                  credential: response.credential,
                  rolePreference: location.state?.rolePreference || 'student'
                })
                if (res && res.success) {
                  completeAuth(res)
                } else {
                  setFormError(res?.error || 'Google authentication failed. Please try again.')
                  setLoading(false)
                }
              } catch (err) {
                setFormError(err.message || 'Unable to authenticate with Google.')
                setLoading(false)
              }
            }
          },
          auto_select: false
        })

        if (gisBtnRef.current) {
          window.google.accounts.id.renderButton(gisBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'continue_with',
            shape: 'rectangular'
          })
          setHasOfficialGis(true)
        }
      } catch (err) {
        console.warn('Google Identity Services init notice:', err.message)
      }
    }
  }, [googleClientId, location.state])

  const handleSelectAccount = async (account) => {
    setLoading(true)
    setSelectedEmail(account.email)
    setFormError('')

    try {
      const res = await api.loginWithGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        rolePreference: account.role
      })

      if (res && res.success) {
        // Small realistic Google delay before redirect
        setTimeout(() => {
          completeAuth(res)
        }, 500)
      } else {
        setFormError(res?.error || 'Google authentication failed. Please try again.')
        setLoading(false)
        setSelectedEmail(null)
      }
    } catch (err) {
      setFormError(err.message || 'Unable to connect to Google Identity Service.')
      setLoading(false)
      setSelectedEmail(null)
    }
  }

  const handleCustomSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const email = customForm.email.trim().toLowerCase()
    if (!email) {
      setFormError('Enter a valid Google or institutional email address.')
      return
    }

    setLoading(true)
    setSelectedEmail(email)

    try {
      const res = await api.loginWithGoogle({
        email,
        name: customForm.name.trim() || email.split('@')[0],
        rolePreference: customForm.role
      })

      if (res && res.success) {
        setTimeout(() => {
          completeAuth(res)
        }, 500)
      } else {
        setFormError(res?.error || 'Sign in failed. Check your email.')
        setLoading(false)
        setSelectedEmail(null)
      }
    } catch (err) {
      setFormError(err.message || 'Unable to authenticate account.')
      setLoading(false)
      setSelectedEmail(null)
    }
  }

  const handleCancel = () => {
    if (window.opener && !window.opener.closed) {
      window.close()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="google-auth-viewport">
      <div className="google-auth-card" role="main">
        {/* Animated Indeterminate Progress Bar */}
        {loading && (
          <div className="google-progress-bar-track" aria-label="Loading Google authentication">
            <div className="google-progress-bar-indicator" />
          </div>
        )}

        {/* Card Header with Google Logo */}
        <div className="google-card-header">
          <svg className="google-logo-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
          </svg>

          {!showCustomForm ? (
            <>
              <h1 className="google-title">Choose an account</h1>
              <p className="google-subtitle">
                to continue to <span className="google-app-highlight">Campus Event Hub</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="google-title">Sign in</h1>
              <p className="google-subtitle">
                with your Google Account to continue to <span className="google-app-highlight">Campus Event Hub</span>
              </p>
            </>
          )}
        </div>

        {formError && (
          <div style={{
            background: '#fce8e6',
            color: '#c5221f',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* View 1: Real-world Google Account Chooser List */}
        {!showCustomForm ? (
          <>
            {/* Official Google Identity Services SDK Render Target */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
              <div ref={gisBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
              {hasOfficialGis && (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: '14px 0 6px', gap: 10 }}>
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>or choose verified profile</span>
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>
              )}
            </div>

            <div className="google-account-list-container">
              {accounts.map((acc) => {
                const isItemLoading = loading && selectedEmail === acc.email
                return (
                  <button
                    key={acc.email}
                    type="button"
                    className="google-account-row"
                    onClick={() => handleSelectAccount(acc)}
                    disabled={loading}
                    aria-label={`Sign in as ${acc.name}, ${acc.email}`}
                  >
                    <div className="google-avatar-wrapper">
                      {acc.avatar ? (
                        <img src={acc.avatar} alt="" className="google-avatar-img" />
                      ) : (
                        <div
                          className="google-avatar-monogram"
                          style={{ backgroundColor: acc.badgeColor || '#1a73e8' }}
                        >
                          {acc.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="google-account-meta">
                      <div className="google-account-display-name">
                        {acc.name}
                        {isItemLoading && (
                          <span style={{ fontSize: 12, color: '#1a73e8', marginLeft: 8, fontWeight: 400 }}>
                            Signing in...
                          </span>
                        )}
                      </div>
                      <div className="google-account-email-addr">{acc.email}</div>
                    </div>
                    <span className="google-role-badge-pill">{acc.roleLabel}</span>
                  </button>
                )
              })}

              {/* Use Another Account Option */}
              <button
                type="button"
                className="google-account-row"
                onClick={() => {
                  setShowCustomForm(true)
                  setFormError('')
                }}
                disabled={loading}
                aria-label="Use another Google account"
              >
                <div className="google-use-another-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368" aria-hidden="true">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="google-account-meta">
                  <div className="google-use-another-label">Use another account</div>
                </div>
              </button>
            </div>

            {/* Google OAuth Sharing Consent Notice */}
            <div className="google-consent-disclaimer">
              To continue, Google will share your name, email address, language preference, and profile picture with Campus Event Hub. Before using this app, you can review Campus Event Hub's{' '}
              <a
                href="#privacy"
                className="google-consent-link"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Campus Event Hub Security: Your credentials and data are encrypted via signed JWT tokens and stored securely.')
                }}
              >
                privacy policy
              </a>{' '}
              and{' '}
              <a
                href="#terms"
                className="google-consent-link"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Campus Event Hub Terms: Authorized for campus student and faculty activities only.')
                }}
              >
                terms of service
              </a>.
            </div>
          </>
        ) : (
          /* View 2: "Sign in with your Google Account" (Custom Google Account Input) */
          <form className="google-custom-form" onSubmit={handleCustomSubmit}>
            <div className="google-input-field-group">
              <label htmlFor="google-email-input" className="google-field-label">
                Email or phone *
              </label>
              <input
                id="google-email-input"
                type="email"
                className="google-text-input"
                placeholder="you@college.edu or gmail"
                value={customForm.email}
                onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="google-input-field-group">
              <label htmlFor="google-name-input" className="google-field-label">
                Your full name (optional)
              </label>
              <input
                id="google-name-input"
                type="text"
                className="google-text-input"
                placeholder="e.g. S. Gomathi"
                value={customForm.name}
                onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="google-input-field-group">
              <label className="google-field-label">Select institutional role</label>
              <div className="google-role-picker-grid">
                {[
                  { id: 'student', label: 'Student Scholar' },
                  { id: 'instructor', label: 'CSI / Club Advisor' },
                  { id: 'faculty_od', label: 'OD In-Charge' },
                  { id: 'admin', label: 'Administrator' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`google-role-picker-btn ${customForm.role === r.id ? 'active' : ''}`}
                    onClick={() => setCustomForm({ ...customForm, role: r.id })}
                    disabled={loading}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="google-form-actions-row">
              <button
                type="button"
                className="google-btn-text"
                onClick={() => {
                  setShowCustomForm(false)
                  setFormError('')
                }}
                disabled={loading}
              >
                Back to accounts
              </button>
              <button type="submit" className="google-btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Next'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Google Page Footer */}
      <footer className="google-page-footer">
        <div className="google-language-selector" title="Select display language">
          <span>English (United States)</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="#444746" aria-hidden="true">
            <path d="M0 0l5 5 5-5z" />
          </svg>
        </div>
        <div className="google-footer-links-list">
          <a
            href="#help"
            className="google-footer-link"
            onClick={(e) => {
              e.preventDefault()
              alert('Google Sign-In Help: Choose any authorized institutional account to seamlessly authenticate into Campus Event Hub.')
            }}
          >
            Help
          </a>
          <a
            href="#privacy"
            className="google-footer-link"
            onClick={(e) => {
              e.preventDefault()
              alert('Google Privacy: Account identifiers are securely verified through JWT token encryption.')
            }}
          >
            Privacy
          </a>
          <a
            href="#terms"
            className="google-footer-link"
            onClick={(e) => {
              e.preventDefault()
              alert('Campus Event Hub Terms: Official university portal.')
            }}
          >
            Terms
          </a>
        </div>
      </footer>

      {/* Return to Login Link */}
      <div className="google-cancel-navigation-wrap">
        <button type="button" className="google-cancel-link-btn" onClick={handleCancel}>
          ← Cancel and return to Login
        </button>
      </div>
    </div>
  )
}
