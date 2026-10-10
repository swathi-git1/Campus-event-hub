import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useTheme, ACCENT_PALETTES, FONT_SIZES, FONT_STYLES } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80"
]

export default function StudentProfile() {
  const { user, updateProfile } = useAuth()
  const { memberships, registrations, clubs } = useData()
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
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('academic')
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [customColorInput, setCustomColorInput] = useState(customHex || '#C27E43')

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Ananya Rao',
    rollNo: user?.rollNo || '23CS082',
    dept: user?.dept || 'Computer Science & Engineering',
    degree: user?.degree || 'B.Tech Computer Science',
    year: user?.year || '3rd Year',
    semester: user?.semester || '5th Semester',
    cgpa: user?.cgpa || '9.18 / 10.0',
    academicStanding: user?.academicStanding || "Dean's Honor List",
    phone: user?.phone || '+91 98765 43210',
    campusResidence: user?.campusResidence || 'Campus Hostel Block C - Room 304',
    bio: user?.bio || 'Fullstack developer and competitive coder. Lead coordinator for CSI Chapter Hackathon Wing.',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || 'React.js, Node.js, Python, C++, Git'),
    avatar: user?.avatar || AVATAR_PRESETS[0]
  })

  // Filter student memberships
  const myMemberships = memberships.filter(m =>
    m.studentEmail === user?.email || m.studentName === user?.name || m.studentId === user?.id || m.studentId === 1001
  )

  const approvedMemberships = myMemberships.filter(m => m.status === 'approved')

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || 'Ananya Rao',
      rollNo: user?.rollNo || '23CS082',
      dept: user?.dept || 'Computer Science & Engineering',
      degree: user?.degree || 'B.Tech Computer Science',
      year: user?.year || '3rd Year',
      semester: user?.semester || '5th Semester',
      cgpa: user?.cgpa || '9.18 / 10.0',
      academicStanding: user?.academicStanding || "Dean's Honor List",
      phone: user?.phone || '+91 98765 43210',
      campusResidence: user?.campusResidence || 'Campus Hostel Block C - Room 304',
      bio: user?.bio || 'Fullstack developer and competitive coder.',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || 'React.js, Node.js, Python, C++, Git'),
      avatar: user?.avatar || AVATAR_PRESETS[0]
    })
    setShowEditModal(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const skillsArray = typeof editForm.skills === 'string'
        ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(editForm.skills) ? editForm.skills : [])

      await updateProfile({
        name: editForm.name,
        rollNo: editForm.rollNo,
        dept: editForm.dept,
        degree: editForm.degree,
        year: editForm.year,
        semester: editForm.semester,
        cgpa: editForm.cgpa,
        academicStanding: editForm.academicStanding,
        phone: editForm.phone,
        campusResidence: editForm.campusResidence,
        bio: editForm.bio,
        skills: skillsArray,
        avatar: editForm.avatar
      })
      showToast('Profile updated successfully!', 'success')
      setShowEditModal(false)
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout role="student">
      {/* Profile Header Card */}
      <div className="card" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, var(--card) 0%, rgba(67,56,202,0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.avatar || AVATAR_PRESETS[0]}
                alt={user?.name}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--card)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
              />
              <span style={{ position: 'absolute', bottom: 2, right: 2, background: 'var(--green)', width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff' }} title="Active Student" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, margin: 0 }}>{user?.name || 'Ananya Rao'}</h1>
                <span className="badge tag-indigo">Student Scholar</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo)', background: 'var(--indigo-soft)', padding: '3px 8px', borderRadius: 6 }}>
                  #{user?.rollNo || '23CS082'}
                </span>
              </div>

              <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>
                🎓 {user?.degree || 'B.Tech Computer Science'} · {user?.dept || 'CSE Dept'}
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--ink-soft)', flexWrap: 'wrap' }}>
                <span>📧 {user?.email || 'student@college.edu'}</span>
                <span>📞 {user?.phone || '+91 98765 43210'}</span>
                <span>📍 {user?.campusResidence || 'Hostel Block C'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={handleOpenEdit}>
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)', maxWidth: 780, margin: '18px 0 0', padding: '14px 16px', background: 'var(--bg)', borderRadius: 12 }}>
          "{user?.bio || 'Fullstack developer and competitive coder. Lead coordinator for CSI Chapter Hackathon Wing.'}"
        </p>

        {/* Quick Stats Strip */}
        <div style={{ display: 'flex', gap: 32, paddingTop: 18, marginTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div>
            <div className="stat-num" style={{ color: 'var(--green)' }}>{user?.cgpa?.split(' ')[0] || '9.18'}</div>
            <div className="stat-label">Cumulative GPA</div>
          </div>
          <div>
            <div className="stat-num">{approvedMemberships.length}</div>
            <div className="stat-label">Club Memberships</div>
          </div>
          <div>
            <div className="stat-num">{registrations.length}</div>
            <div className="stat-label">Event Passes</div>
          </div>
          <div>
            <div className="stat-num">{user?.certificates?.length || 3}</div>
            <div className="stat-label">Honors & Badges</div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="tabs" style={{ maxWidth: 780, marginBottom: 20 }}>
        <div className={'tab' + (activeTab === 'academic' ? ' active' : '')} onClick={() => setActiveTab('academic')}>
          Academic Details
        </div>
        <div className={'tab' + (activeTab === 'memberships' ? ' active' : '')} onClick={() => setActiveTab('memberships')}>
          Club Memberships ({approvedMemberships.length})
        </div>
        <div className={'tab' + (activeTab === 'events' ? ' active' : '')} onClick={() => setActiveTab('events')}>
          Event Passes ({registrations.length})
        </div>
        <div className={'tab' + (activeTab === 'certificates' ? ' active' : '')} onClick={() => setActiveTab('certificates')}>
          Honors & Badges
        </div>
        <div className={'tab' + (activeTab === 'appearance' ? ' active' : '')} onClick={() => setActiveTab('appearance')}>
          🎨 Appearance & Themes
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACADEMIC DETAILS */}
      {/* ========================================================================= */}
      {activeTab === 'academic' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16 }}>University Academic Dossier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13 }}>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Degree Program</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.degree || 'B.Tech Computer Science'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Registration / Roll No</div>
                <div className="mono" style={{ fontWeight: 700, color: 'var(--indigo)', marginTop: 2 }}>{user?.rollNo || '23CS082'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Department</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.dept || 'Computer Science & Engineering'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Year & Semester</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.year || '3rd Year'} · {user?.semester || '5th Sem'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Academic Standing</div>
                <div style={{ fontWeight: 600, color: 'var(--green)', marginTop: 2 }}>{user?.academicStanding || "Dean's Honor List"}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Campus Residence</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.campusResidence || 'Block C, Room 304'}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, marginBottom: 14 }}>Technical & Leadership Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {(Array.isArray(user?.skills) ? user.skills : (typeof user?.skills === 'string' ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : ['React.js', 'Node.js', 'Python', 'C++', 'System Design', 'Git'])).map((skill, idx) => (
                <span key={idx} className="badge tag-indigo" style={{ fontSize: 11.5, padding: '5px 10px' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="note-box" style={{ margin: 0, fontSize: 12 }}>
              <b>💡 Campus Note:</b> Skills and club leadership credentials are automatically synchronized with official university placement records.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLUB MEMBERSHIPS */}
      {/* ========================================================================= */}
      {activeTab === 'memberships' && (
        <div>
          {myMemberships.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <h3>No Club Memberships Yet</h3>
              <p style={{ fontSize: 13 }}>You haven't joined any campus clubs. Browse available societies and apply online.</p>
              <Link to="/student/clubs" className="btn btn-primary" style={{ marginTop: 14 }}>
                Explore Campus Clubs →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {myMemberships.map(m => {
                const clubObj = clubs.find(c => c.name.toLowerCase() === m.clubName.toLowerCase())
                return (
                  <div className="card" key={m.id} style={{ borderLeft: m.status === 'approved' ? '5px solid var(--green)' : '5px solid var(--amber)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontSize: 17, margin: 0 }}>{m.clubName} Chapter</h3>
                        <span className="muted" style={{ fontSize: 12 }}>{clubObj?.fullName || `${m.clubName} Society`}</span>
                      </div>
                      {m.status === 'approved' ? (
                        <span className="badge badge-approved">✓ Active Member</span>
                      ) : m.status === 'pending' ? (
                        <span className="badge badge-pending">⏳ Reviewing</span>
                      ) : (
                        <span className="badge badge-denied">✕ Denied</span>
                      )}
                    </div>

                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
                      <div><b>Assigned Wing:</b> <span style={{ color: 'var(--indigo)', fontWeight: 600 }}>{m.rolePreference}</span></div>
                      <div><b>Faculty Lead:</b> {clubObj?.leadInstructor || 'Faculty Advisor'}</div>
                      {m.paymentDetails && (
                        <div><b>Fee Receipt:</b> ₹{m.feeAmount} ({m.paymentDetails.method})</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)' }}>
                        {m.status === 'approved' ? `MEM-${m.clubName}-${m.rollNo || '23CS082'}` : `Ref: ${m.id}`}
                      </span>
                      <Link to={`/student/clubs/${encodeURIComponent(m.clubName)}`} style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 600 }}>
                        View Club →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EVENT PASSES */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div>
          {registrations.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
              <h3>No Event Passes</h3>
              <p style={{ fontSize: 13 }}>You are not currently enrolled in any events.</p>
              <Link to="/student/enroll" className="btn btn-primary" style={{ marginTop: 14 }}>Browse Open Events</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {registrations.map(reg => (
                <div className="card" key={reg.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="badge tag-green">● Confirmed Entry</span>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)' }}>#{reg.id}</span>
                  </div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{reg.eventTitle}</h3>
                  <div className="muted mono" style={{ fontSize: 12, marginBottom: 12 }}>
                    <div>🏛️ {reg.club} Chapter</div>
                    <div>📅 {reg.eventDate}</div>
                    <div>📍 {reg.venue}</div>
                    {reg.team && <div style={{ color: 'var(--indigo)', fontWeight: 600, marginTop: 4 }}>👥 Team: {reg.team}</div>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11.5 }}>
                    <span className="muted">Check-in Pass Ready</span>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>QR Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HONORS & CERTIFICATES */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {(user?.certificates || [
            { title: "National Hackathon 2026 Champion Pass", issuer: "CSI National Council", date: "Aug 2026", badge: "🏆 1st Place" },
            { title: "Smart Grid Research Volunteer", issuer: "IEEE Student Branch", date: "Jul 2026", badge: "📜 Merit" },
            { title: "Rural Digital Literacy Service Award", issuer: "NSS Outreach Unit", date: "May 2026", badge: "⭐ 60 Volunteer Hours" }
          ]).map((cert, idx) => (
            <div className="card" key={idx} style={{ background: 'linear-gradient(135deg, var(--card) 0%, rgba(245,158,11,0.04) 100%)', borderLeft: '4px solid var(--amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge tag-amber">{cert.badge}</span>
                <span className="mono muted" style={{ fontSize: 11 }}>{cert.date}</span>
              </div>
              <h3 style={{ fontSize: 15, marginBottom: 6 }}>{cert.title}</h3>
              <div className="muted" style={{ fontSize: 12 }}>Issued by: <b>{cert.issuer}</b></div>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--indigo)', fontWeight: 600 }}>
                ✓ Digitally Verified Credential
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ========================================================================= */}
      {/* TAB 5: APPEARANCE & THEMES */}
      {/* ========================================================================= */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Header Summary Card */}
          <div className="card" style={{ padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 19, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎨</span>
                <span>Portal Appearance &amp; Background Themes</span>
              </h3>
              <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>
                Choose any color theme to transform your <b>entire portal background</b>, surface cards, and workspace in real-time.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                fontSize: 12.5,
                fontWeight: 600
              }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }} />
                <span>{activePalette?.name || 'Classic Sandal'}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  resetAppearance()
                  showToast('Reset appearance to default warm sandal', 'info')
                }}
                style={{ fontSize: 12 }}
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Theme Mode Toggle (Light / Dark) */}
          <div className="card" style={{ padding: 22 }}>
            <h4 style={{ fontSize: 15, margin: '0 0 12px' }}>🌗 Theme Display Mode</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div
                onClick={() => theme === 'dark' && toggleTheme()}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: 'var(--card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: theme === 'light' ? '0 4px 14px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>☀️</div>
                <strong style={{ fontSize: 13.5 }}>Light Mode</strong>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>Luminous crisp canvas</div>
              </div>

              <div
                onClick={() => theme === 'light' && toggleTheme()}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: 'var(--card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: theme === 'dark' ? '0 4px 14px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>🌙</div>
                <strong style={{ fontSize: 13.5 }}>Dark Mode</strong>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>High-contrast nocturnal canvas</div>
              </div>
            </div>
          </div>

          {/* Color Palettes Grid (Changes Entire Background) */}
          <div className="card" style={{ padding: 22 }}>
            <h4 style={{ fontSize: 15, margin: '0 0 4px' }}>🎨 Entire Background &amp; Accent Themes</h4>
            <p className="muted" style={{ fontSize: 12.5, margin: '0 0 16px' }}>
              Selecting any theme immediately paints the entire background, sidebars, headers, cards, and accent buttons.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
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
                      showToast(`Applied ${palette.name}: Entire portal background transformed!`, 'success')
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: isSelected ? `2.5px solid ${palette.primary}` : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-soft)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 4px 16px ${palette.glow || 'var(--primary-glow)'}` : 'none',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {/* Live Preview Tile */}
                    <div style={{
                      height: 44,
                      borderRadius: 7,
                      background: paletteBg,
                      border: `1px solid ${paletteBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 10px',
                      marginBottom: 8
                    }}>
                      <div style={{
                        padding: '3px 6px',
                        borderRadius: 4,
                        background: paletteCard,
                        border: `1px solid ${paletteBorder}`,
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: theme === 'dark' ? palette.darkInk : palette.ink
                      }}>
                        Card
                      </div>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: palette.primary,
                        boxShadow: `0 0 8px ${palette.glow || palette.primary}`
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{palette.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-muted)' }}>{palette.desc}</div>
                      </div>
                      {isSelected && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: palette.primary, padding: '1px 6px', borderRadius: 10 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Custom Color Background Transformer */}
            <div style={{
              marginTop: 18,
              padding: '14px 16px',
              borderRadius: 10,
              background: 'var(--surface-1)',
              border: '1.5px dashed var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="color"
                  value={customColorInput}
                  onChange={(e) => {
                    setCustomColorInput(e.target.value)
                    setCustomColor(e.target.value)
                  }}
                  style={{
                    width: 38,
                    height: 38,
                    border: '2px solid var(--border)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none'
                  }}
                  title="Pick custom color"
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Custom Hex Color Picker</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Transforms entire background and interface</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  className="mono"
                  style={{ width: 90, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, textAlign: 'center' }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (customColorInput) {
                      setCustomColor(customColorInput)
                      showToast(`Custom theme applied: Entire background transformed to ${customColorInput}!`, 'success')
                    }
                  }}
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  Transform Entire Background →
                </button>
              </div>
            </div>
          </div>

          {/* Font Scaling & Styles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 14.5, margin: '0 0 10px' }}>📏 Font Size Scale</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {Object.values(FONT_SIZES).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFontSize(s.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: fontSize === s.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: fontSize === s.id ? 'var(--primary-soft)' : 'var(--card)',
                      color: 'var(--ink)',
                      fontWeight: fontSize === s.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 14.5, margin: '0 0 10px' }}>🔤 Typography Family</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.values(FONT_STYLES).map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontStyle(f.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: fontStyle === f.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: fontStyle === f.id ? 'var(--primary-soft)' : 'var(--card)',
                      color: 'var(--ink)',
                      fontWeight: fontStyle === f.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: 12,
                      textAlign: 'left'
                    }}
                  >
                    {f.label.split(' ')[0]} {f.label.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT STUDENT PROFILE MODAL */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="card" style={{ maxWidth: 540, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Edit Student Profile</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* Avatar Preset Selector */}
              <div className="field">
                <label>Profile Avatar Picture</label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  {AVATAR_PRESETS.map((av, i) => (
                    <img
                      key={i}
                      src={av}
                      alt="Preset"
                      onClick={() => setEditForm({ ...editForm, avatar: av })}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: editForm.avatar === av ? '3px solid var(--indigo)' : '2px solid var(--border)'
                      }}
                    />
                  ))}
                </div>
                <input
                  value={editForm.avatar}
                  onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="Or paste custom image URL (https://...)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Full Name *</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Roll / Reg Number *</label>
                  <input
                    value={editForm.rollNo}
                    onChange={e => setEditForm({ ...editForm, rollNo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Degree Program</label>
                  <input
                    value={editForm.degree}
                    onChange={e => setEditForm({ ...editForm, degree: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Department</label>
                  <input
                    value={editForm.dept}
                    onChange={e => setEditForm({ ...editForm, dept: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Academic Year</label>
                  <input
                    value={editForm.year}
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    placeholder="e.g. 3rd Year"
                  />
                </div>
                <div className="field">
                  <label>Semester</label>
                  <input
                    value={editForm.semester}
                    onChange={e => setEditForm({ ...editForm, semester: e.target.value })}
                    placeholder="e.g. 5th Semester"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Cumulative GPA / Score</label>
                  <input
                    value={editForm.cgpa}
                    onChange={e => setEditForm({ ...editForm, cgpa: e.target.value })}
                    placeholder="e.g. 9.18 / 10.0"
                  />
                </div>
                <div className="field">
                  <label>Academic Standing</label>
                  <input
                    value={editForm.academicStanding}
                    onChange={e => setEditForm({ ...editForm, academicStanding: e.target.value })}
                    placeholder="e.g. Dean's Honor List"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Mobile Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
                <div className="field">
                  <label>Campus Residence / Hostel</label>
                  <input
                    value={editForm.campusResidence}
                    onChange={e => setEditForm({ ...editForm, campusResidence: e.target.value })}
                    placeholder="e.g. Campus Hostel Block C - Room 304"
                  />
                </div>
              </div>

              <div className="field">
                <label>Bio / Tagline</label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Skills (Comma-separated)</label>
                <input
                  value={editForm.skills}
                  onChange={e => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="React.js, Node.js, Python, Git..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
