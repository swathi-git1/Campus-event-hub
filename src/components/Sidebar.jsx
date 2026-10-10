import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useI18n } from '../context/I18nContext'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function Sidebar({ role }) {
  const { user, logout } = useAuth()
  const { memberships, permissionRequests } = useData()
  const { t } = useI18n()
  const navigate = useNavigate()

  // For instructor, filter pending memberships for their assigned club
  const assignedClubName = user?.assignedClub || 'CSI'
  const pendingMembershipsCount = memberships.filter(m =>
    m.status === 'pending' &&
    (role !== 'instructor' || m.clubName.toLowerCase() === assignedClubName.toLowerCase())
  ).length

  // For faculty_od, count pending requests & proof submissions waiting for verification
  const pendingODRequestsCount = permissionRequests.filter(r => r.status === 'Pending Approval').length
  const pendingProofsCount = permissionRequests.filter(r => r.status === 'Proof Submitted').length

  const LINKS = {
    student: [
      { to: '/student/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: '🏠', end: true },
      { to: '/student/enroll', label: t('nav.enroll', 'Enroll Events'), icon: '📅' },
      { to: '/student/permissions', label: t('nav.permissions', 'Event Permissions & OD'), icon: '📝' },
      { to: '/student/history', label: t('nav.history', 'Participation & OD History'), icon: '📜' },
      { to: '/student/registrations', label: t('nav.registrations', 'My Registrations'), icon: '🎟️' },
      { to: '/student/clubs', label: t('nav.clubs', 'Clubs & Join'), icon: '👥' },
      { to: '/student/achievements', label: t('nav.achievements', 'Achievements Feed'), icon: '🏆' },
      { to: '/student/feedback', label: t('nav.feedback', 'Feedback'), icon: '⭐' },
      { to: '/links', label: t('nav.notificationsHub', 'Multi-Channel Alerts'), icon: '📲' },
      { to: '/settings', label: t('nav.settings', 'Settings & Appearance'), icon: '⚙️' },
      { to: '/student/profile', label: t('nav.profile', 'My Student Profile'), icon: '👤' },
    ],
    instructor: [
      { to: '/instructor/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: '🏠', end: true },
      { to: '/instructor/events', label: t('nav.manageEvents', 'Manage Events'), icon: '📋' },
      {
        to: '/instructor/memberships',
        label: t('nav.membershipRequests', 'Membership Requests'),
        icon: '👥',
        badge: pendingMembershipsCount > 0 ? pendingMembershipsCount : null
      },
      { to: '/instructor/checkin', label: t('nav.checkin', 'Event Check-in'), icon: '📷' },
      { to: '/instructor/achievements', label: t('nav.achievements', 'Post Achievement'), icon: '🏆' },
      { to: '/links', label: t('nav.notificationsHub', 'Multi-Channel Alerts'), icon: '📲' },
      { to: '/settings', label: t('nav.settings', 'Settings & Appearance'), icon: '⚙️' },
      { to: '/instructor/profile', label: t('nav.facultyProfile', 'My Faculty Profile'), icon: '👤' },
    ],
    faculty_od: [
      { to: '/od-incharge/dashboard', label: t('nav.dashboard', 'OD Desk Dashboard'), icon: '🏛️', end: true },
      { to: '/od-incharge/analytics', label: 'OD Analytics & Reports', icon: '📊' },
      {
        to: '/od-incharge/requests',
        label: t('nav.odRequests', 'Permission Requests'),
        icon: '📝',
        badge: pendingODRequestsCount > 0 ? pendingODRequestsCount : null
      },
      {
        to: '/od-incharge/proofs',
        label: t('nav.odProofs', 'Proof Verification'),
        icon: '🔍',
        badge: pendingProofsCount > 0 ? pendingProofsCount : null
      },
      { to: '/od-incharge/records', label: t('nav.odRecords', 'Official OD Passes'), icon: '🎖️' },
      { to: '/links', label: t('nav.notificationsHub', 'Multi-Channel Alerts'), icon: '📲' },
      { to: '/settings', label: t('nav.settings', 'Settings & Appearance'), icon: '⚙️' },
      { to: '/instructor/profile', label: t('nav.facultyProfile', 'Faculty Profile'), icon: '👤' },
    ],
    admin: [
      { to: '/admin/dashboard', label: t('nav.dashboard', 'Dashboard & Allocations'), icon: '🏠', end: true },
      { to: '/admin/permissions', label: t('nav.permissions', 'Permissions & OD Oversight'), icon: '📜' },
      { to: '/admin/clubs', label: t('nav.clubs', 'Pending Club Charters'), icon: '🛡️' },
      { to: '/links', label: t('nav.notificationsHub', 'Multi-Channel Alerts'), icon: '📲' },
      { to: '/settings', label: t('nav.settings', 'Settings & Appearance'), icon: '⚙️' },
      { to: '/admin/profile', label: t('nav.adminProfile', 'Admin Profile & System'), icon: '👤' },
    ],
  }

  const TITLES = {
    student: 'Student Portal',
    instructor: 'Instructor Portal',
    faculty_od: 'OD / Permission Desk',
    admin: 'Admin Portal'
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><Logo size={22} textSize={14.5} dark /></div>

      <div style={{ padding: '0 12px 14px' }}>
        <div style={{ 
          fontSize: 10, 
          fontWeight: 700, 
          letterSpacing: '.12em', 
          textTransform: 'uppercase', 
          color: 'var(--ink-soft)',
          fontFamily: 'var(--font-mono)'
        }}>
          {TITLES[role]}
        </div>
        {role === 'instructor' && (
          <div style={{
            marginTop: 8,
            background: 'rgba(255, 85, 0, 0.08)',
            border: '1px solid rgba(255, 85, 0, 0.25)',
            padding: '4px 8px',
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 600,
            color: '#ff8844',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'var(--font-mono)'
          }}>
            <span>●</span> {assignedClubName} Chapter Lead
          </div>
        )}
        {role === 'faculty_od' && (
          <div style={{
            marginTop: 8,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '4px 8px',
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 600,
            color: '#f59e0b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'var(--font-mono)'
          }}>
            <span>🎖️</span> Chief OD Clearance Officer
          </div>
        )}
      </div>

      {LINKS[role].map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <span style={{ fontSize: 14 }}>{link.icon}</span>
          <span style={{ flex: 1 }}>{link.label}</span>
          {link.badge && (
            <span style={{
              background: 'var(--orange)',
              color: '#fff',
              fontSize: 9.5,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 0 6px var(--orange)'
            }}>
              {link.badge}
            </span>
          )}
        </NavLink>
      ))}

      <div className="sidebar-foot">
        <div 
          className="sidebar-link" 
          onClick={handleLogout}
          style={{ color: '#ef4444' }}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  )
}
