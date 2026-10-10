import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  getAvailableMonths,
  getMonthlyAnalytics,
  getEventMonthYear,
  exportMonthlyReportPDF,
  exportMonthlyReportCSV
} from '../utils/reportGenerator'
import { getEnrollStatus } from '../data/mockData'

export default function MonthlyEventsAnalytics({
  events = [],
  registrations = [],
  initialClub = 'all',
  showClubFilter = true,
  role = 'admin',
  currentUser = null,
  onSelectEvent = null
}) {
  const availableMonths = useMemo(() => getAvailableMonths(events), [events])
  
  // Default to current month (e.g. September 2026) or first month
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return availableMonths.includes('September 2026') ? 'September 2026' : (availableMonths[0] || 'all')
  })
  const [selectedClub, setSelectedClub] = useState(initialClub)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'

  // Compute analytics based on current selection
  const analytics = useMemo(() => {
    return getMonthlyAnalytics(events, registrations, selectedMonth, selectedClub)
  }, [events, registrations, selectedMonth, selectedClub])

  // Filter events further by search and status
  const displayedEvents = useMemo(() => {
    return analytics.filteredEvents.filter(ev => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch = !q ||
        (ev.title || '').toLowerCase().includes(q) ||
        (ev.club || '').toLowerCase().includes(q) ||
        (ev.venue || '').toLowerCase().includes(q) ||
        (ev.tag || '').toLowerCase().includes(q)

      const status = getEnrollStatus(ev)
      const evStatus = ev.statusOverride || status.state
      const matchesStatus = statusFilter === 'all' || evStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [analytics.filteredEvents, searchQuery, statusFilter])

  // Unique clubs list from raw events
  const clubOptions = useMemo(() => {
    const set = new Set(events.map(e => e.club).filter(Boolean))
    return Array.from(set).sort()
  }, [events])

  const handleExportPDF = () => {
    exportMonthlyReportPDF({
      month: selectedMonth,
      events,
      registrations,
      clubFilter: selectedClub,
      generatedBy: currentUser?.name ? `${currentUser.name} (${role === 'admin' ? 'Super Admin' : 'Faculty Advisor'})` : 'University Platform Administration',
      role
    })
  }

  const handleExportCSV = () => {
    exportMonthlyReportCSV({
      month: selectedMonth,
      events,
      registrations,
      clubFilter: selectedClub
    })
  }

  return (
    <div className="monthly-analytics-hub card" style={{ padding: 26, marginBottom: 28 }}>
      {/* Header with Title & Action Export Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24 }}>📊</span>
            <h2 style={{ fontSize: 21, margin: 0 }}>Monthly Event Conduction & Analytics Suite</h2>
            <span className="badge tag-indigo" style={{ fontWeight: 800 }}>Reporting Hub</span>
          </div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Inspect campus event conduction monthly-wise, evaluate verified student attendance rates, and generate official PDF/Excel reports.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportPDF}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
            title="Generate high-resolution printable PDF dossier with university header and signatures"
          >
            <span>📄</span> Generate Monthly PDF Report
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
            title="Download CSV spreadsheet compatible with Microsoft Excel"
          >
            <span>📊</span> Export to Excel (.csv)
          </button>
        </div>
      </div>

      {/* Month Selector Pills Row */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-soft)', marginBottom: 8 }}>
          🗓️ Select Reporting Period / Month:
        </div>
        <div className="chip-row" style={{ margin: 0, gap: 8 }}>
          <button
            className={`chip ${selectedMonth === 'all' ? 'on' : ''}`}
            onClick={() => setSelectedMonth('all')}
            style={{ fontSize: 12.5, padding: '7px 18px', fontWeight: 700 }}
          >
            🌟 All Months (Full Year)
          </button>

          {availableMonths.map(m => {
            const count = events.filter(e => getEventMonthYear(e) === m).length
            return (
              <button
                key={m}
                className={`chip ${selectedMonth === m ? 'on' : ''}`}
                onClick={() => setSelectedMonth(m)}
                style={{ fontSize: 12.5, padding: '7px 18px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7 }}
              >
                <span>📅</span> {m}
                <span style={{
                  background: selectedMonth === m ? 'rgba(255,255,255,0.3)' : 'var(--border)',
                  color: selectedMonth === m ? '#fff' : 'var(--ink-soft)',
                  padding: '2px 7px',
                  borderRadius: 999,
                  fontSize: 10.5,
                  fontWeight: 800
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* KPI Stat Cards Strip */}
      <div className="stat-strip" style={{ margin: '14px 0 22px', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg)', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Conducted Events</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--indigo-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              📅
            </div>
          </div>
          <div className="stat-num" style={{ fontSize: 26, color: 'var(--indigo)', marginTop: 6 }}>
            {analytics.totalEvents}
          </div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            {selectedMonth === 'all' ? 'Total year-to-date sessions' : `Conducted in ${selectedMonth}`}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg)', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Contestant Passes</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              🎟️
            </div>
          </div>
          <div className="stat-num" style={{ fontSize: 26, color: 'var(--purple)', marginTop: 6 }}>
            {analytics.totalRegistrations}
          </div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            Student reservations
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg)', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Verified Attendance</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              ✓
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <div className="stat-num" style={{ fontSize: 26, color: analytics.overallAttendanceRate >= 70 ? 'var(--green)' : analytics.overallAttendanceRate >= 40 ? 'var(--amber)' : 'var(--indigo)' }}>
              {analytics.overallAttendanceRate}%
            </div>
            <div className="muted" style={{ fontSize: 11.5 }}>
              ({analytics.totalAttended} present)
            </div>
          </div>
          {/* Visual Animated Progress Meter */}
          <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, analytics.overallAttendanceRate)}%`,
                height: '100%',
                background: analytics.overallAttendanceRate >= 70 ? 'linear-gradient(90deg, #10B981, #059669)' : analytics.overallAttendanceRate >= 40 ? 'linear-gradient(90deg, #F59E0B, #D97706)' : 'linear-gradient(90deg, #6366F1, #4F46E5)',
                borderRadius: 999,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg)', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Participating Clubs</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              🏛️
            </div>
          </div>
          <div className="stat-num" style={{ fontSize: 26, color: 'var(--teal)', marginTop: 6 }}>
            {analytics.clubStats.length}
          </div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            Organizing societies
          </div>
        </div>
      </div>

      {/* Visual Distribution Bars: Chapter Participation & Categories */}
      {analytics.clubStats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 22 }}>
          {/* Club Chapter Participation Bars */}
          <div style={{ background: 'var(--bg)', padding: 18, borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🏛️ Chapter Event Participation & Attendance</span>
              <span className="muted" style={{ fontSize: 11 }}>{selectedMonth === 'all' ? 'All Months' : selectedMonth}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analytics.clubStats.map(c => {
                const maxCount = Math.max(...analytics.clubStats.map(s => s.count), 1)
                const pct = Math.round((c.count / maxCount) * 100)
                const attRate = c.registered > 0 ? Math.round((c.attended / c.registered) * 100) : 0

                return (
                  <div key={c.name} style={{ fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{c.name} Society</span>
                      <span className="muted" style={{ fontSize: 11.5 }}>
                        <b>{c.count}</b> Event{c.count > 1 ? 's' : ''} · <b>{c.registered}</b> Regs · <span style={{ color: 'var(--green)', fontWeight: 700 }}>{c.attended}</span> Present ({attRate}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                          borderRadius: 999
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Categories & Audience Distribution */}
          <div style={{ background: 'var(--bg)', padding: 18, borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              <span>🏷️ Category & Access Distribution</span>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, background: 'var(--card)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div className="muted" style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>Public Events</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', marginTop: 2 }}>{analytics.accessCounts.public}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--card)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div className="muted" style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>Members Only</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--purple)', marginTop: 2 }}>{analytics.accessCounts.membersOnly}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>Tags in this period:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(analytics.categoryStats).map(([cat, cnt]) => (
                <span key={cat} className="badge tag-slate" style={{ fontSize: 11, padding: '4px 9px' }}>
                  {cat}: <b>{cnt}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter, Search & View Switcher Bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search event title, venue, club, or tag..."
              style={{ width: '100%', padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }}
            />
          </div>

          {showClubFilter && (
            <select
              value={selectedClub}
              onChange={e => setSelectedClub(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }}
            >
              <option value="all">All Clubs ({events.length})</option>
              {clubOptions.map(c => (
                <option key={c} value={c}>{c} Chapter</option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }}
          >
            <option value="all">All Statuses</option>
            <option value="open">🟢 Open for Registration</option>
            <option value="active_conduction">⚡ Live Conduction</option>
            <option value="upcoming">🟡 Upcoming</option>
            <option value="closed">🔴 Closed</option>
          </select>
        </div>

        {/* View Mode Toggle: Cards vs Table */}
        <div style={{ display: 'flex', background: 'var(--bg)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'cards' ? 'var(--card)' : 'transparent',
              color: viewMode === 'cards' ? 'var(--indigo)' : 'var(--ink-soft)',
              fontWeight: viewMode === 'cards' ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <span>🗂️</span> Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'table' ? 'var(--card)' : 'transparent',
              color: viewMode === 'table' ? 'var(--indigo)' : 'var(--ink-soft)',
              fontWeight: viewMode === 'table' ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <span>📋</span> Table
          </button>
        </div>
      </div>

      {/* No Events Match State */}
      {displayedEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', background: 'var(--bg)', borderRadius: 14 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>No events matching your filter criteria for {selectedMonth === 'all' ? 'this period' : selectedMonth}.</div>
          <div style={{ fontSize: 12.5, marginTop: 4 }}>Try selecting another month pill above or clearing your search filters.</div>
        </div>
      ) : viewMode === 'cards' ? (
        /* ==================== VIEW MODE: VISUAL CARDS ==================== */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
          {displayedEvents.map(ev => {
            const evRegs = registrations.filter(r => r.eventId === ev.id)
            const evPresent = evRegs.filter(r => r.attended).length
            const rate = evRegs.length > 0 ? Math.round((evPresent / evRegs.length) * 100) : 0
            const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)

            return (
              <div
                key={ev.id}
                className="card"
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  {/* Poster Thumbnail Banner */}
                  <div style={{ position: 'relative', width: '100%', height: 130, overflow: 'hidden' }}>
                    <img
                      src={ev.posterUrl || ev.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                      alt={ev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                      <span className={`badge ${ev.tagClass || 'tag-indigo'}`} style={{ backdropFilter: 'blur(8px)', fontWeight: 800 }}>
                        {ev.club}
                      </span>
                      <span className="badge tag-slate" style={{ backdropFilter: 'blur(8px)' }}>
                        {ev.tag}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      {ev.statusOverride === 'active_conduction' ? (
                        <span className="status-pill-conduction" style={{ fontSize: 10 }}>⚡ Live</span>
                      ) : ev.statusOverride === 'open' ? (
                        <span className="status-pill-live" style={{ fontSize: 10 }}>🟢 Open</span>
                      ) : ev.statusOverride === 'upcoming' ? (
                        <span className="status-pill-upcoming" style={{ fontSize: 10 }}>🟡 Upcoming</span>
                      ) : (
                        <span className="status-pill-closed" style={{ fontSize: 10 }}>🔴 Closed</span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 15.5, margin: '0 0 6px', lineHeight: 1.35 }}>{ev.title}</h3>
                    <div className="muted mono" style={{ fontSize: 11.5, marginBottom: 4 }}>
                      📅 {ev.date}
                    </div>
                    <div className="muted" style={{ fontSize: 11.5, marginBottom: 12 }}>
                      📍 {ev.venue}
                    </div>

                    {/* Stats Pill & Venue PIN */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 10 }}>
                      <div>
                        <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Audience</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: isMembersOnly ? 'var(--purple)' : 'var(--green)' }}>
                          {isMembersOnly ? '🔒 Members Only' : '🌐 Public'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Venue PIN</div>
                        <div className="mono" style={{ fontSize: 13, fontWeight: 900, color: 'var(--indigo)' }}>
                          {ev.venuePin || '4821'}
                        </div>
                      </div>
                    </div>

                    {/* Attendance Meter */}
                    <div style={{ fontSize: 11.5, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span className="muted">Registration & Attendance:</span>
                      <b>{evRegs.length}/{ev.capacity || 100} ({rate}%)</b>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, (evRegs.length / (ev.capacity || 100)) * 100)}%`,
                          height: '100%',
                          background: rate >= 70 ? 'var(--green)' : 'var(--indigo)',
                          borderRadius: 999
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ padding: '10px 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
                  <span className="muted" style={{ fontSize: 11 }}>
                    Advisor: <b>{ev.organizingTeam?.facultyAdvisor?.split(' ')[0] || 'Advisor'}</b>
                  </span>
                  {role === 'student' ? (
                    <Link to={`/student/enroll/${ev.id}`} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>
                      Enroll Details →
                    </Link>
                  ) : (
                    <Link to="/instructor/events" className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>
                      Manage Session →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ==================== VIEW MODE: DATA TABLE ==================== */
        <div style={{ overflowX: 'auto', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 10px' }}>Event & Club Chapter</th>
                <th style={{ textAlign: 'left', padding: '12px 10px' }}>Scheduled Date & Venue</th>
                <th style={{ textAlign: 'center', padding: '12px 10px' }}>Venue PIN</th>
                <th style={{ textAlign: 'left', padding: '12px 10px' }}>Audience</th>
                <th style={{ textAlign: 'center', padding: '12px 10px' }}>Registrations</th>
                <th style={{ textAlign: 'center', padding: '12px 10px' }}>Attendance %</th>
                <th style={{ textAlign: 'right', padding: '12px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedEvents.map(ev => {
                const evRegs = registrations.filter(r => r.eventId === ev.id)
                const evPresent = evRegs.filter(r => r.attended).length
                const rate = evRegs.length > 0 ? Math.round((evPresent / evRegs.length) * 100) : 0
                const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)

                return (
                  <tr
                    key={ev.id}
                    style={{ borderBottom: '1px solid var(--border)', cursor: onSelectEvent ? 'pointer' : 'default' }}
                    onClick={() => onSelectEvent && onSelectEvent(ev)}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{ev.title}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
                        <span className={`badge ${ev.tagClass || 'tag-indigo'}`} style={{ fontSize: 9.5 }}>{ev.club}</span>
                        <span className="badge tag-slate" style={{ fontSize: 9.5 }}>{ev.tag}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div className="mono" style={{ fontWeight: 600 }}>{ev.date}</div>
                      <div className="muted" style={{ fontSize: 11 }}>📍 {ev.venue}</div>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--indigo)', background: 'var(--indigo-soft)', padding: '3px 7px', borderRadius: 6 }}>
                        {ev.venuePin || '4821'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {isMembersOnly ? (
                        <span className="badge tag-purple" style={{ fontSize: 10 }}>🔒 Members Only</span>
                      ) : (
                        <span className="badge tag-green" style={{ fontSize: 10 }}>🌐 Public</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <b>{evRegs.length}</b> / {ev.capacity || 100}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ color: rate >= 70 ? 'var(--green)' : rate >= 40 ? 'var(--amber)' : 'var(--indigo)', fontWeight: 700 }}>
                        {evPresent} Present ({rate}%)
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      {ev.statusOverride === 'active_conduction' ? (
                        <span className="status-pill-conduction">⚡ Live Conduction</span>
                      ) : ev.statusOverride === 'open' ? (
                        <span className="status-pill-live">🟢 Open</span>
                      ) : ev.statusOverride === 'upcoming' ? (
                        <span className="status-pill-upcoming">🟡 Upcoming</span>
                      ) : (
                        <span className="status-pill-closed">🔴 Closed</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
