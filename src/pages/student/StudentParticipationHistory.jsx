import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export default function StudentParticipationHistory() {
  const { user } = useAuth()
  const { permissionRequests, odRecords, registrations, events } = useData()

  const studentEmail = user?.email || 'student@college.edu'
  const myRequests = permissionRequests.filter(
    r => (r.studentEmail || '').toLowerCase() === studentEmail.toLowerCase()
  )
  const myODRecords = odRecords.filter(
    od => (od.studentEmail || '').toLowerCase() === studentEmail.toLowerCase()
  )

  const [filterType, setFilterType] = useState('all') // 'all', 'internal', 'external', 'od_issued'
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedOD, setSelectedOD] = useState(null)

  const filteredItems = myRequests.filter(r => {
    if (filterType === 'all') return true
    if (filterType === 'internal') return r.scope === 'Internal'
    if (filterType === 'external') return r.scope === 'External'
    if (filterType === 'od_issued') return r.status === 'OD Issued'
    return true
  })

  const handleOpenODModal = (req) => {
    const record = odRecords.find(od => od.id === req.odRecordId || od.requestId === req.id)
    if (record) {
      setSelectedOD(record)
    }
  }

  return (
    <DashboardLayout role="student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>My Participation & Event History</h1>
            <span className="badge tag-teal">Verified Academic Record</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Complete audit trail of all campus and inter-collegiate events, with stage-by-stage progression from permission request to On-Duty (OD) issuance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/student/permissions" className="btn btn-primary btn-sm">
            + Request New Permission
          </Link>
          <Link to="/student/registrations" className="btn btn-outline btn-sm">
            🎟️ My Event Passes
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="stat-strip" style={{ marginBottom: 24 }}>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>{myRequests.length}</div>
          <div className="stat-label">Total Participations</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--purple)' }}>
            {myRequests.filter(r => r.scope === 'External').length}
          </div>
          <div className="stat-label">External Delegations</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--amber)' }}>
            {myRequests.filter(r => r.scope === 'Internal').length}
          </div>
          <div className="stat-label">Internal Campus Events</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--green)' }}>
            {myRequests.filter(r => r.proof).length}
          </div>
          <div className="stat-label">Proofs Submitted</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>
            {myODRecords.length}
          </div>
          <div className="stat-label">Official OD Passes Issued</div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div className="chip-row" style={{ gap: 8 }}>
          <button className={`chip ${filterType === 'all' ? 'on' : ''}`} onClick={() => setFilterType('all')}>
            All Events ({myRequests.length})
          </button>
          <button className={`chip ${filterType === 'external' ? 'on' : ''}`} onClick={() => setFilterType('external')}>
            🌐 External Competitions ({myRequests.filter(r => r.scope === 'External').length})
          </button>
          <button className={`chip ${filterType === 'internal' ? 'on' : ''}`} onClick={() => setFilterType('internal')}>
            🏛️ Internal Events ({myRequests.filter(r => r.scope === 'Internal').length})
          </button>
          <button className={`chip ${filterType === 'od_issued' ? 'on' : ''}`} onClick={() => setFilterType('od_issued')}>
            🎖️ Official OD Passes ({myRequests.filter(r => r.status === 'OD Issued').length})
          </button>
        </div>
      </div>

      {/* Participation Timeline History Feed */}
      {filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
          <h3>No events in this view</h3>
          <p className="muted" style={{ margin: '4px 0 16px' }}>
            Submit a permission request to track your participation lifecycle.
          </p>
          <Link to="/student/permissions" className="btn btn-primary btn-sm">Submit Permission Request</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredItems.map(req => {
            const hasProof = Boolean(req.proof)
            const isApproved = req.status === 'Approved'
            const isProofSubmitted = req.status === 'Proof Submitted'
            const isProofVerified = req.status === 'Proof Verified'
            const isODIssued = req.status === 'OD Issued'
            const isRejected = req.status === 'Rejected'
            const isProofRejected = req.status === 'Proof Rejected'

            // Stage index: 1 to 6
            let currentStage = 1
            if (isRejected) currentStage = 2
            else if (isODIssued) currentStage = 6
            else if (isProofVerified) currentStage = 5
            else if (isProofSubmitted) currentStage = 4
            else if (isApproved) currentStage = 3

            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: 24,
                  borderLeft: isODIssued
                    ? '6px solid var(--teal)'
                    : isRejected
                    ? '6px solid var(--danger)'
                    : isProofSubmitted
                    ? '6px solid var(--purple)'
                    : '6px solid var(--indigo)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className={`badge ${req.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`}>
                        {req.scope} Event
                      </span>
                      <span className="badge tag-slate">{req.eventType}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>#{req.id}</span>
                    </div>

                    <h2 style={{ fontSize: 19, margin: 0 }}>{req.eventName}</h2>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                      Organized by <b>{req.organizer}</b> · 📅 {req.eventDate} {req.eventEndDate && req.eventEndDate !== req.eventDate ? `to ${req.eventEndDate}` : ''} · 📍 {req.venue}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${
                        isODIssued ? 'tag-teal' :
                        isApproved ? 'tag-green' :
                        isProofVerified ? 'tag-green' :
                        isProofSubmitted ? 'tag-purple' :
                        isRejected || isProofRejected ? 'tag-danger' : 'tag-amber'
                      }`}
                      style={{ fontSize: 11.5, padding: '6px 12px' }}
                    >
                      {isODIssued ? '🎖️ OD Issued & Sanctioned' :
                       isApproved ? '✅ Permission Approved' :
                       isProofVerified ? '✓ Proof Verified' :
                       isProofSubmitted ? '📷 Proof Under Verification' :
                       isRejected ? '❌ Request Rejected' : '⏳ Pending Faculty Approval'}
                    </span>
                    {isODIssued && req.odRecordId && (
                      <div className="mono" style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, marginTop: 4 }}>
                        Pass #{req.odRecordId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed 6-Step Visual Timeline Component */}
                <div style={{ margin: '14px 0 20px', background: 'var(--bg)', borderRadius: 12, padding: 18, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-soft)', marginBottom: 14 }}>
                    Official Progression Timeline:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, position: 'relative' }}>
                    {/* Stage 1: Permission Requested */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
                      }}>✓</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>1. Requested</div>
                      <div className="muted mono" style={{ fontSize: 9.5 }}>{new Date(req.submittedAt).toLocaleDateString()}</div>
                    </div>

                    {/* Stage 2: Permission Approved */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: isRejected ? 'var(--danger)' : currentStage >= 2 ? 'var(--green)' : 'var(--surface-2)',
                        color: currentStage >= 2 || isRejected ? '#fff' : 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        border: currentStage >= 2 ? 'none' : '1px solid var(--border)'
                      }}>{isRejected ? '✕' : currentStage >= 2 ? '✓' : '2'}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>2. Permission</div>
                      <div className="muted" style={{ fontSize: 9.5 }}>{isRejected ? 'Rejected' : req.reviewedAt ? 'Approved' : 'Pending'}</div>
                    </div>

                    {/* Stage 3: Event Attended */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: currentStage >= 3 ? 'var(--green)' : 'var(--surface-2)',
                        color: currentStage >= 3 ? '#fff' : 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        border: currentStage >= 3 ? 'none' : '1px solid var(--border)'
                      }}>{currentStage >= 3 ? '✓' : '3'}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>3. Attended</div>
                      <div className="muted mono" style={{ fontSize: 9.5 }}>{req.eventDate}</div>
                    </div>

                    {/* Stage 4: Proof Uploaded */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: currentStage >= 4 ? 'var(--green)' : 'var(--surface-2)',
                        color: currentStage >= 4 ? '#fff' : 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        border: currentStage >= 4 ? 'none' : '1px solid var(--border)'
                      }}>{currentStage >= 4 ? '✓' : '4'}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>4. Proof</div>
                      <div className="muted" style={{ fontSize: 9.5 }}>{hasProof ? 'Uploaded' : 'Pending'}</div>
                    </div>

                    {/* Stage 5: Proof Verified */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: currentStage >= 5 ? 'var(--green)' : 'var(--surface-2)',
                        color: currentStage >= 5 ? '#fff' : 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        border: currentStage >= 5 ? 'none' : '1px solid var(--border)'
                      }}>{currentStage >= 5 ? '✓' : '5'}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>5. Verified</div>
                      <div className="muted" style={{ fontSize: 9.5 }}>{req.proof?.verifiedAt || isODIssued ? 'Validated' : 'Pending'}</div>
                    </div>

                    {/* Stage 6: OD Issued */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                        background: currentStage >= 6 ? 'var(--teal)' : 'var(--surface-2)',
                        color: currentStage >= 6 ? '#fff' : 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        border: currentStage >= 6 ? 'none' : '1px solid var(--border)'
                      }}>{currentStage >= 6 ? '🎖️' : '6'}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>6. OD Issued</div>
                      <div className="muted" style={{ fontSize: 9.5 }}>{isODIssued ? 'Sanctioned' : 'Pending'}</div>
                    </div>
                  </div>
                </div>

                {/* Proof Photographs & Certificate Thumbnails if submitted */}
                {req.proof && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>
                      📸 Uploaded Event Proof & Credentials:
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      {req.proof.photos?.[0] && (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={req.proof.photos[0]}
                            alt="Event Proof"
                            style={{ width: 110, height: 75, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 9, padding: '2px 4px', borderRadius: 4 }}>Photo</span>
                        </div>
                      )}
                      {req.proof.certificateUrl && (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={req.proof.certificateUrl}
                            alt="Certificate"
                            style={{ width: 110, height: 75, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 9, padding: '2px 4px', borderRadius: 4 }}>Certificate</span>
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)', maxWidth: 400 }}>
                        <i>"{req.proof.description || 'Verified event participation.'}"</i>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer and Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    Reviewed By: <b style={{ color: 'var(--ink)' }}>{req.reviewedBy || 'Pending Faculty Assignment'}</b>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {isODIssued ? (
                      <button
                        className="btn btn-green btn-sm"
                        onClick={() => handleOpenODModal(req)}
                        style={{ fontSize: 12 }}
                      >
                        🎖️ View Official OD Sanction Pass
                      </button>
                    ) : isApproved ? (
                      <Link
                        to="/student/permissions"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 12 }}
                      >
                        📷 Upload Participation Proof →
                      </Link>
                    ) : (
                      <Link
                        to="/student/permissions"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 12 }}
                      >
                        Track in Permissions Desk →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Official OD Pass Modal */}
      {selectedOD && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 660, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 32, background: 'var(--card)', color: 'var(--ink)', border: '2px solid var(--border)', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
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

            {/* Pass Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'var(--surface-1)', padding: '12px 18px', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Pass Ref No:</span><br />
                <b className="mono" style={{ fontSize: 14, color: 'var(--ink)' }}>{selectedOD.id}</b>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Date Issued:</span><br />
                <b style={{ fontSize: 13, color: 'var(--ink)' }}>{selectedOD.issuedAt}</b>
              </div>
              <div>
                <span className="badge tag-teal" style={{ fontSize: 11 }}>● Validated & Active</span>
              </div>
            </div>

            {/* Student & Event Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13, marginBottom: 20, color: 'var(--ink)' }}>
              <div><b style={{ color: 'var(--ink-soft)' }}>Student Name:</b> <div>{selectedOD.studentName}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Register / Roll No:</b> <div>{selectedOD.rollNo}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Department:</b> <div>{selectedOD.dept}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Year / Degree:</b> <div>{selectedOD.year} · {selectedOD.degree}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Event Attended:</b> <div>{selectedOD.eventName}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Category:</b> <div>{selectedOD.eventType}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Organizing Body:</b> <div>{selectedOD.organizer}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Venue:</b> <div>{selectedOD.venue}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Approved Dates:</b> <div>{selectedOD.eventDates}</div></div>
              <div><b style={{ color: 'var(--ink-soft)' }}>Total OD Days Credited:</b> <div><span className="badge tag-indigo">{selectedOD.totalDaysOD} Day(s)</span></div></div>
            </div>

            {/* Verification Remarks */}
            <div style={{ background: 'var(--surface-1)', padding: 14, borderRadius: 10, fontSize: 12, marginBottom: 24, lineHeight: 1.5, border: '1px solid var(--border)' }}>
              <b style={{ color: 'var(--ink)' }}>Verification Certification:</b><br />
              <span style={{ color: 'var(--ink-soft)' }}>{selectedOD.remarks}</span>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-muted)' }}>
                Ref Permission Dossier: <b style={{ color: 'var(--ink)' }}>#{selectedOD.requestId}</b> · Verification Code: <b style={{ color: 'var(--ink)' }}>{selectedOD.verificationReference}</b>
              </div>
            </div>

            {/* Signatures & QR Code */}
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
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{selectedOD.issuedBy}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{selectedOD.issuerDesignation}</div>
                <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>
                  [DIGITALLY VERIFIED UNIVERSITY SEAL]
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                🖨️ Print OD Pass
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedOD(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
