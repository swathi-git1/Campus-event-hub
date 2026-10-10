// Campus Event Hub - Seed Mock Data
import { octoberPermissionRequests, octoberODRecords } from './octoberAnalyticsData.js'

export const instructors = [
  {
    id: "inst_csi",
    name: "Dr. K. Ramanathan",
    email: "csi.advisor@college.edu",
    password: "csi@faculty2026",
    role: "instructor",
    designation: "Associate Professor & Faculty Advisor",
    dept: "Computer Science & Engineering",
    employeeId: "FAC-CSE-408",
    assignedClub: "CSI",
    officeRoom: "CSE Block - Room 312",
    officeHours: "Mon, Wed, Fri: 2:00 PM – 4:00 PM",
    phone: "+91 94441 23890",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    bio: "Ph.D. in Distributed Computing. Faculty Advisor for CSI Chapter since 2021. Passionate about mentoring student hackathon teams, open-source development, and cloud computing architectures.",
    specializations: ["Distributed Systems", "Cloud Computing", "AI Systems", "Data Structures"]
  },
  {
    id: "inst_ieee",
    name: "Prof. S. Narayanan",
    email: "ieee.advisor@college.edu",
    password: "ieee@faculty2026",
    role: "instructor",
    designation: "Professor & IEEE Branch Counselor",
    dept: "Electrical & Electronics Engineering",
    employeeId: "FAC-EEE-204",
    assignedClub: "IEEE",
    officeRoom: "EEE Advanced Lab - Cabin 104",
    officeHours: "Tue, Thu: 10:00 AM – 1:00 PM",
    phone: "+91 94442 87654",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    bio: "Senior IEEE Member and Researcher in Smart Micro-Grids and Embedded IoT. Mentors student teams on international IEEE paper publications and hardware build days.",
    specializations: ["Smart Grids", "IoT & Embedded Systems", "Renewable Energy", "Signal Processing"]
  },
  {
    id: "inst_ie",
    name: "Dr. V. Sundaram",
    email: "ie.advisor@college.edu",
    password: "ie@faculty2026",
    role: "instructor",
    designation: "Associate Professor & IE Chapter Head",
    dept: "Mechanical Engineering",
    employeeId: "FAC-MEC-319",
    assignedClub: "IE",
    officeRoom: "Mechanical Block - Room 208",
    officeHours: "Mon, Thu: 3:00 PM – 5:00 PM",
    phone: "+91 98840 55123",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    bio: "Chartered Engineer with 15+ years experience in CAD/CAM modeling, industrial manufacturing, and plant automation.",
    specializations: ["CAD/CAM", "Industrial Robotics", "Thermal Systems"]
  },
  {
    id: "inst_yoga",
    name: "Dr. Jayashree M.",
    email: "yoga.advisor@college.edu",
    password: "yoga@faculty2026",
    role: "instructor",
    designation: "Director of Physical Wellness",
    dept: "Physical Education & Wellness",
    employeeId: "FAC-PED-112",
    assignedClub: "Yoga",
    officeRoom: "Campus Sports & Wellness Complex - Room 12",
    officeHours: "Daily: 6:00 AM – 8:30 AM & 4:30 PM – 6:00 PM",
    phone: "+91 98410 99432",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
    bio: "Certified Master Yoga Trainer (AYUSH). Leads daily morning student yoga, mindfulness meditation, and stress resilience clinics.",
    specializations: ["Hatha Yoga", "Pranayama", "Mindfulness", "Sports Psychology"]
  },
  {
    id: "inst_sports",
    name: "Coach R. Balaji",
    email: "sports.advisor@college.edu",
    password: "sports@faculty2026",
    role: "instructor",
    designation: "Chief Sports Director",
    dept: "Physical Education",
    employeeId: "FAC-PED-098",
    assignedClub: "Sports",
    officeRoom: "Main Stadium Pavilion - Office 01",
    officeHours: "Mon–Fri: 3:00 PM – 7:00 PM",
    phone: "+91 94443 11223",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
    bio: "Former state athlete and NIS Certified Coach. Oversees university teams in football, cricket, basketball, and track & field.",
    specializations: ["Athletics", "Football Conditioning", "Tournament Operations"]
  },
  {
    id: "inst_arts",
    name: "Prof. Ananya Sen",
    email: "arts.advisor@college.edu",
    password: "arts@faculty2026",
    role: "instructor",
    designation: "Assistant Professor & Arts Curator",
    dept: "Architecture & Design",
    employeeId: "FAC-ARC-154",
    assignedClub: "Fine Arts",
    officeRoom: "Architecture Studio - Cabin 402",
    officeHours: "Wed, Fri: 1:30 PM – 4:30 PM",
    phone: "+91 98845 66789",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    bio: "Visual artist and architect. Curates annual campus mural galleries, sustainable design workshops, and student art festivals.",
    specializations: ["Visual Arts", "Urban Murals", "Sustainable Design", "Mixed Media"]
  },
  {
    id: "inst_nss",
    name: "Dr. K. Ganesan",
    email: "nss.advisor@college.edu",
    password: "nss@faculty2026",
    role: "instructor",
    designation: "NSS Program Officer & Associate Professor",
    dept: "Humanities & Social Sciences",
    employeeId: "FAC-HSS-231",
    assignedClub: "NSS",
    officeRoom: "Student Affairs Wing - Office 103",
    officeHours: "Tue, Thu: 2:00 PM – 5:00 PM",
    phone: "+91 94446 77889",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    bio: "State Award-winning NSS Program Officer. Directs community adoption drives, blood donation camps, and rural school literacy programs.",
    specializations: ["Community Development", "Rural Outreach", "Environmental Action"]
  },
  {
    id: "inst_ncc",
    name: "Capt. M. Suresh",
    email: "ncc.advisor@college.edu",
    password: "ncc@faculty2026",
    role: "instructor",
    designation: "Associate NCC Officer & Assistant Professor",
    dept: "Civil Engineering",
    employeeId: "FAC-CIV-189",
    assignedClub: "NCC",
    officeRoom: "Parade Ground NCC Unit HQ",
    officeHours: "Mon, Wed: 6:00 AM – 9:00 AM",
    phone: "+91 94448 99001",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
    bio: "Commissioned ANO in the National Cadet Corps. Trains cadets in military drills, obstacle courses, shooting, and leadership camps.",
    specializations: ["Cadet Drills", "Adventure Training", "Leadership Development"]
  }
]

export const defaultStudentProfile = {
  id: 1001,
  name: "Ananya Rao",
  email: "student@college.edu",
  password: "student123",
  role: "student",
  clubPosition: {
    club: "CSI",
    title: "Event Operations & Attendance Manager",
    category: "managing",
    isLead: true
  },
  rollNo: "23CS082",
  dept: "Computer Science & Engineering",
  degree: "B.Tech (Hons.) Computer Science",
  year: "3rd Year",
  semester: "5th Semester",
  cgpa: "9.18 / 10.0",
  academicStanding: "Top 5% (Dean's Honor List)",
  phone: "+91 98765 43210",
  campusResidence: "Campus Hostel Block C - Room 304",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  bio: "Fullstack developer and competitive coder. Passionate about AI/ML edge systems, distributed protocols, and hackathons. Lead coordinator for CSI Chapter Event Operations Wing.",
  skills: ["React.js", "Node.js", "Python", "C++", "System Design", "Git & Open Source", "Docker"],
  certificates: [
    { title: "National Hackathon 2026 Champion Pass", issuer: "CSI National Council", date: "Aug 2026", badge: "🏆 1st Place" },
    { title: "Smart Grid Research Volunteer", issuer: "IEEE Student Branch", date: "Jul 2026", badge: "📜 Merit" },
    { title: "Rural Digital Literacy Service Award", issuer: "NSS Outreach Unit", date: "May 2026", badge: "⭐ 60 Volunteer Hours" }
  ]
}

