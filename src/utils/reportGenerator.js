// Campus Event Hub - Monthly Event Conduction & Analytics Report Generator

/**
 * Extracts normalized Month Year string (e.g. "September 2026") from an event.
 */
export function getEventMonthYear(event) {
  if (!event) return 'Unscheduled'

  if (event.conductionDate) {
    const d = new Date(event.conductionDate)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  if (event.date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    for (let i = 0; i < months.length; i++) {
      if (event.date.includes(months[i])) {
        const yearMatch = event.date.match(/202\d/)
        const year = yearMatch ? yearMatch[0] : '2026'
        return `${fullMonths[i]} ${year}`
      }
    }
  }

  if (event.enrollStart) {
    const d = new Date(event.enrollStart)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  return 'August 2026'
}

/**
 * Returns available unique months sorted in chronological order.
 */
export function getAvailableMonths(events = []) {
  const monthSet = new Set()
  events.forEach(ev => {
    const m = getEventMonthYear(ev)
    if (m && m !== 'Unscheduled') monthSet.add(m)
  })

  // Standard chronological sort order
  const order = [
    'July 2026',
    'August 2026',
    'September 2026',
    'October 2026',
    'November 2026',
    'December 2026'
  ]

  const sorted = Array.from(monthSet).sort((a, b) => {
    const idxA = order.indexOf(a)
    const idxB = order.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    return a.localeCompare(b)
  })

  return sorted.length > 0 ? sorted : ['August 2026', 'September 2026', 'October 2026']
}

/**
 * Aggregates monthly analytics for events and attendance.
 */
export function getMonthlyAnalytics(events = [], registrations = [], targetMonth = 'all', targetClub = 'all') {
  const filteredEvents = events.filter(ev => {
    const month = getEventMonthYear(ev)
    const matchesMonth = targetMonth === 'all' || month.toLowerCase() === targetMonth.toLowerCase()
    const matchesClub = targetClub === 'all' || ev.club.toLowerCase() === targetClub.toLowerCase()
    return matchesMonth && matchesClub
  })

  const eventIds = new Set(filteredEvents.map(e => e.id))
  const filteredRegs = registrations.filter(r => eventIds.has(r.eventId))

  const totalEvents = filteredEvents.length
  const totalRegistrations = filteredRegs.length
  const totalAttended = filteredRegs.filter(r => r.attended).length
  const overallAttendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0

  // Status breakdown
  const liveCount = filteredEvents.filter(e => e.statusOverride === 'active_conduction').length
  const openCount = filteredEvents.filter(e => e.statusOverride === 'open' || !e.statusOverride).length
  const upcomingCount = filteredEvents.filter(e => e.statusOverride === 'upcoming').length
  const closedCount = filteredEvents.filter(e => e.statusOverride === 'closed').length

  // Access level breakdown
  const membersOnlyCount = filteredEvents.filter(e =>
    ['members_only', 'membership_only', 'club_specific'].includes(e.accessLevel)
  ).length
  const publicCount = totalEvents - membersOnlyCount

  // Club breakdown
  const clubStats = {}
  filteredEvents.forEach(ev => {
    const cName = ev.club || 'Other'
    if (!clubStats[cName]) {
      clubStats[cName] = { name: cName, count: 0, registered: 0, attended: 0, tagClass: ev.tagClass || 'tag-indigo' }
    }
    clubStats[cName].count += 1
    const eventRegs = filteredRegs.filter(r => r.eventId === ev.id)
    clubStats[cName].registered += eventRegs.length
    clubStats[cName].attended += eventRegs.filter(r => r.attended).length
  })

  // Category breakdown
  const categoryStats = {}
  filteredEvents.forEach(ev => {
    const cat = ev.tag || 'General'
    categoryStats[cat] = (categoryStats[cat] || 0) + 1
  })

  return {
    filteredEvents,
    filteredRegs,
    totalEvents,
    totalRegistrations,
    totalAttended,
    overallAttendanceRate,
    statusCounts: { live: liveCount, open: openCount, upcoming: upcomingCount, closed: closedCount },
    accessCounts: { membersOnly: membersOnlyCount, public: publicCount },
    clubStats: Object.values(clubStats),
    categoryStats
  }
}

/**
 * Generates an official, print-ready PDF Report in a pop-up print window.
 */
export function exportMonthlyReportPDF({
  month = 'September 2026',
  events = [],
  registrations = [],
  clubFilter = 'all',
  generatedBy = 'Dr. Aris Thorne (Dean of Student Affairs)',
  role = 'admin'
}) {
  const analytics = getMonthlyAnalytics(events, registrations, month, clubFilter)
  const isAllMonths = month === 'all'
  const displayPeriod = isAllMonths ? 'Academic Year 2026 (All Months Summary)' : month
  const displayClub = clubFilter === 'all' ? 'All Campus Societies & Chapters' : `${clubFilter} Chapter`

  const printWindow = window.open('', '_blank', 'width=1020,height=800')
  if (!printWindow) {
    alert('Please allow pop-ups in your browser to view and print the PDF report.')
    return
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Campus Event Hub - Monthly Event Conduction Report (${displayPeriod})</title>
  <style>
    @page { size: A4 portrait; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.45;
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f1f5f9;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .print-btn {
      background: #4338ca;
      color: #fff;
      border: none;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
    }
    .print-btn:hover { background: #3730a3; }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #1e1b4b;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .inst-title {
      font-size: 21px;
      font-weight: 800;
      color: #1e1b4b;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .inst-subtitle {
      font-size: 12px;
      color: #475569;
      margin-top: 3px;
      font-weight: 600;
    }
    .doc-badge {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      font-size: 10.5px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      text-align: left;
    }
    .kpi-num {
      font-size: 22px;
      font-weight: 800;
      color: #1e1b4b;
      font-family: monospace;
    }
    .kpi-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin-top: 2px;
    }
    .section-heading {
      font-size: 14px;
      font-weight: 800;
      color: #1e1b4b;
      margin: 18px 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      font-size: 11px;
    }
    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 7px 8px;
    }
    table.data-table td {
      border-bottom: 1px solid #e2e8f0;
      padding: 7px 8px;
      vertical-align: top;
    }
    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .badge-status {
      display: inline-block;
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .badge-open { background: #dcfce7; color: #15803d; }
    .badge-live { background: #e0e7ff; color: #4338ca; }
    .badge-upcoming { background: #fef3c7; color: #b45309; }
    .badge-closed { background: #fee2e2; color: #b91c1c; }
    .badge-tag { background: #f1f5f9; color: #475569; font-weight: 600; font-size: 9.5px; padding: 2px 5px; border-radius: 3px; }
    .summary-cols {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }
    .club-pill {
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 6px;
      margin-bottom: 6px;
      font-size: 11px;
    }
    .signatures {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      page-break-inside: avoid;
    }
    .sig-block {
      width: 200px;
      text-align: center;
      border-top: 1px solid #334155;
      padding-top: 6px;
      font-size: 11px;
    }
    .sig-title { font-weight: 700; color: #0f172a; }
    .sig-sub { font-size: 10px; color: #64748b; }
    .footer-note {
      margin-top: 24px;
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
    @media print {
      body { padding: 0; }
      .print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div>
      <b>Campus Event Hub · Monthly Conduction Dossier</b>
      <span style="color: #64748b; margin-left: 10px; font-size: 12px;">Ready for PDF printing or digital archiving</span>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <table class="header-table">
    <tr>
      <td>
        <span class="doc-badge">Official Conduction Record</span>
        <h1 class="inst-title">Campus Event Hub — University Event Conduction Report</h1>
        <div class="inst-subtitle">
          Reporting Period: <b>${displayPeriod}</b> · Chapter Scope: <b>${displayClub}</b>
        </div>
      </td>
      <td style="text-align: right; vertical-align: top; font-size: 11px; color: #475569;">
        <div><b>Generated:</b> ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        <div><b>Authority:</b> ${generatedBy}</div>
        <div><b>System:</b> CEH Enterprise Conduction Suite v2.4</div>
      </td>
    </tr>
  </table>

  <!-- KPI SUMMARY -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-num">${analytics.totalEvents}</div>
      <div class="kpi-label">Events Scheduled / Conducted</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #4338ca;">${analytics.totalRegistrations}</div>
      <div class="kpi-label">Student Contestant Passes</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #15803d;">${analytics.totalAttended} (${analytics.overallAttendanceRate}%)</div>
      <div class="kpi-label">Verified Attendance Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #b45309;">${analytics.clubStats.length}</div>
      <div class="kpi-label">Participating Club Chapters</div>
    </div>
  </div>

  <!-- SUMMARY DISTRIBUTION -->
  <div class="summary-cols">
    <div>
      <div class="section-heading">🏛️ Chapter-wise Event Conduction & Participation</div>
      ${analytics.clubStats.map(c => `
        <div class="club-pill">
          <div><b>${c.name} Chapter</b> (${c.count} Event${c.count > 1 ? 's' : ''})</div>
          <div><b>${c.registered}</b> Regs · <span style="color: #15803d; font-weight: bold;">${c.attended}</span> Present (${c.registered > 0 ? Math.round((c.attended / c.registered) * 100) : 0}%)</div>
        </div>
      `).join('')}
    </div>

    <div>
      <div class="section-heading">📊 Category & Access Distribution</div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; font-size: 11px;">
        <div style="margin-bottom: 6px;"><b>Public vs Restricted Events:</b></div>
        <div style="display: flex; gap: 14px; margin-bottom: 10px;">
          <span>🌐 Public Events: <b>${analytics.accessCounts.public}</b></span>
          <span>🔒 Members-Only: <b>${analytics.accessCounts.membersOnly}</b></span>
        </div>
        <div style="margin-bottom: 6px;"><b>Category Breakdown:</b></div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${Object.entries(analytics.categoryStats).map(([cat, cnt]) => `
            <span class="badge-tag">🏷️ ${cat}: <b>${cnt}</b></span>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- EVENT ROSTER TABLE -->
  <div class="section-heading" style="margin-top: 22px;">
    <span>📋 Complete Event Conduction Log (${analytics.filteredEvents.length} Sessions)</span>
    <span style="font-size: 11px; font-weight: 600; color: #64748b;">Includes venue PINs and attendance numbers</span>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25px;">#</th>
        <th>Event Title & Club</th>
        <th>Category</th>
        <th>Date & Time</th>
        <th>Venue & PIN</th>
        <th>Audience</th>
        <th style="text-align: center;">Capacity</th>
        <th style="text-align: center;">Reg / Attended</th>
        <th style="text-align: center;">Attendance %</th>
        <th style="text-align: right;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${analytics.filteredEvents.map((ev, idx) => {
        const evRegs = registrations.filter(r => r.eventId === ev.id)
        const evPresent = evRegs.filter(r => r.attended).length
        const rate = evRegs.length > 0 ? Math.round((evPresent / evRegs.length) * 100) : 0
        const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)
        const statusClass = ev.statusOverride === 'active_conduction' ? 'badge-live' : ev.statusOverride === 'open' ? 'badge-open' : ev.statusOverride === 'upcoming' ? 'badge-upcoming' : 'badge-closed'
        const statusLabel = ev.statusOverride === 'active_conduction' ? '⚡ Live' : ev.statusOverride === 'open' ? '🟢 Open' : ev.statusOverride === 'upcoming' ? '🟡 Upcoming' : '🔴 Closed'

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div style="font-weight: 700; color: #1e1b4b;">${ev.title}</div>
              <div style="font-size: 10px; color: #64748b;">${ev.club} Chapter · Advisor: ${ev.organizingTeam?.facultyAdvisor || 'Faculty Lead'}</div>
            </td>
            <td><span class="badge-tag">${ev.tag || 'Tech'}</span></td>
            <td>
              <div><b>${ev.date}</b></div>
            </td>
            <td>
              <div>${ev.venue}</div>
              <div style="font-family: monospace; font-size: 10px; color: #4338ca;">PIN: <b>${ev.venuePin || '4821'}</b></div>
            </td>
            <td>${isMembersOnly ? '<span style="color: #6b21a8; font-weight: 700;">🔒 Members</span>' : '<span style="color: #15803d;">🌐 Public</span>'}</td>
            <td style="text-align: center;">${ev.capacity || 100}</td>
            <td style="text-align: center;"><b>${evRegs.length}</b> / <span style="color: #15803d; font-weight: 700;">${evPresent}</span></td>
            <td style="text-align: center;"><b>${rate}%</b></td>
            <td style="text-align: right;"><span class="badge-status ${statusClass}">${statusLabel}</span></td>
          </tr>
        `
      }).join('')}
    </tbody>
  </table>

  <!-- SIGNATURE BLOCKS -->
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-title">Student Conducting Lead</div>
      <div class="sig-sub">Chapter Event Operations</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Lead Faculty Advisor</div>
      <div class="sig-sub">Designated Department Mentor</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Dean of Student Affairs</div>
      <div class="sig-sub">University Platform Administration</div>
    </div>
  </div>

  <div class="footer-note">
    Campus Event Hub · Computer-generated verified conduction dossier · Valid without physical seal when verified via official portal credentials.
  </div>
</body>
</html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

/**
 * Generates an Excel-compatible structured CSV spreadsheet and downloads it.
 */
export function exportMonthlyReportCSV({
  month = 'September 2026',
  events = [],
  registrations = [],
  clubFilter = 'all'
}) {
  const analytics = getMonthlyAnalytics(events, registrations, month, clubFilter)
  const isAllMonths = month === 'all'
  const displayPeriod = isAllMonths ? 'All Months 2026' : month

  if (analytics.filteredEvents.length === 0) {
    alert(`No events found for ${displayPeriod}.`)
    return
  }

  const lines = []

  // Report Title & Metadata
  lines.push(`"CAMPUS EVENT HUB - MONTHLY EVENT CONDUCTION & ATTENDANCE REPORT"`)
  lines.push(`"Reporting Period:","${displayPeriod}"`)
  lines.push(`"Club Scope:","${clubFilter === 'all' ? 'All Chapters' : clubFilter}"`)
  lines.push(`"Generated On:","${new Date().toLocaleString()}"`)
  lines.push(`"Total Events:","${analytics.totalEvents}"`)
  lines.push(`"Total Registrations:","${analytics.totalRegistrations}"`)
  lines.push(`"Verified Attended:","${analytics.totalAttended}"`)
  lines.push(`"Overall Attendance Rate:","${analytics.overallAttendanceRate}%"`)
  lines.push(``)

  // Column Headers
  const headers = [
    'Event ID',
    'Event Title',
    'Club Chapter',
    'Category',
    'Scheduled Date & Time',
    'Venue Auditorium / Hall',
    'Venue PIN',
    'Audience Restriction',
    'Capacity',
    'Registered Students',
    'Verified Attended',
    'Attendance %',
    'Conduction Status',
    'Faculty Advisor',
    'Conducting Lead'
  ]
  lines.push(headers.map(h => `"${h}"`).join(','))

  // Event Data Rows
  analytics.filteredEvents.forEach(ev => {
    const evRegs = registrations.filter(r => r.eventId === ev.id)
    const evPresent = evRegs.filter(r => r.attended).length
    const rate = evRegs.length > 0 ? Math.round((evPresent / evRegs.length) * 100) : 0
    const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)

    const row = [
      ev.id,
      `"${(ev.title || '').replace(/"/g, '""')}"`,
      `"${ev.club || ''}"`,
      `"${ev.tag || ''}"`,
      `"${ev.date || ''}"`,
      `"${(ev.venue || '').replace(/"/g, '""')}"`,
      `"${ev.venuePin || '4821'}"`,
      `"${isMembersOnly ? 'Members Only' : 'Public'}"`,
      ev.capacity || 100,
      evRegs.length,
      evPresent,
      `${rate}%`,
      `"${ev.statusOverride || 'open'}"`,
      `"${(ev.organizingTeam?.facultyAdvisor || '').replace(/"/g, '""')}"`,
      `"${(ev.organizingTeam?.conductingLead || '').replace(/"/g, '""')}"`
    ]
    lines.push(row.join(','))
  })

  // Summary Totals Row
  lines.push(``)
  lines.push(`"TOTALS","${analytics.totalEvents} Events","","","","","","",,"${analytics.totalRegistrations}","${analytics.totalAttended}","${analytics.overallAttendanceRate}%"`)

  // Create UTF-8 BOM for seamless Excel compatibility
  const csvString = '\uFEFF' + lines.join('\r\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `CEH_Monthly_Events_Report_${displayPeriod.replace(/[^a-z0-9]+/gi, '_')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
