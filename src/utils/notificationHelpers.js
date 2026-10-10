// ==============================================================================
// CAMPUS EVENT HUB - MULTI-CHANNEL NOTIFICATION UTILITIES
// Unified WhatsApp, SMS, and Email direct dispatch & action link generator
// ==============================================================================

export function cleanPhoneNumber(phone) {
  let clean = (phone || '').replace(/[^0-9]/g, '')
  if (!clean) clean = '919876543210'
  // If standard 10-digit Indian number without country code, prepend 91
  if (clean.length === 10) {
    clean = '91' + clean
  }
  return clean
}

export function formatWhatsAppUrl(phone, message) {
  const clean = cleanPhoneNumber(phone)
  return `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(message || '')}`
}

export function formatSmsUrl(phone, message) {
  const clean = cleanPhoneNumber(phone)
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const separator = isIOS ? '&' : '?'
  return `sms:+${clean}${separator}body=${encodeURIComponent(message || '')}`
}

export function formatEmailUrls(email, subject, body) {
  const recipient = email || 'student@college.edu'
  const mailSubject = subject || 'Official OD / Campus Notification - Campus Event Hub'
  const mailBody = body || ''

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  return { gmailUrl, mailtoUrl }
}

export function openExternalWhatsApp(phone, message) {
  const url = formatWhatsAppUrl(phone, message)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openExternalSms(phone, message) {
  const url = formatSmsUrl(phone, message)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message || '').catch(() => {})
  }
  window.location.href = url
}

export function openExternalEmail(email, subject, body) {
  const { gmailUrl, mailtoUrl } = formatEmailUrls(email, subject, body)
  const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = mailtoUrl
  }
}

export const OD_MESSAGE_TEMPLATES = [
  {
    id: 'od_approval',
    name: 'OD Permission Approved ✅',
    subject: 'Official OD Permission Approved',
    channelType: 'od_approval_alert',
    generate: (studentName, eventName, remarks) =>
      `🎉 Great news ${studentName || 'Student'}! Your On-Duty (OD) permission for "${eventName || 'Campus Event'}" has been APPROVED by the Faculty OD Clearance Desk.\n\n` +
      `Remarks: ${remarks || 'Approved for college attendance credit. Ensure you attend the event and upload participation proof to claim your official OD pass.'}\n\n` +
      `Institutional Event & OD Cell`
  },
  {
    id: 'od_pass_issued',
    name: 'Official OD Pass Sanctioned 🎖️',
    subject: 'Official On-Duty Pass Sanctioned',
    channelType: 'od_pass_issued',
    generate: (studentName, eventName, passId, days = 1) =>
      `🎖️ Official OD Sanction: Dear ${studentName || 'Student'}, your verified On-Duty pass for "${eventName || 'Event'}" is sanctioned.\n\n` +
      `Pass ID: ${passId || 'OD-2026-PASS-XXXX'}\n` +
      `Attendance Credit: ${days} Day(s) Approved.\n\n` +
      `Dean of Academic Affairs & Faculty OD Desk`
  },
  {
    id: 'proof_reminder',
    name: 'Participation Proof Required 📷',
    subject: 'Action Required: Upload OD Participation Proof',
    channelType: 'proof_reminder',
    generate: (studentName, eventName) =>
      `⚠️ Action Required: Hello ${studentName || 'Student'}. Your event "${eventName || 'Event'}" is completed. ` +
      `Please upload your certificate/photos on Campus Event Hub under 'Proof Verification' to sanction your official OD pass.`
  },
  {
    id: 'action_required',
    name: 'OD Request Clarification Required ⚠️',
    subject: 'OD Request Clarification Notice',
    channelType: 'action_required',
    generate: (studentName, eventName, note) =>
      `⚠️ Hello ${studentName || 'Student'}, additional details or an authorized invitation letter are required for your OD request for "${eventName || 'Event'}".\n\n` +
      `Faculty Note: ${note || 'Please update your request with proper documentation.'}\n\n` +
      `Faculty OD Review Desk`
  },
  {
    id: 'event_reminder',
    name: 'Upcoming Event Check-In Reminder ⏰',
    subject: 'Campus Event Check-in Reminder',
    channelType: 'event_reminder',
    generate: (studentName, eventName, venue, pin) =>
      `⏰ Reminder: Dear ${studentName || 'Student'}, "${eventName || 'Event'}" starts soon at ${venue || 'Campus Auditorium'}. ` +
      `Keep your digital ticket and venue check-in PIN ready: ${pin || '****'}.`
  },
  {
    id: 'custom',
    name: 'Custom Institutional Notice ✍️',
    subject: 'Official Campus Notice',
    channelType: 'general_alert',
    generate: (studentName, message) =>
      `Dear ${studentName || 'Student'},\n\n${message || 'Important update regarding your campus activity.'}\n\nOffice of OD & Student Affairs`
  }
]
