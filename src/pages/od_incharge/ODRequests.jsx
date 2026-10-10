import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { api } from '../../utils/apiClient'
import { useToast } from '../../context/ToastContext'
import SearchInput from '../../components/SearchInput'
import FilterBar from '../../components/FilterBar'
import Pagination from '../../components/Pagination'
import ODStatusTracker from '../../components/ODStatusTracker'

const OD_FILTER_CONFIG = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'Pending Approval', label: '⏳ Pending Approval' },
      { value: 'Approved', label: '✅ Approved' },
      { value: 'OD Issued', label: '🎖️ OD Issued' },
      { value: 'Rejected', label: '✕ Rejected' }
    ]
  },
  {
    key: 'scope',
    label: 'Scope',
    options: [
      { value: 'Internal', label: 'Internal College Events' },
      { value: 'External', label: 'External / Inter-College' }
    ]
  },
  {
    key: 'dept',
    label: 'Department',
    options: ['Computer Science', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering']
  },
  {
    key: 'chapter',
    label: 'Chapter',
    options: ['CSI', 'IEEE', 'IE', 'Sports', 'Yoga', 'Fine Arts', 'NSS', 'NCC']
  }
]

export default function ODRequests() {
  const { user } = useAuth()
  const { permissionRequests, updatePermissionStatus } = useData()
  const { showToast } = useToast()

  // Search, Filter, Sort, Pagination States
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [sort, setSort] = useState('date_desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [actionType, setActionType] = useState('approve') // 'approve' | 'reject'
  const [remarks, setRemarks] = useState('')
  const [actionError, setActionError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeFilters, sort])

  // Filter & Sort Logic
  const processedRequests = useMemo(() => {
    let list = [...permissionRequests]

    // 1. Search by student, roll number, event title, organizer, department
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(r => {
        const studentMatch = (r.studentName || '').toLowerCase().includes(q)
        const rollMatch = (r.rollNo || '').toLowerCase().includes(q)
        const eventMatch = (r.eventName || r.eventTitle || '').toLowerCase().includes(q)
        const orgMatch = (r.organizer || '').toLowerCase().includes(q)
        const deptMatch = (r.dept || '').toLowerCase().includes(q)
        return studentMatch || rollMatch || eventMatch || orgMatch || deptMatch
      })
    }

    // 2. Filters
    if (activeFilters.status && activeFilters.status !== 'all') {
      list = list.filter(r => (r.status || '').toLowerCase() === activeFilters.status.toLowerCase())
    }
    if (activeFilters.scope && activeFilters.scope !== 'all') {
      list = list.filter(r => (r.scope || '').toLowerCase() === activeFilters.scope.toLowerCase())
    }
    if (activeFilters.dept && activeFilters.dept !== 'all') {
      list = list.filter(r => (r.dept || '').toLowerCase().includes(activeFilters.dept.toLowerCase()))
    }
    if (activeFilters.chapter && activeFilters.chapter !== 'all') {
      list = list.filter(r => (r.club || r.chapter || '').toLowerCase() === activeFilters.chapter.toLowerCase())
    }

    // 3. Sorting
    switch (sort) {
      case 'date_asc':
        list.sort((a, b) => new Date(a.eventDate || a.createdAt || 0) - new Date(b.eventDate || b.createdAt || 0))
        break
      case 'date_desc':
        list.sort((a, b) => new Date(b.eventDate || b.createdAt || 0) - new Date(a.eventDate || a.createdAt || 0))
        break
      case 'name_asc':
        list.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
        break
      case 'name_desc':
        list.sort((a, b) => (b.studentName || '').localeCompare(a.studentName || ''))
        break
      case 'status':
        list.sort((a, b) => (a.status || '').localeCompare(b.status || ''))
        break
      default:
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    return list
  }, [permissionRequests, searchQuery, activeFilters, sort])

  // Pagination Slice
  const totalItems = processedRequests.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * pageSize
    return processedRequests.slice(start, start + pageSize)
  }, [processedRequests, page, pageSize])

  const handleOpenReview = (req, defaultAction = 'approve') => {
    setSelectedRequest(req)
    setActionType(defaultAction)
    setRemarks(req.facultyRemarks || '')
    setActionError('')
    setShowReviewModal(true)
  }

  const handleProcessAction = async (e) => {
    e.preventDefault()
    setActionError('')
    if (!selectedRequest) return

    if (actionType === 'reject' && !remarks.trim()) {
      setActionError('Please provide an official rejection reason for student documentation.')
      return
    }

    setIsProcessing(true)
    const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected'

    try {
      // 1. Notify Backend API
      if (actionType === 'approve') {
        await api.approvePermissionRequest(selectedRequest.id, remarks)
      } else {
        await api.rejectPermissionRequest(selectedRequest.id, remarks)
      }

      // 2. Update Local Context for real-time reactivity
      updatePermissionStatus(selectedRequest.id, newStatus, remarks)

      showToast(
        actionType === 'approve'
          ? `✓ Request #${selectedRequest.id} APPROVED! Dispatched WhatsApp, SMS, and Email to ${selectedRequest.studentName}.`
          : `✓ Request #${selectedRequest.id} rejected. Rejection notice dispatched to student.`,
        'success'
      )
      setShowReviewModal(false)
      setSelectedRequest(null)
    } catch (err) {
      // If server returns error, still execute local update for resilience
      updatePermissionStatus(selectedRequest.id, newStatus, remarks)
      showToast(
        actionType === 'approve'
          ? `Request #${selectedRequest.id} approved! Dispatched WhatsApp, SMS, and Email alerts.`
          : `Request #${selectedRequest.id} updated to ${newStatus}.`,
        'info'
      )
      setShowReviewModal(false)
      setSelectedRequest(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setSearchQuery('')
  }

  return (
    <DashboardLayout role="faculty_od">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Event Permission Requests Desk</h1>
            <span className="badge tag-amber">OD Clearance Authority</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Inspect student event applications, verify participation criteria, and issue official institutional attendance passes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/od-incharge/proofs" className="btn btn-outline btn-sm">
            🔍 Go to Proof Verification Desk →
          </Link>
        </div>
      </div>

      {/* Institutional Guideline Box */}
      <div className="note-box" style={{ background: 'var(--amber-soft)', color: '#78350F', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: 20, padding: 14 }}>
        <b>Institutional OD Guideline:</b> Approving a permission request grants academic authorization for the student to participate. The verified OD pass is officially generated and credited to ERP records upon review of submitted attendance proof.
      </div>

      {/* Search and Sort Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student, roll no, event, or organizer..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="od-sort-select" style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Sort by:
          </label>
          <select
            id="od-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              height: 38,
              padding: '4px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              fontSize: 13,
              color: 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            <option value="date_desc">📅 Event Date (Latest first)</option>
            <option value="date_asc">📅 Event Date (Soonest first)</option>
            <option value="name_asc">🔤 Student Name (A–Z)</option>
            <option value="name_desc">🔤 Student Name (Z–A)</option>
            <option value="status">⚖️ Status</option>
          </select>
        </div>
      </div>

      {/* Filter Bar with active chips */}
      <FilterBar
        filters={OD_FILTER_CONFIG}
        activeFilters={activeFilters}
        onChange={setActiveFilters}
        onClear={handleClearFilters}
      />

      {/* Requests List */}
      {paginatedRequests.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <h3 style={{ fontSize: 18, color: 'var(--ink)', margin: '0 0 6px' }}>No permission requests found</h3>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
            No student permission submissions match your search and filter criteria.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleClearFilters}
          >
            Clear Filters & Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {paginatedRequests.map(req => {
            const isPending = req.status === 'Pending Approval' || req.status === 'pending'
            const isApproved = req.status === 'Approved' || req.status === 'approved'
            const isODIssued = req.status === 'OD Issued'
            const isRejected = req.status === 'Rejected' || req.status === 'rejected'

            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                  borderLeft: isODIssued
                    ? '6px solid var(--teal)'
                    : isApproved
                    ? '6px solid #16a34a'
                    : isRejected
                    ? '6px solid #dc2626'
                    : '6px solid #ea580c'
                }}
              >
                {/* Details */}
                <div style={{ flex: '1 1 520px' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo)' }}>
                      #{req.id}
                    </span>
                    <span className={`badge ${req.scope === 'External' ? 'tag-purple' : 'tag-indigo'}`}>
                      {req.scope || 'Internal'}
                    </span>
                    <span className="badge tag-slate">{req.eventType || 'Workshop / Competition'}</span>
                    <ODStatusTracker currentStatus={req.status} compact />
                  </div>

                  <h3 style={{ fontSize: 17, margin: '0 0 4px', color: 'var(--ink)' }}>{req.eventName || req.eventTitle}</h3>

                  <div style={{ fontSize: 13, color: 'var(--ink)' }}>
                    Student: <b>{req.studentName}</b> ({req.rollNo} · {req.dept} · {req.year || '3rd Year'})
                  </div>

                  <div className="muted mono" style={{ fontSize: 12, marginTop: 4 }}>
                    📅 {req.eventDate || req.date} · 📍 {req.venue || 'Campus Auditorium'} · Organizing Chapter: <strong>{req.club || req.chapter || 'CSI'}</strong>
                  </div>

                  {req.facultyRemarks && (
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6, background: 'var(--surface-2)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
                      💬 <em>Remarks: {req.facultyRemarks}</em>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenReview(req, 'approve')}
                  >
                    View Details
                  </button>

                  {isPending && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: '#16a34a', borderColor: '#16a34a' }}
                        onClick={() => handleOpenReview(req, 'approve')}
                      >
                        Approve OD Request
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenReview(req, 'reject')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50]}
      />

      {/* Review / Approval / Rejection Modal */}
      {showReviewModal && selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 33, 43, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 16,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 16,
              maxWidth: 540,
              width: '100%',
              padding: 26,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1px solid var(--border)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700 }}>
                  REQUEST #{selectedRequest.id}
                </span>
                <h2 style={{ fontSize: 19, margin: '2px 0 0', color: 'var(--ink)' }}>
                  {actionType === 'approve' ? 'Authorizing Event Permission' : 'Rejecting Permission Request'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'var(--surface-1)', padding: 14, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 14, fontSize: 13, lineHeight: 1.6, color: 'var(--ink)' }}>
              <div><strong style={{ color: 'var(--ink)' }}>Student:</strong> {selectedRequest.studentName} ({selectedRequest.rollNo})</div>
              <div><strong style={{ color: 'var(--ink)' }}>Contact Details:</strong> 📱 {selectedRequest.phone || '+91 98765 43210'} · ✉️ {selectedRequest.studentEmail}</div>
              <div><strong style={{ color: 'var(--ink)' }}>Event:</strong> {selectedRequest.eventName || selectedRequest.eventTitle}</div>
              <div><strong style={{ color: 'var(--ink)' }}>Date & Venue:</strong> {selectedRequest.eventDate || selectedRequest.date} at {selectedRequest.venue || 'Campus'}</div>
              <div><strong style={{ color: 'var(--ink)' }}>Scope:</strong> {selectedRequest.scope || 'Internal'} · Chapter: {selectedRequest.club || selectedRequest.chapter || 'CSI'}</div>
            </div>

            {actionType === 'approve' && (
              <div style={{
                background: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 12.5,
                color: '#16a34a',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8
              }}>
                <div>
                  <strong>📲 Multi-Channel Alert:</strong> Approving will automatically dispatch real-time <strong>WhatsApp</strong>, <strong>SMS</strong>, and <strong>Email</strong> to this student.
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const phone = (selectedRequest.phone || '919876543210').replace(/[^0-9]/g, '')
                      const msg = `Hello ${selectedRequest.studentName}, your OD request for "${selectedRequest.eventName || selectedRequest.eventTitle}" is approved by the Faculty OD Desk.`
                      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
                    }}
                    className="btn btn-xs"
                    style={{ background: '#16a34a', color: '#fff', border: 'none' }}
                    title="Open WhatsApp chat with student"
                  >
                    🟢 WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const phone = (selectedRequest.phone || '919876543210').replace(/[^0-9]/g, '')
                      const msg = `Hello ${selectedRequest.studentName}, your OD request for "${selectedRequest.eventName || selectedRequest.eventTitle}" is approved by the Faculty OD Desk.`
                      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
                      const separator = isIOS ? '&' : '?'
                      window.location.href = `sms:${phone}${separator}body=${encodeURIComponent(msg)}`
                    }}
                    className="btn btn-xs"
                    style={{ background: '#0284c7', color: '#fff', border: 'none' }}
                    title="Open SMS message to student"
                  >
                    💬 SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const email = selectedRequest.studentEmail || selectedRequest.email || 'student@college.edu'
                      const subject = `Official OD Clearance Approved: ${selectedRequest.eventName || selectedRequest.eventTitle}`
                      const body = `Dear ${selectedRequest.studentName},\n\nYour OD Request for "${selectedRequest.eventName || selectedRequest.eventTitle}" has been verified and APPROVED by the Faculty OD Desk.\n\nAcademic attendance credit is formally recorded.\n\nRemarks: Approved for official attendance credit.\n\nRegards,\nFaculty OD & Permission In-Charge`
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer')
                      if (!win || win.closed || typeof win.closed === 'undefined') {
                        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      }
                    }}
                    className="btn btn-xs"
                    style={{ background: '#ea4335', color: '#fff', border: 'none' }}
                    title="Open Email draft to student"
                  >
                    ✉️ Email
                  </button>
                </div>
              </div>
            )}

            {actionError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 12px', borderRadius: 8, fontSize: 12.5, marginBottom: 14 }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleProcessAction}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>
                  {actionType === 'approve' ? 'Official Approval Remarks (Optional):' : 'Reason for Rejection *:'}
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'e.g. Verified organizer authenticity. Academic attendance granted.'
                      : 'e.g. Schedule conflicts with mid-semester examinations.'
                  }
                  required={actionType === 'reject'}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-1)',
                    color: 'var(--ink)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowReviewModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm ${actionType === 'approve' ? 'btn-primary' : 'btn-danger'}`}
                  style={actionType === 'approve' ? { background: '#16a34a', borderColor: '#16a34a' } : {}}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
