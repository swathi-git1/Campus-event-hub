import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })

  console.log('1. Capturing Public Landing...')
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.1.1_landing_hero.png') })

  // Scroll to upcoming events
  await page.evaluate(() => window.scrollBy(0, 700))
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.4.1_landing_events.png') })

  console.log('2. Capturing Login & Register...')
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.2.1_login_portal.png') })

  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.2.2_register_portal.png') })

  // Login as Student
  console.log('3. Logging in as Student...')
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.type('input[type="email"]', 'student@college.edu')
  await page.type('input[type="password"]', 'student123')
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.1_student_dashboard.png') })

  // Student Clubs
  await page.goto('http://localhost:5173/student/clubs', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.1_clubs_directory.png') })

  // Student Club Profile CSI
  await page.goto('http://localhost:5173/student/clubs/csi', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.2_club_profile_csi.png') })

  // Event Details
  await page.goto('http://localhost:5173/student/events/evt-csi-101', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.4.2_event_detail.png') })

  // My Registrations
  await page.goto('http://localhost:5173/student/my-registrations', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.6.1_my_registrations.png') })

  // Student Permissions (OD Request Form)
  await page.goto('http://localhost:5173/student/permissions', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.1_student_od_request.png') })

  // Student Participation History
  await page.goto('http://localhost:5173/student/history', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.2_participation_history.png') })

  // Student Achievements
  await page.goto('http://localhost:5173/student/achievements', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.3_campus_achievements.png') })

  // Logout
  await page.evaluate(() => localStorage.clear())

  console.log('4. Logging in as Instructor (CSI Advisor)...')
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.type('input[type="email"]', 'csi.advisor@college.edu')
  await page.type('input[type="password"]', 'csi@faculty2026')
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.3_instructor_dashboard.png') })

  // Instructor Manage Events
  await page.goto('http://localhost:5173/instructor/manage-events', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.4.3_instructor_manage_events.png') })

  // Instructor Memberships
  await page.goto('http://localhost:5173/instructor/memberships', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.5.1_instructor_memberships.png') })

  // Instructor Live Check-in Console
  await page.goto('http://localhost:5173/instructor/check-in', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.7.1_instructor_live_attendance.png') })

  // Instructor Profile
  await page.goto('http://localhost:5173/instructor/profile', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.4_instructor_profile.png') })

  // Logout
  await page.evaluate(() => localStorage.clear())

  console.log('5. Logging in as OD Incharge...')
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.type('input[type="email"]', 'od.faculty@college.edu')
  await page.type('input[type="password"]', 'od@faculty2026')
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.2_od_incharge_dashboard.png') })

  // OD Requests
  await page.goto('http://localhost:5173/od-incharge/requests', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.3_od_requests_table.png') })

  // OD Archive
  await page.goto('http://localhost:5173/od-incharge/archive', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.4_od_records_archive.png') })

  // OD Analytics
  await page.goto('http://localhost:5173/od-incharge/analytics', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.5_od_analytics.png') })

  // Logout
  await page.evaluate(() => localStorage.clear())

  console.log('6. Logging in as Admin...')
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.type('input[type="email"]', 'admin@college.edu')
  await page.type('input[type="password"]', 'admin2026')
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.4_admin_dashboard_kpis.png') })

  // Admin Pending Clubs
  await page.goto('http://localhost:5173/admin/pending-clubs', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.5_admin_pending_clubs.png') })

  // Admin System Settings / Permissions
  await page.goto('http://localhost:5173/admin/permissions', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.2.3_admin_permissions.png') })

  // Global Settings
  await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.5_global_settings.png') })

  await browser.close()
  console.log('All screenshots captured successfully!')
}

capture().catch(err => {
  console.error('Error during capture:', err)
  process.exit(1)
})
