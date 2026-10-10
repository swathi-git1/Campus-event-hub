import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { getEnrollStatus } from '../../data/mockData'
import SearchInput from '../../components/SearchInput'
import FilterBar from '../../components/FilterBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/SkeletonLoader'

const FILTER_CONFIG = [
  {
    key: 'category',
    label: 'Category',
    options: ['Technical', 'Cultural', 'Sports', 'Wellness', 'Service', 'Uniformed']
  },
  {
    key: 'chapter',
    label: 'Chapter',
    options: ['CSI', 'IEEE', 'IE', 'Yoga', 'Sports', 'Fine Arts', 'NSS', 'NCC']
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'open', label: '🟢 Open for Enrollment' },
      { value: 'upcoming', label: '🟡 Opening Soon' },
      { value: 'completed', label: '⚪ Completed' }
    ]
  },
  {
    key: 'venue',
    label: 'Venue',
    options: ['Main Innovation Auditorium', 'Parade Grounds', 'Campus Sports Complex', 'CSE Lab Complex']
  }
]

export default function Enroll() {
  const { visibleEvents, memberships } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Search, Filter, Sort, Pagination States
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [sort, setSort] = useState('date_asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [lockedModalEvent, setLockedModalEvent] = useState(null)
  const [loading, setLoading] = useState(false)

  // Student's approved club memberships
  const studentEmail = user?.email || 'student@college.edu'
  const approvedClubs = useMemo(() => {
    return (memberships || [])
      .filter(m => m.status === 'approved' && String(m.studentEmail || '').trim().toLowerCase() === studentEmail.toLowerCase())
      .map(m => m.clubName.toLowerCase())
  }, [memberships, studentEmail])

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1)
  }, [search, activeFilters, sort])

  // Multi-field search, filtering, and sorting
  const processedData = useMemo(() => {
    let list = [...visibleEvents]

    // 1. Search by name, description, chapter, organizer, venue, category
    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(ev => {
        const titleMatch = (ev.title || '').toLowerCase().includes(q)
        const descMatch = (ev.desc || '').toLowerCase().includes(q)
        const clubMatch = (ev.club || '').toLowerCase().includes(q)
        const orgMatch = (ev.organizingTeam?.facultyAdvisor || ev.organizer || '').toLowerCase().includes(q)
        const venueMatch = (ev.venue || '').toLowerCase().includes(q)
        const catMatch = (ev.tag || ev.category || '').toLowerCase().includes(q)
        return titleMatch || descMatch || clubMatch || orgMatch || venueMatch || catMatch
      })
    }

    // 2. Filter Bar conditions
    if (activeFilters.category && activeFilters.category !== 'all') {
      list = list.filter(ev => (ev.tag || ev.category || '').toLowerCase() === activeFilters.category.toLowerCase())
    }
    if (activeFilters.chapter && activeFilters.chapter !== 'all') {
      list = list.filter(ev => (ev.club || '').toLowerCase() === activeFilters.chapter.toLowerCase())
    }
    if (activeFilters.status && activeFilters.status !== 'all') {
      list = list.filter(ev => {
        const enrollStatus = getEnrollStatus(ev)
        return enrollStatus.state === activeFilters.status
      })
    }
    if (activeFilters.venue && activeFilters.venue !== 'all') {
      list = list.filter(ev => (ev.venue || '').toLowerCase().includes(activeFilters.venue.toLowerCase()))
    }

    // 3. Sorting
    switch (sort) {
      case 'name_asc':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'name_desc':
        list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'date_asc':
        list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
        break
      case 'date_desc':
        list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        break
      case 'attendees_desc':
        list.sort((a, b) => (b.registered || 0) - (a.registered || 0))
        break
      default:
        list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
    }

    return list
  }, [visibleEvents, search, activeFilters, sort])

  // Pagination calculation
  const totalItems = processedData.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * pageSize
    return processedData.slice(start, start + pageSize)
  }, [processedData, page, pageSize])

  const handleCardClick = (ev) => {
    const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)
    const isMember = approvedClubs.includes(ev.club.toLowerCase())

    if (isMembersOnly && !isMember) {
      setLockedModalEvent(ev)
      return
    }

    navigate(`/student/enroll/${ev.id}`)
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setSearch('')
  }

  return (
    <DashboardLayout role="student">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Enroll in Campus Events</h1>
          <p className="muted" style={{ margin: 0 }}>
            Discover active hackathons, exclusive club workshops, and championship fixtures. Live enrollments are open!
          </p>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by event name, club, organizer, venue..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="event-sort-select" style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Sort by:
          </label>
          <select
            id="event-sort-select"
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
            <option value="date_asc">📅 Date (Soonest first)</option>
            <option value="date_desc">📅 Date (Latest first)</option>
            <option value="name_asc">🔤 Name (A–Z)</option>
            <option value="name_desc">🔤 Name (Z–A)</option>
            <option value="attendees_desc">🔥 Most Popular (Attendees)</option>
          </select>
        </div>
      </div>

      {/* Filter Bar with active chips */}
      <FilterBar
        filters={FILTER_CONFIG}
        activeFilters={activeFilters}
        onChange={setActiveFilters}
        onClear={handleClearFilters}
      />

      {/* Event Grid / Loading / Empty States */}
      {loading ? (
        <SkeletonCard count={pageSize > 10 ? 6 : 3} />
      ) : paginatedEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 18, color: 'var(--ink)', margin: '0 0 6px' }}>No events found</h3>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 18px' }}>
            No campus events match your current search and filter combination.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {paginatedEvents.map(ev => {
            const status = getEnrollStatus(ev)
            const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)
            const isMember = approvedClubs.includes(ev.club.toLowerCase())

            return (
              <div
                className="card"
                key={ev.id}
                onClick={() => handleCardClick(ev)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  padding: 0,
                  border: isMembersOnly ? '1.5px solid #C4B5FD' : '1px solid var(--border)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {(ev.posterUrl || ev.coverImage) && (
                  <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                    <img
                      src={ev.posterUrl || ev.coverImage}
                      alt={ev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                      <span className={`badge ${ev.tagClass}`} style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                        {ev.tag}
                      </span>
                      {isMembersOnly && (
                        <span className="badge tag-purple" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                          🔒 Members Only
                        </span>
                      )}
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      {status.badge === 'active_conduction' ? (
                        <span className="status-pill-conduction" style={{ backdropFilter: 'blur(8px)', background: 'var(--card)', border: '1px solid rgba(99,102,241,0.3)' }}>
                          <span className="pulse-dot" style={{ background: 'var(--indigo)' }} /> Conduction Active
                        </span>
                      ) : status.state === 'open' ? (
                        <span className="status-pill-live" style={{ backdropFilter: 'blur(8px)', background: 'var(--card)', border: '1px solid rgba(16,185,129,0.3)' }}>
                          <span className="pulse-dot" /> Open Now
                        </span>
                      ) : status.state === 'upcoming' ? (
                        <span className="status-pill-upcoming" style={{ backdropFilter: 'blur(8px)', background: 'var(--card)', border: '1px solid rgba(245,158,11,0.3)' }}>
                          Upcoming
                        </span>
                      ) : (
                        <span className="status-pill-closed" style={{ backdropFilter: 'blur(8px)', background: 'var(--card)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        🏛️ {ev.club} Chapter
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                        👥 {ev.registered} / {ev.capacity}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 17, margin: '0 0 8px', color: 'var(--ink)', lineHeight: 1.35 }}>
                      {ev.title}
                    </h3>

                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ev.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 6 }}>
                      <span>📅</span> <span>{ev.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 14 }}>
                      <span>📍</span> <span>{ev.venue}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', height: 38, fontSize: 13, justifyContent: 'center' }}
                    >
                      {status.state === 'open' ? 'Register Now →' : 'View Event Dossier →'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50]}
      />

      {/* Locked Modal for Members-Only Events */}
      {lockedModalEvent && (
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
            padding: 16
          }}
          onClick={() => setLockedModalEvent(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              maxWidth: 440,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
            <h2 style={{ fontSize: 18, margin: '0 0 8px', color: 'var(--ink)' }}>
              Members-Only Chapter Activity
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
              <strong>"{lockedModalEvent.title}"</strong> is restricted exclusively to approved members of the <strong>{lockedModalEvent.club} Chapter</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setLockedModalEvent(null)}
              >
                Close
              </button>
              <Link
                to={`/student/clubs/${lockedModalEvent.club}`}
                className="btn btn-primary btn-sm"
                onClick={() => setLockedModalEvent(null)}
              >
                Apply for Chapter Membership →
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
