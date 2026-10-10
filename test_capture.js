import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })

  // 1. Test Public Routes
  console.log('Testing Public...')
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await sleep(1500)
  console.log('Public / URL:', page.url(), 'Title:', await page.title())

  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await sleep(1500)
  console.log('Public /login URL:', page.url())

  // 2. Test Student Login
  console.log('Testing Student Login...')
  await page.type('input[type="email"]', 'student@college.edu')
  await page.type('input[type="password"]', 'student123')
  await page.click('button[type="submit"]')
  await sleep(2500)
  console.log('After student login URL:', page.url())

  // Test /student/enroll/1
  await page.goto('http://localhost:5173/student/enroll/1', { waitUntil: 'networkidle0' })
  await sleep(1500)
  console.log('Student /student/enroll/1 URL:', page.url())
  const text1 = await page.evaluate(() => document.body.innerText)
  console.log('Has 404?', text1.includes('404'), 'Length:', text1.length)

  // Test /student/clubs/csi
  await page.goto('http://localhost:5173/student/clubs/csi', { waitUntil: 'networkidle0' })
  await sleep(1500)
  console.log('Student /student/clubs/csi URL:', page.url())

  await browser.close()
  console.log('Test complete!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
