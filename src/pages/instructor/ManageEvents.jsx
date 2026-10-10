import React, { useState, useMemo } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getEnrollStatus, curatedPosterPresets } from '../../data/mockData'
import SearchInput from '../../components/SearchInput'
import Pagination from '../../components/Pagination'

export default function ManageEvents() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { events, addEvent, updateEvent, deleteEvent, updateEventStatus, setEventWinners, registrations, updateAttendance, clubs } = useData()

  const assignedClubName = user?.assignedClub || 'CSI'
  const assignedClub = clubs.find(c => c.name.toLowerCase() === assignedClubName.toLowerCase()) || clubs[0]

  // Filter events scoped strictly to this instructor's club
  const clubEvents = useMemo(() => {
    return events.filter(e => e.club.toLowerCase() === assignedClubName.toLowerCase())
  }, [events, assignedClubName])

  // Create Event Form State
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('Technical')
  const [date, setDate] = useState('Sep 10, 2026 · 10:00 AM')
  const [venue, setVenue] = useState('Main Innovation Auditorium')
  const [desc, setDesc] = useState('')
  const [capacity, setCapacity] = useState(100)
  const [teamEvent, setTeamEvent] = useState(false)
  const [teamSize, setTeamSize] = useState(4)
  const [statusOverride, setStatusOverride] = useState('open')
  const [accessLevel, setAccessLevel] = useState('public')
  const [venuePin, setVenuePin] = useState(() => `${Math.floor(1000 + Math.random() * 9000)}`)
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80')
  const [customPosterInput, setCustomPosterInput] = useState('')

  // Contestants Modal State
  const [selectedEventForContestants, setSelectedEventForContestants] = useState(null)
  const [contestantSearch, setContestantSearch] = useState('')
  const [attendanceFilter, setAttendanceFilter] = useState('all') // 'all', 'present', 'absent'

  // Poster Studio State & Generator
  const [posterStudioEvent, setPosterStudioEvent] = useState(null)
  const [posterTheme, setPosterTheme] = useState('indigo')
  const [posterHighlight, setPosterHighlight] = useState('₹50,000 Prizes · Mentorship Onsite · Certificates')

  // Winners Declaration Modal State
  const [selectedEventForWinners, setSelectedEventForWinners] = useState(null)
  const [winner1, setWinner1] = useState({ studentName: '', rollNo: '', dept: 'Computer Science', college: 'National Engineering College', award: '₹10,000 Cash Prize & Gold Trophy' })
  const [winner2, setWinner2] = useState({ studentName: '', rollNo: '', dept: 'Information Technology', college: 'National Engineering College', award: '₹5,000 Cash Prize & Silver Trophy' })
  const [winner3, setWinner3] = useState({ studentName: '', rollNo: '', dept: 'Electronics & Communication', college: 'National Engineering College', award: '₹2,500 Cash Prize & Bronze Trophy' })

  // Inline Create Form Winners State
  const [createWinner1, setCreateWinner1] = useState({ studentName: '', rollNo: '', dept: 'CSE', award: '₹25,000 Cash Prize & Gold Trophy' })
  const [createWinner2, setCreateWinner2] = useState({ studentName: '', rollNo: '', dept: 'CSE', award: '₹15,000 Cash Prize & Silver Trophy' })
  const [createWinner3, setCreateWinner3] = useState({ studentName: '', rollNo: '', dept: 'IT', award: '₹10,000 Cash Prize & Bronze Shield' })

  const handleOpenWinnersModal = (ev) => {
    setSelectedEventForWinners(ev)
    if (ev.winners && Array.isArray(ev.winners) && ev.winners.length > 0) {
      setWinner1(ev.winners[0] || { studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: 'First Prize 🥇' })
      setWinner2(ev.winners[1] || { studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: 'Second Prize 🥈' })
      setWinner3(ev.winners[2] || { studentName: '', rollNo: '', dept: 'IT', college: 'National Engineering College', award: 'Third Prize 🥉' })
    } else {
      const regs = registrations.filter(r => r.eventId === ev.id && r.attended)
      const fallbackRegs = registrations.filter(r => r.eventId === ev.id)
      const pool = regs.length >= 3 ? regs : fallbackRegs

      setWinner1({
        studentName: pool[0]?.studentName || '',
        rollNo: pool[0]?.rollNo || '',
        dept: pool[0]?.dept || 'CSE',
        college: 'National Engineering College',
        award: '₹10,000 Cash Prize & Gold Medal'
      })
      setWinner2({
        studentName: pool[1]?.studentName || '',
        rollNo: pool[1]?.rollNo || '',
        dept: pool[1]?.dept || 'CSE',
        college: 'National Engineering College',
        award: '₹5,000 Cash Prize & Silver Medal'
      })
      setWinner3({
        studentName: pool[2]?.studentName || '',
        rollNo: pool[2]?.rollNo || '',
        dept: pool[2]?.dept || 'IT',
        college: 'National Engineering College',
        award: '₹2,500 Cash Prize & Bronze Medal'
      })
    }
  }

  const handleSaveWinners = (e) => {
    e.preventDefault()
    if (!selectedEventForWinners) return
    if (!winner1.studentName.trim()) {
      showToast('Please specify at least the First Prize winner name.', 'error')
      return
    }

    const winnersList = [
      { ...winner1, prize: 'First Prize 🥇', position: 1 },
      { ...winner2, prize: 'Second Prize 🥈', position: 2 },
      { ...winner3, prize: 'Third Prize 🥉', position: 3 }
    ].filter(w => w.studentName && w.studentName.trim().length > 0)

    setEventWinners(selectedEventForWinners.id, winnersList)
    showToast(`🏆 Official results published for "${selectedEventForWinners.title}". Achievements article created and notification dispatched!`, 'success')
    setSelectedEventForWinners(null)
  }

  const createBrandedPosterSvg = (ev, theme = posterTheme, highlight = posterHighlight) => {
    const themes = {
      indigo: { bg1: '#1e1b4b', bg2: '#312e81', accent: '#818cf8', chip: '#4338ca' },
      purple: { bg1: '#2e1065', bg2: '#581c87', accent: '#c084fc', chip: '#7e22ce' },
      emerald: { bg1: '#064e3b', bg2: '#065f46', accent: '#34d399', chip: '#047857' },
      amber: { bg1: '#451a03', bg2: '#78350f', accent: '#fbbf24', chip: '#b45309' },
      crimson: { bg1: '#4c0519', bg2: '#881337', accent: '#fb7185', chip: '#be123c' }
    }
    const t = themes[theme] || themes.indigo
    const safeTitle = (ev?.title || 'CAMPUS EVENT').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeClub = (ev?.club || assignedClubName || 'CLUB').toUpperCase()
    const safeDate = (ev?.date || 'DATE TBD').replace(/&/g, '&amp;')
    const safeVenue = (ev?.venue || 'CAMPUS VENUE').replace(/&/g, '&amp;')
    const safeAdvisor = (user?.name || 'Faculty Advisor').replace(/&/g, '&amp;')
    const safePin = ev?.venuePin || '4821'

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="posterBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${t.bg1}" />
          <stop offset="100%" stop-color="${t.bg2}" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#posterBg)" />
      <circle cx="700" cy="100" r="180" fill="${t.accent}" opacity="0.15" />
      <circle cx="100" cy="900" r="220" fill="${t.accent}" opacity="0.1" />
      <rect x="40" y="40" width="720" height="920" fill="none" stroke="${t.accent}" stroke-width="2" stroke-opacity="0.3" rx="16" />
      <text x="70" y="90" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="${t.accent}" letter-spacing="3">CAMPUS EVENT HUB · OFFICIAL CHAPTER EVENT</text>
      <rect x="70" y="125" width="220" height="42" rx="8" fill="${t.chip}" />
      <text x="88" y="152" font-family="-apple-system, sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="1">🏛️ ${safeClub} CHAPTER</text>
      <text x="70" y="270" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#ffffff">
        <tspan x="70" dy="0">${safeTitle.slice(0, 32)}</tspan>
        ${safeTitle.length > 32 ? `<tspan x="70" dy="54">${safeTitle.slice(32, 64)}</tspan>` : ''}
      </text>
      <rect x="70" y="380" width="660" height="50" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" />
      <text x="95" y="412" font-family="-apple-system, sans-serif" font-size="16" font-weight="600" fill="${t.accent}">✨ ${highlight}</text>
      <rect x="70" y="460" width="660" height="220" rx="14" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.15)" />
      <text x="100" y="505" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="${t.accent}">SCHEDULED DATE &amp; TIME</text>
      <text x="100" y="535" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#ffffff">📅 ${safeDate}</text>
      <text x="100" y="595" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="${t.accent}">VENUE AUDITORIUM / HALL</text>
      <text x="100" y="625" font-family="-apple-system, sans-serif" font-size="20" font-weight="700" fill="#ffffff">📍 ${safeVenue}</text>
      <rect x="470" y="575" width="220" height="75" rx="10" fill="${t.chip}" />
      <text x="490" y="602" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="1">VENUE ATTENDANCE PIN</text>
      <text x="490" y="635" font-family="monospace" font-size="26" font-weight="900" fill="#ffffff" letter-spacing="4">${safePin}</text>
      <line x1="70" y1="750" x2="730" y2="750" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      <rect x="70" y="780" width="100" height="100" rx="12" fill="#ffffff" />
      <rect x="85" y="795" width="70" height="70" fill="#000000" rx="4" />
      <rect x="97" y="807" width="46" height="46" fill="#ffffff" rx="2" />
      <rect x="107" y="817" width="26" height="26" fill="#000000" rx="2" />
      <text x="190" y="815" font-family="-apple-system, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Lead Faculty Advisor:</text>
      <text x="190" y="840" font-family="-apple-system, sans-serif" font-size="18" font-weight="800" fill="${t.accent}">${safeAdvisor}</text>
      <text x="190" y="865" font-family="-apple-system, sans-serif" font-size="13" fill="#cbd5e1">Scan to register &amp; verify attendance on Campus Event Hub</text>
    </svg>`

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  }

  // Handle Image File Upload Preview
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Event title is required.', 'error')
      return
    }

    const initialWinners = statusOverride === 'completed' ? [
      { ...createWinner1, prize: 'First Prize 🥇', position: 1, college: 'National Engineering College' },
      { ...createWinner2, prize: 'Second Prize 🥈', position: 2, college: 'National Engineering College' },
      { ...createWinner3, prize: 'Third Prize 🥉', position: 3, college: 'National Engineering College' }
    ].filter(w => w.studentName && w.studentName.trim().length > 0) : []

    addEvent({
      title: title.trim(),
      club: assignedClubName,
      tag,
      date,
      venue,
      desc: desc.trim() || `Official ${assignedClubName} session and hands-on conduction.`,
      capacity: Number(capacity),
      teamEvent,
      teamSize: Number(teamSize),
      statusOverride,
      status: statusOverride === 'completed' ? 'completed' : 'upcoming',
      winners: initialWinners,
      accessLevel,
      venuePin: venuePin || `${Math.floor(1000 + Math.random() * 9000)}`,
      coverImage: posterUrl,
      posterUrl: posterUrl,
      organizingTeam: {
        facultyAdvisor: `${user?.name || 'Faculty Advisor'} (${user?.dept || 'CSE'})`,
        conductingLead: assignedClub?.studentTeam?.[0]?.name ? `${assignedClub.studentTeam[0].name} (Conducting Lead)` : "Student Conducting Lead",
        eventManager: assignedClub?.studentTeam?.[1]?.name ? `${assignedClub.studentTeam[1].name} (Operations & Attendance)` : "Event Operations Manager"
      },
      conductingInstructorId: user?.id,
      conductingInstructorName: user?.name,
      enrollStart: new Date().toISOString(),
      enrollEnd: new Date(Date.now() + 86400000 * 10).toISOString()
    })

    if (statusOverride === 'completed' && initialWinners.length > 0) {
      showToast(`🏆 Event "${title.trim()}" published as Completed with winners declared!`, 'success')
    } else {
      showToast(`Event "${title.trim()}" scheduled successfully!`, 'success')
    }

    setTitle('')
    setDesc('')
    setVenuePin(`${Math.floor(1000 + Math.random() * 9000)}`)
    setCreateWinner1({ studentName: '', rollNo: '', dept: 'CSE', award: '₹25,000 Cash Prize & Gold Trophy' })
    setCreateWinner2({ studentName: '', rollNo: '', dept: 'CSE', award: '₹15,000 Cash Prize & Silver Trophy' })
    setCreateWinner3({ studentName: '', rollNo: '', dept: 'IT', award: '₹10,000 Cash Prize & Bronze Shield' })
    setShowForm(false)
  }

  // Registered contestants for the active modal event
  const activeEventRegistrations = useMemo(() => {
    if (!selectedEventForContestants) return []
    return registrations.filter(r => r.eventId === selectedEventForContestants.id)
  }, [registrations, selectedEventForContestants])

  const filteredContestants = useMemo(() => {
    return activeEventRegistrations.filter(r => {
      const q = contestantSearch.toLowerCase()
      const matchesQuery = (r.studentName || '').toLowerCase().includes(q) ||
        (r.rollNo || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q) ||
        (r.team || '').toLowerCase().includes(q) ||
        (r.dept || '').toLowerCase().includes(q)

      const matchesAttendance = attendanceFilter === 'all' ||
        (attendanceFilter === 'present' && r.attended) ||
        (attendanceFilter === 'absent' && !r.attended)

      return matchesQuery && matchesAttendance
    })
  }, [activeEventRegistrations, contestantSearch, attendanceFilter])

  // Event Search, Filter, Sort, Pagination State
  const [eventSearch, setEventSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [eventSort, setEventSort] = useState('date_desc')
  const [eventPage, setEventPage] = useState(1)
  const [eventPageSize, setEventPageSize] = useState(5)

  // Contestant Pagination State
  const [contestantPage, setContestantPage] = useState(1)
  const [contestantPageSize, setContestantPageSize] = useState(10)

  const processedClubEvents = useMemo(() => {
    let list = clubEvents.filter(e => {
      if (eventSearch.trim()) {
        const q = eventSearch.toLowerCase()
        const m = (e.title || '').toLowerCase().includes(q) ||
                  (e.venue || '').toLowerCase().includes(q) ||
                  (e.tag || '').toLowerCase().includes(q) ||
                  (e.desc || '').toLowerCase().includes(q)
        if (!m) return false
      }
      if (eventFilter !== 'all' && (e.tag || '').toLowerCase() !== eventFilter.toLowerCase()) {
        return false
      }
      return true
    })

    if (eventSort === 'date_asc') {
      list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
    } else if (eventSort === 'date_desc') {
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    } else if (eventSort === 'name_asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (eventSort === 'attendees_desc') {
      list.sort((a, b) => (b.registered || 0) - (a.registered || 0))
    }
    return list
  }, [clubEvents, eventSearch, eventFilter, eventSort])

  const totalClubEvents = processedClubEvents.length
  const totalClubPages = Math.ceil(totalClubEvents / eventPageSize) || 1
  const paginatedClubEvents = useMemo(() => {
    const s = (eventPage - 1) * eventPageSize
    return processedClubEvents.slice(s, s + eventPageSize)
  }, [processedClubEvents, eventPage, eventPageSize])

  const totalContestants = filteredContestants.length
  const totalContestantPages = Math.ceil(totalContestants / contestantPageSize) || 1
  const paginatedContestants = useMemo(() => {
    const s = (contestantPage - 1) * contestantPageSize
    return filteredContestants.slice(s, s + contestantPageSize)
  }, [filteredContestants, contestantPage, contestantPageSize])

  // Export Contestants to CSV
  const handleExportCSV = (ev) => {
    const list = registrations.filter(r => r.eventId === ev.id)
    if (list.length === 0) {
      alert('No contestants registered yet for this event.')
      return
    }

    const headers = ['Registration ID', 'Student Name', 'Roll Number', 'Department', 'Year', 'Email', 'Team Name', 'Club Member', 'Attendance Status', 'Check-in Time', 'Method']
    const rows = list.map(r => [
      r.id,
      `"${r.studentName}"`,
      r.rollNo || 'N/A',
      r.dept || 'N/A',
      r.year || 'N/A',
      r.email || 'N/A',
      `"${r.team || 'Individual'}"`,
      r.isClubMember ? 'Yes' : 'No',
      r.attended ? 'PRESENT' : 'ABSENT',
      r.attendedAt || 'N/A',
      r.checkinMethod || 'N/A'
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${ev.club}_${ev.title.replace(/[^a-z0-9]+/gi, '_')}_Contestants.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export Contestants Roster to Formatted Printable PDF Sheet
  const handleExportPDF = (ev) => {
    const list = registrations.filter(r => r.eventId === ev.id)
    const present = list.filter(r => r.attended).length
    const total = list.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${ev.title} - Contestant Attendance Roster</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #111; }
          .header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 22px; font-weight: bold; margin: 0; color: #1e1b4b; }
          .subtitle { font-size: 13px; color: #555; margin-top: 4px; }
          .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; }
          .stat-box { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11.5px; }
          th { background: #1e1b4b; color: #fff; text-align: left; padding: 8px 10px; font-weight: 600; }
          td { border-bottom: 1px solid #e2e8f0; padding: 8px 10px; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge-present { color: #166534; font-weight: bold; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
          .badge-absent { color: #991b1b; font-weight: bold; background: #fee2e2; padding: 2px 6px; border-radius: 4px; }
          .signatures { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; padding-top: 20px; }
          .sig-line { width: 220px; border-top: 1px solid #333; text-align: center; padding-top: 6px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="text-align: right; margin-bottom: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #4338ca; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; font-weight: bold;">
              ${ev.club} Chapter · Official Event Conduction Dossier
            </div>
            <h1 class="title">${ev.title}</h1>
            <div class="subtitle">Audience: ${['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel) ? '🔒 Restricted Club Members' : '🌐 Public Campus'} · Venue PIN: <b>${ev.venuePin || '4821'}</b></div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #555;">
            <div><b>Date:</b> ${ev.date}</div>
            <div><b>Venue:</b> ${ev.venue}</div>
            <div><b>Faculty Lead:</b> ${user?.name || 'Dr. K. Ramanathan'}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div><div class="stat-box">Total Registered</div><div>${total} Contestants</div></div>
          <div><div class="stat-box" style="color: #166534;">Verified Present</div><div>${present} Students</div></div>
          <div><div class="stat-box" style="color: #991b1b;">Absent</div><div>${total - present} Students</div></div>
          <div><div class="stat-box" style="color: #4338ca;">Attendance Rate</div><div>${rate}% Verified</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Reg ID</th>
              <th>Contestant Name</th>
              <th>Roll No</th>
              <th>Dept & Year</th>
              <th>Team Name</th>
              <th>Club Member</th>
              <th>Attendance</th>
              <th>Verified At</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((r, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><b>${r.id}</b></td>
                <td><b>${r.studentName}</b></td>
                <td>${r.rollNo || '23CS082'}</td>
                <td>${r.dept || 'CSE'} (${r.year || '3rd Yr'})</td>
                <td>${r.team || '—'}</td>
                <td>${r.isClubMember ? '✓ Member' : 'Non-Member'}</td>
                <td><span class="${r.attended ? 'badge-present' : 'badge-absent'}">${r.attended ? '✓ PRESENT' : '✕ ABSENT'}</span></td>
                <td>${r.attendedAt ? r.attendedAt : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-line">
            <div><b>Student Conducting Lead</b></div>
            <div style="font-size: 11px; color: #666;">Event Operations Committee</div>
          </div>
          <div class="sig-line">
            <div><b>${user?.name || 'Faculty Advisor'}</b></div>
            <div style="font-size: 11px; color: #666;">Lead Faculty Advisor (${ev.club})</div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <DashboardLayout role="instructor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Manage {assignedClubName} Events & Conduction</h1>
            <span className="badge tag-amber">{assignedClubName} Advisor Session</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Schedule new sessions with posters, configure Members-Only access, oversee live attendance, and export contestant dossiers.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close Scheduling Form' : '+ Schedule New Event'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SCHEDULE EVENT FORM WITH POSTER UPLOAD & MEMBERS-ONLY TOGGLE */}
      {/* ========================================================================= */}
      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 24, marginBottom: 24, background: 'var(--card)', border: '2px solid var(--indigo)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, margin: 0 }}>Schedule New {assignedClubName} Event</h3>
            <span className="badge tag-indigo">Host: {assignedClub.fullName || assignedClub.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 16 }}>
            <div>
              <div className="field">
                <label>Event Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. AI & Cloud Architecture Masterclass 2026"
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Audience Access Level *</label>
                  <select
                    value={accessLevel}
                    onChange={e => setAccessLevel(e.target.value)}
                    style={{ fontWeight: 700, color: ['members_only', 'membership_only', 'club_specific'].includes(accessLevel) ? 'var(--purple)' : 'var(--green)' }}
                  >
                    <option value="public">🌐 Public (Everyone)</option>
                    <option value="college_wide">🏫 College-wide (Signed-in users)</option>
                    <option value="membership_only">🔒 Membership-only ({assignedClubName})</option>
                    <option value="club_specific">🏛️ Club-specific ({assignedClubName})</option>
                  </select>
                </div>

                <div className="field">
                  <label>Category *</label>
                  <select value={tag} onChange={e => setTag(e.target.value)}>
                    <option>Technical</option>
                    <option>Cultural</option>
                    <option>Sports</option>
                    <option>Wellness</option>
                    <option>Service</option>
                    <option>Uniformed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Date & Time String *</label>
                  <input
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="e.g. Sep 10, 2026 · 10:00 AM"
                  />
                </div>
                <div className="field">
                  <label>Venue / Hall *</label>
                  <input
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Main Innovation Auditorium"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Initial Status *</label>
                  <select value={statusOverride} onChange={e => setStatusOverride(e.target.value)}>
                    <option value="open">🟢 Open for Registration</option>
                    <option value="active_conduction">⚡ Live Conduction Active</option>
                    <option value="upcoming">🟡 Upcoming (Opens Later)</option>
                    <option value="completed">🏆 Completed (Conclude & Declare Winners)</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>
                <div className="field">
                  <label>Capacity (Max Seats)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Venue Attendance PIN (4-Digit)</label>
                  <input
                    className="mono"
                    value={venuePin}
                    maxLength={4}
                    onChange={e => setVenuePin(e.target.value)}
                    placeholder="e.g. 4821"
                    style={{ fontWeight: 700, color: 'var(--indigo)' }}
                  />
                </div>
              </div>
            </div>

            {/* Event Poster Upload & Preview Panel */}
            <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8 }}>
                🖼️ Event Poster / Cover Image
              </label>

              <div style={{ width: '100%', height: 130, borderRadius: 8, overflow: 'hidden', marginBottom: 10, background: '#e2e8f0' }}>
                <img src={posterUrl} alt="Poster preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                Upload Local File:
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ fontSize: 11, width: '100%', marginBottom: 10 }}
              />

              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                Or Pick Curated Preset:
              </div>
              <select
                onChange={e => { if (e.target.value) setPosterUrl(e.target.value) }}
                style={{ width: '100%', fontSize: 11.5, padding: '4px 6px', marginBottom: 8 }}
              >
                <option value="">-- Choose Poster Preset --</option>
                {curatedPosterPresets.map((p, i) => (
                  <option key={i} value={p.url}>{p.label}</option>
                ))}
              </select>

              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                Or Custom Image URL:
              </div>
              <input
                value={customPosterInput}
                onChange={e => {
                  setCustomPosterInput(e.target.value)
                  if (e.target.value) setPosterUrl(e.target.value)
                }}
                placeholder="https://..."
                style={{ width: '100%', fontSize: 11, padding: '4px 6px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={teamEvent}
                  onChange={e => setTeamEvent(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span>Team Event (Max {teamSize} Members)</span>
              </label>
            </div>
            {teamEvent && (
              <div className="field">
                <label>Max Team Size</label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="field">
            <label>Event Description & Agenda</label>
            <textarea
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Provide agenda, prerequisites, kit availability, and key faculty/student mentors..."
            />
          </div>

          {/* Inline Publish Winners Section when adding a Completed Event */}
          {statusOverride === 'completed' && (
            <div style={{ marginTop: 14, padding: 18, background: 'var(--amber-soft)', borderRadius: 12, border: '1.5px solid var(--amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🏆</span>
                  <span>Publish Winners at the Bottom of This Completed Event:</span>
                </div>
                <span className="badge" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 800 }}>Certified Honors</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#854d0e', marginBottom: 6 }}>🥇 First Prize Winner</div>
                  <input
                    value={createWinner1.studentName}
                    onChange={e => setCreateWinner1({ ...createWinner1, studentName: e.target.value })}
                    placeholder="Student Name (e.g. Rahul K.)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner1.rollNo}
                    onChange={e => setCreateWinner1({ ...createWinner1, rollNo: e.target.value })}
                    placeholder="Roll No (e.g. 22CS104)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner1.award}
                    onChange={e => setCreateWinner1({ ...createWinner1, award: e.target.value })}
                    placeholder="Award & Prize"
                    style={{ fontSize: 12 }}
                  />
                </div>

                <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6 }}>🥈 Second Prize Winner</div>
                  <input
                    value={createWinner2.studentName}
                    onChange={e => setCreateWinner2({ ...createWinner2, studentName: e.target.value })}
                    placeholder="Student Name (e.g. Ananya Rao)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner2.rollNo}
                    onChange={e => setCreateWinner2({ ...createWinner2, rollNo: e.target.value })}
                    placeholder="Roll No (e.g. 23CS082)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner2.award}
                    onChange={e => setCreateWinner2({ ...createWinner2, award: e.target.value })}
                    placeholder="Award & Prize"
                    style={{ fontSize: 12 }}
                  />
                </div>

                <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#9a3412', marginBottom: 6 }}>🥉 Third Prize Winner</div>
                  <input
                    value={createWinner3.studentName}
                    onChange={e => setCreateWinner3({ ...createWinner3, studentName: e.target.value })}
                    placeholder="Student Name (e.g. Vikram S.)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner3.rollNo}
                    onChange={e => setCreateWinner3({ ...createWinner3, rollNo: e.target.value })}
                    placeholder="Roll No (e.g. 22IT045)"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  />
                  <input
                    value={createWinner3.award}
                    onChange={e => setCreateWinner3({ ...createWinner3, award: e.target.value })}
                    placeholder="Award & Prize"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">
              {statusOverride === 'completed' ? '🏆 Schedule & Publish Completed Event' : 'Schedule & Publish Event'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* EVENTS TABLE WITH CONTESTANTS & ATTENDANCE ACTION */}
      {/* ========================================================================= */}
      {/* Search, Filter & Sort Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <SearchInput
          value={eventSearch}
          onChange={val => {
            setEventSearch(val)
            setEventPage(1)
          }}
          placeholder="Search club events by title, venue, tag..."
          style={{ flex: 1, minWidth: 260 }}
        />

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={eventFilter}
            onChange={e => {
              setEventFilter(e.target.value)
              setEventPage(1)
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--ink)',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <option value="all">All Tags / Categories</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Cultural">Cultural</option>
            <option value="Design">Design</option>
          </select>

          <select
            value={eventSort}
            onChange={e => {
              setEventSort(e.target.value)
              setEventPage(1)
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--ink)',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <option value="date_desc">📅 Date (Newest first)</option>
            <option value="date_asc">📅 Date (Oldest first)</option>
            <option value="name_asc">🔤 Title (A–Z)</option>
            <option value="attendees_desc">👥 Attendees (High to Low)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {processedClubEvents.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-soft)' }}>
            {clubEvents.length === 0
              ? `No events scheduled for ${assignedClubName} chapter yet. Click "+ Schedule New Event" above to create one!`
              : `No events matching "${eventSearch}" or tag filter. Try adjusting your search query.`}
          </div>
        ) : (
          paginatedClubEvents.map(ev => {
            const status = getEnrollStatus(ev)
            const evRegs = registrations.filter(r => r.eventId === ev.id)
            const evPresent = evRegs.filter(r => r.attended).length

            return (
              <div className="card" key={ev.id} style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    {/* Poster thumbnail */}
                    <div style={{ width: 88, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <img src={ev.posterUrl || ev.coverImage} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 17, margin: 0 }}>{ev.title}</h3>
                        <span className={`badge ${ev.tagClass}`}>{ev.club}</span>
                        <span className="badge tag-slate">{ev.tag}</span>
                        {['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel) ? (
                          <span className="badge tag-purple" title="Only approved club members can view and enroll">
                            🔒 Members Only
                          </span>
                        ) : (
                          <span className="badge tag-green" title="Open to all students across campus">
                            🌐 Public Event
                          </span>
                        )}
                      </div>

                      <div className="muted mono" style={{ fontSize: 12, marginBottom: 6 }}>
                        📅 {ev.date} · 📍 {ev.venue} · 📌 PIN: <b style={{ color: 'var(--indigo)' }}>{ev.venuePin || '4821'}</b>
                      </div>

                      <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
                        Manager: <b>{ev.organizingTeam?.eventManager || 'Unassigned'}</b> · Conducting Instructor: <b>{ev.conductingInstructorName || ev.organizingTeam?.facultyAdvisor || 'Unassigned'}</b>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                        <span>
                          👥 <b>{evRegs.length}</b> Registered / {ev.capacity || 100} Spots
                        </span>
                        <span>
                          ✓ <b>{evPresent}</b> Attended ({evRegs.length > 0 ? Math.round((evPresent / evRegs.length) * 100) : 0}%)
                        </span>
                      </div>

                      {ev.winners && Array.isArray(ev.winners) && ev.winners.length > 0 && (
                        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--amber-soft)', borderRadius: 8, border: '1px solid var(--amber)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 11.5 }}>
                          <span style={{ fontWeight: 700, color: 'var(--amber)' }}>🏆 Official Winners:</span>
                          {ev.winners.map((w, idx) => (
                            <span key={idx} style={{ background: 'var(--card)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                              <b>{w.studentName}</b>
                              <span className="muted">({w.rollNo || w.dept})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Switcher */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)' }}>Status:</span>
                      <select
                        value={ev.statusOverride || (status.state === 'open' ? 'open' : status.state)}
                        onChange={e => updateEventStatus(ev.id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          fontSize: 12,
                          fontWeight: 700,
                          background: (ev.statusOverride === 'completed' || ev.status === 'completed') ? 'var(--amber-soft)' : ev.statusOverride === 'active_conduction' ? 'var(--indigo-soft)' : ev.statusOverride === 'open' ? 'var(--green-soft)' : ev.statusOverride === 'upcoming' ? 'var(--amber-soft)' : 'var(--danger-soft)',
                          color: (ev.statusOverride === 'completed' || ev.status === 'completed') ? 'var(--amber)' : ev.statusOverride === 'active_conduction' ? 'var(--indigo)' : ev.statusOverride === 'open' ? 'var(--green)' : ev.statusOverride === 'upcoming' ? 'var(--amber)' : 'var(--danger)'
                        }}
                      >
                        <option value="open">🟢 Open for Registration</option>
                        <option value="active_conduction">⚡ Live Conduction Active</option>
                        <option value="upcoming">🟡 Upcoming</option>
                        <option value="completed">🏆 Completed (Results Declared)</option>
                        <option value="closed">🔴 Closed</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          fontSize: 12,
                          padding: '6px 12px',
                          background: (ev.status === 'completed' || ev.statusOverride === 'completed' || (ev.winners && ev.winners.length > 0)) ? 'var(--amber-soft)' : 'var(--bg)',
                          color: 'var(--amber)',
                          border: '1px solid var(--amber)',
                          fontWeight: 700
                        }}
                        onClick={() => handleOpenWinnersModal(ev)}
                        title="Declare or edit official winners for this event"
                      >
                        🏆 {(ev.status === 'completed' || (ev.winners && ev.winners.length > 0)) ? 'Edit Winners' : 'Declare Winners'}
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                        onClick={() => {
                          setSelectedEventForContestants(ev)
                          setContestantSearch('')
                          setAttendanceFilter('all')
                          setContestantPage(1)
                        }}
                      >
                        👥 Contestants & Attendance ({evRegs.length})
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 12, padding: '6px 10px', color: 'var(--purple)', borderColor: 'var(--purple)' }}
                        onClick={() => {
                          setPosterStudioEvent(ev)
                          setPosterHighlight(ev.desc ? ev.desc.slice(0, 48) + '...' : 'Interactive Hands-on Conduction · Certificates')
                        }}
                        title="Auto-generate and customize official graphic event poster"
                      >
                        🎨 Poster Studio
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 12, padding: '6px 10px' }}
                        onClick={() => handleExportPDF(ev)}
                        title="Generate and print official contestant attendance sheet"
                      >
                        📄 Export PDF
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 12, padding: '6px 10px' }}
                        onClick={() => handleExportCSV(ev)}
                        title="Export contestant data as CSV / Excel"
                      >
                        📊 Excel (CSV)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalClubEvents > eventPageSize && (
        <div style={{ marginTop: 16 }}>
          <Pagination
            page={eventPage}
            totalPages={totalClubPages}
            totalItems={totalClubEvents}
            pageSize={eventPageSize}
            onPageChange={setEventPage}
            onPageSizeChange={size => {
              setEventPageSize(size)
              setEventPage(1)
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTESTANTS ROSTER & ATTENDANCE MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {selectedEventForContestants && (
        <div className="modal-backdrop" onClick={() => setSelectedEventForContestants(null)}>
          <div
            className="card"
            style={{ maxWidth: 880, width: '100%', padding: 26, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 20, margin: 0 }}>Registered Contestants & Attendance</h2>
                  <span className={`badge ${selectedEventForContestants.tagClass}`}>{selectedEventForContestants.club}</span>
                  {['members_only', 'membership_only', 'club_specific'].includes(selectedEventForContestants.accessLevel) && (
                    <span className="badge tag-purple">🔒 Members Only</span>
                  )}
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Event: <b>{selectedEventForContestants.title}</b> · 📅 {selectedEventForContestants.date} · 📍 {selectedEventForContestants.venue}
                </div>
              </div>

              <button
                onClick={() => setSelectedEventForContestants(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            {/* Attendance Metrics & Venue PIN Strip */}
            <div className="stat-strip" style={{ margin: '0 0 18px', padding: '12px 0' }}>
              <div>
                <div className="stat-num">{totalCount}</div>
                <div className="stat-label">Registered Students</div>
              </div>
              <div>
                <div className="stat-num" style={{ color: 'var(--green)' }}>{presentCount}</div>
                <div className="stat-label">Checked-In / Present</div>
              </div>
              <div>
                <div className="stat-num" style={{ color: 'var(--indigo)' }}>{attendanceRate}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
              <div>
                <div className="stat-num mono" style={{ color: 'var(--amber)' }}>
                  {selectedEventForContestants.venuePin || '4821'}
                </div>
                <div className="stat-label">Venue Self-Checkin PIN</div>
              </div>
            </div>

            {/* Search, Filter & Export Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
                <input
                  placeholder="Search student name, roll no, team, reg ID..."
                  value={contestantSearch}
                  onChange={e => {
                    setContestantSearch(e.target.value)
                    setContestantPage(1)
                  }}
                  style={{ width: '100%', padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  value={attendanceFilter}
                  onChange={e => {
                    setAttendanceFilter(e.target.value)
                    setContestantPage(1)
                  }}
                  style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12.5 }}
                >
                  <option value="all">All Contestants ({totalCount})</option>
                  <option value="present">Present Only ({presentCount})</option>
                  <option value="absent">Absent Only ({totalCount - presentCount})</option>
                </select>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleExportPDF(selectedEventForContestants)}
                >
                  📄 Export PDF
                </button>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleExportCSV(selectedEventForContestants)}
                >
                  📊 CSV
                </button>
              </div>
            </div>

            {/* Contestant Table */}
            {filteredContestants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--ink-soft)' }}>
                No contestants matching the search or filter criteria.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Reg ID</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Student Name & Roll</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Dept / Year</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Team</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Member</th>
                      <th style={{ textAlign: 'center', padding: '10px 8px' }}>Attendance Status</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContestants.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="mono" style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--indigo)' }}>
                          #{r.id}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ fontWeight: 700 }}>{r.studentName}</div>
                          <div className="muted mono" style={{ fontSize: 11 }}>{r.rollNo || '23CS082'}</div>
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <div>{r.dept || 'CSE'}</div>
                          <div className="muted" style={{ fontSize: 11 }}>{r.year || '3rd Year'}</div>
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          {r.team ? <span className="badge tag-indigo" style={{ fontSize: 10.5 }}>{r.team}</span> : <span className="muted">—</span>}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          {r.isClubMember ? (
                            <span className="badge tag-green" style={{ fontSize: 10 }}>✓ Member</span>
                          ) : (
                            <span className="badge tag-slate" style={{ fontSize: 10 }}>Non-member</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          {r.attended ? (
                            <div>
                              <span className="badge badge-approved" style={{ fontSize: 11 }}>
                                ✓ Present
                              </span>
                              {r.attendedAt && <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{r.attendedAt}</div>}
                            </div>
                          ) : (
                            <span className="badge badge-denied" style={{ fontSize: 11 }}>
                              ✕ Absent
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                          <button
                            className={`btn btn-sm ${r.attended ? 'btn-outline' : 'btn-primary'}`}
                            style={{ fontSize: 11, padding: '4px 10px' }}
                            onClick={() => updateAttendance(r.id, !r.attended, 'Advisor Marked')}
                          >
                            {r.attended ? 'Mark Absent' : 'Mark Present'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalContestants > contestantPageSize && (
              <div style={{ marginTop: 14 }}>
                <Pagination
                  page={contestantPage}
                  totalPages={totalContestantPages}
                  totalItems={totalContestants}
                  pageSize={contestantPageSize}
                  onPageChange={setContestantPage}
                  onPageSizeChange={size => {
                    setContestantPageSize(size)
                    setContestantPage(1)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EVENT POSTER GENERATOR STUDIO MODAL */}
      {/* ========================================================================= */}
      {posterStudioEvent && (
        <div className="modal-backdrop" onClick={() => setPosterStudioEvent(null)}>
          <div
            className="card"
            style={{ maxWidth: 840, width: '100%', padding: 26, maxHeight: '92vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🎨</span>
                <h2 style={{ fontSize: 20, margin: 0 }}>Event Poster Studio & Generator</h2>
                <span className="badge tag-purple">{posterStudioEvent.club} Chapter</span>
              </div>
              <button
                onClick={() => setPosterStudioEvent(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 20, alignItems: 'flex-start' }}>
              {/* Controls */}
              <div>
                <div className="field">
                  <label>Event Headline</label>
                  <input
                    value={posterStudioEvent.title}
                    readOnly
                    style={{ background: 'var(--bg)', fontWeight: 700 }}
                  />
                </div>

                <div className="field">
                  <label>Poster Theme Palette</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {[
                      { id: 'indigo', label: 'Indigo Tech', color: '#4338ca' },
                      { id: 'purple', label: 'Royal Purple', color: '#7c3aed' },
                      { id: 'emerald', label: 'Emerald Eco', color: '#059669' },
                      { id: 'amber', label: 'Amber Gold', color: '#d97706' },
                      { id: 'crimson', label: 'Crimson Fest', color: '#e11d48' }
                    ].map(pal => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setPosterTheme(pal.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: posterTheme === pal.id ? `2px solid ${pal.color}` : '1px solid var(--border)',
                          background: posterTheme === pal.id ? 'var(--bg)' : 'var(--card)',
                          color: 'var(--ink)',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: posterTheme === pal.id ? 700 : 500
                        }}
                      >
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: pal.color }} />
                        {pal.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Feature Highlight Badge / Perks</label>
                  <input
                    value={posterHighlight}
                    onChange={e => setPosterHighlight(e.target.value)}
                    placeholder="e.g. ₹50,000 Prizes · Mentorship Onsite · Certificates"
                  />
                </div>

                <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16, fontSize: 12 }}>
                  <div><b>Faculty Endorsement:</b> {user?.name || 'Faculty Advisor'}</div>
                  <div><b>Audience:</b> {['members_only', 'membership_only', 'club_specific'].includes(posterStudioEvent.accessLevel) ? 'Restricted Club Members' : 'Public Campus'}</div>
                  <div><b>Venue PIN:</b> <code style={{ fontWeight: 700 }}>{posterStudioEvent.venuePin || '4821'}</code></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const dataUrl = createBrandedPosterSvg(posterStudioEvent, posterTheme, posterHighlight)
                      updateEvent(posterStudioEvent.id, { posterUrl: dataUrl, coverImage: dataUrl })
                      setPosterStudioEvent(null)
                    }}
                  >
                    ✓ Apply This Poster to Event & Publish
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      const dataUrl = createBrandedPosterSvg(posterStudioEvent, posterTheme, posterHighlight)
                      const w = window.open('')
                      if (w) {
                        w.document.write(`<img src="${dataUrl}" style="max-width:100%; height:auto;" /><script>window.print();</script>`)
                        w.document.close()
                      }
                    }}
                  >
                    🖨️ Print / Download High-Res Poster Flyer
                  </button>
                </div>
              </div>

              {/* Live Poster Graphic Preview */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <img
                  src={createBrandedPosterSvg(posterStudioEvent, posterTheme, posterHighlight)}
                  alt="Live generated poster preview"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EVENT WINNERS DECLARATION MODAL */}
      {/* ========================================================================= */}
      {selectedEventForWinners && (
        <div className="modal-backdrop" onClick={() => setSelectedEventForWinners(null)}>
          <div
            className="card"
            style={{ maxWidth: 760, width: '100%', padding: 26, maxHeight: '92vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 24 }}>🏆</span>
                  <h2 style={{ fontSize: 20, margin: 0 }}>Declare & Publish Event Winners</h2>
                  <span className="badge tag-amber">Official Laurels</span>
                </div>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  Event: <b>{selectedEventForWinners.title}</b> · Results will automatically transition event to <b>Completed</b> status, post victory laurels to the <b>Achievements feed</b>, and display winner cards on the event page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventForWinners(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWinners}>
              {/* Quick Select from Registered Contestants helper */}
              {registrations.filter(r => r.eventId === selectedEventForWinners.id).length > 0 && (
                <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 18, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    💡 Quick Fill from Registered Attendees ({registrations.filter(r => r.eventId === selectedEventForWinners.id).length} registered):
                  </div>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    You can type student details manually or select from the drop-down below to autofill each prize tier.
                  </div>
                </div>
              )}

              {/* 🥇 FIRST PRIZE CARD */}
              <div style={{ background: 'var(--card)', border: '2px solid rgba(245, 158, 11, 0.4)', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>🥇</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--amber)' }}>First Prize Winner</span>
                  </div>
                  {registrations.filter(r => r.eventId === selectedEventForWinners.id).length > 0 && (
                    <select
                      onChange={e => {
                        const reg = registrations.find(r => r.id === Number(e.target.value))
                        if (reg) setWinner1(prev => ({ ...prev, studentName: reg.studentName, rollNo: reg.rollNo || '', dept: reg.dept || 'CSE' }))
                      }}
                      style={{ fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}
                    >
                      <option value="">-- Autofill from Attendee --</option>
                      {registrations.filter(r => r.eventId === selectedEventForWinners.id).map(r => (
                        <option key={r.id} value={r.id}>{r.studentName} ({r.rollNo || r.dept})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Student Full Name *</label>
                    <input
                      required
                      value={winner1.studentName}
                      onChange={e => setWinner1({ ...winner1, studentName: e.target.value })}
                      placeholder="e.g. Swathi R"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Register / Roll Number</label>
                    <input
                      value={winner1.rollNo}
                      onChange={e => setWinner1({ ...winner1, rollNo: e.target.value })}
                      placeholder="e.g. 23CS104"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Department</label>
                    <input
                      value={winner1.dept}
                      onChange={e => setWinner1({ ...winner1, dept: e.target.value })}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>College / Institution</label>
                    <input
                      value={winner1.college}
                      onChange={e => setWinner1({ ...winner1, college: e.target.value })}
                      placeholder="e.g. National Engineering College"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Award / Prize Description</label>
                    <input
                      value={winner1.award}
                      onChange={e => setWinner1({ ...winner1, award: e.target.value })}
                      placeholder="e.g. ₹10,000 Cash & Gold Medal"
                    />
                  </div>
                </div>
              </div>

              {/* 🥈 SECOND PRIZE CARD */}
              <div style={{ background: 'var(--card)', border: '2px solid rgba(148, 163, 184, 0.4)', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>🥈</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>Second Prize Winner</span>
                  </div>
                  {registrations.filter(r => r.eventId === selectedEventForWinners.id).length > 0 && (
                    <select
                      onChange={e => {
                        const reg = registrations.find(r => r.id === Number(e.target.value))
                        if (reg) setWinner2(prev => ({ ...prev, studentName: reg.studentName, rollNo: reg.rollNo || '', dept: reg.dept || 'CSE' }))
                      }}
                      style={{ fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}
                    >
                      <option value="">-- Autofill from Attendee --</option>
                      {registrations.filter(r => r.eventId === selectedEventForWinners.id).map(r => (
                        <option key={r.id} value={r.id}>{r.studentName} ({r.rollNo || r.dept})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Student Full Name</label>
                    <input
                      value={winner2.studentName}
                      onChange={e => setWinner2({ ...winner2, studentName: e.target.value })}
                      placeholder="e.g. Karthik S"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Register / Roll Number</label>
                    <input
                      value={winner2.rollNo}
                      onChange={e => setWinner2({ ...winner2, rollNo: e.target.value })}
                      placeholder="e.g. 23IT044"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Department</label>
                    <input
                      value={winner2.dept}
                      onChange={e => setWinner2({ ...winner2, dept: e.target.value })}
                      placeholder="e.g. Information Technology"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>College / Institution</label>
                    <input
                      value={winner2.college}
                      onChange={e => setWinner2({ ...winner2, college: e.target.value })}
                      placeholder="e.g. National Engineering College"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Award / Prize Description</label>
                    <input
                      value={winner2.award}
                      onChange={e => setWinner2({ ...winner2, award: e.target.value })}
                      placeholder="e.g. ₹5,000 Cash & Silver Medal"
                    />
                  </div>
                </div>
              </div>

              {/* 🥉 THIRD PRIZE CARD */}
              <div style={{ background: 'var(--card)', border: '2px solid rgba(202, 138, 4, 0.3)', borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>🥉</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#b45309' }}>Third Prize Winner</span>
                  </div>
                  {registrations.filter(r => r.eventId === selectedEventForWinners.id).length > 0 && (
                    <select
                      onChange={e => {
                        const reg = registrations.find(r => r.id === Number(e.target.value))
                        if (reg) setWinner3(prev => ({ ...prev, studentName: reg.studentName, rollNo: reg.rollNo || '', dept: reg.dept || 'ECE' }))
                      }}
                      style={{ fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}
                    >
                      <option value="">-- Autofill from Attendee --</option>
                      {registrations.filter(r => r.eventId === selectedEventForWinners.id).map(r => (
                        <option key={r.id} value={r.id}>{r.studentName} ({r.rollNo || r.dept})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Student Full Name</label>
                    <input
                      value={winner3.studentName}
                      onChange={e => setWinner3({ ...winner3, studentName: e.target.value })}
                      placeholder="e.g. Aravind M"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Register / Roll Number</label>
                    <input
                      value={winner3.rollNo}
                      onChange={e => setWinner3({ ...winner3, rollNo: e.target.value })}
                      placeholder="e.g. 23EC019"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Department</label>
                    <input
                      value={winner3.dept}
                      onChange={e => setWinner3({ ...winner3, dept: e.target.value })}
                      placeholder="e.g. Electronics & Comm"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>College / Institution</label>
                    <input
                      value={winner3.college}
                      onChange={e => setWinner3({ ...winner3, college: e.target.value })}
                      placeholder="e.g. National Engineering College"
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label style={{ fontSize: 11 }}>Award / Prize Description</label>
                    <input
                      value={winner3.award}
                      onChange={e => setWinner3({ ...winner3, award: e.target.value })}
                      placeholder="e.g. ₹2,500 Cash & Bronze Medal"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedEventForWinners(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-amber"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
                >
                  <span>🏆</span> Save & Publish Official Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
