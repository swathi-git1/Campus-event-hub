import React from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'

export default function Confirmation() {
  const location = useLocation()
  const { ticketId, eventTitle, eventDate, venue, club, team, venuePin } = location.state || {}

  if (!eventTitle) {
    return <Navigate to="/student/enroll" replace />
  }

  return (
    <DashboardLayout role="student">
      <div className="confirm-box" style={{ maxWidth: 480, margin: '20px auto' }}>
        <div className="checkmark">✓</div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>You're Enrolled!</h2>
        <p className="muted" style={{ fontSize: 14, margin: '0 0 20px' }}>
          Your confirmed entry pass for <b>{eventTitle}</b> is generated.
        </p>

        {/* Digital Ticket Card */}
        <div className="card" style={{ textAlign: 'left', padding: 22, marginBottom: 20, border: '1px solid var(--border)', background: 'var(--card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Digital Entry Ticket</span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>#{ticketId || 'REG-1001'}</span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--ink)' }}>{eventTitle}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14, lineHeight: 1.5 }}>
            <div>🏛️ {club || 'Campus'} Chapter</div>
            <div className="mono">📅 {eventDate}</div>
            <div>📍 {venue || 'Main Auditorium'}</div>
            {team && <div style={{ marginTop: 4, color: 'var(--indigo)', fontWeight: 600 }}>👥 Team: {team}</div>}
          </div>

          <div className="qr-box" style={{ margin: '14px auto' }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-2, #f8fafc)',
            border: '1px dashed var(--border, #cbd5e1)',
            borderRadius: 8,
            padding: '10px 14px',
            marginTop: 12
          }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-soft)' }}>
                Venue Check-In PIN
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                Enter at venue desk or in My Registrations
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              color: 'var(--orange, #ea580c)'
            }}>
              {venuePin || '4821'}
            </div>
          </div>
        </div>

        {/* Step 2 Callout: On-Duty (OD) Attendance Permission Application */}
        <div style={{
          background: 'rgba(234, 88, 12, 0.08)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'left',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>📝</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
              Need Official On-Duty (OD) Attendance?
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '0 0 12px', lineHeight: 1.5 }}>
            Apply for formal OD approval now. Once sanctioned by the OD In-Charge, attend the event and upload your certificate to get attendance credit.
          </p>
          <Link
            to={`/student/permissions?eventId=${ticketId ? ticketId.replace(/\D/g, '') || '1' : '1'}`}
            className="btn btn-primary"
            style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 13 }}
          >
            Apply for Event On-Duty (OD) Permission →
          </Link>
        </div>

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/student/registrations" className="btn btn-outline">
            View My Registrations
          </Link>
          <Link to="/student/enroll" className="btn btn-outline">
            Browse More Events
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
