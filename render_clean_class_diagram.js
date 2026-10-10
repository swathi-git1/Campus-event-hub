import fs from 'fs'
import path from 'path'
import { instance } from '@viz-js/viz'
import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

const classDiagramDot = `
digraph CampusEventHubClassDiagram {
  graph [
    rankdir=TB
    splines=ortho
    nodesep=0.45
    ranksep=0.55
    bgcolor="white"
    fontname="Times New Roman"
  ]
  node [
    shape=none
    fontname="Times New Roman"
    fontsize=9
    color="#000000"
  ]
  edge [
    fontname="Times New Roman"
    fontsize=8
    color="#000000"
    arrowsize=0.7
  ]

  // Column 1: System & Access Control
  User [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>User</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - name : String<br/>
        - email : String<br/>
        - role : String<br/>
        - passwordHash : String<br/>
        - passwordSalt : String<br/>
        - dept : String<br/>
        - isActive : Boolean<br/>
        - preferences : Object<br/>
        - createdAt : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + findUserByEmail(email) : User<br/>
        + createUser(data) : User<br/>
        + changeUserPassword(id, old, new) : Boolean<br/>
        + updateUserPreferences(id, prefs) : Object
      </td></tr>
    </table>
  >]

  Student [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>Student</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - rollNo : String<br/>
        - name : String<br/>
        - email : String<br/>
        - dept : String<br/>
        - degree : String<br/>
        - year : String<br/>
        - chapter : String<br/>
        - verificationStatus : String<br/>
        - attendanceCount : Number<br/>
        - joinedDate : String
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + queryStudents(filters) : List&lt;Student&gt;<br/>
        + getStudentById(id) : Student<br/>
        + updateProfile(id, data) : Student
      </td></tr>
    </table>
  >]

  AuditLog [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>AuditLog</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - action : String<br/>
        - user : String<br/>
        - details : String<br/>
        - timestamp : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + queryAuditLogs(filter) : List&lt;AuditLog&gt;<br/>
        + logSecurityEvent(action, user, details)
      </td></tr>
    </table>
  >]

  SystemSettings [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>SystemSettings</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - key : String<br/>
        - institutionName : String<br/>
        - allowedEmailDomain : String<br/>
        - requireEmailDomainCheck : Boolean<br/>
        - allowRegistration : Boolean<br/>
        - academicYear : String
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + getSystemSettings() : SystemSettings<br/>
        + updateSystemSettings(data, admin) : Settings<br/>
        + isEmailDomainAllowed(email) : Boolean
      </td></tr>
    </table>
  >]

  // Column 2: Core Event Operations
  Event [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>Event</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - title : String<br/>
        - club : String<br/>
        - date : String<br/>
        - venue : String<br/>
        - capacity : Number<br/>
        - registered : Number<br/>
        - status : String<br/>
        - venuePin : String<br/>
        - createdBy : String<br/>
        - createdAt : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + queryEvents(filter) : List&lt;Event&gt;<br/>
        + getEventById(id) : Event<br/>
        + createEvent(data, user) : Event<br/>
        + updateEvent(id, data, user) : Event<br/>
        + deleteEvent(id, user) : Boolean
      </td></tr>
    </table>
  >]

  Registration [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>Registration</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - eventId : String<br/>
        - eventTitle : String<br/>
        - club : String<br/>
        - studentName : String<br/>
        - rollNo : String<br/>
        - email : String<br/>
        - isClubMember : Boolean<br/>
        - status : String<br/>
        - attended : Boolean<br/>
        - attendedAt : String<br/>
        - checkinMethod : String<br/>
        - timestamp : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + registerStudentForEvent(event, data, user)<br/>
        + markEventAttendance(regId, isPresent, method)<br/>
        + verifySelfAttendanceWithPin(eventId, pin, user)<br/>
        + queryRegistrations(filters) : List
      </td></tr>
    </table>
  >]

  Chapter [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>Chapter</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - name : String<br/>
        - tagline : String<br/>
        - description : String<br/>
        - category : String<br/>
        - counselor : String<br/>
        - memberCount : Number<br/>
        - eventsCount : Number<br/>
        - createdAt : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + queryChapters(filters) : List&lt;Chapter&gt;<br/>
        + createChapter(data, admin) : Chapter<br/>
        + updateChapter(id, data, admin) : Chapter<br/>
        + deleteChapter(id, admin) : Boolean
      </td></tr>
    </table>
  >]

  // Column 3: Sanctions, Workflows & Links
  PermissionRequest [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>PermissionRequest</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - studentId : String<br/>
        - studentName : String<br/>
        - studentEmail : String<br/>
        - rollNo : String<br/>
        - eventId : String<br/>
        - eventTitle : String<br/>
        - status : String<br/>
        - proof : Object<br/>
        - officialPassNumber : String<br/>
        - remarks : String<br/>
        - approvedBy : String<br/>
        - createdAt : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + createPermissionRequest(data, user)<br/>
        + approvePermissionRequest(id, remarks, approver)<br/>
        + rejectPermissionRequest(id, reason, rejector)<br/>
        + submitODParticipationProof(id, proof, user)<br/>
        + verifyODParticipationProof(id, approved, remarks)
      </td></tr>
    </table>
  >]

  ODRecord [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>ODRecord</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - requestId : String<br/>
        - studentId : String<br/>
        - studentName : String<br/>
        - rollNo : String<br/>
        - eventName : String<br/>
        - eventDates : String<br/>
        - totalDaysOD : Number<br/>
        - status : String<br/>
        - issuedBy : String<br/>
        - verificationReference : String<br/>
        - qrCodeData : String<br/>
        - issuedAt : String
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + issueOfficialODPass(id, opts, user) : Result<br/>
        + queryODRecords(filters) : List&lt;ODRecord&gt;<br/>
        + getODRecordById(id) : ODRecord
      </td></tr>
    </table>
  >]

  NotificationLog [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>NotificationLog</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - recipientEmail : String<br/>
        - recipientPhone : String<br/>
        - channel : String<br/>
        - type : String<br/>
        - title : String<br/>
        - message : String<br/>
        - status : String<br/>
        - timestamp : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + logNotificationDispatch(payload) : Entry<br/>
        + queryNotificationLogs(opts) : List<br/>
        + dispatchODApprovalWorkflow(req, remarks)
      </td></tr>
    </table>
  >]

  CampusLink [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F2F2F2"><b>CampusLink</b></td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Attributes —</b><br/>
        - id : String<br/>
        - title : String<br/>
        - url : String<br/>
        - category : String<br/>
        - description : String<br/>
        - icon : String<br/>
        - createdBy : String<br/>
        - isOfficial : Boolean<br/>
        - createdAt : Date
      </td></tr>
      <hr/>
      <tr><td align="left">
        <b>— Methods —</b><br/>
        + queryCampusLinks(filter) : List&lt;CampusLink&gt;<br/>
        + createCampusLink(data, user) : CampusLink<br/>
        + updateCampusLink(id, data, user) : CampusLink<br/>
        + deleteCampusLink(id, user) : Boolean
      </td></tr>
    </table>
  >]

  // Relationships with Multiplicities
  Student -> User [label="0..1 generalizes to 1", arrowhead="empty"]
  Registration -> Student [label="* enrolls 1", arrowhead="open"]
  Registration -> Event [label="* booked for 1", arrowhead="open"]
  PermissionRequest -> Student [label="* requested by 1", arrowhead="open"]
  PermissionRequest -> Event [label="* for 0..1", arrowhead="open"]
  ODRecord -> PermissionRequest [label="0..1 sanctions 1", arrowhead="open"]
  Student -> Chapter [label="* belongs to 1", arrowhead="open"]
  Event -> Chapter [label="* organized by 1", arrowhead="open"]
  AuditLog -> User [label="* logs actions of 1", arrowhead="open"]
  NotificationLog -> User [label="* notified for 1", arrowhead="open"]
  CampusLink -> User [label="* curated by 1", arrowhead="open"]
  SystemSettings -> User [label="configured by 1 Admin", arrowhead="open", style="dashed"]
}
`

async function main() {
  const viz = await instance()
  const res = viz.render(classDiagramDot, { format: 'svg' })
  if (res.status === 'failure') {
    console.error('Viz render failed:', res.errors)
    process.exit(1)
  }
  
  console.log('Class Diagram SVG generated successfully! Rendering to PNG with Puppeteer...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1800, height: 1400, deviceScaleFactor: 2.0 })
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: white; }
          svg { width: 100%; height: auto; }
        </style>
      </head>
      <body>${res.output}</body>
    </html>
  `
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForSelector('svg')
  const element = await page.$('svg')
  const outPath = path.join(OUTPUT_DIR, 'class_diagram.png')
  await element.screenshot({ path: outPath, omitBackground: false })
  await browser.close()
  console.log(`Rendered class_diagram.png to: ${outPath}`)
}

main().catch(console.error)
