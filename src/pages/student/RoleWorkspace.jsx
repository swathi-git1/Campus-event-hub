import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { getEnrollStatus } from '../../data/mockData'

const ROLE_META = {
  conducting: {
    label: 'Student Conduction Lead',
    accent: 'var(--purple)',
    description: 'Coordinate event agendas, student leads, and chapter announcements with your faculty advisor.',
    responsibilities: ['Confirm the event run-of-show', 'Coordinate conducting leads and volunteers', 'Publish post-event achievements']
  },
  managing: {
    label: 'Operations & Attendance Manager',
    accent: 'var(--amber)',
    description: 'Keep registrations, venue readiness, and attendance verification aligned for your chapter.',
    responsibilities: ['Review your event passes and team rosters', 'Coordinate venue check-in readiness', 'Track verified participation certificates']
  },
  tech: {
    label: 'Technical Platform Coordinator',
    accent: 'var(--indigo)',
    description: 'Support chapter technology, equipment readiness, digital passes, and platform operations.',
    responsibilities: ['Check technical event requirements', 'Review digital event information', 'Coordinate equipment and platform support']
  },
  design: {
    label: 'Media & Design Lead',
    accent: 'var(--green)',
    description: 'Support event communications, visual identity, poster review, and chapter promotion.',
    responsibilities: ['Review event poster presentation', 'Coordinate chapter promotion', 'Keep published event information consistent']
  },
  member: {
    label: 'Active Club Member',
    accent: 'var(--teal)',
    description: 'Explore chapter activities, enroll in eligible events, and build your verified participation record.',
    responsibilities: ['Browse eligible events', 'Keep membership information current', 'Collect verified participation certificates']
  }
}

const CATEGORY_PRIORITY = ['conducting', 'managing', 'tech', 'design', 'member']

export default function RoleWorkspace() {
  const { user } = useAuth()
  const { visibleEvents: events, registrations, memberships } = useData()
  const studentEmail = String(user?.email || '').trim().toLowerCase()

  const myMemberships = useMemo(
    () => memberships.filter(m => String(m.studentEmail || '').trim().toLowerCase() === studentEmail && m.status === 'approved'),
    [memberships, studentEmail]
  )
  const roleMemberships = myMemberships.filter(m => m.roleCategory && m.roleCategory !== 'member')
  const primaryCategory = CATEGORY_PRIORITY.find(category => roleMemberships.some(m => m.roleCategory === category)) || 'member'
  const meta = ROLE_META[primaryCategory]
  const clubNames = myMemberships.map(m => m.clubName.toLowerCase())
  const chapterEvents = events.filter(event => clubNames.includes(event.club.toLowerCase()))
  const myRegistrations = registrations.filter(r => String(r.email || '').trim().toLowerCase() === studentEmail)
  const activeEvents = chapterEvents.filter(event => ['open', 'active_conduction'].includes(getEnrollStatus(event).state))

  return (
    <DashboardLayout role="student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <div className="eyebrow" style={{ color: meta.accent }}>Assigned Position Workspace</div>
          <h1 style={{ fontSize: 28, margin: '4px 0 6px' }}>{meta.label}</h1>
          <p className="muted" style={{ margin: 0, maxWidth: 680 }}>{meta.description}</p>
        </div>
        <Link to="/student/dashboard" className="btn btn-outline btn-sm">← Student Dashboard</Link>
      </div>

      <div className="stat-strip">
        <div><div className="stat-num">{roleMemberships.length}</div><div className="stat-label">Assigned Positions</div></div>
        <div><div className="stat-num">{chapterEvents.length}</div><div className="stat-label">Chapter Events</div></div>
        <div><div className="stat-num">{activeEvents.length}</div><div className="stat-label">Active Events</div></div>
        <div><div className="stat-num">{myRegistrations.filter(r => r.attended).length}</div><div className="stat-label">Verified Attendances</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 22, alignItems: 'start' }}>
        <div className="card" style={{ padding: 22, borderTop: `4px solid ${meta.accent}` }}>
          <h2 style={{ fontSize: 19, margin: '0 0 6px' }}>Your operating checklist</h2>
          <p className="muted" style={{ fontSize: 13, margin: '0 0 16px' }}>These role responsibilities are visible only to your authenticated student account.</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {meta.responsibilities.map((item, index) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 12px', borderRadius: 9, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <span style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: '50%', background: meta.accent, color: '#fff', fontSize: 12, fontWeight: 800 }}>{index + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
            <Link to="/student/registrations" className="btn btn-primary btn-sm">View My Passes</Link>
            <Link to="/student/achievements" className="btn btn-outline btn-sm">Open Achievements</Link>
          </div>
        </div>

        <div>
          <div className="section-title" style={{ fontSize: 18, marginBottom: 12 }}>Your chapter assignments</div>
          {roleMemberships.length === 0 ? (
            <div className="card" style={{ padding: 22 }}>
              <p className="muted" style={{ marginTop: 0 }}>No separate student leadership position has been assigned yet.</p>
              <Link to="/student/clubs" className="btn btn-outline btn-sm">Explore Clubs</Link>
            </div>
          ) : roleMemberships.map(membership => (
            <div className="card" key={membership.id} style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{membership.clubName} Chapter</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{membership.assignedRole || membership.rolePreference}</div>
                </div>
                <span className="badge badge-approved">✓ Approved</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                <Link to={`/student/clubs/${encodeURIComponent(membership.clubName)}`} className="btn btn-outline btn-sm">Chapter Profile</Link>
                <Link to="/student/enroll" className="btn btn-outline btn-sm">Eligible Events</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Chapter event pulse</h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: 12.5 }}>Events from the clubs attached to your approved memberships.</p>
          </div>
          <Link to="/student/enroll" className="btn btn-primary btn-sm">Browse all events →</Link>
        </div>
        {chapterEvents.length === 0 ? <p className="muted">No chapter events are currently available.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {chapterEvents.slice(0, 6).map(event => {
              const status = getEnrollStatus(event)
              return <Link to={`/student/enroll/${event.id}`} key={event.id} className="list-item" style={{ display: 'block' }}>
                <div className="li-title">{event.title}</div>
                <div className="li-meta">{event.club} · {event.date}</div>
                <div style={{ marginTop: 8 }}><span className={status.state === 'open' ? 'status-pill-live' : 'status-pill-conduction'}>{status.state === 'open' ? 'Open now' : 'Conduction active'}</span></div>
              </Link>
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
