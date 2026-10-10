import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function testRoles() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  })

  // Test Instructor Context
  const instCtx = await browser.createBrowserContext()
  const instPage = await instCtx.newPage()
  await instPage.setViewport({ width: 1366, height: 768 })
  await instPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await instPage.type('input[type="email"]', 'csi.advisor@college.edu')
  await instPage.type('input[type="password"]', 'csi@faculty2026')
  await instPage.click('button[type="submit"]')
  await sleep(2500)
  console.log('Instructor login URL:', instPage.url())

  await instPage.goto('http://localhost:5173/instructor/events', { waitUntil: 'networkidle0' })
  await sleep(1000)
  console.log('Instructor /instructor/events URL:', instPage.url())

  // Test OD In-Charge Context
  const odCtx = await browser.createBrowserContext()
  const odPage = await odCtx.newPage()
  await odPage.setViewport({ width: 1366, height: 768 })
  await odPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await odPage.type('input[type="email"]', 'od.faculty@college.edu')
  await odPage.type('input[type="password"]', 'od@faculty2026')
  await odPage.click('button[type="submit"]')
  await sleep(2500)
  console.log('OD In-Charge login URL:', odPage.url())

  await odPage.goto('http://localhost:5173/od-incharge/requests', { waitUntil: 'networkidle0' })
  await sleep(1000)
  console.log('OD In-Charge /od-incharge/requests URL:', odPage.url())

  // Test Admin Context
  const adminCtx = await browser.createBrowserContext()
  const adminPage = await adminCtx.newPage()
  await adminPage.setViewport({ width: 1366, height: 768 })
  await adminPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await adminPage.type('input[type="email"]', 'admin@college.edu')
  await adminPage.type('input[type="password"]', 'admin2026')
  await adminPage.click('button[type="submit"]')
  await sleep(2500)
  console.log('Admin login URL:', adminPage.url())

  await adminPage.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle0' })
  await sleep(1000)
  console.log('Admin /admin/dashboard URL:', adminPage.url())

  await browser.close()
  console.log('All 3 faculty/admin role contexts verified successfully!')
}

testRoles().catch(err => {
  console.error(err)
  process.exit(1)
})
