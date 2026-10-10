import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  })

  // -------------------------------------------------------------
  // 1. PUBLIC CONTEXT (/, /login, /register)
  // -------------------------------------------------------------
  console.log('=== Capturing Public Views ===')
  const publicCtx = await browser.createBrowserContext()
  const publicPage = await publicCtx.newPage()
  await publicPage.setViewport({ width: 1366, height: 768 })

  // Landing Hero
  await publicPage.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await publicPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.1.1_landing_hero.png') })
  console.log('✓ Captured fig_8.1.1_landing_hero.png')

  // Login
  await publicPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await publicPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.1_user_login.png') })
  console.log('✓ Captured fig_8.3.1_user_login.png')

  // Register
  await publicPage.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await publicPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.3.2_user_register.png') })
  console.log('✓ Captured fig_8.3.2_user_register.png')

  await publicCtx.close()

  // -------------------------------------------------------------
  // 2. STUDENT CONTEXT
  // -------------------------------------------------------------
  console.log('\n=== Capturing Student Views ===')
  const studentCtx = await browser.createBrowserContext()
  const studentPage = await studentCtx.newPage()
  await studentPage.setViewport({ width: 1366, height: 768 })

  // Login as Student
  await studentPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await studentPage.type('input[type="email"]', 'student@college.edu')
  await studentPage.type('input[type="password"]', 'student123')
  await studentPage.click('button[type="submit"]')
  await sleep(2500)

  // Student Profile
  await studentPage.goto('http://localhost:5173/student/profile', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.4.1_student_profile.png') })
  console.log('✓ Captured fig_8.4.1_student_profile.png')

  // Clubs Directory
  await studentPage.goto('http://localhost:5173/student/clubs', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.5.1_clubs_directory.png') })
  console.log('✓ Captured fig_8.5.1_clubs_directory.png')

  // Club Profile CSI
  await studentPage.goto('http://localhost:5173/student/clubs/csi', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.5.2_club_profile_csi.png') })
  console.log('✓ Captured fig_8.5.2_club_profile_csi.png')

  // Events Catalog
  await studentPage.goto('http://localhost:5173/student/enroll', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.7.1_student_enroll_catalog.png') })
  console.log('✓ Captured fig_8.7.1_student_enroll_catalog.png')

  // Event Detail (ev 1)
  await studentPage.goto('http://localhost:5173/student/enroll/1', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.7.2_student_enroll_detail.png') })
  console.log('✓ Captured fig_8.7.2_student_enroll_detail.png')

  // Enroll in Event 2 to get real Confirmation Screen
  await studentPage.goto('http://localhost:5173/student/enroll/2', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Enroll') || el.innerText.includes('Register'))
    if (b) b.click()
  })
  await sleep(2000)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.7.3_registration_confirmation.png') })
  console.log('✓ Captured fig_8.7.3_registration_confirmation.png (URL:', studentPage.url(), ')')

  // My Registrations
  await studentPage.goto('http://localhost:5173/student/registrations', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.7.4_my_registrations.png') })
  console.log('✓ Captured fig_8.7.4_my_registrations.png')

  // Student Permissions (OD Desk)
  await studentPage.goto('http://localhost:5173/student/permissions', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.1_student_permissions.png') })
  console.log('✓ Captured fig_8.9.1_student_permissions.png')

  // Achievements
  await studentPage.goto('http://localhost:5173/student/achievements', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.13.1_student_achievements.png') })
  console.log('✓ Captured fig_8.13.1_student_achievements.png')

  // Feedback
  await studentPage.goto('http://localhost:5173/student/feedback', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.14.1_student_feedback.png') })
  console.log('✓ Captured fig_8.14.1_student_feedback.png')

  // Campus Links
  await studentPage.goto('http://localhost:5173/links', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.15.1_campus_links.png') })
  console.log('✓ Captured fig_8.15.1_campus_links.png')

  // History & Badges
  await studentPage.goto('http://localhost:5173/student/history', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await studentPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.19.3_student_history.png') })
  console.log('✓ Captured fig_8.19.3_student_history.png')

  await studentCtx.close()

  // -------------------------------------------------------------
  // 3. INSTRUCTOR CONTEXT
  // -------------------------------------------------------------
  console.log('\n=== Capturing Instructor Views ===')
  const instCtx = await browser.createBrowserContext()
  const instPage = await instCtx.newPage()
  await instPage.setViewport({ width: 1366, height: 768 })

  // Login as Instructor
  await instPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await instPage.type('input[type="email"]', 'csi.advisor@college.edu')
  await instPage.type('input[type="password"]', 'csi@faculty2026')
  await instPage.click('button[type="submit"]')
  await sleep(2500)

  // Manage Events
  await instPage.goto('http://localhost:5173/instructor/events', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await instPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.6.1_instructor_events.png') })
  console.log('✓ Captured fig_8.6.1_instructor_events.png')

  // Live Check-In
  await instPage.goto('http://localhost:5173/instructor/checkin', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await instPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.8.1_instructor_live_checkin.png') })
  console.log('✓ Captured fig_8.8.1_instructor_live_checkin.png')

  // Chapter Memberships
  await instPage.goto('http://localhost:5173/instructor/memberships', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await instPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.12.1_instructor_memberships.png') })
  console.log('✓ Captured fig_8.12.1_instructor_memberships.png')

  await instCtx.close()

  // -------------------------------------------------------------
  // 4. OD IN-CHARGE CONTEXT
  // -------------------------------------------------------------
  console.log('\n=== Capturing OD In-Charge Views ===')
  const odCtx = await browser.createBrowserContext()
  const odPage = await odCtx.newPage()
  await odPage.setViewport({ width: 1366, height: 768 })

  // Login as OD In-Charge
  await odPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await odPage.type('input[type="email"]', 'od.faculty@college.edu')
  await odPage.type('input[type="password"]', 'od@faculty2026')
  await odPage.click('button[type="submit"]')
  await sleep(2500)

  // OD Requests
  await odPage.goto('http://localhost:5173/od-incharge/requests', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await odPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.9.2_od_requests_table.png') })
  console.log('✓ Captured fig_8.9.2_od_requests_table.png')

  // OD Proof Verification
  await odPage.goto('http://localhost:5173/od-incharge/proofs', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await odPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.10.1_od_proof_verification.png') })
  console.log('✓ Captured fig_8.10.1_od_proof_verification.png')

  // OD Records Archive
  await odPage.goto('http://localhost:5173/od-incharge/records', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await odPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.11.1_od_records_archive.png') })
  console.log('✓ Captured fig_8.11.1_od_records_archive.png')

  // OD Analytics
  await odPage.goto('http://localhost:5173/od-incharge/analytics', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await odPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.19.1_od_analytics.png') })
  console.log('✓ Captured fig_8.19.1_od_analytics.png')

  await odCtx.close()

  // -------------------------------------------------------------
  // 5. ADMIN CONTEXT
  // -------------------------------------------------------------
  console.log('\n=== Capturing Admin Views ===')
  const adminCtx = await browser.createBrowserContext()
  const adminPage = await adminCtx.newPage()
  await adminPage.setViewport({ width: 1366, height: 768 })

  // Login as Admin
  await adminPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await adminPage.type('input[type="email"]', 'admin@college.edu')
  await adminPage.type('input[type="password"]', 'admin2026')
  await adminPage.click('button[type="submit"]')
  await sleep(2500)

  // Admin Dashboard
  await adminPage.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await adminPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.19.2_admin_dashboard.png') })
  console.log('✓ Captured fig_8.19.2_admin_dashboard.png')

  // Settings
  await adminPage.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' })
  await sleep(1500)
  await adminPage.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.18.1_system_settings.png') })
  console.log('✓ Captured fig_8.18.1_system_settings.png')

  await adminCtx.close()

  await browser.close()
  console.log('\nAll application screens successfully captured!')
}

captureAll().catch(err => {
  console.error(err)
  process.exit(1)
})