export const studentAccounts = [
  {
    id: 1001,
    name: "Ananya Rao",
    email: "student@college.edu",
    password: "student123",
    role: "student",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    degree: "B.Tech Computer Science",
    year: "3rd Year",
    clubPosition: {
      club: "CSI",
      title: "Event Operations & Attendance Manager",
      category: "managing",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1002,
    name: "Rahul K.",
    email: "rahul.k@college.edu",
    password: "rahul123",
    role: "student",
    rollNo: "22CS104",
    dept: "Computer Science & Engineering",
    degree: "B.Tech Computer Science",
    year: "4th Year",
    clubPosition: {
      club: "CSI",
      title: "President & Student Conducting Lead",
      category: "conducting",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1003,
    name: "Karthik Verma",
    email: "karthik.v@college.edu",
    password: "karthik123",
    role: "student",
    rollNo: "23EC041",
    dept: "Electronics & Communication",
    degree: "B.Tech ECE",
    year: "2nd Year",
    clubPosition: {
      club: "IEEE",
      title: "Hardware & IoT Project Lead",
      category: "conducting",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1004,
    name: "Vikram S.",
    email: "vikram.s@college.edu",
    password: "vikram123",
    role: "student",
    rollNo: "22IT045",
    dept: "Information Technology",
    degree: "B.Tech IT",
    year: "3rd Year",
    clubPosition: {
      club: "CSI",
      title: "Technical Platform Coordinator",
      category: "tech",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1005,
    name: "Sneha K.",
    email: "sneha.k@college.edu",
    password: "sneha123",
    role: "student",
    rollNo: "22EC091",
    dept: "Electronics & Communication",
    degree: "B.Tech ECE",
    year: "3rd Year",
    clubPosition: {
      club: "CSI",
      title: "Media, Poster & Design Lead",
      category: "design",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1007,
    name: "Harish Patel",
    email: "harish.p@college.edu",
    password: "harish123",
    role: "student",
    rollNo: "21EE034",
    dept: "Electrical & Electronics",
    degree: "B.Tech EEE",
    year: "4th Year",
    clubPosition: {
      club: "IE",
      title: "Student Conduction Lead",
      category: "conducting",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
  },
  {
    id: 1009,
    name: "Meera S.",
    email: "meera.s@college.edu",
    password: "meera123",
    role: "student",
    rollNo: "23AR012",
    dept: "Architecture & Design",
    degree: "B.Arch",
    year: "2nd Year",
    clubPosition: {
      club: "Fine Arts",
      title: "Chief Studio Curator",
      category: "conducting",
      isLead: true
    },
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
  }
]

export const defaultAdminProfile = {
  id: "admin_dean",
  name: "Dr. Aris Thorne",
  email: "admin@college.edu",
  password: "admin2026",
  role: "admin",
  designation: "Dean of Student Affairs & Platform Super Administrator",
  dept: "Office of the Dean (Student Welfare)",
  adminId: "ADMIN-DSA-001",
  officeRoom: "Administration Building - Suite 101",
  phone: "+91 94440 00100",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  bio: "Oversees all campus clubs, faculty advisor allocations, event moderation, campus activity approvals, and university code of conduct."
}

export const officialCredentialsDirectory = {
  instructors: [
    { club: "CSI (Computer Society)", advisor: "Dr. K. Ramanathan", email: "csi.advisor@college.edu", password: "csi@faculty2026", dept: "CSE Dept" },
    { club: "IEEE Student Branch", advisor: "Prof. S. Narayanan", email: "ieee.advisor@college.edu", password: "ieee@faculty2026", dept: "EEE Dept" },
    { club: "IE (Institution of Engineers)", advisor: "Dr. V. Sundaram", email: "ie.advisor@college.edu", password: "ie@faculty2026", dept: "Mechanical" },
    { club: "Yoga & Wellness Society", advisor: "Dr. Jayashree M.", email: "yoga.advisor@college.edu", password: "yoga@faculty2026", dept: "Physical Wellness" },
    { club: "Sports Council", advisor: "Coach R. Balaji", email: "sports.advisor@college.edu", password: "sports@faculty2026", dept: "Athletics" },
    { club: "Fine Arts Guild", advisor: "Prof. Ananya Sen", email: "arts.advisor@college.edu", password: "arts@faculty2026", dept: "Architecture" },
    { club: "NSS Unit", advisor: "Dr. K. Ganesan", email: "nss.advisor@college.edu", password: "nss@faculty2026", dept: "Social Sciences" },
    { club: "NCC Corps", advisor: "Capt. M. Suresh", email: "ncc.advisor@college.edu", password: "ncc@faculty2026", dept: "Civil Engg" }
  ],
  coordinators: [
    { name: "Ananya Rao", position: "Operations & Attendance Manager (CSI)", email: "student@college.edu", password: "student123", club: "CSI" },
    { name: "Rahul K.", position: "President & Conducting Lead (CSI)", email: "rahul.k@college.edu", password: "rahul123", club: "CSI" },
    { name: "Karthik Verma", position: "Hardware & IoT Project Lead (IEEE)", email: "karthik.v@college.edu", password: "karthik123", club: "IEEE" },
    { name: "Sneha K.", position: "Media, Poster & Design Lead (CSI)", email: "sneha.k@college.edu", password: "sneha123", club: "CSI" },
    { name: "Harish Patel", position: "Student Conduction Lead (IE)", email: "harish.p@college.edu", password: "harish123", club: "IE" }
  ],
  admin: [
    { name: "Dr. Aris Thorne", title: "Dean of Student Affairs", email: "admin@college.edu", password: "admin2026" }
  ],
  odIncharge: [
    { name: "Dr. Malathi Sundaram", title: "Chief OD & Permission In-Charge", email: "od.faculty@college.edu", password: "od@faculty2026", dept: "Academic & Student Affairs" }
  ]
}

export const curatedPosterPresets = [
  { label: "AI & Tech Hackathon", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
  { label: "Hardware & IoT Expo", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
  { label: "Robotics Arena", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
  { label: "Engineering Summit", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" },
  { label: "Yoga & Wellness", url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80" },
  { label: "Football Championship", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" },
  { label: "Fine Arts Gala", url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80" },
  { label: "Community & NSS", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" }
]

export const events = [
  // COMPLETED EVENT WITH OFFICIALLY RECOGNIZED WINNERS
  {
    id: 13,
    title: "Inter College Coding Competition",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Aug 15, 2026 · 10:00 AM",
    venue: "Main Computing Center & Auditorium",
    registered: 110,
    capacity: 120,
    desc: "Premier inter-collegiate competitive programming and algorithms sprint featuring algorithmic challenges in dynamic programming, graph theory, and real-time distributed data structures.",
    enrollStart: "2026-08-01T00:00:00",
    enrollEnd: "2026-08-14T23:59:00",
    conductionDate: "2026-08-15T10:00:00",
    statusOverride: "completed",
    status: "completed",
    accessLevel: "open_to_all",
    venuePin: "4821",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (President & Student Conducting Lead)",
      eventManager: "Ananya Rao (Operations Manager)"
    },
    winners: [
      {
        prize: "First Prize",
        position: 1,
        studentName: "Rahul K.",
        rollNo: "22CS104",
        dept: "CSE",
        college: "National Engineering College",
        award: "₹25,000 Cash Prize + Gold Medal"
      },
      {
        prize: "Second Prize",
        position: 2,
        studentName: "Ananya Rao",
        rollNo: "23CS082",
        dept: "CSE",
        college: "National Engineering College",
        award: "₹15,000 Cash Prize + Silver Medal"
      },
      {
        prize: "Third Prize",
        position: 3,
        studentName: "Vikram S.",
        rollNo: "22IT045",
        dept: "IT",
        college: "National Engineering College",
        award: "₹10,000 Cash Prize + Bronze Medal"
      }
    ]
  },

  // NEW COMPLETED EVENT WITH PUBLISHED WINNERS AT THE BOTTOM
  {
    id: 14,
    title: "National Student Innovation & Project Expo 2026",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Sep 01, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium & Expo Arena",
    registered: 148,
    capacity: 150,
    desc: "National collegiate technical exposition and hardware demo day where top collegiate teams presented working AI, IoT, and embedded robotics prototypes before senior industry jury members.",
    enrollStart: "2026-08-10T00:00:00",
    enrollEnd: "2026-08-30T23:59:00",
    conductionDate: "2026-09-01T10:00:00",
    statusOverride: "completed",
    status: "completed",
    accessLevel: "open_to_all",
    venuePin: "5512",
    teamEvent: true,
    teamSize: 4,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (President & Student Conducting Lead)",
      eventManager: "Ananya Rao (Operations Manager)"
    },
    winners: [
      {
        prize: "First Prize",
        position: 1,
        studentName: "Rahul K.",
        rollNo: "22CS104",
        dept: "CSE",
        college: "National Engineering College",
        award: "₹30,000 Cash Prize + Gold Shield"
      },
      {
        prize: "Second Prize",
        position: 2,
        studentName: "Ananya Rao",
        rollNo: "23CS082",
        dept: "CSE",
        college: "National Engineering College",
        award: "₹20,000 Cash Prize + Silver Shield"
      },
      {
        prize: "Third Prize",
        position: 3,
        studentName: "Harish Patel",
        rollNo: "22EE044",
        dept: "EEE",
        college: "National Engineering College",
        award: "₹10,000 Cash Prize + Bronze Shield"
      }
    ]
  },

  // JULY 2026 (Completed past events)
  {
    id: 10,
    title: "State Microgrid & Smart Energy Paper Conclave",
    club: "IEEE",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Jul 14, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium",
    registered: 95,
    capacity: 100,
    desc: "State-level paper presentation and symposium on distributed micro-grids, IoT monitoring, and renewable power systems.",
    enrollStart: "2026-07-01T00:00:00",
    enrollEnd: "2026-07-13T23:59:00",
    conductionDate: "2026-07-14T10:00:00",
    statusOverride: "completed",
    status: "completed",
    accessLevel: "open_to_all",
    venuePin: "3104",
    teamEvent: true,
    teamSize: 2,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. S. Narayanan (EEE Dept)",
      conductingLead: "Kavya Murugan (Research Lead)",
      eventManager: "Harish Patel (Coordinator)"
    },
    winners: [
      {
        prize: "First Prize",
        position: 1,
        studentName: "Kavya Murugan",
        rollNo: "22EE031",
        dept: "EEE",
        college: "National Engineering College",
        award: "₹20,000 Cash Prize & Best Paper Trophy"
      },
      {
        prize: "Second Prize",
        position: 2,
        studentName: "Harish Patel",
        rollNo: "22EE044",
        dept: "EEE",
        college: "National Engineering College",
        award: "₹12,000 Cash Prize & Silver Medal"
      },
      {
        prize: "Third Prize",
        position: 3,
        studentName: "Vikram S.",
        rollNo: "22IT045",
        dept: "IT",
        college: "National Engineering College",
        award: "₹8,000 Cash Prize + Merit Certificate"
      }
    ]
  },
  {
    id: 11,
    title: "Mega Blood Donation & Community Health Camp",
    club: "NSS",
    tag: "Service",
    tagClass: "tag-teal",
    date: "Jul 22, 2026 · 9:00 AM",
    venue: "Campus Indoor Health Complex",
    registered: 142,
    capacity: 150,
    desc: "Annual mega blood donation camp organized with the State Red Cross and Government General Hospital. Over 300 units collected.",
    enrollStart: "2026-07-08T00:00:00",
    enrollEnd: "2026-07-21T20:00:00",
    conductionDate: "2026-07-22T09:00:00",
    statusOverride: "closed",
    accessLevel: "open_to_all",
    venuePin: "7820",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ganesan (NSS Officer)",
      conductingLead: "Arjun V. (NSS President)",
      eventManager: "Pooja Raman (Outreach Coordinator)"
    }
  },
  {
    id: 12,
    title: "Eco-Mural & Sustainable Street Art Gala",
    club: "Fine Arts",
    tag: "Cultural",
    tagClass: "tag-purple",
    date: "Jul 28, 2026 · 2:00 PM",
    venue: "Campus Art Walk & Gallery",
    registered: 48,
    capacity: 50,
    desc: "Visual art showcase using organic natural dyes and recycled paper mediums, exploring themes of sustainability and campus ecology.",
    enrollStart: "2026-07-15T00:00:00",
    enrollEnd: "2026-07-27T18:00:00",
    conductionDate: "2026-07-28T14:00:00",
    statusOverride: "closed",
    accessLevel: "members_only",
    venuePin: "6619",
    teamEvent: false,
    fee: "Guild Members",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. Ananya Sen (Architecture)",
      conductingLead: "Meera S. (Curator)",
      eventManager: "Sneha K. (Exhibition Lead)"
    }
  },

  // AUGUST 2026
  {
    id: 1,
    title: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    registered: 128,
    capacity: 200,
    desc: "Build a working software prototype in 24 hours with a team of up to four. Mentors on-site, meals provided, prizes of ₹50,000 for top three teams.",
    enrollStart: "2026-08-20T00:00:00",
    enrollEnd: "2026-08-27T23:59:00",
    conductionDate: "2026-08-28T09:00:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "4821",
    teamEvent: true,
    teamSize: 4,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (President & Student Conducting Lead)",
      eventManager: "Ananya Rao (Operations & Attendance Manager)"
    }
  },
  {
    id: 2,
    title: "Circuit Design & PCB Fabrication",
    club: "IEEE",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Aug 30, 2026 · 2:00 PM",
    venue: "EEE Advanced Lab 2",
    registered: 58,
    capacity: 75,
    desc: "Hands-on session on PCB design, KiCAD simulation tools, and real board etching led by senior IEEE members and industry experts.",
    enrollStart: "2026-08-22T00:00:00",
    enrollEnd: "2026-08-29T23:59:00",
    conductionDate: "2026-08-30T14:00:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "3910",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. S. Narayanan (EEE Dept)",
      conductingLead: "Karthik Verma (Hardware Wing Lead)",
      eventManager: "Kavya Murugan (Student Operations)"
    }
  },
  {
    id: 5,
    title: "Sunrise Yoga & Mindfulness Session",
    club: "Yoga",
    tag: "Wellness",
    tagClass: "tag-green",
    date: "Aug 29, 2026 · 6:30 AM",
    venue: "Campus Green Lawn",
    registered: 72,
    capacity: 100,
    desc: "A guided morning yoga and pranayama breathing session open to all students and faculty. Yoga mats and refreshments provided.",
    enrollStart: "2026-08-21T00:00:00",
    enrollEnd: "2026-08-28T20:00:00",
    conductionDate: "2026-08-29T06:30:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "6104",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. Jayashree M. (Physical Wellness)",
      conductingLead: "Ananya Rao (Wellness Coordinator)",
      eventManager: "Meera S. (Mindfulness Lead)"
    }
  },
  {
    id: 7,
    title: "Canvas & Colors: Exclusive Master Studio Gala",
    club: "Fine Arts",
    tag: "Cultural",
    tagClass: "tag-purple",
    date: "Aug 31, 2026 · 3:00 PM",
    venue: "Fine Arts Studio",
    registered: 32,
    capacity: 40,
    desc: "Exclusive studio intensive session for Fine Arts Guild members. Advanced acrylic mixing and canvas preparation led by curator Prof. Sen.",
    enrollStart: "2026-08-20T00:00:00",
    enrollEnd: "2026-08-30T18:00:00",
    conductionDate: "2026-08-31T15:00:00",
    statusOverride: "open",
    accessLevel: "members_only",
    venuePin: "9042",
    teamEvent: false,
    fee: "Guild Members",
    coverImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. Ananya Sen (Architecture)",
      conductingLead: "Meera S. (Studio Lead & Artist)",
      eventManager: "Sneha K. (Exhibition Manager)"
    }
  },
  {
    id: 9,
    title: "Annual NCC Drill & Selection Camp",
    club: "NCC",
    tag: "Uniformed",
    tagClass: "tag-slate",
    date: "Aug 15, 2026 · 5:30 AM",
    venue: "Parade Ground",
    registered: 60,
    capacity: 60,
    desc: "Cadet evaluation drill and physical training session ahead of the state republic day camp selection.",
    enrollStart: "2026-08-01T00:00:00",
    enrollEnd: "2026-08-14T23:59:00",
    conductionDate: "2026-08-15T05:30:00",
    statusOverride: "closed",
    accessLevel: "members_only",
    venuePin: "4402",
    teamEvent: false,
    fee: "Cadets Only",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Capt. M. Suresh (Associate NCC Officer)",
      conductingLead: "Senior Under Officer Karthik",
      eventManager: "Cadet Sergeant Rahul"
    }
  },

  // SEPTEMBER 2026 (Current Active Month)
  {
    id: 3,
    title: "Robotics Arena: Exclusive Autonomous Bot Workshop",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Sep 02, 2026 · 10:00 AM",
    venue: "Robotics Arena & Lab",
    registered: 44,
    capacity: 60,
    desc: "Exclusive hands-on masterclass and arena battle for approved CSI chapter members. Hardware kits provided for line followers and AI vision rovers.",
    enrollStart: "2026-08-24T00:00:00",
    enrollEnd: "2026-09-01T23:59:00",
    conductionDate: "2026-09-02T10:00:00",
    statusOverride: "active_conduction",
    accessLevel: "members_only",
    venuePin: "7219",
    teamEvent: true,
    teamSize: 3,
    fee: "Members Exclusive",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (Technical Lead)",
      eventManager: "Ananya Rao (Operations Manager)"
    }
  },
  {
    id: 4,
    title: "Engineers' Conclave & Industry Connect",
    club: "IE",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Sep 05, 2026 · 11:00 AM",
    venue: "Seminar Hall A",
    registered: 42,
    capacity: 100,
    desc: "Guest keynotes, panel discussions, and career networking sessions with practicing engineers from top partner industries.",
    enrollStart: "2026-08-25T00:00:00",
    enrollEnd: "2026-09-04T23:59:00",
    conductionDate: "2026-09-05T11:00:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "5512",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. V. Sundaram (Mechanical Dept)",
      conductingLead: "Harish Patel (IE Lead)",
      eventManager: "Pooja Raman (Coordinator)"
    }
  },
  {
    id: 6,
    title: "Inter-Department Football Championship",
    club: "Sports",
    tag: "Sports",
    tagClass: "tag-amber",
    date: "Sep 08, 2026 · 4:00 PM",
    venue: "Campus Main Ground",
    registered: 210,
    capacity: 250,
    desc: "Department-wise knockout football tournament. Register your team of 7 before the deadline. Official referees and medical staff on field.",
    enrollStart: "2026-08-26T00:00:00",
    enrollEnd: "2026-09-06T23:59:00",
    conductionDate: "2026-09-08T16:00:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "8801",
    teamEvent: true,
    teamSize: 7,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Coach R. Balaji (Sports Director)",
      conductingLead: "Arjun V. (Tournament Manager)",
      eventManager: "Vikram S. (Pitch Operations)"
    }
  },
  {
    id: 8,
    title: "Green Village Clean-up & Tree Plantation Drive",
    club: "NSS",
    tag: "Service",
    tagClass: "tag-teal",
    date: "Sep 06, 2026 · 7:00 AM",
    venue: "Adopted Rural Community Site",
    registered: 88,
    capacity: 100,
    desc: "A massive community service drive as part of the NSS outreach program. Transport, gloves, saplings, and breakfast arranged from campus.",
    enrollStart: "2026-08-23T00:00:00",
    enrollEnd: "2026-09-05T20:00:00",
    conductionDate: "2026-09-06T07:00:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "1198",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ganesan (NSS Officer)",
      conductingLead: "Arjun V. (NSS Student President)",
      eventManager: "Pooja Raman (Medical Outreach Lead)"
    }
  },
  {
    id: 13,
    title: "Web3 & Smart Contract Security Audit Masterclass",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Sep 18, 2026 · 10:30 AM",
    venue: "CSE Seminar Hall 3",
    registered: 64,
    capacity: 80,
    desc: "Deep dive into EVM architecture, reentrancy vulnerabilities, automated verification tools, and smart contract fuzz testing.",
    enrollStart: "2026-09-01T00:00:00",
    enrollEnd: "2026-09-17T23:59:00",
    conductionDate: "2026-09-18T10:30:00",
    statusOverride: "open",
    accessLevel: "open_to_all",
    venuePin: "4190",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (Conducting Lead)",
      eventManager: "Ananya Rao (Operations Manager)"
    }
  },
  {
    id: 14,
    title: "Autonomous Drone Flight & Telemetry Lab",
    club: "IEEE",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Sep 24, 2026 · 2:30 PM",
    venue: "Main Stadium Pavilion",
    registered: 52,
    capacity: 70,
    desc: "Outdoor autonomous waypoint navigation, PX4 autopilot integration, and optical flow sensors demonstration.",
    enrollStart: "2026-09-05T00:00:00",
    enrollEnd: "2026-09-23T23:59:00",
    conductionDate: "2026-09-24T14:30:00",
    statusOverride: "open",
    accessLevel: "members_only",
    venuePin: "6782",
    teamEvent: true,
    teamSize: 3,
    fee: "Members Exclusive",
    coverImage: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. S. Narayanan (EEE Dept)",
      conductingLead: "Karthik Verma (Hardware Lead)",
      eventManager: "Kavya Murugan (Coordinator)"
    }
  },

  // OCTOBER 2026 (Upcoming Month)
  {
    id: 15,
    title: "National Collegiate Coding Cup 2026",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Oct 10, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    registered: 180,
    capacity: 300,
    desc: "Premier multi-round competitive programming championship with live leaderboard, algorithmic puzzles, and ₹75,000 cash prizes.",
    enrollStart: "2026-09-20T00:00:00",
    enrollEnd: "2026-10-09T23:59:00",
    conductionDate: "2026-10-10T09:00:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "9123",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (President)",
      eventManager: "Ananya Rao (Manager)"
    }
  },
  {
    id: 16,
    title: "Industrial Robotics & 3D CAD Modeling Sprint",
    club: "IE",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Oct 16, 2026 · 11:00 AM",
    venue: "Mechanical CAD Center",
    registered: 46,
    capacity: 60,
    desc: "Parametric solid modeling, generative design algorithms, and stress analysis workshop certified by the Institution of Engineers.",
    enrollStart: "2026-09-25T00:00:00",
    enrollEnd: "2026-10-15T20:00:00",
    conductionDate: "2026-10-16T11:00:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "5420",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. V. Sundaram (Mechanical)",
      conductingLead: "Harish Patel (IE Lead)",
      eventManager: "Pooja Raman (Coordinator)"
    }
  },
  {
    id: 17,
    title: "Inter-College Floodlit Basketball Tournament",
    club: "Sports",
    tag: "Sports",
    tagClass: "tag-amber",
    date: "Oct 22, 2026 · 5:30 PM",
    venue: "Outdoor Floodlit Basketball Courts",
    registered: 120,
    capacity: 180,
    desc: "Annual 5v5 state university basketball championship with official state referees and rolling trophies.",
    enrollStart: "2026-10-01T00:00:00",
    enrollEnd: "2026-10-20T23:59:00",
    conductionDate: "2026-10-22T17:30:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "3890",
    teamEvent: true,
    teamSize: 5,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Coach R. Balaji (Sports Director)",
      conductingLead: "Arjun V. (Captain)",
      eventManager: "Vikram S. (Operations)"
    }
  },
  {
    id: 18,
    title: "National Integration Drill & Obstacle Course",
    club: "NCC",
    tag: "Uniformed",
    tagClass: "tag-slate",
    date: "Oct 28, 2026 · 6:00 AM",
    venue: "Parade Ground & Obstacle Course",
    registered: 55,
    capacity: 60,
    desc: "Military-grade tactical drills, physical stamina obstacle challenges, and team strategy simulations.",
    enrollStart: "2026-10-05T00:00:00",
    enrollEnd: "2026-10-26T20:00:00",
    conductionDate: "2026-10-28T06:00:00",
    statusOverride: "upcoming",
    accessLevel: "members_only",
    venuePin: "4912",
    teamEvent: false,
    fee: "Cadets Only",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Capt. M. Suresh (Associate NCC Officer)",
      conductingLead: "Senior Under Officer Karthik",
      eventManager: "Cadet Sergeant Rahul"
    }
  },

  // NOVEMBER 2026 (Future Festivities & Symposia)
  {
    id: 19,
    title: "International AI Systems & Edge Robotics Summit",
    club: "CSI",
    tag: "Technical",
    tagClass: "tag-indigo",
    date: "Nov 12, 2026 · 9:30 AM",
    venue: "Main Innovation Auditorium",
    registered: 90,
    capacity: 250,
    desc: "Keynote addresses from global AI researchers, live humanoid robot demonstrations, and startup investor pitch decks.",
    enrollStart: "2026-10-15T00:00:00",
    enrollEnd: "2026-11-10T23:59:00",
    conductionDate: "2026-11-12T09:30:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "7741",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Dr. K. Ramanathan (CSE Dept)",
      conductingLead: "Rahul K. (President)",
      eventManager: "Ananya Rao (Manager)"
    }
  },
  {
    id: 20,
    title: "Grand Autumn Classical & Contemporary Art Exhibition",
    club: "Fine Arts",
    tag: "Cultural",
    tagClass: "tag-purple",
    date: "Nov 20, 2026 · 10:00 AM",
    venue: "Central Arts Atrium",
    registered: 40,
    capacity: 100,
    desc: "Curated display of over 100 original paintings, sculptures, digital design prints, and architectural scale models.",
    enrollStart: "2026-10-20T00:00:00",
    enrollEnd: "2026-11-18T18:00:00",
    conductionDate: "2026-11-20T10:00:00",
    statusOverride: "upcoming",
    accessLevel: "open_to_all",
    venuePin: "8203",
    teamEvent: false,
    fee: "Free Entry",
    coverImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    posterUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    organizingTeam: {
      facultyAdvisor: "Prof. Ananya Sen (Architecture)",
      conductingLead: "Meera S. (Curator)",
      eventManager: "Sneha K. (Manager)"
    }
  }
]

