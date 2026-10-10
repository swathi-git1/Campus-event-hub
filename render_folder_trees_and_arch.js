import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { instance } from '@viz-js/viz'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 1. Overall System Architecture Diagram (Figure 8.1.1)
const archDot = `
digraph OverallSystemArchitecture {
  graph [
    rankdir=TB
    nodesep=0.5
    ranksep=0.5
    bgcolor="white"
    fontname="Times New Roman"
  ]
  node [
    shape=box
    style="filled,rounded"
    fontname="Times New Roman"
    fontsize=11
    penwidth=1.2
    margin="0.2,0.12"
  ]
  edge [
    fontname="Times New Roman"
    fontsize=9
    penwidth=1.2
    color="#1E3A8A"
  ]

  // Layers
  Client [
    label="Client Layer (React 18 SPA)\nReact 18 + Vite + TailwindCSS + Lucide Icons\nPages: Student, Instructor, OD In-Charge, Admin, Public\nState Management: React Context (AuthContext, DataContext)",
    fillcolor="#EBF5FB",
    color="#2980B9"
  ]

  Transport [
    label="HTTP & Security Transport\nFetch / Axios REST Client | Authorization: Bearer <JWT Token>\nSliding-Window IP Rate Limiting (rateLimiter.js)",
    fillcolor="#EAFAF1",
    color="#27AE60"
  ]

  Server [
    label="Backend API Engine (Node.js & Express-Style Router)\napiRouter.js: Request Dispatching, JSON Parsing, Route Authorization\nauth.js: PBKDF2 SHA-512 Hashing, HMAC-SHA256 JWT Verification\nnotificationService.js: Multi-Channel Dispatches (Email, WhatsApp, SMS)",
    fillcolor="#FEF9E7",
    color="#F39C12"
  ]

  Logic [
    label="Database Abstraction & Business Logic Layer (server/db.js)\nTransaction Processing: Event Enrollment, PIN Check-In, OD Approval Lifecycle\nMulti-Role Access Control: student, instructor, faculty_od, admin",
    fillcolor="#F4ECF7",
    color="#8E44AD"
  ]

  Persistence [
    label="Database Persistence Layer (MongoDB via native driver)\n11 Collections: users, events, students, registrations, permission_requests,\nod_records, chapters, campus_links, notification_dispatches, audit_logs, system_settings\nUnique & Compound Indexes: users.email, events.id, registrations(eventId, email)",
    fillcolor="#EAECEE",
    color="#2C3E50"
  ]

  Client -> Transport [label="  JSON REST Requests"]
  Transport -> Server [label="  Validated HTTP Calls"]
  Server -> Logic [label="  Domain Method Calls"]
  Logic -> Persistence [label="  Native MongoDB Queries & In-Memory Sync"]
}
`

// 2. Real directory scan for Backend and Frontend
function getBackendTree() {
  const serverFiles = fs.readdirSync('server').sort()
  return {
    name: 'server',
    files: serverFiles
  }
}

function getFrontendTree() {
  const getFiles = (dir) => {
    return fs.readdirSync(dir, { withFileTypes: true }).map(dirent => {
      if (dirent.isDirectory()) {
        return {
          name: dirent.name,
          isDir: true,
          children: getFiles(path.join(dir, dirent.name))
        }
      }
      return { name: dirent.name, isDir: false }
    })
  }
  return getFiles('src')
}

