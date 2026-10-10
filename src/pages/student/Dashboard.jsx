import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { getEnrollStatus } from '../../data/mockData'
import { getAvailableMonths, getEventMonthYear } from '../../utils/reportGenerator'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { visibleEvents: events, registrations, memberships, achievements, clubs, permissionRequests, odRecords } = useData()

  const studentEmail = user?.email || 'student@college.edu'
  const myRequests = permissionRequests.filter(r => (r.studentEmail || '').toLowerCase() === studentEmail.toLowerCase())
  const myODRecords = odRecords.filter(od => (od.studentEmail || '').toLowerCase() === studentEmail.toLowerCase())
  const myRegs = registrations.filter(r => (r.email || '').toLowerCase() === studentEmail.toLowerCase())
  const myApprovedClubs = memberships.filter(m => m.status === 'approved' && (m.studentEmail === studentEmail || m.studentName === user?.name || m.studentId === 1001))
  const availableMonths = getAvailableMonths(events)
  const [selectedMonth, setSelectedMonth] = useState('September 2026')

  // Status counters for permissions & OD
  const pendingRequestsCount = myRequests.filter(r => r.status === 'Pending Approval').length
  const approvedCount = myRequests.filter(r => r.status === 'Approved').length
  const proofSubmittedCount = myRequests.filter(r => r.status === 'Proof Submitted' || r.status === 'Proof Verification Pending').length
  const odIssuedCount = myODRecords.length

  // Filter events for selected month
  const monthlyEvents = events.filter(e => {
    if (selectedMonth === 'all') return true
    return getEventMonthYear(e) === selectedMonth
  })

  // Check if current student has an appointed leadership role
  const leaderMembership = memberships.find(m =>
    (m.studentEmail === studentEmail || m.studentName === user?.name || m.studentId === user?.id || m.studentId === 1001) &&
    m.status === 'approved' &&
    m.assignedRole &&
    m.assignedRole !== 'General Member'
  )

  const coordinatorRole = user?.clubPosition || (leaderMembership ? {
    club: leaderMembership.clubName,
    title: leaderMembership.assignedRole,
    category: leaderMembership.roleCategory || 'conducting',
    isLead: true
  } : null)

  const coordinatingClub = coordinatorRole ? clubs.find(c => c.name.toLowerCase() === coordinatorRole.club.toLowerCase()) : null

  return (
    <DashboardLayout role="student">
      {/* 1. Student Personal Profile Header Banner */}
      <div className="card" style={{ padding: '22px 26px', marginBottom: 22, background: 'linear-gradient(135deg, var(--card) 0%, rgba(67,56,202,0.06) 100%)', borderLeft: '6px solid var(--indigo)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
                alt={user?.name || "Student"}
                style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
              />
              <span style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: 'var(--green)', border: '2px solid #fff' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, margin: 0 }}>{user?.name || 'Ananya Rao'}</h1>
                <span className="badge tag-indigo">{user?.rollNo || '23CS082'}</span>
                {coordinatorRole && (
                  <span className={`badge ${coordinatorRole.category === 'conducting' ? 'tag-purple' : 'tag-amber'}`}>
                    🎖️ {coordinatorRole.title}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>🏛️ <b>Dept:</b> {user?.dept || 'Computer Science & Engineering'}</span>
                <span>🎓 <b>Year:</b> {user?.year || '3rd Year (Class of 2027)'}</span>
                <span>✉️ <b>Email:</b> {user?.email || 'student@college.edu'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/student/permissions" className="btn btn-primary btn-sm">
              📝 Request Event Permission
            </Link>
            <Link to="/student/history" className="btn btn-outline btn-sm">
              🎖️ View My OD Passes ({odIssuedCount})
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Personal Portal Stat Strip */}
      <div className="stat-strip" style={{ marginBottom: 24 }}>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>{myRegs.length}</div>
          <div className="stat-label">Registered Events</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingRequestsCount > 0 ? 'var(--amber)' : 'inherit' }}>
            {myRequests.length}
          </div>
          <div className="stat-label">Permission Requests</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: approvedCount > 0 ? 'var(--green)' : 'inherit' }}>
            {approvedCount}
          </div>
          <div className="stat-label">Permissions Approved</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: proofSubmittedCount > 0 ? 'var(--purple)' : 'inherit' }}>
            {proofSubmittedCount}
          </div>
          <div className="stat-label">Proof In Verification</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>
            {odIssuedCount}
          </div>
          <div className="stat-label">Official OD Issued</div>
        </div>
        <div>
          <div className="stat-num">{myApprovedClubs.length}</div>
          <div className="stat-label">Club Memberships</div>
        </div>
      </div>

      {/* 3. Event Permission & On-Duty (OD) Management Desk Card */}
      <div className="card" style={{ padding: 22, marginBottom: 24, borderTop: '4px solid var(--purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>Event Permission & On-Duty (OD) Desk</h2>
              <span className="badge tag-purple">Active Tracking</span>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: '3px 0 0' }}>
              Track approval status for internal & external events, upload attendance proof, and receive verified OD passes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/student/permissions" className="btn btn-outline btn-sm">
              Manage All Requests →
            </Link>
          </div>
        </div>

        {myRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--bg)', borderRadius: 12, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>📝</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>No permission requests submitted yet</div>
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 12px' }}>
              Participating in inter-college competitions, symposiums, or hackathons? Submit a permission request to obtain On-Duty (OD).
            </p>
            <Link to="/student/permissions" className="btn btn-primary btn-sm">+ Submit Permission Request</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {myRequests.slice(0, 3).map(req => {
              const isApproved = req.status === 'Approved'
              const isODIssued = req.status === 'OD Issued'
              const isPending = req.status === 'Pending Approval'
              const isProofSubmitted = req.status === 'Proof Submitted'
              const isRejected = req.status === 'Rejected'

              return (
                <div
                  key={req.id}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className={`badge ${req.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`} style={{ fontSize: 10 }}>
                        {req.scope} · {req.eventType}
                      </span>
                      <span
                        className={`badge ${
                          isODIssued ? 'tag-teal' :
                          isApproved ? 'tag-green' :
                          isProofSubmitted ? 'tag-purple' :
                          isRejected ? 'tag-danger' : 'tag-amber'
                        }`}
                        style={{ fontSize: 10 }}
                      >
                        {isODIssued ? '🎖️ OD Issued' :
                         isApproved ? '✅ Permission Approved' :
                         isProofSubmitted ? '📷 Proof Submitted' :
                         isRejected ? '❌ Rejected' : '⏳ Pending Approval'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 15, margin: '0 0 6px', lineHeight: 1.3 }}>{req.eventName}</h3>
                    <div className="muted mono" style={{ fontSize: 11.5, marginBottom: 4 }}>
                      📅 {req.eventDate} · 📍 {req.venue.split(',')[0]}
                    </div>
                    <div className="muted" style={{ fontSize: 11.5, marginBottom: 8 }}>
                      🏛️ {req.organizer}
                    </div>

                    {/* Stage helper alert */}
                    {isApproved && (
                      <div style={{ fontSize: 11, background: 'var(--green-soft)', color: 'var(--green)', padding: '6px 10px', borderRadius: 6, marginBottom: 10, border: '1px solid var(--green)' }}>
                        💡 <b>Step 4:</b> Attend the event & upload participation proof to unlock OD.
                      </div>
                    )}
                    {isODIssued && (
                      <div style={{ fontSize: 11, background: 'var(--teal-soft)', color: 'var(--teal)', padding: '6px 10px', borderRadius: 6, marginBottom: 10, border: '1px solid var(--teal)' }}>
                        ✓ <b>OD Issued:</b> Pass #{req.odRecordId} ready.
                      </div>
                    )}
                    {isProofSubmitted && (
                      <div style={{ fontSize: 11, background: 'var(--purple-soft)', color: 'var(--purple)', padding: '6px 10px', borderRadius: 6, marginBottom: 10, border: '1px solid var(--purple)' }}>
                        ⏳ <b>Verification:</b> Faculty is reviewing your uploaded photos & certificate.
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>#{req.id}</span>
                    <Link to="/student/permissions" className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>
                      {isApproved ? 'Upload Proof →' : isODIssued ? 'View OD Pass →' : 'View Details →'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Attendance Check-in Desk */}
      {registrations.length > 0 && (
        <div className="card" style={{ padding: 18, marginBottom: 24, borderLeft: '5px solid var(--green)', background: 'var(--green-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14.5 }}>
                📍 Live Event Attendance & Check-In Desk
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 3 }}>
                Attending a campus session? Enter the 4-digit Venue PIN announced by the event coordinator to verify your attendance.
              </div>
            </div>
            <Link to="/student/registrations" className="btn btn-green btn-sm">
              Open Pass & Check In →
            </Link>
          </div>
        </div>
      )}

      {/* Monthly Events Conduction Explorer */}
      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Campus Events Calendar by Month</h2>
            <p className="muted" style={{ fontSize: 12.5, margin: '2px 0 0' }}>
              Explore what events are scheduled and conducted month-by-month across all college societies.
            </p>
          </div>
          <Link to="/student/enroll" className="btn btn-outline btn-sm">
            View Full Directory →
          </Link>
        </div>

        {/* Month Pills */}
        <div className="chip-row" style={{ marginBottom: 16, gap: 8 }}>
          <button
            className={`chip ${selectedMonth === 'all' ? 'on' : ''}`}
            onClick={() => setSelectedMonth('all')}
          >
            All Months ({events.length})
          </button>
          {availableMonths.map(m => {
            const count = events.filter(e => getEventMonthYear(e) === m).length
            return (
              <button
                key={m}
                className={`chip ${selectedMonth === m ? 'on' : ''}`}
                onClick={() => setSelectedMonth(m)}
              >
                {m} ({count})
              </button>
            )
          })}
        </div>

        {/* Monthly Events List */}
        {monthlyEvents.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: 20 }}>
            No events scheduled for {selectedMonth}.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {monthlyEvents.slice(0, 6).map(ev => {
              const status = getEnrollStatus(ev)
              return (
                <div
                  key={ev.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 14,
                    background: 'var(--bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className={`badge ${ev.tagClass || 'tag-indigo'}`}>{ev.club}</span>
                      {status.badge === 'active_conduction' ? (
                        <span className="status-pill-conduction" style={{ fontSize: 9.5 }}>⚡ Live</span>
                      ) : (
                        <span className="status-pill-live" style={{ fontSize: 9.5 }}>🟢 Open</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{ev.title}</div>
                    <div className="muted mono" style={{ fontSize: 11.5, marginBottom: 2 }}>📅 {ev.date}</div>
                    <div className="muted" style={{ fontSize: 11.5, marginBottom: 8 }}>📍 {ev.venue}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <span className="muted" style={{ fontSize: 11 }}>Cap: {ev.capacity || 100}</span>
                    <Link to={`/student/enroll/${ev.id}`} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>
                      Details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Open & Active Events */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ fontSize: 18, margin: 0 }}>Active & Live Events Now</div>
            <Link to="/student/enroll" style={{ fontSize: 12.5, color: 'var(--indigo)', fontWeight: 600 }}>View all →</Link>
          </div>

          {events.filter(e => getEnrollStatus(e).state === 'open').slice(0, 4).map(ev => {
            const status = getEnrollStatus(ev)
            return (
              <Link to={`/student/enroll/${ev.id}`} className="list-item" key={ev.id}>
                <div>
                  <div className="li-title">{ev.title}</div>
                  <div className="li-meta">
                    {ev.club} Chapter · <span className="mono">{ev.date}</span> · 📍 {ev.venue.split(' ')[0]}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {status.badge === 'active_conduction' ? (
                    <span className="status-pill-conduction">⚡ Conduction Active</span>
                  ) : (
                    <span className="status-pill-live">🟢 Open Now</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right: My Club Memberships */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ fontSize: 18, margin: 0 }}>My Club Memberships</div>
            <Link to="/student/clubs" style={{ fontSize: 12.5, color: 'var(--indigo)', fontWeight: 600 }}>Explore →</Link>
          </div>

          {memberships.length === 0 ? (
            <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div>You haven't joined any clubs yet.</div>
              <Link to="/student/clubs" className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Browse Chapters</Link>
            </div>
          ) : (
            memberships.slice(0, 3).map(m => (
              <div className="card" key={m.id} style={{ padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.clubName} Chapter</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>Wing: {m.rolePreference}</div>
                </div>
                <div>
                  {m.status === 'approved' ? (
                    <span className="badge badge-approved">✓ Member</span>
                  ) : m.status === 'pending' ? (
                    <span className="badge badge-pending">⏳ Reviewing</span>
                  ) : (
                    <span className="badge badge-denied">✕ Denied</span>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Quick link to achievements */}
          <div className="card" style={{ marginTop: 14, padding: 18, background: 'linear-gradient(135deg, var(--card) 0%, rgba(67,56,202,0.06) 100%)' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 14.5 }}>🏆 Read Recent Campus Achievements</h4>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 12px' }}>
              Check out victory stories, cash prizes, and research papers published this month.
            </p>
            <Link to="/student/achievements" className="btn btn-primary btn-sm">Read Stories Feed →</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
