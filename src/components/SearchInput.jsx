import React, { useState, useEffect, useRef } from 'react'

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
  id = 'search-input',
  autoFocus = false
}) {
  const [internalVal, setInternalVal] = useState(value)
  const inputRef = useRef(null)

  // Sync internal state if parent changes value externally
  useEffect(() => {
    setInternalVal(value)
  }, [value])

  // Debounced notification to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalVal !== value) {
        onChange?.(internalVal)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [internalVal, debounceMs, onChange, value])

  const handleClear = () => {
    setInternalVal('')
    onChange?.('')
    inputRef.current?.focus()
  }

  // Handle Ctrl+K shortcut focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const activeTag = document.activeElement?.tagName
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className={`search-input-wrap ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 420
      }}
    >
      {/* Search Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          left: 12,
          color: 'var(--ink-soft, #64748b)',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        id={id}
        type="search"
        value={internalVal}
        onChange={(e) => setInternalVal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          height: 40,
          padding: '8px 68px 8px 38px',
          borderRadius: 10,
          border: '1.5px solid var(--border, #cbd5e1)',
          background: 'var(--surface-2, #ffffff)',
          color: 'var(--ink, #0f172a)',
          fontSize: 13.5,
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--orange, #ea580c)'
          e.target.style.boxShadow = '0 0 0 3px var(--orange-soft, rgba(234, 88, 12, 0.15))'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border, #cbd5e1)'
          e.target.style.boxShadow = 'none'
        }}
      />

      <div style={{ position: 'absolute', right: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        {internalVal ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            style={{
              background: 'var(--surface-3, #e2e8f0)',
              border: 'none',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink, #475569)',
              cursor: 'pointer',
              fontSize: 12,
              lineHeight: 1
            }}
          >
            ×
          </button>
        ) : null}

        <span
          style={{
            fontSize: 10.5,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '2px 5px',
            borderRadius: 5,
            background: 'var(--surface-3, rgba(0, 0, 0, 0.05))',
            color: 'var(--ink-soft, #94a3b8)',
            border: '1px solid var(--border, rgba(0, 0, 0, 0.08))',
            pointerEvents: 'none'
          }}
        >
          ⌘K
        </span>
      </div>
    </div>
  )
}
