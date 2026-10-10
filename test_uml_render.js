import fs from 'fs'
import { instance } from '@viz-js/viz'
import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const viz = await instance()

const testUml = `
digraph CampusEventHubClassDiagram {
  graph [
    rankdir=BT
    splines=polyline
    nodesep=0.5
    ranksep=0.6
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
    arrowsize=0.8
  ]

  User [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F0F0F0"><b>User</b></td></tr>
      <hr/>
      <tr><td align="left">
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
        + findUserByEmail(email) : User<br/>
        + createUser(data) : User<br/>
        + changeUserPassword(id, old, new) : Boolean<br/>
        + updateUserPreferences(id, prefs) : Object
      </td></tr>
    </table>
  >]

  Student [label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="3">
      <tr><td bgcolor="#F0F0F0"><b>Student</b></td></tr>
      <hr/>
      <tr><td align="left">
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
        + queryStudents(filters) : List&lt;Student&gt;<br/>
        + getStudentById(id) : Student<br/>
        + updateProfile(id, data) : Student
      </td></tr>
    </table>
  >]

  Student -> User [label="0..1 generalizes / maps to 1", arrowhead="empty"]
}
`

const res = viz.render(testUml, { format: 'svg' })
console.log('Status:', res.status)
console.log('Errors:', res.errors)

if (res.output) {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true })
  const page = await browser.newPage()
  await page.setContent(`<html><body style="margin:20px">${res.output}</body></html>`)
  const svg = await page.$('svg')
  await svg.screenshot({ path: 'test_uml.png' })
  await browser.close()
  console.log('Saved test_uml.png')
}
