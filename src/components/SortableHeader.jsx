import React from 'react'

export default function SortableHeader({
  field,
  currentSort = '',
  onSort,
  children,
  className = '',
  style = {}
}) {
  const isCurrent = currentSort.startsWith(field)
  const isAsc = currentSort === `${field}_asc`
  const isDesc = currentSort === `${field}_desc`

  const handleToggle = () => {
    if (isAsc) {
      onSort?.(`${field}_desc`)
    } else {
      onSort?.(`${field}_asc`)
    }
  }

  return (
    <th
      className={`sortable-th ${className}`}
      onClick={handleToggle}
      aria-sort={isAsc ? 'ascending' : isDesc ? 'descending' : 'none'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle()
        }
      }}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        ...style
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span>{children}</span>
        <span
          style={{
            fontSize: 11,
            color: isCurrent ? '#ea580c' : '#94a3b8',
            fontWeight: 700
          }}
          aria-hidden="true"
        >
          {isAsc ? '▲' : isDesc ? '▼' : '⇅'}
        </span>
      </div>
    </th>
  )
}
