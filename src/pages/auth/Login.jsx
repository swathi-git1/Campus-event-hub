import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import GoogleAuthButton from '../../components/GoogleAuthButton'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ShieldIcon } from '../../components/Icons'
import { clubs, events } from '../../data/mockData'
import './AuthPortal.css'

export default function Login() {
  const { login, forgotPassword, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQuickFill, setShowQuickFill] = useState(false)

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: Email, 2: Code & New Password, 3: Done
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotCode, setForgotCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const totalRegistered = events.reduce((sum, e) => sum + (e.registered || 0), 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter both your email address and password.')
      return
    }
    setIsSubmitting(true)
    try {
      // Role-independent authentication: backend verifies credentials and returns user's actual role
      const res = await login(null, form)
      if (!res || !res.success) {
        setError(res?.error || 'Authentication failed. Please verify your credentials.')
        setIsSubmitting(false)
        return
      }

      // Determine target dashboard based on authenticated user's role
      const targetRole = res?.role || res?.user?.role || 'student'
      if (targetRole === 'faculty_od') {
        navigate('/od-incharge/dashboard')
      } else if (targetRole === 'instructor') {
        navigate('/instructor/dashboard')
      } else if (targetRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Unable to establish secure institutional session.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Account Fill for Demo / Testing convenience
  const handleQuickFill = (email, pwd) => {
    setForm({ email, password: pwd })
    setError('')
    setShowQuickFill(false)
  }

  // Forgot Password Handlers
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail) {
      setForgotError('Please enter your institutional email address.')
      return
    }
    setForgotLoading(true)
    try {
      const res = await forgotPassword(forgotEmail)
      if (res && res.success) {
        if (res.verificationCode) {
          setForgotCode(res.verificationCode)
        }
        setForgotStep(2)
      } else {
        setForgotError(res?.error || 'Unable to dispatch reset code.')
      }
    } catch (err) {
      setForgotError(err.message || 'Request failed.')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotCode || !newPassword) {
      setForgotError('Please enter both the verification code and your new password.')
      return
    }
    if (newPassword.length < 8) {
      setForgotError('New password must be at least 8 characters long.')
      return
    }
    setForgotLoading(true)
    try {
      const res = await resetPassword(forgotCode, newPassword)
      if (res && res.success) {
        setForgotStep(3)
        setSuccessMsg('Password updated successfully! Sign in with your new password.')
      } else {
        setForgotError(res?.error || 'Invalid or expired verification code.')
      }
    } catch (err) {
      setForgotError(err.message || 'Reset failed.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="admin-portal-shell">
      {/* ====================================================================
          LEFT COLUMN — INSTITUTIONAL CONTEXT & BRANDING
          ==================================================================== */}
      <aside className="admin-portal-left">
        <div className="admin-left-top">
          <Link to="/" className="admin-brand-link" title="Campus Event Hub Home">
            <Logo size={24} textSize={15} dark />
          </Link>
        </div>

        <div className="admin-left-mid">
          <div className="admin-context-eyebrow">
            <span className="admin-eyebrow-sq" />
            <span>CENTRAL CAMPUS PLATFORM</span>
          </div>

          <h1 className="admin-context-headline">
            Connect. Participate. Grow with Your Campus.
          </h1>

          <p className="admin-context-body">
            Access student clubs, accredited workshops, venue attendance verification, and official On-Duty (OD) clearances through a single unified institutional account.
          </p>

          {/* Metric Stats Module */}
          <div className="admin-stat-module">
            <div className="admin-stat-header">
              <span className="admin-stat-title">CAMPUS PLATFORM METRICS</span>
              <span className="admin-stat-sync">● LIVE</span>
            </div>

            <div className="admin-stat-grid">
              <div className="admin-stat-item">
                <span className="admin-stat-val">{clubs.length}+</span>
                <span className="admin-stat-label">Recognized Clubs</span>
              </div>
              <div className="admin-stat-item">
                <span className="admin-stat-val">{events.length}</span>
                <span className="admin-stat-label">Active Events</span>
              </div>
              <div className="admin-stat-item">
                <span className="admin-stat-val">{totalRegistered}+</span>
                <span className="admin-stat-label">Participants</span>
              </div>
            </div>

            {/* Structured Workflow Verification Sequence */}
            <div className="admin-workflow-bar">
              <div className="admin-workflow-step">
                <span className="admin-step-badge">1</span>
                <span className="admin-step-text">Register Event</span>
              </div>
              <span className="admin-workflow-arrow">→</span>
              <div className="admin-workflow-step">
                <span className="admin-step-badge">2</span>
                <span className="admin-step-text">Request OD</span>
              </div>
              <span className="admin-workflow-arrow">→</span>
              <div className="admin-workflow-step">
                <span className="admin-step-badge">3</span>
                <span className="admin-step-text">Attend &amp; PIN</span>
              </div>
              <span className="admin-workflow-arrow">→</span>
              <div className="admin-workflow-step active">
                <span className="admin-step-badge">4</span>
                <span className="admin-step-text">OD Issued</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-left-bottom">
          <span className="admin-status-dot" />
          <span>Anna University Institutional Ecosystem · Verified Role-Based Access</span>
        </div>
      </aside>

      {/* ====================================================================
          RIGHT COLUMN — ROLE-INDEPENDENT LOGIN CARD
          ==================================================================== */}
      <main className="admin-portal-right">
        <div className="admin-card-container">
          <div className="admin-login-card">
            {/* Eyebrow Label */}
            <span className="admin-eyebrow">INSTITUTIONAL ACCESS</span>

            {/* Standard Heading Requested */}
            <h2 className="admin-heading">Welcome Back</h2>

            {/* Description */}
            <p className="admin-desc">
              Sign in with your institutional credentials to access your dashboard, events, and permissions.
            </p>

            {/* Feedback Banners */}
            {error && (
              <div className="admin-error-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065F46',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16
              }}>
                ✓ {successMsg}
              </div>
            )}

            {/* Form Fields & Primary Submit */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email Address */}
              <div className="admin-field-group">
                <label className="admin-label" htmlFor="user-email-input">
                  Email Address <span className="admin-req">*</span>
                </label>
                <div className="admin-input-wrap">
                  <MailIcon className="admin-input-icon" />
                  <input
                    id="user-email-input"
                    type="email"
                    name="email"
                    className="admin-input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@college.edu"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Reveal Toggle & Forgot Password Link */}
              <div className="admin-field-group">
                <div className="admin-label-row">
                  <label className="admin-label" htmlFor="user-password-input">
                    Password <span className="admin-req">*</span>
                  </label>
                  <button 
                    type="button" 
                    className="admin-forgot-btn"
                    onClick={() => {
                      setForgotEmail(form.email)
                      setForgotStep(1)
                      setForgotError('')
                      setShowForgotModal(true)
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="admin-input-wrap">
                  <LockIcon className="admin-input-icon" />
                  <input
                    id="user-password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="admin-input"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-eye-btn"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Primary Continue Button */}
              <button type="submit" className="admin-btn-primary" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Authenticating...' : 'Continue'}</span>
                <span className="admin-btn-arrow">→</span>
              </button>
            </form>

            {/* Divider */}
            <div className="admin-oauth-divider">
              <span className="admin-line" />
              <span className="admin-divider-text">or</span>
              <span className="admin-line" />
            </div>

            {/* Google Authentication */}
            <div style={{ marginBottom: 20 }}>
              <GoogleAuthButton text="Continue with Google" />
            </div>

            {/* Security Note */}
            <div className="admin-security-box">
              <ShieldIcon />
              <span>Role-independent authentication. System automatically directs you to your authorized dashboard.</span>
            </div>

            {/* Create Account & Navigation */}
            <div className="admin-secondary-nav" style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13.5, color: 'var(--club-text-body)' }}>
                Don't have an institutional account?{' '}
                <Link to="/register" className="admin-link-orange" style={{ fontWeight: 700 }}>
                  Create Account
                </Link>
              </div>

              <div style={{ marginTop: 14 }}>
                <Link to="/" className="admin-link-subtle" style={{ fontSize: 12.5 }}>
                  ← Return to Public Homepage
                </Link>
              </div>

              {/* Collapsible Quick Demo Credentials Selector for Testing Convenience */}
              <div style={{ marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowQuickFill(!showQuickFill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    color: 'var(--club-caramel-dark)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {showQuickFill ? '▲ Hide Quick Demo Credentials' : '▼ Quick Demo Accounts (One-Click Fill)'}
                </button>

                {showQuickFill && (
                  <div style={{
                    marginTop: 10,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 8,
                    textAlign: 'left'
                  }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, padding: '6px 8px', justifyContent: 'flex-start' }}
                      onClick={() => handleQuickFill('student@college.edu', 'password123')}
                    >
                      🎓 Student (Ananya)
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, padding: '6px 8px', justifyContent: 'flex-start' }}
                      onClick={() => handleQuickFill('csi.advisor@college.edu', 'password123')}
                    >
                      👨‍🏫 Faculty Advisor
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, padding: '6px 8px', justifyContent: 'flex-start' }}
                      onClick={() => handleQuickFill('od.faculty@college.edu', 'password123')}
                    >
                      🏛️ OD Officer
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, padding: '6px 8px', justifyContent: 'flex-start' }}
                      onClick={() => handleQuickFill('admin@college.edu', 'password123')}
                    >
                      🛡️ College Admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          FORGOT PASSWORD & SECURE RESET MODAL
          ==================================================================== */}
      {showForgotModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 33, 43, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 16,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="card"
            style={{
              background: 'var(--card)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 420,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1px solid var(--border)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🔐</span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
                  Reset Institutional Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
                {forgotError}
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleRequestCode}>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14, lineHeight: 1.5 }}>
                  Enter your registered institutional email address. We will generate and dispatch a secure verification code.
                </p>
                <div className="admin-field-group">
                  <label className="admin-label">Institutional Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@college.edu"
                    required
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowForgotModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }} disabled={forgotLoading}>
                    {forgotLoading ? 'Dispatching...' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetSubmit}>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14, lineHeight: 1.5 }}>
                  A verification code has been dispatched to <b style={{ color: 'var(--ink)' }}>{forgotEmail}</b>. Enter the code and your new password.
                </p>
                <div className="admin-field-group">
                  <label className="admin-label">Verification Code *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={forgotCode}
                    onChange={e => setForgotCode(e.target.value)}
                    placeholder="e.g. 581920"
                    required
                    autoFocus
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">New Password (min 8 chars) *</label>
                  <input
                    type="password"
                    className="admin-input"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter strong password"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setForgotStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }} disabled={forgotLoading}>
                    {forgotLoading ? 'Updating Password...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              <div style={{ textAlign: 'center', padding: '14px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <h4 style={{ fontSize: 16, marginBottom: 6, color: 'var(--ink)' }}>Password Reset Completed</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}>
                  Your password has been securely updated. You can now log in with your new credentials.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setShowForgotModal(false)}
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
