import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import GoogleAuthButton from '../../components/GoogleAuthButton'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, BuildingIcon, UsersIcon, ShieldIcon } from '../../components/Icons'
import './AuthPortal.css'

export default function Register() {
  const { role: urlRole } = useParams()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState(
    urlRole === 'instructor' ? 'instructor' :
    urlRole === 'faculty_od' || urlRole === 'od' ? 'faculty_od' :
    urlRole === 'admin' ? 'admin' : 'student'
  )

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    club: 'CSI'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please provide your full name, institutional email, and password.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await register(selectedRole, form)
      if (!result.success) {
        setError(result.error || 'Registration failed.')
        setIsSubmitting(false)
        return
      }

      const targetRole = result.role || selectedRole
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
      setError(err.message || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-portal-shell">
      {/* Left Column context */}
      <aside className="admin-portal-left">
        <div className="admin-left-top">
          <Link to="/" className="admin-brand-link">
            <Logo size={24} textSize={15} dark />
          </Link>
        </div>

        <div className="admin-left-mid">
          <div className="admin-context-eyebrow">
            <span className="admin-eyebrow-sq" />
            <span>INSTITUTIONAL ENROLLMENT</span>
          </div>

          <h1 className="admin-context-headline">
            Join Anna University's Premier Club &amp; Event Hub.
          </h1>

          <p className="admin-context-body">
            Create your verified account to participate in collegiate societies, earn sanctioned On-Duty attendance waivers, and build your co-curricular portfolio.
          </p>

          <div className="admin-stat-module">
            <div className="admin-stat-header">
              <span className="admin-stat-title">STUDENT BENEFITS</span>
              <span className="admin-stat-sync">● VERIFIED</span>
            </div>
            <div style={{ padding: '12px 14px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              ✓ Access 8 recognized campus chapters<br />
              ✓ Automatic 4-digit venue attendance verification<br />
              ✓ Instant OD request submission with official pass<br />
              ✓ Co-curricular achievement portfolio &amp; certificates
            </div>
          </div>
        </div>

        <div className="admin-left-bottom">
          <span className="admin-status-dot" />
          <span>Anna University Institutional Affiliation Required</span>
        </div>
      </aside>

      {/* Right Column Registration Card */}
      <main className="admin-portal-right">
        <div className="admin-card-container">
          <div className="admin-login-card">
            <span className="admin-eyebrow">ACCOUNT CREATION</span>
            <h2 className="admin-heading">Create Campus Account</h2>
            <p className="admin-desc">
              Register your institutional profile to access campus societies, workshops, and permissions.
            </p>

            {error && (
              <div className="admin-error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Role Selection */}
              <div className="admin-field-group">
                <label className="admin-label">Campus Role *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'student' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: 12, padding: '7px 4px' }}
                    onClick={() => setSelectedRole('student')}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'instructor' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: 12, padding: '7px 4px' }}
                    onClick={() => setSelectedRole('instructor')}
                  >
                    👨‍🏫 Faculty
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'faculty_od' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: 12, padding: '7px 4px' }}
                    onClick={() => setSelectedRole('faculty_od')}
                  >
                    🏛️ OD Officer
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="admin-field-group">
                <label className="admin-label">Full Name *</label>
                <div className="admin-input-wrap">
                  <UserIcon className="admin-input-icon" />
                  <input
                    name="name"
                    className="admin-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={selectedRole === 'instructor' ? 'Dr. Ramanathan K.' : 'Ananya Rao'}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="admin-field-group">
                <label className="admin-label">Institutional Email Address *</label>
                <div className="admin-input-wrap">
                  <MailIcon className="admin-input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="admin-input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@college.edu"
                    required
                  />
                </div>
              </div>

              {/* Academic Department */}
              <div className="admin-field-group">
                <label className="admin-label">Academic Department *</label>
                <div className="admin-input-wrap">
                  <BuildingIcon className="admin-input-icon" />
                  <input
                    name="department"
                    className="admin-input"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Computer Science & Engineering"
                    required
                  />
                </div>
              </div>

              {/* Assigned Club if Faculty */}
              {selectedRole === 'instructor' && (
                <div className="admin-field-group">
                  <label className="admin-label">Chartered Chapter Name *</label>
                  <div className="admin-input-wrap">
                    <UsersIcon className="admin-input-icon" />
                    <input
                      name="club"
                      className="admin-input"
                      value={form.club}
                      onChange={handleChange}
                      placeholder="e.g. CSI, IEEE, Robotics"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="admin-field-group">
                <label className="admin-label">Password (at least 8 characters) *</label>
                <div className="admin-input-wrap">
                  <LockIcon className="admin-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="admin-input"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-eye-btn"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-btn-primary" disabled={isSubmitting} style={{ marginTop: 12 }}>
                <span>{isSubmitting ? 'Creating Account...' : 'Complete Institutional Registration'}</span>
                <span className="admin-btn-arrow">→</span>
              </button>
            </form>

            {/* Divider */}
            <div className="admin-oauth-divider" style={{ margin: '16px 0 14px' }}>
              <span className="admin-line" />
              <span className="admin-divider-text">or</span>
              <span className="admin-line" />
            </div>

            {/* Google Authentication */}
            <div style={{ marginBottom: 14 }}>
              <GoogleAuthButton role={selectedRole} text="Continue with Google" />
            </div>

            <div className="admin-security-box" style={{ marginTop: 14 }}>
              <ShieldIcon />
              <span>Registration enforces institutional domain governance and role verification.</span>
            </div>

            <div className="admin-secondary-nav" style={{ marginTop: 18, textAlign: 'center' }}>
              <div>
                Already have an account? <Link to="/login" className="admin-link-orange" style={{ fontWeight: 700 }}>Sign in here</Link>
              </div>
              <div style={{ marginTop: 8 }}>
                <Link to="/" className="admin-link-subtle">← Return to Public Homepage</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
