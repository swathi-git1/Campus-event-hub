import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import ClubLogo from '../../components/ClubLogo'

export default function Clubs() {
  const { clubs, memberships } = useData()
  const { user } = useAuth()

  return (
    <DashboardLayout role="student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Campus Clubs & Societies</h1>
          <p className="muted" style={{ margin: 0 }}>
            Join technical chapters, cultural guilds, and sports councils. Review official mission & vision, faculty advisors, and student coordinators.
          </p>
        </div>
      </div>

      <div className="card-grid-2">
        {clubs.map(c => {
          // Check if current student has applied or joined this club
          const myApp = memberships.find(m => m.clubName.toLowerCase() === c.name.toLowerCase() && (m.studentEmail === user?.email || m.studentName === user?.name || m.studentId === 1001))

          return (
            <Link
              to={`/student/clubs/${encodeURIComponent(c.name)}`}
              className="card"
              key={c.name}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease', position: 'relative' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--purple-soft)', overflow: 'hidden', flexShrink: 0
                    }}>
                      <ClubLogo clubName={c.name} size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, margin: 0 }}>{c.name}</h3>
                      <span className={`card-tag ${c.tagClass || 'tag-purple'}`} style={{ margin: 0, fontSize: 9.5 }}>{c.cat}</span>
                    </div>
                  </div>

                  <div>
                    {myApp ? (
                      myApp.status === 'approved' ? (
                        <span className="badge badge-approved">✓ Active Member</span>
                      ) : myApp.status === 'pending' ? (
                        <span className="badge badge-pending">⏳ Application Pending</span>
                      ) : (
                        <span className="badge badge-denied">✗ Denied</span>
                      )
                    ) : (
                      c.membershipFee > 0 ? (
                        <span className="badge badge-paid">Fee: ₹{c.membershipFee}/yr</span>
                      ) : (
                        <span className="badge badge-free">Free Join</span>
                      )
                    )}
                  </div>
                </div>

                <p className="muted" style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>
                  {c.desc}
                </p>

                {/* Mission Statement Hook */}
                {c.mission && (
                  <div style={{ padding: '8px 12px', background: 'var(--surface-0)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12, fontSize: 12, color: 'var(--ink)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>🎯 Mission: </span>
                    <span style={{ color: 'var(--ink-soft)' }}>{c.mission.slice(0, 115)}...</span>
                  </div>
                )}

                {/* Faculty & Student Coordinators Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14, fontSize: 11.5 }}>
                  <div style={{ padding: '7px 10px', background: 'var(--amber-soft)', borderRadius: 8, border: '1px solid #fde68a' }}>
                    <div style={{ fontWeight: 800, color: '#92400e', fontSize: 10, textTransform: 'uppercase' }}>👨‍🏫 Faculty Advisor</div>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.facultyCoordinator?.name || c.leadInstructor?.split('(')[0] || 'Dr. Faculty Lead'}
                    </div>
                  </div>
                  <div style={{ padding: '7px 10px', background: 'var(--primary-soft)', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 10, textTransform: 'uppercase' }}>🎓 Student Lead</div>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.studentCoordinator?.name || 'Student Coordinator'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: 20, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--ink-soft)' }}>
                  <div><span className="stat-num" style={{ fontSize: 15 }}>{c.events}</span> <span className="stat-label">Events</span></div>
                  <div><span className="stat-num" style={{ fontSize: 15 }}>{c.members}</span> <span className="stat-label">Members</span></div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: 'var(--indigo)', fontWeight: 600, fontSize: 12 }}>
                    View Mission & Coordinators →
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
