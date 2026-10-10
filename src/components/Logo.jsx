import React from 'react'

/**
 * Enterprise SaaS Wordmark: Precision engineered dark badge with signature
 * vibrant orange square accent (#FF5500) and sleek modern typography.
 */
export default function Logo({ size = 22, withText = true, textSize = 14.5, dark = false }) {
  const markSize = Math.max(size, 20)
  const squareSize = Math.max(Math.floor(markSize * 0.35), 7)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div 
        style={{
          width: markSize,
          height: markSize,
          background: dark ? '#2A1810' : '#FFFDF9',
          border: dark ? '1px solid rgba(212, 155, 106, 0.3)' : '1px solid #D9C7B4',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: dark ? '0 0 14px rgba(194, 126, 67, 0.2)' : '0 2px 6px rgba(60, 36, 18, 0.06)',
        }}
      >
        <div 
          style={{
            width: squareSize,
            height: squareSize,
            background: 'var(--primary, #C27E43)',
            borderRadius: 2,
            boxShadow: '0 0 8px var(--primary-glow, rgba(194, 126, 67, 0.6))',
            transition: 'background 0.28s ease'
          }}
        />
      </div>

      {withText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: textSize,
              letterSpacing: '-0.02em',
              color: dark ? '#FFFDF9' : '#2C1810',
            }}
          >
            CAMPUS EVENT HUB
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: '#A5602A',
              background: dark ? 'rgba(194, 126, 67, 0.18)' : '#F3EAE0',
              border: dark ? '1px solid rgba(194, 126, 67, 0.35)' : '1px solid #D9C7B4',
              padding: '1px 5px',
              borderRadius: 3,
              letterSpacing: '0.04em',
            }}
          >
            OS
          </span>
        </div>
      )}
    </div>
  )
}
