import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function check() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true })
  const page = await browser.newPage()
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
  await page.type('input[type="email"]', 'student@college.edu')
  await page.type('input[type="password"]', 'student123')
  await page.click('button[type="submit"]')
  await new Promise(r => setTimeout(r, 2000))
  
  await page.goto('http://localhost:5173/student/enroll/2', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1000))
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({ text: b.innerText, class: b.className }))
  })
  console.log('Buttons on /student/enroll/2:', btns)

  // Test clicking register/enroll button
  const enrollBtn = await page.evaluateHandle(() => {
    const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Register') || el.innerText.includes('Enroll'))
    if (b) { b.click(); return true; }
    return false;
  })
  console.log('Clicked enroll?', await enrollBtn.jsonValue())
  await new Promise(r => setTimeout(r, 1500))
  console.log('After click URL:', page.url())

  await browser.close()
}

check().catch(console.error)
