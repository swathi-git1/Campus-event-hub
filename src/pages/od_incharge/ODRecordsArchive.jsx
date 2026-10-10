import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { exportTableToCSV, exportTableToPDF } from '../../utils/tableExport'

export default function ODRecordsArchive() {
  const { user } = useAuth()
  const { odRecords } = useData()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [activeOD, setActiveOD] = useState(null)

  const filteredRecords = odRecords.filter(od => {
    if (selectedDept !== 'all' && !od.dept.toLowerCase().includes(selectedDept.toLowerCase())) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = od.studentName.toLowerCase().includes(q)
      const matchRoll = od.rollNo.toLowerCase().includes(q)
      const matchEvent = od.eventName.toLowerCase().includes(q)
      const matchId = od.id.toLowerCase().includes(q)
      if (!matchName && !matchRoll && !matchEvent && !matchId) return false
    }
    return true
  })

  const handleExportODCSV = () => {
    if (filteredRecords.length === 0) return
    const headers = ['OD Pass ID', 'Student Name', 'Roll No', 'Department', 'Event Name', 'Category', 'Dates', 'Days Sanctioned', 'Issued By', 'Verification Hash']
    const rows = filteredRecords.map(r => [
      r.id,
      r.studentName,
      r.rollNo,
      r.dept,
      r.eventName,
      r.eventType || 'Inter-College Hackathon',
      `${r.eventDate} to ${r.eventEndDate || r.eventDate}`,
      `${r.odDays || 1} day(s)`,
      r.sanctionedBy || 'Prof. Meenakshi Sundaram',
      r.verificationHash || 'OD-VERIFIED-QR'
    ])
    exportTableToCSV({
      filename: `CEH_OD_Registry_${selectedDept}_${new Date().toISOString().split('T')[0]}`,
      headers,
      rows,
      metadata: {
        title: 'Official On-Duty Sanction Register',
        filterSummary: `Department: ${selectedDept}, Search: "${searchQuery || 'None'}"`
      }
    })
  }

  const handleExportODPDF = () => {
    if (filteredRecords.length === 0) return
    const headers = ['OD Ref ID', 'Scholar Details', 'Event & Category', 'Dates', 'Days', 'Issued By']
    const rows = filteredRecords.map(r => [
      r.id,
      `${r.studentName} (${r.rollNo}, ${r.dept})`,
      `${r.eventName} [${r.eventType || 'Hackathon'}]`,
      `${r.eventDate} to ${r.eventEndDate || r.eventDate}`,
      `${r.odDays || 1} Day(s)`,
      r.sanctionedBy || 'Prof. Meenakshi Sundaram'
    ])
    exportTableToPDF({
      title: 'OFFICIAL ON-DUTY (OD) SANCTION REGISTRY',
      subtitle: 'Office of Dean Academic Affairs & Attendance Clearance',
      filterSummary: `Department: ${selectedDept} | Search: "${searchQuery || 'All Sanctioned'}"`,
      headers,
      rows
    })
  }

  return (
    <DashboardLayout role="faculty_od">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>University Official OD Sanction Register</h1>
            <span className="badge tag-teal">Permanent Records</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Central repository of all verified and sanctioned student On-Duty passes across all college departments and semesters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={handleExportODCSV} title="Export filtered records to Microsoft Excel compatible CSV">
            📊 Export to Excel (.csv)
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleExportODPDF} title="Generate official printable PDF document">
            📄 Export Official PDF
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search by student name, roll number, OD pass ref, or event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', fontSize: 13 }}
            />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="Electronics">Electronics & Communication</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Civil">Civil Engineering</option>
          </select>

          <span className="muted" style={{ fontSize: 12 }}>
            Showing {filteredRecords.length} sanctioned records
          </span>
        </div>
      </div>

      {/* OD Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="card" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
          <h3>No OD records found</h3>
          <p className="muted" style={{ margin: '4px 0 0' }}>No passes match your search criteria.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Pass Ref ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Student Details</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Event & Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Sanctioned Dates</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>OD Days</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Issued By</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink-soft)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(od => (
                  <tr key={od.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--indigo)' }}>{od.id}</span>
                      <div className="muted mono" style={{ fontSize: 10.5 }}>Req: #{od.requestId}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{od.studentName}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>{od.rollNo} · {od.dept}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{od.eventName}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>{od.organizer} ({od.eventType})</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div className="mono" style={{ fontSize: 12 }}>{od.eventDates}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge tag-teal">{od.totalDaysOD} Day(s)</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 12 }}>{od.issuedBy}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{od.issuedAt}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setActiveOD(od)}
                        style={{ fontSize: 11.5, padding: '4px 10px' }}
                      >
                        View Pass 🖨️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official OD Pass Certificate Modal */}
      {activeOD && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 660, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 32, background: 'var(--card)', color: 'var(--ink)', border: '2px solid var(--border)', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--indigo)' }}>
                CENTRAL COLLEGE OF ENGINEERING & TECHNOLOGY
              </div>
              <h2 style={{ fontSize: 22, margin: '4px 0 2px', fontFamily: "'Fraunces', serif", color: 'var(--ink)' }}>
                OFFICIAL ON-DUTY (OD) SANCTION PASS
              </h2>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Office of the Dean (Student Affairs) & Student Participation Clearance Committee
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'var(--surface-1)', padding: '12px 18px', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Pass Ref No:</span><br />
                <b className="mono" style={{ fontSize: 14, color: 'var(--ink)' }}>{activeOD.id}</b>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Date Issued:</span><br />
                <b style={{ fontSize: 13, color: 'var(--ink)' }}>{activeOD.issuedAt}</b>
              </div>
              <div>
                <span className="badge tag-teal" style={{ fontSize: 11 }}>● Validated & Active</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13, marginBottom: 20, color: 'var(--ink)' }}>
              <div><b style={{ color: 'var(--ink-soft)' }}>Student Name:</b> <div>{activeOD.studentName}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Register / Roll No:</b> <div>{activeOD.rollNo}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Department:</b> <div>{activeOD.dept}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Year / Degree:</b> <div>{activeOD.year} · {activeOD.degree}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Event Attended:</b> <div>{activeOD.eventName}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Category:</b> <div>{activeOD.eventType}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Organizing Body:</b> <div>{activeOD.organizer}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Venue:</b> <div>{activeOD.venue}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Approved Dates:</b> <div>{activeOD.eventDates}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Total OD Days Credited:</b> <div><span className="badge tag-indigo">{activeOD.totalDaysOD} Day(s)</span></div></div>
            </div>

            <div style={{ background: 'var(--surface-1)', padding: 14, borderRadius: 10, fontSize: 12, marginBottom: 24, lineHeight: 1.5, border: '1px solid var(--border)' }}>
              <b style={{ color: 'var(--ink)' }}>Verification Certification:</b><br />
              <span style={{ color: 'var(--ink-soft)' }}>{activeOD.remarks}</span>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-muted)' }}>
                Ref Permission Dossier: <b style={{ color: 'var(--ink)' }}>#{activeOD.requestId}</b> · Verification Code: <b style={{ color: 'var(--ink)' }}>{activeOD.verificationReference}</b>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 68, height: 68, background: 'var(--surface-2)', borderRadius: 8, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, textAlign: 'center', padding: 6, lineHeight: 1.2, border: '1px solid var(--border)' }}>
                  [QR VERIFIED<br />OD-AUTH]
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                  Scan to verify<br />registry authenticity.
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{activeOD.issuedBy}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{activeOD.issuerDesignation}</div>
                <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>
                  [DIGITALLY VERIFIED UNIVERSITY SEAL]
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                🖨️ Print OD Pass
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveOD(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
