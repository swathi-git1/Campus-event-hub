// ==============================================================================
// CAMPUS EVENT HUB - OCTOBER 2026 EXTERNAL PARTICIPATION & OD ANALYTICS DATASET
// 45 Students Participated · 12 External Colleges · 5 1st Prize · 7 2nd Prize · 9 3rd Prize
// ==============================================================================

export const EXTERNAL_COLLEGES = [
  "IIT Madras",
  "NIT Trichy",
  "Anna University",
  "BITS Pilani",
  "VIT Vellore",
  "PSG College of Technology",
  "SRM University",
  "SSN College of Engineering",
  "Thiagarajar College of Engineering",
  "Coimbatore Institute of Technology",
  "Government College of Technology",
  "Bannari Amman Institute of Technology"
]

export const EXTERNAL_EVENTS = [
  { name: "Inter-Collegiate Grand Coding League 2026", college: "IIT Madras", date: "2026-10-04", type: "Hackathon & Coding" },
  { name: "Southern Region Autonomous Robotics Championship", college: "NIT Trichy", date: "2026-10-07", type: "Robotics Arena" },
  { name: "All-India Smart Energy & EV Expo", college: "Anna University", date: "2026-10-10", type: "Technical Symposium" },
  { name: "National Cyber Defense & CTF Conclave", college: "BITS Pilani", date: "2026-10-12", type: "Cybersecurity Contest" },
  { name: "State AI & Computer Vision Hackathon", college: "VIT Vellore", date: "2026-10-15", type: "AI & ML Sprint" },
  { name: "National Aerospace & UAV Drone Rodeo", college: "PSG College of Technology", date: "2026-10-17", type: "Aerospace Challenge" },
  { name: "Pan-India Biotech & Healthcare Hackathon", college: "SRM University", date: "2026-10-19", type: "HealthTech Hackathon" },
  { name: "Inter-University Mobile Cloud Sprint", college: "SSN College of Engineering", date: "2026-10-21", type: "App Development" },
  { name: "National Sustainable Structural Engineering Expo", college: "Thiagarajar College of Engineering", date: "2026-10-24", type: "Civil & Materials" },
  { name: "State Quantum Computing & Cryptography Symposium", college: "Coimbatore Institute of Technology", date: "2026-10-26", type: "Quantum Physics & CS" },
  { name: "Inter-State Eco-Vehicle & Solar Kart Invitational", college: "Government College of Technology", date: "2026-10-28", type: "Motorsports & EV" },
  { name: "National Youth Leadership & Debating Conclave", college: "Bannari Amman Institute of Technology", date: "2026-10-30", type: "Cultural & Debating" }
]

