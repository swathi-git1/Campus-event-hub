import React from 'react'

export default function Pagination({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = ''
}) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null
  }

  const isFirst = page <= 1
  const isLast = page >= totalPages

  const startRecord = Math.min((page - 1) * pageSize + 1, totalItems)
  const endRecord = Math.min(page * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const delta = 1
    const left = page - delta
    const right = page + delta + 1
    let prev = 0

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        if (prev && i - prev !== 1) {
          pages.push('...')
        }
        pages.push(i)
        prev = i
      }
    }
    return pages
  }

  return (
    <nav
      className={`pagination-container ${className}`}
      aria-label="Table pagination navigation"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '16px 0',
        marginTop: 16,
        borderTop: '1px solid var(--border, #e2e8f0)',
        fontSize: 13,
        color: 'var(--ink-soft, #64748b)'
      }}
    >
      {/* Result Count and Page Size Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span>
          Showing <strong style={{ color: 'var(--ink, #0f172a)' }}>{startRecord}–{endRecord}</strong> of{' '}
          <strong style={{ color: 'var(--ink, #0f172a)' }}>{totalItems}</strong> records
        </span>

        {pageSizeOptions && pageSizeOptions.length > 1 && onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label htmlFor="pagination-page-size" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Per page:
            </label>
            <select
              id="pagination-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Select number of records per page"
              style={{
                height: 32,
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--surface-2, #ffffff)',
                color: 'var(--ink, #0f172a)',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={isFirst}
          aria-label="Go to previous page"
          style={{
            height: 34,
            padding: '0 12px',
            borderRadius: 6,
            border: '1px solid var(--border, #cbd5e1)',
            background: isFirst ? 'var(--surface-1, #f8fafc)' : 'var(--surface-2, #ffffff)',
            color: isFirst ? 'var(--ink-muted, #94a3b8)' : 'var(--ink, #334155)',
            fontWeight: 600,
            cursor: isFirst ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            opacity: isFirst ? 0.5 : 1
          }}
        >
          <span>←</span>
          <span>Previous</span>
        </button>

        {/* Number Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {getPageNumbers().map((num, idx) => {
            if (num === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ padding: '0 6px', color: 'var(--ink-muted, #94a3b8)' }}
                  aria-hidden="true"
                >
                  ...
                </span>
              )
            }
            const isActive = num === page
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange?.(num)}
                aria-label={`Go to page ${num}`}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  border: isActive ? '1px solid var(--orange)' : '1px solid var(--border)',
                  background: isActive ? 'linear-gradient(135deg, var(--orange) 0%, #ea580c 100%)' : 'var(--surface-2)',
                  color: isActive ? '#ffffff' : 'var(--ink)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(234, 88, 12, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {num}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={isLast}
          aria-label="Go to next page"
          style={{
            height: 34,
            padding: '0 12px',
            borderRadius: 6,
            border: '1px solid var(--border, #cbd5e1)',
            background: isLast ? 'var(--surface-1, #f8fafc)' : 'var(--surface-2, #ffffff)',
            color: isLast ? 'var(--ink-muted, #94a3b8)' : 'var(--ink, #334155)',
            fontWeight: 600,
            cursor: isLast ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            opacity: isLast ? 0.5 : 1
          }}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>
    </nav>
  )
}
