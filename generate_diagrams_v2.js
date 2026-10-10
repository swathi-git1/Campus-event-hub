import fs from 'fs'
import path from 'path'
import { instance } from '@viz-js/viz'
import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('Campus_Event_Hub_Report/figures')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 1. CLASS DIAGRAM (UML with 11 classes, attributes, methods, multiplicities)
const classDiagramDot = `
digraph CampusEventHubClassDiagram {
  graph [
    rankdir=BT
    splines=ortho
    nodesep=0.6
    ranksep=0.7
    bgcolor="white"
    fontname="Times New Roman"
  ]
  node [
    shape=none
    fontname="Times New Roman"
    fontsize=10
    color="#000000"
  ]
  edge [
    fontname="Times New Roman"
    fontsize=9
    color="#000000"
    arrowsize=0.8
  ]

  // User Base Class
  User [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>User</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + findUserByEmail(email) : User<br/>
        + createUser(data) : User<br/>
        + changeUserPassword(id, old, new) : Boolean<br/>
        + updateUserPreferences(id, prefs) : Object
      </td>
    </table>
  >]

  Student [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>Student</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + queryStudents(filters) : List&lt;Student&gt;<br/>
        + getStudentById(id) : Student<br/>
        + updateProfile(id, data) : Student
      </td>
    </table>
  >]

  Event [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>Event</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + queryEvents(filter) : List&lt;Event&gt;<br/>
        + getEventById(id) : Event<br/>
        + createEvent(data, user) : Event<br/>
        + updateEvent(id, data, user) : Event<br/>
        + deleteEvent(id, user) : Boolean
      </td>
    </table>
  >]

  Registration [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>Registration</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + registerStudentForEvent(event, data, user)<br/>
        + markEventAttendance(regId, isPresent, method)<br/>
        + verifySelfAttendanceWithPin(eventId, pin, user)<br/>
        + queryRegistrations(filters) : List
      </td>
    </table>
  >]

  PermissionRequest [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>PermissionRequest</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + createPermissionRequest(data, user)<br/>
        + approvePermissionRequest(id, remarks, approver)<br/>
        + rejectPermissionRequest(id, reason, rejector)<br/>
        + submitODParticipationProof(id, proof, user)<br/>
        + verifyODParticipationProof(id, approved, remarks)
      </td>
    </table>
  >]

  ODRecord [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>ODRecord</b></td></tr>
      <hr/>
      <td align="left">
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
      </td>
      <hr/>
      <td align="left">
        + issueOfficialODPass(id, opts, user) : Result<br/>
        + queryODRecords(filters) : List&lt;ODRecord&gt;<br/>
        + getODRecordById(id) : ODRecord
      </td>
    </table>
  >]

  Chapter [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>Chapter</b></td></tr>
      <hr/>
      <td align="left">
        - id : String<br/>
        - name : String<br/>
        - tagline : String<br/>
        - description : String<br/>
        - category : String<br/>
        - counselor : String<br/>
        - memberCount : Number<br/>
        - eventsCount : Number<br/>
        - createdAt : Date
      </td>
      <hr/>
      <td align="left">
        + queryChapters(filters) : List&lt;Chapter&gt;<br/>
        + createChapter(data, admin) : Chapter<br/>
        + updateChapter(id, data, admin) : Chapter<br/>
        + deleteChapter(id, admin) : Boolean
      </td>
    </table>
  >]

  CampusLink [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>CampusLink</b></td></tr>
      <hr/>
      <td align="left">
        - id : String<br/>
        - title : String<br/>
        - url : String<br/>
        - category : String<br/>
        - description : String<br/>
        - icon : String<br/>
        - createdBy : String<br/>
        - isOfficial : Boolean<br/>
        - createdAt : Date
      </td>
      <hr/>
      <td align="left">
        + queryCampusLinks(filter) : List&lt;CampusLink&gt;<br/>
        + createCampusLink(data, user) : CampusLink<br/>
        + updateCampusLink(id, data, user) : CampusLink<br/>
        + deleteCampusLink(id, user) : Boolean
      </td>
    </table>
  >]

  NotificationLog [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>NotificationLog</b></td></tr>
      <hr/>
      <td align="left">
        - id : String<br/>
        - recipientEmail : String<br/>
        - recipientPhone : String<br/>
        - channel : String<br/>
        - type : String<br/>
        - title : String<br/>
        - message : String<br/>
        - status : String<br/>
        - timestamp : Date
      </td>
      <hr/>
      <td align="left">
        + logNotificationDispatch(payload) : Entry<br/>
        + queryNotificationLogs(opts) : List<br/>
        + dispatchODApprovalWorkflow(req, remarks)
      </td>
    </table>
  >]

  AuditLog [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>AuditLog</b></td></tr>
      <hr/>
      <td align="left">
        - id : String<br/>
        - action : String<br/>
        - user : String<br/>
        - details : String<br/>
        - timestamp : Date
      </td>
      <hr/>
      <td align="left">
        + queryAuditLogs(filter) : List&lt;AuditLog&gt;<br/>
        + logSecurityEvent(action, user, details)
      </td>
    </table>
  >]

  SystemSettings [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4" style="rounded">
      <tr><td bgcolor="#E6EEF8"><b>SystemSettings</b></td></tr>
      <hr/>
      <td align="left">
        - key : String<br/>
        - institutionName : String<br/>
        - allowedEmailDomain : String<br/>
        - requireEmailDomainCheck : Boolean<br/>
        - allowRegistration : Boolean<br/>
        - academicYear : String
      </td>
      <hr/>
      <td align="left">
        + getSystemSettings() : SystemSettings<br/>
        + updateSystemSettings(data, admin) : Settings<br/>
        + isEmailDomainAllowed(email) : Boolean
      </td>
    </table>
  >]

  // Relationships with Multiplicities and Arrow Types
  Student -> User [label="0..1 generalizes / maps to 1", arrowhead="empty", style="solid"]
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

// 2. ER DIAGRAM (Chen notation: rectangular entities, oval attributes, diamond relationships)
const erDiagramDot = `
graph CampusEventHubER {
  graph [
    layout=neato
    overlap=false
    splines=true
    bgcolor="white"
    fontname="Times New Roman"
  ]
  node [
    fontname="Times New Roman"
    fontsize=10
    color="#000000"
  ]
  edge [
    fontname="Times New Roman"
    fontsize=9
    color="#000000"
    len=1.4
  ]

  // Entities (Rectangles)
  node [shape=box, style="filled", fillcolor="#EAF2F8", penwidth=1.5]
  E_USERS [label="USERS"]
  E_STUDENTS [label="STUDENTS"]
  E_EVENTS [label="EVENTS"]
  E_REGISTRATIONS [label="REGISTRATIONS"]
  E_PERMISSIONS [label="PERMISSION_REQUESTS"]
  E_ODRECORDS [label="OD_RECORDS"]
  E_CHAPTERS [label="CHAPTERS"]
  E_CAMPUSLINKS [label="CAMPUS_LINKS"]
  E_NOTIFICATIONS [label="NOTIFICATION_LOGS"]
  E_AUDITLOGS [label="AUDIT_LOGS"]
  E_SETTINGS [label="SYSTEM_SETTINGS"]

  // Relationships (Diamonds)
  node [shape=diamond, style="filled", fillcolor="#FEF9E7", penwidth=1.2]
  R_HAS_PROFILE [label="has_profile\\n1 : 0..1"]
  R_ENROLLS [label="registers_for\\n1 : N"]
  R_HOSTS [label="hosts\\n1 : N"]
  R_APPLIES [label="applies_for\\n1 : N"]
  R_SANCTIONS [label="sanctions\\n1 : 0..1"]
  R_AFFILIATES [label="member_of\\nN : 1"]
  R_LOGS_ACT [label="generates\\n1 : N"]
  R_SENDS_TO [label="dispatches_to\\n1 : N"]
  R_CURATES [label="curates\\n1 : N"]
  R_EVENT_REG [label="event_registered\\n1 : N"]

  // Attributes (Ovals)
  node [shape=ellipse, style="filled", fillcolor="#FFFFFF", penwidth=1.0, fontsize=8]
  // USERS attrs
  U_id [label=<<u>id</u>>]
  U_name [label="name"]
  U_email [label="email (UNI)"]
  U_role [label="role"]
  U_dept [label="dept"]
  U_isActive [label="isActive"]

  // STUDENTS attrs
  S_id [label=<<u>id</u>>]
  S_rollNo [label="rollNo (UNI)"]
  S_name [label="name"]
  S_dept [label="dept"]
  S_degree [label="degree"]
  S_attendance [label="attendanceCount"]

  // EVENTS attrs
  EV_id [label=<<u>id</u>>]
  EV_title [label="title"]
  EV_club [label="club"]
  EV_date [label="date"]
  EV_venue [label="venue"]
  EV_cap [label="capacity"]

  // REGISTRATIONS attrs
  RG_id [label=<<u>id</u>>]
  RG_evId [label="eventId (MUL)"]
  RG_email [label="email (MUL)"]
  RG_status [label="status"]
  RG_attended [label="attended"]
  RG_method [label="checkinMethod"]

  // PERMISSION attrs
  PR_id [label=<<u>id</u>>]
  PR_stId [label="studentId"]
  PR_evName [label="eventTitle"]
  PR_status [label="status"]
  PR_proof [label="proof"]

  // OD attrs
  OD_id [label=<<u>id</u>>]
  OD_passNo [label="passNumber"]
  OD_days [label="totalDaysOD"]
  OD_issuedBy [label="issuedBy"]
  OD_qr [label="qrCodeData"]

  // CHAPTERS attrs
  CH_id [label=<<u>id</u>>]
  CH_name [label="name (UNI)"]
  CH_counselor [label="counselor"]
  CH_members [label="memberCount"]

  // Connect USERS attrs
  E_USERS -- U_id
  E_USERS -- U_name
  E_USERS -- U_email
  E_USERS -- U_role
  E_USERS -- U_dept
  E_USERS -- U_isActive

  // Connect STUDENTS attrs
  E_STUDENTS -- S_id
  E_STUDENTS -- S_rollNo
  E_STUDENTS -- S_name
  E_STUDENTS -- S_dept
  E_STUDENTS -- S_degree
  E_STUDENTS -- S_attendance

  // Connect EVENTS attrs
  E_EVENTS -- EV_id
  E_EVENTS -- EV_title
  E_EVENTS -- EV_club
  E_EVENTS -- EV_date
  E_EVENTS -- EV_venue
  E_EVENTS -- EV_cap

  // Connect REGISTRATIONS attrs
  E_REGISTRATIONS -- RG_id
  E_REGISTRATIONS -- RG_evId
  E_REGISTRATIONS -- RG_email
  E_REGISTRATIONS -- RG_status
  E_REGISTRATIONS -- RG_attended
  E_REGISTRATIONS -- RG_method

  // Connect PERMISSIONS attrs
  E_PERMISSIONS -- PR_id
  E_PERMISSIONS -- PR_stId
  E_PERMISSIONS -- PR_evName
  E_PERMISSIONS -- PR_status
  E_PERMISSIONS -- PR_proof

  // Connect OD attrs
  E_ODRECORDS -- OD_id
  E_ODRECORDS -- OD_passNo
  E_ODRECORDS -- OD_days
  E_ODRECORDS -- OD_issuedBy
  E_ODRECORDS -- OD_qr

  // Connect CHAPTERS attrs
  E_CHAPTERS -- CH_id
  E_CHAPTERS -- CH_name
  E_CHAPTERS -- CH_counselor
  E_CHAPTERS -- CH_members

  // Connect Entities through Relationships
  E_USERS -- R_HAS_PROFILE [label="1"]
  R_HAS_PROFILE -- E_STUDENTS [label="0..1"]

  E_STUDENTS -- R_ENROLLS [label="1"]
  R_ENROLLS -- E_REGISTRATIONS [label="N"]

  E_EVENTS -- R_EVENT_REG [label="1"]
  R_EVENT_REG -- E_REGISTRATIONS [label="N"]

  E_CHAPTERS -- R_HOSTS [label="1"]
  R_HOSTS -- E_EVENTS [label="N"]

  E_STUDENTS -- R_AFFILIATES [label="N"]
  R_AFFILIATES -- E_CHAPTERS [label="1"]

  E_STUDENTS -- R_APPLIES [label="1"]
  R_APPLIES -- E_PERMISSIONS [label="N"]

  E_PERMISSIONS -- R_SANCTIONS [label="1"]
  R_SANCTIONS -- E_ODRECORDS [label="0..1"]

  E_USERS -- R_LOGS_ACT [label="1"]
  R_LOGS_ACT -- E_AUDITLOGS [label="N"]

  E_USERS -- R_SENDS_TO [label="1"]
  R_SENDS_TO -- E_NOTIFICATIONS [label="N"]

  E_USERS -- R_CURATES [label="1"]
  R_CURATES -- E_CAMPUSLINKS [label="N"]
}
`

async function renderDotToPng(dotStr, outFilename, width = 1600, height = 1200) {
  const viz = await instance()
  const svg = viz.renderString(dotStr, { format: 'svg' })
  
  // Launch Puppeteer to render SVG cleanly at 300 DPI
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2.0 })
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: white; }
          svg { width: 100%; height: auto; max-width: ${width - 40}px; }
        </style>
      </head>
      <body>${svg}</body>
    </html>
  `
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForSelector('svg')
  const element = await page.$('svg')
  const outPath = path.join(OUTPUT_DIR, outFilename)
  await element.screenshot({ path: outPath, omitBackground: false })
  await browser.close()
  console.log(`Rendered: ${outFilename} -> ${outPath}`)
}

async function main() {
  console.log('Rendering Class Diagram...')
  await renderDotToPng(classDiagramDot, 'class_diagram.png', 1800, 1400)
  
  console.log('Rendering ER Diagram...')
  await renderDotToPng(erDiagramDot, 'er_diagram.png', 1800, 1300)
  
  console.log('All diagrams successfully generated at high resolution!')
}

main().catch(err => {
  console.error('Error generating diagrams:', err)
  process.exit(1)
})
