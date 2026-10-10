import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { exportTableToCSV, exportTableToPDF } from '../../utils/tableExport'

export default function ODAnalytics() {
  const { user } = useAuth()
  const { permissionRequests, odRecords } = useData()

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState('October 2026')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedCollege, setSelectedCollege] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedPrize, setSelectedPrize] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'report' | 'colleges' | 'departments'

  // Extract available unique months from permission requests
  const availableMonths = useMemo(() => {
    const months = new Set()
    permissionRequests.forEach(r => {
      if (r.eventDate) {
        const d = new Date(r.eventDate)
        if (!isNaN(d.getTime())) {
          months.add(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
        }
      }
    })
    const order = ['August 2026', 'September 2026', 'October 2026', 'November 2026']
    return Array.from(months).sort((a, b) => {
      const idxA = order.indexOf(a)
      const idxB = order.indexOf(b)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      return a.localeCompare(b)
    })
  }, [permissionRequests])

  // Extract unique departments, colleges, and events
  const departments = useMemo(() => {
    const set = new Set(permissionRequests.map(r => r.dept).filter(Boolean))
    return Array.from(set).sort()
  }, [permissionRequests])

  const externalColleges = useMemo(() => {
    const set = new Set(permissionRequests.map(r => r.organizer).filter(Boolean))
    return Array.from(set).sort()
  }, [permissionRequests])

  const eventNames = useMemo(() => {
    const set = new Set(permissionRequests.map(r => r.eventName).filter(Boolean))
    return Array.from(set).sort()
  }, [permissionRequests])

  // Helper to extract prize string from request
  const getRequestPrize = (req) => {
    if (req.prize) return req.prize
    if (req.proof?.prize) return req.proof.prize
    if (req.proof?.description?.includes('First Prize') || req.proof?.description?.includes('1st Prize')) return 'First Prize'
    if (req.proof?.description?.includes('Second Prize') || req.proof?.description?.includes('2nd Prize')) return 'Second Prize'
    if (req.proof?.description?.includes('Third Prize') || req.proof?.description?.includes('3rd Prize')) return 'Third Prize'
    return 'Participant'
  }

  // Helper to determine Month/Year
  const getReqMonth = (req) => {
    if (!req.eventDate) return 'Other'
    const d = new Date(req.eventDate)
    return isNaN(d.getTime()) ? 'Other' : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Filtered requests based on active filters
  const filteredRequests = useMemo(() => {
    return permissionRequests.filter(req => {
      // Month Filter
      if (selectedMonth !== 'all') {
        const m = getReqMonth(req)
        if (m.toLowerCase() !== selectedMonth.toLowerCase()) return false
      }

      // Custom Date Range
      if (startDate && req.eventDate && req.eventDate < startDate) return false
      if (endDate && req.eventDate && req.eventDate > endDate) return false

      // Department Filter
      if (selectedDept !== 'all' && req.dept !== selectedDept) return false

      // College Filter
      if (selectedCollege !== 'all' && req.organizer !== selectedCollege) return false

      // Event Filter
      if (selectedEvent !== 'all' && req.eventName !== selectedEvent) return false

      // Prize Filter
      const prize = getRequestPrize(req)
      if (selectedPrize !== 'all') {
        if (selectedPrize === 'winners' && (prize === 'Participant' || !prize)) return false
        if (selectedPrize !== 'winners' && prize !== selectedPrize) return false
      }

      // Status Filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'approved_any' && !['OD Issued', 'Approved', 'Proof Verified'].includes(req.status)) return false
        else if (selectedStatus !== 'approved_any' && req.status !== selectedStatus) return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          (req.studentName || '').toLowerCase().includes(q) ||
          (req.rollNo || '').toLowerCase().includes(q) ||
          (req.dept || '').toLowerCase().includes(q) ||
          (req.eventName || '').toLowerCase().includes(q) ||
          (req.organizer || '').toLowerCase().includes(q)
        if (!match) return false
      }

      return true
    })
  }, [permissionRequests, selectedMonth, startDate, endDate, selectedDept, selectedCollege, selectedEvent, selectedPrize, selectedStatus, searchQuery])

  // -------------------------------------------------------------
  // COMPUTED ANALYTICS METRICS
  // -------------------------------------------------------------
  const stats = useMemo(() => {
    const list = filteredRequests
    const totalRequests = list.length
    const approvedRequests = list.filter(r => ['OD Issued', 'Approved', 'Proof Verified'].includes(r.status)).length
    const pendingRequests = list.filter(r => ['Pending Approval', 'Proof Submitted'].includes(r.status)).length
    const rejectedRequests = list.filter(r => ['Rejected', 'Proof Rejected'].includes(r.status)).length

    const externalParticipants = list.filter(r => r.scope === 'External').length
    const totalIssuedPasses = list.filter(r => r.status === 'OD Issued').length

    // Prizes counts
    let firstPrize = 0
    let secondPrize = 0
    let thirdPrize = 0
    let participants = 0

    list.forEach(r => {
      const p = getRequestPrize(r)
      if (p === 'First Prize') firstPrize++
      else if (p === 'Second Prize') secondPrize++
      else if (p === 'Third Prize') thirdPrize++
      else participants++
    })

    const totalWinners = firstPrize + secondPrize + thirdPrize

    // College-wise aggregation
    const collegeMap = {}
    list.forEach(r => {
      const col = r.organizer || 'Other College'
      if (!collegeMap[col]) {
        collegeMap[col] = { college: col, count: 0, first: 0, second: 0, third: 0 }
      }
      collegeMap[col].count++
      const p = getRequestPrize(r)
      if (p === 'First Prize') collegeMap[col].first++
      if (p === 'Second Prize') collegeMap[col].second++
      if (p === 'Third Prize') collegeMap[col].third++
    })
    const collegeStats = Object.values(collegeMap).sort((a, b) => b.count - a.count)

    // Department-wise aggregation
    const deptMap = {}
    list.forEach(r => {
      const d = r.dept || 'Engineering'
      if (!deptMap[d]) {
        deptMap[d] = { dept: d, count: 0, winners: 0 }
      }
      deptMap[d].count++
      const p = getRequestPrize(r)
      if (['First Prize', 'Second Prize', 'Third Prize'].includes(p)) {
        deptMap[d].winners++
      }
    })
    const deptStats = Object.values(deptMap).sort((a, b) => b.count - a.count)

    // Event-wise aggregation
    const eventMap = {}
    list.forEach(r => {
      const ev = r.eventName || 'Unnamed Event'
      if (!eventMap[ev]) {
        eventMap[ev] = { eventName: ev, college: r.organizer || 'Host Institution', count: 0 }
      }
      eventMap[ev].count++
    })
    const eventStats = Object.values(eventMap).sort((a, b) => b.count - a.count)

    // Monthly Trend Comparison (Across all data)
    const monthlyTrendMap = {}
    permissionRequests.forEach(r => {
      const m = getReqMonth(r)
      if (m && m !== 'Other') {
        if (!monthlyTrendMap[m]) {
          monthlyTrendMap[m] = { month: m, total: 0, external: 0, winners: 0 }
        }
        monthlyTrendMap[m].total++
        if (r.scope === 'External') monthlyTrendMap[m].external++
        const p = getRequestPrize(r)
        if (['First Prize', 'Second Prize', 'Third Prize'].includes(p)) {
          monthlyTrendMap[m].winners++
        }
      }
    })
    const monthlyTrend = Object.values(monthlyTrendMap)

    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests,
      externalParticipants,
      totalIssuedPasses,
      firstPrize,
      secondPrize,
      thirdPrize,
      totalWinners,
      participants,
      collegeStats,
      deptStats,
      eventStats,
      monthlyTrend
    }
  }, [filteredRequests, permissionRequests])

  // -------------------------------------------------------------
  // REPORT EXPORT HANDLERS (EXCEL & PRINTABLE PDF)
  // -------------------------------------------------------------
  const handleExportCSV = () => {
    const headers = [
      'Application ID',
      'Student Name',
      'Register / Roll No',
      'Department',
      'Year',
      'Event Name',
      'Host College / Institution',
      'Event Date',
      'Scope',
      'Participation Status',
      'Prize / Achievement',
      'OD Approval Status',
      'Pass Number'
    ]

    const rows = filteredRequests.map(r => [
      r.id,
      r.studentName,
      r.rollNo,
      r.dept,
      r.year || 'N/A',
      r.eventName,
      r.organizer || 'Host Institution',
      r.eventDate,
      r.scope,
      r.status === 'OD Issued' ? 'Completed & Verified' : r.status === 'Proof Submitted' ? 'Attended (Proof Under Review)' : 'Registered',
      getRequestPrize(r),
      r.status,
      r.odRecordId || '—'
    ])

    const filterText = `Month: ${selectedMonth} | Dept: ${selectedDept} | College: ${selectedCollege} | Prize: ${selectedPrize}`

    exportTableToCSV({
      filename: `OD_Analytics_Report_${selectedMonth.replace(/\s+/g, '_')}_${Date.now()}`,
      headers,
      rows,
      metadata: {
        title: `On-Duty (OD) & External Participation Analytics Report (${selectedMonth})`,
        filterSummary: filterText
      }
    })
  }

  const handleExportPDF = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Department',
      'Event Name',
      'Host College',
      'Event Date',
      'Prize / Laurel',
      'OD Status'
    ]

    const rows = filteredRequests.map(r => [
      r.rollNo,
      r.studentName,
      r.dept.replace('Engineering', 'Engg'),
      r.eventName.length > 28 ? r.eventName.slice(0, 26) + '...' : r.eventName,
      r.organizer || 'Host Institution',
      r.eventDate,
      getRequestPrize(r),
      r.status
    ])

    const filterSummary = `Period: ${selectedMonth} · Total Records: ${filteredRequests.length} · External Events: ${stats.externalParticipants} · Prizes: ${stats.totalWinners} (1st: ${stats.firstPrize}, 2nd: ${stats.secondPrize}, 3rd: ${stats.thirdPrize})`

    exportTableToPDF({
      title: 'OFFICE OF ON-DUTY (OD) & EXTERNAL EVENT PARTICIPATION',
      subtitle: `Official Verification & Academic Analytics Dossier (${selectedMonth})`,
      filterSummary,
      headers,
      rows
    })
  }

  // Calculate percentages for SVG Donut
  const donutTotal = stats.totalRequests || 1
  const firstPct = (stats.firstPrize / donutTotal) * 100
  const secondPct = (stats.secondPrize / donutTotal) * 100
  const thirdPct = (stats.thirdPrize / donutTotal) * 100
  const participantPct = 100 - (firstPct + secondPct + thirdPct)

  return (
    <DashboardLayout role="faculty_od">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26 }}>📊</span>
            <h1 style={{ fontSize: 26, margin: 0 }}>OD Instructor Analytics & Performance Dashboard</h1>
            <span className="badge tag-amber">Executive Faculty Intelligence</span>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            Comprehensive institutional analytics: Track external college event participation, verify student prize distributions, and generate certified OD reports.
          </p>
        </div>

        {/* Top Report Export Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleExportPDF}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <span>📄</span> Generate PDF Report
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <span>📥</span> Export to Excel (.csv)
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 24, background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-soft)' }}>
            🗓️ Analytics Period & Scope Filters
          </div>
          <button
            type="button"
            className="btn btn-text btn-sm"
            style={{ fontSize: 12, color: 'var(--indigo)' }}
            onClick={() => {
              setSelectedMonth('October 2026')
              setStartDate('')
              setEndDate('')
              setSelectedDept('all')
              setSelectedCollege('all')
              setSelectedEvent('all')
              setSelectedPrize('all')
              setSelectedStatus('all')
              setSearchQuery('')
            }}
          >
            ↺ Reset Filters (Default: October 2026)
          </button>
        </div>

        {/* Month Pills Row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <button
            type="button"
            className={`chip ${selectedMonth === 'all' ? 'on' : ''}`}
            onClick={() => setSelectedMonth('all')}
            style={{ fontSize: 12, padding: '6px 14px', fontWeight: 600 }}
          >
            🌐 All Months (Consolidated)
          </button>
          {availableMonths.map(m => (
            <button
              key={m}
              type="button"
              className={`chip ${selectedMonth === m ? 'on' : ''}`}
              onClick={() => setSelectedMonth(m)}
              style={{ fontSize: 12, padding: '6px 14px', fontWeight: 600 }}
            >
              📅 {m} {m === 'October 2026' ? '★ (Current)' : ''}
            </button>
          ))}
        </div>

        {/* Granular Filters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {/* Department */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* External College */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>External College / Host</label>
            <select
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              <option value="all">All External Colleges ({externalColleges.length})</option>
              {externalColleges.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Prize / Laurels */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>Prize / Award</label>
            <select
              value={selectedPrize}
              onChange={e => setSelectedPrize(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              <option value="all">All Participation Types</option>
              <option value="winners">🏆 All Prize Winners Only</option>
              <option value="First Prize">🥇 First Prize Winners</option>
              <option value="Second Prize">🥈 Second Prize Winners</option>
              <option value="Third Prize">🥉 Third Prize Winners</option>
              <option value="Participant">🎖️ General Participants</option>
            </select>
          </div>

          {/* OD Status */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>OD Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              <option value="all">All OD Statuses</option>
              <option value="OD Issued">🎖️ OD Issued (Verified Pass)</option>
              <option value="Approved">✓ Permission Approved</option>
              <option value="Proof Submitted">📸 Proof Submitted</option>
              <option value="Pending Approval">⏳ Pending Review</option>
              <option value="Rejected">✕ Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>Search Scholar / Event</label>
            <input
              type="text"
              placeholder="Search name, roll no, event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px' }}
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          KPI STAT STRIP (HIGHLIGHTING OCTOBER 2026 & ACTIVE PERIOD METRICS)
          ==================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 14,
        marginBottom: 24
      }}>
        {/* Total OD Requests */}
        <div className="card" style={{ padding: 18, borderTop: '4px solid var(--indigo)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Total OD Requests</span>
            <span style={{ fontSize: 18 }}>📋</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)' }}>{stats.totalRequests}</div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            In selected scope ({selectedMonth})
          </div>
        </div>

        {/* Approved OD Requests */}
        <div className="card" style={{ padding: 18, borderTop: '4px solid var(--green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Approved & Sanctioned</span>
            <span style={{ fontSize: 18 }}>✓</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--green)' }}>{stats.approvedRequests}</div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            {stats.totalIssuedPasses} Official OD Passes Issued
          </div>
        </div>

        {/* Pending OD Requests */}
        <div className="card" style={{ padding: 18, borderTop: '4px solid var(--amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</span>
            <span style={{ fontSize: 18 }}>⏳</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--amber)' }}>{stats.pendingRequests}</div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            Requires faculty verification
          </div>
        </div>

        {/* Rejected OD Requests */}
        <div className="card" style={{ padding: 18, borderTop: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>Rejected Requests</span>
            <span style={{ fontSize: 18 }}>✕</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--danger)' }}>{stats.rejectedRequests}</div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            Incomplete proof / unaccredited
          </div>
        </div>

        {/* External College Participants */}
        <div className="card" style={{ padding: 18, borderTop: '4px solid var(--purple)', background: 'var(--surface-0)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' }}>External Participations</span>
            <span style={{ fontSize: 18 }}>🏛️</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--purple)' }}>{stats.externalParticipants}</div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            Across {stats.collegeStats.length} External Universities
          </div>
        </div>
      </div>

      {/* ====================================================================
          PRIZE WINNERS CALLOUT PANEL (FIRST, SECOND, THIRD PRIZE COUNTS)
          ==================================================================== */}
      <div className="card" style={{ padding: 22, marginBottom: 28, background: 'var(--surface-0)', border: '1px solid var(--border-strong)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🏆</span>
              <h3 style={{ fontSize: 17, margin: 0 }}>Student Achievement & Prize Distribution Statistics</h3>
              <span className="badge tag-amber">{selectedMonth}</span>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0' }}>
              Official count of verified student awards achieved at external and university events.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              Total Students Awarded: <span style={{ fontSize: 18, color: 'var(--amber)' }}>{stats.totalWinners}</span> / {stats.totalRequests}
            </span>
          </div>
        </div>

        {/* 4 Prize Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
          {/* First Prize */}
          <div style={{
            background: 'var(--card)',
            padding: 16,
            borderRadius: 12,
            border: '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🥇</span>
              <span className="badge tag-amber" style={{ fontWeight: 800 }}>Gold Champions</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--amber)' }}>
              {stats.firstPrize} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Students</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>First Prize Winners</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
              Top honors at IIT Madras, NIT Trichy, Anna Univ, etc.
            </div>
          </div>

          {/* Second Prize */}
          <div style={{
            background: 'var(--card)',
            padding: 16,
            borderRadius: 12,
            border: '2px solid rgba(148, 163, 184, 0.4)',
            boxShadow: '0 2px 8px rgba(148, 163, 184, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🥈</span>
              <span className="badge tag-slate" style={{ fontWeight: 800 }}>Silver Runners</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--slate)' }}>
              {stats.secondPrize} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Students</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>Second Prize Winners</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
              Runner-up achievements & innovation cups
            </div>
          </div>

          {/* Third Prize */}
          <div style={{
            background: 'var(--card)',
            padding: 16,
            borderRadius: 12,
            border: '2px solid rgba(180, 83, 9, 0.4)',
            boxShadow: '0 2px 8px rgba(180, 83, 9, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🥉</span>
              <span className="badge tag-amber" style={{ fontWeight: 800 }}>Bronze Laurels</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#B45309' }}>
              {stats.thirdPrize} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Students</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>Third Prize Winners</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
              3rd Place podium finishes & specialized merit honors
            </div>
          </div>

          {/* General Participants */}
          <div style={{
            background: 'var(--card)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🎖️</span>
              <span className="badge tag-indigo" style={{ fontWeight: 800 }}>Participation</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--indigo)' }}>
              {stats.participants} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Students</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>Active Delegates</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
              Completed accredited external delegations
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          TWO COLUMN ANALYTICS VISUALIZATIONS SECTION
          ==================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24, marginBottom: 28 }}>
        {/* Left Card: College-Wise External Participation Chart */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, margin: 0 }}>🏛️ External College-Wise Participation</h3>
              <p className="muted" style={{ fontSize: 12, margin: '2px 0 0' }}>Number of students representing our college per external host institution.</p>
            </div>
            <span className="badge tag-purple">{stats.collegeStats.length} Host Colleges</span>
          </div>

          {/* College Horizontal Bar Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {stats.collegeStats.slice(0, 8).map((col, idx) => {
              const maxCount = Math.max(...stats.collegeStats.map(c => c.count), 1)
              const pct = Math.round((col.count / maxCount) * 100)
              const totalColWinners = col.first + col.second + col.third

              return (
                <div key={col.college} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="mono" style={{ color: 'var(--ink-soft)', fontSize: 11 }}>#{idx + 1}</span>
                      <span>{col.college}</span>
                      {totalColWinners > 0 && (
                        <span className="badge tag-amber" style={{ fontSize: 10, padding: '2px 6px' }}>
                          🏆 {totalColWinners} Prize{totalColWinners > 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--indigo)' }}>{col.count} Students</span>
                  </div>

                  {/* Visual Bar Track */}
                  <div style={{
                    width: '100%',
                    height: 9,
                    borderRadius: 6,
                    background: 'var(--surface-2)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: idx % 2 === 0 ? 'var(--indigo)' : 'var(--purple)',
                      borderRadius: 6,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Card: Department-Wise Participation & Monthly Trend */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, margin: 0 }}>🏢 Department-Wise Participation</h3>
              <p className="muted" style={{ fontSize: 12, margin: '2px 0 0' }}>Participation breakdown across academic departments.</p>
            </div>
            <span className="badge tag-indigo">{stats.deptStats.length} Departments</span>
          </div>

          {/* Department Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {stats.deptStats.map(d => {
              const maxDept = Math.max(...stats.deptStats.map(x => x.count), 1)
              const pct = Math.round((d.count / maxDept) * 100)
              return (
                <div key={d.dept} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                    <span style={{ fontWeight: 600 }}>{d.dept}</span>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {d.count} Students <span className="muted" style={{ fontWeight: 400 }}>({d.winners} won)</span>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 5, background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--green)', borderRadius: 5 }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Monthly Trend Mini-Bar Chart */}
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>
              📈 Semester Trend (Monthly Participation)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.monthlyTrend.length || 1}, 1fr)`, gap: 10, alignItems: 'flex-end', height: 90 }}>
              {stats.monthlyTrend.map(mt => {
                const maxMonth = Math.max(...stats.monthlyTrend.map(x => x.total), 1)
                const heightPct = Math.round((mt.total / maxMonth) * 100)
                const isSelected = selectedMonth.toLowerCase().includes(mt.month.toLowerCase().split(' ')[0])

                return (
                  <div key={mt.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? 'var(--indigo)' : 'var(--ink-soft)', marginBottom: 4 }}>
                      {mt.total}
                    </div>
                    <div style={{
                      width: '70%',
                      height: `${heightPct}%`,
                      background: isSelected ? 'var(--primary-gradient)' : 'var(--surface-3)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease'
                    }} />
                    <div style={{ fontSize: 10.5, fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--primary)' : 'var(--ink-soft)', marginTop: 6, textAlign: 'center' }}>
                      {mt.month.split(' ')[0]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          DETAILED OD ANALYTICS REPORT TABLE (REQUIREMENT 5)
          ==================================================================== */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <h3 style={{ fontSize: 17, margin: 0 }}>Official OD Participation & Verification Register</h3>
              <span className="badge tag-green">{filteredRequests.length} Filtered Records</span>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0' }}>
              Generated report with verified roll numbers, host institutions, and prize classifications.
            </p>
          </div>

          {/* Action Export Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleExportPDF}
              style={{ fontSize: 12 }}
            >
              📄 Download PDF Dossier
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleExportCSV}
              style={{ fontSize: 12 }}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Roll Number</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Student Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Department</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Event Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Host College / Institution</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Prize / Laurel</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>OD Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Pass ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No OD records match the selected filters. Try broadening the search criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, idx) => {
                  const prize = getRequestPrize(req)
                  const isFirst = prize === 'First Prize'
                  const isSecond = prize === 'Second Prize'
                  const isThird = prize === 'Third Prize'
                  const isPrize = isFirst || isSecond || isThird

                  return (
                    <tr
                      key={req.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: idx % 2 === 0 ? 'var(--card)' : 'var(--surface-0)'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 700 }} className="mono">
                        {req.rollNo}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {req.studentName}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--ink-soft)' }}>
                        {req.dept.replace('Engineering', 'Engg')}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {req.eventName}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--indigo)', fontWeight: 600 }}>
                        🏛️ {req.organizer || 'Host Institution'}
                      </td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }} className="mono">
                        {req.eventDate}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {isFirst ? (
                          <span className="badge tag-amber" style={{ fontWeight: 800 }}>🥇 1st Prize</span>
                        ) : isSecond ? (
                          <span className="badge tag-slate" style={{ fontWeight: 800 }}>🥈 2nd Prize</span>
                        ) : isThird ? (
                          <span className="badge tag-amber" style={{ fontWeight: 800 }}>🥉 3rd Prize</span>
                        ) : (
                          <span className="badge tag-indigo">Participant</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge ${
                          req.status === 'OD Issued' ? 'tag-green' :
                          req.status === 'Approved' ? 'tag-teal' :
                          req.status === 'Proof Submitted' ? 'tag-purple' :
                          req.status === 'Rejected' ? 'tag-danger' : 'tag-amber'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }} className="mono">
                        {req.odRecordId ? (
                          <Link to="/od-incharge/records" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>
                            {req.odRecordId}
                          </Link>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: 'var(--ink-soft)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            Showing <b>{filteredRequests.length}</b> verified institutional participation records for <b>{selectedMonth}</b>.
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>🥇 <b>{stats.firstPrize}</b> First</span>
            <span>🥈 <b>{stats.secondPrize}</b> Second</span>
            <span>🥉 <b>{stats.thirdPrize}</b> Third</span>
            <span>🎖️ <b>{stats.participants}</b> Participants</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
