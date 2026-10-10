import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import MonthlyEventsAnalytics from '../../components/MonthlyEventsAnalytics'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const { events, memberships, achievements, registrations, clubs } = useData()

  const assignedClubName = user?.assignedClub || 'CSI'
  const assignedClub = clubs.find(c => c.name.toLowerCase() === assignedClubName.toLowerCase()) || clubs[0]

  // Scoped to this instructor's assigned club
  const clubMemberships = memberships.filter(m => m.clubName.toLowerCase() === assignedClubName.toLowerCase())
  const pendingMemberships = clubMemberships.filter(m => m.status === 'pending')
  const clubEvents = events.filter(e => e.club.toLowerCase() === assignedClubName.toLowerCase())
  const clubAchievements = achievements.filter(a => a.club.toLowerCase() === assignedClubName.toLowerCase())

  return (
    <DashboardLayout role="instructor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Manage {assignedClub.name} Chapter</h1>
            <span className="badge tag-amber">Lead Faculty Advisor</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Welcome back, {user?.name || 'Faculty Advisor'} ({user?.dept || 'CSE'}). You manage the <b>{assignedClub.fullName || assignedClub.name}</b>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/instructor/memberships" className="btn btn-amber btn-sm">
            👥 Review {assignedClub.name} Memberships ({pendingMemberships.length})
          </Link>
          <Link to="/instructor/events" className="btn btn-primary btn-sm">+ Manage Events</Link>
        </div>
      </div>

      {/* Pending Membership Alert Banner */}
      {pendingMemberships.length > 0 && (
        <div className="card" style={{ background: 'var(--amber-soft)', borderLeft: '5px solid var(--amber)', padding: 18, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: 14.5 }}>
                🔔 {pendingMemberships.length} Student Membership {pendingMemberships.length === 1 ? 'Application Requires' : 'Applications Require'} Your Review for {assignedClub.name}!
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 3 }}>
                Students have submitted Statements of Purpose & verified fees for your club. Review and Allow (Approve) or Deny credentials.
              </div>
            </div>
            <Link to="/instructor/memberships" className="btn btn-amber btn-sm">
              Review {assignedClub.name} Requests Now →
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Row Scoped to this Instructor's Club */}
      <div className="stat-strip">
        <div>
          <div className="stat-num">{assignedClub.members}</div>
          <div className="stat-label">Total Accredited Members</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingMemberships.length > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingMemberships.length}
          </div>
          <div className="stat-label">Pending Review Dossiers</div>
        </div>
        <div>
          <div className="stat-num">{clubEvents.length}</div>
          <div className="stat-label">{assignedClub.name} Events</div>
        </div>
        <div>
          <div className="stat-num">{clubAchievements.length}</div>
          <div className="stat-label">Published Articles</div>
        </div>
      </div>

      {/* Monthly Conduction Tracking for Instructor's Club */}
      <MonthlyEventsAnalytics
        events={clubEvents}
        registrations={registrations}
        initialClub={assignedClubName}
        showClubFilter={false}
        role="instructor"
        currentUser={user}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'flex-start', marginTop: 24 }}>
        {/* Quick Actions & Hub */}
        <div>
          <div className="section-title" style={{ fontSize: 18, marginBottom: 14 }}>Advisor Action Hub</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Link to="/instructor/memberships" className="card" style={{ display: 'block', padding: 18, border: pendingMemberships.length > 0 ? '1px solid var(--amber)' : '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>👥</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>Membership Approvals</h3>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>Allow or deny student induction requests with fee verification.</p>
            </Link>

            <Link to="/instructor/events" className="card" style={{ display: 'block', padding: 18 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>Schedule & Conduction</h3>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>Open registrations, activate next conduction, or set capacity.</p>
            </Link>

            <Link to="/instructor/achievements" className="card" style={{ display: 'block', padding: 18 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>Post Chapter Article</h3>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>Publish rich article stories with pictures and winner lists.</p>
            </Link>

            <Link to="/instructor/profile" className="card" style={{ display: 'block', padding: 18 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>Faculty Profile & Switcher</h3>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>View your advisor credentials or switch between club personas.</p>
            </Link>
          </div>
        </div>

        {/* Recent Pending Requests for this Club */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ fontSize: 18, margin: 0 }}>{assignedClub.name} Membership Queue</div>
            <Link to="/instructor/memberships" style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 600 }}>Manage all →</Link>
          </div>

          {clubMemberships.length === 0 ? (
            <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--ink-soft)' }}>
              No applications for {assignedClub.name} yet.
            </div>
          ) : (
            clubMemberships.slice(0, 4).map(app => (
              <div className="card" key={app.id} style={{ padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{app.studentName} ({app.rollNo})</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    Wing: {app.rolePreference} · {app.paymentStatus === 'PAID' ? `Paid ₹${app.feeAmount}` : 'Free'}
                  </div>
                </div>
                <div>
                  {app.status === 'pending' ? (
                    <span className="badge badge-pending">⏳ Pending</span>
                  ) : app.status === 'approved' ? (
                    <span className="badge badge-approved">✓ Approved</span>
                  ) : (
                    <span className="badge badge-denied">✕ Denied</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
