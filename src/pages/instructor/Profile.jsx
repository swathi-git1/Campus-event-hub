import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80"
]

export default function InstructorProfile() {
  const { user, updateProfile } = useAuth()
  const { clubs, memberships, events, achievements } = useData()
  const { showToast } = useToast()
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Find club assigned strictly to this instructor
  const assignedClubName = user?.assignedClub || 'CSI'
  const assignedClub = clubs.find(c => c.name.toLowerCase() === assignedClubName.toLowerCase()) || clubs[0]

  // Filter club-specific statistics
  const clubMemberships = memberships.filter(m => m.clubName.toLowerCase() === assignedClub.name.toLowerCase())
  const pendingCount = clubMemberships.filter(m => m.status === 'pending').length
  const approvedCount = clubMemberships.filter(m => m.status === 'approved').length
  const clubEvents = events.filter(e => e.club.toLowerCase() === assignedClub.name.toLowerCase())
  const clubAchievements = achievements.filter(a => a.club.toLowerCase() === assignedClub.name.toLowerCase())

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Dr. K. Ramanathan',
    designation: user?.designation || 'Associate Professor & Faculty Advisor',
    dept: user?.dept || 'Computer Science & Engineering',
    employeeId: user?.employeeId || 'FAC-CSE-408',
    officeRoom: user?.officeRoom || 'CSE Block - Room 312',
    officeHours: user?.officeHours || 'Mon, Wed, Fri: 2:00 PM – 4:00 PM',
    phone: user?.phone || '+91 94441 23890',
    bio: user?.bio || 'Ph.D. in Distributed Computing. Faculty Advisor for CSI Chapter since 2021.',
    specializations: Array.isArray(user?.specializations) ? user.specializations.join(', ') : (user?.specializations || 'Distributed Systems, Cloud Computing, AI'),
    avatar: user?.avatar || AVATAR_PRESETS[0]
  })

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || '',
      designation: user?.designation || '',
      dept: user?.dept || '',
      employeeId: user?.employeeId || '',
      officeRoom: user?.officeRoom || '',
      officeHours: user?.officeHours || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      specializations: Array.isArray(user?.specializations) ? user.specializations.join(', ') : (user?.specializations || ''),
      avatar: user?.avatar || AVATAR_PRESETS[0]
    })
    setShowEditModal(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const specs = typeof editForm.specializations === 'string'
        ? editForm.specializations.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(editForm.specializations) ? editForm.specializations : [])

      await updateProfile({
        name: editForm.name,
        designation: editForm.designation,
        dept: editForm.dept,
        employeeId: editForm.employeeId,
        officeRoom: editForm.officeRoom,
        officeHours: editForm.officeHours,
        phone: editForm.phone,
        bio: editForm.bio,
        specializations: specs,
        avatar: editForm.avatar
      })
      showToast('Faculty profile updated successfully!', 'success')
      setShowEditModal(false)
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout role="instructor">
      {/* Faculty Profile Header */}
      <div className="card" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, var(--card) 0%, rgba(185,106,36,0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'}
                alt={user?.name}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--card)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
              />
              <span style={{ position: 'absolute', bottom: 2, right: 2, background: 'var(--amber)', width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff' }} title="Designated Faculty Advisor" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, margin: 0 }}>{user?.name || 'Dr. K. Ramanathan'}</h1>
                <span className="badge tag-amber">Lead Faculty Advisor</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-soft)', padding: '3px 8px', borderRadius: 6 }}>
                  #{user?.employeeId || 'FAC-CSE-408'}
                </span>
              </div>

              <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>
                🏛️ <b>{user?.designation || 'Associate Professor & Faculty Advisor'}</b> · {user?.dept || 'CSE Dept'}
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--ink-soft)', flexWrap: 'wrap' }}>
                <span>📧 {user?.email || 'csi.advisor@college.edu'}</span>
                <span>📞 {user?.phone || '+91 94441 23890'}</span>
                <span>🚪 {user?.officeRoom || 'Room 312'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={handleOpenEdit}>
              ✏️ Edit Faculty Credentials
            </button>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)', maxWidth: 780, margin: '18px 0 0', padding: '14px 16px', background: 'var(--bg)', borderRadius: 12 }}>
          "{user?.bio || 'Ph.D. in Distributed Computing. Faculty Advisor for chapter activities and student mentorship.'}"
        </p>

        {/* Office Hours Strip */}
        <div style={{ display: 'flex', gap: 24, paddingTop: 16, marginTop: 16, borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--ink-soft)', flexWrap: 'wrap' }}>
          <div><b>🕒 Office Consultation Hours:</b> {user?.officeHours || 'Mon, Wed, Fri: 2:00 PM – 4:00 PM'}</div>
          <div><b>🏢 Office Cabin:</b> {user?.officeRoom || 'CSE Block - Room 312'}</div>
          <div><b>🔒 Portal Access:</b> Confidential Faculty Session</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ASSIGNED CHAPTER CHARTER (STRICT 1-TO-1 CONFIDENTIAL ALLOCATION) */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 24, marginBottom: 24, borderLeft: '6px solid var(--indigo)', background: 'linear-gradient(135deg, var(--card) 0%, rgba(67,56,202,0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              <h2 style={{ fontSize: 20, margin: 0 }}>Assigned Chapter: {assignedClub.name} Society</h2>
              <span className={`badge ${assignedClub.tagClass || 'tag-indigo'}`}>{assignedClub.cat}</span>
              <span className="badge tag-green">Sole Designated Advisor</span>
            </div>
            <div className="muted" style={{ fontSize: 13, maxWidth: 700 }}>
              You are the designated Lead Faculty Advisor for <b>{assignedClub.fullName || assignedClub.name}</b>. All student membership dossiers, event registrations, live attendance controls, and chapter announcements are routed exclusively and securely to your dashboard.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/instructor/memberships" className="btn btn-amber btn-sm">
              👥 Review Applications ({pendingCount})
            </Link>
            <Link to="/instructor/events" className="btn btn-primary btn-sm">
              + Manage Chapter Events
            </Link>
          </div>
        </div>

        {/* Club Metrics Grid */}
        <div className="stat-strip" style={{ margin: '18px 0 16px', padding: '14px 0' }}>
          <div>
            <div className="stat-num" style={{ color: 'var(--green)' }}>{assignedClub.members}</div>
            <div className="stat-label">Accredited Members</div>
          </div>
          <div>
            <div className="stat-num" style={{ color: pendingCount > 0 ? 'var(--amber)' : 'inherit' }}>
              {pendingCount}
            </div>
            <div className="stat-label">Pending Applications</div>
          </div>
          <div>
            <div className="stat-num">{clubEvents.length}</div>
            <div className="stat-label">Chapter Events</div>
          </div>
          <div>
            <div className="stat-num">{clubAchievements.length}</div>
            <div className="stat-label">Published Articles</div>
          </div>
          <div>
            <div className="stat-num" style={{ color: 'var(--indigo)' }}>
              {assignedClub.membershipFee > 0 ? `₹${assignedClub.membershipFee}` : 'Free'}
            </div>
            <div className="stat-label">Annual Member Fee</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 12.5, color: 'var(--ink-soft)' }}>
          <div>
            Admissions Status: <b>{assignedClub.membershipOpen ? '🟢 Open on Portal' : '🔴 Closed'}</b> · Eligibility: {assignedClub.eligibility}
          </div>
          <Link to={`/student/clubs/${encodeURIComponent(assignedClub.name)}`} style={{ color: 'var(--indigo)', fontWeight: 600 }}>
            Preview Chapter Public View →
          </Link>
        </div>
      </div>

      {/* Student Leadership Team under this Faculty Advisor */}
      {assignedClub.studentTeam && assignedClub.studentTeam.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 17, margin: 0 }}>Chapter Student Leadership & Organizing Committee</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: '3px 0 0' }}>
                Student coordinators and conducting leads working under your mentorship.
              </p>
            </div>
            <Link to="/instructor/memberships" className="btn btn-outline btn-sm">
              Manage Roles & Permissions →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {assignedClub.studentTeam.map((stu, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={stu.avatar} alt={stu.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{stu.name}</div>
                  <div className="muted mono" style={{ fontSize: 11 }}>{stu.rollNo} · {stu.dept}</div>
                  <span className={`badge ${stu.roleCategory === 'conducting' ? 'tag-purple' : stu.roleCategory === 'managing' ? 'tag-amber' : stu.roleCategory === 'tech' ? 'tag-indigo' : 'tag-slate'}`} style={{ fontSize: 9.5, marginTop: 4 }}>
                    {stu.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT FACULTY MODAL */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="card" style={{ maxWidth: 540, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Edit Faculty Credentials</h3>
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
                        border: editForm.avatar === av ? '3px solid var(--amber)' : '2px solid var(--border)'
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
                  <label>Employee ID *</label>
                  <input
                    value={editForm.employeeId}
                    onChange={e => setEditForm({ ...editForm, employeeId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div className="field">
                  <label>Academic Designation</label>
                  <input
                    value={editForm.designation}
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
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
                  <label>Office Cabin Room</label>
                  <input
                    value={editForm.officeRoom}
                    onChange={e => setEditForm({ ...editForm, officeRoom: e.target.value })}
                    placeholder="e.g. CSE Block - Room 312"
                  />
                </div>
                <div className="field">
                  <label>Contact Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Office Consultation Hours</label>
                <input
                  value={editForm.officeHours}
                  onChange={e => setEditForm({ ...editForm, officeHours: e.target.value })}
                  placeholder="e.g. Mon, Wed, Fri: 2:00 PM – 4:00 PM"
                />
              </div>

              <div className="field">
                <label>Faculty Bio & Research Summary</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Specializations (Comma-separated)</label>
                <input
                  value={editForm.specializations}
                  onChange={e => setEditForm({ ...editForm, specializations: e.target.value })}
                  placeholder="Distributed Systems, Cloud Computing, AI..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Faculty Info'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
