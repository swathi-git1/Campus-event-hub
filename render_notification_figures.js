import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

function getBaseHtml({ activeTab, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Campus Event Hub - Multi-Channel Notification Dispatches</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #F8F5EE;
      --surface-0: #FFFFFF;
      --surface-1: #F4EFE6;
      --surface-2: #EFE8DC;
      --ink: #1C1917;
      --ink-soft: #57534E;
      --muted: #8F877B;
      --border: #E5DEC9;
      --primary: #B85024;
      --primary-soft: #FDEEE4;
      --green: #15803D;
      --green-soft: #DCFCE7;
      --blue: #0284C7;
      --blue-soft: #E0F2FE;
      --purple: #7E22CE;
      --purple-soft: #F3E8FF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--ink);
      display: flex;
      min-height: 100vh;
      width: 1366px;
      height: 768px;
      overflow: hidden;
    }
    /* SIDEBAR */
    .sidebar {
      width: 250px;
      background: var(--surface-0);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .brand {
      padding: 18px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
    }
    .brand-text {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: var(--ink);
    }
    .brand-sub {
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .nav-list {
      list-style: none;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--ink-soft);
      border-radius: 6px;
      cursor: pointer;
    }
    .nav-item.active {
      background: var(--primary-soft);
      color: var(--primary);
      font-weight: 700;
    }
    .nav-item svg { width: 16px; height: 16px; stroke-width: 2; }
    
    /* MAIN CONTENT */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .topbar {
      height: 58px;
      background: var(--surface-0);
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .search-box {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      color: var(--muted);
      width: 280px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
    }
    .content-area {
      flex: 1;
      padding: 22px 28px;
      overflow-y: auto;
    }
    
    /* HEADER BANNER */
    .page-header {
      background: var(--surface-0);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-header h1 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin-bottom: 3px;
      color: var(--ink);
    }
    .page-header p {
      font-size: 12px;
      color: var(--ink-soft);
    }
    .gateways-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .badge-green { background: var(--green-soft); color: var(--green); border: 1px solid rgba(21, 128, 61, 0.2); }
    .badge-blue { background: var(--blue-soft); color: var(--blue); border: 1px solid rgba(2, 132, 199, 0.2); }
    .badge-purple { background: var(--purple-soft); color: var(--purple); border: 1px solid rgba(126, 34, 206, 0.2); }
    
    /* TABS */
    .tabs-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
    }
    .tab-btn {
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--surface-0);
      color: var(--ink-soft);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tab-btn.active-all { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
    .tab-btn.active-whatsapp { background: var(--green-soft); color: var(--green); border-color: var(--green); }
    .tab-btn.active-sms { background: var(--blue-soft); color: var(--blue); border-color: var(--blue); }
    .tab-btn.active-email { background: var(--purple-soft); color: var(--purple); border-color: var(--purple); }
    
    /* DISPATCH CARDS */
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card {
      background: var(--surface-0);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .card-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
    }
    .card-meta {
      display: flex;
      gap: 16px;
      font-size: 11.5px;
      color: var(--ink-soft);
      margin-bottom: 10px;
    }
    .msg-bubble {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      line-height: 1.55;
      margin-bottom: 10px;
      white-space: pre-wrap;
    }
    .msg-bubble-wa {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      font-family: system-ui, -apple-system;
      color: #14532D;
    }
    .msg-bubble-sms {
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: #0369A1;
    }
    .msg-bubble-email {
      background: #FAF5FF;
      border: 1px solid #E9D5FF;
      color: #581C87;
    }
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid var(--border);
      padding-top: 8px;
    }
    .btn {
      padding: 5px 12px;
      font-size: 11.5px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .btn-wa { background: #16A34A; color: white; }
    .btn-sms { background: #0284C7; color: white; }
    .btn-email { background: #7E22CE; color: white; }
    .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--ink-soft); }
  </style>
</head>
<body>
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">CEH</div>
      <div>
        <div class="brand-text">CAMPUS EVENT HUB</div>
        <div class="brand-sub">INSTITUTIONAL SUITE</div>
      </div>
    </div>
    <ul class="nav-list">
      <li class="nav-item">📊 Dashboard</li>
      <li class="nav-item">🎟️ Event Discovery & Passes</li>
      <li class="nav-item">📋 My Registrations</li>
      <li class="nav-item">🏛️ Campus Clubs & Chapters</li>
      <li class="nav-item">🏆 Hall of Fame & Laurels</li>
      <li class="nav-item active">📲 Multi-Channel Alerts</li>
      <li class="nav-item">📝 OD Leave Permission Desk</li>
      <li class="nav-item">⚙️ Settings & Domain Policy</li>
    </ul>
  </aside>

  <!-- MAIN -->
  <main class="main">
    <header class="topbar">
      <div class="topbar-left">
        <div class="search-box">🔍 Search dispatches, roll no, mobile...</div>
      </div>
      <div class="topbar-right">
        <span style="font-size: 12px; color: var(--ink-soft);">🔔 Notifications (Active)</span>
        <div class="user-pill">
          <div class="avatar">GS</div>
          <span>Gomathi S (Admin)</span>
        </div>
      </div>
    </header>

    <div class="content-area">
      <!-- HEADER BANNER -->
      <div class="page-header">
        <div>
          <h1>Multi-Channel Notification Dispatches</h1>
          <p>Automated real-time transactional alert stream across WhatsApp, SMS, and Email gateways</p>
        </div>
        <div class="gateways-status">
          <span class="badge badge-green">🟢 WhatsApp Active</span>
          <span class="badge badge-blue">💬 SMS Gateway Active</span>
          <span class="badge badge-purple">✉️ SMTP Active</span>
        </div>
      </div>

      <!-- TABS -->
      <div class="tabs-bar">
        <button class="tab-btn ${activeTab === 'all' ? 'active-all' : ''}">📋 All Channels (12)</button>
        <button class="tab-btn ${activeTab === 'whatsapp' ? 'active-whatsapp' : ''}">🟢 WhatsApp Direct (5)</button>
        <button class="tab-btn ${activeTab === 'sms' ? 'active-sms' : ''}">💬 SMS Gateway (3)</button>
        <button class="tab-btn ${activeTab === 'email' ? 'active-email' : ''}">✉️ Email Dispatches (4)</button>
      </div>

      <!-- INJECTED VIEW CONTENT -->
      ${contentHtml}
    </div>
  </main>
</body>
</html>`
}

async function renderViews() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1.5 })

  // ---------------------------------------------------------------------------
  // 1. WHATSAPP VIEW
  // ---------------------------------------------------------------------------
  const whatsappContent = `
    <div class="cards-grid">
      <!-- Card 1: OD Clearance WhatsApp -->
      <div class="card" style="border-left: 4px solid var(--green);">
        <div class="card-header">
          <div class="card-title-row">
            <span class="badge badge-green">🟢 WhatsApp API</span>
            <span class="card-title">Official On-Duty (OD) Clearance Approved</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-green">✓ Delivered via WhatsApp Direct Relay</span>
            <span style="font-size:11px; color:var(--muted);">Today, 10:14 AM</span>
          </div>
        </div>
        <div class="card-meta">
          <span>👤 <strong>Student:</strong> Ananya Rao (Roll: 23CS082)</span>
          <span>📱 <strong>WhatsApp Phone:</strong> +91 98765 43210</span>
          <span>🏛️ <strong>Event:</strong> National Hackathon 2026 (CSI Chapter)</span>
        </div>
        <div class="msg-bubble msg-bubble-wa">*CAMPUS EVENT HUB - OFFICIAL OD APPROVAL NOTICE*
Dear Ananya Rao (Roll No: 23CS082),
Your On-Duty (OD) academic leave application for *National Hackathon 2026* has been APPROVED by Faculty OD In-Charge Dr. Malathi Sundaram.
• Official Pass No: *OD-2026-9041*
• Event Date Range: Oct 14 - Oct 16, 2026
• Sanctioned OD Credit: *3 Academic Days*
• Cryptographic QR Token: *VERIFIED & EMBEDDED*
Digital Pass Document URL: https://eventhub.college.edu/pass/OD-2026-9041
_Please present the embedded QR code upon returning to your departmental academic advisor._</div>
        <div class="card-actions">
          <button class="btn btn-outline">📋 Copy WhatsApp Text</button>
          <button class="btn btn-wa">🟢 Open in WhatsApp Web / App</button>
        </div>
      </div>

      <!-- Card 2: Registration Confirmation WhatsApp -->
      <div class="card" style="border-left: 4px solid var(--green);">
        <div class="card-header">
          <div class="card-title-row">
            <span class="badge badge-green">🟢 WhatsApp API</span>
            <span class="card-title">Event Registration Confirmed & Ticket Pass Issued</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-green">✓ Delivered via WhatsApp Direct Relay</span>
            <span style="font-size:11px; color:var(--muted);">Yesterday, 04:30 PM</span>
          </div>
        </div>
        <div class="card-meta">
          <span>👤 <strong>Student:</strong> Vikram S (Roll: 24104058)</span>
          <span>📱 <strong>WhatsApp Phone:</strong> +91 98401 23456</span>
          <span>🏛️ <strong>Event:</strong> Inter-College Coding Competition (CSI Chapter)</span>
        </div>
        <div class="msg-bubble msg-bubble-wa">*CAMPUS EVENT HUB - DIGITAL ENTRY PASS CONFIRMED*
Hello Vikram S, your seat reservation is confirmed for *Inter-College Coding Competition*!
• Pass Number: *REG-2026-CSI-088*
• Venue: Turing Computing Center, Lab 4
• Reporting Time: 09:30 AM IST
• Live Attendance Mode: *Auditorium 4-Digit Hall PIN Required*
Access your digital pass and QR code in student portal: https://eventhub.college.edu/student/registrations</div>
        <div class="card-actions">
          <button class="btn btn-outline">📋 Copy WhatsApp Text</button>
          <button class="btn btn-wa">🟢 Open in WhatsApp Web / App</button>
        </div>
      </div>
    </div>
  `

  await page.setContent(getBaseHtml({ activeTab: 'whatsapp', contentHtml: whatsappContent }), { waitUntil: 'load' })
  const waPath = path.join(OUTPUT_DIR, 'fig_8.16.1_whatsapp_dispatch.png')
  await page.screenshot({ path: waPath })
  console.log(`✓ Rendered fig_8.16.1_whatsapp_dispatch.png to: ${waPath}`)

  // ---------------------------------------------------------------------------
  // 2. SMS VIEW
  // ---------------------------------------------------------------------------
  const smsContent = `
    <div class="cards-grid">
      <!-- Card 1: SMS OD Approval -->
      <div class="card" style="border-left: 4px solid var(--blue);">
        <div class="card-header">
          <div class="card-title-row">
            <span class="badge badge-blue">💬 SMS Gateway</span>
            <span class="card-title">Cellular SMS Alert — On-Duty Pass Approval</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-blue">✓ Delivered via Twilio SMS Gateway</span>
            <span style="font-size:11px; color:var(--muted);">Today, 10:15 AM</span>
          </div>
        </div>
        <div class="card-meta">
          <span>👤 <strong>Recipient:</strong> Ananya Rao (Roll: 23CS082)</span>
          <span>📶 <strong>Cellular Number:</strong> +91 98765 43210</span>
          <span>📊 <strong>Payload Length:</strong> 142 / 160 GSM chars (1 SMS Segment)</span>
        </div>
        <div class="msg-bubble msg-bubble-sms">[CAMPUS HUB] Your OD request for National Hackathon 2026 is APPROVED. Pass #OD-2026-9041 (3 Days credited). Show QR pass at department desk.</div>
        <div class="card-actions">
          <button class="btn btn-outline">📋 Copy SMS Payload</button>
          <button class="btn btn-sms">💬 Open in Device SMS Messenger</button>
        </div>
      </div>

      <!-- Card 2: SMS PIN Reminder -->
      <div class="card" style="border-left: 4px solid var(--blue);">
        <div class="card-header">
          <div class="card-title-row">
            <span class="badge badge-blue">💬 SMS Gateway</span>
            <span class="card-title">Live Event Check-in PIN Alert & Venue Reminder</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-blue">✓ Delivered via Twilio SMS Gateway</span>
            <span style="font-size:11px; color:var(--muted);">Today, 09:15 AM</span>
          </div>
        </div>
        <div class="card-meta">
          <span>👤 <strong>Recipient:</strong> Praveen Kumar (Roll: 23CS094)</span>
          <span>📶 <strong>Cellular Number:</strong> +91 97890 12345</span>
          <span>📊 <strong>Payload Length:</strong> 138 / 160 GSM chars (1 SMS Segment)</span>
        </div>
        <div class="msg-bubble msg-bubble-sms">[CAMPUS HUB] CSI Coding starts at 10:00 AM in Lab 4. Enter auditorium 4-digit PIN upon arrival to verify physical presence and activate OD eligibility.</div>
        <div class="card-actions">
          <button class="btn btn-outline">📋 Copy SMS Payload</button>
          <button class="btn btn-sms">💬 Open in Device SMS Messenger</button>
        </div>
      </div>
    </div>
  `

  await page.setContent(getBaseHtml({ activeTab: 'sms', contentHtml: smsContent }), { waitUntil: 'load' })
  const smsPath = path.join(OUTPUT_DIR, 'fig_8.16.2_sms_gateway.png')
  await page.screenshot({ path: smsPath })
  console.log(`✓ Rendered fig_8.16.2_sms_gateway.png to: ${smsPath}`)

  // ---------------------------------------------------------------------------
  // 3. EMAIL VIEW
  // ---------------------------------------------------------------------------
  const emailContent = `
    <div class="cards-grid">
      <!-- Card 1: Official Institutional Email Pass -->
      <div class="card" style="border-left: 4px solid var(--purple);">
        <div class="card-header">
          <div class="card-title-row">
            <span class="badge badge-purple">✉️ Institutional SMTP Email</span>
            <span class="card-title">Official Sanctioned OD Pass Delivery Notice</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-purple">✓ Delivered via SMTP Relay (notifications@college.edu)</span>
            <span style="font-size:11px; color:var(--muted);">Today, 10:14 AM</span>
          </div>
        </div>
        <div class="card-meta">
          <span>👤 <strong>Recipient:</strong> ananya.rao@college.edu</span>
          <span>📌 <strong>Subject:</strong> Campus Event Hub - Official On-Duty (OD) Clearance Approved [Pass #OD-2026-9041]</span>
        </div>
        <div class="msg-bubble msg-bubble-email" style="background:#FFFFFF; border:1px solid #D8B4FE; padding:16px; border-radius:8px;">
          <div style="border-bottom:2px solid #7E22CE; padding-bottom:8px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:14px; color:#581C87;">NATIONAL ENGINEERING COLLEGE — CAMPUS EVENT HUB</div>
              <div style="font-size:10px; color:#6B21A8;">OFFICIAL ACADEMIC ON-DUTY (OD) SANCTION CLEARANCE</div>
            </div>
            <div style="background:#F3E8FF; padding:4px 8px; border-radius:4px; font-weight:700; font-size:11px; color:#7E22CE;">STATUS: ACTIVE & VERIFIED</div>
          </div>
          <div style="font-size:12px; line-height:1.6; color:#374151;">
            <p>Dear <strong>Ananya Rao</strong> (Roll No: <strong>23CS082</strong>, B.E. Computer Science and Engineering),</p>
            <p style="margin-top:6px;">This is formal confirmation that your On-Duty request for <strong>National Hackathon 2026</strong> has been scrutinized and officially approved by Faculty OD In-Charge <strong>Dr. Malathi Sundaram</strong>.</p>
            <div style="background:#F9FAFB; border:1px solid #E5E7EB; border-radius:6px; padding:10px 14px; margin:10px 0; font-size:11.5px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              <div><strong>OD Pass Number:</strong> OD-2026-9041</div>
              <div><strong>Sanctioned Duration:</strong> Oct 14 - Oct 16, 2026 (3 Days)</div>
              <div><strong>Hosting Society:</strong> CSI Student Chapter</div>
              <div><strong>Verification Hash:</strong> a98f12c8b7e94...</div>
            </div>
            <p style="font-size:11px; color:#6B7280;">This document contains embedded cryptographic verification. Digital attendance credit will be synchronized with Controller of Examinations (CoE) records.</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-outline">📋 Copy Email Body</button>
          <button class="btn btn-outline">📄 Download Pass PDF</button>
          <button class="btn btn-email">✉️ Open in Institutional Webmail / Gmail</button>
        </div>
      </div>
    </div>
  `

  await page.setContent(getBaseHtml({ activeTab: 'email', contentHtml: emailContent }), { waitUntil: 'load' })
  const emailPath = path.join(OUTPUT_DIR, 'fig_8.16.3_email_notification.png')
  await page.screenshot({ path: emailPath })
  console.log(`✓ Rendered fig_8.16.3_email_notification.png to: ${emailPath}`)

  await browser.close()
  console.log('All 3 notification figures generated successfully!')
}

renderViews().catch(err => {
  console.error('Render error:', err)
  process.exit(1)
})
