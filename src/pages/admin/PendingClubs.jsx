import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { pendingClubs as seed } from '../../data/mockData'

export default function PendingClubs() {
  const { instructorsList, assignInstructorToClub } = useData()
  const [items, setItems] = useState(seed)
  const [assignedAdvisors, setAssignedAdvisors] = useState({
    1: instructorsList[0]?.name || "Dr. K. Ramanathan",
    2: instructorsList[5]?.name || "Prof. Ananya Sen"
  })

  const resolve = (id, status) => {
    setItems(items.map(c => c.id === id ? { ...c, status } : c))
  }

  return (
    <DashboardLayout role="admin">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Pending Club Registrations & Charters</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Review student society applications, assign 1-to-1 faculty advisors, and approve official campus charters.
      </p>

      {items.map(c => (
        <div className={'admin-row' + (c.status !== 'pending' ? ' resolved' : '')} key={c.id} style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div className="li-title" style={{ fontSize: 16 }}>{c.name}</div>
              <span className="badge tag-purple">{c.category}</span>
            </div>
            <div className="li-meta" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              Coordinator: <b>{c.coordinator}</b> (📧 {c.email})
            </div>

            {c.status === 'pending' && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>Assign Lead Faculty Advisor:</span>
                <select
                  value={assignedAdvisors[c.id] || instructorsList[0]?.name}
                  onChange={e => setAssignedAdvisors({ ...assignedAdvisors, [c.id]: e.target.value })}
                  style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12 }}
                >
                  {instructorsList.map(inst => (
                    <option key={inst.id} value={inst.name}>{inst.name} ({inst.dept.split(' ')[0]})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="admin-actions">
            {c.status === 'pending' ? (
              <>
                <button className="btn-approve" onClick={() => resolve(c.id, 'approved')}>✓ Approve Charter</button>
                <button className="btn-reject" onClick={() => resolve(c.id, 'rejected')}>✕ Reject</button>
              </>
            ) : (
              <span
                className="status-pill"
                style={{
                  background: c.status === 'approved' ? 'var(--green-soft)' : 'var(--danger-soft)',
                  color: c.status === 'approved' ? 'var(--green)' : 'var(--danger)',
                }}
              >
                {c.status === 'approved' ? `✓ Approved (Advisor: ${assignedAdvisors[c.id] || 'Assigned'})` : '✕ Rejected'}
              </span>
            )}
          </div>
        </div>
      ))}
    </DashboardLayout>
  )
}
