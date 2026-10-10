import React, { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import ClubLogo from '../../components/ClubLogo'

export default function ClubProfile() {
  const { name } = useParams()
  const { clubs, visibleEvents, achievements, memberships, applyForMembership, instructorsList } = useData()
  const { user } = useAuth()
  const [tab, setTab] = useState('events')
  const [showApplyWizard, setShowApplyWizard] = useState(false)

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1)
  const [formData, setFormData] = useState({
    rollNo: '23CS082',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: '+91 98765 43210',
    rolePreference: 'Core Technical Wing',
    sop: '',
    skills: 'React, Python, System Design',
    agreeGuidelines: false
  })
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [submittedAppId, setSubmittedAppId] = useState('')
  const [wizardError, setWizardError] = useState('')

  const decodedName = decodeURIComponent(name || '')
  const club = clubs.find(c => c.name.toLowerCase() === decodedName.toLowerCase())

  if (!club) return <Navigate to="/student/clubs" replace />

  const leadAdvisor = instructorsList.find(i => i.id === club.leadInstructorId || i.assignedClub?.toLowerCase() === club.name.toLowerCase()) || {
    name: club.leadInstructor,
    dept: "Faculty Department",
    officeRoom: "Faculty Block",
    email: "advisor@college.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
  }

  // Check if current student has a membership application for this club
  const studentEmail = user?.email || 'student@college.edu'

  const isApprovedMember = memberships.some(m =>
    m.clubName.toLowerCase() === club.name.toLowerCase() &&
    m.status === 'approved' &&
    String(m.studentEmail || '').trim().toLowerCase() === studentEmail.toLowerCase()
  )
  const clubEvents = visibleEvents.filter(e => e.club.toLowerCase() === club.name.toLowerCase())
  const clubAchievements = achievements.filter(a => a.club.toLowerCase() === club.name.toLowerCase())

  const myApp = memberships.find(m =>
    m.clubName.toLowerCase() === club.name.toLowerCase() &&
    (m.studentEmail === studentEmail || m.studentName === user?.name || m.studentId === 1001)
  )

  const handleStartApplication = () => {
    setWizardStep(1)
    setFormData({
      rollNo: user?.rollNo || '23CS082',
      dept: user?.dept || 'Computer Science & Engineering',
      year: user?.year || '3rd Year',
      phone: user?.phone || '+91 98765 43210',
      rolePreference: 'Core Technical & Dev Wing',
      sop: '',
      skills: 'React, Python, System Design',
      agreeGuidelines: false
    })
    setPaymentCompleted(false)
    setTransactionId('')
    setSubmittedAppId('')
    setWizardError('')
    setShowApplyWizard(true)
  }

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      const txn = `${paymentMethod.toUpperCase()}/2026/${Math.floor(100000000 + Math.random() * 900000000)}`
      setTransactionId(txn)
      setPaymentCompleted(true)
      setIsProcessingPayment(false)
    }, 800)
  }

  const handleSubmitApplication = () => {
    if (!formData.sop.trim()) {
      setWizardError('Please write a brief statement of purpose explaining why you wish to join.')
      return
    }
    if (!formData.agreeGuidelines) {
      setWizardError('Please agree to the club code of conduct and guidelines.')
      return
    }

    const newApp = applyForMembership({
      clubName: club.name,
      studentId: user?.id || 1001,
      studentName: user?.name || "Ananya Rao",
      studentEmail: user?.email || "student@college.edu",
      rollNo: formData.rollNo,
      dept: formData.dept,
      year: formData.year,
      phone: formData.phone,
      rolePreference: formData.rolePreference,
      sop: formData.sop,
      skills: formData.skills,
      paymentDetails: (club.membershipFee || 0) > 0 ? {
        method: paymentMethod === 'upi' ? 'UPI (QR Code)' : paymentMethod === 'card' ? 'Debit/Credit Card' : 'Net Banking',
        txnId: transactionId || `TXN-${Date.now()}`,
        timestamp: new Date().toLocaleString()
      } : null
    })

    setSubmittedAppId(newApp.id)
    setWizardStep(4)
  }

  return (
    <DashboardLayout role="student">
      <Link to="/student/clubs" className="muted" style={{ fontSize: 12.5, fontWeight: 600, display: 'inline-block', marginBottom: 20 }}>
        ← Back to all clubs
      </Link>

      {/* Club Header Banner */}
      <div className="card" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, var(--card) 0%, rgba(124,58,237,0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: 'var(--purple-soft)', color: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
            }}>
              <ClubLogo clubName={club.name} size={42} />
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, margin: 0 }}>{club.name}</h1>
                <span className={`card-tag ${club.tagClass || 'tag-purple'}`} style={{ margin: 0 }}>{club.cat}</span>
              </div>
              <div className="muted" style={{ fontSize: 13 }}>{club.fullName || `${club.name} Student Society`}</div>
            </div>
          </div>

          <div>
            {myApp ? (
              myApp.status === 'approved' ? (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-approved" style={{ fontSize: 12, padding: '6px 12px' }}>
                    ✓ Official Member
                  </span>
                  <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>
                    ID: MEM-{club.name}-{myApp.rollNo || '101'}
                  </div>
                  {myApp.assignedRole && (
                    <div style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 700, marginTop: 2 }}>
                      {myApp.assignedRole}
                    </div>
                  )}
                </div>
              ) : myApp.status === 'pending' ? (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-pending" style={{ fontSize: 12, padding: '6px 12px' }}>
                    ⏳ Application Under Review
                  </span>
                  <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>
                    Ref: {myApp.id}
                  </div>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={handleStartApplication}>
                  Re-apply for Membership
                </button>
              )
            ) : (
              <button className="btn btn-primary" onClick={handleStartApplication}>
                Join Club & Apply → {club.membershipFee > 0 ? `(₹${club.membershipFee})` : '(Free)'}
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink)', maxWidth: 780, margin: '18px 0 20px' }}>
          {club.longDesc || club.desc}
        </p>

        {/* Lead Faculty Advisor Dossier Strip */}
        <div style={{ padding: '14px 18px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <img src={leadAdvisor.avatar} alt="Advisor" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{leadAdvisor.name}</span>
              <span className="badge tag-amber">Lead Faculty Advisor</span>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              🏛️ {leadAdvisor.dept} · 🚪 {leadAdvisor.officeRoom || 'Faculty Room'} · 📧 {leadAdvisor.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 13, flexWrap: 'wrap' }}>
          <div><span className="stat-num">{club.events}</span> <span className="stat-label">Events</span></div>
          <div><span className="stat-num">{club.members}</span> <span className="stat-label">Active Members</span></div>
          <div><span className="stat-num">{clubAchievements.length}</span> <span className="stat-label">Achievements</span></div>
          <div>
            <span className="stat-num" style={{ color: 'var(--indigo)' }}>
              {club.membershipFee > 0 ? `₹${club.membershipFee}` : 'Free'}
            </span>
            <span className="stat-label">{club.feeFrequency || 'Membership Fee'}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MISSION & VISION OF THE CLUB                                            */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--card) 0%, rgba(59, 130, 246, 0.03) 100%)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>
            🎯
          </div>
          <div>
            <h2 style={{ fontSize: 19, margin: 0, color: 'var(--ink)' }}>{club.name} Mission & Vision</h2>
            <p className="muted" style={{ margin: '2px 0 0', fontSize: 12.5 }}>
              Official charter, institutional purpose, and long-term objectives of {club.fullName || club.name}.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {/* Mission Card */}
          <div style={{
            padding: 20,
            borderRadius: 14,
            background: 'var(--surface-0)',
            border: '1.5px solid rgba(59, 130, 246, 0.25)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>🎯</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Our Mission</div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Action & Commitment</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
              {club.mission || `To promote technical and professional excellence within the ${club.name} chapter through hands-on hackathons, masterclasses, and student project mentorship.`}
            </p>
          </div>

          {/* Vision Card */}
          <div style={{
            padding: 20,
            borderRadius: 14,
            background: 'var(--surface-0)',
            border: '1.5px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>🔭</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Our Vision</div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Future Horizon & Aspirations</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
              {club.vision || `To establish ${club.name} as a premier collegiate society that produces industry-ready leaders, innovators, and laureates recognized in national engineering arenas.`}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CLUB LEADERSHIP DIRECTORY (INSTRUCTOR & STUDENT COORDINATORS)           */}
      {/* ========================================================================= */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🏛️</span>
              <h3 style={{ fontSize: 19, margin: 0, color: 'var(--ink)' }}>Club Leadership & Coordination Council</h3>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: '3px 0 0' }}>
              Official Faculty In-Charge / Instructor and appointed Student Coordinators for {club.name}.
            </p>
          </div>
          <span className="badge tag-indigo" style={{ padding: '6px 12px', fontSize: 11.5 }}>
            Verified Charter Council
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* FACULTY / INSTRUCTOR COORDINATOR CARD */}
          <div style={{
            padding: 20,
            borderRadius: 14,
            border: '2px solid #FDE68A',
            background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.2) 0%, rgba(253, 224, 71, 0.05) 100%)',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start'
          }}>
            <img
              src={club.facultyCoordinator?.avatar || leadAdvisor.avatar}
              alt="Faculty Coordinator"
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F59E0B' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="badge tag-amber" style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                👨‍🏫 Faculty / Instructor Coordinator
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>
                {club.facultyCoordinator?.name || leadAdvisor.name}
              </div>
              <div style={{ fontSize: 12.5, color: '#92400E', fontWeight: 600 }}>
                {club.facultyCoordinator?.designation || "Lead Faculty Advisor"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>
                🏢 <b>Dept:</b> {club.facultyCoordinator?.department || leadAdvisor.dept}<br/>
                📍 <b>Office:</b> {club.facultyCoordinator?.officeRoom || leadAdvisor.officeRoom || "Faculty Block"}<br/>
                ✉️ <b>Email:</b> <a href={`mailto:${club.facultyCoordinator?.email || leadAdvisor.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{club.facultyCoordinator?.email || leadAdvisor.email}</a><br/>
                📞 <b>Contact:</b> {club.facultyCoordinator?.phone || "+91 94432 10987"}
              </div>
            </div>
          </div>

          {/* PRIMARY STUDENT COORDINATOR CARD */}
          <div style={{
            padding: 20,
            borderRadius: 14,
            border: '2px solid #BFDBFE',
            background: 'linear-gradient(135deg, rgba(191, 219, 254, 0.2) 0%, rgba(96, 165, 250, 0.05) 100%)',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start'
          }}>
            <img
              src={club.studentCoordinator?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80"}
              alt="Student Coordinator"
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3B82F6' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="badge tag-indigo" style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                🎓 Lead Student Coordinator
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>
                {club.studentCoordinator?.name || "Rahul K."}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>
                {club.studentCoordinator?.role || "Lead Student Coordinator & President"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>
                🆔 <b>Roll No:</b> {club.studentCoordinator?.rollNo || "22CS104"}<br/>
                📚 <b>Dept / Year:</b> {club.studentCoordinator?.department || "CSE"} • {club.studentCoordinator?.year || "4th Year"}<br/>
                ✉️ <b>Email:</b> <a href={`mailto:${club.studentCoordinator?.email || "rahul.22cs104@college.edu"}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{club.studentCoordinator?.email || "rahul.22cs104@college.edu"}</a><br/>
                📞 <b>Contact:</b> {club.studentCoordinator?.phone || "+91 98765 43210"}
              </div>
            </div>
          </div>

          {/* ASSOCIATE STUDENT COORDINATOR CARD */}
          {club.associateStudentCoordinator && (
            <div style={{
              padding: 20,
              borderRadius: 14,
              border: '1.5px solid #E2E8F0',
              background: 'var(--card)',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start'
            }}>
              <img
                src={club.associateStudentCoordinator.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"}
                alt="Associate Student Coordinator"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="badge tag-purple" style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                  🎓 Associate Student Coordinator
                </div>
                <div style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--ink)', marginBottom: 2 }}>
                  {club.associateStudentCoordinator.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>
                  {club.associateStudentCoordinator.role}
                </div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.45 }}>
                  🆔 <b>Roll No:</b> {club.associateStudentCoordinator.rollNo} • <b>Dept:</b> {club.associateStudentCoordinator.department} ({club.associateStudentCoordinator.year})<br/>
                  ✉️ <b>Email:</b> {club.associateStudentCoordinator.email}<br/>
                  📞 <b>Phone:</b> {club.associateStudentCoordinator.phone || "+91 98765 12345"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Appointed Student Leads */}
        {club.studentTeam && club.studentTeam.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              Additional Appointed Wing Leads & Student Executives ({club.studentTeam.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {club.studentTeam.map((stu, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-0)', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={stu.avatar} alt={stu.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{stu.name}</div>
                    <div className="muted mono" style={{ fontSize: 10.5 }}>{stu.rollNo} • {stu.dept}</div>
                    <span className={`badge ${stu.roleCategory === 'conducting' ? 'tag-purple' : stu.roleCategory === 'managing' ? 'tag-amber' : stu.roleCategory === 'tech' ? 'tag-indigo' : 'tag-slate'}`} style={{ fontSize: 9.5, marginTop: 2 }}>
                      {stu.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs for Events and Achievements */}
      <div className="tabs" style={{ maxWidth: 300, marginBottom: 20 }}>
        <div className={'tab' + (tab === 'events' ? ' active' : '')} onClick={() => setTab('events')}>
          Chapter Events ({clubEvents.length})
        </div>
        <div className={'tab' + (tab === 'achievements' ? ' active' : '')} onClick={() => setTab('achievements')}>
          Achievements ({clubAchievements.length})
        </div>
      </div>

      {tab === 'events' ? (
        clubEvents.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--ink-soft)' }}>
            No upcoming events from {club.name} right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {clubEvents.map(ev => (
              <Link to={`/student/enroll/${ev.id}`} className="card" key={ev.id} style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`card-tag ${ev.tagClass}`}>{ev.tag}</span>
                    {['members_only', 'membership_only', 'club_specific'].includes(ev.accessLevel) && (
                      <span className="badge tag-purple" style={{ fontSize: 9 }}>🔒 Members Only</span>
                    )}
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 600 }}>#{ev.registered} registered</span>
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{ev.title}</h3>
                <div className="muted mono" style={{ fontSize: 11.5, marginBottom: 8 }}>📅 {ev.date} · 📍 {ev.venue}</div>
                <div style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 600 }}>View Event & Pass →</div>
              </Link>
            ))}
          </div>
        )
      ) : (
        clubAchievements.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--ink-soft)' }}>
            No achievements recorded for {club.name} yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {clubAchievements.map((a, i) => (
              <Link to="/student/achievements" className="card" key={i} style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="badge tag-purple">{a.category || 'Triumph'}</span>
                  <span className="mono muted" style={{ fontSize: 11 }}>{a.date}</span>
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{a.title}</h3>
                <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.4, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.summary || a.subtitle}
                </p>
                <div style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>Read Article Story →</div>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Membership Application Wizard Modal */}
      {showApplyWizard && (
        <div className="modal-backdrop" onClick={() => setShowApplyWizard(false)}>
          <div className="wizard-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 20 }}>Join {club.name} Society</h2>
                <div className="muted" style={{ fontSize: 12.5 }}>Official Campus Membership Induction</div>
              </div>
              <button
                onClick={() => setShowApplyWizard(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            {/* Wizard Progress Bar */}
            <div className="wizard-progress">
              <div className={`wizard-step-node ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'completed' : ''}`}>
                <div className="wizard-step-num">{wizardStep > 1 ? '✓' : '1'}</div>
                <span>Profile & SOP</span>
              </div>
              <div style={{ flex: 1, height: 2, background: wizardStep > 1 ? 'var(--green)' : 'var(--border)', margin: '0 8px' }} />

              <div className={`wizard-step-node ${wizardStep === 2 ? 'active' : wizardStep > 2 ? 'completed' : ''}`}>
                <div className="wizard-step-num">{wizardStep > 2 ? '✓' : '2'}</div>
                <span>Wing & Terms</span>
              </div>
              <div style={{ flex: 1, height: 2, background: wizardStep > 2 ? 'var(--green)' : 'var(--border)', margin: '0 8px' }} />

              <div className={`wizard-step-node ${wizardStep === 3 ? 'active' : wizardStep > 3 ? 'completed' : ''}`}>
                <div className="wizard-step-num">{wizardStep > 3 ? '✓' : '3'}</div>
                <span>{club.membershipFee > 0 ? 'Fee Payment' : 'Review'}</span>
              </div>
            </div>

            {wizardError && (
              <div className="note-box" style={{ background: 'var(--danger-soft)', color: 'var(--danger)', marginBottom: 16 }}>
                ⚠️ {wizardError}
              </div>
            )}

            {/* STEP 1: Personal & Academic Details + SOP */}
            {wizardStep === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Full Name</label>
                    <input value={user?.name || 'Ananya Rao'} disabled style={{ background: 'var(--bg)', opacity: 0.8 }} />
                  </div>
                  <div className="field">
                    <label>Roll / Reg No *</label>
                    <input
                      value={formData.rollNo}
                      onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                      placeholder="e.g. 23CS082"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                  <div className="field">
                    <label>Department *</label>
                    <input
                      value={formData.dept}
                      onChange={e => setFormData({ ...formData, dept: e.target.value })}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="field">
                    <label>Year of Study *</label>
                    <select
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Mobile Number *</label>
                  <input
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="field">
                  <label>Statement of Purpose (Why do you want to join?) *</label>
                  <textarea
                    rows={3}
                    value={formData.sop}
                    onChange={e => { setFormData({ ...formData, sop: e.target.value }); setWizardError('') }}
                    placeholder="Describe your motivation, what you wish to contribute or learn in this club..."
                  />
                </div>

                <div className="field">
                  <label>Skills / Projects / Prior Experience</label>
                  <input
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. React, C++, Robotics, Sketching, Event Hosting..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!formData.sop.trim()) {
                        setWizardError('Please enter a brief statement of purpose.')
                        return
                      }
                      setWizardError('')
                      setWizardStep(2)
                    }}
                  >
                    Next: Wing & Guidelines →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Role Preference & Code of Conduct */}
            {wizardStep === 2 && (
              <div>
                <div className="field">
                  <label>Preferred Club Wing / Role *</label>
                  <select
                    value={formData.rolePreference}
                    onChange={e => setFormData({ ...formData, rolePreference: e.target.value })}
                  >
                    <option>Core Technical & Dev Wing</option>
                    <option>Design, UI/UX & Media Wing</option>
                    <option>Hackathon & Event Operations Wing</option>
                    <option>Research & Paper Publication Wing</option>
                    <option>General Volunteer & Mentorship Wing</option>
                  </select>
                </div>

                <div className="note-box" style={{ margin: '16px 0', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>📜 Club Code of Conduct & Attendance Terms:</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
                    <li>Members must maintain at least 75% attendance in official club workshops and sprint sessions.</li>
                    <li>Uphold collaborative spirit, academic integrity, and support junior peers.</li>
                    <li>Official chapter certificates are awarded upon satisfactory term participation.</li>
                  </ul>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 12.5, margin: '16px 0 24px' }}>
                  <input
                    type="checkbox"
                    checked={formData.agreeGuidelines}
                    onChange={e => { setFormData({ ...formData, agreeGuidelines: e.target.checked }); setWizardError('') }}
                    style={{ marginTop: 2, width: 16, height: 16 }}
                  />
                  <span>I agree to the club guidelines and understand that membership is subject to faculty advisor review.</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button className="btn btn-outline" onClick={() => setWizardStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!formData.agreeGuidelines) {
                        setWizardError('Please agree to the guidelines to continue.')
                        return
                      }
                      setWizardError('')
                      setWizardStep(3)
                    }}
                  >
                    Next: {club.membershipFee > 0 ? 'Membership Fee (₹' + club.membershipFee + ') →' : 'Review & Submit →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Membership Fee Payment / Review */}
            {wizardStep === 3 && (
              <div>
                {club.membershipFee > 0 ? (
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Membership Fee Payment</div>
                    <p className="muted" style={{ fontSize: 12.5, margin: '0 0 16px' }}>
                      {club.name} Chapter requires an annual membership fee of <b>₹{club.membershipFee}</b> covering the starter kit, cloud/lab access, and workshop badges.
                    </p>

                    <div className="payment-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 13 }}>Annual Chapter Induction Fee</span>
                        <span className="mono" style={{ fontWeight: 700 }}>₹{club.membershipFee}.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)', fontSize: 12.5, color: 'var(--ink-soft)' }}>
                        <span>Kit & Materials Access Pass</span>
                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>Included</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                        <span>Total Payable</span>
                        <span style={{ color: 'var(--indigo)' }}>₹{club.membershipFee}.00</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', display: 'block', marginBottom: 8 }}>
                        Choose Payment Mode
                      </label>
                      <div
                        className={`payment-method-btn ${paymentMethod === 'upi' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <span>📱</span>
                        <div>
                          <div>UPI Instant Payment (Google Pay / PhonePe / Paytm)</div>
                          <div className="muted" style={{ fontSize: 11 }}>Scan dynamic QR or enter VPA</div>
                        </div>
                      </div>

                      <div
                        className={`payment-method-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <span>💳</span>
                        <div>
                          <div>Debit / Credit Card</div>
                          <div className="muted" style={{ fontSize: 11 }}>Visa, MasterCard, RuPay</div>
                        </div>
                      </div>
                    </div>

                    {paymentCompleted ? (
                      <div style={{ background: 'var(--green-soft)', border: '1px solid #BBF7D0', padding: '12px 16px', borderRadius: 10, color: '#14532D', marginBottom: 18, fontSize: 12.5 }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>✓</span> Payment Verified Successfully!
                        </div>
                        <div className="mono" style={{ fontSize: 11, marginTop: 4 }}>Txn Ref: {transactionId}</div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-block btn-amber"
                        onClick={handleSimulatePayment}
                        disabled={isProcessingPayment}
                        style={{ marginBottom: 18 }}
                      >
                        {isProcessingPayment ? 'Processing simulated gateway...' : `Simulate Pay ₹${club.membershipFee} (${paymentMethod.toUpperCase()})`}
                      </button>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button className="btn btn-outline" onClick={() => setWizardStep(2)}>← Back</button>
                      <button
                        className={'btn ' + (paymentCompleted ? 'btn-primary' : 'btn-disabled')}
                        onClick={handleSubmitApplication}
                        disabled={!paymentCompleted}
                      >
                        Complete & Submit Dossier →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Review Free Membership Application</div>
                    <p className="muted" style={{ fontSize: 12.5, margin: '0 0 16px' }}>
                      {club.name} is a zero-fee student chapter. Please review your submission before sending it to Faculty Advisor <b>{leadAdvisor.name}</b>.
                    </p>

                    <div className="card" style={{ background: 'var(--bg)', padding: 16, marginBottom: 20, fontSize: 13 }}>
                      <div style={{ marginBottom: 6 }}><b>Applicant:</b> {user?.name} ({formData.rollNo})</div>
                      <div style={{ marginBottom: 6 }}><b>Department:</b> {formData.dept} · {formData.year}</div>
                      <div style={{ marginBottom: 6 }}><b>Wing:</b> {formData.rolePreference}</div>
                      <div style={{ marginBottom: 6 }}><b>Fee:</b> <span style={{ color: 'var(--green)', fontWeight: 700 }}>Free Membership</span></div>
                      <div style={{ marginTop: 8, fontStyle: 'italic', color: 'var(--ink-soft)' }}>"{formData.sop}"</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button className="btn btn-outline" onClick={() => setWizardStep(2)}>← Back</button>
                      <button className="btn btn-primary" onClick={handleSubmitApplication}>
                        Submit Membership Application →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Success & Tracking Pass */}
            {wizardStep === 4 && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div className="checkmark" style={{ margin: '0 auto 16px' }}>✓</div>
                <h3 style={{ fontSize: 22, marginBottom: 6 }}>Application Dossier Submitted!</h3>
                <p className="muted" style={{ fontSize: 13.5, maxWidth: 420, margin: '0 auto 18px', lineHeight: 1.6 }}>
                  Your application for <b>{club.name} Chapter</b> has been logged with Reference ID <b>{submittedAppId}</b>.
                </p>

                <div className="note-box" style={{ textAlign: 'left', margin: '0 auto 20px', maxWidth: 420 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>🔔 What happens next?</div>
                  <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    Faculty Advisor <b>{leadAdvisor.name}</b> has received an immediate notification. Once reviewed, you will see your Official Member ID Card here and in your profile.
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowApplyWizard(false)}
                >
                  Return to Club Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
