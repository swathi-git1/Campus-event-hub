import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { pendingClubs, studentAccounts } from '../../data/mockData'
import MonthlyEventsAnalytics from '../../components/MonthlyEventsAnalytics'
import SearchInput from '../../components/SearchInput'
import FilterBar from '../../components/FilterBar'
import Pagination from '../../components/Pagination'
import SortableHeader from '../../components/SortableHeader'
import { SkeletonRow } from '../../components/SkeletonLoader'
import { api } from '../../utils/apiClient'
import { useToast } from '../../context/ToastContext'
import { exportTableToCSV, exportTableToPDF } from '../../utils/tableExport'

const STUDENT_FILTER_CONFIG = [
  {
    key: 'dept',
    label: 'Department',
    options: ['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering']
  },
  {
    key: 'chapter',
    label: 'Chapter',
    options: ['CSI', 'IEEE', 'IE', 'Sports', 'Yoga', 'Fine Arts', 'NSS', 'NCC']
  },
  {
    key: 'year',
    label: 'Academic Year',
    options: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  {
    key: 'status',
    label: 'Verification Status',
    options: [
      { value: 'verified', label: '✅ Verified' },
      { value: 'pending', label: '⏳ Pending' }
    ]
  }
]

export default function AdminDashboard() {
  const { user, getAccounts, getRecentUsers } = useAuth()
  const { clubs, instructorsList, events, registrations, assignInstructorToClub } = useData()
  const { showToast } = useToast()

  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedClub, setSelectedClub] = useState(null)
  const [selectedInstructorId, setSelectedInstructorId] = useState('')

  // Student Directory State
  const [studentSearch, setStudentSearch] = useState('')
  const [studentFilters, setStudentFilters] = useState({})
  const [studentSort, setStudentSort] = useState('name_asc')
  const [studentPage, setStudentPage] = useState(1)
  const [studentPageSize, setStudentPageSize] = useState(10)
  const [studentsData, setStudentsData] = useState({ data: [], pagination: { totalItems: 0, totalPages: 1 } })
  const [studentsLoading, setStudentsLoading] = useState(false)

  const pendingCount = pendingClubs.filter(c => c.status === 'pending').length
  const accounts = getAccounts ? getAccounts() : []
  const recentUsers = getRecentUsers ? getRecentUsers().slice(0, 5) : []

  // Admin Account & Audit State
  const [allUsers, setAllUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [auditLogs, setAuditLogs] = useState([])
  const [loadingAudit, setLoadingAudit] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showAuditLogs, setShowAuditLogs] = useState(false)
  const [systemSettings, setSystemSettings] = useState({
    allowedEmailDomain: '@college.edu',
    requireEmailDomainCheck: true,
    maxDailyODPerStudent: 3,
    strictODProofRequirement: true
  })
  const [savingSettings, setSavingSettings] = useState(false)

  const fetchSystemSettings = async () => {
    try {
      const res = await api.getSystemSettings()
      if (res?.data) setSystemSettings(res.data)
    } catch (e) {
      // fallback
    }
  }

  const fetchAllUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await api.getAllUsers()
      if (res?.data) setAllUsers(res.data)
    } catch (e) {
      // fallback
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchAuditLogs = async () => {
    setLoadingAudit(true)
    try {
      const res = await api.getAuditLogs(15)
      if (res?.data) setAuditLogs(res.data)
    } catch (e) {
      // fallback
    } finally {
      setLoadingAudit(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
    fetchAuditLogs()
    fetchSystemSettings()
  }, [])

  const handleToggleUserStatus = async (targetId) => {
    try {
      const res = await api.toggleUserStatus(targetId)
      if (res?.success) {
        showToast(`Account updated: ${res.user.isActive ? 'Active' : 'Deactivated'}`, 'info')
        setAllUsers(prev => prev.map(u => u.id === targetId ? { ...u, isActive: res.user.isActive } : u))
        fetchAuditLogs()
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle status.', 'error')
    }
  }

  const handleSaveSystemSettings = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      const res = await api.updateSystemSettings(systemSettings)
      if (res?.success) {
        showToast('Institutional governance & domain settings updated successfully!', 'success')
        if (res.data) setSystemSettings(res.data)
      } else {
        showToast(res?.error || 'Failed to update system settings.', 'error')
      }
    } catch (err) {
      showToast(err.message || 'Error updating settings.', 'error')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleExportStudentsCSV = () => {
    const list = studentsData.data || []
    if (list.length === 0) {
      showToast('No student records to export.', 'warning')
      return
    }
    const filterSummary = Object.entries(studentFilters)
      .filter(([_, v]) => Boolean(v))
      .map(([k, v]) => `${k}=${v}`)
      .join(', ') || (studentSearch ? `search="${studentSearch}"` : 'All Scholars')

    const headers = ['Roll No', 'Full Name', 'Email', 'Department', 'Degree', 'Academic Year', 'Chapter', 'Verified Attendance', 'Status']
    const rows = list.map(s => [
      s.rollNo,
      s.name,
      s.email,
      s.dept,
      s.degree || 'B.Tech',
      s.year || '3rd Year',
      s.chapter || 'CSI',
      `${s.attendanceCount || 4} events`,
      s.verificationStatus === 'verified' ? 'Verified' : 'Pending'
    ])

    exportTableToCSV({
      filename: `CEH_Student_Directory_${new Date().toISOString().split('T')[0]}`,
      headers,
      rows,
      metadata: {
        title: 'Student Scholar Directory',
        filterSummary
      }
    })
    showToast(`Exported ${list.length} student records to CSV`, 'success')
  }

  const handleExportStudentsPDF = () => {
    const list = studentsData.data || []
    if (list.length === 0) {
      showToast('No student records to export.', 'warning')
      return
    }
    const filterSummary = Object.entries(studentFilters)
      .filter(([_, v]) => Boolean(v))
      .map(([k, v]) => `${k}=${v}`)
      .join(', ') || (studentSearch ? `search="${studentSearch}"` : 'All Scholars')

    const headers = ['Roll No', 'Full Name', 'Department', 'Year', 'Chapter', 'Attendance', 'Status']
    const rows = list.map(s => [
      s.rollNo,
      s.name,
      s.dept,
      s.year || '3rd Year',
      s.chapter || 'CSI',
      `${s.attendanceCount || 4} events`,
      s.verificationStatus === 'verified' ? 'Verified' : 'Pending'
    ])

    exportTableToPDF({
      title: 'STUDENT SCHOLAR ROSTER',
      subtitle: 'Office of Academic Affairs & Chapter Accreditation',
      filterSummary,
      headers,
      rows
    })
  }

  // Fetch students via Server API with search, filters, sort, and pagination
  useEffect(() => {
    let isCancelled = false
    const fetchStudents = async () => {
      setStudentsLoading(true)
      try {
        const res = await api.getStudents({
          search: studentSearch,
          dept: studentFilters.dept,
          chapter: studentFilters.chapter,
          year: studentFilters.year,
          status: studentFilters.status,
          sort: studentSort,
          page: studentPage,
          pageSize: studentPageSize
        })
        if (!isCancelled && res?.data) {
          setStudentsData(res)
        }
      } catch (err) {
        // Fallback to local filtering
        if (!isCancelled) {
          let list = [...studentAccounts]
          if (studentSearch) {
            const q = studentSearch.toLowerCase()
            list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q) || (s.rollNo || '').toLowerCase().includes(q))
          }
          setStudentsData({
            data: list.slice((studentPage - 1) * studentPageSize, studentPage * studentPageSize),
            pagination: { page: studentPage, pageSize: studentPageSize, totalItems: list.length, totalPages: Math.ceil(list.length / studentPageSize) || 1 }
          })
        }
      } finally {
        if (!isCancelled) setStudentsLoading(false)
      }
    }
    fetchStudents()
    return () => { isCancelled = true }
  }, [studentSearch, studentFilters, studentSort, studentPage, studentPageSize])

  const handleOpenReassign = (club) => {
    setSelectedClub(club)
    const currentInst = instructorsList.find(i => i.assignedClub?.toLowerCase() === club.name.toLowerCase())
    setSelectedInstructorId(currentInst ? currentInst.id : instructorsList[0].id)
    setShowReassignModal(true)
  }

  const handleConfirmReassign = (e) => {
    e.preventDefault()
    if (!selectedClub || !selectedInstructorId) return
    assignInstructorToClub(selectedInstructorId, selectedClub.name)
    showToast(`Allocated advisor for ${selectedClub.name}`, 'success')
    setShowReassignModal(false)
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>University Platform Administration</h1>
          <p className="muted" style={{ margin: 0 }}>
            Welcome back, {user?.name}. Manage faculty advisor allocations, oversee club charters, and monitor campus event conduction.
          </p>
        </div>
        <Link to="/admin/profile" className="btn btn-outline btn-sm">
          👤 Admin Profile & Oversight
        </Link>
      </div>

      {/* System Metrics Strip */}
      <div className="stat-strip">
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>{clubs.length}</div>
          <div className="stat-label">Accredited Clubs</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--indigo)' }}>{instructorsList.length}</div>
          <div className="stat-label">Faculty Advisors</div>
        </div>
        <div>
          <div className="stat-num">{events.length}</div>
          <div className="stat-label">Live Campus Events</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: pendingCount > 0 ? 'var(--amber)' : 'inherit' }}>
            {pendingCount}
          </div>
          <div className="stat-label">Pending Club Approvals</div>
        </div>
        <div>
          <div className="stat-num" style={{ color: 'var(--teal)' }}>{accounts.length}</div>
          <div className="stat-label">Registered Identities</div>
        </div>
      </div>

      {/* Identity Oversight Card */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Identity & Access Oversight</h2>
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 0' }}>Account creation, role assignment, and institutional JWT sessions.</p>
          </div>
          <span className="badge tag-teal">JWT HS256 Active</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {['student', 'instructor', 'faculty_od', 'admin'].map(accountRole => (
            <div key={accountRole} style={{ border: '1px solid var(--border)', borderRadius: 9, padding: 12 }}>
              <div className="muted" style={{ textTransform: 'capitalize' }}>
                {accountRole === 'faculty_od' ? 'OD In-Charge' : `${accountRole} accounts`}
              </div>
              <strong style={{ fontSize: 20 }}>{accounts.filter(account => account.role === accountRole).length}</strong>
            </div>
          ))}
        </div>
        {recentUsers.length > 0 && (
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-soft)', letterSpacing: '.04em', marginBottom: 6 }}>
              Recently accessed
            </div>
            {recentUsers.map(item => (
              <div key={`${item.email}-${item.lastAccessed}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', fontSize: 12 }}>
                <span>{item.name}</span>
                <span className="muted">{item.role} · {new Date(item.lastAccessed).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* User Account Controls & Audit Log Toggles */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowUserManagement(!showUserManagement)}
            className="btn btn-outline btn-xs"
          >
            {showUserManagement ? '▲ Hide User Status Manager' : '👥 Manage User Accounts & Status'}
          </button>
          <button
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="btn btn-outline btn-xs"
          >
            {showAuditLogs ? '▲ Hide System Logs' : '📋 System Activity & Usage Logs'}
          </button>
        </div>

        {/* User Management Expansion */}
        {showUserManagement && (
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <h4 style={{ fontSize: 14, margin: '0 0 10px' }}>Institutional User Accounts & Role Control</h4>
            {loadingUsers ? (
              <div className="muted" style={{ fontSize: 12 }}>Loading user directory...</div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>User / Identity</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Role</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Access Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <strong>{u.name}</strong>
                          <div className="muted mono" style={{ fontSize: 11 }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '8px 12px', textTransform: 'capitalize' }}>
                          <span className="badge tag-indigo" style={{ fontSize: 10.5 }}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-soft)' }}>
                          {u.dept}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <span className={`badge ${u.isActive ? 'badge-approved' : 'tag-amber'}`}>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className="btn btn-outline btn-xs"
                              style={{
                                color: u.isActive ? '#ef4444' : '#10b981',
                                borderColor: u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'
                              }}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Expansion */}
        {showAuditLogs && (
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <h4 style={{ fontSize: 14, margin: '0 0 10px' }}>Platform Activity & Security Audit Trail</h4>
            {loadingAudit ? (
              <div className="muted" style={{ fontSize: 12 }}>Loading audit trail...</div>
            ) : auditLogs.length === 0 ? (
              <div className="muted" style={{ fontSize: 12 }}>No recent audit records.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {auditLogs.map(log => (
                  <div key={log.id} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <div>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--orange)', marginRight: 8 }}>
                        [{log.action}]
                      </span>
                      <span>{log.details}</span>
                      <span className="muted" style={{ marginLeft: 8 }}>by {log.user}</span>
                    </div>
                    <span className="mono muted" style={{ fontSize: 10.5 }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Institutional Domain & System Governance Card */}
      <div className="card" style={{ padding: 22, marginBottom: 24, border: '1px solid var(--border)', background: 'var(--card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>🏛️ Institutional Domain & System Governance</h2>
            <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0' }}>
              Configure university email domain policy, OD verification rules, and automated security controls.
            </p>
          </div>
          <span className="badge tag-indigo">Dynamic Policy Active</span>
        </div>

        <form onSubmit={handleSaveSystemSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                Allowed Institutional Email Domain:
              </label>
              <input
                type="text"
                value={systemSettings.allowedEmailDomain || '@college.edu'}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, allowedEmailDomain: e.target.value }))}
                placeholder="@college.edu or @university.edu"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2, #f8fafc)',
                  color: 'var(--ink)',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono, monospace)'
                }}
              />
              <span className="muted" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                All student & faculty registrations validate against this domain when enabled.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                Max Approved OD Allocations / Day:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={systemSettings.maxDailyODPerStudent || 3}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maxDailyODPerStudent: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2, #f8fafc)',
                  color: 'var(--ink)',
                  fontSize: 13
                }}
              />
              <span className="muted" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                Maximum concurrent On-Duty days granted per scholar per semester session.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={Boolean(systemSettings.requireEmailDomainCheck)}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, requireEmailDomainCheck: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: 'var(--orange, #ea580c)' }}
              />
              <span>
                <b>Enforce strict institutional email domain verification</b> on registration portal
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={Boolean(systemSettings.strictODProofRequirement)}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, strictODProofRequirement: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: 'var(--orange, #ea580c)' }}
              />
              <span>
                <b>Strict OD Policy:</b> Require event venue attendance PIN + verified certificate upload before issuing official OD pass
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingSettings}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: 13 }}
            >
              {savingSettings ? 'Saving Policy...' : 'Save Institutional Policy Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* STUDENT SCHOLAR DIRECTORY & SEARCH TABLE (Section 1 & 2 & 3 & 4) */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 19, margin: 0 }}>Student Scholar Directory</h2>
            <p className="muted" style={{ fontSize: 12.5, margin: '3px 0 0' }}>
              Authorized administrator search by student name, ID, college email, department, and chapter.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportStudentsCSV}
              className="btn btn-outline btn-sm"
              title="Export filtered records to Microsoft Excel compatible CSV"
            >
              📊 Export to Excel (.csv)
            </button>
            <button
              onClick={handleExportStudentsPDF}
              className="btn btn-outline btn-sm"
              title="Generate printable official student roster document"
            >
              📄 Export to PDF
            </button>
            <span className="badge tag-indigo">
              {studentsData.pagination?.totalItems || 0} Scholars Registered
            </span>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <SearchInput
            value={studentSearch}
            onChange={setStudentSearch}
            placeholder="Search by student name, roll number, email, department..."
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="student-sort-select" style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
              Sort:
            </label>
            <select
              id="student-sort-select"
              value={studentSort}
              onChange={(e) => setStudentSort(e.target.value)}
              style={{
                height: 38,
                padding: '4px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface-1)',
                fontSize: 13,
                color: 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              <option value="name_asc">🔤 Name (A–Z)</option>
              <option value="name_desc">🔤 Name (Z–A)</option>
              <option value="attendance_desc">🔥 Attendance (Highest first)</option>
              <option value="attendance_asc">Attendance (Lowest first)</option>
              <option value="status">Verification Status</option>
            </select>
          </div>
        </div>

        {/* Filter Bar with active chips */}
        <FilterBar
          filters={STUDENT_FILTER_CONFIG}
          activeFilters={studentFilters}
          onChange={setStudentFilters}
          onClear={() => { setStudentFilters({}); setStudentSearch('') }}
        />

        {/* Students Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                <SortableHeader field="name" currentSort={studentSort} onSort={setStudentSort} style={{ textAlign: 'left', padding: '12px 14px' }}>
                  Student Scholar
                </SortableHeader>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Department & Degree</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Year</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Chapter</th>
                <SortableHeader field="attendance" currentSort={studentSort} onSort={setStudentSort} style={{ textAlign: 'center', padding: '12px 14px' }}>
                  Verified Attendance
                </SortableHeader>
                <SortableHeader field="status" currentSort={studentSort} onSort={setStudentSort} style={{ textAlign: 'center', padding: '12px 14px' }}>
                  Status
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {studentsLoading ? (
                <>
                  <SkeletonRow columns={6} />
                  <SkeletonRow columns={6} />
                  <SkeletonRow columns={6} />
                </>
              ) : studentsData.data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px 14px', color: '#64748b' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                    <strong>No students found</strong>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing search or filters to display all scholars.</div>
                  </td>
                </tr>
              ) : (
                studentsData.data.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                          alt=""
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: 'var(--ink)' }}>{student.name}</strong>
                          <div className="muted mono" style={{ fontSize: 11 }}>{student.rollNo} · {student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>
                      <div>{student.dept}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{student.degree || 'B.Tech'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>
                      {student.year || '3rd Year'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge tag-indigo" style={{ fontSize: 11 }}>
                        {student.chapter || 'CSI'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: 'var(--orange)' }}>
                      {student.attendanceCount || 4} events
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span className={`badge ${student.verificationStatus === 'verified' ? 'badge-approved' : 'tag-amber'}`}>
                        {student.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Student Pagination */}
        <Pagination
          page={studentPage}
          pageSize={studentPageSize}
          totalItems={studentsData.pagination?.totalItems || 0}
          totalPages={studentsData.pagination?.totalPages || 1}
          onPageChange={setStudentPage}
          onPageSizeChange={setStudentPageSize}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      {/* Monthly Analytics */}
      <MonthlyEventsAnalytics
        events={events}
        registrations={registrations}
        role="admin"
        currentUser={user}
        showClubFilter={true}
      />

      {/* 1-to-1 Advisor Allocations */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 19, margin: 0 }}>Faculty Club Advisor Allocations (1-to-1 Management)</h2>
            <p className="muted" style={{ fontSize: 12.5, margin: '3px 0 0' }}>
              Each campus club is allocated to one designated faculty instructor who manages charters and event conduction.
            </p>
          </div>
          <span className="badge tag-indigo" style={{ fontSize: 11 }}>
            {clubs.length} Chapters Assigned
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {clubs.map(c => {
            const assignedInstructor = instructorsList.find(i => i.assignedClub?.toLowerCase() === c.name.toLowerCase())

            return (
              <div
                key={c.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</span>
                      <span className={`badge ${c.tagClass || 'tag-purple'}`} style={{ fontSize: 9 }}>{c.cat}</span>
                    </div>
                    <span className="badge badge-approved" style={{ fontSize: 9 }}>1-to-1 Active</span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
                    👥 {c.members} Members · 📅 {c.events} Events · {c.membershipFee > 0 ? `Fee: ₹${c.membershipFee}` : 'Free'}
                  </div>

                  <div style={{ padding: '10px 12px', background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <img
                      src={assignedInstructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt="Advisor"
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {assignedInstructor?.name || c.leadInstructor}
                      </div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        {assignedInstructor?.dept || 'Faculty Advisor'} · <code>{assignedInstructor?.employeeId || 'FAC-101'}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <span className="muted" style={{ fontSize: 11 }}>All notifications routed to advisor</span>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: 11, padding: '5px 10px' }}
                    onClick={() => handleOpenReassign(c)}
                  >
                    🔄 Reassign Advisor
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && selectedClub && (
        <div className="modal-backdrop" onClick={() => setShowReassignModal(false)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Reassign Faculty Advisor for {selectedClub.name}</h3>
              <button onClick={() => setShowReassignModal(false)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleConfirmReassign}>
              <p className="muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
                Select a faculty instructor to allocate as the sole advisor for <b>{selectedClub.fullName || selectedClub.name}</b>.
              </p>

              <div className="field">
                <label>Select Faculty Instructor *</label>
                <select
                  value={selectedInstructorId}
                  onChange={e => setSelectedInstructorId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13.5 }}
                >
                  {instructorsList.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.dept}) — Currently assigned: {inst.assignedClub}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowReassignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