export const clubs = [
  {
    id: "csi",
    name: "CSI",
    mission: 'To advance computing intelligence and practical engineering through national hackathons, open-source development sprints, algorithmic masterclasses, and direct industry mentorship.',
    vision: 'To establish a benchmark student software chapter recognized across state and national collegiate arenas for pioneering innovative software architectures and high-impact digital products.',
    facultyCoordinator: {'name': 'Dr. K. Ramanathan', 'designation': 'Professor & Lead Faculty Advisor', 'department': 'Computer Science & Engineering', 'email': 'k.ramanathan@college.edu', 'phone': '+91 94432 10987', 'officeRoom': 'Main Tech Block, CS-304', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Rahul K.', 'rollNo': '22CS104', 'department': 'CSE', 'year': '4th Year', 'role': 'Lead Student Coordinator & President', 'email': 'rahul.22cs104@college.edu', 'phone': '+91 98765 43210', 'avatar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Ananya Rao', 'rollNo': '23CS082', 'department': 'CSE', 'year': '3rd Year', 'role': 'Associate Student Coordinator & Tech Lead', 'email': 'ananya.23cs082@college.edu', 'phone': '+91 98765 12345', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'},
    fullName: "Computer Society of India Student Chapter",
    cat: "Technical",
    tagClass: "tag-indigo",
    desc: "Premier computer science society organizing coding contests, national hackathons, dev workshops, and open-source sprints.",
    longDesc: "The Computer Society of India (CSI) student branch provides an immersive platform for tech enthusiasts. Members gain exclusive access to hackathons, coding bootcamps, masterclasses from FAANG engineers, cloud credits, and placement coding training.",
    events: 14,
    members: 340,
    leadInstructorId: "inst_csi",
    leadInstructor: "Dr. K. Ramanathan (CSE Dept)",
    membershipOpen: true,
    membershipFee: 200,
    feeFrequency: "Annual Membership & Kit",
    eligibility: "Open to all B.Tech / M.Tech / MCA students of 1st to 4th year.",
    procedureSteps: [
      { step: 1, title: "Online Application", desc: "Fill your academic details, coding background, and statement of purpose." },
      { step: 2, title: "Role Preference", desc: "Select your desired club wing (Conducting, Operations, Dev, or Design)." },
      { step: 3, title: "Membership Fee", desc: "Complete the nominal ₹200 annual membership fee for kit and workshop materials." },
      { step: 4, title: "Instructor Approval", desc: "The Faculty Advisor reviews your submission and grants official CSI membership pass." }
    ],
    perks: [
      "Access to 10+ hands-on technical workshops per semester",
      "Priority registration and free entry to all CSI Hackathons",
      "Official CSI student chapter ID and verified completion certificates",
      "Mentorship from senior engineers & alumni network"
    ],
    studentTeam: [
      { id: "stu_1002", name: "Rahul K.", rollNo: "22CS104", dept: "CSE 4th Year", email: "rahul.k@college.edu", role: "President & Student Conducting Lead", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", bio: "Winner of Hackathon 24hr; conducts weekly algorithmic and DSA sprints." },
      { id: "stu_1001", name: "Ananya Rao", rollNo: "23CS082", dept: "CSE 3rd Year", email: "student@college.edu", role: "Event Operations & Attendance Manager", roleCategory: "managing", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", bio: "Manages event logistics, attendee check-ins, and hackathon judge coordination." },
      { id: "stu_1004", name: "Vikram S.", rollNo: "22IT045", dept: "IT 3rd Year", email: "vikram.s@college.edu", role: "Technical Platform Coordinator", roleCategory: "tech", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80", bio: "Maintains testing servers, automated evaluation bots, and cloud credentials." },
      { id: "stu_1005", name: "Sneha K.", rollNo: "22EC091", dept: "ECE 3rd Year", email: "sneha.k@college.edu", role: "Media, Poster & Design Lead", roleCategory: "design", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80", bio: "Designs event posters, brochures, and digital social media campaigns." }
    ]
  },
  {
    id: "ieee",
    name: "IEEE",
    mission: 'To foster technological excellence, multidisciplinary research in electrical and electronics domains, and IEEE international paper publications through global conferences and prototyping labs.',
    vision: 'To inspire and empower students to become globally competitive researchers, IEEE fellows, and transformative technology leaders in intelligent energy, robotics, and cybernetics.',
    facultyCoordinator: {'name': 'Prof. S. Narayanan', 'designation': 'Associate Professor & Branch Counselor', 'department': 'Electrical & Electronics Engineering', 'email': 's.narayanan@college.edu', 'phone': '+91 94432 21098', 'officeRoom': 'Electronics Lab Block, EC-202', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Vignesh M.', 'rollNo': '22EC068', 'department': 'ECE', 'year': '4th Year', 'role': 'Lead Student Coordinator & Branch Chair', 'email': 'vignesh.22ec068@college.edu', 'phone': '+91 98765 54321', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Kavitha R.', 'rollNo': '23EE034', 'department': 'EEE', 'year': '3rd Year', 'role': 'Associate Student Coordinator & WIE Lead', 'email': 'kavitha.23ee034@college.edu', 'phone': '+91 98765 65432', 'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'},
    fullName: "IEEE Student Branch",
    cat: "Technical",
    tagClass: "tag-indigo",
    desc: "Institute of Electrical and Electronics Engineers student branch — workshops, project expos, and IEEE Xplore access.",
    longDesc: "IEEE Student Branch connects students to the world's largest technical professional organization. We conduct international conferences, hardware hackathons, IoT build days, and paper presentation symposia.",
    events: 10,
    members: 260,
    leadInstructorId: "inst_ieee",
    leadInstructor: "Prof. S. Narayanan (EEE Dept)",
    membershipOpen: true,
    membershipFee: 250,
    feeFrequency: "Annual Membership",
    eligibility: "Open to EEE, ECE, CSE, IT, MECH, and Biomedical engineering students.",
    procedureSteps: [
      { step: 1, title: "Profile Submission", desc: "Submit your student credentials, domain interests (IoT/Robotics/AI), and project links." },
      { step: 2, title: "Membership Fee", desc: "Pay the ₹250 annual subscription for IEEE branch membership & lab access pass." },
      { step: 3, title: "Faculty Verification", desc: "IEEE Counselor validates eligibility and approves student membership credentials." }
    ],
    perks: [
      "Access to IEEE digital repository and research papers",
      "Free hardware development kits for club projects",
      "Discounted entry to international IEEE conferences",
      "Quarterly technical project grant support up to ₹15,000"
    ],
    studentTeam: [
      { id: "stu_1003", name: "Karthik Verma", rollNo: "23EC041", dept: "ECE 2nd Year", email: "karthik.v@college.edu", role: "Hardware & IoT Project Lead", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", bio: "Embedded systems researcher building campus energy telemetry hardware." },
      { id: "stu_1006", name: "Kavya Murugan", rollNo: "21EE018", dept: "EEE Final Year", email: "kavya.m@college.edu", role: "Research & Paper Coordinator", roleCategory: "managing", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", bio: "Author of IEEE Xplore Best Paper; guides junior paper submissions." }
    ]
  },
  {
    id: "ie",
    name: "IE",
    mission: 'To promote core multidisciplinary design sprints, bridge mechanical and civil engineering innovations, and connect budding engineers with certified industrial standard practices.',
    vision: 'To establish an accredited national platform for next-generation manufacturing, sustainable green architecture, and robotics engineering.',
    facultyCoordinator: {'name': 'Dr. V. Sundaram', 'designation': 'Professor & Student Chapter In-Charge', 'department': 'Mechanical Engineering', 'email': 'v.sundaram@college.edu', 'phone': '+91 94432 32109', 'officeRoom': 'Mechanical Workshop Complex, ME-105', 'avatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Karthik S.', 'rollNo': '22ME052', 'department': 'Mechanical', 'year': '4th Year', 'role': 'Lead Student Coordinator', 'email': 'karthik.22me052@college.edu', 'phone': '+91 98765 76543', 'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Divya M.', 'rollNo': '23CE019', 'department': 'Civil', 'year': '3rd Year', 'role': 'Associate Student Coordinator', 'email': 'divya.23ce019@college.edu', 'phone': '+91 98765 87654', 'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'},
    fullName: "Institution of Engineers (India) Chapter",
    cat: "Technical",
    tagClass: "tag-indigo",
    desc: "Institution of Engineers student chapter — industry talks, CAD/design seminars, and plant visits.",
    longDesc: "IE student chapter bridges academic learning with real-world engineering practices through industrial site visits, guest lectures, CAD modeling contests, and multidisciplinary design challenges.",
    events: 6,
    members: 150,
    leadInstructorId: "inst_ie",
    leadInstructor: "Dr. V. Sundaram (Mechanical Dept)",
    membershipOpen: true,
    membershipFee: 150,
    feeFrequency: "Annual Membership",
    eligibility: "Open to all engineering branches.",
    procedureSteps: [
      { step: 1, title: "Application Form", desc: "Provide your department details and interest in technical visits or seminars." },
      { step: 2, title: "Fee Payment", desc: "Complete the ₹150 annual registration fee." },
      { step: 3, title: "Approval", desc: "Faculty review and induction confirmation." }
    ],
    perks: [
      "Subsidized industrial site visits to leading factories and labs",
      "CAD/CAM software training certification sessions",
      "Direct networking with senior chartered engineers"
    ],
    studentTeam: [
      { id: "stu_1007", name: "Harish Patel", rollNo: "21EE034", dept: "EEE 4th Year", email: "harish.p@college.edu", role: "Student Conduction Lead", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", bio: "Organizes industrial visits and CAD drafting workshops." }
    ]
  },
  {
    id: "yoga",
    name: "Yoga",
    mission: 'To instill mindful living, emotional resilience, daily breathing techniques, and somatic awareness to enrich student focus, mental clarity, and overall well-being.',
    vision: 'To foster a calm, healthy, and stress-free academic ecosystem where physical health and psychological vitality underpin scholastic triumph.',
    facultyCoordinator: {'name': 'Dr. Jayashree M.', 'designation': 'Faculty Coordinator & Certified Yoga Acharya', 'department': 'Physical Education & Wellness', 'email': 'jayashree.m@college.edu', 'phone': '+91 94432 43210', 'officeRoom': 'Wellness Center, WA-101', 'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Harish P.', 'rollNo': '23CS045', 'department': 'CSE', 'year': '3rd Year', 'role': 'Lead Student Coordinator & Asana Lead', 'email': 'harish.23cs045@college.edu', 'phone': '+91 98765 98760', 'avatar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Sneha T.', 'rollNo': '24IT012', 'department': 'IT', 'year': '2nd Year', 'role': 'Associate Student Coordinator', 'email': 'sneha.24it012@college.edu', 'phone': '+91 98765 09871', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'},
    fullName: "Campus Yoga & Mindfulness Society",
    cat: "Wellness",
    tagClass: "tag-green",
    desc: "Daily morning yoga, breathwork, and holistic wellness workshops open to every student.",
    longDesc: "Dedicated to promoting physical health, mental clarity, and stress resilience through traditional Hatha yoga, Vinyasa flows, and mindfulness meditation led by certified trainers.",
    events: 20,
    members: 190,
    leadInstructorId: "inst_yoga",
    leadInstructor: "Dr. Jayashree M. (Physical Education)",
    membershipOpen: true,
    membershipFee: 0,
    feeFrequency: "Free Membership",
    eligibility: "Open to all students, faculty, and campus staff.",
    procedureSteps: [
      { step: 1, title: "Wellness Profile", desc: "Register your details and morning session batch preference." },
      { step: 2, title: "Instant Verification", desc: "No membership fee required. Application is reviewed and activated by instructor." }
    ],
    perks: [
      "Complimentary access to morning yoga lawn sessions & yoga mats",
      "Guided exam stress relief and breathwork masterclasses",
      "Annual Yoga Day state championship delegation"
    ],
    studentTeam: [
      { id: "stu_1001", name: "Ananya Rao", rollNo: "23CS082", dept: "CSE 3rd Year", email: "student@college.edu", role: "Mindfulness & Morning Batch Lead", roleCategory: "managing", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", bio: "Coordinates morning lawn sessions and meditation clinics." }
    ]
  },
  {
    id: "sports",
    name: "Sports",
    mission: 'To champion sporting grit, physical vigor, inter-collegiate championship tournaments, and ethical competitive spirit across university athletics and sports courts.',
    vision: 'To produce national collegiate champions and nurture disciplined leaders who embody athletic endurance, teamwork, and sportsmanship.',
    facultyCoordinator: {'name': 'Coach R. Balaji', 'designation': 'Director of Physical Education & Sports', 'department': 'Department of Physical Education', 'email': 'r.balaji@college.edu', 'phone': '+91 94432 54321', 'officeRoom': 'Indoor Sports Complex, SC-001', 'avatar': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Arun Kumar S.', 'rollNo': '22ME088', 'department': 'Mechanical', 'year': '4th Year', 'role': 'University Sports Secretary & Lead Coordinator', 'email': 'arun.22me088@college.edu', 'phone': '+91 98765 23456', 'avatar': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Priya D.', 'rollNo': '23EC091', 'department': 'ECE', 'year': '3rd Year', 'role': 'Women Sports Coordinator', 'email': 'priya.23ec091@college.edu', 'phone': '+91 98765 34567', 'avatar': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80'},
    fullName: "Campus Sports Council",
    cat: "Sports",
    tagClass: "tag-amber",
    desc: "Coordinates all inter-departmental and inter-college sporting fixtures across cricket, football, basketball, and athletics.",
    longDesc: "The Sports Council oversees campus sports infrastructure, competitive team selections, annual athletics meet, and intramural department tournaments.",
    events: 11,
    members: 480,
    leadInstructorId: "inst_sports",
    leadInstructor: "Coach R. Balaji (Director of Physical Education)",
    membershipOpen: true,
    membershipFee: 0,
    feeFrequency: "Free Membership",
    eligibility: "Open to all enthusiastic athletes and sports coordinators.",
    procedureSteps: [
      { step: 1, title: "Sport Selection", desc: "Choose your primary sport / game discipline and past experience." },
      { step: 2, title: "Instructor Approval", desc: "Sports director verifies fitness credentials and confirms team roster." }
    ],
    perks: [
      "Access to campus gym, floodlit courts, and sports gear",
      "Opportunity to represent college in state & national university tournaments",
      "Sports quota benefits and certificate of merit"
    ],
    studentTeam: [
      { id: "stu_1008", name: "Arjun V.", rollNo: "22ME056", dept: "Mechanical 3rd Year", email: "arjun.v@college.edu", role: "Tournament Operations Captain", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", bio: "University football team captain and fixtures coordinator." }
    ]
  },
  {
    id: "fine-arts",
    name: "Fine Arts",
    mission: 'To ignite artistic imagination, theatrical excellence, musical creativity, and digital visual design through annual collegiate cultural extravaganzas and creative galleries.',
    vision: 'To serve as the vibrant cultural heartbeat of the university, empowering artistic talents to dazzle on national cultural stages.',
    facultyCoordinator: {'name': 'Prof. Ananya Sen', 'designation': 'Associate Professor & Cultural Affairs In-Charge', 'department': 'Architecture & Fine Arts', 'email': 'ananya.sen@college.edu', 'phone': '+91 94432 65432', 'officeRoom': 'Fine Arts Center, FA-204', 'avatar': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Swetha B.', 'rollNo': '23IT078', 'department': 'IT', 'year': '3rd Year', 'role': 'Cultural Secretary & Lead Student Coordinator', 'email': 'swetha.23it078@college.edu', 'phone': '+91 98765 45678', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Rohit V.', 'rollNo': '24CS056', 'department': 'CSE', 'year': '2nd Year', 'role': 'Media & Design Coordinator', 'email': 'rohit.24cs056@college.edu', 'phone': '+91 98765 56789', 'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80'},
    fullName: "Fine Arts & Creative Guild",
    cat: "Cultural",
    tagClass: "tag-purple",
    desc: "Painting, sketching, pottery, and visual arts club — exhibitions and open studio sessions all year.",
    longDesc: "A vibrant creative hub for illustrators, painters, photographers, and sculptors. We organize campus wall murals, art galas, and digital illustration workshops.",
    events: 9,
    members: 210,
    leadInstructorId: "inst_arts",
    leadInstructor: "Prof. Ananya Sen (Architecture Dept)",
    membershipOpen: true,
    membershipFee: 100,
    feeFrequency: "Annual Supply & Studio Fee",
    eligibility: "Open to all students with a passion for creative arts.",
    procedureSteps: [
      { step: 1, title: "Art Portfolio / Interest", desc: "Share your artistic medium and reason for joining." },
      { step: 2, title: "Studio Fee", desc: "Pay ₹100 for open studio art supplies and canvas materials." },
      { step: 3, title: "Review & Approval", desc: "Club coordinator accepts application and grants studio keypass." }
    ],
    perks: [
      "Free access to high-grade acrylics, canvases, and art studio",
      "Exhibit artwork in the Annual Campus Art Gallery",
      "Design merchandise and stage sets for college fests"
    ],
    studentTeam: [
      { id: "stu_1009", name: "Meera S.", rollNo: "23AR012", dept: "Architecture 2nd Year", email: "meera.s@college.edu", role: "Chief Studio Curator", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", bio: "Gold medalist at State Arts Gala; curates open studio workshops." }
    ]
  },
  {
    id: "nss",
    name: "NSS",
    mission: 'To channel student energy into selfless community service, rural hygiene drives, literacy camps, blood donation initiatives, and disaster relief aid.',
    vision: "To sculpt compassionate, socially responsible citizen leaders who uplift underprivileged communities under the motto 'Not Me, But You'.",
    facultyCoordinator: {'name': 'Dr. K. Ganesan', 'designation': 'NSS Programme Officer & Associate Professor', 'department': 'Chemistry & Social Sciences', 'email': 'k.ganesan@college.edu', 'phone': '+91 94432 76543', 'officeRoom': 'NSS Cell, Student Affairs Block, NSS-102', 'avatar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'Manoj K.', 'rollNo': '22EE061', 'department': 'EEE', 'year': '4th Year', 'role': 'NSS Student President & Lead Coordinator', 'email': 'manoj.22ee061@college.edu', 'phone': '+91 98765 67890', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'Aishwarya N.', 'rollNo': '23CS015', 'department': 'CSE', 'year': '3rd Year', 'role': 'Rural Outreach Secretary', 'email': 'aishwarya.23cs015@college.edu', 'phone': '+91 98765 78901', 'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'},
    fullName: "National Service Scheme Unit",
    cat: "Service",
    tagClass: "tag-teal",
    desc: "National Service Scheme unit — community outreach, blood donation camps, literacy drives, and rural service.",
    longDesc: "NSS cultivates social responsibility and civic consciousness through meaningful community initiatives including village adoptions, medical camps, and environmental stewardship.",
    events: 12,
    members: 300,
    leadInstructorId: "inst_nss",
    leadInstructor: "Dr. K. Ganesan (NSS Program Officer)",
    membershipOpen: true,
    membershipFee: 0,
    feeFrequency: "Free National Unit",
    eligibility: "Open to 1st and 2nd year students willing to commit volunteer hours.",
    procedureSteps: [
      { step: 1, title: "Enrollment Form", desc: "Submit student details and blood group for emergency donor registry." },
      { step: 2, title: "Officer Verification", desc: "NSS Program Officer reviews commitment and assigns NSS Volunteer ID." }
    ],
    perks: [
      "Government-recognized NSS Volunteer Certificate (valuable for higher studies)",
      "Leadership training and rural leadership camps",
      "2 extra academic credit points on completion of 120 volunteer hours"
    ],
    studentTeam: [
      { id: "stu_1008", name: "Arjun V.", rollNo: "22ME056", dept: "Mechanical 3rd Year", email: "arjun.v@college.edu", role: "NSS Student President", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", bio: "Leads campus blood donation camps and rural literacy programs." },
      { id: "stu_1010", name: "Pooja Raman", rollNo: "22EC041", dept: "ECE 3rd Year", email: "pooja.r@college.edu", role: "Rural Outreach Coordinator", roleCategory: "managing", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80", bio: "Coordinates logistics and healthcare team transport for medical camps." }
    ]
  },
  {
    id: "ncc",
    name: "NCC",
    mission: 'To cultivate immaculate military discipline, patriotic zeal, tactical courage, survival skills, and parade perfection to prepare cadets for national defense and armed forces service.',
    vision: 'To forge steadfast, courageous young patriots primed for commissioning into the Indian Armed Forces and exemplary civil defense service.',
    facultyCoordinator: {'name': 'Capt. M. Suresh', 'designation': 'Associate NCC Officer (ANO) & Company Commander', 'department': 'Department of Mathematics', 'email': 'm.suresh@college.edu', 'phone': '+91 94432 87654', 'officeRoom': 'NCC Regimental Pavilion, Parade Ground', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'},
    studentCoordinator: {'name': 'SUO Dinesh R.', 'rollNo': '22ME034', 'department': 'Mechanical', 'year': '4th Year', 'role': 'Senior Under Officer (SUO) & Battalion Commander', 'email': 'dinesh.22me034@college.edu', 'phone': '+91 98765 89012', 'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80'},
    associateStudentCoordinator: {'name': 'JUO Pavithra S.', 'rollNo': '23EC042', 'department': 'ECE', 'year': '3rd Year', 'role': 'Junior Under Officer (JUO) & Cadet Adjutant', 'email': 'pavithra.23ec042@college.edu', 'phone': '+91 98765 90123', 'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'},
    fullName: "National Cadet Corps (Air & Army Wings)",
    cat: "Uniformed",
    tagClass: "tag-slate",
    desc: "National Cadet Corps unit — parade drills, shooting range training, obstacle courses, and adventure camps.",
    longDesc: "NCC instills character, comradeship, discipline, leadership, and ideals of selfless service among young citizens through military-grade drills and adventure expeditions.",
    events: 8,
    members: 220,
    leadInstructorId: "inst_ncc",
    leadInstructor: "Capt. M. Suresh (Associate NCC Officer)",
    membershipOpen: true,
    membershipFee: 0,
    feeFrequency: "Free Ministry Unit",
    eligibility: "Open to 1st year students who pass the basic medical and fitness drill.",
    procedureSteps: [
      { step: 1, title: "Cadet Enlistment", desc: "Submit physical metrics and medical fitness undertaking." },
      { step: 2, title: "Officer Screening", desc: "Officer reviews fitness records and approves cadet rank." }
    ],
    perks: [
      "Eligibility for 'B' & 'C' NCC Certificates with direct SSB military interview entry",
      "Shooting, paragliding, trekking, and national integration camps",
      "Complete uniform and ceremonial drill equipment provided"
    ],
    studentTeam: [
      { id: "stu_1011", name: "Karthik R.", rollNo: "23CV019", dept: "Civil 2nd Year", email: "karthik.r@college.edu", role: "Senior Cadet Under Officer", roleCategory: "conducting", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80", bio: "Oversees parade ground drills and shooting range safety." }
    ]
  }
]

export const seedRegistrations = [
  {
    id: "REG-1001",
    eventId: 1,
    eventTitle: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    eventDate: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    team: "Team ByteForce",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-28 09:12 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-23 14:00"
  },
  {
    id: "REG-1002",
    eventId: 1,
    eventTitle: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    eventDate: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    team: "Team ByteForce",
    studentName: "Rahul K.",
    rollNo: "22CS104",
    dept: "CSE",
    year: "4th Year",
    email: "rahul.k@college.edu",
    phone: "+91 91234 56780",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-28 09:05 AM",
    checkinMethod: "Advisor Scanned",
    timestamp: "2026-08-23 15:30"
  },
  {
    id: "REG-1003",
    eventId: 1,
    eventTitle: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    eventDate: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    team: "Team ByteForce",
    studentName: "Vikram S.",
    rollNo: "22IT045",
    dept: "IT",
    year: "3rd Year",
    email: "vikram.s@college.edu",
    phone: "+91 98401 22334",
    isClubMember: true,
    status: "Confirmed",
    attended: false,
    attendedAt: null,
    checkinMethod: null,
    timestamp: "2026-08-24 10:15"
  },
  {
    id: "REG-1004",
    eventId: 1,
    eventTitle: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    eventDate: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    team: "Team NeuralNet",
    studentName: "Sneha K.",
    rollNo: "22EC091",
    dept: "ECE",
    year: "3rd Year",
    email: "sneha.k@college.edu",
    phone: "+91 94445 67890",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-28 09:20 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-24 12:00"
  },
  {
    id: "REG-1005",
    eventId: 1,
    eventTitle: "Hackathon 24hr: AI & Web3",
    club: "CSI",
    eventDate: "Aug 28, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    team: "Team Cipher",
    studentName: "Priya M.",
    rollNo: "23CS112",
    dept: "CSE",
    year: "2nd Year",
    email: "priya.m@college.edu",
    phone: "+91 98841 33445",
    isClubMember: false,
    status: "Confirmed",
    attended: false,
    attendedAt: null,
    checkinMethod: null,
    timestamp: "2026-08-25 11:20"
  },
  {
    id: "REG-1006",
    eventId: 3,
    eventTitle: "Robotics Arena: Exclusive Autonomous Bot Workshop",
    club: "CSI",
    eventDate: "Sep 02, 2026 · 10:00 AM",
    venue: "Robotics Arena & Lab",
    team: "BotSquad Alpha",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: false,
    attendedAt: null,
    checkinMethod: null,
    timestamp: "2026-08-25 09:00"
  },
  {
    id: "REG-1007",
    eventId: 5,
    eventTitle: "Sunrise Yoga & Mindfulness Session",
    club: "Yoga",
    eventDate: "Aug 29, 2026 · 6:30 AM",
    venue: "Campus Green Lawn",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-29 06:25 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-24 08:30"
  },
  // July 2026 Registrations (Historical Conduction Data)
  {
    id: "REG-0701",
    eventId: 10,
    eventTitle: "State Microgrid & Smart Energy Paper Conclave",
    club: "IEEE",
    eventDate: "Jul 14, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium",
    team: "VoltEdge Research",
    studentName: "Karthik Verma",
    rollNo: "23EC041",
    dept: "ECE",
    year: "2nd Year",
    email: "karthik.v@college.edu",
    phone: "+91 94432 18900",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-07-14 09:50 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-07-05 11:00"
  },
  {
    id: "REG-0702",
    eventId: 10,
    eventTitle: "State Microgrid & Smart Energy Paper Conclave",
    club: "IEEE",
    eventDate: "Jul 14, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium",
    team: "VoltEdge Research",
    studentName: "Kavya Murugan",
    rollNo: "21EE018",
    dept: "EEE",
    year: "4th Year",
    email: "kavya.m@college.edu",
    phone: "+91 94440 12891",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-07-14 09:45 AM",
    checkinMethod: "Advisor Scanned",
    timestamp: "2026-07-05 11:30"
  },
  {
    id: "REG-0703",
    eventId: 11,
    eventTitle: "Mega Blood Donation & Community Health Camp",
    club: "NSS",
    eventDate: "Jul 22, 2026 · 9:00 AM",
    venue: "Campus Indoor Health Complex",
    studentName: "Arjun V.",
    rollNo: "22ME056",
    dept: "Mechanical",
    year: "3rd Year",
    email: "arjun.v@college.edu",
    phone: "+91 98402 11990",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-07-22 09:10 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-07-10 14:00"
  },
  {
    id: "REG-0704",
    eventId: 12,
    eventTitle: "Eco-Mural & Sustainable Street Art Gala",
    club: "Fine Arts",
    eventDate: "Jul 28, 2026 · 2:00 PM",
    venue: "Campus Art Walk & Gallery",
    studentName: "Meera S.",
    rollNo: "23AR012",
    dept: "Architecture",
    year: "2nd Year",
    email: "meera.s@college.edu",
    phone: "+91 98845 77612",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-07-28 01:55 PM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-07-18 16:20"
  },
  // September 2026 Registrations (Current Month)
  {
    id: "REG-0901",
    eventId: 4,
    eventTitle: "Engineers' Conclave & Industry Connect",
    club: "IE",
    eventDate: "Sep 05, 2026 · 11:00 AM",
    venue: "Seminar Hall A",
    studentName: "Harish Patel",
    rollNo: "21EE034",
    dept: "EEE",
    year: "4th Year",
    email: "harish.p@college.edu",
    phone: "+91 98840 55123",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-09-05 10:50 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-28 12:00"
  },
  {
    id: "REG-0902",
    eventId: 8,
    eventTitle: "Green Village Clean-up & Tree Plantation Drive",
    club: "NSS",
    eventDate: "Sep 06, 2026 · 7:00 AM",
    venue: "Adopted Rural Community Site",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: false,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-09-06 06:55 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-30 15:00"
  },
  {
    id: "REG-0903",
    eventId: 13,
    eventTitle: "Inter College Coding Competition",
    club: "CSI",
    eventDate: "Aug 15, 2026 · 10:00 AM",
    venue: "Main Computing Center & Auditorium",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-15 09:45 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-10 09:30"
  },
  {
    id: "REG-0904",
    eventId: 13,
    eventTitle: "Inter College Coding Competition",
    club: "CSI",
    eventDate: "Aug 15, 2026 · 10:00 AM",
    venue: "Main Computing Center & Auditorium",
    studentName: "Rahul K.",
    rollNo: "22CS104",
    dept: "CSE",
    year: "4th Year",
    email: "rahul.k@college.edu",
    phone: "+91 91234 56780",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-15 09:40 AM",
    checkinMethod: "Advisor Scanned",
    timestamp: "2026-08-10 10:15"
  },
  {
    id: "REG-0905",
    eventId: 13,
    eventTitle: "Inter College Coding Competition",
    club: "CSI",
    eventDate: "Aug 15, 2026 · 10:00 AM",
    venue: "Main Computing Center & Auditorium",
    studentName: "Vikram S.",
    rollNo: "22IT045",
    dept: "IT",
    year: "3rd Year",
    email: "vikram.s@college.edu",
    phone: "+91 91234 88765",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-08-15 09:50 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-11 11:20"
  },
  {
    id: "REG-1401",
    eventId: 14,
    eventTitle: "National Student Innovation & Project Expo 2026",
    club: "CSI",
    eventDate: "Sep 01, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium & Expo Arena",
    studentName: "Rahul K.",
    rollNo: "22CS104",
    dept: "CSE",
    year: "4th Year",
    email: "rahul.k@college.edu",
    phone: "+91 91234 56780",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-09-01 09:40 AM",
    checkinMethod: "PIN Verified",
    timestamp: "2026-08-20 10:00"
  },
  {
    id: "REG-1402",
    eventId: 14,
    eventTitle: "National Student Innovation & Project Expo 2026",
    club: "CSI",
    eventDate: "Sep 01, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium & Expo Arena",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-09-01 09:42 AM",
    checkinMethod: "Advisor Scanned",
    timestamp: "2026-08-20 11:30"
  },
  {
    id: "REG-1403",
    eventId: 14,
    eventTitle: "National Student Innovation & Project Expo 2026",
    club: "CSI",
    eventDate: "Sep 01, 2026 · 10:00 AM",
    venue: "Main Innovation Auditorium & Expo Arena",
    studentName: "Harish Patel",
    rollNo: "22EE044",
    dept: "EEE",
    year: "4th Year",
    email: "harish.p@college.edu",
    phone: "+91 98840 55123",
    isClubMember: true,
    status: "Confirmed",
    attended: true,
    attendedAt: "2026-09-01 09:45 AM",
    checkinMethod: "Advisor Scanned",
    timestamp: "2026-08-21 09:15"
  },
  // October 2026 Registrations (Upcoming)
  {
    id: "REG-1008",
    eventId: 15,
    eventTitle: "National Collegiate Coding Cup 2026",
    club: "CSI",
    eventDate: "Oct 10, 2026 · 9:00 AM",
    venue: "Main Innovation Auditorium",
    studentName: "Ananya Rao",
    rollNo: "23CS082",
    dept: "CSE",
    year: "3rd Year",
    email: "student@college.edu",
    phone: "+91 98765 43210",
    isClubMember: true,
    status: "Confirmed",
    attended: false,
    attendedAt: null,
    checkinMethod: null,
    timestamp: "2026-09-03 14:00"
  }
]

export const achievements = [
  {
    id: 140,
    eventId: 14,
    title: "Winners Announced: National Student Innovation & Project Expo 2026",
    slug: "winners-national-student-innovation-expo-2026",
    subtitle: "Official results published for CSI Chapter. ₹60,000 in grand honors and trophies distributed.",
    club: "CSI",
    category: "Event Victory",
    date: "Sep 01, 2026",
    publishedAt: "2026-09-01T17:00:00",
    readTime: "2 min read",
    tagClass: "tag-indigo",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. K. Ramanathan",
      role: "Faculty Advisor, CSI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Official results declared for 'National Student Innovation & Project Expo 2026'. First Prize: Rahul K. (CSE), Second Prize: Ananya Rao (CSE), Third Prize: Harish Patel (EEE).",
    content: "The Department of Computer Science & Engineering and CSI Student Chapter proudly announce the certified winners of the National Student Innovation & Project Expo 2026 conducted on Sep 01, 2026 at the Main Innovation Auditorium.\n\n### Official Laurels & Prize Standings\n- 🥇 First Prize: Rahul K. (22CS104, CSE) — ₹30,000 Cash Prize + Gold Shield\n- 🥈 Second Prize: Ananya Rao (23CS082, CSE) — ₹20,000 Cash Prize + Silver Shield\n- 🥉 Third Prize: Harish Patel (22EE044, EEE) — ₹10,000 Cash Prize + Bronze Shield\n\nCongratulations to all participating teams, faculty mentors, and student project leads!",
    winners: [
      { name: "Rahul K.", rollNo: "22CS104", dept: "CSE (National Engineering College)", role: "First Prize 🥇" },
      { name: "Ananya Rao", rollNo: "23CS082", dept: "CSE (National Engineering College)", role: "Second Prize 🥈" },
      { name: "Harish Patel", rollNo: "22EE044", dept: "EEE (National Engineering College)", role: "Third Prize 🥉" }
    ],
    reactions: { claps: 58, trophies: 44, fire: 62 },
    comments: [
      { id: 1, author: "Vikram S.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", text: "Incredible presentations from Rahul and Ananya! Deserved champions!", time: "Sep 01, 2026" }
    ]
  },
  {
    id: 130,
    eventId: 13,
    title: "Winners Announced: Inter College Coding Competition",
    slug: "winners-inter-college-coding-competition-2026",
    subtitle: "Official results published for CSI Chapter. Competitive algorithmic champions inducted into university honours.",
    club: "CSI",
    category: "Event Victory",
    date: "Aug 15, 2026",
    publishedAt: "2026-08-15T16:00:00",
    readTime: "2 min read",
    tagClass: "tag-indigo",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. K. Ramanathan",
      role: "Faculty Advisor, CSI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Official results declared for 'Inter College Coding Competition'. First Prize: Rahul K. (CSE), Second Prize: Ananya Rao (CSE), Third Prize: Vikram S. (IT).",
    content: "The CSI Chapter proudly announces the certified winners of the Inter College Coding Competition conducted on Aug 15, 2026 at the Main Computing Center.\n\n### Official Laurels & Prize Standings\n- 🥇 First Prize: Rahul K. (22CS104, CSE) — ₹25,000 Cash Prize + Gold Medal\n- 🥈 Second Prize: Ananya Rao (23CS082, CSE) — ₹15,000 Cash Prize + Silver Medal\n- 🥉 Third Prize: Vikram S. (22IT045, IT) — ₹10,000 Cash Prize + Bronze Medal\n\nCongratulations to our campus coding champions!",
    winners: [
      { name: "Rahul K.", rollNo: "22CS104", dept: "CSE (National Engineering College)", role: "First Prize 🥇" },
      { name: "Ananya Rao", rollNo: "23CS082", dept: "CSE (National Engineering College)", role: "Second Prize 🥈" },
      { name: "Vikram S.", rollNo: "22IT045", dept: "IT (National Engineering College)", role: "Third Prize 🥉" }
    ],
    reactions: { claps: 92, trophies: 67, fire: 81 },
    comments: []
  },
  {
    id: 1,
    title: "1st Place Victory at National Hackathon 24hr 2026",
    slug: "national-hackathon-victory-2026",
    subtitle: "Team 'ByteForce' developed an AI-powered autonomous disaster relief routing system, taking home the ₹50,000 championship trophy.",
    club: "CSI",
    category: "Hackathon Victory",
    date: "Aug 18, 2026",
    publishedAt: "2026-08-18T14:30:00",
    readTime: "3 min read",
    tagClass: "tag-indigo",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. K. Ramanathan",
      role: "Faculty Advisor, CSI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Competing against 64 elite collegiate engineering teams from across the nation, our students engineered an offline-first mesh communications network integrated with real-time drone route optimization.",
    content: `The Department of Computer Science and Engineering and the CSI Student Chapter proudly announce that team **ByteForce** clinched the First Prize at the prestigious 2026 National Innovation Hackathon.

### The Breakthrough Solution
During the grueling 24-hour sprint, the team conceived and engineered **"RescueMesh"** — a lightweight emergency response protocol that functions even when conventional cellular towers and internet backbones fail during natural disasters. Using peer-to-peer LoRa frequencies combined with an on-device edge AI routing algorithm, RescueMesh transmits SOS coordinates and medical triage data directly to rescue helicopters and drones.

> "The judges were blown away by the live demonstration where simulated drone packets were redirected around simulated debris zones in under 120 milliseconds."
> — *Dr. K. Ramanathan, CSI Faculty Advisor*

### Key Highlights & Recognition
- 🏆 **1st Place Overall Champion Trophy** among 64 national finalists.
- 💵 **₹50,000 Cash Prize** and direct pre-placement interview offers.
- 🌟 **Special Jury Commendation** for Best Edge Computing Architecture.
- 🚀 Received an incubation grant from the State Innovation Hub for live pilot testing.`,
    winners: [
      { name: "Rahul K.", rollNo: "22CS104", dept: "CSE 3rd Year", role: "Team Lead & AI Architect" },
      { name: "Ananya Rao", rollNo: "23CS082", dept: "CSE 3rd Year", role: "Mesh Protocols & Embedded Systems" },
      { name: "Vikram S.", rollNo: "22IT045", dept: "IT 3rd Year", role: "Fullstack Dashboard & Mapping" },
      { name: "Sneha K.", rollNo: "22EC091", dept: "ECE 3rd Year", role: "Hardware Integration & Sensors" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    ],
    reactions: {
      claps: 142,
      trophies: 89,
      fire: 116
    },
    comments: [
      { id: 1, author: "Priya M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", text: "Massive congratulations team ByteForce! Inspiring stuff for all juniors!", time: "2 days ago" },
      { id: 2, author: "Prof. S. Narayanan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", text: "Exceptional multidisciplinary teamwork between CSE and ECE. Proud moment for our college!", time: "1 day ago" }
    ]
  },
  {
    id: 2,
    title: "Best Research Paper Award at IEEE International Conference on Smart Grids",
    slug: "ieee-best-paper-award-2026",
    subtitle: "Team 'VoltEdge' published novel findings on micro-inverter efficiency and IoT grid monitoring, winning top honors in Tokyo.",
    club: "IEEE",
    category: "Research Breakthrough",
    date: "Aug 12, 2026",
    publishedAt: "2026-08-12T10:00:00",
    readTime: "4 min read",
    tagClass: "tag-indigo",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Prof. S. Narayanan",
      role: "IEEE Branch Counselor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Our undergraduate electrical research group presented a breakthrough paper introducing predictive harmonic filtering in distributed solar rooftop grids.",
    content: `We celebrate the landmark achievement of our IEEE student researchers who were awarded the **Best Technical Paper Award** at the 2026 IEEE International Smart Energy Conference.

### Research Overview
Traditional residential solar inverters suffer efficiency loss during partial shading and sudden cloud transient events. Team VoltEdge devised an adaptive algorithmic controller running on a low-cost microcontroller that dynamically regulates duty cycles in micro-seconds, resulting in an estimated **6.4% higher cumulative energy harvest**.

The research paper has been officially indexed in the IEEE Xplore digital library and nominated for the Young Scientist Publication Grant.`,
    winners: [
      { name: "Kavya Murugan", rollNo: "21EE018", dept: "EEE Final Year", role: "Primary Researcher" },
      { name: "Harish Patel", rollNo: "21EE034", dept: "EEE Final Year", role: "Simulation & Data Analysis" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    reactions: {
      claps: 98,
      trophies: 64,
      fire: 45
    },
    comments: [
      { id: 1, author: "Rahul K.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", text: "Phenomenal work Kavya & Harish! Getting published in IEEE Xplore is huge!", time: "5 days ago" }
    ]
  },
  {
    id: 3,
    title: "Best Artwork & Gold Medal at State Inter-Collegiate Arts Gala",
    slug: "fine-arts-state-gold-2026",
    subtitle: "Fine Arts Club member Meera S. captivated the jury with a mixed-media sustainable canvas illustrating urban eco-harmony.",
    club: "Fine Arts",
    category: "Cultural Championship",
    date: "Jul 28, 2026",
    publishedAt: "2026-07-28T16:00:00",
    readTime: "2 min read",
    tagClass: "tag-purple",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Prof. Ananya Sen",
      role: "Fine Arts Coordinator",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Featuring over 120 contemporary art exhibits across 18 universities, Meera's original artwork 'Symbiosis in Ochre' secured the Gold Medal.",
    content: `Our Fine Arts Society is delighted to celebrate **Meera S.** for winning the First Prize Gold Medal at the State Fine Arts Conclave.

Crafted entirely with natural plant pigments and recycled parchment paper, 'Symbiosis in Ochre' depicts the harmonious co-existence of indigenous flora alongside sustainable futuristic architecture. The painting will be showcased at the State Museum of Modern Art for the next two months.`,
    winners: [
      { name: "Meera S.", rollNo: "23AR012", dept: "Architecture 2nd Year", role: "Artist & Visual Designer" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
    ],
    reactions: {
      claps: 112,
      trophies: 53,
      fire: 77
    },
    comments: []
  },
  {
    id: 4,
    title: "Outstanding Youth Volunteer Unit Award at State NSS Conclave",
    slug: "nss-state-outreach-award-2026",
    subtitle: "NSS Unit recognized for organizing 14 rural medical camps, planting 1,200 saplings, and spearheading digital literacy drives.",
    club: "NSS",
    category: "Community Impact",
    date: "Jul 15, 2026",
    publishedAt: "2026-07-15T11:20:00",
    readTime: "3 min read",
    tagClass: "tag-teal",
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. K. Ganesan",
      role: "NSS Program Officer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80"
    },
    summary: "Our 300-strong volunteer army reached over 4,500 rural residents across 6 adopted village clusters during the annual service drive.",
    content: `The State Youth Affairs Directorate has honored our National Service Scheme (NSS) unit with the **Outstanding Youth Volunteer Chapter of the Year Award**.

### Transformative Initiatives Completed:
- 🩺 **14 Comprehensive Health & Eye Check-up Camps** covering 4,500+ rural elders and children.
- 🌳 **'Green Roots' Drive**: 1,200 native drought-resistant trees planted with drip irrigation support.
- 💻 **Digital Literacy for Rural Schools**: 18 workshops teaching basic computer usage and internet safety to 6th-10th grade students.
- 🩸 **Mega Blood Donation Drive**: Collected 340 units of blood in partnership with the Government General Hospital.`,
    winners: [
      { name: "Arjun V.", rollNo: "22ME056", dept: "Mechanical 3rd Year", role: "NSS Student President" },
      { name: "Pooja Raman", rollNo: "22EC041", dept: "ECE 3rd Year", role: "Rural Medical Outreach Lead" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
    ],
    reactions: {
      claps: 165,
      trophies: 94,
      fire: 130
    },
    comments: []
  }
]

export const seedMemberships = [
  {
    id: "APP-CSI-2026-101",
    clubName: "CSI",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 98765 43210",
    rolePreference: "Event Operations & Attendance Manager",
    assignedRole: "Event Operations & Attendance Manager",
    roleCategory: "managing",
    sop: "I have built multiple React and Node.js web apps and won 2 hackathons. I want to join CSI to mentor juniors, organize our college's flagship hackathon, and collaborate on open-source AI projects.",
    skills: "React, Node.js, Python, System Design, Git",
    paymentRequired: true,
    feeAmount: 200,
    paymentStatus: "PAID",
    paymentDetails: {
      method: "UPI (Google Pay)",
      txnId: "UPI/2026/894102941",
      timestamp: "2026-08-24 11:30 AM"
    },
    status: "approved",
    appliedAt: "2026-08-24T11:30:00",
    reviewedAt: "2026-08-24T12:00:00",
    reviewNotes: "Approved by Dr. Ramanathan. Appointed as Event Operations & Attendance Manager."
  },
  {
    id: "APP-CSI-2026-102",
    clubName: "CSI",
    studentId: 1002,
    studentName: "Rahul K.",
    studentEmail: "rahul.k@college.edu",
    rollNo: "22CS104",
    dept: "Computer Science & Engineering",
    year: "4th Year",
    phone: "+91 91234 56780",
    rolePreference: "President & Student Conducting Lead",
    assignedRole: "President & Student Conducting Lead",
    roleCategory: "conducting",
    sop: "Senior competitive programmer and winner of Hackathon 24hr. Eager to conduct weekly DSA and algorithm workshops for first and second year members.",
    skills: "C++, Algorithms, Machine Learning, Docker",
    paymentRequired: true,
    feeAmount: 200,
    paymentStatus: "PAID",
    paymentDetails: {
      method: "UPI (PhonePe)",
      txnId: "UPI/2026/772194812",
      timestamp: "2026-08-23 04:15 PM"
    },
    status: "approved",
    appliedAt: "2026-08-23T16:15:00",
    reviewedAt: "2026-08-24T09:00:00",
    reviewNotes: "Approved by Dr. Ramanathan. Appointed to the student conducting leadership wing."
  },
  {
    id: "APP-CSI-2026-105",
    clubName: "CSI",
    studentId: 1005,
    studentName: "Sneha K.",
    studentEmail: "sneha.k@college.edu",
    rollNo: "22EC091",
    dept: "Electronics & Communication",
    year: "3rd Year",
    phone: "+91 94445 67890",
    rolePreference: "Media, Poster & Design Lead",
    assignedRole: "Media, Poster & Design Lead",
    roleCategory: "design",
    sop: "Graphic designer and UI specialist. Designed posters for college tech fests.",
    skills: "Figma, Illustrator, React UI",
    paymentRequired: true,
    feeAmount: 200,
    paymentStatus: "PAID",
    paymentDetails: {
      method: "UPI (Paytm)",
      txnId: "UPI/2026/339182746",
      timestamp: "2026-08-25 10:00 AM"
    },
    status: "approved",
    appliedAt: "2026-08-25T10:00:00",
    reviewedAt: "2026-08-25T11:00:00",
    reviewNotes: "Approved by Dr. Ramanathan."
  },
  {
    id: "APP-CSI-2026-106",
    clubName: "CSI",
    studentId: 1006,
    studentName: "Vikram S.",
    studentEmail: "vikram.s@college.edu",
    rollNo: "22IT045",
    dept: "Information Technology",
    year: "3rd Year",
    phone: "+91 98401 22334",
    rolePreference: "Technical Platform Coordinator",
    assignedRole: "Technical Platform Coordinator",
    roleCategory: "tech",
    sop: "DevOps and cloud infrastructure enthusiast. Eager to manage hackathon servers.",
    skills: "Linux, Docker, AWS, Node.js",
    paymentRequired: true,
    feeAmount: 200,
    paymentStatus: "PAID",
    paymentDetails: {
      method: "Debit Card",
      txnId: "CARD/2026/88192019",
      timestamp: "2026-08-25 10:30 AM"
    },
    status: "pending",
    appliedAt: "2026-08-25T10:30:00",
    reviewedAt: null,
    reviewNotes: ""
  },
  {
    id: "APP-IEEE-2026-103",
    clubName: "IEEE",
    studentId: 1003,
    studentName: "Karthik Verma",
    studentEmail: "karthik.v@college.edu",
    rollNo: "23EC041",
    dept: "Electronics & Communication",
    year: "2nd Year",
    phone: "+91 94432 18900",
    rolePreference: "Hardware & IoT Project Wing",
    assignedRole: "Hardware & IoT Project Lead",
    roleCategory: "conducting",
    sop: "Passionate about embedded firmware and ESP32 IoT sensors. Interested in building automated campus energy monitoring hardware.",
    skills: "Embedded C, KiCAD, ESP32, Arduino",
    paymentRequired: true,
    feeAmount: 250,
    paymentStatus: "PAID",
    paymentDetails: {
      method: "Debit Card (HDFC)",
      txnId: "CARD/2026/49102847",
      timestamp: "2026-08-24 09:45 AM"
    },
    status: "approved",
    appliedAt: "2026-08-24T09:45:00",
    reviewedAt: "2026-08-24T11:00:00",
    reviewNotes: "Approved by Prof. Narayanan."
  },
  {
    id: "APP-YOGA-2026-104",
    clubName: "Yoga",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 98765 43210",
    rolePreference: "General Wellness Member",
    assignedRole: "Mindfulness & Morning Batch Lead",
    roleCategory: "managing",
    sop: "Looking forward to morning mindfulness and pranayama sessions before daily classes.",
    skills: "Hatha Yoga, Breathwork",
    paymentRequired: false,
    feeAmount: 0,
    paymentStatus: "FREE",
    paymentDetails: null,
    status: "approved",
    appliedAt: "2026-08-20T08:00:00",
    reviewedAt: "2026-08-20T10:30:00",
    reviewNotes: "Welcome Ananya! Morning batch A starts 6:30 AM on the lawn."
  }
]

export const notifications = [
  {
    id: 1,
    role: "student",
    recipientEmail: "student@college.edu",
    text: "Your registration for Hackathon 24hr: AI & Web3 is confirmed (Ticket #REG-1001). Event PIN for venue check-in is 4821.",
    time: "10m ago",
    dot: "var(--green)",
    unread: true
  },
  {
    id: 2,
    role: "instructor",
    targetClub: "CSI",
    recipientEmail: "csi.advisor@college.edu",
    text: "New Club Membership Request: Vikram S. applied for CSI Chapter (Fee Paid: ₹200). Action required.",
    time: "25m ago",
    dot: "var(--amber)",
    unread: true
  },
  {
    id: 3,
    role: "all",
    text: "New Exclusive Event: 'Robotics Arena: Exclusive Autonomous Bot Workshop' is now scheduled for approved CSI members!",
    time: "45m ago",
    dot: "var(--indigo)",
    unread: true
  },
  {
    id: 4,
    role: "student",
    recipientEmail: "student@college.edu",
    text: "Next conduction is active! Robotics Arena & Autonomous Bot battle is now open for CSI member enrollment.",
    time: "2h ago",
    dot: "var(--indigo)",
    unread: true
  },
  {
    id: 5,
    role: "all",
    text: "New Achievement Story published: 1st Place Victory at National Hackathon 24hr 2026!",
    time: "1d ago",
    dot: "var(--purple)",
    unread: false
  },
  {
    id: 6,
    role: "student",
    recipientEmail: "student@college.edu",
    text: "🎉 Congratulations! Your CSI Club Membership is APPROVED. Appointed role: Event Operations & Attendance Manager.",
    time: "1d ago",
    dot: "var(--green)",
    unread: false
  }
]

export const pendingClubs = [
  { id: 1, name: "Debate Society", coordinator: "Priya M.", category: "Literary", email: "priya@college.edu", status: "pending", proposedAdvisor: "Dr. K. Ramanathan" },
  { id: 2, name: "Photography & Cine Club", coordinator: "Arjun V.", category: "Creative", email: "arjun@college.edu", status: "pending", proposedAdvisor: "Prof. Ananya Sen" },
]

export function getEnrollStatus(ev) {
  if (ev.statusOverride === 'completed' || ev.status === 'completed') {
    return {
      state: "completed",
      badge: "completed",
      tagLabel: "🏆 Completed · Results Published",
      label: "Event concluded — Official winners published"
    }
  }
  if (ev.statusOverride === 'active_conduction') {
    return {
      state: "open",
      badge: "active_conduction",
      tagLabel: "⚡ Next Conduction Active",
      label: "Active conduction — enrollment open now!"
    }
  }
  if (ev.statusOverride === 'closed') {
    if (ev.winners && Array.isArray(ev.winners) && ev.winners.length > 0) {
      return {
        state: "completed",
        badge: "completed",
        tagLabel: "🏆 Completed · Results Published",
        label: "Event concluded — Official winners published"
      }
    }
    return {
      state: "closed",
      badge: "closed",
      tagLabel: "Registration Closed",
      label: "Enrollment closed for this session"
    }
  }
  if (ev.statusOverride === 'upcoming') {
    const start = ev.enrollStart ? new Date(ev.enrollStart) : null
    return {
      state: "upcoming",
      badge: "upcoming",
      tagLabel: "Opening Soon",
      label: start ? `Enrollment opens ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Enrollment opening soon"
    }
  }
  if (ev.statusOverride === 'open') {
    const end = ev.enrollEnd ? new Date(ev.enrollEnd) : null
    return {
      state: "open",
      badge: "open",
      tagLabel: "🟢 Registration Open",
      label: end ? `Enrollment active — closes ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Enrollment open now"
    }
  }

  const now = new Date()
  const start = ev.enrollStart ? new Date(ev.enrollStart) : new Date(Date.now() - 86400000)
  const end = ev.enrollEnd ? new Date(ev.enrollEnd) : new Date(Date.now() + 86400000 * 5)

  if (now < start) {
    return {
      state: "upcoming",
      badge: "upcoming",
      tagLabel: "Opening Soon",
      label: `Enrollment opens ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
  }
  if (now > end) {
    return {
      state: "closed",
      badge: "closed",
      tagLabel: "Closed",
      label: "Enrollment closed"
    }
  }
  return {
    state: "open",
    badge: "open",
    tagLabel: "🟢 Open",
    label: `Enrollment active — closes ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }
}

export const seedAuditLogs = [
  {
    id: "AUD-1001",
    action: "FACULTY_ALLOCATION",
    actor: "Dr. Aris Thorne (Dean)",
    details: "Allocated Dr. K. Ramanathan as Faculty Advisor for CSI Chapter charter.",
    timestamp: "Aug 26, 2026 · 10:30 AM",
    badgeColor: "teal"
  },
  {
    id: "AUD-1002",
    action: "CHARTER_APPROVAL",
    actor: "Dr. Aris Thorne (Dean)",
    details: "Approved initial charter constitution for IEEE Student Branch & Robotics Wing.",
    timestamp: "Aug 26, 2026 · 11:15 AM",
    badgeColor: "green"
  },
  {
    id: "AUD-1003",
    action: "STATUS_OVERRIDE",
    actor: "Dr. Aris Thorne (Dean)",
    details: "Activated live conduction status for CSI National Hackathon.",
    timestamp: "Aug 27, 2026 · 09:00 AM",
    badgeColor: "purple"
  }
]

export const odInchargeFaculty = {
  id: "fac_od_head",
  name: "Dr. Malathi Sundaram",
  email: "od.faculty@college.edu",
  password: "od@faculty2026",
  role: "faculty_od",
  designation: "Professor & Chief Event Permission / OD In-Charge",
  dept: "Academic & Student Affairs Council",
  employeeId: "FAC-OD-101",
  officeRoom: "Administrative Wing - Room 204",
  officeHours: "Daily: 10:00 AM – 1:00 PM & 3:00 PM – 5:00 PM",
  phone: "+91 94445 67890",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  bio: "Chairperson of the University Student Participation and On-Duty Clearance Committee. Validates inter-collegiate hackathons, research symposiums, and student delegations."
}

export const externalEventPresets = [
  {
    title: "National Smart India Hackathon (SIH 2026)",
    type: "Inter-College Hackathon",
    organizer: "IIT Madras & Ministry of Education",
    location: "IIT Madras Research Park, Chennai",
    duration: "3 Days",
    mode: "Offline"
  },
  {
    title: "Southern Region Robotics & AI Championship",
    type: "Inter-College Competition",
    organizer: "NIT Trichy",
    location: "NIT Trichy Campus, Tiruchirappalli",
    duration: "2 Days",
    mode: "Offline"
  },
  {
    title: "International Conference on Distributed Computing & Cloud (ICDCC)",
    type: "Conference",
    organizer: "Anna University College of Engineering, Guindy",
    location: "Tagore Auditorium, CEG Guindy",
    duration: "2 Days",
    mode: "Offline"
  },
  {
    title: "State Level Inter-Collegiate Cultural Festival 'Saarang'",
    type: "Inter-College Cultural",
    organizer: "IIT Madras Cultural Council",
    location: "IIT Madras Open Air Theatre",
    duration: "4 Days",
    mode: "Offline"
  },
  {
    title: "Workshop on Quantum Computing Algorithms & Qiskit",
    type: "Workshop",
    organizer: "IBM Academic Initiative & PSG Tech",
    location: "PSG College of Technology, Coimbatore",
    duration: "1 Day",
    mode: "Offline"
  }
]

export const seedPermissionRequests = [
  {
    id: "PR-2026-1001",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    eventName: "National Smart India Hackathon (SIH 2026)",
    eventType: "Inter-College Hackathon",
    scope: "External",
    organizer: "IIT Madras & Ministry of Education",
    eventDate: "2026-08-18",
    eventEndDate: "2026-08-20",
    eventTime: "09:00 AM – 06:00 PM",
    venue: "IIT Madras Research Park, Chennai",
    purpose: "Presenting autonomous disaster response drone prototype in the grand finale round against top 30 national teams.",
    relatedClub: "CSI",
    teamMembers: [
      { name: "Rahul K.", rollNo: "22CS104", email: "rahul.k@college.edu", dept: "CSE" },
      { name: "Vikram S.", rollNo: "22IT045", email: "vikram.s@college.edu", dept: "IT" }
    ],
    invitationDocUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    invitationDocName: "SIH2026_Finalist_Letter.pdf",
    additionalRemarks: "Airfare and registration sponsored by CSI Student Chapter grant.",
    status: "OD Issued", // Timeline completed
    submittedAt: "2026-08-10T10:30:00.000Z",
    reviewedAt: "2026-08-11T14:20:00.000Z",
    reviewedBy: "Dr. Malathi Sundaram",
    facultyRemarks: "Permission granted. Exemplary national-level participation.",
    proof: {
      submittedAt: "2026-08-21T11:00:00.000Z",
      photos: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
      ],
      certificateUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?auto=format&fit=crop&w=600&q=80",
      attendanceProofUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      description: "Secured 1st Runner Up Trophy with ₹75,000 cash prize. Official certificate and medal photos attached.",
      verifiedAt: "2026-08-22T09:45:00.000Z",
      verifiedBy: "Dr. Malathi Sundaram",
      verificationRemarks: "Proof verified. Certificates and attendance slips found authentic."
    },
    odRecordId: "OD-2026-0842"
  },
  {
    id: "PR-2026-1002",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    eventName: "Southern Region Robotics & AI Championship",
    eventType: "Inter-College Competition",
    scope: "External",
    organizer: "NIT Trichy",
    eventDate: "2026-09-12",
    eventEndDate: "2026-09-13",
    eventTime: "08:30 AM – 05:30 PM",
    venue: "NIT Trichy Indoor Sports Complex",
    purpose: "Participating in autonomous line-follower and obstacle navigation battle bots arena.",
    relatedClub: "IEEE",
    teamMembers: [
      { name: "Karthik Verma", rollNo: "23EC041", email: "karthik.v@college.edu", dept: "ECE" }
    ],
    invitationDocUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?auto=format&fit=crop&w=600&q=80",
    invitationDocName: "NIT_Trichy_BotBattle_Pass.pdf",
    additionalRemarks: "Hardware kit and LiPo battery safety clearances obtained.",
    status: "Proof Submitted", // Waiting for faculty verification!
    submittedAt: "2026-09-02T09:15:00.000Z",
    reviewedAt: "2026-09-04T11:00:00.000Z",
    reviewedBy: "Dr. Malathi Sundaram",
    facultyRemarks: "Approved. All safety precautions must be adhered to at external venue.",
    proof: {
      submittedAt: "2026-09-14T16:30:00.000Z",
      photos: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
      ],
      certificateUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      attendanceProofUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      description: "Completed both arena rounds. Reached Semifinals stage. Participation certificates submitted for OD review.",
      verifiedAt: null,
      verifiedBy: null,
      verificationRemarks: null
    },
    odRecordId: null
  },
  {
    id: "PR-2026-1003",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    eventId: 1, // Linked to internal event "HackMatrix: 24hr Campus Hackathon"
    eventName: "HackMatrix: 24hr Campus Hackathon",
    eventType: "Internal College Event",
    scope: "Internal",
    organizer: "CSI Chapter",
    eventDate: "2026-09-28",
    eventEndDate: "2026-09-29",
    eventTime: "09:00 AM – 09:00 AM (Next Day)",
    venue: "Main Auditorium & Computing Labs",
    purpose: "Leading student operations and competing with university smart campus navigation team.",
    relatedClub: "CSI",
    teamMembers: [
      { name: "Sneha K.", rollNo: "22EC091", email: "sneha.k@college.edu", dept: "ECE" }
    ],
    invitationDocUrl: "",
    invitationDocName: "Campus_Hackathon_Schedule.pdf",
    additionalRemarks: "Permissions required for lab overnight power and networking access.",
    status: "Approved", // Approved permission, waiting for event to take place / proof pending
    submittedAt: "2026-09-15T14:00:00.000Z",
    reviewedAt: "2026-09-16T10:00:00.000Z",
    reviewedBy: "Dr. Malathi Sundaram",
    facultyRemarks: "Approved for participation. Ensure hostel and security clearance on overnight dates.",
    proof: null,
    odRecordId: null
  },
  {
    id: "PR-2026-1004",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    year: "3rd Year",
    eventName: "State Level Inter-Collegiate Cultural Festival 'Saarang'",
    eventType: "Inter-College Cultural",
    scope: "External",
    organizer: "IIT Madras Cultural Council",
    eventDate: "2026-10-05",
    eventEndDate: "2026-10-08",
    eventTime: "10:00 AM – 08:00 PM",
    venue: "IIT Madras Open Air Theatre",
    purpose: "Representing university in classical digital music synthesis and acoustics competition.",
    relatedClub: "Fine Arts",
    teamMembers: [
      { name: "Meera S.", rollNo: "23AR012", email: "meera.s@college.edu", dept: "Architecture" }
    ],
    invitationDocUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80",
    invitationDocName: "Saarang_Delegation_Invite.pdf",
    additionalRemarks: "Instruments and sound staging gear transported with student team.",
    status: "Pending Approval", // In review by OD In-charge
    submittedAt: "2026-09-20T11:45:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    facultyRemarks: null,
    proof: null,
    odRecordId: null
  },
  {
    id: "PR-2026-1005",
    studentId: 1002,
    studentName: "Rahul K.",
    studentEmail: "rahul.k@college.edu",
    rollNo: "22CS104",
    dept: "Computer Science & Engineering",
    year: "4th Year",
    eventName: "Inter-State Extreme Go-Kart & Motor Club Invitational",
    eventType: "External Sports",
    scope: "External",
    organizer: "Motorsports Club of India",
    eventDate: "2026-09-08",
    eventEndDate: "2026-09-09",
    eventTime: "08:00 AM – 04:00 PM",
    venue: "Speedway Track, Sriperumbudur",
    purpose: "Racing team event participation.",
    relatedClub: "Sports",
    teamMembers: [],
    invitationDocUrl: "",
    invitationDocName: "Racing_Notice.pdf",
    additionalRemarks: "Non-accredited private organization event.",
    status: "Rejected",
    submittedAt: "2026-08-25T16:00:00.000Z",
    reviewedAt: "2026-08-27T09:30:00.000Z",
    reviewedBy: "Dr. Malathi Sundaram",
    facultyRemarks: "Rejected: Event is organized by an unaccredited commercial entity without college insurance or academic sponsorship.",
    proof: null,
    odRecordId: null
  },
  ...octoberPermissionRequests
]

export const seedODRecords = [
  {
    id: "OD-2026-0842",
    requestId: "PR-2026-1001",
    studentId: 1001,
    studentName: "Ananya Rao",
    studentEmail: "student@college.edu",
    rollNo: "23CS082",
    dept: "Computer Science & Engineering",
    degree: "B.Tech Computer Science",
    year: "3rd Year",
    eventName: "National Smart India Hackathon (SIH 2026)",
    eventType: "Inter-College Hackathon",
    organizer: "IIT Madras & Ministry of Education",
    eventDates: "Aug 18, 2026 – Aug 20, 2026",
    totalDaysOD: 3,
    venue: "IIT Madras Research Park, Chennai",
    status: "Active / Verified",
    issuedBy: "Dr. Malathi Sundaram",
    issuerDesignation: "Chief Event Permission & OD In-Charge",
    issuedAt: "Aug 22, 2026",
    issuedAtTimestamp: "2026-08-22T09:45:00.000Z",
    verificationReference: "VER-PR-2026-1001-OK",
    qrCodeData: "CEH-OFFICIAL-OD-PASS:OD-2026-0842:23CS082:SIH-2026:VERIFIED",
    remarks: "Official On-Duty granted for 3 days of academic absence. Student successfully completed SIH 2026 and won 1st Runner Up honors. Attendance records updated across CSE 3rd Year semester registries."
  },
  ...octoberODRecords
]

export const seedMultiChannelAlerts = [
  {
    id: 'dispatch_1',
    recipientName: 'Ananya Rao',
    recipientEmail: 'student@college.edu',
    recipientPhone: '+91 98765 43210',
    channel: 'whatsapp',
    type: 'od_approval_alert',
    title: 'OD Clearance Sanctioned - SIH 2026',
    message: '🎉 Congratulations Ananya Rao! Your On-Duty request for "National Smart India Hackathon (SIH 2026)" has been APPROVED by Chief OD In-Charge Dr. Malathi Sundaram. Official Pass #: OD-2026-0842. Academic attendance credit is sanctioned for 3 days.',
    status: 'delivered',
    timestamp: '2026-08-22T09:45:00Z',
    sender: 'Dr. Malathi Sundaram (Chief OD In-Charge)'
  },
  {
    id: 'dispatch_2',
    recipientName: 'Ananya Rao',
    recipientEmail: 'student@college.edu',
    recipientPhone: '+91 98765 43210',
    channel: 'email',
    type: 'od_pass_issued',
    title: 'Official OD Pass Sanctioned: SIH 2026',
    message: 'Dear Ananya Rao,\n\nYour OD Request for "National Smart India Hackathon (SIH 2026)" has been verified and sanctioned by the Faculty OD Clearance Desk.\n\nPass Ref: OD-2026-0842\nAttendance Credit: 3 Days Sanctioned.\n\nInstitutional Event & OD Cell',
    status: 'delivered',
    timestamp: '2026-08-22T09:46:00Z',
    sender: 'Dr. Malathi Sundaram (Chief OD In-Charge)'
  },
  {
    id: 'dispatch_3',
    recipientName: 'Ananya Rao',
    recipientEmail: 'student@college.edu',
    recipientPhone: '+91 98765 43210',
    channel: 'sms',
    type: 'event_reminder',
    title: 'SMS Alert: SIH 2026 On-Duty Approved',
    message: 'CEH ALERT: Official OD Pass OD-2026-0842 sanctioned for Ananya Rao (3 Days OD). Attendance credit recorded.',
    status: 'delivered',
    timestamp: '2026-08-22T09:47:00Z',
    sender: 'Campus Event Hub Desk'
  },
  {
    id: 'dispatch_4',
    recipientName: 'Ananya Rao',
    recipientEmail: 'student@college.edu',
    recipientPhone: '+91 98765 43210',
    channel: 'whatsapp',
    type: 'proof_reminder',
    title: 'Action: Upload Participation Proof for Robotics Workshop',
    message: '⚠️ Action Required: Hello Ananya Rao. Your event "Autonomous Robotics Arena" is completed. Please upload your participation certificate/photos on Campus Event Hub under Proof Verification to claim your OD.',
    status: 'delivered',
    timestamp: '2026-09-02T14:00:00Z',
    sender: 'Dr. Malathi Sundaram (Chief OD In-Charge)'
  },
  {
    id: 'dispatch_5',
    recipientName: 'Vikram S.',
    recipientEmail: 'vikram.s@college.edu',
    recipientPhone: '+91 94444 12345',
    channel: 'whatsapp',
    type: 'od_approval_alert',
    title: 'OD Request Approved: State Robotics Championship',
    message: '🎉 Hello Vikram S., your OD permission request for State Robotics Championship has been APPROVED by the Faculty OD Desk. Remember to upload participation photos to unlock OD.',
    status: 'delivered',
    timestamp: '2026-08-25T11:20:00Z',
    sender: 'Dr. Malathi Sundaram (Chief OD In-Charge)'
  }
]



