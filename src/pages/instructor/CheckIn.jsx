import React, { useState, useMemo } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

export default function CheckIn() {
  const { user } = useAuth()
  const { events, registrations, updateAttendance, bulkUpdateAttendance } = useData()

  const assignedClubName = user?.assignedClub || 'CSI'
  const clubEvents = useMemo(() => {
    return events.filter(e => e.club.toLowerCase() === assignedClubName.toLowerCase())
  }, [events, assignedClubName])

  const [selectedEventId, setSelectedEventId] = useState(() => clubEvents[0]?.id || 1)
  const [query, setQuery] = useState('')
  const [attendanceFilter, setAttendanceFilter] = useState('all') // 'all', 'present', 'absent'
  const [msg, setMsg] = useState(null)

  const activeEvent = clubEvents.find(e => e.id === Number(selectedEventId)) || clubEvents[0]

  const eventRegistrations = useMemo(() => {
    if (!activeEvent) return []
    return registrations.filter(r => r.eventId === activeEvent.id)
  }, [registrations, activeEvent])

  const checkedInList = eventRegistrations.filter(r => r.attended)
  const pendingList = eventRegistrations.filter(r => !r.attended)

  const filteredRegistrations = useMemo(() => {
    const q = query.trim().toLowerCase()
    return eventRegistrations.filter(r => {
      const matchesStatus = attendanceFilter === 'all' ||
        (attendanceFilter === 'present' && r.attended) ||
        (attendanceFilter === 'absent' && !r.attended)

      const matchesQuery = !q ||
        (r.studentName || '').toLowerCase().includes(q) ||
        (r.rollNo || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q) ||
        (r.team || '').toLowerCase().includes(q) ||
        (r.dept || '').toLowerCase().includes(q)

      return matchesStatus && matchesQuery
    })
  }, [eventRegistrations, query, attendanceFilter])

  const handleQuickCheckin = (e) => {
    e.preventDefault()
    const clean = query.trim().toUpperCase()
    if (!clean) {
      setMsg({ type: 'error', text: 'Please enter a student name, roll number, or registration ID.' })
      return
    }

    const found = eventRegistrations.find(r =>
      r.id.toUpperCase() === clean ||
      r.id.replace('-', '').toUpperCase() === clean.replace('-', '') ||
      (r.rollNo && r.rollNo.toUpperCase() === clean) ||
      r.studentName.toUpperCase() === clean
    )

    if (!found) {
      setMsg({ type: 'error', text: `No registration found for "${query}" in this event.` })
      return
    }

    if (found.attended) {
      setMsg({ type: 'info', text: `${found.studentName} (${found.id}) is ALREADY checked in.` })
      setQuery('')
      return
    }

    updateAttendance(found.id, true, 'Advisor Scanned')
    setMsg({ type: 'success', text: `✓ Successfully checked in ${found.studentName} (${found.rollNo || found.id})!` })
    setQuery('')
  }

  const handleToggleAttendance = (regId, currentStatus) => {
    updateAttendance(regId, !currentStatus, 'Advisor Toggle')
  }

  // Export Contestants Roster to Formatted Printable PDF Sheet
  const handleExportPDF = () => {
    if (!activeEvent) return
    const list = eventRegistrations
    const present = list.filter(r => r.attended).length
    const total = list.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${activeEvent.title} - Live Attendance Sheet</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #111; }
          .header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 22px; font-weight: bold; margin: 0; color: #1e1b4b; }
          .subtitle { font-size: 13px; color: #555; margin-top: 4px; }
          .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; }
          .stat-box { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11.5px; }
          th { background: #1e1b4b; color: #fff; text-align: left; padding: 8px 10px; font-weight: 600; }
          td { border-bottom: 1px solid #e2e8f0; padding: 8px 10px; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge-present { color: #166534; font-weight: bold; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
          .badge-absent { color: #991b1b; font-weight: bold; background: #fee2e2; padding: 2px 6px; border-radius: 4px; }
          .signatures { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; padding-top: 20px; }
          .sig-line { width: 220px; border-top: 1px solid #333; text-align: center; padding-top: 6px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; margin-bottom: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #4338ca; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; font-weight: bold;">
              ${activeEvent.club} Chapter · Live Attendance Record
            </div>
            <h1 class="title">${activeEvent.title}</h1>
            <div class="subtitle">Audience: ${['members_only', 'membership_only', 'club_specific'].includes(activeEvent.accessLevel) ? '🔒 Restricted Club Members' : '🌐 Public Campus'} · Venue PIN: <b>${activeEvent.venuePin || '4821'}</b></div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #555;">
            <div><b>Date:</b> ${activeEvent.date}</div>
            <div><b>Venue:</b> ${activeEvent.venue}</div>
            <div><b>Faculty Lead:</b> ${user?.name || 'Faculty Advisor'}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div><div class="stat-box">Total Registered</div><div>${total} Contestants</div></div>
          <div><div class="stat-box" style="color: #166534;">Verified Present</div><div>${present} Students</div></div>
          <div><div class="stat-box" style="color: #991b1b;">Absent / Pending</div><div>${total - present} Students</div></div>
          <div><div class="stat-box" style="color: #4338ca;">Attendance Rate</div><div>${rate}% Verified</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Reg ID</th>
              <th>Contestant Name</th>
              <th>Roll No</th>
              <th>Dept & Year</th>
              <th>Team Name</th>
              <th>Attendance Status</th>
              <th>Verified At & Method</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((r, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><b>${r.id}</b></td>
                <td><b>${r.studentName}</b></td>
                <td>${r.rollNo || '23CS082'}</td>
                <td>${r.dept || 'CSE'} (${r.year || '3rd Yr'})</td>
                <td>${r.team || '—'}</td>
                <td><span class="${r.attended ? 'badge-present' : 'badge-absent'}">${r.attended ? '✓ PRESENT' : '✕ ABSENT'}</span></td>
                <td>${r.attendedAt ? `${r.attendedAt} (${r.checkinMethod || 'Verified'})` : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-line">
            <div><b>Student Operations Lead</b></div>
            <div style="font-size: 11px; color: #666;">Attendance Verification Desk</div>
          </div>
          <div class="sig-line">
            <div><b>${user?.name || 'Faculty Advisor'}</b></div>
            <div style="font-size: 11px; color: #666;">Lead Faculty Advisor (${activeEvent.club})</div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <DashboardLayout role="instructor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Live Event Attendance & Check-In Console</h1>
            <span className="badge tag-amber">{assignedClubName} Advisor Desk</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Verify registered contestants at the venue, project the 4-digit check-in PIN, and monitor live attendance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={handleExportPDF}>
            📄 Print / PDF Attendance Sheet
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EVENT SELECTOR & VENUE PIN HERO BANNER */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 22, marginBottom: 24, borderLeft: '6px solid var(--indigo)', background: 'linear-gradient(135deg, var(--card) 0%, rgba(67,56,202,0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
              Select Active Conduction Event:
            </label>
            <select
              value={selectedEventId}
              onChange={e => {
                setSelectedEventId(Number(e.target.value))
                setMsg(null)
              }}
              style={{ width: '100%', padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, background: 'var(--card)' }}
            >
              {clubEvents.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {ev.date} ({ev.venue})
                </option>
              ))}
            </select>
          </div>

          {activeEvent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card)', padding: '12px 18px', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                  Project On Screen for Student Self Check-in:
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 600 }}>
                  Venue Attendance PIN:
                </div>
              </div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 800, color: 'var(--indigo)', background: 'var(--indigo-soft)', padding: '6px 14px', borderRadius: 8, letterSpacing: '2px' }}>
                {activeEvent.venuePin || '4821'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stat-strip">
        <div>
          <div className="stat-num">{eventRegistrations.length}</div>
          <div className="stat-label">Total Registered Contestants</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--green)' }}>{checkedInList.length}</div>
          <div className="stat-label">Verified Present</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingList.length > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingList.length}
          </div>
          <div className="stat-label">Pending / Unchecked</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>
            {eventRegistrations.length > 0 ? Math.round((checkedInList.length / eventRegistrations.length) * 100) : 0}%
          </div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Quick Check-in Scanner & Search Box */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <form onSubmit={handleQuickCheckin} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                if (msg) setMsg(null)
              }}
              placeholder="Type student name, Roll No (23CS082), or Ticket ID (REG-1001) for instant check-in..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid var(--border)', fontSize: 13.5 }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            ⚡ Quick Check In
          </button>
        </form>

        {msg && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            background: msg.type === 'error' ? 'var(--danger-soft)' : msg.type === 'info' ? 'var(--amber-soft)' : 'var(--green-soft)',
            color: msg.type === 'error' ? 'var(--danger)' : msg.type === 'info' ? 'var(--amber)' : 'var(--green)'
          }}>
            {msg.text}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ATTENDANCE ROSTER TABLE */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 17, margin: '0 0 4px' }}>
              Event Attendee Roster ({filteredRegistrations.length} Students)
            </h3>
            <div className="muted" style={{ fontSize: 12 }}>
              Click 1-click toggle to switch status or use the bulk actions on the right.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', background: 'var(--bg)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setAttendanceFilter('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: attendanceFilter === 'all' ? 'var(--card)' : 'transparent',
                  color: attendanceFilter === 'all' ? 'var(--indigo)' : 'var(--ink-soft)',
                  boxShadow: attendanceFilter === 'all' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                All ({eventRegistrations.length})
              </button>
              <button
                type="button"
                onClick={() => setAttendanceFilter('present')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: attendanceFilter === 'present' ? 'var(--card)' : 'transparent',
                  color: attendanceFilter === 'present' ? 'var(--green)' : 'var(--ink-soft)',
                  boxShadow: attendanceFilter === 'present' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Present ({checkedInList.length})
              </button>
              <button
                type="button"
                onClick={() => setAttendanceFilter('absent')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: attendanceFilter === 'absent' ? 'var(--card)' : 'transparent',
                  color: attendanceFilter === 'absent' ? 'var(--danger)' : 'var(--ink-soft)',
                  boxShadow: attendanceFilter === 'absent' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Absent ({pendingList.length})
              </button>
            </div>

            {/* Bulk Action Buttons */}
            {activeEvent && eventRegistrations.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  style={{ fontSize: 11.5, padding: '6px 12px' }}
                  onClick={() => {
                    bulkUpdateAttendance(activeEvent.id, true, 'Advisor Bulk Verified')
                    setMsg({ type: 'success', text: `✓ All ${eventRegistrations.length} contestants marked as PRESENT for ${activeEvent.title}!` })
                  }}
                  title="Mark all registered contestants as Present in one click"
                >
                  ⚡ Mark All Present
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 11.5, padding: '6px 10px' }}
                  onClick={() => {
                    bulkUpdateAttendance(activeEvent.id, false)
                    setMsg({ type: 'info', text: `Attendance reset to Absent for all contestants in ${activeEvent.title}.` })
                  }}
                  title="Reset all contestants to Absent"
                >
                  🔄 Reset All
                </button>
              </>
            )}
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--ink-soft)' }}>
            No contestants registered or matching the search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px' }}>Passcode #</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px' }}>Contestant Name</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px' }}>Roll No & Dept</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px' }}>Team</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px' }}>Attendance Status</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px' }}>Verification Method</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="mono" style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--indigo)' }}>
                      #{r.id}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: 700 }}>{r.studentName}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{r.email}</div>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <div className="mono" style={{ fontWeight: 600 }}>{r.rollNo || '23CS082'}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{r.dept || 'CSE'} · {r.year || '3rd Year'}</div>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {r.team ? <span className="badge tag-indigo" style={{ fontSize: 10.5 }}>{r.team}</span> : <span className="muted">—</span>}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      {r.attended ? (
                        <span className="badge badge-approved" style={{ fontSize: 11 }}>
                          ✓ PRESENT
                        </span>
                      ) : (
                        <span className="badge badge-denied" style={{ fontSize: 11 }}>
                          ✕ ABSENT
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {r.attended ? (
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--green)' }}>
                            {r.checkinMethod || 'Advisor Verified'}
                          </div>
                          <div className="muted mono" style={{ fontSize: 10 }}>{r.attendedAt}</div>
                        </div>
                      ) : (
                        <span className="muted" style={{ fontSize: 11 }}>Awaiting check-in</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <button
                        className={`btn btn-sm ${r.attended ? 'btn-outline' : 'btn-primary'}`}
                        style={{ fontSize: 11, padding: '5px 12px' }}
                        onClick={() => handleToggleAttendance(r.id, r.attended)}
                      >
                        {r.attended ? 'Mark Absent' : '✓ Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
