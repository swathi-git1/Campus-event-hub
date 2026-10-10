import React from 'react'

export function SkeletonRow({ columns = 4 }) {
  return (
    <tr className="skeleton-row" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '16px 14px' }}>
          <div
            style={{
              height: 14,
              background: '#e2e8f0',
              borderRadius: 4,
              width: i === 0 ? '70%' : i === 1 ? '45%' : '85%'
            }}
          />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        >
          <div style={{ height: 160, background: '#e2e8f0' }} />
          <div style={{ padding: 20 }}>
            <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, width: '80%', marginBottom: 12 }} />
            <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, width: '50%', marginBottom: 16 }} />
            <div style={{ height: 36, background: '#f1f5f9', borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
