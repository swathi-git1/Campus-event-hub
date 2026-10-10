import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export default function AdminProfile() {
  const { user } = useAuth()
  const { clubs, instructorsList, events, memberships } = useData()

  return (
    <DashboardLayout role="admin">
      <div className="card" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, var(--card) 0%, rgba(15,118,110,0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'}
              alt={user?.name}
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--card)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, margin: 0 }}>{user?.name || 'Dr. Aris Thorne'}</h1>
                <span className="badge tag-teal">Super Administrator</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', background: 'var(--teal-soft)', padding: '3px 8px', borderRadius: 6 }}>
                  #{user?.adminId || 'ADMIN-DSA-001'}
                </span>
              </div>
              <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>
                🏛️ <b>{user?.designation || 'Dean of Student Affairs & Platform Super Administrator'}</b>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--ink-soft)', flexWrap: 'wrap' }}>
                <span>📧 {user?.email || 'admin@college.edu'}</span>
                <span>📞 {user?.phone || '+91 94440 00100'}</span>
                <span>🚪 {user?.officeRoom || 'Administration Suite 101'}</span>
              </div>
            </div>
          </div>

          <Link to="/admin/dashboard" className="btn btn-primary btn-sm">
            ← Back to Admin Console
          </Link>
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)', maxWidth: 780, margin: '18px 0 0', padding: '14px 16px', background: 'var(--bg)', borderRadius: 12 }}>
          "{user?.bio || 'Oversees all 12 campus clubs, faculty advisor allocations, event moderation, and campus code of conduct.'}"
        </p>

        {/* System Stats Strip */}
        <div style={{ display: 'flex', gap: 32, paddingTop: 18, marginTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div>
            <div className="stat-num" style={{ color: 'var(--teal)' }}>{clubs.length}</div>
            <div className="stat-label">Accredited Clubs</div>
          </div>
          <div>
            <div className="stat-num" style={{ color: 'var(--indigo)' }}>{instructorsList.length}</div>
            <div className="stat-label">Allocated Faculty Advisors</div>
          </div>
          <div>
            <div className="stat-num">{events.length}</div>
            <div className="stat-label">Active Campus Events</div>
          </div>
          <div>
            <div className="stat-num">{memberships.length}</div>
            <div className="stat-label">Total Student Memberships</div>
          </div>
        </div>
      </div>

      {/* Admin Permissions & System Authority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, marginBottom: 14 }}>Institutional Governance & Permissions</h3>
          <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
              <span><b>1-to-1 Faculty Advisor Allocations:</b> Appoint and reassign instructors to clubs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
              <span><b>New Club Charters:</b> Review, approve, or reject student society registrations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
              <span><b>Campus Event Moderation:</b> Full authorization to inspect all campus schedules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
              <span><b>Audit & Finance:</b> Platform-wide oversight of student membership collections</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, marginBottom: 14 }}>Quick System Actions</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <Link to="/admin/dashboard" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
              <span>⚙️ Manage Faculty-Club Assignments</span>
              <span>→</span>
            </Link>
            <Link to="/admin/clubs" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
              <span>🛡️ Review Pending Club Charters</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
