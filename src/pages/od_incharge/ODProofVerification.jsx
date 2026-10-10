import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export default function ODProofVerification() {
  const { user } = useAuth()
  const {
    permissionRequests,
    verifyParticipationProof,
    issueOnDuty,
    odRecords
  } = useData()

  // Filter: requests with proofs submitted or ready
  const requestsWithProof = permissionRequests.filter(r => Boolean(r.proof))

  const [activeTab, setActiveTab] = useState('pending') // 'pending' | 'verified' | 'all'
  const [selectedReq, setSelectedReq] = useState(null)
  const [showInspectorModal, setShowInspectorModal] = useState(false)
  const [showIssueODModal, setShowIssueODModal] = useState(false)

  // Verification & Remarks State
  const [remarks, setRemarks] = useState('')
  const [actionError, setActionError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // OD Issuance Form State
  const [odForm, setODForm] = useState({
    totalDaysOD: 1,
    dateRange: '',
    remarks: ''
  })

  const filteredList = requestsWithProof.filter(r => {
    if (activeTab === 'pending') return r.status === 'Proof Submitted'
    if (activeTab === 'verified') return r.status === 'Proof Verified' || r.status === 'OD Issued'
    return true
  })

  // Open Inspector
  const handleOpenInspector = (req) => {
    setSelectedReq(req)
    setRemarks(req.proof?.verificationRemarks || '')
    setActionError('')
    setSuccessMsg('')
    setShowInspectorModal(true)
  }

  // Handle Verify or Reject Proof
  const handleVerify = (isApproved) => {
    if (!selectedReq) return
    setActionError('')

    if (!isApproved && !remarks.trim()) {
      setActionError('Please enter a specific reason for rejecting the proof so the student can resubmit.')
      return
    }

    const res = verifyParticipationProof(
      selectedReq.id,
      isApproved,
      remarks || (isApproved ? 'Proof documents authenticated. Participation validated.' : '')
    )

    if (res.success) {
      setSuccessMsg(
        isApproved
          ? '✓ Participation proof VERIFIED! You can now issue the official On-Duty (OD) pass.'
          : 'Proof rejected. Student notified to resubmit authentic proof.'
      )
      setTimeout(() => {
        if (!isApproved) {
          setShowInspectorModal(false)
        }
      }, 1400)
    } else {
      setActionError(res.error || 'Failed to update verification status.')
    }
  }

  // Open OD Issuance Form
  const handleOpenIssueOD = (req) => {
    setSelectedReq(req)
    const dates = `${req.eventDate}${req.eventEndDate && req.eventEndDate !== req.eventDate ? ' to ' + req.eventEndDate : ''}`
    setODForm({
      totalDaysOD: 1,
      dateRange: dates,
      remarks: `Official On-Duty granted for verified participation in ${req.eventName}. Academic attendance accredited.`
    })
    setActionError('')
    setSuccessMsg('')
    setShowInspectorModal(false)
    setShowIssueODModal(true)
  }

  // Submit OD Issuance
  const handleConfirmIssueOD = (e) => {
    e.preventDefault()
    if (!selectedReq) return
    setActionError('')

    const res = issueOnDuty(selectedReq.id, {
      totalDaysOD: odForm.totalDaysOD,
      dateRange: odForm.dateRange,
      remarks: odForm.remarks
    })

    if (res.success) {
      setSuccessMsg(`🎖️ Official On-Duty (OD) Pass #${res.odRecord.id} successfully issued! Notification sent to student.`)
      setTimeout(() => {
        setShowIssueODModal(false)
        setSelectedReq(null)
        setSuccessMsg('')
      }, 1500)
    } else {
      setActionError(res.error || 'Failed to issue On-Duty.')
    }
  }

  return (
    <DashboardLayout role="faculty_od">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Participation Proof Verification & OD Issuance</h1>
            <span className="badge tag-purple">Step 5 & 6 Clearance Desk</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Inspect event certificates, photos, and attendance documentation uploaded by students after event completion before authorizing On-Duty (OD).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/od-incharge/records" className="btn btn-outline btn-sm">
            🎖️ View Issued OD Register →
          </Link>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="card" style={{ padding: 18, marginBottom: 22, background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            <b>Institutional Safeguard:</b> An approved permission request only allows the student to travel/attend. <b>OD is only generated here</b> after you inspect the student's actual event photos and completion certificates.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div className="chip-row" style={{ gap: 8 }}>
          <button className={`chip ${activeTab === 'pending' ? 'on' : ''}`} onClick={() => setActiveTab('pending')}>
            ⏳ Proofs Awaiting Verification ({requestsWithProof.filter(r => r.status === 'Proof Submitted').length})
          </button>
          <button className={`chip ${activeTab === 'verified' ? 'on' : ''}`} onClick={() => setActiveTab('verified')}>
            ✓ Verified & Sanctioned ({requestsWithProof.filter(r => r.status === 'Proof Verified' || r.status === 'OD Issued').length})
          </button>
          <button className={`chip ${activeTab === 'all' ? 'on' : ''}`} onClick={() => setActiveTab('all')}>
            All Proof Submissions ({requestsWithProof.length})
          </button>
        </div>
      </div>

      {/* Proof Submissions List */}
      {filteredList.length === 0 ? (
        <div className="card" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <h3>No proof submissions in this queue</h3>
          <p className="muted" style={{ margin: '4px 0 0' }}>
            {activeTab === 'pending'
              ? 'All uploaded student proofs have been verified.'
              : 'No verified proof records found.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
          {filteredList.map(req => {
            const isPendingProof = req.status === 'Proof Submitted'
            const isVerifiedProof = req.status === 'Proof Verified'
            const isODIssued = req.status === 'OD Issued'

            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: isODIssued
                    ? '6px solid var(--teal)'
                    : isVerifiedProof
                    ? '6px solid var(--green)'
                    : '6px solid var(--purple)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)' }}>
                      #{req.id}
                    </span>
                    <span
                      className={`badge ${
                        isODIssued ? 'tag-teal' :
                        isVerifiedProof ? 'tag-green' : 'tag-purple'
                      }`}
                      style={{ fontSize: 10 }}
                    >
                      {isODIssued ? '🎖️ OD Issued' :
                       isVerifiedProof ? '✓ Proof Verified' : '⏳ Proof Verification Pending'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>{req.eventName}</h3>

                  <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>
                    Student: <b>{req.studentName}</b> ({req.rollNo} · {req.dept})
                  </div>

                  <div className="muted mono" style={{ fontSize: 11.5, marginBottom: 12 }}>
                    📅 {req.eventDate} · 📍 {req.venue}
                  </div>

                  {/* Proof Thumbnail Strip */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    {req.proof.photos?.[0] && (
                      <div style={{ width: 88, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                        <img src={req.proof.photos[0]} alt="Event photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 8.5, padding: '1px 3px', borderRadius: 3 }}>Photo</span>
                      </div>
                    )}
                    {req.proof.certificateUrl && (
                      <div style={{ width: 88, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                        <img src={req.proof.certificateUrl} alt="Certificate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 8.5, padding: '1px 3px', borderRadius: 3 }}>Certificate</span>
                      </div>
                    )}
                    <div style={{ flex: 1, fontSize: 11.5, color: 'var(--ink-soft)' }}>
                      <i>"{req.proof.description || 'Participation proof uploaded.'}"</i>
                    </div>
                  </div>

                  {req.proof.verifiedBy && (
                    <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 10 }}>
                      ✓ Verified by {req.proof.verifiedBy} ({new Date(req.proof.verifiedAt).toLocaleDateString()})
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenInspector(req)}
                    style={{ fontSize: 11.5 }}
                  >
                    Inspect Files 🔍
                  </button>

                  {isPendingProof && (
                    <button
                      className="btn btn-green btn-sm"
                      onClick={() => handleOpenInspector(req)}
                      style={{ fontSize: 11.5 }}
                    >
                      Verify Proof →
                    </button>
                  )}

                  {isVerifiedProof && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenIssueOD(req)}
                      style={{ fontSize: 11.5 }}
                    >
                      🎖️ Issue Official OD
                    </button>
                  )}

                  {isODIssued && (
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--teal)' }}>
                      Pass #{req.odRecordId}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL 1: Inspect Files & Verify Proof */}
      {showInspectorModal && selectedReq && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 700 }}>
                  REF #{selectedReq.id}
                </span>
                <h2 style={{ fontSize: 20, margin: '2px 0 0' }}>Inspect Participation Proof</h2>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowInspectorModal(false)}>✕</button>
            </div>

            {successMsg && (
              <div style={{ background: 'var(--green-soft)', border: '1px solid var(--green)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>
                {successMsg}
              </div>
            )}

            {actionError && (
              <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
                ⚠️ {actionError}
              </div>
            )}

            {/* Student & Event Summary */}
            <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, fontSize: 12.5, marginBottom: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div><b>Student:</b> {selectedReq.studentName} ({selectedReq.rollNo})</div>
                <div><b>Department:</b> {selectedReq.dept} · {selectedReq.year}</div>
                <div><b>Event:</b> {selectedReq.eventName} ({selectedReq.scope})</div>
                <div><b>Venue & Date:</b> {selectedReq.venue} · {selectedReq.eventDate}</div>
              </div>
            </div>

            {/* Proof Images Inspector */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>Submitted Evidence Documents:</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Event Photo */}
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>
                    1. Event Presence Photograph:
                  </div>
                  {selectedReq.proof.photos?.[0] ? (
                    <div style={{ borderRadius: 10, overflow: 'hidden', height: 180, border: '1px solid var(--border)' }}>
                      <img src={selectedReq.proof.photos[0]} alt="Event Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="muted" style={{ padding: 20, textAlign: 'center', background: 'var(--bg)', borderRadius: 8 }}>No photo attached</div>
                  )}
                </div>

                {/* Certificate */}
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>
                    2. Participation / Merit Certificate:
                  </div>
                  {selectedReq.proof.certificateUrl ? (
                    <div style={{ borderRadius: 10, overflow: 'hidden', height: 180, border: '1px solid var(--border)' }}>
                      <img src={selectedReq.proof.certificateUrl} alt="Certificate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="muted" style={{ padding: 20, textAlign: 'center', background: 'var(--bg)', borderRadius: 8 }}>No certificate attached</div>
                  )}
                </div>
              </div>

              {/* Student notes */}
              <div style={{ marginTop: 14, background: 'var(--bg)', padding: 12, borderRadius: 8, fontSize: 12 }}>
                <b>Student's Participation Remarks:</b>
                <div style={{ color: 'var(--ink-soft)', marginTop: 2 }}>
                  "{selectedReq.proof.description || 'Verified event attendance.'}"
                </div>
              </div>
            </div>

            {/* Verification Remarks Input */}
            <div className="field">
              <label>Faculty Verification Notes / Assessment Remarks:</label>
              <input
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="e.g. Certificates verified authentic. Met all attendance requirements."
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
                onClick={() => handleVerify(false)}
              >
                ✕ Reject Proof & Request Resubmission
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {selectedReq.status === 'Proof Verified' ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenIssueOD(selectedReq)}
                  >
                    🎖️ Proceed to Issue Official OD Pass →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-green btn-sm"
                    onClick={() => handleVerify(true)}
                  >
                    ✓ Confirm & Verify Proof
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Issue Official OD Sanction Pass */}
      {showIssueODModal && selectedReq && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 620, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0 }}>Issue Official On-Duty (OD) Pass</h2>
                <div className="muted" style={{ fontSize: 12 }}>Step 6: Institutional Academic Sanction</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowIssueODModal(false)}>✕</button>
            </div>

            {successMsg && (
              <div style={{ background: 'var(--green-soft)', border: '1px solid var(--green)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>
                {successMsg}
              </div>
            )}

            {actionError && (
              <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
                ⚠️ {actionError}
              </div>
            )}

            <form onSubmit={handleConfirmIssueOD}>
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, fontSize: 12.5, marginBottom: 16 }}>
                <div><b>Student:</b> {selectedReq.studentName} ({selectedReq.rollNo})</div>
                <div><b>Department:</b> {selectedReq.dept} · {selectedReq.year}</div>
                <div><b>Event:</b> {selectedReq.eventName} ({selectedReq.scope})</div>
                <div><b>Proof Status:</b> <span className="badge tag-green">Verified Authentic</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Total Days of OD Credited *</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={odForm.totalDaysOD}
                    onChange={e => setODForm({ ...odForm, totalDaysOD: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>Sanctioned Date Range *</label>
                  <input
                    value={odForm.dateRange}
                    onChange={e => setODForm({ ...odForm, dateRange: e.target.value })}
                    placeholder="e.g. Aug 18, 2026 – Aug 20, 2026"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Official Sanction Endorsement Remarks *</label>
                <textarea
                  rows={3}
                  value={odForm.remarks}
                  onChange={e => setODForm({ ...odForm, remarks: e.target.value })}
                  placeholder="Official institutional endorsement remarks..."
                  required
                />
              </div>

              <div style={{ background: 'var(--teal-soft)', color: '#0F766E', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 18 }}>
                ✓ Authorized by: <b>{user?.name || 'Dr. Malathi Sundaram'}</b> ({user?.designation || 'Chief OD In-Charge'}). Digitally stamped with University Student Affairs seal.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowIssueODModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  🎖️ Authorize & Issue OD Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
