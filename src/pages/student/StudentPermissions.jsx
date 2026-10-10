import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { studentAccounts, externalEventPresets } from '../../data/mockData'
import SearchInput from '../../components/SearchInput'
import Pagination from '../../components/Pagination'
import ODStatusTracker from '../../components/ODStatusTracker'

const SAMPLE_PROOF_PHOTOS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
]

const SAMPLE_CERTIFICATES = [
  "https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
]

export default function StudentPermissions() {
  const { user } = useAuth()
  const {
    events,
    permissionRequests,
    odRecords,
    submitPermissionRequest,
    submitParticipationProof,
    deletePermissionRequest
  } = useData()

  const [searchParams] = useSearchParams()
  const prefillEventId = searchParams.get('eventId')

  const studentEmail = user?.email || 'student@college.edu'
  const myRequests = permissionRequests.filter(
    r => (r.studentEmail || '').toLowerCase() === studentEmail.toLowerCase()
  )

  // Modals state
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showODModal, setShowODModal] = useState(false)
  const [activeRequest, setActiveRequest] = useState(null)
  const [activeOD, setActiveOD] = useState(null)

  // Status Filter
  const [statusFilter, setStatusFilter] = useState('all')

  // New Request Form State
  const [eventTypeScope, setEventTypeScope] = useState('external') // 'internal' | 'external'
  const [selectedInternalEventId, setSelectedInternalEventId] = useState('')
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Inter-College Hackathon',
    organizer: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventEndDate: new Date().toISOString().split('T')[0],
    eventTime: '09:00 AM – 05:00 PM',
    venue: '',
    purpose: '',
    relatedClub: 'CSI',
    teamMembers: [],
    invitationDocName: 'Event_Brochure_Invitation.pdf',
    invitationDocUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    additionalRemarks: ''
  })
  const [formError, setFormError] = useState('')
  const [selectedTeammateEmail, setSelectedTeammateEmail] = useState('')

  // Proof Upload Form State
  const [proofForm, setProofForm] = useState({
    description: '',
    selectedPhoto: SAMPLE_PROOF_PHOTOS[0],
    selectedCertificate: SAMPLE_CERTIFICATES[0],
    customCertificateName: 'Participation_Certificate_Final.pdf'
  })
  const [proofSuccessMsg, setProofSuccessMsg] = useState('')

  // Pre-fill from query params if available
  useEffect(() => {
    if (prefillEventId) {
      const ev = events.find(e => e.id === Number(prefillEventId))
      if (ev) {
        setEventTypeScope('internal')
        setSelectedInternalEventId(String(ev.id))
        setFormData(prev => ({
          ...prev,
          eventName: ev.title,
          eventType: 'Internal College Event',
          organizer: `${ev.club} Chapter`,
          eventDate: ev.date || new Date().toISOString().split('T')[0],
          eventEndDate: ev.date || new Date().toISOString().split('T')[0],
          eventTime: '09:00 AM – 05:00 PM',
          venue: ev.venue || 'Main College Campus',
          purpose: `Official student participation in ${ev.title} conducted by ${ev.club} Chapter.`,
          relatedClub: ev.club
        }))
        setShowRequestModal(true)
      }
    }
  }, [prefillEventId, events])

  // Handle Internal Event Selection
  const handleInternalEventSelect = (e) => {
    const id = e.target.value
    setSelectedInternalEventId(id)
    if (!id) return
    const ev = events.find(item => item.id === Number(id))
    if (ev) {
      setFormData(prev => ({
        ...prev,
        eventName: ev.title,
        eventType: 'Internal College Event',
        organizer: `${ev.club} Chapter`,
        eventDate: ev.date || new Date().toISOString().split('T')[0],
        eventEndDate: ev.date || new Date().toISOString().split('T')[0],
        venue: ev.venue || 'Campus Auditorium',
        relatedClub: ev.club,
        purpose: `Attending college-level event "${ev.title}".`
      }))
    }
  }

  // Handle External Preset Selection
  const handlePresetSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      eventName: preset.title,
      eventType: preset.type,
      organizer: preset.organizer,
      venue: preset.location,
      purpose: `Representing our college in ${preset.title} organized by ${preset.organizer}.`
    }))
  }

  // Teammates handling
  const handleAddTeammate = () => {
    if (!selectedTeammateEmail) return
    const student = studentAccounts.find(s => s.email.toLowerCase() === selectedTeammateEmail.toLowerCase())
    if (!student) return
    if (formData.teamMembers.some(t => t.email.toLowerCase() === student.email.toLowerCase())) {
      setSelectedTeammateEmail('')
      return
    }
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          dept: student.dept
        }
      ]
    }))
    setSelectedTeammateEmail('')
  }

  const handleRemoveTeammate = (email) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(t => t.email.toLowerCase() !== email.toLowerCase())
    }))
  }

  // Submit Permission Request
  const handleSubmitRequest = (e) => {
    e.preventDefault()
    setFormError('')
    if (!formData.eventName.trim()) {
      setFormError('Please enter the event name.')
      return
    }
    if (!formData.venue.trim()) {
      setFormError('Please specify the event venue or location.')
      return
    }
    if (!formData.purpose.trim()) {
      setFormError('Please explain the purpose of attending this event.')
      return
    }

    const payload = {
      ...formData,
      scope: eventTypeScope === 'internal' ? 'Internal' : 'External',
      eventId: eventTypeScope === 'internal' && selectedInternalEventId ? Number(selectedInternalEventId) : null,
      rollNo: user?.rollNo || '23CS082',
      dept: user?.dept || 'Computer Science & Engineering',
      year: user?.year || '3rd Year'
    }

    const result = submitPermissionRequest(payload)
    if (result.success) {
      setShowRequestModal(false)
      // Reset form
      setFormData({
        eventName: '',
        eventType: 'Inter-College Hackathon',
        organizer: '',
        eventDate: new Date().toISOString().split('T')[0],
        eventEndDate: new Date().toISOString().split('T')[0],
        eventTime: '09:00 AM – 05:00 PM',
        venue: '',
        purpose: '',
        relatedClub: 'CSI',
        teamMembers: [],
        invitationDocName: 'Event_Brochure_Invitation.pdf',
        invitationDocUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
        additionalRemarks: ''
      })
    } else {
      setFormError(result.error || 'Failed to submit permission request.')
    }
  }

  // Open Proof Upload Modal
  const handleOpenProofModal = (req) => {
    setActiveRequest(req)
    setProofForm({
      description: req.proof?.description || '',
      selectedPhoto: req.proof?.photos?.[0] || SAMPLE_PROOF_PHOTOS[0],
      selectedCertificate: req.proof?.certificateUrl || SAMPLE_CERTIFICATES[0],
      customCertificateName: 'Participation_Certificate.pdf'
    })
    setProofSuccessMsg('')
    setShowProofModal(true)
  }

  // Submit Proof
  const handleSubmitProof = (e) => {
    e.preventDefault()
    if (!activeRequest) return

    const proofData = {
      photos: [proofForm.selectedPhoto],
      certificateUrl: proofForm.selectedCertificate,
      attendanceProofUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      description: proofForm.description || `Successfully attended ${activeRequest.eventName}. Valid certificate and event photo attached.`
    }

    const res = submitParticipationProof(activeRequest.id, proofData)
    if (res.success) {
      setProofSuccessMsg('✓ Participation proof submitted successfully! The Faculty OD In-Charge has been notified.')
      setTimeout(() => {
        setShowProofModal(false)
        setProofSuccessMsg('')
      }, 1200)
    }
  }

  // View Details Modal
  const handleOpenDetailModal = (req) => {
    setActiveRequest(req)
    setShowDetailModal(true)
  }

  // View Official OD Pass Modal
  const handleOpenODModal = (req) => {
    const record = odRecords.find(od => od.id === req.odRecordId || od.requestId === req.id)
    if (record) {
      setActiveOD(record)
      setShowODModal(true)
    }
  }

  // Search, Sort & Pagination State
  const [requestSearch, setRequestSearch] = useState('')
  const [requestSort, setRequestSort] = useState('date_desc')
  const [requestPage, setRequestPage] = useState(1)
  const [requestPageSize, setRequestPageSize] = useState(6)

  // Filter requests
  const processedRequests = useMemo(() => {
    let list = myRequests.filter(req => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending' && req.status !== 'Pending Approval') return false
        if (statusFilter === 'approved' && req.status !== 'Approved') return false
        if (statusFilter === 'proof' && (req.status !== 'Proof Submitted' && req.status !== 'Proof Verification Pending')) return false
        if (statusFilter === 'od_issued' && req.status !== 'OD Issued') return false
        if (statusFilter === 'rejected' && (req.status !== 'Rejected' && req.status !== 'Proof Rejected')) return false
      }
      if (requestSearch.trim()) {
        const q = requestSearch.toLowerCase()
        const matches = (req.eventName || '').toLowerCase().includes(q) ||
          (req.organizer || '').toLowerCase().includes(q) ||
          (req.venue || '').toLowerCase().includes(q) ||
          (req.relatedClub || '').toLowerCase().includes(q) ||
          (req.scope || '').toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })

    if (requestSort === 'date_desc') {
      list.sort((a, b) => new Date(b.createdAt || b.eventDate || 0) - new Date(a.createdAt || a.eventDate || 0))
    } else if (requestSort === 'date_asc') {
      list.sort((a, b) => new Date(a.createdAt || a.eventDate || 0) - new Date(b.createdAt || b.eventDate || 0))
    } else if (requestSort === 'name_asc') {
      list.sort((a, b) => (a.eventName || '').localeCompare(b.eventName || ''))
    }
    return list
  }, [myRequests, statusFilter, requestSearch, requestSort])

  const totalRequests = processedRequests.length
  const totalPages = Math.ceil(totalRequests / requestPageSize) || 1
  const paginatedRequests = useMemo(() => {
    const s = (requestPage - 1) * requestPageSize
    return processedRequests.slice(s, s + requestPageSize)
  }, [processedRequests, requestPage, requestPageSize])

  return (
    <DashboardLayout role="student">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Event Permission & On-Duty (OD) Portal</h1>
            <span className="badge tag-purple">Student Portal</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Submit permission requests for internal & external college events, track faculty review, upload participation proofs, and receive authorized On-Duty (OD) passes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEventTypeScope('external')
              setShowRequestModal(true)
            }}
          >
            + Request Event Permission
          </button>
          <Link to="/student/history" className="btn btn-outline">
            📜 My Participation History
          </Link>
        </div>
      </div>

      {/* Workflow Explainer Banner */}
      <div className="card" style={{ padding: 18, marginBottom: 22, background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--indigo)', marginBottom: 8 }}>
          ℹ️ Official 6-Step Permission & On-Duty (OD) Policy
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, fontSize: 12 }}>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--indigo)' }}>
            <b>1. Request</b><br /><span className="muted">Submit event details & invite</span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--amber)' }}>
            <b>2. Faculty Review</b><br /><span className="muted">Permission Approved / Denied</span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--purple)' }}>
            <b>3. Attend Event</b><br /><span className="muted">Internal or External venue</span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid #6366F1' }}>
            <b>4. Upload Proof</b><br /><span className="muted">Photos, certificates & slips</span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--teal)' }}>
            <b>5. Verification</b><br /><span className="muted">Faculty validates documents</span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--green)' }}>
            <b>6. OD Issuance</b><br /><span className="muted">Official OD Pass generated</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8, fontStyle: 'italic' }}>
          * Important: As per college regulations, approving permission authorizes attendance but does NOT automatically grant On-Duty (OD). OD is strictly issued only after event attendance and proof verification.
        </div>
      </div>

      {/* Search, Sort and Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
        <SearchInput
          value={requestSearch}
          onChange={val => {
            setRequestSearch(val)
            setRequestPage(1)
          }}
          placeholder="Search requests by event name, organizer, venue, club..."
          style={{ flex: 1, minWidth: 260 }}
        />

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={requestSort}
            onChange={e => {
              setRequestSort(e.target.value)
              setRequestPage(1)
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--ink)',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <option value="date_desc">📅 Submitted (Newest first)</option>
            <option value="date_asc">📅 Submitted (Oldest first)</option>
            <option value="name_asc">🔤 Event Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div className="chip-row" style={{ gap: 8 }}>
          <button className={`chip ${statusFilter === 'all' ? 'on' : ''}`} onClick={() => { setStatusFilter('all'); setRequestPage(1); }}>
            All Requests ({myRequests.length})
          </button>
          <button className={`chip ${statusFilter === 'pending' ? 'on' : ''}`} onClick={() => { setStatusFilter('pending'); setRequestPage(1); }}>
            ⏳ Pending Approval ({myRequests.filter(r => r.status === 'Pending Approval').length})
          </button>
          <button className={`chip ${statusFilter === 'approved' ? 'on' : ''}`} onClick={() => { setStatusFilter('approved'); setRequestPage(1); }}>
            ✅ Approved — Proof Pending ({myRequests.filter(r => r.status === 'Approved').length})
          </button>
          <button className={`chip ${statusFilter === 'proof' ? 'on' : ''}`} onClick={() => { setStatusFilter('proof'); setRequestPage(1); }}>
            📷 Proof In Verification ({myRequests.filter(r => r.status === 'Proof Submitted').length})
          </button>
          <button className={`chip ${statusFilter === 'od_issued' ? 'on' : ''}`} onClick={() => { setStatusFilter('od_issued'); setRequestPage(1); }}>
            🎖️ OD Issued ({myRequests.filter(r => r.status === 'OD Issued').length})
          </button>
          <button className={`chip ${statusFilter === 'rejected' ? 'on' : ''}`} onClick={() => { setStatusFilter('rejected'); setRequestPage(1); }}>
            ✕ Rejected ({myRequests.filter(r => r.status === 'Rejected' || r.status === 'Proof Rejected').length})
          </button>
        </div>

        <span className="muted" style={{ fontSize: 12 }}>
          Showing {paginatedRequests.length} of {totalRequests} requests
        </span>
      </div>

      {/* Requests Grid */}
      {processedRequests.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
          <h3 style={{ fontSize: 18, marginBottom: 6 }}>No requests found</h3>
          <p className="muted" style={{ fontSize: 13, maxWidth: 440, margin: '0 auto 18px' }}>
            {requestSearch.trim()
              ? `No requests match "${requestSearch}". Try adjusting your search term.`
              : statusFilter === 'all'
              ? 'You have not submitted any event permission requests yet. Click the button below to submit a request for an upcoming event.'
              : `No requests with status "${statusFilter}".`}
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRequestModal(true)}>
            + Submit Permission Request
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
          {paginatedRequests.map(req => {
            const isApproved = req.status === 'Approved'
            const isODIssued = req.status === 'OD Issued'
            const isPending = req.status === 'Pending Approval'
            const isProofSubmitted = req.status === 'Proof Submitted'
            const isProofVerified = req.status === 'Proof Verified'
            const isRejected = req.status === 'Rejected'
            const isProofRejected = req.status === 'Proof Rejected'

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
                    : isApproved
                    ? '6px solid var(--green)'
                    : isProofSubmitted
                    ? '6px solid var(--purple)'
                    : isRejected || isProofRejected
                    ? '6px solid var(--danger)'
                    : '6px solid var(--amber)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${req.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`}>
                        {req.scope} Event
                      </span>
                      <span className="badge tag-slate">{req.eventType}</span>
                    </div>

                    <span
                      className={`badge ${
                        isODIssued ? 'tag-teal' :
                        isApproved ? 'tag-green' :
                        isProofVerified ? 'tag-green' :
                        isProofSubmitted ? 'tag-purple' :
                        isRejected || isProofRejected ? 'tag-danger' : 'tag-amber'
                      }`}
                      style={{ fontSize: 11, fontWeight: 700 }}
                    >
                      {isODIssued ? '🎖️ OD Issued' :
                       isApproved ? '✅ Permission Approved' :
                       isProofVerified ? '✓ Proof Verified' :
                       isProofSubmitted ? '⏳ Verification Pending' :
                       isProofRejected ? '✕ Proof Rejected' :
                       isRejected ? '❌ Request Rejected' : '⏳ Pending Review'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 17, margin: '0 0 6px', lineHeight: 1.3 }}>{req.eventName}</h3>

                  <div className="muted mono" style={{ fontSize: 12, marginBottom: 4 }}>
                    📅 {req.eventDate} {req.eventEndDate && req.eventEndDate !== req.eventDate ? `to ${req.eventEndDate}` : ''}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                    📍 {req.venue}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
                    🏛️ Organizer: <b>{req.organizer}</b>
                  </div>

                  {/* Teammates indicator */}
                  {req.teamMembers && req.teamMembers.length > 0 && (
                    <div style={{ fontSize: 11.5, background: 'var(--bg)', padding: '6px 10px', borderRadius: 6, marginBottom: 12 }}>
                      👥 <b>Teammates ({req.teamMembers.length}):</b> {req.teamMembers.map(t => t.name).join(', ')}
                    </div>
                  )}

                  {/* 8-State Visual OD Status Tracker */}
                  <ODStatusTracker currentStatus={req.status} remarks={req.facultyRemarks || req.proof?.verificationRemarks} />
                </div>

                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>
                    Ref: #{req.id}
                  </span>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenDetailModal(req)}
                      style={{ fontSize: 11.5, padding: '5px 10px' }}
                    >
                      Dossier Timeline 📋
                    </button>

                    {(isApproved || isProofRejected) && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenProofModal(req)}
                        style={{ fontSize: 11.5, padding: '5px 12px' }}
                      >
                        📷 Upload Proof
                      </button>
                    )}

                    {isODIssued && (
                      <button
                        className="btn btn-green btn-sm"
                        onClick={() => handleOpenODModal(req)}
                        style={{ fontSize: 11.5, padding: '5px 12px' }}
                      >
                        🎖️ View OD Pass
                      </button>
                    )}

                    {isPending && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to withdraw this permission request?')) {
                            deletePermissionRequest(req.id)
                          }
                        }}
                        style={{ fontSize: 11, color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {totalRequests > requestPageSize && (
        <div style={{ marginTop: 20 }}>
          <Pagination
            page={requestPage}
            totalPages={totalPages}
            totalItems={totalRequests}
            pageSize={requestPageSize}
            onPageChange={setRequestPage}
            onPageSizeChange={size => {
              setRequestPageSize(size)
              setRequestPage(1)
            }}
          />
        </div>
      )}

      {/* MODAL 1: Submit Permission Request */}
      {showRequestModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0 }}>Request Event Permission & OD</h2>
                <div className="muted" style={{ fontSize: 12 }}>Formal Student Academic Clearance Request</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowRequestModal(false)}>✕</button>
            </div>

            {formError && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmitRequest}>
              {/* Event Scope Switcher */}
              <div className="tabs" style={{ marginBottom: 16 }}>
                <div
                  className={`tab ${eventTypeScope === 'external' ? 'active' : ''}`}
                  onClick={() => {
                    setEventTypeScope('external')
                    setSelectedInternalEventId('')
                  }}
                >
                  🌐 External / Inter-College Event
                </div>
                <div
                  className={`tab ${eventTypeScope === 'internal' ? 'active' : ''}`}
                  onClick={() => setEventTypeScope('internal')}
                >
                  🏛️ Internal College Campus Event
                </div>
              </div>

              {/* Internal Event Selector if scope is Internal */}
              {eventTypeScope === 'internal' && (
                <div className="field">
                  <label>Select Scheduled Campus Event *</label>
                  <select value={selectedInternalEventId} onChange={handleInternalEventSelect} required>
                    <option value="">-- Choose from active campus events directory --</option>
                    {events.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({e.club} Chapter · {e.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* External Quick Presets if scope is External */}
              {eventTypeScope === 'external' && (
                <div style={{ marginBottom: 14, background: 'var(--bg)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
                    ⚡ Popular External Competitions / Quick Select:
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {externalEventPresets.slice(0, 3).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="chip"
                        style={{ fontSize: 10.5 }}
                        onClick={() => handlePresetSelect(p)}
                      >
                        {p.title.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Name */}
              <div className="field">
                <label>Event Name / Title *</label>
                <input
                  value={formData.eventName}
                  onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="e.g. National Smart India Hackathon 2026"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Event Type / Category *</label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    <option value="Inter-College Hackathon">Inter-College Hackathon</option>
                    <option value="Inter-College Competition">Inter-College Competition</option>
                    <option value="Symposium / Technical Fest">Symposium / Technical Fest</option>
                    <option value="Workshop & Hands-On Training">Workshop & Hands-On Training</option>
                    <option value="National / International Conference">National / International Conference</option>
                    <option value="Seminar / Guest Lecture">Seminar / Guest Lecture</option>
                    <option value="Inter-College Cultural">Inter-College Cultural</option>
                    <option value="Inter-College Sports">Inter-College Sports</option>
                    <option value="Internal College Event">Internal College Event</option>
                  </select>
                </div>

                <div className="field">
                  <label>Organizing Body / Institute *</label>
                  <input
                    value={formData.organizer}
                    onChange={e => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="e.g. IIT Madras / CSI Council"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.eventEndDate}
                    onChange={e => setFormData({ ...formData, eventEndDate: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>Session Timings *</label>
                  <input
                    value={formData.eventTime}
                    onChange={e => setFormData({ ...formData, eventTime: e.target.value })}
                    placeholder="09:00 AM – 05:00 PM"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div className="field">
                  <label>Event Venue & City *</label>
                  <input
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. IC&SR Auditorium, IIT Madras, Chennai"
                    required
                  />
                </div>

                <div className="field">
                  <label>Related Club (if any)</label>
                  <select
                    value={formData.relatedClub}
                    onChange={e => setFormData({ ...formData, relatedClub: e.target.value })}
                  >
                    <option value="General">General / Academic</option>
                    <option value="CSI">CSI (Computer Society)</option>
                    <option value="IEEE">IEEE Student Branch</option>
                    <option value="IE">IE (Institution of Engineers)</option>
                    <option value="Fine Arts">Fine Arts Guild</option>
                    <option value="Sports">Sports Council</option>
                    <option value="Yoga">Yoga & Wellness</option>
                    <option value="NSS">NSS Outreach</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Purpose of Attending & Learning Objective *</label>
                <textarea
                  rows={2}
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Explain why you are attending and how it benefits your academic / skill development..."
                  required
                />
              </div>

              {/* Team Members Selection */}
              <div className="field">
                <label>Friends / Team Members Attending (Registered Students)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <select
                    value={selectedTeammateEmail}
                    onChange={e => setSelectedTeammateEmail(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Add teammate from student directory --</option>
                    {studentAccounts
                      .filter(s => s.email.toLowerCase() !== studentEmail.toLowerCase())
                      .map(s => (
                        <option key={s.id} value={s.email}>
                          {s.name} ({s.rollNo} · {s.dept})
                        </option>
                      ))}
                  </select>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddTeammate}>
                    + Add Teammate
                  </button>
                </div>

                {formData.teamMembers.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {formData.teamMembers.map(t => (
                      <span
                        key={t.email}
                        className="badge tag-indigo"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        {t.name} ({t.rollNo})
                        <b style={{ cursor: 'pointer', color: 'var(--danger)' }} onClick={() => handleRemoveTeammate(t.email)}>✕</b>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
                  ℹ️ Note: Adding team members links them to this delegation. However, permission and OD records remain individually tracked.
                </div>
              </div>

              {/* Supporting Document / Brochure */}
              <div className="field">
                <label>Event Invitation / Brochure / Acceptance Document</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <span>📄</span>
                  <div style={{ flex: 1, fontSize: 12 }}>
                    <b>{formData.invitationDocName}</b>
                    <div className="muted" style={{ fontSize: 11 }}>Official invitation / registration confirmation pass</div>
                  </div>
                  <span className="badge tag-teal">Attached</span>
                </div>
              </div>

              <div className="field">
                <label>Additional Remarks (Optional)</label>
                <input
                  value={formData.additionalRemarks}
                  onChange={e => setFormData({ ...formData, additionalRemarks: e.target.value })}
                  placeholder="e.g. Travel arrangements, kit approvals, or project mentor..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit for Faculty Review →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Participation Proof */}
      {showProofModal && activeRequest && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0 }}>Upload Participation Proof</h2>
                <div className="muted" style={{ fontSize: 12 }}>Event: {activeRequest.eventName}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowProofModal(false)}>✕</button>
            </div>

            {proofSuccessMsg && (
              <div style={{ background: 'var(--green-soft)', border: '1px solid var(--green)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>
                {proofSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSubmitProof}>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 14, background: 'var(--bg)', padding: 10, borderRadius: 8 }}>
                💡 <b>OD Issuance Requirement:</b> Upload photographs, certificates, or attendance proof received at the event venue. The Faculty OD In-Charge will review these before issuing your official On-Duty (OD) pass.
              </div>

              {/* 1. Event Photograph */}
              <div className="field">
                <label>1. Event Photograph (At Venue / Stage / Presentation) *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
                  {SAMPLE_PROOF_PHOTOS.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setProofForm({ ...proofForm, selectedPhoto: url })}
                      style={{
                        height: 70,
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: proofForm.selectedPhoto === url ? '3px solid var(--indigo)' : '1px solid var(--border)',
                        position: 'relative'
                      }}
                    >
                      <img src={url} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {proofForm.selectedPhoto === url && (
                        <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--indigo)', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Participation / Merit Certificate */}
              <div className="field">
                <label>2. Participation Certificate / Merit Award *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
                  {SAMPLE_CERTIFICATES.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setProofForm({ ...proofForm, selectedCertificate: url })}
                      style={{
                        height: 90,
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: proofForm.selectedCertificate === url ? '3px solid var(--green)' : '1px solid var(--border)',
                        position: 'relative'
                      }}
                    >
                      <img src={url} alt="Certificate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {proofForm.selectedCertificate === url && (
                        <span style={{ position: 'absolute', top: 4, right: 4, background: 'var(--green)', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700 }}>Selected Certificate</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Attendance Sheet or Pass Confirmation */}
              <div className="field">
                <label>3. Attendance Proof Document</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <span>📋</span>
                  <div style={{ flex: 1, fontSize: 12 }}>
                    <b>Attendance_Slip_Venue_Stampped.pdf</b>
                    <div className="muted" style={{ fontSize: 11 }}>Official organizer seal & registration desk check-in confirmation</div>
                  </div>
                  <span className="badge tag-green">Attached</span>
                </div>
              </div>

              <div className="field">
                <label>Participation Summary / Notes</label>
                <textarea
                  rows={2}
                  value={proofForm.description}
                  onChange={e => setProofForm({ ...proofForm, description: e.target.value })}
                  placeholder="e.g. Attended all workshop sessions / Secured 2nd place in finals..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowProofModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Proof for Verification →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Detailed Request Dossier & Timeline */}
      {showDetailModal && activeRequest && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 700 }}>
                  REF #{activeRequest.id}
                </span>
                <h2 style={{ fontSize: 20, margin: '2px 0 0' }}>{activeRequest.eventName}</h2>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            {/* 6-Step Visual Timeline */}
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 12 }}>
                📍 Participation & OD Lifecycle Progress:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--green)', fontSize: 15 }}>✓</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Step 1: Permission Request Submitted</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      Submitted on {new Date(activeRequest.submittedAt).toLocaleDateString()} by {activeRequest.studentName}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: activeRequest.reviewedAt ? (activeRequest.status === 'Rejected' ? 'var(--danger)' : 'var(--green)') : 'var(--amber)', fontSize: 15 }}>
                    {activeRequest.reviewedAt ? (activeRequest.status === 'Rejected' ? '✕' : '✓') : '⏳'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      Step 2: Faculty Review & Approval
                    </div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {activeRequest.reviewedAt
                        ? `Reviewed by ${activeRequest.reviewedBy || 'Faculty OD In-Charge'}: ${activeRequest.facultyRemarks || 'Approved'}`
                        : 'Awaiting review by Faculty OD In-Charge'}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: ['Approved', 'Proof Submitted', 'Proof Verified', 'OD Issued'].includes(activeRequest.status) ? 'var(--green)' : 'var(--slate)', fontSize: 15 }}>
                    {['Approved', 'Proof Submitted', 'Proof Verified', 'OD Issued'].includes(activeRequest.status) ? '✓' : '○'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Step 3: Event Attendance</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      Event Date: {activeRequest.eventDate} at {activeRequest.venue}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: activeRequest.proof ? 'var(--green)' : 'var(--slate)', fontSize: 15 }}>
                    {activeRequest.proof ? '✓' : '○'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Step 4: Participation Proof Upload</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {activeRequest.proof
                        ? `Uploaded on ${new Date(activeRequest.proof.submittedAt).toLocaleDateString()}`
                        : 'Pending student proof upload after event'}
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: activeRequest.proof?.verifiedAt || activeRequest.status === 'OD Issued' ? 'var(--green)' : 'var(--slate)', fontSize: 15 }}>
                    {activeRequest.proof?.verifiedAt || activeRequest.status === 'OD Issued' ? '✓' : '○'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Step 5: Proof Verification</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {activeRequest.proof?.verifiedAt || activeRequest.status === 'OD Issued'
                        ? `Verified by Faculty: ${activeRequest.proof?.verificationRemarks || 'Authentic documentation confirmed.'}`
                        : 'Pending faculty inspection of proof files'}
                    </div>
                  </div>
                </div>

                {/* Step 6 */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: activeRequest.status === 'OD Issued' ? 'var(--teal)' : 'var(--slate)', fontSize: 15 }}>
                    {activeRequest.status === 'OD Issued' ? '🎖️' : '○'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Step 6: Official On-Duty (OD) Issuance</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {activeRequest.status === 'OD Issued'
                        ? `Official Pass #${activeRequest.odRecordId} issued! Attendance credited.`
                        : 'On-Duty will be generated upon proof verification'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Summary Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12.5, marginBottom: 16 }}>
              <div><b>Scope:</b> {activeRequest.scope}</div>
              <div><b>Category:</b> {activeRequest.eventType}</div>
              <div><b>Organizer:</b> {activeRequest.organizer}</div>
              <div><b>Venue:</b> {activeRequest.venue}</div>
              <div><b>Dates:</b> {activeRequest.eventDate} to {activeRequest.eventEndDate}</div>
              <div><b>Related Club:</b> {activeRequest.relatedClub} Chapter</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 4 }}>Purpose & Objective:</div>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {activeRequest.purpose}
              </p>
            </div>

            {/* Attached Proof Preview if submitted */}
            {activeRequest.proof && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 8 }}>Uploaded Proof Files:</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {activeRequest.proof.photos?.[0] && (
                    <img
                      src={activeRequest.proof.photos[0]}
                      alt="Proof"
                      style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  )}
                  {activeRequest.proof.certificateUrl && (
                    <img
                      src={activeRequest.proof.certificateUrl}
                      alt="Certificate"
                      style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowDetailModal(false)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Official Printable On-Duty (OD) Certificate Pass */}
      {showODModal && activeOD && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="card" style={{ maxWidth: 660, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 32, background: '#fff', color: '#111827', border: '3px double #374151' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #E5E7EB', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4F46E5' }}>
                CENTRAL COLLEGE OF ENGINEERING & TECHNOLOGY
              </div>
              <h2 style={{ fontSize: 22, margin: '4px 0 2px', fontFamily: "'Fraunces', serif" }}>
                OFFICIAL ON-DUTY (OD) SANCTION PASS
              </h2>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                Office of the Dean (Student Affairs) & Student Participation Clearance Committee
              </div>
            </div>

            {/* Pass Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: '#F9FAFB', padding: '10px 16px', borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' }}>Pass Ref No:</span><br />
                <b className="mono" style={{ fontSize: 14, color: '#111827' }}>{activeOD.id}</b>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' }}>Date Issued:</span><br />
                <b style={{ fontSize: 13 }}>{activeOD.issuedAt}</b>
              </div>
              <div>
                <span className="badge tag-teal" style={{ fontSize: 11 }}>● Validated & Active</span>
              </div>
            </div>

            {/* Student & Event Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13, marginBottom: 20 }}>
              <div><b>Student Name:</b> {activeOD.studentName}</div>
              <div><b>Register / Roll No:</b> {activeOD.rollNo}</div>
              <div><b>Department:</b> {activeOD.dept}</div>
              <div><b>Year / Degree:</b> {activeOD.year} · {activeOD.degree}</div>
              <div><b>Event Attended:</b> {activeOD.eventName}</div>
              <div><b>Category:</b> {activeOD.eventType}</div>
              <div><b>Organizing Body:</b> {activeOD.organizer}</div>
              <div><b>Venue:</b> {activeOD.venue}</div>
              <div><b>Approved Dates:</b> {activeOD.eventDates}</div>
              <div><b>Total OD Days Credited:</b> <span className="badge tag-indigo">{activeOD.totalDaysOD} Day(s)</span></div>
            </div>

            {/* Verification Remarks */}
            <div style={{ background: '#F3F4F6', padding: 14, borderRadius: 8, fontSize: 12, marginBottom: 24, lineHeight: 1.5 }}>
              <b>Verification Certification:</b><br />
              {activeOD.remarks}
              <div style={{ marginTop: 6, fontSize: 11, color: '#4B5563' }}>
                Ref Permission Dossier: <b>#{activeOD.requestId}</b> · Verification Code: <b>{activeOD.verificationReference}</b>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* QR Code representation */}
                <div style={{ width: 68, height: 68, background: '#111827', borderRadius: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, textAlign: 'center', padding: 6, lineHeight: 1.2 }}>
                  [QR VERIFIED<br />OD-AUTH]
                </div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>
                  Scan to verify<br />registry authenticity.
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{activeOD.issuedBy}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{activeOD.issuerDesignation}</div>
                <div style={{ fontSize: 10, color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  [DIGITALLY VERIFIED UNIVERSITY SEAL]
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                🖨️ Print OD Pass
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowODModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
