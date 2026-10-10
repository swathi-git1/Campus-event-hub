import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import ODInstructorAnalytics from '../../components/ODInstructorAnalytics'

export default function ODDashboard() {
  const { user } = useAuth()
  const { permissionRequests, odRecords } = useData()
  const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'operations'

  const pendingRequests = permissionRequests.filter(r => r.status === 'Pending Approval')
  const approvedRequests = permissionRequests.filter(r => r.status === 'Approved')
  const pendingProofs = permissionRequests.filter(r => r.status === 'Proof Submitted')
  const verifiedProofs = permissionRequests.filter(r => r.status === 'Proof Verified')
  const odIssued = permissionRequests.filter(r => r.status === 'OD Issued')
  const rejectedRequests = permissionRequests.filter(r => r.status === 'Rejected' || r.status === 'Proof Rejected')

  return (
    <DashboardLayout role="faculty_od">
      {/* Top Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Faculty On-Duty (OD) Management Hub</h1>
            <span className="badge tag-amber">Chief Faculty In-Charge</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Welcome back, <b>{user?.name || 'Dr. Malathi Sundaram'}</b> ({user?.designation || 'Chief OD In-Charge'}). Real-time analytics, report generation, and student event clearance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--card)', border: '1px solid var(--border)', padding: 4, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="btn btn-sm"
              style={{
                background: activeTab === 'analytics' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'analytics' ? '#fff' : 'var(--ink)',
                border: 'none',
                fontWeight: activeTab === 'analytics' ? 700 : 500,
                borderRadius: 7,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              📊 OD Analytics & Reports
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className="btn btn-sm"
              style={{
                background: activeTab === 'operations' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'operations' ? '#fff' : 'var(--ink)',
                border: 'none',
                fontWeight: activeTab === 'operations' ? 700 : 500,
                borderRadius: 7,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              📋 Review Desk ({pendingRequests.length + pendingProofs.length})
            </button>
          </div>

          <Link to="/od-incharge/requests" className="btn btn-amber btn-sm">
            📝 Requests ({pendingRequests.length})
          </Link>
          <Link to="/od-incharge/proofs" className="btn btn-primary btn-sm">
            🔍 Proofs ({pendingProofs.length})
          </Link>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <ODInstructorAnalytics permissionRequests={permissionRequests} odRecords={odRecords} currentUser={user} />
      ) : (
        <>

      {/* Critical Workflow Notice Banner */}
      <div className="card" style={{ background: 'var(--amber-soft)', borderLeft: '5px solid var(--amber)', padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: 14 }}>
              ⚖️ Institutional Protocol: Strict Separation of Permission & On-Duty (OD)
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 3, lineHeight: 1.5 }}>
              Permission approval authorizes the student to attend the event. <b>On-Duty (OD) is never automatically granted upon permission approval</b>. Students must attend the event, upload authentic certificates/photographs, and undergo faculty verification before an OD pass can be officially sanctioned.
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Strip */}
      <div className="stat-strip" style={{ marginBottom: 24 }}>
        <div>
          <div className="stat-num" style={{ color: pendingRequests.length > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingRequests.length}
          </div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--green)' }}>
            {approvedRequests.length}
          </div>
          <div className="stat-label">Permissions Approved</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingProofs.length > 0 ? 'var(--purple)' : 'inherit' }}>
            {pendingProofs.length}
          </div>
          <div className="stat-label">Proofs Waiting Review</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>
            {odRecords.length}
          </div>
          <div className="stat-label">Official OD Passes</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--danger)' }}>
            {rejectedRequests.length}
          </div>
          <div className="stat-label">Rejected Requests</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left Column: Action Queues */}
        <div>
          {/* Action Queue 1: Proofs Waiting for Verification */}
          {pendingProofs.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 20, borderTop: '4px solid var(--purple)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>📸</span>
                  <h3 style={{ fontSize: 16, margin: 0 }}>Proofs Awaiting Verification ({pendingProofs.length})</h3>
                </div>
                <Link to="/od-incharge/proofs" style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 600 }}>
                  Inspect All →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingProofs.map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: 'var(--bg)',
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{req.studentName} ({req.rollNo})</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Event: <b>{req.eventName}</b> ({req.scope})
                      </div>
                      <div className="muted mono" style={{ fontSize: 11 }}>
                        Proof submitted: {new Date(req.proof.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Link to="/od-incharge/proofs" className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>
                      Inspect Proof →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Queue 2: Pending Permission Requests */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, margin: 0 }}>Pending Permission Requests ({pendingRequests.length})</h3>
                <p className="muted" style={{ fontSize: 12, margin: '2px 0 0' }}>Review student applications before event conduction.</p>
              </div>
              <Link to="/od-incharge/requests" style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--ink-soft)', fontSize: 13 }}>
                ✓ No pending requests right now. All student requests reviewed!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingRequests.slice(0, 4).map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: 'var(--bg)',
                      padding: 14,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                        <span className={`badge ${req.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`} style={{ fontSize: 9.5 }}>
                          {req.scope}
                        </span>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>#{req.id}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{req.eventName}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Applicant: <b>{req.studentName}</b> ({req.rollNo} · {req.dept})
                      </div>
                    </div>
                    <Link to="/od-incharge/requests" className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Portal Links & Recent OD Passes */}
        <div>
          {/* Quick Actions Cards */}
          <div className="card" style={{ padding: 18, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>Faculty OD Action Desk</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Link
                to="/od-incharge/requests"
                className="card"
                style={{ padding: 14, textDecoration: 'none', background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>📝</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Permission Requests</div>
                <div className="muted" style={{ fontSize: 11 }}>Approve or reject event applications</div>
              </Link>

              <Link
                to="/od-incharge/proofs"
                className="card"
                style={{ padding: 14, textDecoration: 'none', background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>🔍</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Verify Proofs</div>
                <div className="muted" style={{ fontSize: 11 }}>Inspect photos & issue OD passes</div>
              </Link>

              <Link
                to="/od-incharge/records"
                className="card"
                style={{ padding: 14, textDecoration: 'none', background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>🎖️</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Official OD Register</div>
                <div className="muted" style={{ fontSize: 11 }}>Search & print issued passes</div>
              </Link>

              <Link
                to="/student/enroll"
                className="card"
                style={{ padding: 14, textDecoration: 'none', background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>📅</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Campus Events</div>
                <div className="muted" style={{ fontSize: 11 }}>Browse scheduled college events</div>
              </Link>
            </div>
          </div>

          {/* Recently Issued OD Sanction Passes */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, margin: 0 }}>Recently Sanctioned OD Passes</h3>
              <Link to="/od-incharge/records" style={{ fontSize: 12, color: 'var(--indigo)' }}>Archive →</Link>
            </div>

            {odRecords.length === 0 ? (
              <div className="muted" style={{ fontSize: 12, textAlign: 'center', padding: 16 }}>
                No OD passes issued yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {odRecords.slice(0, 3).map(od => (
                  <div key={od.id} style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)' }}>#{od.id}</span>
                      <span className="badge tag-teal" style={{ fontSize: 9.5 }}>{od.totalDaysOD} Day(s) OD</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{od.studentName} ({od.rollNo})</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{od.eventName}</div>
                    <div className="muted" style={{ fontSize: 10.5, marginTop: 2 }}>Issued: {od.issuedAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  )
}

