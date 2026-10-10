import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getEnrollStatus } from '../../data/mockData'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { visibleEvents: events, registerForEvent, memberships, registrations, achievements, setEventWinners } = useData()
  const { user } = useAuth()
  const { showToast } = useToast()

  const ev = events.find(e => String(e.id) === String(id))
  const [teamName, setTeamName] = useState('')
  const [teamError, setTeamError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Declare / Publish Event Winners Modal State
  const [showWinnersModal, setShowWinnersModal] = useState(false)
  const [winner1, setWinner1] = useState({ studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: '₹25,000 Cash Prize & Gold Trophy' })
  const [winner2, setWinner2] = useState({ studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: '₹15,000 Cash Prize & Silver Trophy' })
  const [winner3, setWinner3] = useState({ studentName: '', rollNo: '', dept: 'IT', college: 'National Engineering College', award: '₹10,000 Cash Prize & Bronze Shield' })

  const studentEmail = user?.email || 'student@college.edu'
  const isClubMember = useMemo(() => {
    if (!ev) return false
    return memberships.some(m =>
      m.clubName.toLowerCase() === ev.club.toLowerCase() &&
      m.status === 'approved' &&
      String(m.studentEmail || '').trim().toLowerCase() === studentEmail.toLowerCase()
    )
  }, [memberships, ev, studentEmail])

  // Registered students for this specific event
  const eventRegistrations = useMemo(() => {
    if (!ev) return []
    return registrations.filter(r => r.eventId === ev.id)
  }, [registrations, ev])

  // Check if current user is registered
  const userRegistration = useMemo(() => {
    if (!ev) return null
    return registrations.find(r => r.eventId === ev.id && String(r.email || '').toLowerCase() === studentEmail.toLowerCase())
  }, [registrations, ev, studentEmail])

  if (!ev) {
    return (
      <DashboardLayout role="student">
        <div className="card" style={{ maxWidth: 540, margin: '40px auto', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>Event Not Found</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>The requested campus event could not be found or has been rescheduled.</p>
          <Link to="/student/enroll" className="btn btn-primary btn-sm">← Back to Events Catalog</Link>
        </div>
      </DashboardLayout>
    )
  }

  const status = getEnrollStatus(ev)
  const isMembersOnly = ['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel)

  // Determine Event Lifecycle State (Upcoming -> Ongoing -> Completed)
  const isCompleted = ev?.status === 'completed' || ev?.statusOverride === 'completed' || ev?.statusOverride === 'closed' || (ev?.winners && Array.isArray(ev.winners) && ev.winners.length > 0)
  const isOngoing = !isCompleted && (ev?.statusOverride === 'active_conduction' || status.badge === 'active_conduction')
  const isUpcoming = !isCompleted && !isOngoing

  const canEnroll = isUpcoming && status.state === 'open' && (!isMembersOnly || isClubMember) && !userRegistration

  // Find linked achievement article if any
  const linkedAchievement = achievements.find(a => a.eventId === ev.id || (a.title && a.title.toLowerCase().includes(ev.title.toLowerCase())))

  const handleEnroll = () => {
    if (!canEnroll) return
    if (ev.teamEvent && !teamName.trim()) {
      setTeamError('Please enter a team name to enroll in this team event.')
      return
    }

    setIsSubmitting(true)
    const result = registerForEvent(ev, {
      studentName: user?.name || "Ananya Rao",
      rollNo: user?.rollNo || "23CS082",
      dept: user?.dept ? user.dept.split(' ')[0] : "CSE",
      year: user?.year || "3rd Year",
      email: user?.email || "student@college.edu",
      phone: user?.phone || "+91 98765 43210",
      team: ev.teamEvent ? teamName.trim() : "",
      isClubMember
    })

    if (!result?.success || !result.reg) {
      setIsSubmitting(false)
      setTeamError(result?.error || 'Unable to complete registration. Please try again.')
      return
    }

    setTimeout(() => {
      navigate('/student/confirmation', {
        state: {
          ticketId: result.reg.id,
          eventTitle: ev.title,
          eventDate: ev.date,
          venue: ev.venue,
          club: ev.club,
          team: ev.teamEvent ? teamName.trim() : "",
          venuePin: ev.venuePin || "4821"
        }
      })
    }, 400)
  }

  // Extract Winners
  const winnersList = useMemo(() => {
    if (ev?.winners && Array.isArray(ev.winners) && ev.winners.length > 0) {
      return ev.winners
    }
    if (linkedAchievement?.winners && Array.isArray(linkedAchievement.winners) && linkedAchievement.winners.length > 0) {
      return linkedAchievement.winners.map(w => ({
        prize: w.role || 'Winner',
        position: w.role?.includes('First') ? 1 : w.role?.includes('Second') ? 2 : 3,
        studentName: w.name,
        rollNo: w.rollNo || '23CS082',
        dept: w.dept?.split(' ')[0] || 'CSE',
        college: 'National Engineering College',
        award: 'Award of Excellence & Trophy'
      }))
    }
    return []
  }, [ev, linkedAchievement])

  const hasPublishedWinners = winnersList.length > 0
  const firstPrize = winnersList.find(w => w.prize?.includes('First') || w.position === 1) || winnersList[0]
  const secondPrize = winnersList.find(w => w.prize?.includes('Second') || w.position === 2) || winnersList[1]
  const thirdPrize = winnersList.find(w => w.prize?.includes('Third') || w.position === 3) || winnersList[2]

  const handleOpenWinnersModal = () => {
    if (ev?.winners && Array.isArray(ev.winners) && ev.winners.length > 0) {
      setWinner1(ev.winners[0] || { studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: 'First Prize 🥇' })
      setWinner2(ev.winners[1] || { studentName: '', rollNo: '', dept: 'CSE', college: 'National Engineering College', award: 'Second Prize 🥈' })
      setWinner3(ev.winners[2] || { studentName: '', rollNo: '', dept: 'IT', college: 'National Engineering College', award: 'Third Prize 🥉' })
    } else {
      const pool = eventRegistrations.length >= 3 ? eventRegistrations : registrations.filter(r => String(r.eventId) === String(ev?.id))
      setWinner1({
        studentName: pool[0]?.studentName || 'Rahul K.',
        rollNo: pool[0]?.rollNo || '22CS104',
        dept: pool[0]?.dept || 'CSE',
        college: 'National Engineering College',
        award: '₹25,000 Cash Prize & Gold Trophy'
      })
      setWinner2({
        studentName: pool[1]?.studentName || 'Ananya Rao',
        rollNo: pool[1]?.rollNo || '23CS082',
        dept: pool[1]?.dept || 'CSE',
        college: 'National Engineering College',
        award: '₹15,000 Cash Prize & Silver Trophy'
      })
      setWinner3({
        studentName: pool[2]?.studentName || 'Vikram S.',
        rollNo: pool[2]?.rollNo || '22IT045',
        dept: pool[2]?.dept || 'IT',
        college: 'National Engineering College',
        award: '₹10,000 Cash Prize & Bronze Shield'
      })
    }
    setShowWinnersModal(true)
  }

  const handleSaveWinners = (e) => {
    e.preventDefault()
    if (!winner1.studentName.trim()) {
      showToast('Please specify at least the First Prize winner name.', 'error')
      return
    }

    const newWinnersList = [
      { ...winner1, prize: 'First Prize 🥇', position: 1 },
      { ...winner2, prize: 'Second Prize 🥈', position: 2 },
      { ...winner3, prize: 'Third Prize 🥉', position: 3 }
    ].filter(w => w.studentName && w.studentName.trim().length > 0)

    setEventWinners(ev.id, newWinnersList)
    showToast(`🏆 Official winners published for "${ev.title}"! Victory laurels posted to Achievements.`, 'success')
    setShowWinnersModal(false)
  }

  return (
    <DashboardLayout role="student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Link to="/student/enroll" className="muted" style={{ fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>←</span> Back to Events Catalog
        </Link>

        {/* Global State Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isCompleted && (
            <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '6px 14px', border: '1px solid #bbf7d0', fontSize: 12 }}>
              ✓ Event Status: Completed
            </span>
          )}
          {isOngoing && (
            <span className="badge" style={{ background: 'var(--amber-soft)', color: 'var(--amber)', fontWeight: 800, padding: '6px 14px', border: '1px solid var(--amber)', fontSize: 12 }}>
              <span className="pulse-dot" style={{ background: 'var(--amber)' }} /> Live Event Active
            </span>
          )}
          {isUpcoming && (
            <span className="badge" style={{ background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 800, padding: '6px 14px', border: '1px solid var(--primary)', fontSize: 12 }}>
              🗓️ Event Status: Upcoming
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: 28, alignItems: 'flex-start' }}>
        {/* Left Column: Event Overview, Details, Winners (if completed), Participants */}
        <div>
          {/* Banner Poster */}
          {(ev.posterUrl || ev.coverImage) && (
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 280, marginBottom: 22, border: '1px solid var(--border)', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <img src={ev.posterUrl || ev.coverImage} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: '#0f172a', fontWeight: 700, padding: '6px 12px' }}>
                  🏛️ {ev.club} Chapter
                </span>
                {isCompleted && (
                  <span className="badge" style={{ background: '#22c55e', color: '#ffffff', fontWeight: 800, padding: '6px 14px', boxShadow: '0 2px 10px rgba(34,197,94,0.4)' }}>
                    🏆 Results Declared
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tags & Metadata */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <span className={`card-tag ${ev.tagClass}`} style={{ margin: 0 }}>{ev.tag}</span>
            <span className="badge tag-purple">{ev.club} Chapter</span>
            {isMembersOnly ? (
              <span className="badge tag-indigo">Exclusive for {ev.club} Members</span>
            ) : (
              <span className="badge tag-green">Open to All Students</span>
            )}
            <span className="badge" style={{ background: 'var(--surface-1)', color: 'var(--ink-soft)' }}>
              {ev.teamEvent ? `👥 Team of ${ev.teamSize || 4}` : '👤 Individual Event'}
            </span>
          </div>

          <h1 style={{ fontSize: 27, margin: '6px 0 12px', lineHeight: 1.25, color: 'var(--ink)' }}>{ev.title}</h1>

          {/* Quick Info Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            background: 'var(--surface-0)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 24
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>📅 Event Date & Time</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{ev.date}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>📍 Venue Location</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{ev.venue}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>🏷️ Event Type</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--indigo)', marginTop: 2 }}>{ev.tag} ({ev.fee || 'Free Entry'})</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>📌 Check-in Venue PIN</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>{ev.venuePin || '4821'}</div>
            </div>
          </div>



          {/* Description */}
          <div className="section-title" style={{ fontSize: 16, marginBottom: 8 }}>About This Event</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--ink)', marginBottom: 24 }}>
            {ev.desc}
          </p>

          {/* Participating Students Section */}
          <div className="card" style={{ padding: 22, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 16, margin: 0, color: 'var(--ink)' }}>
                  👥 Participating Students ({eventRegistrations.length > 0 ? eventRegistrations.length : (ev.registered || 120)})
                </h3>
                <span className="muted" style={{ fontSize: 12 }}>
                  Official registration roster & attendance verification status
                </span>
              </div>
              <span className="badge tag-indigo mono" style={{ fontSize: 12 }}>
                {eventRegistrations.filter(r => r.attended).length || Math.round((ev.registered || 120) * 0.85)} Verified Attended
              </span>
            </div>

            {eventRegistrations.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-0)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>Student</th>
                      <th style={{ padding: '8px 12px' }}>Roll No</th>
                      <th style={{ padding: '8px 12px' }}>Dept</th>
                      <th style={{ padding: '8px 12px' }}>Team</th>
                      <th style={{ padding: '8px 12px' }}>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegistrations.slice(0, 8).map((reg, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{reg.studentName}</td>
                        <td style={{ padding: '8px 12px' }} className="mono">{reg.rollNo}</td>
                        <td style={{ padding: '8px 12px' }}>{reg.dept}</td>
                        <td style={{ padding: '8px 12px' }}>{reg.team || '—'}</td>
                        <td style={{ padding: '8px 12px' }}>
                          {reg.attended ? (
                            <span className="badge tag-green">✓ Verified Present</span>
                          ) : (
                            <span className="badge tag-amber">Registered</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, padding: '8px 0' }}>
                Total <b>{ev.registered || 120} students</b> enrolled for this {ev.club} session. Registered students can mark their attendance at the event venue using Venue PIN <b>{ev.venuePin || '4821'}</b>.
              </div>
            )}
          </div>

          {/* Organizing Committee */}
          <div className="card" style={{ padding: 20, marginBottom: 20, background: 'var(--bg)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 12, letterSpacing: '.04em' }}>
              🏛️ Event Organizing Committee & Leads:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ padding: 12, background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)' }}>Conducting Instructor</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{ev.conductingInstructorName || ev.organizingTeam?.facultyAdvisor || `${ev.club} Faculty Lead`}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)' }}>Student Conducting Lead</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{ev.organizingTeam?.conductingLead || 'Student Conducting Lead'}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)' }}>Event Operations Manager</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{ev.organizingTeam?.eventManager || 'Event Operations Manager'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Action Card based on Workflow State */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 90, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 18, margin: '0 0 14px', color: 'var(--ink)' }}>
            {isCompleted ? '🏁 Event Concluded' : isOngoing ? '🔴 Live Event Desk' : '🎟️ Enrollment & Pass'}
          </h3>

          <div className="stat-strip" style={{ margin: '0 0 18px', padding: '14px 0' }}>
            <div>
              <div className="stat-num">{ev.registered} <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>/ {ev.capacity || 150}</span></div>
              <div className="stat-label">Participants</div>
            </div>
            <div>
              <div className="stat-num" style={{ color: 'var(--green)' }}>{ev.fee || 'Free'}</div>
              <div className="stat-label">Pass Type</div>
            </div>
          </div>

          {/* State Indicator Banner */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: isCompleted ? '#dcfce7' : isOngoing ? 'var(--amber-soft)' : 'var(--green-soft)',
            color: isCompleted ? '#15803d' : isOngoing ? 'var(--amber)' : 'var(--green)',
            fontSize: 12.5,
            fontWeight: 700,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {isCompleted ? (
              <>
                <span>🏆</span>
                <span><b>Event Concluded:</b> Results and winners published</span>
              </>
            ) : isOngoing ? (
              <>
                <span className="pulse-dot" style={{ background: 'var(--amber)' }} />
                <span><b>Ongoing Session:</b> Live venue check-in active</span>
              </>
            ) : (
              <>
                <span className="pulse-dot" />
                <span><b>Enrollment Open:</b> Register your spot now</span>
              </>
            )}
          </div>

          {/* User Status or Registration Action */}
          {userRegistration ? (
            <div style={{
              background: 'var(--surface-0)',
              border: '1.5px solid var(--green)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--green)', fontSize: 13.5 }}>
                <span>✓</span> You Are Enrolled for this Event
              </div>
              <div className="mono" style={{ fontSize: 12, marginTop: 4, color: 'var(--ink)' }}>
                Pass Ticket ID: <b>#{userRegistration.id}</b>
              </div>
              <div style={{ fontSize: 12, marginTop: 4, color: 'var(--ink-soft)' }}>
                Check-in status: <b>{userRegistration.attended ? '✓ Verified Present' : 'Pending Hall Check-in'}</b>
              </div>
              <div style={{ marginTop: 12 }}>
                <Link to="/student/registrations" className="btn btn-outline btn-sm btn-block" style={{ textAlign: 'center' }}>
                  📱 View Pass in My Registrations
                </Link>
              </div>
            </div>
          ) : isCompleted ? (
            <div style={{
              background: 'var(--surface-0)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                This event has successfully concluded. Registration is closed.
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#published-winners-section" className="btn btn-amber btn-sm btn-block" style={{ textAlign: 'center', fontWeight: 700 }}>
                  🏆 {hasPublishedWinners ? 'View Published Winners ↓' : 'Publish Event Winners ↓'}
                </a>
                <Link to="/student/achievements" className="btn btn-outline btn-sm btn-block" style={{ textAlign: 'center' }}>
                  📰 Read Chapter Stories
                </Link>
              </div>
            </div>
          ) : (
            <>
              {ev.teamEvent && canEnroll && (
                <div style={{ marginBottom: 18 }}>
                  <div className="field">
                    <label>Team Name *</label>
                    <input
                      value={teamName}
                      onChange={e => { setTeamName(e.target.value); setTeamError('') }}
                      placeholder="e.g. ByteForce Alpha"
                    />
                  </div>
                  {teamError ? (
                    <div style={{ fontSize: 11.5, color: 'var(--danger)', marginTop: 4 }}>{teamError}</div>
                  ) : (
                    <div className="muted" style={{ fontSize: 11.5 }}>Team of up to {ev.teamSize || 4} members allowed</div>
                  )}
                </div>
              )}

              {isMembersOnly && !isClubMember ? (
                <Link
                  to={`/student/clubs/${encodeURIComponent(ev.club)}`}
                  className="btn btn-block btn-amber"
                  style={{ padding: '13px 20px', fontSize: 14, textAlign: 'center', display: 'block' }}
                >
                  🔒 Join {ev.club} Chapter to Enroll →
                </Link>
              ) : (
                <button
                  className={'btn btn-block ' + (canEnroll ? 'btn-primary' : 'btn-disabled')}
                  onClick={handleEnroll}
                  disabled={!canEnroll || isSubmitting}
                  style={{ padding: '13px 20px', fontSize: 14 }}
                >
                  {isSubmitting ? 'Generating Digital Ticket...' : canEnroll ? '⚡ Confirm & Enroll Now — Free' : 'Registration Closed'}
                </button>
              )}
            </>
          )}

          {/* OD Permission Request Option */}
          <div style={{ marginTop: 12 }}>
            <Link
              to={`/student/permissions?eventId=${ev.id}`}
              className="btn btn-block btn-outline"
              style={{ padding: '11px 18px', fontSize: 13, textAlign: 'center', justifyContent: 'center', borderColor: 'var(--indigo)', color: 'var(--indigo)' }}
            >
              📝 Request Official Permission / OD →
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            Need formal academic attendance clearance? Submit an On-Duty (OD) request to the Faculty In-Charge.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REQUIREMENT: COMPLETED EVENT OFFICIAL PUBLISHED WINNERS AT THE BOTTOM     */}
      {/* ========================================================================= */}
      {isCompleted && (
        <div
          id="published-winners-section"
          className="card"
          style={{
            marginTop: 28,
            padding: '28px 32px',
            borderRadius: 20,
            background: 'linear-gradient(180deg, var(--card) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '2px solid var(--amber)',
            boxShadow: '0 12px 36px rgba(245, 158, 11, 0.12)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🏆</span>
                <div>
                  <h2 style={{ fontSize: 22, margin: 0, color: 'var(--ink)' }}>Official Published Winners & Honors</h2>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
                    Certified competition rankings, cash awards, and laureate standings for <b>{ev.title}</b>.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 800, padding: '7px 14px', border: '1px solid #fde047', fontSize: 12 }}>
                🏅 Certified University Honors
              </span>
              <button
                type="button"
                className="btn btn-amber btn-sm"
                onClick={handleOpenWinnersModal}
                style={{ fontWeight: 700, padding: '7px 16px', fontSize: 12.5 }}
                title="Declare or edit official winners for this event"
              >
                🏆 {hasPublishedWinners ? 'Edit / Re-Publish Winners' : 'Publish Event Winners'}
              </button>
            </div>
          </div>

          {hasPublishedWinners ? (
            <>
              {/* 3 Winner Podium Cards Grid: 1st, 2nd, 3rd Prize */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 22 }}>
                {/* 🥇 1st Prize */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.35) 0%, rgba(253, 224, 71, 0.15) 100%)',
                  border: '2px solid #eab308',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 6px 18px rgba(234, 179, 8, 0.18)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 32 }}>🥇</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '.06em' }}>First Prize</div>
                        <div style={{ fontSize: 11.5, color: '#a16207', fontWeight: 600 }}>Grand Champion Trophy</div>
                      </div>
                    </div>
                    <span className="badge" style={{ background: '#ca8a04', color: '#fff', fontSize: 11, fontWeight: 800 }}>#1 Laureate</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                    {firstPrize?.studentName || 'Rahul K.'}
                  </div>
                  <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                    Register No: <b>{firstPrize?.rollNo || '22CS104'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Department: <b>{firstPrize?.dept || 'CSE'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Institution: <b>{firstPrize?.college || 'National Engineering College'}</b>
                  </div>
                  {firstPrize?.award && (
                    <div style={{ marginTop: 12, padding: '7px 12px', background: 'rgba(234, 179, 8, 0.25)', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#854d0e', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                      🎁 {firstPrize.award}
                    </div>
                  )}
                </div>

                {/* 🥈 2nd Prize */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.6) 0%, rgba(203, 213, 225, 0.25) 100%)',
                  border: '2px solid #94a3b8',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 6px 18px rgba(148, 163, 184, 0.15)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 32 }}>🥈</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: '#334155', textTransform: 'uppercase', letterSpacing: '.06em' }}>Second Prize</div>
                        <div style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>Silver Laurels Shield</div>
                      </div>
                    </div>
                    <span className="badge" style={{ background: '#64748b', color: '#fff', fontSize: 11, fontWeight: 800 }}>#2 Laureate</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                    {secondPrize?.studentName || 'Ananya Rao'}
                  </div>
                  <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                    Register No: <b>{secondPrize?.rollNo || '23CS082'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Department: <b>{secondPrize?.dept || 'CSE'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Institution: <b>{secondPrize?.college || 'National Engineering College'}</b>
                  </div>
                  {secondPrize?.award && (
                    <div style={{ marginTop: 12, padding: '7px 12px', background: 'rgba(148, 163, 184, 0.25)', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.4)' }}>
                      🎁 {secondPrize.award}
                    </div>
                  )}
                </div>

                {/* 🥉 3rd Prize */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(254, 215, 170, 0.35) 0%, rgba(251, 146, 60, 0.15) 100%)',
                  border: '2px solid #f97316',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 6px 18px rgba(249, 115, 22, 0.15)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 32 }}>🥉</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '.06em' }}>Third Prize</div>
                        <div style={{ fontSize: 11.5, color: '#c2410c', fontWeight: 600 }}>Bronze Merit Trophy</div>
                      </div>
                    </div>
                    <span className="badge" style={{ background: '#ea580c', color: '#fff', fontSize: 11, fontWeight: 800 }}>#3 Laureate</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                    {thirdPrize?.studentName || 'Vikram S.'}
                  </div>
                  <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                    Register No: <b>{thirdPrize?.rollNo || '22IT045'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Department: <b>{thirdPrize?.dept || 'IT'}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Institution: <b>{thirdPrize?.college || 'National Engineering College'}</b>
                  </div>
                  {thirdPrize?.award && (
                    <div style={{ marginTop: 12, padding: '7px 12px', background: 'rgba(249, 115, 22, 0.22)', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#9a3412', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
                      🎁 {thirdPrize.award}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Callout */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                  ✨ Winners are formally inducted into the university honours hall and achievements magazine.
                </span>
                <Link to="/student/achievements" className="btn btn-outline btn-sm" style={{ fontWeight: 700, borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                  🏆 View in Campus Achievements Feed →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ padding: '24px 20px', textAlign: 'center', background: 'var(--card)', borderRadius: 12, border: '1px dashed var(--amber)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏅</div>
              <h4 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--ink)' }}>Results Pending Publication</h4>
              <p className="muted" style={{ margin: '0 0 16px', fontSize: 13, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                This event has concluded. Faculty advisors and student coordinators can declare and certify the official 1st, 2nd, and 3rd prize winners now.
              </p>
              <button type="button" className="btn btn-primary" onClick={handleOpenWinnersModal} style={{ fontWeight: 700 }}>
                🏆 Publish Event Winners Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PUBLISH WINNERS MODAL                                                     */}
      {/* ========================================================================= */}
      {showWinnersModal && (
        <div className="modal-backdrop" onClick={() => setShowWinnersModal(false)}>
          <div className="modal" style={{ maxWidth: 650, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0, color: 'var(--ink)' }}>🏆 Declare & Publish Event Winners</h2>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                  Event: <b>{ev.title}</b> ({ev.club} Chapter) · Results post to Campus Achievements feed.
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowWinnersModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveWinners}>
              {/* Quick Fill row if registered students exist */}
              {eventRegistrations.length > 0 && (
                <div style={{ padding: '10px 14px', background: 'var(--amber-soft)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--amber)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', marginBottom: 6 }}>
                    💡 Quick Fill from Registered Contestants ({eventRegistrations.length} registered):
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {eventRegistrations.slice(0, 6).map(r => (
                      <button
                        key={r.id}
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: '3px 8px', background: 'var(--card)' }}
                        onClick={() => {
                          if (!winner1.studentName) setWinner1({ ...winner1, studentName: r.studentName, rollNo: r.rollNo, dept: r.dept })
                          else if (!winner2.studentName) setWinner2({ ...winner2, studentName: r.studentName, rollNo: r.rollNo, dept: r.dept })
                          else if (!winner3.studentName) setWinner3({ ...winner3, studentName: r.studentName, rollNo: r.rollNo, dept: r.dept })
                        }}
                      >
                        + {r.studentName} ({r.rollNo})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🥇 1st Prize Winner Input */}
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, marginBottom: 14, border: '1.5px solid #eab308' }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#854d0e', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🥇</span> First Prize Winner (Champion) *
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner1.studentName}
                    onChange={e => setWinner1({ ...winner1, studentName: e.target.value })}
                    placeholder="Student Full Name *"
                    required
                  />
                  <input
                    value={winner1.rollNo}
                    onChange={e => setWinner1({ ...winner1, rollNo: e.target.value })}
                    placeholder="Roll / Register No (e.g. 22CS104)"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner1.dept}
                    onChange={e => setWinner1({ ...winner1, dept: e.target.value })}
                    placeholder="Department (e.g. CSE)"
                  />
                  <input
                    value={winner1.college}
                    onChange={e => setWinner1({ ...winner1, college: e.target.value })}
                    placeholder="College / Institution"
                  />
                </div>
                <input
                  value={winner1.award}
                  onChange={e => setWinner1({ ...winner1, award: e.target.value })}
                  placeholder="Award (e.g. ₹25,000 Cash Prize & Gold Trophy)"
                />
              </div>

              {/* 🥈 2nd Prize Winner Input */}
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, marginBottom: 14, border: '1.5px solid #94a3b8' }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🥈</span> Second Prize Winner (Runner-Up)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner2.studentName}
                    onChange={e => setWinner2({ ...winner2, studentName: e.target.value })}
                    placeholder="Student Full Name"
                  />
                  <input
                    value={winner2.rollNo}
                    onChange={e => setWinner2({ ...winner2, rollNo: e.target.value })}
                    placeholder="Roll / Register No"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner2.dept}
                    onChange={e => setWinner2({ ...winner2, dept: e.target.value })}
                    placeholder="Department"
                  />
                  <input
                    value={winner2.college}
                    onChange={e => setWinner2({ ...winner2, college: e.target.value })}
                    placeholder="College"
                  />
                </div>
                <input
                  value={winner2.award}
                  onChange={e => setWinner2({ ...winner2, award: e.target.value })}
                  placeholder="Award (e.g. ₹15,000 Cash Prize & Silver Trophy)"
                />
              </div>

              {/* 🥉 3rd Prize Winner Input */}
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, marginBottom: 18, border: '1.5px solid #f97316' }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#9a3412', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🥉</span> Third Prize Winner (Bronze Laureate)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner3.studentName}
                    onChange={e => setWinner3({ ...winner3, studentName: e.target.value })}
                    placeholder="Student Full Name"
                  />
                  <input
                    value={winner3.rollNo}
                    onChange={e => setWinner3({ ...winner3, rollNo: e.target.value })}
                    placeholder="Roll / Register No"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    value={winner3.dept}
                    onChange={e => setWinner3({ ...winner3, dept: e.target.value })}
                    placeholder="Department"
                  />
                  <input
                    value={winner3.college}
                    onChange={e => setWinner3({ ...winner3, college: e.target.value })}
                    placeholder="College"
                  />
                </div>
                <input
                  value={winner3.award}
                  onChange={e => setWinner3({ ...winner3, award: e.target.value })}
                  placeholder="Award (e.g. ₹10,000 Cash Prize & Bronze Shield)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowWinnersModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  🏆 Save & Publish Official Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
