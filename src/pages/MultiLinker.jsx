import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useI18n } from '../context/I18nContext'
import { api } from '../utils/apiClient'
import SearchInput from '../components/SearchInput'

const CHANNEL_CONFIG = {
  all: { label: 'All Channels', icon: '📋', color: 'var(--ink)' },
  whatsapp: { label: 'WhatsApp', icon: '🟢', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
  sms: { label: 'SMS Text', icon: '💬', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)' },
  email: { label: 'Official Email', icon: '✉️', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.1)' },
}

const TEMPLATES = [
  {
    id: 'od_approved',
    name: '✅ OD Request Approved',
    channel: 'all',
    title: 'OD Clearance Sanctioned',
    message: (student, event, passNo, remarks) =>
      `🎉 Great news ${student || 'Student'}! Your OD request for "${event || 'National Hackathon 2026'}" has been APPROVED. Official Pass #: ${passNo || 'OD-2026-PASS-98412'}. Remarks: ${remarks || 'Approved for official attendance credit.'}`
  },
  {
    id: 'od_issued',
    name: '🎖️ Official OD Pass Issued',
    channel: 'all',
    title: 'Official On-Duty Credential Credited',
    message: (student, event, passNo) =>
      `🎖️ Congratulations ${student || 'Student'}! Your Official OD Pass #${passNo || 'OD-2026-4512'} for "${event || 'Technical Symposium'}" has been ISSUED. Academic attendance is formally updated.`
  },
  {
    id: 'event_reminder',
    name: '⏰ Event Check-in Reminder',
    channel: 'sms',
    title: 'Event Attendance Check-in Reminder',
    message: (student, event) =>
      `CEH ALERT: Reminder for ${student || 'Student'}: "${event || 'HackElite 2026'}" begins tomorrow at 9:00 AM. Please keep your QR pass ready.`
  },
  {
    id: 'winner_laurels',
    name: '🏆 Achievement / Winner Laurels',
    channel: 'all',
    title: 'Victory & Prize Announcement',
    message: (student, event, prize, award) =>
      `🏆 Congratulations ${student || 'Champion'}! You have been awarded ${prize || 'First Prize 🥇'} in "${event || 'Inter College Coding Competition'}". Award: ${award || 'Cash Prize & Gold Medal'}. Your victory is published in the campus Achievements directory!`
  },
  {
    id: 'event_registered',
    name: '🎟️ Event Registration Ticket',
    channel: 'all',
    title: 'Registration Confirmed',
    message: (student, event, pin) =>
      `🎟️ Enrollment Confirmed: ${student || 'Student'} is registered for "${event || 'National Hackathon 2026'}". Venue Check-in PIN: ${pin || '4821'}. Keep your QR ticket handy for check-in.`
  },
  {
    id: 'od_rejected',
    name: '❌ OD Request Review Notice',
    channel: 'all',
    title: 'OD Clearance Notice',
    message: (student, event, passNo, remarks) =>
      `Notice for ${student || 'Student'}: Your OD application for "${event || 'External Event'}" could not be sanctioned at this time. Reason: ${remarks || 'Supporting documentation required.'}`
  },
  {
    id: 'custom_alert',
    name: '📢 Custom Institutional Notice',
    channel: 'all',
    title: 'Campus Notification',
    message: (student) =>
      `Notice for ${student || 'Student'}: Please verify your institutional profile details and upload event certificates.`
  }
]

export default function MultiLinker() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t } = useI18n()

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'whatsapp' | 'sms' | 'email' | 'workflow' | 'legacy_links'
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Legacy Links (Keeps existing DB collection fully functional without affecting DB schema)
  const [legacyLinks, setLegacyLinks] = useState([])
  const [loadingLinks, setLoadingLinks] = useState(false)

  // Manual Dispatch Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [dispatchForm, setDispatchForm] = useState({
    recipientName: 'Ananya Rao',
    recipientEmail: 'student@college.edu',
    recipientPhone: '+91 98765 43210',
    channels: ['whatsapp', 'sms', 'email'],
    title: 'OD Clearance Sanctioned - Hackathon 2026',
    message: '🎉 Great news Ananya Rao! Your OD request for "National Smart India Hackathon" has been APPROVED by Chief OD In-Charge. Official Pass #: OD-2026-PASS-9104. Academic attendance credited.',
    type: 'od_approval_alert'
  })
  const [isDispatching, setIsDispatching] = useState(false)

  // Preview Email Modal
  const [previewNotif, setPreviewNotif] = useState(null)

  const role = user?.role || 'student'
  const isStudent = role === 'student'

  // Fetch Notifications
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.getNotifications(100)
      if (res?.data) {
        setNotifications(res.data)
      }
    } catch (err) {
      console.warn('Falling back to local notification store:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Legacy Links (preserving DB compatibility)
  const fetchLegacyLinks = async () => {
    setLoadingLinks(true)
    try {
      const res = await api.getLinks()
      if (res?.data) {
        setLegacyLinks(res.data)
      }
    } catch (err) {
      console.warn('Error fetching legacy links:', err)
    } finally {
      setLoadingLinks(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchLegacyLinks()
  }, [])

  // Filtered Notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeTab !== 'all' && activeTab !== 'workflow' && activeTab !== 'legacy_links') {
      if ((n.channel || '').toLowerCase() !== activeTab) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchRecipient = (n.recipientEmail || '').toLowerCase().includes(q) || (n.recipientPhone || '').toLowerCase().includes(q)
      const matchTitle = (n.title || '').toLowerCase().includes(q)
      const matchMsg = (n.message || '').toLowerCase().includes(q)
      const matchChannel = (n.channel || '').toLowerCase().includes(q)
      if (!matchRecipient && !matchTitle && !matchMsg && !matchChannel) return false
    }
    return true
  })

  // Channel Counts
  const counts = {
    all: notifications.length,
    whatsapp: notifications.filter(n => (n.channel || '').toLowerCase() === 'whatsapp').length,
    sms: notifications.filter(n => (n.channel || '').toLowerCase() === 'sms').length,
    email: notifications.filter(n => (n.channel || '').toLowerCase() === 'email').length,
  }

  // Handle Manual Dispatch
  const handleDispatch = async (e) => {
    e.preventDefault()
    if (!dispatchForm.recipientEmail && !dispatchForm.recipientPhone) {
      showToast('Please provide a recipient email or phone number.', 'error')
      return
    }
    if (!dispatchForm.message.trim()) {
      showToast('Message body cannot be empty.', 'error')
      return
    }
    if (dispatchForm.channels.length === 0) {
      showToast('Please select at least one delivery channel.', 'error')
      return
    }

    setIsDispatching(true)
    try {
      for (const ch of dispatchForm.channels) {
        await api.dispatchNotification({
          recipientEmail: dispatchForm.recipientEmail,
          recipientPhone: dispatchForm.recipientPhone,
          channel: ch,
          type: dispatchForm.type || 'general_alert',
          title: dispatchForm.title || 'Campus Notification',
          message: dispatchForm.message,
          status: 'delivered'
        })
      }
      showToast(`Dispatched alert across ${dispatchForm.channels.join(', ').toUpperCase()}!`, 'success')
      setShowDispatchModal(false)
      fetchNotifications()
    } catch (err) {
      showToast(err.message || 'Error dispatching notification.', 'error')
    } finally {
      setIsDispatching(false)
    }
  }

  const handleCopyMessage = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast('Message copied to clipboard!', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openWhatsAppDirect = (phone, text) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '')
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone || '919876543210'}&text=${encodeURIComponent(text || '')}`
    window.open(url, '_blank', 'noopener,noreferrer')
    showToast('Opening WhatsApp with pre-filled message...', 'info')
  }

  const openSmsDirect = (phone, text) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '') || '919876543210'
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const separator = isIOS ? '&' : '?'
    const smsUrl = `sms:${cleanPhone}${separator}body=${encodeURIComponent(text || '')}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text || '')
    }

    window.location.href = smsUrl
    showToast(`Opening SMS app for +${cleanPhone}...`, 'info')
  }

  const openEmailDirect = (email, subject, text) => {
    const recipient = email || 'student@college.edu'
    const mailSubject = subject || 'Official OD / Event Notification - Campus Event Hub'
    const mailBody = text || ''

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl
    }
    showToast(`Opening Email composer for ${recipient}...`, 'info')
  }

  const handleApplyTemplate = (tmpl) => {
    let text = ''
    if (tmpl.id === 'winner_laurels') {
      text = tmpl.message(dispatchForm.recipientName, 'Inter College Coding Competition', 'First Prize 🥇', '₹10,000 Cash Prize & Gold Medal')
    } else if (tmpl.id === 'event_registered') {
      text = tmpl.message(dispatchForm.recipientName, 'Smart India Hackathon 2026', '4821')
    } else if (tmpl.id === 'od_rejected') {
      text = tmpl.message(dispatchForm.recipientName, 'National Symposium', 'REF-902', 'External event permission letter not attached.')
    } else {
      text = tmpl.message(dispatchForm.recipientName, 'Smart India Hackathon 2026', 'OD-2026-PASS-8841', 'Approved for attendance credit')
    }
    setDispatchForm(prev => ({
      ...prev,
      title: tmpl.title,
      message: text,
      type: tmpl.id === 'od_approved' ? 'od_approval_alert' : tmpl.id === 'od_issued' ? 'od_issued_alert' : tmpl.id === 'winner_laurels' ? 'winner_announcement' : tmpl.id === 'event_registered' ? 'event_registration' : 'general_alert'
    }))
    showToast(`Loaded "${tmpl.name}" template.`, 'info')
  }

  return (
    <DashboardLayout role={role}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>
              📲 {t('nav.notificationsHub', 'Multi-Channel Alerts (WhatsApp • SMS • Email)')}
            </h1>
            <span className="badge tag-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
              Real-time Multi-Notifier
            </span>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            Automated notification engine: When OD and event requests are accepted, real-time messages are dispatched to the student's WhatsApp, SMS, and Email.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`btn btn-sm ${activeTab === 'workflow' ? 'btn-primary' : 'btn-outline'}`}
          >
            ⚡ How Acceptance Alerts Work
          </button>
          {!isStudent && (
            <button
              onClick={() => setShowDispatchModal(true)}
              className="btn btn-primary btn-sm"
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
            >
              + Dispatch Notification
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="btn btn-outline btn-sm"
            title="Refresh feed"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Acceptance Notification Explainer Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ maxWidth: 750 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14.5, color: 'var(--ink)', marginBottom: 4 }}>
            <span>✅ Automated Request Acceptance Workflow Active</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            Whenever an OD request or event permission is <strong>accepted / approved</strong> by Faculty or OD In-Charge, the system dispatches 3 instant notifications using the student's details:
            <strong> WhatsApp message</strong> to their phone number, <strong>SMS text alert</strong>, and an official <strong>Email confirmation</strong> with pass numbers and remarks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge tag-green" style={{ fontSize: 12 }}>🟢 WhatsApp Active</span>
          <span className="badge tag-teal" style={{ fontSize: 12 }}>💬 SMS Active</span>
          <span className="badge tag-purple" style={{ fontSize: 12 }}>✉️ Email Active</span>
        </div>
      </div>

      {/* Channel Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: activeTab === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
            background: activeTab === 'all' ? 'var(--primary-soft)' : 'var(--surface-1)',
            color: activeTab === 'all' ? 'var(--primary)' : 'var(--ink)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          📋 All Channels ({counts.all})
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: activeTab === 'whatsapp' ? '1px solid #16a34a' : '1px solid var(--border)',
            background: activeTab === 'whatsapp' ? 'rgba(22, 163, 74, 0.15)' : 'var(--surface-1)',
            color: activeTab === 'whatsapp' ? '#16a34a' : 'var(--ink)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          🟢 WhatsApp ({counts.whatsapp})
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: activeTab === 'sms' ? '1px solid #0284c7' : '1px solid var(--border)',
            background: activeTab === 'sms' ? 'rgba(2, 132, 199, 0.15)' : 'var(--surface-1)',
            color: activeTab === 'sms' ? '#0284c7' : 'var(--ink)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          💬 SMS ({counts.sms})
        </button>

        <button
          onClick={() => setActiveTab('email')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: activeTab === 'email' ? '1px solid #9333ea' : '1px solid var(--border)',
            background: activeTab === 'email' ? 'rgba(147, 51, 234, 0.15)' : 'var(--surface-1)',
            color: activeTab === 'email' ? '#9333ea' : 'var(--ink)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          ✉️ Email ({counts.email})
        </button>

        <button
          onClick={() => setActiveTab('legacy_links')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: activeTab === 'legacy_links' ? '1px solid var(--border)' : '1px solid transparent',
            background: activeTab === 'legacy_links' ? 'var(--surface-2)' : 'transparent',
            color: 'var(--ink-soft)',
            cursor: 'pointer',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          title="Preserved Campus Web Portals Directory"
        >
          📚 Campus Web Portals ({legacyLinks.length})
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'workflow' ? (
        /* Explainer Tab */
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, margin: '0 0 8px' }}>⚡ How Request Acceptance Triggers Notifications</h2>
          <p className="muted" style={{ margin: '0 0 24px', fontSize: 13.5 }}>
            Here is the complete end-to-end automated notification cycle implemented in your campus portal without altering the database schema:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            <div style={{ padding: 18, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📝</div>
              <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>Step 1: Student Request</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>
                Student submits an On-Duty (OD) request for a hackathon, seminar, or symposium. The system registers their student email and phone number (+91 98765 43210).
              </p>
            </div>

            <div style={{ padding: 18, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>Step 2: Faculty / OD Approval</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>
                OD In-Charge reviews the request in the OD Desk and clicks <strong>"Confirm Approval"</strong>. Official pass number is generated and remarks are logged.
              </p>
            </div>

            <div style={{ padding: 18, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📲</div>
              <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>Step 3: Multi-Channel Dispatch</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>
                Server triggers 3 simultaneous dispatches:
                <br />• <strong>WhatsApp:</strong> Direct alert with pass details and click-to-chat.
                <br />• <strong>SMS:</strong> Instant mobile text notification.
                <br />• <strong>Email:</strong> Formal official clearance confirmation.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button onClick={() => setActiveTab('all')} className="btn btn-primary btn-sm">
              ← View Live Notifications Feed
            </button>
          </div>
        </div>
      ) : activeTab === 'legacy_links' ? (
        /* Legacy Links Directory Tab (Fully Preserved) */
        <div>
          <div className="card" style={{ padding: 18, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, margin: '0 0 4px' }}>📚 Campus Web Portals Directory</h3>
            <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
              These authorized campus web links are preserved directly from the database without any schema changes.
            </p>
          </div>

          {loadingLinks ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>Loading campus portals...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {legacyLinks.map(link => (
                <div key={link.id} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{link.icon || '🔗'}</span>
                      <h4 style={{ margin: 0, fontSize: 15 }}>{link.title}</h4>
                    </div>
                    <span className="badge tag-indigo" style={{ fontSize: 10.5, marginBottom: 8, display: 'inline-block' }}>{link.category}</span>
                    <p className="muted" style={{ fontSize: 12.5, margin: '0 0 12px', lineHeight: 1.5 }}>{link.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>{link.url.slice(0, 30)}...</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-xs" style={{ textDecoration: 'none' }}>
                      Open ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Live Notifications Feed */
        <div>
          {/* Search Filter */}
          <div className="card" style={{ padding: 14, marginBottom: 20 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search notifications by recipient name, email, phone number, title, or message..."
            />
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>Loading notifications feed...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <h3 style={{ margin: '0 0 6px' }}>No notifications found</h3>
              <p className="muted" style={{ margin: 0 }}>
                {search ? 'Try clearing your search term.' : 'Dispatched alerts will appear here when OD requests are accepted.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredNotifications.map(n => {
                const channel = (n.channel || 'email').toLowerCase()
                const config = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.email
                const isWhatsApp = channel === 'whatsapp'
                const isSms = channel === 'sms'
                const isEmail = channel === 'email'

                return (
                  <div
                    key={n.id}
                    className="card"
                    style={{
                      padding: 18,
                      borderLeft: `4px solid ${config.color}`,
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 20,
                            background: config.bg,
                            color: config.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          {config.icon} {config.label}
                        </span>

                        <h3 style={{ fontSize: 15, margin: 0, color: 'var(--ink)' }}>
                          {n.title || 'Campus Notification'}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge tag-green" style={{ fontSize: 10.5 }}>
                          ✓ {n.status || 'delivered'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                          {n.timestamp ? new Date(n.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Recipient Details */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
                      {n.recipientEmail && (
                        <span>
                          ✉️ <strong>Email:</strong> {n.recipientEmail}
                        </span>
                      )}
                      {n.recipientPhone && (
                        <span>
                          📱 <strong>Phone:</strong> {n.recipientPhone}
                        </span>
                      )}
                      {n.type && (
                        <span>
                          🏷️ <strong>Type:</strong> {n.type.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        background: isWhatsApp ? 'rgba(22, 163, 74, 0.05)' : isSms ? 'rgba(2, 132, 199, 0.05)' : 'var(--surface-2)',
                        border: isWhatsApp ? '1px solid rgba(22, 163, 74, 0.2)' : isSms ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid var(--border)',
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: 'var(--ink)',
                        whiteSpace: 'pre-wrap',
                        marginBottom: 12
                      }}
                    >
                      {n.message}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                      <button
                        onClick={() => handleCopyMessage(n.message, n.id)}
                        className="btn btn-outline btn-xs"
                      >
                        {copiedId === n.id ? '✓ Copied' : '📋 Copy Text'}
                      </button>

                      {/* WhatsApp Direct Open */}
                      {(isWhatsApp || n.recipientPhone) && (
                        <button
                          onClick={() => openWhatsAppDirect(n.recipientPhone, n.message)}
                          className="btn btn-xs"
                          style={{ background: '#16a34a', color: '#fff', border: 'none' }}
                          title="Open WhatsApp Web / Chat with recipient"
                        >
                          🟢 Open in WhatsApp
                        </button>
                      )}

                      {/* SMS Direct Open */}
                      {(isSms || n.recipientPhone) && (
                        <button
                          onClick={() => openSmsDirect(n.recipientPhone, n.message)}
                          className="btn btn-xs"
                          style={{ background: '#0284c7', color: '#fff', border: 'none' }}
                          title="Open SMS messenger app with pre-filled message"
                        >
                          💬 Open in SMS
                        </button>
                      )}

                      {/* Email Direct Open */}
                      {(isEmail || n.recipientEmail) && (
                        <button
                          onClick={() => openEmailDirect(n.recipientEmail, n.title, n.message)}
                          className="btn btn-xs"
                          style={{ background: '#ea4335', color: '#fff', border: 'none' }}
                          title="Open in Gmail / Email Client"
                        >
                          ✉️ Open in Email
                        </button>
                      )}

                      {/* Email Card Preview */}
                      {isEmail && (
                        <button
                          onClick={() => setPreviewNotif(n)}
                          className="btn btn-outline btn-xs"
                          title="View formatted HTML Email card"
                        >
                          👁️ View Card
                        </button>
                      )}

                      {/* Resend Simulation */}
                      {!isStudent && (
                        <button
                          onClick={() => {
                            showToast(`Simulated instant re-dispatch to ${n.recipientPhone || n.recipientEmail} via ${config.label}!`, 'success')
                          }}
                          className="btn btn-outline btn-xs"
                        >
                          🔄 Resend
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Manual Dispatch Modal */}
      {showDispatchModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>📲 Dispatch Multi-Channel Notification</h3>
              <button
                onClick={() => setShowDispatchModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Templates */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>
                LOAD AN ACCEPTANCE TEMPLATE:
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="btn btn-outline btn-xs"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleDispatch}>
              {/* Student Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                    Student Name:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.recipientName}
                    onChange={e => setDispatchForm(prev => ({ ...prev, recipientName: e.target.value }))}
                    className="input"
                    style={{ width: '100%', padding: 8, fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                    Recipient Phone (WhatsApp & SMS):
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.recipientPhone}
                    onChange={e => setDispatchForm(prev => ({ ...prev, recipientPhone: e.target.value }))}
                    className="input"
                    style={{ width: '100%', padding: 8, fontSize: 13 }}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Recipient Email:
                </label>
                <input
                  type="email"
                  value={dispatchForm.recipientEmail}
                  onChange={e => setDispatchForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  className="input"
                  style={{ width: '100%', padding: 8, fontSize: 13 }}
                  placeholder="student@college.edu"
                  required
                />
              </div>

              {/* Channels Selector */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>
                  Delivery Channels:
                </label>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['whatsapp', 'sms', 'email'].map(ch => {
                    const isChecked = dispatchForm.channels.includes(ch)
                    return (
                      <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setDispatchForm(prev => ({ ...prev, channels: prev.channels.filter(c => c !== ch) }))
                            } else {
                              setDispatchForm(prev => ({ ...prev, channels: [...prev.channels, ch] }))
                            }
                          }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>
                          {ch === 'whatsapp' ? '🟢 WhatsApp' : ch === 'sms' ? '💬 SMS' : '✉️ Email'}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Notification Subject / Header:
                </label>
                <input
                  type="text"
                  value={dispatchForm.title}
                  onChange={e => setDispatchForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                  style={{ width: '100%', padding: 8, fontSize: 13 }}
                  required
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Notification Message:
                </label>
                <textarea
                  rows={4}
                  value={dispatchForm.message}
                  onChange={e => setDispatchForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-1)',
                    color: 'var(--ink)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="btn btn-outline btn-sm"
                  disabled={isDispatching}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#16a34a', borderColor: '#16a34a' }}
                  disabled={isDispatching}
                >
                  {isDispatching ? 'Dispatching...' : '🚀 Dispatch Alerts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {previewNotif && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 520, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>✉️</span>
                <h3 style={{ fontSize: 16, margin: 0 }}>Official Email Notification Preview</h3>
              </div>
              <button
                onClick={() => setPreviewNotif(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: 'var(--surface-1)',
              color: 'var(--ink)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              padding: 20,
              fontFamily: 'Inter, system-ui, sans-serif',
              marginBottom: 16
            }}>
              <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Institutional On-Duty & Event Portal
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                  {previewNotif.title}
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
                <strong>To:</strong> {previewNotif.recipientEmail} | <strong>Status:</strong> Delivered
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>
                {previewNotif.message}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 10, fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center' }}>
                This is an automated institutional notification dispatched by Campus Event Hub.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => openEmailDirect(previewNotif.recipientEmail, previewNotif.title, previewNotif.message)}
                className="btn btn-sm"
                style={{ background: '#ea4335', color: '#fff', border: 'none' }}
              >
                ✉️ Open in Gmail / Email Client
              </button>
              <button onClick={() => setPreviewNotif(null)} className="btn btn-outline btn-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
