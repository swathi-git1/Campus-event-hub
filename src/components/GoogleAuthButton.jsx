import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const GOOGLE_ACCOUNTS = [
  {
    name: 'Gomathi S',
    email: '24104001@nec.edu.in',
    role: 'student',
    roleLabel: 'NEC Institutional Account',
    badgeColor: '#1a73e8'
  },
  {
    name: 'Ananya Rao',
    email: 'student@college.edu',
    role: 'student',
    roleLabel: 'Student Scholar',
    badgeColor: '#1a73e8'
  },
  {
    name: 'Dr. K. Ramanathan',
    email: 'csi.advisor@college.edu',
    role: 'instructor',
    roleLabel: 'CSI Faculty Advisor',
    badgeColor: '#0d652d'
  },
  {
    name: 'Dr. Malathi Sundaram',
    email: 'od.faculty@college.edu',
    role: 'faculty_od',
    roleLabel: 'OD In-Charge',
    badgeColor: '#e37400'
  },
  {
    name: 'Dr. Aris Thorne',
    email: 'admin@college.edu',
    role: 'admin',
    roleLabel: 'Dean & Administrator',
    badgeColor: '#c5221f'
  }
]

export default function GoogleAuthButton({ role = 'student', text = 'Continue with Google', className = '' }) {
  const navigate = useNavigate()
  const { handleLoginSuccess, loginWithGoogleProfile } = useAuth()
  const { showToast } = useToast()

  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [customRole, setCustomRole] = useState(role || 'student')

  const handleSelectAccount = (acc) => {
    setLoading(true)
    setSelectedEmail(acc.email)

    setTimeout(() => {
      try {
        const localRes = loginWithGoogleProfile(acc)
        handleLoginSuccess?.(localRes)
        showToast(`Signed in with Google as ${acc.name} (${acc.roleLabel || acc.role})`, 'success')
        setShowModal(false)

        const targetRole = acc.role
        if (targetRole === 'faculty_od') {
          navigate('/od-incharge/dashboard', { replace: true })
        } else if (targetRole === 'instructor') {
          navigate('/instructor/dashboard', { replace: true })
        } else if (targetRole === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/student/dashboard', { replace: true })
        }
      } catch (err) {
        showToast('Authentication failed. Please try again.', 'error')
      } finally {
        setLoading(false)
        setSelectedEmail(null)
      }
    }, 400)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const email = customEmail.trim().toLowerCase()
    if (!email) return

    setLoading(true)
    setSelectedEmail(email)

    setTimeout(() => {
      try {
        const acc = {
          name: customName.trim() || email.split('@')[0],
          email,
          role: customRole,
          roleLabel: `${customRole.toUpperCase()} Account`
        }
        const localRes = loginWithGoogleProfile(acc)
        handleLoginSuccess?.(localRes)
        showToast(`Signed in with Google as ${acc.name} (${acc.role})`, 'success')
        setShowModal(false)

        if (customRole === 'faculty_od') {
          navigate('/od-incharge/dashboard', { replace: true })
        } else if (customRole === 'instructor') {
          navigate('/instructor/dashboard', { replace: true })
        } else if (customRole === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/student/dashboard', { replace: true })
        }
      } catch (err) {
        showToast('Authentication failed. Please try again.', 'error')
      } finally {
        setLoading(false)
        setSelectedEmail(null)
      }
    }, 400)
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Primary Continue with Google Button */}
      <button
        type="button"
        className={`google-auth-btn ${className}`}
        onClick={() => setShowModal(true)}
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
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f8fafc'
          e.currentTarget.style.borderColor = '#94a3b8'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.borderColor = '#cbd5e1'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
        </svg>
        <span>{text}</span>
      </button>

      {/* ====================================================================
          GOOGLE "CHOOSE AN ACCOUNT" MODAL DIALOG
          ==================================================================== */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              fontFamily: "'Roboto', 'Inter', system-ui, sans-serif",
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Google Loading Bar */}
            {loading && (
              <div style={{ height: 3, width: '100%', background: '#e0e0e0', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: '60%',
                    background: '#1a73e8',
                    animation: 'googleScan 1.2s infinite ease-in-out'
                  }}
                />
              </div>
            )}

            {/* Modal Header */}
            <div style={{ padding: '28px 24px 18px', textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" style={{ marginBottom: 12 }}>
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <h2 id="google-dialog-title" style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 500, color: '#202124' }}>
                {showCustomInput ? 'Sign in with Google' : 'Choose an account'}
              </h2>
              <p style={{ margin: 0, fontSize: 13.5, color: '#5f6368' }}>
                to continue to <strong style={{ color: '#202124' }}>Campus Event Hub</strong>
              </p>
            </div>

            {/* Account Selection List */}
            {!showCustomInput ? (
              <div style={{ maxHeight: 380, overflowY: 'auto', borderTop: '1px solid #dadce0', borderBottom: '1px solid #dadce0' }}>
                {GOOGLE_ACCOUNTS.map((acc) => {
                  const isCurrent = loading && selectedEmail === acc.email
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSelectAccount(acc)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '13px 22px',
                        border: 'none',
                        background: isCurrent ? '#e8f0fe' : '#ffffff',
                        cursor: loading ? 'wait' : 'pointer',
                        textAlign: 'left',
                        borderBottom: '1px solid #f1f3f4',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!loading) e.currentTarget.style.background = '#f8f9fa'
                      }}
                      onMouseOut={(e) => {
                        if (!loading) e.currentTarget.style.background = '#ffffff'
                      }}
                    >
                      {/* Avatar Circle */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          background: acc.badgeColor || '#1a73e8',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          fontWeight: 600,
                          marginRight: 14,
                          flexShrink: 0
                        }}
                      >
                        {acc.name.charAt(0)}
                      </div>

                      {/* Account Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#202124', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{acc.name}</span>
                          {isCurrent && <span style={{ fontSize: 12, color: '#1a73e8', fontWeight: 400 }}>Signing in...</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: '#5f6368', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {acc.email}
                        </div>
                      </div>

                      {/* Role Pill Badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 12,
                          background: `${acc.badgeColor}15` || '#1a73e815',
                          color: acc.badgeColor || '#1a73e8',
                          flexShrink: 0,
                          marginLeft: 8
                        }}
                      >
                        {acc.roleLabel}
                      </span>
                    </button>
                  )
                })}

                {/* Option to use another custom account */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 22px',
                    border: 'none',
                    background: '#ffffff',
                    cursor: loading ? 'wait' : 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.background = '#f8f9fa'
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.background = '#ffffff'
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: '#f1f3f4',
                      color: '#5f6368',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      marginRight: 14
                    }}
                  >
                    +
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1a73e8' }}>
                      Use another account
                    </div>
                    <div style={{ fontSize: 12, color: '#5f6368' }}>
                      Sign in with your personal institutional email
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              /* Custom Email Form */
              <form onSubmit={handleCustomSubmit} style={{ padding: '20px 24px', borderTop: '1px solid #dadce0', borderBottom: '1px solid #dadce0' }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4043', marginBottom: 6 }}>
                    Email or Roll Number Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="24104001@nec.edu.in"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: '1px solid #dadce0',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4043', marginBottom: 6 }}>
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Gomathi S"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: '1px solid #dadce0',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4043', marginBottom: 6 }}>
                    Select Role
                  </label>
                  <select
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: '1px solid #dadce0',
                      fontSize: 14,
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="student">Student Scholar</option>
                    <option value="instructor">Faculty Advisor</option>
                    <option value="faculty_od">OD In-Charge</option>
                    <option value="admin">Dean & Administrator</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    disabled={loading || !customEmail}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: '#1a73e8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13.5,
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign in as Google Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    style={{
                      padding: '10px 16px',
                      background: '#ffffff',
                      color: '#5f6368',
                      border: '1px solid #dadce0',
                      borderRadius: 6,
                      fontWeight: 500,
                      fontSize: 13.5,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
              <span style={{ fontSize: 12, color: '#70757a' }}>
                Secure Institutional Auth
              </span>
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1a73e8',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: 4
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
