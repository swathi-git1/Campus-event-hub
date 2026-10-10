import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
  events as seedEvents,
  clubs as seedClubs,
  achievements as seedAchievements,
  seedMemberships,
  seedRegistrations,
  notifications as seedNotifications,
  instructors as seedInstructors,
  seedAuditLogs,
  seedPermissionRequests,
  seedODRecords,
  seedMultiChannelAlerts
} from '../data/mockData'
import { canRegisterForEvent as canRegisterEvent, canViewEvent as canViewEventForUser } from '../utils/accessControl'
import { api } from '../utils/apiClient'

const DataContext = createContext(null)

const safeGet = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    if (!stored || stored === 'undefined' || stored === 'null') return fallback
    const parsed = JSON.parse(stored)
    return Array.isArray(fallback) ? (Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback) : (parsed || fallback)
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage, resetting to fallback:`, e)
    return fallback
  }
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  // 1. Events State
  const [events, setEvents] = useState(() => {
    const stored = safeGet('ceh_events_v2', seedEvents)
    const storedIds = new Set(stored.map(e => e.id))
    const missing = seedEvents.filter(e => !storedIds.has(e.id))
    return missing.length > 0 ? [...stored, ...missing] : stored
  })

  // 2. Registrations State (student event registrations with attendance tracking)
  const [registrations, setRegistrations] = useState(() => safeGet('ceh_registrations_v2', seedRegistrations))

  // 3. Clubs State (with studentTeam hierarchy)
  const [clubs, setClubs] = useState(() => safeGet('ceh_clubs_v2', seedClubs))

  // 4. Instructors State
  const [instructorsList, setInstructorsList] = useState(() => safeGet('ceh_instructors_v2', seedInstructors))

  // 5. Achievements State (Rich Articles)
  const [achievements, setAchievements] = useState(() => safeGet('ceh_achievements_v2', seedAchievements))

  // 6. Club Memberships State (with assigned roles)
  const [memberships, setMemberships] = useState(() => safeGet('ceh_memberships_v2', seedMemberships))

  // 7. Notifications State
  const [notifications, setNotifications] = useState(() => safeGet('ceh_notifications_v2', seedNotifications))

  // 8. Admin Audit Trail State
  const [auditLogs, setAuditLogs] = useState(() => safeGet('ceh_audit_logs_v2', seedAuditLogs))

  // 9. Permission Requests State (Internal & External Events)
  const [permissionRequests, setPermissionRequests] = useState(() => {
    const stored = safeGet('ceh_permission_requests_v1', seedPermissionRequests)
    const storedIds = new Set(stored.map(r => r.id))
    const missing = seedPermissionRequests.filter(r => !storedIds.has(r.id))
    return missing.length > 0 ? [...stored, ...missing] : stored
  })

  // 10. Official On-Duty (OD) Records State
  const [odRecords, setODRecords] = useState(() => {
    const stored = safeGet('ceh_od_records_v1', seedODRecords)
    const storedIds = new Set(stored.map(r => r.id))
    const missing = seedODRecords.filter(r => !storedIds.has(r.id))
    return missing.length > 0 ? [...stored, ...missing] : stored
  })

  // 11. Multi-Channel Alerts State (WhatsApp, SMS, Email dispatches)
  const [multiChannelAlerts, setMultiChannelAlerts] = useState(() => {
    const stored = safeGet('ceh_multi_channel_alerts_v1', seedMultiChannelAlerts)
    const storedIds = new Set(stored.map(a => a.id))
    const missing = seedMultiChannelAlerts.filter(a => !storedIds.has(a.id))
    return missing.length > 0 ? [...stored, ...missing] : stored
  })

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ceh_events_v2', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('ceh_registrations_v2', JSON.stringify(registrations))
  }, [registrations])

  useEffect(() => {
    localStorage.setItem('ceh_clubs_v2', JSON.stringify(clubs))
  }, [clubs])

  useEffect(() => {
    localStorage.setItem('ceh_instructors_v2', JSON.stringify(instructorsList))
  }, [instructorsList])

  useEffect(() => {
    localStorage.setItem('ceh_achievements_v2', JSON.stringify(achievements))
  }, [achievements])

  useEffect(() => {
    localStorage.setItem('ceh_memberships_v2', JSON.stringify(memberships))
  }, [memberships])

  useEffect(() => {
    localStorage.setItem('ceh_notifications_v2', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('ceh_audit_logs_v2', JSON.stringify(auditLogs))
  }, [auditLogs])

  useEffect(() => {
    localStorage.setItem('ceh_permission_requests_v1', JSON.stringify(permissionRequests))
  }, [permissionRequests])

  useEffect(() => {
    localStorage.setItem('ceh_od_records_v1', JSON.stringify(odRecords))
  }, [odRecords])

  useEffect(() => {
    localStorage.setItem('ceh_multi_channel_alerts_v1', JSON.stringify(multiChannelAlerts))
  }, [multiChannelAlerts])

  // --- Admin Audit Log Helper ---
  const logAdminAction = (action, details, actor = 'Dr. Aris Thorne (Dean)', badgeColor = 'teal') => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action,
      actor,
      details,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      badgeColor
    }
    setAuditLogs(prev => [newLog, ...prev])
    return newLog
  }

  // --- Notification Helper ---
  const addNotification = ({ role = 'all', targetClub = null, recipientEmail = null, text, dot = 'var(--indigo)' }) => {
    const newNotif = {
      id: Date.now(),
      role,
      targetClub,
      recipientEmail,
      text,
      time: 'Just now',
      dot,
      unread: true
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // --- Multi-Channel Notification Dispatcher (WhatsApp, SMS, Email) ---
  const dispatchMultiChannelAlert = async ({
    recipientName = 'Student Scholar',
    recipientEmail = '',
    recipientPhone = '',
    channels = ['whatsapp'],
    channel,
    title = 'Campus Notification',
    message = '',
    type = 'general_alert',
    sender = user?.name ? `${user.name} (${user.designation || 'OD In-Charge'})` : 'Faculty OD Clearance Desk'
  }) => {
    const targetChannels = Array.isArray(channels) && channels.length > 0 ? channels : (channel ? [channel] : ['whatsapp'])
    const newDispatches = []

    for (const ch of targetChannels) {
      const entry = {
        id: `dispatch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        recipientName: recipientName || 'Student Scholar',
        recipientEmail: recipientEmail || 'student@college.edu',
        recipientPhone: recipientPhone || '+91 98765 43210',
        channel: ch,
        type,
        title,
        message,
        status: 'delivered',
        timestamp: new Date().toISOString(),
        sender
      }
      newDispatches.push(entry)

      try {
        await api.dispatchNotification({
          recipientEmail: entry.recipientEmail,
          recipientPhone: entry.recipientPhone,
          channel: ch,
          type,
          title,
          message,
          status: 'delivered'
        })
      } catch (e) {
        // Fallback gracefully
      }
    }

    setMultiChannelAlerts(prev => [...newDispatches, ...prev])

    // Also dispatch to bell notification for recipient
    addNotification({
      role: 'student',
      recipientEmail,
      text: `[${targetChannels.map(c => c.toUpperCase()).join('/')}] ${title}: ${message.slice(0, 90)}...`,
      dot: targetChannels.includes('whatsapp') ? 'var(--green)' : 'var(--indigo)'
    })

    return { success: true, count: newDispatches.length, dispatches: newDispatches }
  }

  // --- Authorization Helper ---
  const isAuthorizedForClub = (user, clubName) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'instructor') {
      return (user.assignedClub || '').toLowerCase() === (clubName || '').toLowerCase()
    }
    if (user.clubPosition && user.clubPosition.isLead) {
      return (user.clubPosition.club || '').toLowerCase() === (clubName || '').toLowerCase()
    }
    return false
  }

  const canManageClub = (clubName) => {
    return user?.role === 'admin' || 
      (user?.role === 'instructor' && isAuthorizedForClub(user, clubName)) || 
      (user?.clubPosition?.isLead && (user.clubPosition.club || '').toLowerCase() === (clubName || '').toLowerCase()) ||
      user?.role === 'instructor'
  }

  const canViewEvent = (event) => canViewEventForUser(event, user, memberships)
  const canRegisterForEvent = (event) => canRegisterEvent(event, user, memberships)
  const visibleEvents = events.filter(canViewEvent)

  // --- Admin Faculty Assignment ---
  const assignInstructorToClub = (instructorId, clubName) => {
    if (user?.role !== 'admin') return false
    const inst = instructorsList.find(i => i.id === instructorId)
    if (!inst) return false

    const normalizedClubName = clubName.trim().toLowerCase()

    // A faculty advisor can own only one club. Reassigning an instructor
    // clears their previous allocation before applying the new one.
    setInstructorsList(prev => prev.map(i => {
      if (i.id === instructorId) return { ...i, assignedClub: clubName }
      if (i.assignedClub?.toLowerCase() === normalizedClubName && i.id !== instructorId) {
        return { ...i, assignedClub: null }
      }
      return i
    }))

    setClubs(prev => prev.map(c => {
      const isTargetClub = c.name.toLowerCase() === normalizedClubName
      const isPreviousClub = c.leadInstructorId === instructorId && !isTargetClub

      if (isTargetClub) {
        return {
          ...c,
          leadInstructorId: instructorId,
          leadInstructor: `${inst.name} (${inst.dept.split(' ')[0]})`
        }
      }
      if (isPreviousClub) {
        return { ...c, leadInstructorId: null, leadInstructor: 'Unassigned Faculty Advisor' }
      }
      return c
    }))

    logAdminAction(
      'FACULTY_REALLOCATION',
      `Reallocated ${inst.name} (${inst.dept}) as Lead Faculty Advisor for ${clubName} Chapter.`,
      'Dr. Aris Thorne (Dean)',
      'teal'
    )

    addNotification({
      role: 'all',
      targetClub: clubName,
      text: `Admin update: ${inst.name} has been assigned as Faculty Advisor for ${clubName} Society.`,
      dot: 'var(--purple)'
    })
    return true
  }

  // --- Event Actions ---
  const addEvent = (eventData) => {
    if (!canManageClub(eventData.club)) return null

    const requestedPin = String(eventData.venuePin || '').replace(/\D/g, '').slice(0, 4)
    const generatedPin = requestedPin.length === 4 ? requestedPin : `${Math.floor(1000 + Math.random() * 9000)}`
    const fallbackPoster = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    const poster = eventData.posterUrl || eventData.coverImage || fallbackPoster
    const newEvent = {
      ...eventData,
      id: Date.now(),
      registered: eventData.registered || 0,
      capacity: Math.max(1, Number(eventData.capacity) || 100),
      fee: ['members_only', 'membership_only', 'club_specific'].includes(eventData.accessLevel) ? 'Members Exclusive' : (eventData.fee || 'Free Entry'),
      accessLevel: eventData.accessLevel || 'public', // 'public', 'membership_only', or 'club_specific'
      venuePin: generatedPin,
      tagClass: eventData.tag === 'Cultural' ? 'tag-purple' : eventData.tag === 'Sports' ? 'tag-amber' : eventData.tag === 'Wellness' ? 'tag-green' : eventData.tag === 'Service' ? 'tag-teal' : 'tag-indigo',
      coverImage: poster,
      posterUrl: poster,
      statusOverride: eventData.statusOverride || 'open',
      status: eventData.status || (eventData.statusOverride === 'completed' ? 'completed' : 'upcoming'),
      winners: eventData.winners || [],
      organizingTeam: eventData.organizingTeam || {
        facultyAdvisor: eventData.club + " Faculty Advisor",
        conductingLead: "Student Conducting Lead",
        eventManager: "Event Operations Manager"
      }
    }
    setEvents(prev => [newEvent, ...prev])

    // If created as completed with winners, announce achievement
    if (newEvent.winners && newEvent.winners.length > 0) {
      setTimeout(() => {
        setEventWinners(newEvent.id, newEvent.winners)
      }, 50)
    }

    addNotification({
      role: ['members_only', 'membership_only', 'club_specific'].includes(eventData.accessLevel) ? 'all' : 'student',
      targetClub: newEvent.club,
      text: `New ${['members_only', 'membership_only', 'club_specific'].includes(eventData.accessLevel) ? 'Members-Exclusive ' : ''}event scheduled: "${newEvent.title}" by ${newEvent.club}. Enrollment is active!`,
      dot: 'var(--green)'
    })
    return newEvent
  }

  const updateEvent = (eventId, fields) => {
    const event = events.find(ev => ev.id === eventId)
    if (!event || !canManageClub(event.club)) return false
    setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, ...fields } : ev))
    return true
  }

  const deleteEvent = (eventId) => {
    const event = events.find(ev => ev.id === eventId)
    if (!event || !canManageClub(event.club)) return false
    setEvents(prev => prev.filter(e => e.id !== eventId))
    setRegistrations(prev => prev.filter(r => r.eventId !== eventId))
    return true
  }

  const updateEventStatus = (eventId, newStatus) => {
    const event = events.find(ev => ev.id === eventId)
    if (!event || !canManageClub(event.club)) return false
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, statusOverride: newStatus }
      }
      return ev
    }))

    const ev = event
    const statusLabel = newStatus === 'active_conduction' ? 'active for live conduction' : newStatus === 'open' ? 'open for registration' : 'closed'
    addNotification({
      role: 'all',
      targetClub: ev?.club,
      text: `Event update: "${ev?.title || 'Event'}" is now ${statusLabel}.`,
      dot: newStatus === 'open' || newStatus === 'active_conduction' ? 'var(--green)' : 'var(--danger)'
    })
    return true
  }

  // --- Assign Winners & Mark Event Completed Workflow ---
  const setEventWinners = (eventId, winnersList = []) => {
    const event = events.find(ev => String(ev.id) === String(eventId))
    if (!event || !canManageClub(event.club)) return { success: false, error: 'Unauthorized or event not found' }

    // 1. Update event with winners & mark completed
    setEvents(prev => prev.map(ev => {
      if (String(ev.id) === String(eventId)) {
        return {
          ...ev,
          statusOverride: 'completed',
          status: 'completed',
          winners: winnersList
        }
      }
      return ev
    }))

    // 2. Automatically create or update achievement article in achievements feed
    const cleanTitle = `Winners Announced: ${event.title}`
    const existingIndex = achievements.findIndex(a => a.eventId === event.id || a.title.toLowerCase().includes(event.title.toLowerCase()))

    const w1 = winnersList[0]
    const w2 = winnersList[1]
    const w3 = winnersList[2]

    const articleSummary = `Official results declared for "${event.title}". First Prize: ${w1?.studentName || '—'} (${w1?.dept || 'CSE'}), Second Prize: ${w2?.studentName || '—'} (${w2?.dept || 'CSE'}), Third Prize: ${w3?.studentName || '—'} (${w3?.dept || 'IT'}).`
    const articleContent = `The Department and ${event.club} Chapter proudly announce the verified winners of **${event.title}** conducted on ${event.date}.\n\n### Official Laurels & Prize Standings\n- 🥇 **First Prize**: ${w1?.studentName || 'Winner'} (${w1?.rollNo || ''}, ${w1?.dept || ''}, ${w1?.college || 'National Engineering College'}) — ${w1?.award || 'Gold Medal'}\n- 🥈 **Second Prize**: ${w2?.studentName || 'Winner'} (${w2?.rollNo || ''}, ${w2?.dept || ''}, ${w2?.college || 'National Engineering College'}) — ${w2?.award || 'Silver Medal'}\n- 🥉 **Third Prize**: ${w3?.studentName || 'Winner'} (${w3?.rollNo || ''}, ${w3?.dept || ''}, ${w3?.college || 'National Engineering College'}) — ${w3?.award || 'Bronze Medal'}\n\nCongratulations to all competitors, faculty advisors, and conducting student leads!`

    const formattedWinners = winnersList.map(w => ({
      name: w.studentName,
      rollNo: w.rollNo,
      dept: `${w.dept} (${w.college || 'Institution'})`,
      role: w.prize
    }))

    if (existingIndex >= 0) {
      setAchievements(prev => prev.map((a, idx) => {
        if (idx === existingIndex) {
          return {
            ...a,
            winners: formattedWinners,
            summary: articleSummary,
            content: articleContent
          }
        }
        return a
      }))
    } else {
      const newArticle = {
        id: Date.now(),
        eventId: event.id,
        title: cleanTitle,
        slug: `winners-${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        subtitle: `Official results published for ${event.club} Chapter.`,
        club: event.club,
        category: 'Event Victory',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        publishedAt: new Date().toISOString(),
        readTime: '2 min read',
        tagClass: event.tagClass || 'tag-indigo',
        coverImage: event.coverImage || event.posterUrl,
        author: {
          name: user?.name || "Faculty Advisor",
          role: `Faculty Advisor, ${event.club}`,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
        },
        summary: articleSummary,
        content: articleContent,
        winners: formattedWinners,
        reactions: { claps: 32, trophies: 26, fire: 45 },
        comments: []
      }
      setAchievements(prev => [newArticle, ...prev])
    }

    // 3. Multi-channel notifications for winners
    winnersList.forEach(w => {
      try {
        api.triggerWinnerWorkflowNotification(event, w).catch(() => {})
      } catch (_) {}
    })

    // 4. In-App Notification
    addNotification({
      role: 'all',
      targetClub: event.club,
      text: `🏆 Official Winners Declared for "${event.title}": 1st Prize ${w1?.studentName || ''}! Check Achievements & Event Details.`,
      dot: 'var(--amber)'
    })

    return { success: true }
  }

  // --- Student Event Registration with Detailed Attributes ---
  const registerForEvent = (event, {
    studentName = "Ananya Rao",
    rollNo = "23CS082",
    dept = "CSE",
    year = "3rd Year",
    email = "student@college.edu",
    phone = "+91 98765 43210",
    team = "",
    isClubMember = false
  }) => {
    if (!user || user.role !== 'student') return { success: false, error: 'Only authenticated students can register for events.' }
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (normalizedEmail !== String(user.email || '').trim().toLowerCase()) {
      return { success: false, error: 'Registration identity must match the signed-in student.' }
    }
    const eventIsOpen = event?.statusOverride === 'open' || event?.statusOverride === 'active_conduction' || !event?.statusOverride
    const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(event?.accessLevel)
    const existingRegistration = registrations.find(r => r.eventId === event?.id && String(r.email || '').trim().toLowerCase() === normalizedEmail)

    if (!event) return { success: false, error: 'Event not found.' }
    if (!eventIsOpen) return { success: false, error: 'Registration is not open for this event.' }

    // Membership is derived from the membership records, never from client input.
    const isApprovedMember = memberships.some(m =>
      m.clubName.toLowerCase() === event.club.toLowerCase() &&
      String(m.studentEmail || '').trim().toLowerCase() === normalizedEmail &&
      m.status === 'approved'
    )
    if (!canRegisterEvent(event, { ...user, email: normalizedEmail, role: 'student' }, memberships)) {
      return {
        success: false,
        error: isMembersOnly
          ? `Exclusive Event: Approved club membership in ${event.club} Chapter is required to enroll.`
          : 'You are not eligible to enroll in this event.'
      }
    }

    if (existingRegistration) return { success: false, error: 'You are already registered for this event.', reg: existingRegistration }
    if (Number(event.registered || 0) >= Number(event.capacity || 100)) return { success: false, error: 'This event has reached its registration capacity.' }

    const regId = `REG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
    const newReg = {
      id: regId,
      eventId: event.id,
      eventTitle: event.title,
      club: event.club,
      eventDate: event.date,
      venue: event.venue,
      team,
      studentName,
      rollNo,
      dept,
      year,
      email,
      phone,
      isClubMember: isApprovedMember,
      status: "Confirmed",
      attended: false,
      attendedAt: null,
      checkinMethod: null,
      timestamp: new Date().toLocaleString()
    }

    setRegistrations(prev => [newReg, ...prev])
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registered: (e.registered || 0) + 1 } : e))

    addNotification({
      role: 'student',
      recipientEmail: email,
      text: `You have successfully registered for "${event.title}"! Passcode Ticket: #${regId}. Event Attendance PIN: ${event.venuePin || '4821'}.`,
      dot: 'var(--green)'
    })
    addNotification({
      role: 'instructor',
      targetClub: event.club,
      text: `New contestant registered for ${event.club}: ${studentName} (${rollNo})${team ? ` (Team: ${team})` : ''} for "${event.title}".`,
      dot: 'var(--indigo)'
    })

    return { success: true, reg: newReg }
  }

  // --- Attendance Management: Instructor/Coordinator & Student Flows ---
  const updateAttendance = (regId, isPresent, checkinMethod = "Advisor Marked") => {
    const registration = registrations.find(r => r.id === regId)
    const event = events.find(ev => ev.id === registration?.eventId)
    if (!registration || !event || !canManageClub(event.club)) return false
    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          attended: isPresent,
          attendedAt: isPresent ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : null,
          checkinMethod: isPresent ? checkinMethod : null
        }
      }
      return r
    }))
    return true
  }

  const bulkUpdateAttendance = (eventId, isPresent, checkinMethod = "Advisor Bulk") => {
    const event = events.find(ev => ev.id === Number(eventId))
    if (!event || !canManageClub(event.club)) return false
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    setRegistrations(prev => prev.map(r => {
      if (r.eventId === Number(eventId)) {
        return {
          ...r,
          attended: isPresent,
          attendedAt: isPresent ? (r.attendedAt || nowTime) : null,
          checkinMethod: isPresent ? (r.checkinMethod || checkinMethod) : null
        }
      }
      return r
    }))
    return true
  }

  const markStudentSelfAttendance = (eventId, enteredPin, studentEmail = "student@college.edu") => {
    if (!user || user.role !== 'student') return { success: false, error: "Only authenticated students can verify attendance." }
    const ev = events.find(e => e.id === Number(eventId))
    if (!ev) return { success: false, error: "Event not found." }
    if (ev.statusOverride === 'closed') {
      return { success: false, error: "Attendance verification is closed for this session." }
    }

    const cleanEntered = String(enteredPin || '').trim()
    const cleanExpected = String(ev.venuePin || '4821').trim()
    if (!/^\d{4}$/.test(cleanEntered) || cleanEntered !== cleanExpected) {
      return { success: false, error: "Invalid 4-digit Venue PIN. Please check the screen at the event hall." }
    }

    const normalizedEmail = String(user.email || '').trim().toLowerCase()
    const registration = registrations.find(r =>
      r.eventId === Number(eventId) && String(r.email || '').trim().toLowerCase() === normalizedEmail
    )

    if (!registration) return { success: false, error: "No active registration found for this event." }
    if (registration.attended) return { success: true, alreadyPresent: true, reg: registration }

    const attendedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    const updatedReg = { ...registration, attended: true, attendedAt, checkinMethod: "Self PIN Verified" }
    setRegistrations(prev => prev.map(r => r.id === registration.id ? updatedReg : r))

    addNotification({
      role: 'student',
      recipientEmail: studentEmail,
      text: `✓ Attendance verified for "${ev.title}". Your participation has been recorded!`,
      dot: 'var(--green)'
    })
    return { success: true, reg: updatedReg }
  }

  // --- Student Club Role Assignment (Hierarchy Management) ---
  const assignStudentClubRole = (membershipId, roleTitle, roleCategory = 'conducting') => {
    const membership = memberships.find(app => app.id === membershipId)
    if (!membership || !canManageClub(membership.clubName)) return false
    let updatedApp = null
    setMemberships(prev => prev.map(app => {
      if (app.id === membershipId) {
        updatedApp = {
          ...app,
          assignedRole: roleTitle,
          roleCategory
        }
        return updatedApp
      }
      return app
    }))

    if (updatedApp) {
      // Update club studentTeam list
      setClubs(prev => prev.map(c => {
        if (c.name.toLowerCase() === updatedApp.clubName.toLowerCase()) {
          const currentTeam = c.studentTeam || []
          const existingIndex = currentTeam.findIndex(t => t.email === updatedApp.studentEmail || t.name === updatedApp.studentName)
          const newMember = {
            id: `stu_${updatedApp.studentId || Date.now()}`,
            name: updatedApp.studentName,
            rollNo: updatedApp.rollNo,
            dept: updatedApp.dept,
            email: updatedApp.studentEmail,
            role: roleTitle,
            roleCategory,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            bio: updatedApp.sop || "Active leadership member of the chapter."
          }

          let newTeam = []
          if (existingIndex >= 0) {
            newTeam = [...currentTeam]
            newTeam[existingIndex] = { ...newTeam[existingIndex], ...newMember }
          } else {
            newTeam = [...currentTeam, newMember]
          }

          return { ...c, studentTeam: newTeam }
        }
        return c
      }))

      addNotification({
        role: 'student',
        recipientEmail: updatedApp.studentEmail,
        text: `🎖️ Chapter Leadership Update: You have been designated as "${roleTitle}" in ${updatedApp.clubName} Chapter!`,
        dot: 'var(--amber)'
      })
    }
    return Boolean(updatedApp)
  }

  // --- Achievement Articles Actions ---
  const addAchievementArticle = (articleData) => {
    if (!user || !['admin', 'instructor'].includes(user.role)) return null
    if (user.role === 'instructor' && !isAuthorizedForClub(user, articleData.club)) return null
    const newArticle = {
      id: Date.now(),
      slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      publishedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      tagClass: articleData.club === 'Fine Arts' ? 'tag-purple' : articleData.club === 'NSS' ? 'tag-teal' : 'tag-indigo',
      reactions: { claps: 0, trophies: 0, fire: 0 },
      comments: [],
      gallery: articleData.gallery || [articleData.coverImage],
      ...articleData
    }
    setAchievements(prev => [newArticle, ...prev])
    addNotification({
      role: 'all',
      targetClub: newArticle.club,
      text: `New Achievement Article: "${newArticle.title}" published by ${newArticle.club}!`,
      dot: 'var(--amber)'
    })
    return newArticle
  }

  const reactToAchievement = (achievementId, reactionType) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === achievementId) {
        return {
          ...a,
          reactions: {
            ...a.reactions,
            [reactionType]: (a.reactions[reactionType] || 0) + 1
          }
        }
      }
      return a
    }))
  }

  const addAchievementComment = (achievementId, comment) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === achievementId) {
        const newComments = [...(a.comments || []), {
          id: Date.now(),
          author: comment.author || "Student",
          avatar: comment.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
          text: comment.text,
          time: "Just now"
        }]
        return { ...a, comments: newComments }
      }
      return a
    }))
  }

  // --- Club Membership Actions ---
  const applyForMembership = (applicationData) => {
    if (!user || user.role !== 'student') return null
    const club = clubs.find(c => c.name.toLowerCase() === applicationData.clubName.toLowerCase()) || { name: applicationData.clubName }
    const appId = `APP-${club.name.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    
    const newApp = {
      id: appId,
      clubName: club.name,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      rollNo: user.rollNo || applicationData.rollNo || "23CS082",
      dept: user.dept || applicationData.dept || "Computer Science",
      year: user.year || applicationData.year || "3rd Year",
      phone: user.phone || applicationData.phone || "+91 98765 43210",
      rolePreference: applicationData.rolePreference || "General Member",
      assignedRole: applicationData.rolePreference || "General Member",
      roleCategory: "member",
      sop: applicationData.sop || "",
      skills: applicationData.skills || "",
      paymentRequired: (club.membershipFee || 0) > 0,
      feeAmount: club.membershipFee || 0,
      paymentStatus: (club.membershipFee || 0) > 0 ? "PAID" : "FREE",
      paymentDetails: applicationData.paymentDetails || null,
      status: "pending",
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewNotes: ""
    }

    setMemberships(prev => [newApp, ...prev])

    addNotification({
      role: 'instructor',
      targetClub: club.name,
      text: `New Membership Application for ${club.name}: ${newApp.studentName} applied (${newApp.paymentStatus === 'PAID' ? `Fee Paid: ₹${newApp.feeAmount}` : 'Free'}). Action required.`,
      dot: 'var(--amber)'
    })

    addNotification({
      role: 'student',
      recipientEmail: newApp.studentEmail,
      text: `Your membership application for ${newApp.clubName} Chapter has been submitted successfully (${appId}). Awaiting faculty advisor review.`,
      dot: 'var(--indigo)'
    })

    return newApp
  }

  const approveMembership = (applicationId, notes = "") => {
    const application = memberships.find(app => app.id === applicationId)
    if (!application || !canManageClub(application.clubName)) return false
    let approvedApp = null
    setMemberships(prev => prev.map(app => {
      if (app.id === applicationId) {
        approvedApp = {
          ...app,
          status: "approved",
          reviewedAt: new Date().toISOString(),
          reviewNotes: notes || "Application approved. Welcome to the club!"
        }
        return approvedApp
      }
      return app
    }))

    if (approvedApp) {
      setClubs(prev => prev.map(c => c.name === approvedApp.clubName ? { ...c, members: (c.members || 0) + 1 } : c))
      
      addNotification({
        role: 'student',
        recipientEmail: approvedApp.studentEmail,
        text: `🎉 Congratulations! Your membership for ${approvedApp.clubName} Club has been APPROVED! Official Member ID: MEM-${approvedApp.clubName}-${approvedApp.rollNo || '101'}.`,
        dot: 'var(--green)'
      })
    }
    return Boolean(approvedApp)
  }

  const denyMembership = (applicationId, reason = "Application criteria not met") => {
    const application = memberships.find(app => app.id === applicationId)
    if (!application || !canManageClub(application.clubName)) return false
    let deniedApp = null
    setMemberships(prev => prev.map(app => {
      if (app.id === applicationId) {
        deniedApp = {
          ...app,
          status: "denied",
          reviewedAt: new Date().toISOString(),
          reviewNotes: reason
        }
        return deniedApp
      }
      return app
    }))

    if (deniedApp) {
      addNotification({
        role: 'student',
        recipientEmail: deniedApp.studentEmail,
        text: `Update regarding your ${deniedApp.clubName} application: Status is Denied (${reason}).`,
        dot: 'var(--danger)'
      })
    }
    return Boolean(deniedApp)
  }

  const updateClubSettings = (clubName, settings) => {
    if (!canManageClub(clubName)) return false
    setClubs(prev => prev.map(c => {
      if (c.name === clubName) {
        return { ...c, ...settings }
      }
      return c
    }))
    return true
  }

  // --- Student Event Permission Requests Management ---
  const submitPermissionRequest = (requestData) => {
    if (!user || user.role !== 'student') {
      return { success: false, error: 'Only authenticated students can submit event permission requests.' }
    }
    const reqId = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const newReq = {
      id: reqId,
      studentId: user.id || 1001,
      studentName: user.name || "Student Scholar",
      studentEmail: user.email || "student@college.edu",
      rollNo: user.rollNo || requestData.rollNo || "23CS082",
      dept: user.dept || requestData.dept || "Computer Science",
      degree: user.degree || "B.Tech",
      year: user.year || requestData.year || "3rd Year",
      eventId: requestData.eventId || null,
      eventName: requestData.eventName,
      eventType: requestData.eventType || "Inter-College Competition",
      scope: requestData.scope || (requestData.eventId ? "Internal" : "External"),
      organizer: requestData.organizer || "College Organizing Council",
      eventDate: requestData.eventDate,
      eventEndDate: requestData.eventEndDate || requestData.eventDate,
      eventTime: requestData.eventTime || "09:00 AM – 05:00 PM",
      venue: requestData.venue || "Campus Venue",
      purpose: requestData.purpose || "",
      relatedClub: requestData.relatedClub || "General",
      teamMembers: requestData.teamMembers || [],
      invitationDocUrl: requestData.invitationDocUrl || "",
      invitationDocName: requestData.invitationDocName || "",
      additionalRemarks: requestData.additionalRemarks || "",
      status: "Pending Approval",
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      facultyRemarks: null,
      proof: null,
      odRecordId: null
    }

    setPermissionRequests(prev => [newReq, ...prev])

    addNotification({
      role: 'faculty_od',
      text: `New Event Permission Request: ${newReq.studentName} (${newReq.rollNo}) requested permission for "${newReq.eventName}" (${newReq.scope}). Action required.`,
      dot: 'var(--amber)'
    })

    addNotification({
      role: 'student',
      recipientEmail: newReq.studentEmail,
      text: `Your permission request for "${newReq.eventName}" has been submitted (#${reqId}). Status: Pending Approval.`,
      dot: 'var(--indigo)'
    })

    return { success: true, request: newReq }
  }

  const updatePermissionStatus = (requestId, newStatus, remarks = '') => {
    let updatedReq = null
    setPermissionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        updatedReq = {
          ...req,
          status: newStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy: user?.name || "Dr. Malathi Sundaram",
          facultyRemarks: remarks || req.facultyRemarks
        }
        return updatedReq
      }
      return req
    }))

    if (updatedReq) {
      const isApproved = newStatus === 'Approved'
      const isRejected = newStatus === 'Rejected'
      addNotification({
        role: 'student',
        recipientEmail: updatedReq.studentEmail,
        text: isApproved
          ? `✅ Permission APPROVED for "${updatedReq.eventName}"! Attend the event and upload participation proof to receive On-Duty (OD).`
          : isRejected
          ? `❌ Permission REJECTED for "${updatedReq.eventName}". Remarks: ${remarks || 'Criteria not met.'}`
          : `⚠️ Update on your request for "${updatedReq.eventName}": ${remarks || 'Review notes updated.'}`,
        dot: isApproved ? 'var(--green)' : isRejected ? 'var(--danger)' : 'var(--amber)'
      })

      const phone = updatedReq.phone || '+91 98765 43210'
      if (isApproved) {
        api.dispatchNotification({
          recipientEmail: updatedReq.studentEmail,
          recipientPhone: phone,
          channel: 'whatsapp',
          type: 'od_approval_alert',
          title: `OD Request Approved: ${updatedReq.eventName}`,
          message: `🎉 Great news ${updatedReq.studentName}! Your OD request for "${updatedReq.eventName}" has been APPROVED. Remarks: ${remarks || 'Verified for college attendance'}.`,
          status: 'delivered'
        }).catch(() => {})

        api.dispatchNotification({
          recipientEmail: updatedReq.studentEmail,
          recipientPhone: phone,
          channel: 'sms',
          type: 'od_approval_alert',
          title: `SMS Alert: OD Approved - ${updatedReq.eventName}`,
          message: `CEH ALERT: OD Request for ${updatedReq.eventName} is APPROVED. Review remarks: ${remarks || 'Approved'}.`,
          status: 'delivered'
        }).catch(() => {})

        api.dispatchNotification({
          recipientEmail: updatedReq.studentEmail,
          recipientPhone: phone,
          channel: 'email',
          type: 'od_approval_alert',
          title: `Official Clearance Sanctioned: ${updatedReq.eventName}`,
          message: `Dear ${updatedReq.studentName},\n\nYour OD Request for "${updatedReq.eventName}" has been officially APPROVED.\n\nRemarks: ${remarks || 'Approved for college attendance'}\n\nInstitutional Event & OD Cell`,
          status: 'delivered'
        }).catch(() => {})
      } else if (isRejected) {
        api.dispatchNotification({
          recipientEmail: updatedReq.studentEmail,
          recipientPhone: phone,
          channel: 'whatsapp',
          type: 'od_rejection_alert',
          title: `OD Request Update: ${updatedReq.eventName}`,
          message: `⚠️ Hello ${updatedReq.studentName}. Your OD request for "${updatedReq.eventName}" was not approved. Remarks: ${remarks || 'Criteria not met.'}`,
          status: 'delivered'
        }).catch(() => {})
      }

      return { success: true, request: updatedReq }
    }
    return { success: false, error: 'Request not found.' }
  }

  const submitParticipationProof = (requestId, { photos = [], certificateUrl = '', attendanceProofUrl = '', description = '' }) => {
    let updatedReq = null
    setPermissionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const proofObj = {
          submittedAt: new Date().toISOString(),
          photos: photos.length > 0 ? photos : (req.proof?.photos || []),
          certificateUrl: certificateUrl || req.proof?.certificateUrl || '',
          attendanceProofUrl: attendanceProofUrl || req.proof?.attendanceProofUrl || '',
          description: description || req.proof?.description || '',
          verifiedAt: null,
          verifiedBy: null,
          verificationRemarks: null
        }
        updatedReq = {
          ...req,
          status: 'Proof Submitted',
          proof: proofObj
        }
        return updatedReq
      }
      return req
    }))

    if (updatedReq) {
      addNotification({
        role: 'faculty_od',
        text: `📷 Proof Submitted: ${updatedReq.studentName} uploaded participation proof for "${updatedReq.eventName}". Verification required.`,
        dot: 'var(--purple)'
      })

      addNotification({
        role: 'student',
        recipientEmail: updatedReq.studentEmail,
        text: `Proof of participation submitted for "${updatedReq.eventName}". Status: Proof Submitted (Verification Pending).`,
        dot: 'var(--indigo)'
      })
      return { success: true, request: updatedReq }
    }
    return { success: false, error: 'Request not found.' }
  }

  const verifyParticipationProof = (requestId, isApproved, remarks = '') => {
    let updatedReq = null
    setPermissionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        if (!req.proof) return req
        const nextStatus = isApproved ? 'Proof Verified' : 'Proof Rejected'
        const updatedProof = {
          ...req.proof,
          verifiedAt: isApproved ? new Date().toISOString() : null,
          verifiedBy: user?.name || "Dr. Malathi Sundaram",
          verificationRemarks: remarks
        }
        updatedReq = {
          ...req,
          status: nextStatus,
          proof: updatedProof
        }
        return updatedReq
      }
      return req
    }))

    if (updatedReq) {
      addNotification({
        role: 'student',
        recipientEmail: updatedReq.studentEmail,
        text: isApproved
          ? `✓ Proof Verified for "${updatedReq.eventName}"! Faculty has validated your attendance. Official On-Duty (OD) is ready for issuance.`
          : `❌ Participation Proof Rejected for "${updatedReq.eventName}". Reason: ${remarks || 'Invalid/unclear document.'}. Please re-upload valid proof.`,
        dot: isApproved ? 'var(--green)' : 'var(--danger)'
      })
      return { success: true, request: updatedReq }
    }
    return { success: false, error: 'Request not found.' }
  }

  const issueOnDuty = (requestId, { totalDaysOD = 1, remarks = '', dateRange = '' } = {}) => {
    const targetReq = permissionRequests.find(r => r.id === requestId)
    if (!targetReq) return { success: false, error: 'Permission request record not found.' }

    // Strict validation: OD can only be issued if proof has been verified or submitted!
    if (targetReq.status !== 'Proof Verified' && targetReq.status !== 'Proof Submitted') {
      return {
        success: false,
        error: 'Policy Violation: On-Duty (OD) cannot be issued before the student attends the event and participation proof is verified.'
      }
    }

    const odId = `OD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const dates = dateRange || `${targetReq.eventDate}${targetReq.eventEndDate && targetReq.eventEndDate !== targetReq.eventDate ? ' – ' + targetReq.eventEndDate : ''}`

    const newODRecord = {
      id: odId,
      requestId: targetReq.id,
      studentId: targetReq.studentId,
      studentName: targetReq.studentName,
      studentEmail: targetReq.studentEmail,
      rollNo: targetReq.rollNo,
      dept: targetReq.dept,
      degree: targetReq.degree || "B.Tech",
      year: targetReq.year,
      eventName: targetReq.eventName,
      eventType: targetReq.eventType,
      organizer: targetReq.organizer,
      eventDates: dates,
      totalDaysOD: Math.max(1, Number(totalDaysOD) || 1),
      venue: targetReq.venue,
      status: "Active / Verified",
      issuedBy: user?.name || "Dr. Malathi Sundaram",
      issuerDesignation: user?.designation || "Chief Event Permission & OD In-Charge",
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      issuedAtTimestamp: new Date().toISOString(),
      verificationReference: `VER-${targetReq.id}-${Math.floor(100 + Math.random() * 900)}`,
      qrCodeData: `CEH-OFFICIAL-OD-PASS:${odId}:${targetReq.rollNo}:${targetReq.eventName.slice(0, 15)}:VERIFIED`,
      remarks: remarks || `Official On-Duty granted for verified event participation. Academic attendance waived for ${totalDaysOD || 1} day(s).`
    }

    setODRecords(prev => [newODRecord, ...prev])

    setPermissionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'OD Issued',
          odRecordId: odId
        }
      }
      return req
    }))

    addNotification({
      role: 'student',
      recipientEmail: targetReq.studentEmail,
      text: `🎖️ Official On-Duty (OD) ISSUED for "${targetReq.eventName}"! Official Pass #${odId} is now available in your Student Portal.`,
      dot: 'var(--green)'
    })

    const phone = targetReq.phone || '+91 98765 43210'
    api.dispatchNotification({
      recipientEmail: targetReq.studentEmail,
      recipientPhone: phone,
      channel: 'whatsapp',
      type: 'od_issued_alert',
      title: `Official OD Pass Issued: ${odId}`,
      message: `🎖️ Congratulations ${targetReq.studentName}! Your Official OD Pass #${odId} for "${targetReq.eventName}" has been ISSUED. Total Days Credited: ${newODRecord.totalDaysOD}.`,
      status: 'delivered'
    }).catch(() => {})

    api.dispatchNotification({
      recipientEmail: targetReq.studentEmail,
      recipientPhone: phone,
      channel: 'sms',
      type: 'od_issued_alert',
      title: `SMS Alert: OD Pass #${odId} Issued`,
      message: `CEH ALERT: Official OD Pass #${odId} has been ISSUED for ${targetReq.eventName} (${newODRecord.totalDaysOD} days).`,
      status: 'delivered'
    }).catch(() => {})

    api.dispatchNotification({
      recipientEmail: targetReq.studentEmail,
      recipientPhone: phone,
      channel: 'email',
      type: 'od_issued_alert',
      title: `Official On-Duty Pass Credential - #${odId}`,
      message: `Dear ${targetReq.studentName},\n\nYour official OD Pass #${odId} for ${targetReq.eventName} has been validated and issued.\n\nTotal Days Credited: ${newODRecord.totalDaysOD}\nVerification Ref: ${newODRecord.verificationReference}`,
      status: 'delivered'
    }).catch(() => {})

    return { success: true, odRecord: newODRecord }
  }

  const deletePermissionRequest = (requestId) => {
    setPermissionRequests(prev => prev.filter(r => r.id !== requestId))
    setODRecords(prev => prev.filter(od => od.requestId !== requestId))
    return true
  }

  return (
    <DataContext.Provider value={{
      events,
      visibleEvents,
      registrations,
      clubs,
      instructorsList,
      achievements,
      memberships,
      notifications,
      auditLogs,
      permissionRequests,
      odRecords,
      logAdminAction,
      isAuthorizedForClub,
      canViewEvent,
      canRegisterForEvent,
      addEvent,
      updateEvent,
      deleteEvent,
      updateEventStatus,
      setEventWinners,
      registerForEvent,
      updateAttendance,
      bulkUpdateAttendance,
      markStudentSelfAttendance,
      assignStudentClubRole,
      addAchievementArticle,
      reactToAchievement,
      addAchievementComment,
      applyForMembership,
      approveMembership,
      denyMembership,
      updateClubSettings,
      assignInstructorToClub,
      addNotification,
      markAllNotificationsRead,
      submitPermissionRequest,
      updatePermissionStatus,
      submitParticipationProof,
      verifyParticipationProof,
      issueOnDuty,
      deletePermissionRequest
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider')
  }
  return ctx
}
