import React from 'react'

/**
 * 8-State OD Status Lifecycle:
 * 1. NOT_REQUESTED
 * 2. PENDING
 * 3. APPROVED
 * 4. REJECTED
 * 5. EVENT_ATTENDED
 * 6. CERTIFICATE_PENDING
 * 7. UNDER_VERIFICATION
 * 8. OD_ISSUED
 */

export const OD_STAGES = [
  { key: 'NOT_REQUESTED', label: 'Not Requested', icon: '⚪', desc: 'No OD request filed yet' },
  { key: 'PENDING', label: 'Under Review', icon: '⏳', desc: 'Awaiting OD Officer review' },
  { key: 'APPROVED', label: 'Sanctioned', icon: '✅', desc: 'Approved for event participation' },
  { key: 'EVENT_ATTENDED', label: 'Attended', icon: '📍', desc: 'Event attendance verified' },
  { key: 'CERTIFICATE_PENDING', label: 'Proof Needed', icon: '📄', desc: 'Upload certificate / attendance proof' },
  { key: 'UNDER_VERIFICATION', label: 'Verifying Proof', icon: '🔍', desc: 'OD Officer reviewing certificate' },
  { key: 'OD_ISSUED', label: 'OD Issued', icon: '🎖️', desc: 'Official On-Duty Pass generated' }
]

export function normalizeODStatus(status) {
  if (!status) return 'NOT_REQUESTED'
  const s = String(status).toUpperCase().replace(/[\s-]+/g, '_')
  if (s.includes('REJECT')) return 'REJECTED'
  if (s.includes('ISSUE') || s === 'SANCTIONED_FINAL') return 'OD_ISSUED'
  if (s.includes('VERIF') || s === 'PROOF_SUBMITTED') return 'UNDER_VERIFICATION'
  if (s.includes('CERT') || s === 'PROOF_PENDING') return 'CERTIFICATE_PENDING'
  if (s.includes('ATTEND') || s === 'CHECKED_IN') return 'EVENT_ATTENDED'
  if (s.includes('APPROV') || s === 'SANCTIONED') return 'APPROVED'
  if (s.includes('PEND') || s === 'APPLIED') return 'PENDING'
  return s
}

export function getStatusBadge(status) {
  const norm = normalizeODStatus(status)
  switch (norm) {
    case 'OD_ISSUED':
      return { label: 'Official OD Issued', bg: 'var(--green-soft, rgba(16, 185, 129, 0.16))', color: 'var(--green, #10b981)', border: 'var(--green, #10b981)', icon: '🎖️' }
    case 'UNDER_VERIFICATION':
      return { label: 'Under Verification', bg: 'var(--indigo-soft, rgba(59, 130, 246, 0.16))', color: 'var(--indigo, #3b82f6)', border: 'var(--indigo, #3b82f6)', icon: '🔍' }
    case 'CERTIFICATE_PENDING':
      return { label: 'Certificate Pending', bg: 'var(--amber-soft, rgba(245, 158, 11, 0.16))', color: 'var(--amber, #f59e0b)', border: 'var(--amber, #f59e0b)', icon: '⚠️' }
    case 'EVENT_ATTENDED':
      return { label: 'Event Attended', bg: 'var(--purple-soft, rgba(99, 102, 241, 0.16))', color: 'var(--purple, #8b5cf6)', border: 'var(--purple, #8b5cf6)', icon: '📍' }
    case 'APPROVED':
      return { label: 'OD Pre-Approved', bg: 'var(--green-soft, rgba(16, 185, 129, 0.14))', color: 'var(--green, #10b981)', border: 'var(--green, #34d399)', icon: '✅' }
    case 'REJECTED':
      return { label: 'OD Request Rejected', bg: 'var(--danger-soft, rgba(239, 68, 68, 0.16))', color: 'var(--danger, #ef4444)', border: 'var(--danger, #ef4444)', icon: '❌' }
    case 'PENDING':
      return { label: 'Approval Pending', bg: 'var(--orange-soft, rgba(245, 158, 11, 0.16))', color: 'var(--orange, #ea580c)', border: 'var(--orange, #f59e0b)', icon: '⏳' }
    default:
      return { label: 'Not Requested', bg: 'rgba(148, 163, 184, 0.14)', color: 'var(--ink-soft, #94a3b8)', border: 'var(--border, #cbd5e1)', icon: '⚪' }
  }
}

export default function ODStatusTracker({ currentStatus, remarks = '', compact = false }) {
  const normStatus = normalizeODStatus(currentStatus)
  const isRejected = normStatus === 'REJECTED'

  // Map progress index (0 to 6)
  const stageOrder = ['NOT_REQUESTED', 'PENDING', 'APPROVED', 'EVENT_ATTENDED', 'CERTIFICATE_PENDING', 'UNDER_VERIFICATION', 'OD_ISSUED']
  let currentIndex = stageOrder.indexOf(normStatus)
  if (currentIndex === -1) {
    if (isRejected) currentIndex = 1
    else currentIndex = 0
  }

  const badge = getStatusBadge(currentStatus)

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 6,
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: 'var(--font-mono, monospace)'
          }}
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="od-tracker-box" style={{
      background: 'var(--surface-2, #f8fafc)',
      border: '1px solid var(--border, #e2e8f0)',
      borderRadius: 12,
      padding: '16px 20px',
      margin: '12px 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink, #0f172a)' }}>
            OD Lifecycle Status:
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)'
            }}
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </span>
        </div>

        {remarks && (
          <div style={{ fontSize: 12, color: isRejected ? '#dc2626' : 'var(--ink-soft, #64748b)', fontStyle: 'italic' }}>
            Remark: "{remarks}"
          </div>
        )}
      </div>

      {isRejected ? (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          color: '#b91c1c',
          fontSize: 13,
          lineHeight: 1.5
        }}>
          <b>OD Application Rejected by In-Charge:</b> The submitted justification was disapproved. Please contact the OD Desk or re-apply with corrected attendance details.
        </div>
      ) : (
        <div className="od-stepper" style={{ position: 'relative', marginTop: 10 }}>
          {/* Progress Track Line */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: '4%',
            right: '4%',
            height: 3,
            background: 'var(--border, #cbd5e1)',
            zIndex: 1
          }}>
            <div style={{
              height: '100%',
              width: `${(currentIndex / (stageOrder.length - 1)) * 100}%`,
              background: '#10b981',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Stepper items */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2
          }}>
            {stageOrder.map((stageKey, idx) => {
              const stageDef = OD_STAGES.find(s => s.key === stageKey) || { label: stageKey, icon: '•' }
              const isPast = idx < currentIndex
              const isCurrent = idx === currentIndex
              return (
                <div key={stageKey} style={{ textAlign: 'center', width: `${100 / stageOrder.length}%` }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      margin: '0 auto 6px',
                      background: isCurrent ? '#ea580c' : isPast ? '#10b981' : 'var(--surface, #ffffff)',
                      border: isCurrent ? '2px solid #ea580c' : isPast ? '2px solid #10b981' : '2px solid var(--border, #cbd5e1)',
                      color: (isPast || isCurrent) ? '#ffffff' : 'var(--ink-soft, #94a3b8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      boxShadow: isCurrent ? '0 0 0 4px rgba(234, 88, 12, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    title={stageDef.desc}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--orange, #ea580c)' : isPast ? '#10b981' : 'var(--ink-soft, #64748b)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: '0 2px'
                  }}>
                    {stageDef.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