// 45 Student records tailored for October 2026:
// Exactly 5 First Prizes, 7 Second Prizes, 9 Third Prizes, 24 Participants
const studentsList = [
  // 5 FIRST PRIZE WINNERS (🥇)
  { name: "Rahul K.", roll: "22CS104", dept: "Computer Science & Engineering", yr: "4th Year", evIdx: 0, prize: "First Prize", award: "₹50,000 Cash Prize + Gold Medal" },
  { name: "Karthik Verma", roll: "23EC041", dept: "Electronics & Communication", yr: "3rd Year", evIdx: 1, prize: "First Prize", award: "₹40,000 Cash Prize + Championship Cup" },
  { name: "Kavya Murugan", roll: "21EE018", dept: "Electrical & Electronics", yr: "4th Year", evIdx: 2, prize: "First Prize", award: "₹35,000 Cash Prize + Best Paper Trophy" },
  { name: "Vikram S.", roll: "22IT045", dept: "Information Technology", yr: "3rd Year", evIdx: 3, prize: "First Prize", award: "₹30,000 Bounty + CTF Champion Shield" },
  { name: "Arjun V.", roll: "22ME009", dept: "Mechanical Engineering", yr: "4th Year", evIdx: 5, prize: "First Prize", award: "₹45,000 UAV Grant + Gold Medal" },

  // 7 SECOND PRIZE WINNERS (🥈)
  { name: "Ananya Rao", roll: "23CS082", dept: "Computer Science & Engineering", yr: "3rd Year", evIdx: 0, prize: "Second Prize", award: "₹25,000 Cash Prize + Silver Medal" },
  { name: "Sneha K.", roll: "22EC091", dept: "Electronics & Communication", yr: "4th Year", evIdx: 4, prize: "Second Prize", award: "₹20,000 Cash Prize + Silver Medal" },
  { name: "Abhinav P.", roll: "23IT012", dept: "Information Technology", yr: "3rd Year", evIdx: 7, prize: "Second Prize", award: "₹15,000 Cloud Credits + Silver Trophy" },
  { name: "Rajesh N.", roll: "22EE034", dept: "Electrical & Electronics", yr: "4th Year", evIdx: 2, prize: "Second Prize", award: "₹18,000 Cash Prize + Runner-up Shield" },
  { name: "Tharun K.", roll: "22CE014", dept: "Civil Engineering", yr: "4th Year", evIdx: 8, prize: "Second Prize", award: "₹15,000 Cash Prize + Silver Medal" },
  { name: "Hariharan M.", roll: "22ME088", dept: "Mechanical Engineering", yr: "3rd Year", evIdx: 10, prize: "Second Prize", award: "₹20,000 Innovation Trophy" },
  { name: "Pooja Raman", roll: "23CS112", dept: "Computer Science & Engineering", yr: "3rd Year", evIdx: 9, prize: "Second Prize", award: "₹15,000 Research Grant + Silver Plaque" },

  // 9 THIRD PRIZE WINNERS (🥉)
  { name: "Harish V.", roll: "22CS045", dept: "Computer Science & Engineering", yr: "4th Year", evIdx: 0, prize: "Third Prize", award: "₹10,000 Cash Prize + Bronze Medal" },
  { name: "Nandhini K.", roll: "23IT088", dept: "Information Technology", yr: "3rd Year", evIdx: 3, prize: "Third Prize", award: "₹10,000 Bounty + Bronze Shield" },
  { name: "Ajay Krishnan", roll: "23EC015", dept: "Electronics & Communication", yr: "3rd Year", evIdx: 1, prize: "Third Prize", award: "₹12,000 Cash Prize + Bronze Trophy" },
  { name: "Deepa S.", roll: "23EE012", dept: "Electrical & Electronics", yr: "3rd Year", evIdx: 2, prize: "Third Prize", award: "₹8,000 Cash Prize + Certificate of Merit" },
  { name: "Vigneshwaran K.", roll: "23ME045", dept: "Mechanical Engineering", yr: "3rd Year", evIdx: 5, prize: "Third Prize", award: "₹10,000 Hardware Voucher + Bronze Medal" },
  { name: "Divya S.", roll: "24CS015", dept: "Computer Science & Engineering", yr: "2nd Year", evIdx: 6, prize: "Third Prize", award: "₹10,000 HealthTech Prize" },
  { name: "Priya Dharshini", roll: "23CE032", dept: "Civil Engineering", yr: "3rd Year", evIdx: 8, prize: "Third Prize", award: "₹8,000 Cash Prize + Bronze Trophy" },
  { name: "Dinesh R.", roll: "22ME034", dept: "Mechanical Engineering", yr: "4th Year", evIdx: 10, prize: "Third Prize", award: "₹10,000 EV Design Award" },
  { name: "Manoj T.", roll: "22IT067", dept: "Information Technology", yr: "4th Year", evIdx: 4, prize: "Third Prize", award: "₹10,000 AI Model Voucher + Bronze Shield" },

  // 24 PARTICIPANTS (COMPLETED EXTERNAL COLLEGE PARTICIPATIONS)
  { name: "Karthik M.", roll: "22CS078", dept: "Computer Science & Engineering", yr: "4th Year", evIdx: 0, prize: "Participant" },
  { name: "Ashwin R.", roll: "23CS034", dept: "Computer Science & Engineering", yr: "3rd Year", evIdx: 4, prize: "Participant" },
  { name: "Swathi N.", roll: "23CS056", dept: "Computer Science & Engineering", yr: "3rd Year", evIdx: 9, prize: "Participant" },
  { name: "Gautham B.", roll: "22IT091", dept: "Information Technology", yr: "4th Year", evIdx: 3, prize: "Participant" },
  { name: "Lavanya M.", roll: "23IT044", dept: "Information Technology", yr: "3rd Year", evIdx: 7, prize: "Participant" },
  { name: "Shalini R.", roll: "24IT023", dept: "Information Technology", yr: "2nd Year", evIdx: 7, prize: "Participant" },
  { name: "Rithika P.", roll: "24EC032", dept: "Electronics & Communication", yr: "2nd Year", evIdx: 1, prize: "Participant" },
  { name: "Vignesh S.", roll: "22EC104", dept: "Electronics & Communication", yr: "4th Year", evIdx: 1, prize: "Participant" },
  { name: "Meera T.", roll: "23EC087", dept: "Electronics & Communication", yr: "3rd Year", evIdx: 4, prize: "Participant" },
  { name: "Arvind K.", roll: "22EC055", dept: "Electronics & Communication", yr: "4th Year", evIdx: 5, prize: "Participant" },
  { name: "Kaviya M.", roll: "23EC066", dept: "Electronics & Communication", yr: "3rd Year", evIdx: 6, prize: "Participant" },
  { name: "Praveen C.", roll: "22EE078", dept: "Electrical & Electronics", yr: "4th Year", evIdx: 2, prize: "Participant" },
  { name: "Sanjay B.", roll: "24EE045", dept: "Electrical & Electronics", yr: "2nd Year", evIdx: 2, prize: "Participant" },
  { name: "Preethi K.", roll: "23EE089", dept: "Electrical & Electronics", yr: "3rd Year", evIdx: 10, prize: "Participant" },
  { name: "Balaji R.", roll: "22EE061", dept: "Electrical & Electronics", yr: "4th Year", evIdx: 10, prize: "Participant" },
  { name: "Sathish T.", roll: "24ME012", dept: "Mechanical Engineering", yr: "2nd Year", evIdx: 5, prize: "Participant" },
  { name: "Surya P.", roll: "23ME077", dept: "Mechanical Engineering", yr: "3rd Year", evIdx: 10, prize: "Participant" },
  { name: "Manikandan S.", roll: "22ME052", dept: "Mechanical Engineering", yr: "4th Year", evIdx: 10, prize: "Participant" },
  { name: "Vasanth S.", roll: "24CE018", dept: "Civil Engineering", yr: "2nd Year", evIdx: 8, prize: "Participant" },
  { name: "Nivetha R.", roll: "23CE045", dept: "Civil Engineering", yr: "3rd Year", evIdx: 8, prize: "Participant" },
  { name: "Anand Kumar", roll: "23CS120", dept: "Computer Science & Engineering", yr: "3rd Year", evIdx: 6, prize: "Participant" },
  { name: "Preetha V.", roll: "23IT050", dept: "Information Technology", yr: "3rd Year", evIdx: 11, prize: "Participant" },
  { name: "Rohit N.", roll: "22EC070", dept: "Electronics & Communication", yr: "4th Year", evIdx: 11, prize: "Participant" },
  { name: "Kiran S.", roll: "23ME060", dept: "Mechanical Engineering", yr: "3rd Year", evIdx: 11, prize: "Participant" }
]