function renderVsCodeHtml(title, itemsHtml) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 16px;
        background: #181818;
        color: #cccccc;
        font-family: Consolas, 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        box-sizing: border-box;
      }
      .explorer-title {
        color: #bbbbbb;
        font-weight: bold;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #2b2b2b;
        margin-bottom: 10px;
      }
      .tree-node {
        display: flex;
        align-items: center;
        padding: 2px 4px;
        border-radius: 3px;
      }
      .tree-node:hover {
        background: #2a2d2e;
      }
      .chevron {
        color: #999;
        margin-right: 6px;
        font-size: 10px;
        width: 12px;
        text-align: center;
      }
      .folder-icon {
        color: #4a90e2;
        margin-right: 7px;
      }
      .file-icon-js {
        color: #f7df1e;
        margin-right: 7px;
        font-weight: bold;
        font-size: 11px;
      }
      .file-icon-css {
        color: #42a5f5;
        margin-right: 7px;
        font-size: 11px;
      }
      .file-icon-doc {
        color: #81c784;
        margin-right: 7px;
        font-size: 11px;
      }
      .folder-name {
        color: #e0e0e0;
        font-weight: 600;
      }
      .file-name {
        color: #cccccc;
      }
      .indent-1 { padding-left: 14px; }
      .indent-2 { padding-left: 28px; }
      .indent-3 { padding-left: 42px; }
    </style>
  </head>
  <body>
    <div class="explorer-title">EXPLORER: ${title}</div>
    ${itemsHtml}
  </body>
  </html>
  `
}

async function renderBackendTreeImage(browser) {
  const backend = getBackendTree()
  let htmlItems = `
    <div class="tree-node"><span class="chevron">▼</span><span class="folder-icon">📁</span><span class="folder-name">server</span></div>
  `
  backend.files.forEach(f => {
    const isJs = f.endsWith('.js')
    const icon = isJs ? '<span class="file-icon-js">JS</span>' : '<span class="file-icon-doc">📄</span>'
    htmlItems += `
      <div class="tree-node indent-1">${icon}<span class="file-name">${f}</span></div>
    `
  })

  const fullHtml = renderVsCodeHtml('CAMPUS-EVENT-HUB / BACKEND', htmlItems)
  const page = await browser.newPage()
  await page.setViewport({ width: 560, height: 420, deviceScaleFactor: 2 })
  await page.setContent(fullHtml, { waitUntil: 'load' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.2.1_backend_folder.png') })
  await page.close()
  console.log('Rendered fig_8.2.1_backend_folder.png')
}

async function renderFrontendTreeImage(browser) {
  const renderTreeNodes = (nodes, indentLevel = 1) => {
    let out = ''
    nodes.forEach(node => {
      const indentClass = `indent-${indentLevel}`
      if (node.isDir) {
        out += `<div class="tree-node ${indentClass}"><span class="chevron">▼</span><span class="folder-icon">📁</span><span class="folder-name">${node.name}</span></div>`
        if (node.children) {
          out += renderTreeNodes(node.children, indentLevel + 1)
        }
      } else {
        const isJs = node.name.endsWith('.js') || node.name.endsWith('.jsx')
        const isCss = node.name.endsWith('.css')
        const icon = isJs ? '<span class="file-icon-js">JS</span>' : (isCss ? '<span class="file-icon-css">#</span>' : '<span class="file-icon-doc">📄</span>')
        out += `<div class="tree-node ${indentClass}">${icon}<span class="file-name">${node.name}</span></div>`
      }
    })
    return out
  }

  const frontendTree = getFrontendTree()
  let htmlItems = `
    <div class="tree-node"><span class="chevron">▼</span><span class="folder-icon">📁</span><span class="folder-name">src</span></div>
    ${renderTreeNodes(frontendTree, 1)}
  `

  const fullHtml = renderVsCodeHtml('CAMPUS-EVENT-HUB / FRONTEND', htmlItems)
  const page = await browser.newPage()
  await page.setViewport({ width: 620, height: 780, deviceScaleFactor: 2 })
  await page.setContent(fullHtml, { waitUntil: 'load' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.2.2_frontend_folder.png') })
  await page.close()
  console.log('Rendered fig_8.2.2_frontend_folder.png')
}

async function renderArchDiagram(browser) {
  const viz = await instance()
  const svg = viz.renderString(archDot, { format: 'svg' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 })
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: white; }
          svg { width: 100%; height: auto; max-width: 1360px; }
        </style>
      </head>
      <body>${svg}</body>
    </html>
  `
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForSelector('svg')
  const el = await page.$('svg')
  await el.screenshot({ path: path.join(OUTPUT_DIR, 'fig_8.1.1_overall_architecture.png') })
  await page.close()
  console.log('Rendered fig_8.1.1_overall_architecture.png')
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  await renderArchDiagram(browser)
  await renderBackendTreeImage(browser)
  await renderFrontendTreeImage(browser)

  await browser.close()
  console.log('All tree and architecture figures successfully generated!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
