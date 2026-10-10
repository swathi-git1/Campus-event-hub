import React, { useState, useMemo } from 'react'
import { exportTableToCSV, exportTableToPDF } from '../utils/tableExport'
import { useData } from '../context/DataContext'

export default function ODInstructorAnalytics({
  permissionRequests: propRequests,
  odRecords: propRecords,
  currentUser = null
}) {
  const dataContext = useData()
  const permissionRequests = (propRequests && propRequests.length > 0) ? propRequests : (dataContext?.permissionRequests || [])
  const odRecords = (propRecords && propRecords.length > 0) ? propRecords : (dataContext?.odRecords || [])
  // Month Selection State
  const [selectedMonth, setSelectedMonth] = useState('October 2026')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedCollege, setSelectedCollege] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedScope, setSelectedScope] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'records' | 'report'

  // Pagination for detailed records table
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Available unique months from dataset
  const availableMonths = useMemo(() => {
    const set = new Set()
    permissionRequests.forEach(r => {
      if (r.eventDate) {
        const d = new Date(r.eventDate)
        if (!isNaN(d.getTime())) {
          set.add(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
        }
      }
    })
    const list = Array.from(set)
    const preferredOrder = ['August 2026', 'September 2026', 'October 2026', 'November 2026']
    list.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a)
      const idxB = preferredOrder.indexOf(b)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      return a.localeCompare(b)
    })
    return list.length > 0 ? list : ['August 2026', 'September 2026', 'October 2026']
  }, [permissionRequests])

  // Extract list of unique departments
  const departmentOptions = useMemo(() => {
    const set = new Set()
    permissionRequests.forEach(r => {
      if (r.dept) set.add(r.dept)
    })
    return Array.from(set).sort()
  }, [permissionRequests])

  // Extract list of unique colleges / organizers
  const collegeOptions = useMemo(() => {
    const set = new Set()
    permissionRequests.forEach(r => {
      if (r.organizer) set.add(r.organizer)
    })
    return Array.from(set).sort()
  }, [permissionRequests])

  // Extract list of unique event titles
  const eventOptions = useMemo(() => {
    const set = new Set()
    permissionRequests.forEach(r => {
      const name = r.eventName || r.eventTitle
      if (name) set.add(name)
    })
    return Array.from(set).sort()
  }, [permissionRequests])

  // Helper to extract month year from request
  const getReqMonthYear = (r) => {
    if (!r.eventDate) return 'Unscheduled'
    const d = new Date(r.eventDate)
    if (isNaN(d.getTime())) return 'Unscheduled'
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Filtered dataset according to active filters
  const filteredRequests = useMemo(() => {
    return permissionRequests.filter(r => {
      // 1. Month Filter
      if (selectedMonth !== 'all') {
        const m = getReqMonthYear(r)
        if (m.toLowerCase() !== selectedMonth.toLowerCase()) return false
      }

      // 2. Custom Date Range
      if (startDate && r.eventDate && r.eventDate < startDate) return false
      if (endDate && r.eventDate && r.eventDate > endDate) return false

      // 3. Department Filter
      if (selectedDept !== 'all' && r.dept && !r.dept.toLowerCase().includes(selectedDept.toLowerCase())) {
        return false
      }

      // 4. College Filter
      if (selectedCollege !== 'all' && r.organizer && !r.organizer.toLowerCase().includes(selectedCollege.toLowerCase())) {
        return false
      }

      // 5. Event Filter
      if (selectedEvent !== 'all') {
        const evName = r.eventName || r.eventTitle || ''
        if (evName.toLowerCase() !== selectedEvent.toLowerCase()) return false
      }

      // 6. Scope Filter (External vs Internal)
      if (selectedScope !== 'all' && r.scope && r.scope.toLowerCase() !== selectedScope.toLowerCase()) {
        return false
      }

      // 7. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (r.studentName || '').toLowerCase().includes(q)
        const matchRoll = (r.rollNo || '').toLowerCase().includes(q)
        const matchEvent = (r.eventName || r.eventTitle || '').toLowerCase().includes(q)
        const matchCollege = (r.organizer || '').toLowerCase().includes(q)
        if (!matchName && !matchRoll && !matchEvent && !matchCollege) return false
      }

      return true
    })
  }, [permissionRequests, selectedMonth, startDate, endDate, selectedDept, selectedCollege, selectedEvent, selectedScope, searchQuery])

  // ==========================================================================
  // KPI METRICS CALCULATION
  // ==========================================================================
  const totalODRequests = filteredRequests.length

  const approvedRequests = filteredRequests.filter(r =>
    r.status === 'Approved' || r.status === 'OD Issued' || r.status === 'Proof Verified'
  ).length

  const pendingRequests = filteredRequests.filter(r =>
    r.status === 'Pending Approval' || r.status === 'Proof Submitted'
  ).length

  const rejectedRequests = filteredRequests.filter(r =>
    r.status === 'Rejected' || r.status === 'Proof Rejected'
  ).length

  // Students who participated in external college events
  const externalParticipationRequests = filteredRequests.filter(r =>
    r.scope === 'External' || (r.organizer && !r.organizer.toLowerCase().includes('campus'))
  )
  const externalParticipationCount = externalParticipationRequests.length

  // Number of unique external college events in this slice
  const uniqueExternalEventsCount = useMemo(() => {
    const set = new Set()
    externalParticipationRequests.forEach(r => {
      const name = r.eventName || r.eventTitle
      if (name) set.add(name)
    })
    return set.size
  }, [externalParticipationRequests])

  // Prize counts: First, Second, Third
  const firstPrizeRequests = filteredRequests.filter(r =>
    r.prize === 'First Prize' || r.proof?.prize === 'First Prize' || (r.proof?.description && r.proof.description.includes('1st'))
  )
  const firstPrizeCount = firstPrizeRequests.length

  const secondPrizeRequests = filteredRequests.filter(r =>
    r.prize === 'Second Prize' || r.proof?.prize === 'Second Prize' || (r.proof?.description && (r.proof.description.includes('2nd') || r.proof.description.includes('Runner Up')))
  )
  const secondPrizeCount = secondPrizeRequests.length

  const thirdPrizeRequests = filteredRequests.filter(r =>
    r.prize === 'Third Prize' || r.proof?.prize === 'Third Prize' || (r.proof?.description && r.proof.description.includes('3rd'))
  )
  const thirdPrizeCount = thirdPrizeRequests.length

  const totalPrizeWinners = firstPrizeCount + secondPrizeCount + thirdPrizeCount

  // ==========================================================================
  // BREAKDOWN GROUPINGS (Department, College, Event, Month)
  // ==========================================================================

  // Department-wise breakdown
  const departmentBreakdown = useMemo(() => {
    const map = {}
    filteredRequests.forEach(r => {
      const d = r.dept || 'Engineering'
      map[d] = (map[d] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filteredRequests])

  // College-wise participation breakdown
  const collegeBreakdown = useMemo(() => {
    const map = {}
    filteredRequests.forEach(r => {
      const c = r.organizer || 'Other Institution'
      map[c] = (map[c] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filteredRequests])

  // Event-wise participation breakdown
  const eventBreakdown = useMemo(() => {
    const map = {}
    filteredRequests.forEach(r => {
      const ev = r.eventName || r.eventTitle || 'Event'
      map[ev] = (map[ev] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filteredRequests])

  // Monthly trend breakdown across all permission requests
  const monthlyTrend = useMemo(() => {
    const months = ['August 2026', 'September 2026', 'October 2026']
    return months.map(m => {
      const inMonth = permissionRequests.filter(r => getReqMonthYear(r).toLowerCase() === m.toLowerCase())
      const externalCount = inMonth.filter(r => r.scope === 'External').length
      const p1 = inMonth.filter(r => r.prize === 'First Prize' || r.proof?.prize === 'First Prize').length
      const p2 = inMonth.filter(r => r.prize === 'Second Prize' || r.proof?.prize === 'Second Prize').length
      const p3 = inMonth.filter(r => r.prize === 'Third Prize' || r.proof?.prize === 'Third Prize').length
      return {
        month: m,
        total: inMonth.length,
        external: externalCount,
        prizes: p1 + p2 + p3,
        first: p1,
        second: p2,
        third: p3
      }
    })
  }, [permissionRequests])

  // Paginated records
  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRequests.slice(start, start + pageSize)
  }, [filteredRequests, page, pageSize])

  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1

  // ==========================================================================
  // REQUIREMENT 5: REPORT GENERATION (PDF & EXCEL)
  // ==========================================================================
  const handleExportPDF = () => {
    if (filteredRequests.length === 0) return

    const headers = [
      '#',
      'Student Name',
      'Roll Number',
      'Department',
      'Event Name',
      'External Institution',
      'Event Date',
      'Participation / Proof',
      'Prize / Laurel',
      'OD Status'
    ]

    const rows = filteredRequests.map((r, idx) => [
      idx + 1,
      r.studentName,
      r.rollNo || '—',
      r.dept || 'Engineering',
      r.eventName || r.eventTitle || '—',
      r.organizer || '—',
      r.eventDate || '—',
      r.proof ? '✓ Proof Verified' : r.status,
      r.prize ? r.prize : (r.proof?.prize ? r.proof.prize : 'Participant'),
      r.status
    ])

    const summaryText = `Month: ${selectedMonth} | Dept: ${selectedDept === 'all' ? 'All' : selectedDept} | College: ${selectedCollege === 'all' ? 'All' : selectedCollege} | Total: ${filteredRequests.length} students`

    exportTableToPDF({
      title: 'INSTITUTIONAL ON-DUTY (OD) & STUDENT PARTICIPATION ANALYTICS REPORT',
      subtitle: `Office of Chief Faculty In-Charge · Generated by ${currentUser?.name || 'Dr. Malathi Sundaram'}`,
      filterSummary: summaryText,
      headers,
      rows
    })
  }

  const handleExportCSV = () => {
    if (filteredRequests.length === 0) return

    const headers = [
      'Student Name',
      'Register Number',
      'Department',
      'Year',
      'Event Name',
      'Event Type',
      'External College / Institution',
      'Event Date',
      'Scope',
      'Participation Status',
      'Prize / Achievement',
      'Award Description',
      'OD Approval Status',
      'Official OD Pass ID'
    ]

    const rows = filteredRequests.map(r => [
      r.studentName,
      r.rollNo || '',
      r.dept || '',
      r.year || '',
      r.eventName || r.eventTitle || '',
      r.eventType || '',
      r.organizer || '',
      r.eventDate || '',
      r.scope || 'External',
      r.proof ? 'Verified Attended' : r.status,
      r.prize || (r.proof?.prize) || 'Participant',
      r.proof?.award || '',
      r.status,
      r.odRecordId || '—'
    ])

    exportTableToCSV({
      filename: `OD_Analytics_Report_${selectedMonth.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
      headers,
      rows,
      metadata: {
        title: 'Institutional OD & External Participation Report',
        filterSummary: `Scope: ${selectedScope}, Month: ${selectedMonth}, Dept: ${selectedDept}, College: ${selectedCollege}`
      }
    })
  }

  return (
    <div className="card" style={{ padding: 24, marginBottom: 28, borderTop: '4px solid var(--primary)' }}>
      {/* Top Header & Report Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24 }}>📊</span>
            <h2 style={{ fontSize: 22, margin: 0, color: 'var(--ink)' }}>OD Instructor Analytics & Intelligence Suite</h2>
            <span className="badge tag-amber">Dedicated Faculty Console</span>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Inspect campus-wide On-Duty clearance, inter-collegiate event delegations, monthly participation rates, and student prize winners.
          </p>
        </div>

        {/* Report Download Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleExportCSV}
            title="Download full dataset in Excel-compatible CSV format"
          >
            📊 Export to Excel (.csv)
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportPDF}
            title="Generate printable signed academic PDF report"
          >
            📄 Generate Official PDF Report
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FILTER BAR: Month, Date Range, Department, College, Scope, Search    */}
      {/* ===================================================================== */}
      <div style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 24
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '.04em' }}>
          🔍 Analytics Filter & Criteria Controls:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {/* Month Selector */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>Target Month</label>
            <select
              value={selectedMonth}
              onChange={e => { setSelectedMonth(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)', fontWeight: 600 }}
            >
              <option value="all">📅 All Months Combined</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m === 'October 2026' ? `🌟 ${m} (Delegation Focus)` : `📅 ${m}`}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            >
              <option value="all">🏛️ All Departments</option>
              {departmentOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* College Filter */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>External College / Host</label>
            <select
              value={selectedCollege}
              onChange={e => { setSelectedCollege(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            >
              <option value="all">🎓 All Host Colleges</option>
              {collegeOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Event Filter */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>Event Title</label>
            <select
              value={selectedEvent}
              onChange={e => { setSelectedEvent(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            >
              <option value="all">🏆 All Specific Events</option>
              {eventOptions.map(ev => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>
          </div>

          {/* Scope Filter */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>Scope / Category</label>
            <select
              value={selectedScope}
              onChange={e => { setSelectedScope(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '7px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            >
              <option value="all">🌐 All Scopes</option>
              <option value="External">🌐 External College Delegations</option>
              <option value="Internal">🏛️ Internal Campus Events</option>
            </select>
          </div>
        </div>

        {/* Date Range & Search Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>From Date (Optional)</label>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '6px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>To Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '6px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-muted)' }}>Search Student / Roll No</label>
            <input
              type="text"
              placeholder="Search student, roll number..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              style={{ fontSize: 12.5, padding: '6px 10px', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}
            />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* REQUIREMENT 4: SUMMARY CARDS (Top KPI Metrics Strip)                  */}
      {/* ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14,
        marginBottom: 26
      }}>
        {/* Total OD Requests */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>Total OD Requests</span>
            <span style={{ fontSize: 16 }}>📋</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink)', margin: '6px 0 2px' }}>
            {totalODRequests}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>All submitted petitions</div>
        </div>

        {/* Approved OD */}
        <div style={{ background: 'var(--card)', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>Approved OD</span>
            <span style={{ fontSize: 16 }}>✅</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a', margin: '6px 0 2px' }}>
            {approvedRequests}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Sanctioned permissions</div>
        </div>

        {/* Pending OD */}
        <div style={{ background: 'var(--card)', border: '1px solid #fed7aa', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#c2410c' }}>Pending Review</span>
            <span style={{ fontSize: 16 }}>⏳</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ea580c', margin: '6px 0 2px' }}>
            {pendingRequests}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Requests & proofs in queue</div>
        </div>

        {/* Rejected OD */}
        <div style={{ background: 'var(--card)', border: '1px solid #fecaca', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>Rejected OD</span>
            <span style={{ fontSize: 16 }}>✕</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#dc2626', margin: '6px 0 2px' }}>
            {rejectedRequests}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Did not meet guidelines</div>
        </div>

        {/* External College Events Participated */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--primary)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>External Events</span>
            <span style={{ fontSize: 16 }}>🌐</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)', margin: '6px 0 2px' }}>
            {uniqueExternalEventsCount}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Host colleges & conclaves</div>
        </div>

        {/* Students Participated in External Events */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--indigo)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo)' }}>Students Participated</span>
            <span style={{ fontSize: 16 }}>👥</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--indigo)', margin: '6px 0 2px' }}>
            {externalParticipationCount}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Active student delegates</div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRIZE WINNERS SUMMARY STRIP (1st, 2nd, 3rd Prize Laurels)             */}
      {/* ===================================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface-0) 0%, var(--surface-1) 100%)',
        border: '1.5px solid var(--border-strong)',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 26,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
            <span>🏆</span> Student Prize Laurels & Competitive Achievements ({totalPrizeWinners} Total Winners)
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>
            Honors won by students representing our institution at state and national competitions.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {/* First Prize */}
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid #eab308',
            borderRadius: 10,
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: 100
          }}>
            <div style={{ fontSize: 18 }}>🥇</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#854d0e', lineHeight: 1.1 }}>{firstPrizeCount}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a16207', textTransform: 'uppercase' }}>First Prize</div>
          </div>

          {/* Second Prize */}
          <div style={{
            background: 'rgba(148, 163, 184, 0.18)',
            border: '1px solid #94a3b8',
            borderRadius: 10,
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: 100
          }}>
            <div style={{ fontSize: 18 }}>🥈</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#334155', lineHeight: 1.1 }}>{secondPrizeCount}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Second Prize</div>
          </div>

          {/* Third Prize */}
          <div style={{
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid #f97316',
            borderRadius: 10,
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: 100
          }}>
            <div style={{ fontSize: 18 }}>🥉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#9a3412', lineHeight: 1.1 }}>{thirdPrizeCount}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>Third Prize</div>
          </div>
        </div>
      </div>

      {/* Tabs: Visual Charts Overview vs Detailed Records Table */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--border)', marginBottom: 22 }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--ink-soft)',
            fontWeight: activeTab === 'overview' ? 800 : 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          📈 Charts & Visual Distributions
        </button>
        <button
          onClick={() => setActiveTab('records')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'records' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'records' ? 'var(--primary)' : 'var(--ink-soft)',
            fontWeight: activeTab === 'records' ? 800 : 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          📑 Detailed Student Records ({filteredRequests.length})
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: VISUAL CHARTS & BREAKDOWNS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Monthly Trend Chart */}
          <div className="card" style={{ padding: 20, background: 'var(--surface-0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
                📅 Monthly Participation Statistics (Trend)
              </div>
              <span className="badge tag-indigo mono" style={{ fontSize: 11 }}>Multi-Month Conduction</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {monthlyTrend.map(t => {
                const maxVal = Math.max(...monthlyTrend.map(x => x.total), 50)
                const pct = Math.round((t.total / maxVal) * 100)
                const isCurrent = t.month === selectedMonth

                return (
                  <div key={t.month} style={{
                    padding: 12,
                    background: isCurrent ? 'var(--card)' : 'transparent',
                    borderRadius: 10,
                    border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
                        {isCurrent ? `👉 ${t.month} (Selected)` : t.month}
                      </span>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        <b>{t.total} Students</b> ({t.external} External) · 🏆 {t.prizes} Prizes
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isCurrent ? 'var(--primary-gradient)' : 'var(--indigo)',
                        borderRadius: 5,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
                      <span>🥇 1st: <b>{t.first}</b></span>
                      <span>🥈 2nd: <b>{t.second}</b></span>
                      <span>🥉 3rd: <b>{t.third}</b></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Department-wise Participation */}
          <div className="card" style={{ padding: 20, background: 'var(--surface-0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
                🏛️ Department-wise Participation
              </div>
              <span className="badge tag-teal mono" style={{ fontSize: 11 }}>Cross-Discipline</span>
            </div>

            {departmentBreakdown.length === 0 ? (
              <div className="muted" style={{ padding: 20, textAlign: 'center', fontSize: 13 }}>No records for active selection.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {departmentBreakdown.map(([deptName, count]) => {
                  const maxCount = Math.max(...departmentBreakdown.map(x => x[1]), 1)
                  const pct = Math.round((count / totalODRequests) * 100) || 0
                  const barPct = Math.round((count / maxCount) * 100)

                  return (
                    <div key={deptName}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{deptName}</span>
                        <span className="mono" style={{ fontWeight: 700, color: 'var(--ink-soft)' }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${barPct}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* College-wise Participation Breakdown */}
          <div className="card" style={{ padding: 20, background: 'var(--surface-0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
                🎓 College-wise Participation (Host Institutions)
              </div>
              <span className="badge tag-purple mono" style={{ fontSize: 11 }}>External Outreach</span>
            </div>

            {collegeBreakdown.length === 0 ? (
              <div className="muted" style={{ padding: 20, textAlign: 'center', fontSize: 13 }}>No records for active selection.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {collegeBreakdown.slice(0, 10).map(([collegeName, count]) => (
                  <div key={collegeName} style={{
                    padding: '8px 12px',
                    background: 'var(--card)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{collegeName}</span>
                    <span className="badge tag-indigo mono" style={{ fontWeight: 800, fontSize: 11 }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event-wise Participation Breakdown */}
          <div className="card" style={{ padding: 20, background: 'var(--surface-0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
                ⚡ Event-wise Participation (Top Delegations)
              </div>
              <span className="badge tag-amber mono" style={{ fontSize: 11 }}>Competitions</span>
            </div>

            {eventBreakdown.length === 0 ? (
              <div className="muted" style={{ padding: 20, textAlign: 'center', fontSize: 13 }}>No records for active selection.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eventBreakdown.map(([evTitle, count]) => (
                  <div key={evTitle} style={{
                    padding: '8px 12px',
                    background: 'var(--card)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {evTitle}
                    </span>
                    <span className="badge tag-green mono" style={{ fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                      {count} delegates
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: DETAILED RECORDS TABLE (Requirement 5)                        */}
      {/* ===================================================================== */}
      {activeTab === 'records' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Displaying <b>{filteredRequests.length}</b> verified records according to active filter criteria.
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              Page {page} of {totalPages}
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12 }}>
            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-0)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px 14px' }}>Student Name</th>
                  <th style={{ padding: '10px 14px' }}>Roll / Reg No</th>
                  <th style={{ padding: '10px 14px' }}>Department</th>
                  <th style={{ padding: '10px 14px' }}>Event Name</th>
                  <th style={{ padding: '10px 14px' }}>External Institution</th>
                  <th style={{ padding: '10px 14px' }}>Event Date</th>
                  <th style={{ padding: '10px 14px' }}>Participation</th>
                  <th style={{ padding: '10px 14px' }}>Prize / Honor</th>
                  <th style={{ padding: '10px 14px' }}>OD Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: 24, textAlign: 'center', color: 'var(--ink-soft)' }}>
                      No student records match the selected month, department, or college.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((r, idx) => {
                    const isPrizeWinner = r.prize && r.prize !== 'Participant'

                    return (
                      <tr key={r.id || idx} style={{ borderBottom: '1px solid var(--border)', background: isPrizeWinner ? 'rgba(234, 179, 8, 0.04)' : 'transparent' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                          {r.studentName}
                        </td>
                        <td style={{ padding: '10px 14px' }} className="mono">{r.rollNo || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>{r.dept}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.eventName || r.eventTitle}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="badge tag-indigo" style={{ fontSize: 11 }}>{r.organizer || 'College'}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }} className="mono">{r.eventDate}</td>
                        <td style={{ padding: '10px 14px' }}>
                          {r.proof ? (
                            <span className="badge tag-green" title="Verified certificate uploaded">✓ Verified</span>
                          ) : (
                            <span className="badge tag-amber">Attended</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {r.prize === 'First Prize' ? (
                            <span className="badge" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 800, border: '1px solid #facc15' }}>
                              🥇 First Prize
                            </span>
                          ) : r.prize === 'Second Prize' ? (
                            <span className="badge" style={{ background: '#e2e8f0', color: '#334155', fontWeight: 800, border: '1px solid #cbd5e1' }}>
                              🥈 Second Prize
                            </span>
                          ) : r.prize === 'Third Prize' ? (
                            <span className="badge" style={{ background: '#ffedd5', color: '#9a3412', fontWeight: 800, border: '1px solid #fdba74' }}>
                              🥉 Third Prize
                            </span>
                          ) : (
                            <span className="muted" style={{ fontSize: 11.5 }}>Participant</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`badge ${
                            r.status === 'OD Issued' ? 'tag-teal' :
                            r.status === 'Approved' ? 'tag-green' :
                            r.status === 'Pending Approval' ? 'tag-amber' :
                            r.status === 'Rejected' ? 'tag-danger' : 'tag-indigo'
                          }`} style={{ fontWeight: 700 }}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous Page
              </button>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next Page →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