export const octoberPermissionRequests = studentsList.map((stu, i) => {
  const ev = EXTERNAL_EVENTS[stu.evIdx]
  const idNum = 2001 + i
  const reqId = `PR-2026-${idNum}`
  const passId = `OD-2026-${3100 + i}`
  const isPrize = stu.prize && stu.prize !== 'Participant'

  return {
    id: reqId,
    studentId: 1000 + i,
    studentName: stu.name,
    studentEmail: `${stu.name.toLowerCase().replace(/[^a-z]/g, '')}@college.edu`,
    rollNo: stu.roll,
    dept: stu.dept,
    year: stu.yr,
    eventName: ev.name,
    eventType: ev.type,
    scope: "External",
    organizer: ev.college,
    eventDate: ev.date,
    eventEndDate: ev.date,
    eventTime: "09:00 AM – 05:30 PM",
    venue: `${ev.college} Main Campus`,
    purpose: `Official institutional representation and contest delegation at ${ev.college} for ${ev.name}.`,
    relatedClub: stu.dept.includes('Computer') ? 'CSI' : stu.dept.includes('Electronics') ? 'IEEE' : stu.dept.includes('Mechanical') ? 'Sports' : 'IE',
    teamMembers: [],
    invitationDocUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    invitationDocName: `${ev.name.slice(0, 15).replace(/\s+/g, '_')}_Invitation.pdf`,
    additionalRemarks: "Approved travel and registration under university academic delegation grant.",
    status: "OD Issued",
    submittedAt: `2026-09-28T09:${String(10 + (i % 45)).padStart(2, '0')}:00.000Z`,
    reviewedAt: `2026-09-29T11:30:00.000Z`,
    reviewedBy: "Dr. Malathi Sundaram",
    facultyRemarks: "Permission granted for prestigious inter-collegiate external event.",
    prize: stu.prize,
    proof: {
      submittedAt: `2026-10-${String(parseInt(ev.date.slice(-2)) + 1).padStart(2, '0')}T14:00:00.000Z`,
      photos: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
      ],
      certificateUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?auto=format&fit=crop&w=600&q=80",
      attendanceProofUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      description: isPrize
        ? `Secured ${stu.prize}! ${stu.award || ''}. Official external institutional certificate and trophy photos authenticated.`
        : `Successfully attended and completed delegation in ${ev.name} at ${ev.college}. Participation certificate submitted.`,
      prize: stu.prize,
      award: stu.award || null,
      verifiedAt: `2026-10-${String(parseInt(ev.date.slice(-2)) + 2).padStart(2, '0')}T10:00:00.000Z`,
      verifiedBy: "Dr. Malathi Sundaram",
      verificationRemarks: "Certificate verified directly with host institution credentials."
    },
    odRecordId: passId
  }
})

