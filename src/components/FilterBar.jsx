import React, { useState, useEffect } from 'react'

export default function FilterBar({
  filters = [],
  activeFilters = {},
  onChange,
  onClear,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortOptions = [],
  activeSort = '',
  onSortChange,
  totalCount = null,
  className = ''
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchTerm)

  // Sync internal search input with external searchTerm prop
  useEffect(() => {
    setLocalSearch(searchTerm)
  }, [searchTerm])

  // Debounced search trigger (250ms)
  useEffect(() => {
    if (!onSearchChange) return
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange, searchTerm])

  const activeCount = Object.values(activeFilters).filter(v => v && v !== 'all').length

  const handleSelect = (key, value) => {
    onChange?.({ ...activeFilters, [key]: value })
  }

  const handleRemoveChip = (key) => {
    const next = { ...activeFilters }
    delete next[key]
    onChange?.(next)
  }

  return (
    <div className={`filter-bar-container ${className}`} style={{ width: '100%', marginBottom: 16 }}>
      {/* Top search & sorting bar if search or sort props provided */}
      {(onSearchChange || sortOptions.length > 0 || totalCount !== null) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12
        }}>
          {onSearchChange && (
            <div style={{
              position: 'relative',
              flex: '1 1 240px',
              maxWidth: 400
            }}>
              <span style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-soft, #64748b)',
                fontSize: 14,
                pointerEvents: 'none'
              }}>
                🔍
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search filter"
                style={{
                  width: '100%',
                  height: 38,
                  padding: '6px 12px 6px 36px',
                  borderRadius: 8,
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--surface-2, #f8fafc)',
                  color: 'var(--ink, #0f172a)',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--orange, #ea580c)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(234, 88, 12, 0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border, #cbd5e1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('')
                    onSearchChange('')
                  }}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink-soft, #94a3b8)',
                    fontSize: 14
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            {totalCount !== null && (
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ink-soft, #64748b)',
                fontFamily: 'var(--font-mono, monospace)',
                background: 'var(--surface-2, #f1f5f9)',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--border, #e2e8f0)'
              }}>
                {totalCount} results
              </span>
            )}

            {sortOptions.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label htmlFor="filter-sort-select" style={{ fontSize: 12, color: 'var(--ink-soft, #64748b)', fontWeight: 600 }}>
                  Sort:
                </label>
                <select
                  id="filter-sort-select"
                  value={activeSort}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  style={{
                    height: 38,
                    padding: '6px 26px 6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border, #cbd5e1)',
                    background: 'var(--surface-2, #f8fafc)',
                    color: 'var(--ink, #0f172a)',
                    fontSize: 12.5,
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center'
                  }}
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Toggle */}
      <div className="filter-mobile-toggle" style={{ display: 'none', marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border, #cbd5e1)',
            background: 'var(--surface, #ffffff)',
            color: 'var(--ink, #334155)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <span>⚙️ Filters</span>
          {activeCount > 0 && (
            <span
              style={{
                background: 'var(--orange, #ea580c)',
                color: '#ffffff',
                borderRadius: 12,
                padding: '1px 7px',
                fontSize: 11
              }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Select Dropdowns Bar */}
      {filters.length > 0 && (
        <div 
          className={`filter-dropdowns-row ${mobileOpen ? 'mobile-open' : ''}`}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10
          }}
        >
          {filters.map((filter) => {
            const currentValue = activeFilters[filter.key] || 'all'
            const isFiltered = currentValue !== 'all'
            return (
              <div key={filter.key} style={{ display: 'flex', flexDirection: 'column' }}>
                <select
                  id={`filter-${filter.key}`}
                  value={currentValue}
                  onChange={(e) => handleSelect(filter.key, e.target.value)}
                  aria-label={`Filter by ${filter.label}`}
                  style={{
                    height: 38,
                    padding: '6px 28px 6px 12px',
                    borderRadius: 8,
                    border: isFiltered ? '1px solid var(--orange, #ea580c)' : '1px solid var(--border, #cbd5e1)',
                    background: isFiltered ? 'var(--orange-soft, rgba(234, 88, 12, 0.08))' : 'var(--surface-2, #ffffff)',
                    color: isFiltered ? 'var(--ink, #0f172a)' : 'var(--ink-soft, #475569)',
                    fontWeight: isFiltered ? 600 : 400,
                    fontSize: 13,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center'
                  }}
                >
                  <option value="all">All {filter.label}s</option>
                  {filter.options.map((opt) => {
                    const optVal = typeof opt === 'string' ? opt : opt.value
                    const optLbl = typeof opt === 'string' ? opt : opt.label
                    return (
                      <option key={optVal} value={optVal}>
                        {optLbl}
                      </option>
                    )
                  })}
                </select>
              </div>
            )
          })}

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              style={{
                height: 38,
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--surface-2, #f1f5f9)',
                color: 'var(--ink-soft, #64748b)',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#dc2626'
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--ink-soft, #64748b)'
                e.currentTarget.style.background = 'var(--surface-2, #f1f5f9)'
              }}
            >
              Clear Filters ({activeCount})
            </button>
          )}
        </div>
      )}

      {/* Active Filter Removable Chips */}
      {activeCount > 0 && (
        <div
          className="active-filter-chips"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 6,
            marginTop: 10
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--ink-soft, #64748b)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active:
          </span>
          {Object.entries(activeFilters).map(([key, val]) => {
            if (!val || val === 'all') return null
            const filterDef = filters.find((f) => f.key === key)
            const label = filterDef ? filterDef.label : key
            return (
              <span
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 8px 3px 10px',
                  borderRadius: 14,
                  background: 'var(--orange-soft, rgba(234, 88, 12, 0.08))',
                  border: '1px solid var(--orange, #ea580c)',
                  color: 'var(--ink, #0f172a)',
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                <span>
                  <strong style={{ color: 'var(--orange, #ea580c)', fontWeight: 700 }}>{label}:</strong> {val}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveChip(key)}
                  aria-label={`Remove filter ${label}: ${val}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--orange, #ea580c)',
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0
                  }}
                >
                  ×
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
