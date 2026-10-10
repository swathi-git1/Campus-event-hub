import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export default function AdminPermissions() {
  const { user } = useAuth()
  const { permissionRequests, odRecords, instructorsList } = useData()

  const [activeTab, setActiveTab] = useState('all') // 'all', 'external', 'internal', 'od'
  const [search, setSearch] = useState('')

  const pendingCount = permissionRequests.filter(r => r.status === 'Pending Approval').length
  const approvedCount = permissionRequests.filter(r => r.status === 'Approved').length
  const proofCount = permissionRequests.filter(r => r.status === 'Proof Submitted').length
  const odCount = odRecords.length

  const filteredRequests = permissionRequests.filter(r => {
    if (activeTab === 'external' && r.scope !== 'External') return false
    if (activeTab === 'internal' && r.scope !== 'Internal') return false
    if (activeTab === 'od' && r.status !== 'OD Issued') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.eventName.toLowerCase().includes(q) ||
        r.dept.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>University Event Permission & OD Oversight</h1>
            <span className="badge tag-teal">Administrative Console</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Supervisory oversight of all college event participation requests, student external delegations, and sanctioned On-Duty (OD) records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
            ← Back to Admin Console
          </Link>
        </div>
      </div>

      {/* University System Stats */}
      <div className="stat-strip" style={{ marginBottom: 24 }}>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>{permissionRequests.length}</div>
          <div className="stat-label">Total Student Requests</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingCount > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingCount}
          </div>
          <div className="stat-label">Pending Faculty Review</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--green)' }}>
            {approvedCount}
          </div>
          <div className="stat-label">Approved Permissions</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--purple)' }}>
            {proofCount}
          </div>
          <div className="stat-label">Proofs In Verification</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>
            {odCount}
          </div>
          <div className="stat-label">Official OD Passes Issued</div>
        </div>
      </div>

      {/* OD Authority Allocation Card */}
      <div className="card" style={{ padding: 18, marginBottom: 20, background: 'linear-gradient(135deg, var(--card) 0%, rgba(15,118,110,0.06) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal)', letterSpacing: '.05em' }}>
              Designated Institutional Clearance Authority:
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>
              Dr. Malathi Sundaram (Professor & Chief Permission / OD In-Charge)
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Academic & Student Affairs Council · Employee ID: FAC-OD-101 · Email: od.faculty@college.edu
            </div>
          </div>
          <span className="badge tag-teal">Designated Faculty Lead</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="chip-row" style={{ gap: 6 }}>
            <button className={`chip ${activeTab === 'all' ? 'on' : ''}`} onClick={() => setActiveTab('all')}>
              All Requests ({permissionRequests.length})
            </button>
            <button className={`chip ${activeTab === 'external' ? 'on' : ''}`} onClick={() => setActiveTab('external')}>
              🌐 External Delegations ({permissionRequests.filter(r => r.scope === 'External').length})
            </button>
            <button className={`chip ${activeTab === 'internal' ? 'on' : ''}`} onClick={() => setActiveTab('internal')}>
              🏛️ Campus Events ({permissionRequests.filter(r => r.scope === 'Internal').length})
            </button>
            <button className={`chip ${activeTab === 'od' ? 'on' : ''}`} onClick={() => setActiveTab('od')}>
              🎖️ Official OD Passes ({permissionRequests.filter(r => r.status === 'OD Issued').length})
            </button>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search by student, roll number, department, or event name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '7px 12px', fontSize: 12.5 }}
            />
          </div>
        </div>
      </div>

      {/* Master Requests Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Request ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Student Scholar</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Event & Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Dates & Scope</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>OD Pass ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Reviewer</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--indigo)' }}>#{r.id}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{r.studentName}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{r.rollNo} · {r.dept} ({r.year})</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{r.eventName}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{r.organizer}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="mono" style={{ fontSize: 11.5 }}>{r.eventDate}</div>
                    <span className={`badge ${r.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`} style={{ fontSize: 9 }}>
                      {r.scope}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={`badge ${
                        r.status === 'OD Issued' ? 'tag-teal' :
                        r.status === 'Approved' ? 'tag-green' :
                        r.status === 'Proof Submitted' ? 'tag-purple' :
                        r.status === 'Rejected' ? 'tag-danger' : 'tag-amber'
                      }`}
                      style={{ fontSize: 10 }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.odRecordId ? (
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--teal)' }}>
                        #{r.odRecordId}
                      </span>
                    ) : (
                      <span className="muted" style={{ fontSize: 11 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>
                    {r.reviewedBy || <span className="muted">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