export const octoberODRecords = octoberPermissionRequests.map((req, i) => {
  return {
    id: req.odRecordId,
    requestId: req.id,
    studentId: req.studentId,
    studentName: req.studentName,
    studentEmail: req.studentEmail,
    rollNo: req.rollNo,
    dept: req.dept,
    degree: `B.Tech ${req.dept.split(' ')[0]}`,
    year: req.year,
    eventName: req.eventName,
    eventType: req.eventType,
    organizer: req.organizer,
    eventDates: `${req.eventDate} – ${req.eventEndDate}`,
    totalDaysOD: 1,
    venue: req.venue,
    status: "Active / Verified",
    issuedBy: "Dr. Malathi Sundaram",
    issuerDesignation: "Chief Event Permission & OD In-Charge",
    issuedAt: req.eventDate,
    issuedAtTimestamp: `${req.eventDate}T16:00:00.000Z`,
    verificationReference: `VER-${req.id}-VALID`,
    qrCodeData: `CEH-OFFICIAL-OD-PASS:${req.odRecordId}:${req.rollNo}:${req.organizer}:VERIFIED`,
    remarks: `Official On-Duty sanctioned for participation in ${req.eventName} organized by ${req.organizer}. ${req.prize && req.prize !== 'Participant' ? `Won ${req.prize}! ` : ''}Academic attendance registers formally credited.`
  }
})
