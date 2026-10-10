import React, { useState, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, markAllNotificationsRead } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const userRole = user?.role || 'student'
  const assignedClub = user?.assignedClub || 'CSI'
  const userEmail = user?.email || 'student@college.edu'

  // Filter notifications strictly relevant to this user & their assigned club
  const relevantNotifications = notifications.filter(n => {
    if (userRole === 'admin') return true
    if (n.role === 'all') return true

    if (userRole === 'faculty_od') {
      return n.role === 'faculty_od'
    }

    if (userRole === 'instructor') {
      if (n.role !== 'instructor') return false
      // If notification has a targetClub, must match instructor's assignedClub
      if (n.targetClub && assignedClub) {
        return n.targetClub.toLowerCase() === assignedClub.toLowerCase()
      }
      return true
    }

    if (userRole === 'student') {
      if (n.role !== 'student') return false
      if (n.recipientEmail && userEmail) {
        return n.recipientEmail.toLowerCase() === userEmail.toLowerCase()
      }
      return true
    }

    return false
  })

  const unreadCount = relevantNotifications.filter(n => n.unread).length

  const handleNotificationClick = (n) => {
    const text = n.text.toLowerCase()
    if (userRole === 'faculty_od') {
      if (text.includes('proof')) {
        navigate('/od-incharge/proofs')
      } else {
        navigate('/od-incharge/requests')
      }
      setOpen(false)
      return
    }

    if (userRole === 'instructor' && text.includes('membership')) {
      navigate('/instructor/memberships')
      setOpen(false)
    } else if (userRole === 'instructor' && text.includes('enrollment')) {
      navigate('/instructor/events')
      setOpen(false)
    } else if (userRole === 'student' && (text.includes('permission') || text.includes('on-duty') || text.includes('od') || text.includes('proof'))) {
      navigate('/student/permissions')
      setOpen(false)
    } else if (userRole === 'student' && text.includes('enrolled')) {
      navigate('/student/registrations')
      setOpen(false)
    } else if (userRole === 'student' && text.includes('membership')) {
      navigate('/student/clubs')
      setOpen(false)
    } else if (text.includes('achievement')) {
      navigate(userRole === 'instructor' ? '/instructor/achievements' : '/student/achievements')
      setOpen(false)
    }
  }

  return (
    <div className="bell-wrap" ref={ref}>
      <button className="bell-btn" onClick={() => setOpen(o => !o)} title="Notifications">
        🔔
        {unreadCount > 0 && <span className="bell-dot">{unreadCount}</span>}
      </button>
      {open && (
        <div className="bell-panel open" style={{ width: 340, maxHeight: 420, overflowY: 'auto' }}>
          <div className="bell-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Notifications</span>
              {userRole === 'instructor' ? (
                <span className="badge tag-amber" style={{ fontSize: 9, padding: '2px 6px' }}>
                  {assignedClub} Advisor
                </span>
              ) : (
                <span className="badge tag-indigo" style={{ fontSize: 9, padding: '2px 6px' }}>
                  {userRole}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllNotificationsRead}>Mark all read</button>
            )}
          </div>
          <div>
            {relevantNotifications.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 12.5 }}>
                No notifications for {userRole === 'instructor' ? `${assignedClub} Chapter` : 'your account'} right now.
              </div>
            ) : (
              relevantNotifications.map(n => (
                <div
                  className={'notif-item' + (n.unread ? ' unread' : '')}
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="notif-dot" style={{ background: n.dot || 'var(--indigo)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="notif-text" style={{ fontSize: 12, lineHeight: 1.45 }}>{n.text}</div>
                    <div className="notif-time" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span>{n.time}</span>
                      {n.unread && <span style={{ color: 'var(--indigo)', fontWeight: 700, fontSize: 10 }}>New</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
