import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// Fast difference perceptual hash (dHash) in JS
function computeDHash(imageBuffer, width = 9, height = 8) {
  // We can write a quick binary hash or use node sharp/canvas, or let python verify hashes!
  // We will run Python verification on the saved PNGs.
}

const targets = [
  // Public
  {
    role: 'public',
    route: '/',
    filename: 'fig_8.1.1_landing_hero.png',
    caption: 'Figure 8.1.1 Campus Event Hub Institutional Landing Interface'
  },
  {
    role: 'public',
    route: '/login',
    filename: 'fig_8.3.1_user_login.png',
    caption: 'Figure 8.3.1 Role-Based User Login & Authentication Interface'
  },
  {
    role: 'public',
    route: '/register',
    filename: 'fig_8.3.2_user_register.png',
    caption: 'Figure 8.3.2 Student Institutional Registration Interface'
  },

  // Student
  {
    role: 'student',
    loginEmail: 'student@college.edu',
    loginPass: 'student123',
    route: '/student/profile',
    filename: 'fig_8.4.1_student_profile.png',
    caption: 'Figure 8.4.1 Student Profile, Academic Credentials & Notification Channels Interface'
  },
  {
    role: 'student',
    route: '/student/clubs',
    filename: 'fig_8.5.1_clubs_directory.png',
    caption: 'Figure 8.5.1 Accredited Student Clubs & Technical Chapters Directory'
  },
  {
    role: 'student',
    route: '/student/clubs/csi',
    filename: 'fig_8.5.2_club_profile_csi.png',
    caption: 'Figure 8.5.2 CSI Student Chapter Detailed Profile & Executive Council'
  },
  {
    role: 'student',
    route: '/student/enroll',
    filename: 'fig_8.7.1_student_enroll_catalog.png',
    caption: 'Figure 8.7.1 Campus Event Catalog & Discovery Feed'
  },
  {
    role: 'student',
    route: '/student/enroll/1',
    filename: 'fig_8.7.2_student_enroll_detail.png',
    caption: 'Figure 8.7.2 Event Pass Reservation & Contestant Registration Interface'
  },
  {
    role: 'student',
    route: '/student/confirmation',
    filename: 'fig_8.7.3_registration_confirmation.png',
    caption: 'Figure 8.7.3 Digital Event Pass Confirmation with Verification QR Token'
  },
  {
    role: 'student',
    route: '/student/registrations',
    filename: 'fig_8.7.4_my_registrations.png',
    caption: 'Figure 8.7.4 Student Enrolled Event Passes & Pass Management Portfolio'
  },
  {
    role: 'student',
    route: '/student/permissions',
    filename: 'fig_8.9.1_student_permissions.png',
    caption: 'Figure 8.9.1 Student Academic On-Duty (OD) Leave Application Console'
  },
  {
    role: 'student',
    route: '/student/achievements',
    filename: 'fig_8.13.1_student_achievements.png',
    caption: 'Figure 8.13.1 Collegiate Hall of Fame & Competitive Achievements Feed'
  },
  {
    role: 'student',
    route: '/student/feedback',
    filename: 'fig_8.14.1_student_feedback.png',
    caption: 'Figure 8.14.1 Post-Event Student Feedback & Ratings Console'
  },
  {
    role: 'student',
    route: '/links',
    filename: 'fig_8.15.1_campus_links.png',
    caption: 'Figure 8.15.1 Multi-Linker Unified Campus Portals & Academic Resources Hub'
  },
  {
    role: 'student',
    route: '/student/history',
    filename: 'fig_8.19.3_student_history.png',
    caption: 'Figure 8.19.3 Student Co-Curricular Transcript & Verified Attendance History'
  },

  // Instructor
  {
    role: 'instructor',
    loginEmail: 'csi.advisor@college.edu',
    loginPass: 'csi@faculty2026',
    route: '/instructor/events',
    filename: 'fig_8.6.1_instructor_events.png',
    caption: 'Figure 8.6.1 Chapter Event Scheduling & Capacity Gating Console'
  },
  {
    role: 'instructor',
    route: '/instructor/checkin',
    filename: 'fig_8.8.1_instructor_live_checkin.png',
    caption: 'Figure 8.8.1 Faculty Advisor Live Attendance Verification & 4-Digit Hall PIN Console'
  },
  {
    role: 'instructor',
    route: '/instructor/memberships',
    filename: 'fig_8.12.1_instructor_memberships.png',
    caption: 'Figure 8.12.1 Chapter Student Membership Roster & Verification Management'
  },

  // OD In-Charge
  {
    role: 'faculty_od',
    loginEmail: 'od.faculty@college.edu',
    loginPass: 'od@faculty2026',
    route: '/od-incharge/requests',
    filename: 'fig_8.9.2_od_requests_table.png',
    caption: 'Figure 8.9.2 Chief OD In-Charge Application Review & Scrutiny Interface'
  },
  {
    role: 'faculty_od',
    route: '/od-incharge/proofs',
    filename: 'fig_8.10.1_od_proof_verification.png',
    caption: 'Figure 8.10.1 Event Completion Certificate & Participation Proof Verification Console'
  },
  {
    role: 'faculty_od',
    route: '/od-incharge/records',
    filename: 'fig_8.11.1_od_records_archive.png',
    caption: 'Figure 8.11.1 Institutional Official OD Pass Registry & Academic Exemption Archive'
  },
  {
    role: 'faculty_od',
    route: '/od-incharge/analytics',
    filename: 'fig_8.19.1_od_analytics.png',
    caption: 'Figure 8.19.1 Departmental OD Distribution Analytics & Trend Charts'
  },

  // Admin
  {
    role: 'admin',
    loginEmail: 'admin@college.edu',
    loginPass: 'admin2026',
    route: '/admin/dashboard',
    filename: 'fig_8.19.2_admin_dashboard.png',
    caption: 'Figure 8.19.2 Super Admin Executive Control Center & Campus Metrics Overview'
  },
  {
    role: 'admin',
    route: '/settings',
    filename: 'fig_8.18.1_system_settings.png',
    caption: 'Figure 8.18.1 Institutional System Settings & Email Domain Security Configuration'
  }
]

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  })

  let currentRole = null
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })

  for (const t of targets) {
    console.log(`Processing [${t.role}] -> ${t.route} (${t.filename})...`)
    
    // Switch login session if needed
    if (t.role !== currentRole) {
      if (t.role === 'public') {
        // Clear cookies/localStorage
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
        await page.evaluate(() => localStorage.clear())
        currentRole = 'public'
      } else {
        // Login with credentials
        console.log(`Logging in as ${t.role} (${t.loginEmail})...`)
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
        await sleep(500)
        // Clear fields
        await page.evaluate(() => {
          const emailInput = document.querySelector('input[type="email"]')
          if (emailInput) emailInput.value = ''
          const passInput = document.querySelector('input[type="password"]')
          if (passInput) passInput.value = ''
        })
        await page.type('input[type="email"]', t.loginEmail)
        await page.type('input[type="password"]', t.loginPass)
        await page.click('button[type="submit"]')
        await sleep(2500)
        currentRole = t.role
      }
    }

    // Navigate to target route
    await page.goto(`http://localhost:5173${t.route}`, { waitUntil: 'networkidle0' })
    await sleep(1500)

    // Verification check on page content
    const pageUrl = page.url()
    const pageText = await page.evaluate(() => document.body.innerText)

    if (t.route !== '/login' && pageUrl.includes('/login')) {
      console.error(`ERROR: Redirected to /login on route ${t.route}!`)
      continue
    }
    if (pageText.includes('404') && pageText.includes('Page Not Found')) {
      console.error(`ERROR: 404 Page Not Found on route ${t.route}!`)
      continue
    }

    // Scroll slightly if beneficial, then screenshot
    const outPath = path.join(OUTPUT_DIR, t.filename)
    await page.screenshot({ path: outPath })
    console.log(`✓ Saved ${t.filename} (URL: ${pageUrl})`)
  }

  await browser.close()
  console.log('Finished capturing all target screens!')
}

captureAll().catch(err => {
  console.error(err)
  process.exit(1)
})
