import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

export default function ManageMemberships() {
  const { user } = useAuth()
  const { memberships, clubs, approveMembership, denyMembership, assignStudentClubRole, updateClubSettings } = useData()

  const assignedClubName = user?.assignedClub || 'CSI'
  const assignedClub = clubs.find(c => c.name.toLowerCase() === assignedClubName.toLowerCase()) || clubs[0]

  const [filter, setFilter] = useState('pending') // 'pending', 'approved', 'all'
  const [feedbackNote, setFeedbackNote] = useState('')
  const [rejectingAppId, setRejectingAppId] = useState(null)
  const [showClubSettings, setShowClubSettings] = useState(false)
  const [settingsFee, setSettingsFee] = useState(assignedClub.membershipFee || 200)
  const [settingsOpen, setSettingsOpen] = useState(assignedClub.membershipOpen ?? true)

  // Role Assignment Modal State
  const [roleModalMember, setRoleModalMember] = useState(null)
  const [roleTitle, setRoleTitle] = useState('')
  const [roleCategory, setRoleCategory] = useState('conducting') // 'conducting', 'managing', 'tech', 'design', 'member'

  // Filter applications scoped strictly to this instructor's club
  const clubApps = memberships.filter(m => m.clubName.toLowerCase() === assignedClubName.toLowerCase())
  const pendingApps = clubApps.filter(m => m.status === 'pending')
  const approvedApps = clubApps.filter(m => m.status === 'approved')

  const displayedApps = filter === 'pending' ? pendingApps : filter === 'approved' ? approvedApps : clubApps

  const totalFeesCollected = approvedApps
    .filter(m => m.paymentStatus === 'PAID')
    .reduce((sum, m) => sum + (m.feeAmount || 0), 0)

  const handleApprove = (appId) => {
    approveMembership(appId, `Verified & Approved by Faculty Advisor ${user?.name || ''}. Welcome to ${assignedClubName} Chapter.`)
  }

  const handleConfirmDeny = () => {
    if (!rejectingAppId) return
    denyMembership(rejectingAppId, feedbackNote || "Capacity full or prerequisites not met.")
    setRejectingAppId(null)
    setFeedbackNote('')
  }

  const handleOpenRoleModal = (app) => {
    setRoleModalMember(app)
    setRoleTitle(app.assignedRole || app.rolePreference || 'Student Conducting Lead')
    setRoleCategory(app.roleCategory || 'conducting')
  }

  const handleSaveRole = (e) => {
    e.preventDefault()
    if (!roleModalMember || !roleTitle.trim()) return
    assignStudentClubRole(roleModalMember.id, roleTitle.trim(), roleCategory)
    setRoleModalMember(null)
  }

  const handleSaveSettings = (e) => {
    e.preventDefault()
    updateClubSettings(assignedClubName, {
      membershipFee: Number(settingsFee),
      membershipOpen: settingsOpen
    })
    setShowClubSettings(false)
  }

  return (
    <DashboardLayout role="instructor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Manage {assignedClubName} Chapter Memberships & Hierarchy</h1>
            <span className="badge tag-indigo">{user?.name} (Faculty Lead)</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Review incoming student dossiers, verify statement of purpose & payments, and assign student conducting / managing leadership roles.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={() => {
          setSettingsFee(assignedClub.membershipFee || 0)
          setSettingsOpen(assignedClub.membershipOpen ?? true)
          setShowClubSettings(true)
        }}>
          ⚙️ Chapter Fee & Intake Settings
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stat-strip">
        <div>
          <div className="stat-num" style={{ color: pendingApps.length > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingApps.length}
          </div>
          <div className="stat-label">Pending Review Dossiers</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--green)' }}>{approvedApps.length}</div>
          <div className="stat-label">Accredited Club Members</div>
        </div>
        <div>
          <div className="stat-num">{clubApps.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>₹{totalFeesCollected}</div>
          <div className="stat-label">Verified Membership Fees</div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div className="tabs" style={{ maxWidth: 460, margin: 0 }}>
          <div className={'tab' + (filter === 'pending' ? ' active' : '')} onClick={() => setFilter('pending')}>
            ⏳ Pending Dossiers ({pendingApps.length})
          </div>
          <div className={'tab' + (filter === 'approved' ? ' active' : '')} onClick={() => setFilter('approved')}>
            👥 Approved Members & Roles ({approvedApps.length})
          </div>
          <div className={'tab' + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>
            All Applications ({clubApps.length})
          </div>
        </div>

        <span className="muted" style={{ fontSize: 12.5 }}>
          🔒 Strictly confidential to <b>{assignedClubName} Chapter Advisor</b>
        </span>
      </div>

      {/* Applications / Members List */}
      {displayedApps.length === 0 ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <h3>No applications in this view</h3>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            {filter === 'pending' ? `All student applications for ${assignedClubName} have been reviewed!` : 'No records found for the selected filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {displayedApps.map(app => (
            <div className="applicant-card" key={app.id}>
              <div className="applicant-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 17, margin: 0 }}>{app.studentName}</h3>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 700 }}>({app.rollNo})</span>
                    <span className="badge tag-indigo">{app.clubName}</span>

                    {/* Assigned Student Role Badge */}
                    {app.assignedRole && app.status === 'approved' && (
                      <span className={`badge ${app.roleCategory === 'conducting' ? 'tag-purple' : app.roleCategory === 'managing' ? 'tag-amber' : app.roleCategory === 'tech' ? 'tag-indigo' : 'tag-green'}`}>
                        🎖️ {app.assignedRole}
                      </span>
                    )}
                  </div>

                  <div className="muted" style={{ fontSize: 12 }}>
                    📧 {app.studentEmail} · 📞 {app.phone} · 📅 Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {app.paymentStatus === 'PAID' ? (
                    <span className="badge-paid">
                      💳 Fee Paid: ₹{app.feeAmount}
                    </span>
                  ) : (
                    <span className="badge-free">Free Join</span>
                  )}

                  {app.status === 'pending' ? (
                    <span className="badge-pending">⏳ Awaiting Decision</span>
                  ) : app.status === 'approved' ? (
                    <span className="badge-approved">✓ Member Approved</span>
                  ) : (
                    <span className="badge-denied">✕ Denied</span>
                  )}
                </div>
              </div>

              {/* Applicant Details Grid */}
              <div className="applicant-details-grid">
                <div><b>Department & Year:</b> {app.dept} · {app.year}</div>
                <div><b>Preferred Role:</b> <span style={{ color: 'var(--indigo)', fontWeight: 600 }}>{app.rolePreference}</span></div>
                <div><b>Technical Skills:</b> {app.skills || 'Not specified'}</div>
                {app.paymentDetails && (
                  <div>
                    <b>Payment Reference:</b> {app.paymentDetails.method} (<code>{app.paymentDetails.txnId}</code>)
                  </div>
                )}
              </div>

              {/* Statement of Purpose */}
              {app.sop && (
                <div className="applicant-sop">
                  <div style={{ fontWeight: 700, fontSize: 11.5, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 4 }}>
                    Statement of Purpose & Motivation:
                  </div>
                  "{app.sop}"
                </div>
              )}

              {/* Review Notes (If already approved/denied) */}
              {app.reviewNotes && (
                <div style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--bg)', marginBottom: 14, color: 'var(--ink-soft)' }}>
                  <b>Faculty Advisor Notes:</b> {app.reviewNotes}
                </div>
              )}

              {/* Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  {app.status === 'approved' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenRoleModal(app)}
                    >
                      🎖️ Assign / Change Student Role ({app.assignedRole || 'General Member'})
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {app.status === 'pending' && (
                    <>
                      <button
                        className="btn-deny"
                        onClick={() => setRejectingAppId(app.id)}
                      >
                        ✕ Deny (Reject)
                      </button>
                      <button
                        className="btn-allow"
                        onClick={() => handleApprove(app.id)}
                      >
                        ✓ Allow & Approve Membership
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSIGN STUDENT ROLE MODAL (HIERARCHY DIFFERENTIATION) */}
      {/* ========================================================================= */}
      {roleModalMember && (
        <div className="modal-backdrop" onClick={() => setRoleModalMember(null)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 26 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Assign Student Leadership Role</h3>
              <button onClick={() => setRoleModalMember(null)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Designate the operational role for <b>{roleModalMember.studentName} ({roleModalMember.rollNo})</b> under your faculty mentorship in {assignedClubName} Chapter.
            </p>

            <form onSubmit={handleSaveRole}>
              <div className="field">
                <label>Role Category *</label>
                <select
                  value={roleCategory}
                  onChange={e => {
                    const cat = e.target.value
                    setRoleCategory(cat)
                    if (cat === 'conducting') setRoleTitle('Student Conducting Lead')
                    else if (cat === 'managing') setRoleTitle('Event Operations & Attendance Manager')
                    else if (cat === 'tech') setRoleTitle('Technical Platform Coordinator')
                    else if (cat === 'design') setRoleTitle('Media, Poster & Design Lead')
                    else setRoleTitle('Active Club Member')
                  }}
                >
                  <option value="conducting">⚡ Conducting (Hosts & leads workshops/events)</option>
                  <option value="managing">📋 Managing & Operations (Registrations, venue & attendance)</option>
                  <option value="tech">💻 Technical Coordinator (Lab equipment, platforms & bots)</option>
                  <option value="design">🎨 Media & Design (Posters, branding & promotions)</option>
                  <option value="member">👥 General Member (Active participant)</option>
                </select>
              </div>

              <div className="field">
                <label>Official Role Title *</label>
                <input
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  placeholder="e.g. President & Student Conducting Lead"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setRoleModalMember(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Confirm Role Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deny / Rejection Feedback Modal */}
      {rejectingAppId && (
        <div className="modal-backdrop" onClick={() => setRejectingAppId(null)}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--danger)' }}>Deny Membership Request</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
              Provide a reason or feedback for the student regarding this denial.
            </p>
            <div className="field">
              <label>Reason / Feedback Note</label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={e => setFeedbackNote(e.target.value)}
                placeholder="e.g. Capacity limit reached for this wing, or please complete prerequisite course..."
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setRejectingAppId(null)}>Cancel</button>
              <button className="btn btn-sm" style={{ background: 'var(--danger)', color: '#fff' }} onClick={handleConfirmDeny}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Settings Modal */}
      {showClubSettings && (
        <div className="modal-backdrop" onClick={() => setShowClubSettings(false)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>{assignedClubName} Chapter Settings</h3>
              <button onClick={() => setShowClubSettings(false)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSettings}>
              <div className="field">
                <label>Membership Induction Fee (INR ₹)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={settingsFee}
                  onChange={e => setSettingsFee(e.target.value)}
                  placeholder="0 for Free, or amount like 200"
                />
                <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                  Set to 0 for Free admission, or specify kit & workshop access fee.
                </div>
              </div>

              <div className="field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settingsOpen}
                    onChange={e => setSettingsOpen(e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span>Admissions Open for Student Applications</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowClubSettings(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Chapter Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
