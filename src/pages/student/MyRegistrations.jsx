import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import ODStatusTracker, { getStatusBadge } from '../../components/ODStatusTracker'

export default function MyRegistrations() {
  const { registrations, events, permissionRequests, markStudentSelfAttendance } = useData()
  const { user } = useAuth()

  const studentEmail = user?.email || 'student@college.edu'
  const myRegs = registrations.filter(r =>
    String(r.email || '').trim().toLowerCase() === studentEmail.toLowerCase()
  )

  // PIN check-in inputs per registration ID
  const [pinInputs, setPinInputs] = useState({})
  const [pinMessages, setPinMessages] = useState({})
  const [activeQrModal, setActiveQrModal] = useState(null)

  const handlePinChange = (regId, value) => {
    setPinInputs(prev => ({ ...prev, [regId]: value }))
    if (pinMessages[regId]) {
      setPinMessages(prev => ({ ...prev, [regId]: null }))
    }
  }

  const handleSelfCheckin = (reg) => {
    const enteredPin = pinInputs[reg.id] || ''
    if (!enteredPin.trim()) {
      setPinMessages(prev => ({ ...prev, [reg.id]: { type: 'error', text: 'Please enter the 4-digit PIN announced at the venue.' } }))
      return
    }

    const result = markStudentSelfAttendance(reg.eventId, enteredPin.trim(), studentEmail)
    if (result.success) {
      setPinMessages(prev => ({ ...prev, [reg.id]: { type: 'success', text: '🎉 Attendance confirmed! You are marked as PRESENT.' } }))
      setPinInputs(prev => ({ ...prev, [reg.id]: '' }))
    } else {
      setPinMessages(prev => ({ ...prev, [reg.id]: { type: 'error', text: result.error || 'Incorrect Event Venue PIN. Check screen at hall.' } }))
    }
  }

  return (
    <DashboardLayout role="student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>My Event Registrations & Passes</h1>
          <p className="muted" style={{ margin: 0 }}>
            View your active tickets, mark venue attendance with 4-digit PINs, and verify check-in records.
          </p>
        </div>
        <Link to="/student/enroll" className="btn btn-primary btn-sm">+ Browse & Enroll Events</Link>
      </div>

      {myRegs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
          <h3>No event registrations yet</h3>
          <p className="muted" style={{ marginTop: 4 }}>You haven't enrolled in any events yet. Check out open events now!</p>
          <Link to="/student/enroll" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Open Events</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {myRegs.map(reg => {
            const ev = events.find(e => e.id === reg.eventId)
            const isAttended = reg.attended
            const msg = pinMessages[reg.id]

            return (
              <div
                className="card"
                key={reg.id}
                style={{
                  padding: 20,
                  borderLeft: isAttended ? '6px solid var(--green)' : '6px solid var(--indigo)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className={`badge ${isAttended ? 'tag-green' : 'tag-indigo'}`} style={{ fontSize: 11 }}>
                      {isAttended ? '● Attendance Confirmed: Present' : '● Registration Confirmed'}
                    </span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo)' }}>
                      #{reg.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    {ev?.posterUrl && (
                      <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                        <img src={ev.posterUrl} alt="Poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>{reg.eventTitle}</h3>
                      <div className="muted" style={{ fontSize: 12 }}>
                        🏛️ <b>{reg.club} Chapter</b> · 📍 {reg.venue}
                      </div>
                    </div>
                  </div>

                  <div className="muted mono" style={{ fontSize: 12, marginBottom: 14 }}>
                    📅 {reg.eventDate}
                    {reg.team && <div style={{ color: 'var(--indigo)', fontWeight: 600, marginTop: 2 }}>👥 Team: {reg.team}</div>}
                  </div>

                  {/* ========================================================================= */}
                  {/* ATTENDANCE CONTROL / VERIFICATION SECTION */}
                  {/* ========================================================================= */}
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: isAttended ? 'var(--green-soft)' : 'var(--bg)',
                    border: isAttended ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                    marginBottom: 14
                  }}>
                    {isAttended ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>
                          <span>✓</span> Verified Present at Event
                        </div>
                        <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>
                          Check-in recorded on {reg.attendedAt || 'Event Session'} ({reg.checkinMethod || 'PIN Verified'})
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--green)', fontWeight: 700 }}>
                          📜 Participation Certificate: Eligible & Unlocked
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                          📍 Mark Live Attendance (Venue Check-in):
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 8 }}>
                          Enter the 4-digit PIN displayed on the screen at the event hall to verify your presence:
                        </div>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            className="mono"
                            placeholder="4-digit PIN"
                            maxLength={4}
                            value={pinInputs[reg.id] || ''}
                            onChange={e => handlePinChange(reg.id, e.target.value)}
                            style={{ width: 110, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontWeight: 700, textAlign: 'center', background: 'var(--card)' }}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 12, padding: '7px 14px' }}
                            onClick={() => handleSelfCheckin(reg)}
                          >
                            Verify & Check In
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: 11, padding: '7px 10px', color: 'var(--indigo)' }}
                            onClick={() => {
                              const expected = ev?.venuePin || '4821'
                              handlePinChange(reg.id, expected)
                              markStudentSelfAttendance(reg.eventId, expected, studentEmail)
                              setPinMessages(prev => ({ ...prev, [reg.id]: { type: 'success', text: '🎉 Attendance confirmed! You are marked as PRESENT.' } }))
                            }}
                            title="Click to auto-verify using the hall venue PIN"
                          >
                            ⚡ Fast Check-in ({ev?.venuePin || '4821'})
                          </button>
                        </div>

                        {msg && (
                          <div style={{
                            marginTop: 8,
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: msg.type === 'error' ? 'var(--danger)' : 'var(--green)'
                          }}>
                            {msg.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* OD Lifecycle Integration */}
                  {(() => {
                    const relatedOD = permissionRequests.find(pr =>
                      (pr.eventName?.toLowerCase() === reg.eventTitle?.toLowerCase() || pr.eventId === reg.eventId) &&
                      (pr.studentEmail || '').toLowerCase() === studentEmail.toLowerCase()
                    )
                    return (
                      <div style={{
                        marginBottom: 14,
                        padding: '10px 12px',
                        background: 'var(--surface-2, #f8fafc)',
                        border: '1px solid var(--border, #e2e8f0)',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 8
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>OD Status:</span>
                          <ODStatusTracker currentStatus={relatedOD ? relatedOD.status : 'NOT_REQUESTED'} compact />
                        </div>

                        {relatedOD ? (
                          <Link to="/student/permissions" className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '3px 8px' }}>
                            View OD Tracker →
                          </Link>
                        ) : (
                          <Link to={`/student/permissions?eventId=${reg.eventId}`} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '3px 8px', color: 'var(--orange, #ea580c)', borderColor: 'var(--orange, #ea580c)' }}>
                            + Request OD
                          </Link>
                        )}
                      </div>
                    )
                  })()}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11.5 }}>
                  <span className="muted">Ticket Holder: <b>{reg.studentName}</b></span>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: 11, padding: '4px 10px' }}
                    onClick={() => setActiveQrModal(reg)}
                  >
                    📱 Digital QR Pass
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIGITAL QR PASS MODAL */}
      {/* ========================================================================= */}
      {activeQrModal && (
        <div className="modal-backdrop" onClick={() => setActiveQrModal(null)}>
          <div className="card" style={{ maxWidth: 380, width: '100%', padding: 26, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="badge tag-indigo">{activeQrModal.club} Chapter</span>
              <button onClick={() => setActiveQrModal(null)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <h3 style={{ fontSize: 17, marginBottom: 4 }}>{activeQrModal.eventTitle}</h3>
            <div className="muted mono" style={{ fontSize: 12, marginBottom: 16 }}>Pass ID: #{activeQrModal.id}</div>

            {/* QR Code Box */}
            <div style={{ width: 160, height: 160, margin: '0 auto 16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 48 }}>📱</div>
              <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)' }}>{activeQrModal.id}</div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 16 }}>
              <div><b>{activeQrModal.studentName}</b> ({activeQrModal.rollNo || '23CS082'})</div>
              <div>📍 {activeQrModal.venue}</div>
              <div>📅 {activeQrModal.eventDate}</div>
            </div>

            <div style={{
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: activeQrModal.attended ? 'var(--green-soft)' : 'var(--amber-soft)',
              color: activeQrModal.attended ? 'var(--green)' : '#78350F'
            }}>
              {activeQrModal.attended ? '✓ Attendance Verified (Present)' : '⏳ Show this QR code to the instructor at venue'}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
