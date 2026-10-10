import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme, ACCENT_PALETTES, FONT_SIZES, FONT_STYLES } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'
import { api } from '../utils/apiClient'
import { useNavigate } from 'react-router-dom'

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80"
]

export default function Settings() {
  const { user, updateProfile, logout } = useAuth()
  const {
    theme,
    toggleTheme,
    accentColor,
    setAccentColor,
    customHex,
    setCustomColor,
    activePalette,
    fontSize,
    setFontSize,
    fontStyle,
    setFontStyle,
    resetAppearance
  } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('appearance')
  const [customInput, setCustomInput] = useState(customHex || '#C27E43')

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '+91 98765 43210',
    dept: user?.dept || 'Computer Science & Engineering',
    degree: user?.degree || 'B.Tech Computer Science',
    bio: user?.bio || 'Student scholar and active club coordinator.',
    avatar: user?.avatar || AVATAR_PRESETS[0]
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password Form State
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPass, setIsChangingPass] = useState(false)

  // Notifications State
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    whatsapp: true,
    sms: false
  })

  // Notification logs state
  const [notificationLogs, setNotificationLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '+91 98765 43210',
        dept: user.dept || 'Computer Science & Engineering',
        degree: user.degree || 'B.Tech Computer Science',
        rollNo: user.rollNo || '',
        year: user.year || '',
        semester: user.semester || '',
        campusResidence: user.campusResidence || '',
        designation: user.designation || '',
        employeeId: user.employeeId || '',
        officeRoom: user.officeRoom || '',
        officeHours: user.officeHours || '',
        bio: user.bio || '',
        avatar: user.avatar || AVATAR_PRESETS[0]
      })
      if (user.preferences?.notifications) {
        setNotifPrefs(user.preferences.notifications)
      }
    }
  }, [user])

  // Fetch recent notification dispatches
  useEffect(() => {
    let isMounted = true
    const fetchLogs = async () => {
      setLoadingLogs(true)
      try {
        const res = await api.getNotifications(10)
        if (isMounted && res?.data) {
          setNotificationLogs(res.data)
        }
      } catch (err) {
        // quiet fallback
      } finally {
        if (isMounted) setLoadingLogs(false)
      }
    }
    if (activeTab === 'notifications') {
      fetchLogs()
    }
    return () => { isMounted = false }
  }, [activeTab])

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await updateProfile({
        email: user?.email,
        ...profileForm
      })
      showToast('Profile updated successfully.', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('New passwords do not match.', 'error')
      return
    }
    if (passwords.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error')
      return
    }
    setIsChangingPass(true)
    try {
      await api.changePassword(passwords.oldPassword, passwords.newPassword)
      showToast('Password updated securely with PBKDF2 hash.', 'success')
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      showToast(err.message || 'Error changing password.', 'error')
    } finally {
      setIsChangingPass(false)
    }
  }

  // Save Notification Preferences
  const handleToggleNotif = (channel) => {
    const updated = { ...notifPrefs, [channel]: !notifPrefs[channel] }
    setNotifPrefs(updated)
    api.updatePreferences({ notifications: updated }).catch(() => {})
    showToast(`Updated ${channel} notification preferences.`, 'info')
  }

  // Download Data Archive
  const handleDownloadArchive = () => {
    const archiveData = {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        dept: user?.dept,
        phone: user?.phone
      },
      exportTimestamp: new Date().toISOString(),
      institution: 'National Engineering College Autonomous',
      formatVersion: 'CEH_V2_DATA_ARCHIVE'
    }
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CEH_Profile_Archive_${user?.name?.replace(/[^a-z0-9]/gi, '_') || 'Scholar'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Personal data archive downloaded.', 'success')
  }

  const role = user?.role || 'student'

  return (
    <DashboardLayout role={role}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, margin: '0 0 6px' }}>{t('title.settings', 'Settings & System Personalization')}</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            Customize your interface appearance, visual themes, language, notification preferences, and account security.
          </p>
        </div>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="btn btn-outline btn-sm"
          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
        >
          🚪 {t('nav.signOut', 'Sign Out')}
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border)',
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        {[
          { id: 'appearance', label: '🎨 ' + t('title.appearance', 'Appearance & Themes') },
          { id: 'profile', label: '👤 Profile Management' },
          { id: 'security', label: '🔒 Security & Passwords' },
          { id: 'notifications', label: '🔔 Communication & Alerts' },
          { id: 'language', label: '🌐 Language & Regional' },
          { id: 'privacy', label: '🛡️ Privacy & Data Archive' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--ink-soft)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: APPEARANCE & THEMES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Theme Mode Card */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, margin: '0 0 4px' }}>🌗 {t('appearance.theme', 'Theme Mode')}</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Switch between High-Contrast Dark Mode and Crisp Institutional Light Mode.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                onClick={() => theme === 'dark' && toggleTheme()}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: '#FFFDF9',
                  color: '#2C1810',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: theme === 'light' ? '0 4px 14px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>☀️</div>
                <strong>{t('appearance.light', 'Light Mode')}</strong>
                <div style={{ fontSize: 11.5, color: '#666', marginTop: 4 }}>Clean parchment & sand</div>
              </div>

              <div
                onClick={() => theme === 'light' && toggleTheme()}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: '#0B0F17',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: theme === 'dark' ? '0 4px 14px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🌙</div>
                <strong>{t('appearance.dark', 'Dark Mode')}</strong>
                <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 4 }}>High-contrast dark canvas</div>
              </div>
            </div>
          </div>

          {/* Color Palette Card */}
          <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 18, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🎨</span>
                  <span>{t('appearance.accent', 'Entire Portal Color & Background Theme')}</span>
                </h3>
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                  Select a theme color below. The <b>entire background</b>, surfaces, cards, sidebar, navbar, borders, and ambient lighting will immediately transform.
                </p>
              </div>

              {/* Active Color Status Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'var(--surface-2)',
                border: '1.5px solid var(--border)',
                fontSize: 12.5,
                fontWeight: 600
              }}>
                <span style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary-glow)',
                  display: 'inline-block'
                }} />
                <span>Active Theme: <b>{activePalette?.name || 'Classic Sandal'}</b></span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                  (Canvas: {theme === 'dark' ? activePalette?.darkBg : activePalette?.bg})
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginTop: 16 }}>
              {Object.values(ACCENT_PALETTES).map(palette => {
                const isSelected = accentColor === palette.id
                const paletteBg = theme === 'dark' ? palette.darkBg : palette.bg
                const paletteCard = theme === 'dark' ? palette.darkCard : palette.card
                const paletteBorder = theme === 'dark' ? palette.darkBorder : palette.border

                return (
                  <div
                    key={palette.id}
                    onClick={() => {
                      setAccentColor(palette.id)
                      showToast(`Applied ${palette.name}: Entire background transformed!`, 'success')
                    }}
                    style={{
                      padding: '14px 14px',
                      borderRadius: 12,
                      border: isSelected ? `2.5px solid ${palette.primary}` : '1.5px solid var(--border)',
                      background: isSelected ? 'var(--primary-soft)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 6px 20px ${palette.glow || 'var(--primary-glow)'}` : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Live Mini Preview Bar */}
                    <div style={{
                      height: 52,
                      borderRadius: 8,
                      background: paletteBg,
                      border: `1px solid ${paletteBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 12px',
                      marginBottom: 10,
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      {/* Mini Card Preview */}
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: paletteCard,
                        border: `1px solid ${paletteBorder}`,
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: theme === 'dark' ? palette.darkInk : palette.ink,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.primary }} />
                        Card
                      </div>

                      {/* Primary Dot */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: palette.primary,
                        boxShadow: `0 0 10px ${palette.glow || palette.primary}`,
                        border: '2px solid #fff'
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>
                          {palette.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                          {palette.desc || 'Complete Theme'}
                        </div>
                      </div>
                      {isSelected && (
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: '#fff',
                          background: palette.primary,
                          padding: '2px 8px',
                          borderRadius: 12
                        }}>
                          Active ✓
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Custom Color Background Transformer */}
            <div style={{
              marginTop: 22,
              padding: '16px 18px',
              borderRadius: 12,
              background: 'var(--surface-1)',
              border: '1.5px dashed var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <input
                  type="color"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value)
                    setCustomColor(e.target.value)
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    border: '2px solid var(--border)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none'
                  }}
                  title="Pick any custom color"
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>
                    🎯 Custom Background &amp; Accent Color Picker
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)', marginTop: 2 }}>
                    Pick ANY custom hex color to dynamically generate a custom background, surfaces, cards, and theme palette!
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="#C27E43"
                  className="mono"
                  style={{
                    width: 100,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: 12,
                    textAlign: 'center'
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (customInput) {
                      setCustomColor(customInput)
                      showToast(`Custom theme applied: Entire background transformed to ${customInput}!`, 'success')
                    }
                  }}
                  style={{ padding: '8px 16px', fontWeight: 700, fontSize: 12.5 }}
                >
                  Transform Entire Background →
                </button>
              </div>
            </div>
          </div>

          {/* Font Scaling Card */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, margin: '0 0 4px' }}>📏 {t('appearance.fontSize', 'Font Scaling Size')}</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Adjust application font size for enhanced reading comfort on screens of all sizes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {Object.values(FONT_SIZES).map(s => {
                const isSelected = fontSize === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setFontSize(s.id)
                      showToast(`Font scaled to ${s.label}`, 'info')
                    }}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-soft)' : 'var(--surface-2)',
                      color: isSelected ? 'var(--primary)' : 'var(--ink)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: s.size,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Typography Style Card */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, margin: 0 }}>🔤 {t('appearance.fontStyle', 'Typography Style')}</h3>
              <button
                type="button"
                onClick={() => {
                  resetAppearance()
                  showToast('Restored default appearance system.', 'success')
                }}
                className="btn btn-outline btn-xs"
              >
                ↺ Reset
              </button>
            </div>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Select your preferred typeface family across the platform.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {Object.values(FONT_STYLES).map(style => {
                const isSelected = fontStyle === style.id
                return (
                  <div
                    key={style.id}
                    onClick={() => {
                      setFontStyle(style.id)
                      showToast(`Typography set to ${style.label}`, 'info')
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid var(--orange)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--orange-soft)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      fontFamily: style.family
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{style.label}</span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>The quick brown fox</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PROFILE MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <div className="card" style={{ padding: 28, maxWidth: 800 }}>
          <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>👤 Institutional Profile Details</h3>
          <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
            Manage your academic credentials, communication phone number, and student bio.
          </p>

          <form onSubmit={handleSaveProfile}>
            {/* Avatar Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>
                Profile Avatar
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--orange)' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => setProfileForm({ ...profileForm, avatar: p })}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: profileForm.avatar === p ? '2px solid var(--orange)' : '1px solid var(--border)',
                        opacity: profileForm.avatar === p ? 1 : 0.65
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Institutional Email (SSO Identity)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.7, background: 'var(--surface-2)', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Academic Department
                </label>
                <input
                  type="text"
                  value={profileForm.dept}
                  onChange={(e) => setProfileForm({ ...profileForm, dept: e.target.value })}
                />
              </div>

              {user?.role === 'student' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Degree Program
                    </label>
                    <input
                      type="text"
                      value={profileForm.degree}
                      onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Roll / Registration Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.rollNo}
                      onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                      placeholder="e.g. 23CS082"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      placeholder="e.g. 3rd Year"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Semester
                    </label>
                    <input
                      type="text"
                      value={profileForm.semester}
                      onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                      placeholder="e.g. 5th Semester"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Campus Residence / Hostel
                    </label>
                    <input
                      type="text"
                      value={profileForm.campusResidence}
                      onChange={(e) => setProfileForm({ ...profileForm, campusResidence: e.target.value })}
                      placeholder="e.g. Campus Hostel Block C - Room 304"
                    />
                  </div>
                </>
              )}

              {(user?.role === 'instructor' || user?.role === 'faculty_od' || user?.role === 'admin') && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      value={profileForm.designation}
                      onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Employee / Officer ID
                    </label>
                    <input
                      type="text"
                      value={profileForm.employeeId}
                      onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Office Room / Cabin
                    </label>
                    <input
                      type="text"
                      value={profileForm.officeRoom}
                      onChange={(e) => setProfileForm({ ...profileForm, officeRoom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                      Office Consultation Hours
                    </label>
                    <input
                      type="text"
                      value={profileForm.officeHours}
                      onChange={(e) => setProfileForm({ ...profileForm, officeHours: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                Biography & Academic Interests
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Saving...' : '💾 ' + t('action.save', 'Save Changes')}
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: SECURITY & PASSWORDS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Change Password Form */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>🔒 Change Password</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Passwords are protected using PBKDF2 cryptographic hashing with unique random salts.
            </p>

            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isChangingPass}
              >
                {isChangingPass ? 'Updating...' : '🔐 Update Password'}
              </button>
            </form>
          </div>

          {/* Active Session Info */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>🛡️ Institutional Session Info</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
              Details regarding your authenticated cryptographic JWT session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Token Standard</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal)' }}>JSON Web Token (JWT) - HS256 HMAC</div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Account Role & Scope</div>
                <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>
                  {user?.role?.replace('_', ' ') || 'Student'} (Institutional Verified)
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Session Lifetime</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>8 Hours with 7-Day Refresh Token Rotation</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: NOTIFICATIONS & COMMUNICATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Channel Preferences Card */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>📢 Notification Channels</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
              Choose which channels receive event reminders, approval updates, and On-Duty clearance alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>✉️</span> Email Notifications
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>Registration confirmations, password reset emails, and weekly digests</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.email}
                  onChange={() => handleToggleNotif('email')}
                  style={{ width: 20, height: 20, cursor: 'pointer' }}
                />
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>💬</span> WhatsApp Alerts
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>Instant OD clearance sanctions and digital QR passes via template <code style={{ fontSize: 11 }}>CEH_OD_APPROVED_V1</code></div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.whatsapp}
                  onChange={() => handleToggleNotif('whatsapp')}
                  style={{ width: 20, height: 20, cursor: 'pointer' }}
                />
              </div>

              {/* SMS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📱</span> SMS Broadcasts
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>Urgent event day-of check-in alerts and OTP verifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.sms}
                  onChange={() => handleToggleNotif('sms')}
                  style={{ width: 20, height: 20, cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Delivery Log History */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>📜 Communication Delivery Logs</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
              Recent institutional notifications sent to your registered address and mobile.
            </p>

            {loadingLogs ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-soft)' }}>Loading delivery logs...</div>
            ) : notificationLogs.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-soft)' }}>No recent notifications.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notificationLogs.map(log => (
                  <div key={log.id} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ color: 'var(--ink)' }}>{log.title}</strong>
                      <span className="badge tag-teal" style={{ textTransform: 'uppercase', fontSize: 10 }}>
                        {log.channel} · {log.status}
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{log.message}</div>
                    <div className="mono muted" style={{ fontSize: 10 }}>{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: LANGUAGE & REGIONAL */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'language' && (
        <div className="card" style={{ padding: 28, maxWidth: 650 }}>
          <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>🌐 {t('appearance.language', 'Language Selection')}</h3>
          <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
            Choose your preferred language. All navigation bars, action buttons, titles, and headers update immediately.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { code: 'en', flag: '🇺🇸', name: 'English (Default)', note: 'Full institutional terminology' },
              { code: 'ta', flag: '🇮🇳', name: 'தமிழ் (Tamil)', note: 'வளாக நிகழ்வு மையம் தமிழ் இடைமுகம்' },
              { code: 'hi', flag: '🇮🇳', name: 'हिन्दी (Hindi)', note: 'कैंपस इवेंट हब हिन्दी इंटरफ़ेस' }
            ].map(langItem => {
              const isSelected = language === langItem.code
              return (
                <div
                  key={langItem.code}
                  onClick={() => {
                    setLanguage(langItem.code)
                    showToast(`Language set to ${langItem.name}`, 'success')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderRadius: 10,
                    border: isSelected ? '2px solid var(--orange)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--orange-soft)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 26 }}>{langItem.flag}</span>
                    <div>
                      <strong style={{ fontSize: 15, color: isSelected ? 'var(--orange)' : 'var(--ink)' }}>
                        {langItem.name}
                      </strong>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{langItem.note}</div>
                    </div>
                  </div>
                  {isSelected && <span style={{ fontSize: 18, color: 'var(--orange)', fontWeight: 800 }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: PRIVACY & DATA ARCHIVE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'privacy' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>📦 Institutional Data Archive</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Download a structured JSON archive containing your full student profile, club memberships, and OD permission records.
            </p>
            <button
              onClick={handleDownloadArchive}
              className="btn btn-outline"
            >
              📥 Download My Personal Data (.json)
            </button>
          </div>

          <div className="card" style={{ padding: 24, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <h3 style={{ fontSize: 18, margin: '0 0 6px', color: '#ef4444' }}>⚠️ Account Session Actions</h3>
            <p className="muted" style={{ fontSize: 13, margin: '0 0 18px' }}>
              Securely terminate your current session on this browser device.
            </p>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="btn"
              style={{ background: '#ef4444', color: '#fff', border: 'none' }}
            >
              Sign Out & Invalidate Session
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
