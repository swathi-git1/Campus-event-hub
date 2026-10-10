# 11 MongoDB Collections from mongoConnection.js and server/db.js
# Columns: Field | Type | Null | Key | Default | Extra

COLLECTIONS_DATA = [
    {
        "name": "users",
        "caption": "users Collection",
        "intro": "The users collection stores unified authentication identities, encrypted password digests, department assignments, and notification preferences across all institutional roles.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Institutional User Identifier (e.g. 1001, inst_csi)"],
            ["name", "String", "NO", "", "NULL", "Full legal employee/student name"],
            ["email", "String", "NO", "UNI", "NULL", "Unique institutional email address (@college.edu)"],
            ["role", "String", "NO", "", "'student'", "Enum ('student', 'instructor', 'faculty_od', 'admin')"],
            ["passwordHash", "String", "NO", "", "NULL", "PBKDF2-SHA512 derived password digest (12k iter)"],
            ["passwordSalt", "String", "NO", "", "NULL", "Cryptographic 16-byte random hex salt"],
            ["dept", "String", "YES", "", "NULL", "Institutional academic department assignment"],
            ["assignedClub", "String", "YES", "MUL", "NULL", "Assigned chapter charter for faculty advisor"],
            ["isActive", "Boolean", "NO", "", "true", "Account activation flag for access control"],
            ["preferences", "Object", "NO", "", "{}", "Preferences: {theme, accent, notifications:{email, wa, sms}}"],
            ["avatar", "String", "YES", "", "NULL", "Profile photograph URL"],
            ["createdAt", "Date", "NO", "", "ISO timestamp", "Account provisioning audit timestamp"]
        ]
    },
    {
        "name": "students",
        "caption": "students Collection",
        "intro": "The students collection maintains verified collegiate scholar records, enrollment credentials, departmental affiliations, and cumulative event participation metrics.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Student user profile ID (FK to users.id)"],
            ["name", "String", "NO", "", "NULL", "Full enrolled student name"],
            ["rollNo", "String", "NO", "UNI", "NULL", "Unique academic roll number (e.g. 23CS082)"],
            ["email", "String", "NO", "UNI", "NULL", "Student institutional email (FK to users.email)"],
            ["dept", "String", "NO", "", "NULL", "Engineering degree department"],
            ["degree", "String", "NO", "", "'B.Tech'", "Degree program curriculum (B.E., B.Tech, M.E.)"],
            ["year", "String", "NO", "", "'3rd Year'", "Current academic class year"],
            ["chapter", "String", "YES", "MUL", "'None'", "Primary student chapter affiliation (FK to chapters.name)"],
            ["verificationStatus", "String", "NO", "", "'pending'", "Roster status ('verified', 'pending', 'rejected')"],
            ["attendanceCount", "Number", "NO", "", "0", "Cumulative verified event attendance counter"],
            ["avatar", "String", "YES", "", "NULL", "Student profile photo URL"],
            ["joinedDate", "String", "NO", "", "YYYY-MM-DD", "Institutional admission record date"]
        ]
    },
    {
        "name": "events",
        "caption": "events Collection",
        "intro": "The events collection catalogs scheduled campus activities, technical symposiums, capacity limits, live hall check-in PINs, and lifecycle states.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Unique Event Identifier (e.g. '1', 'ev_1728400000')"],
            ["title", "String", "NO", "", "NULL", "Official event title / contest name"],
            ["club", "String", "NO", "MUL", "NULL", "Host student chapter (FK to chapters.name)"],
            ["date", "String", "NO", "", "NULL", "Event scheduled calendar date (YYYY-MM-DD)"],
            ["time", "String", "YES", "", "NULL", "Event scheduled commencement time"],
            ["venue", "String", "NO", "", "NULL", "Assigned auditorium or laboratory venue"],
            ["category", "String", "YES", "", "NULL", "Category ('Technical', 'Cultural', 'Sports', 'Hackathon')"],
            ["capacity", "Number", "NO", "", "200", "Maximum permissible contestant seating threshold"],
            ["registered", "Number", "NO", "", "0", "Real-time confirmed attendee count"],
            ["status", "String", "NO", "", "'upcoming'", "Lifecycle state ('upcoming', 'ongoing', 'completed')"],
            ["venuePin", "String", "YES", "", "'4821'", "Dynamic 4-digit venue hall attendance PIN"],
            ["createdBy", "String", "NO", "MUL", "'system'", "Event organizer email (FK to users.email)"],
            ["createdAt", "Date", "NO", "", "ISO timestamp", "Event scheduling timestamp"]
        ]
    },
    {
        "name": "registrations",
        "caption": "registrations Collection",
        "intro": "The registrations collection records contestant enrollments, digital ticket identifiers, and live attendance check-ins including method and timestamp.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Digital registration ticket pass ID (REG-XXXXXX-XXX)"],
            ["eventId", "String", "NO", "MUL", "NULL", "Registered event ID (Compound index with email)"],
            ["eventTitle", "String", "NO", "", "NULL", "Snapshot of event title"],
            ["club", "String", "YES", "", "NULL", "Host club name snapshot"],
            ["eventDate", "String", "YES", "", "NULL", "Event date snapshot"],
            ["venue", "String", "YES", "", "NULL", "Auditorium venue snapshot"],
            ["team", "String", "YES", "", "''", "Contestant team designation"],
            ["studentName", "String", "NO", "", "NULL", "Registered student scholar name"],
            ["rollNo", "String", "NO", "", "NULL", "Academic roll number"],
            ["dept", "String", "YES", "", "NULL", "Student academic department"],
            ["year", "String", "YES", "", "NULL", "Class year"],
            ["email", "String", "NO", "MUL", "NULL", "Attendee email (Compound index with eventId)"],
            ["phone", "String", "YES", "", "NULL", "Contact phone number for alert notifications"],
            ["isClubMember", "Boolean", "NO", "", "false", "Verified chapter membership standing flag"],
            ["status", "String", "NO", "", "'Confirmed'", "Registration state ('Confirmed', 'Cancelled')"],
            ["attended", "Boolean", "NO", "", "false", "Live venue attendance verification flag"],
            ["attendedAt", "String", "YES", "", "NULL", "Live check-in verification timestamp"],
            ["checkinMethod", "String", "YES", "", "NULL", "Verification mode ('Self PIN Verified', 'Advisor Marked')"],
            ["timestamp", "Date", "NO", "", "ISO timestamp", "Pass reservation audit timestamp"]
        ]
    },
    {
        "name": "permission_requests",
        "caption": "permission_requests Collection",
        "intro": "The permission_requests collection manages the complete On-Duty (OD) academic leave application lifecycle from submission through proof verification.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Permission request ticket ID (e.g. pr_1001)"],
            ["studentId", "String", "NO", "MUL", "NULL", "Student identifier (FK to students.id)"],
            ["studentName", "String", "NO", "", "NULL", "Student applicant legal name"],
            ["studentEmail", "String", "NO", "MUL", "NULL", "Institutional email (FK to users.email)"],
            ["rollNo", "String", "NO", "", "NULL", "Student academic roll number"],
            ["eventId", "String", "YES", "MUL", "NULL", "Associated event identifier (FK to events.id)"],
            ["eventTitle", "String", "NO", "", "NULL", "Event name / technical symposium title"],
            ["dept", "String", "YES", "", "NULL", "Applicant academic department"],
            ["purpose", "String", "YES", "", "NULL", "Academic OD leave rationale and statement"],
            ["status", "String", "NO", "", "'pending'", "Lifecycle state (pending, approved, rejected, etc.)"],
            ["proof", "Object", "YES", "", "NULL", "Proof payload: {certificateUrl, photos, verifiedAt}"],
            ["officialPassNumber", "String", "YES", "", "NULL", "Official clearance pass identifier"],
            ["odRecordId", "String", "YES", "MUL", "NULL", "Archived OD pass credential ID (FK to od_records.id)"],
            ["remarks", "String", "YES", "", "NULL", "OD In-Charge approval / scrutiny notes"],
            ["approvedBy", "String", "YES", "", "NULL", "Sanctioning faculty officer name"],
            ["approvedAt", "Date", "YES", "", "NULL", "Clearance approval timestamp"],
            ["createdAt", "Date", "NO", "", "ISO timestamp", "Request submission audit timestamp"]
        ]
    },
    {
        "name": "od_records",
        "caption": "od_records Collection",
        "intro": "The od_records collection stores finalized and verified On-Duty clearance credentials, total credited academic days, and cryptographic QR verification tokens.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Official OD Pass credential number (e.g. OD-2026-9041)"],
            ["requestId", "String", "NO", "MUL", "NULL", "Originating permission request ID (FK)"],
            ["studentId", "String", "NO", "MUL", "NULL", "Student identifier (FK to students.id)"],
            ["studentName", "String", "NO", "", "NULL", "Student applicant name"],
            ["studentEmail", "String", "NO", "MUL", "NULL", "Institutional email (FK to users.email)"],
            ["rollNo", "String", "NO", "", "NULL", "Student roll number"],
            ["dept", "String", "NO", "", "NULL", "Student engineering department"],
            ["eventName", "String", "NO", "", "NULL", "Event / competition title"],
            ["eventDates", "String", "NO", "", "NULL", "Sanctioned date range string"],
            ["totalDaysOD", "Number", "NO", "", "1", "Total credited academic On-Duty leave days"],
            ["venue", "String", "YES", "", "NULL", "Event venue location"],
            ["status", "String", "NO", "", "'Active / Verified'", "Official OD credential status"],
            ["issuedBy", "String", "NO", "", "NULL", "Sanctioning officer (e.g. Dr. Malathi Sundaram)"],
            ["issuerDesignation", "String", "NO", "", "NULL", "Officer institutional designation"],
            ["verificationReference", "String", "NO", "", "NULL", "Tamper-evident verification reference string"],
            ["qrCodeData", "String", "NO", "", "NULL", "Cryptographic QR pass verification payload"],
            ["remarks", "String", "YES", "", "NULL", "Sanctioning notes and credit justification"],
            ["issuedAt", "String", "NO", "", "NULL", "Formatted issue date (e.g. Aug 14, 2026)"],
            ["issuedAtTimestamp", "Date", "NO", "", "ISO timestamp", "Issuance audit timestamp"]
        ]
    },
    {
        "name": "chapters",
        "caption": "chapters Collection",
        "intro": "The chapters collection catalogs accredited collegiate societies, student branches, executive counselors, and active membership tallies.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Chapter slug code (e.g. csi, ieee, robotics)"],
            ["name", "String", "NO", "UNI", "NULL", "Official chapter society name (e.g. CSI Chapter)"],
            ["tagline", "String", "YES", "", "NULL", "Society motto and mission tagline"],
            ["description", "String", "YES", "", "NULL", "Comprehensive society overview and charter"],
            ["category", "String", "YES", "", "NULL", "Category ('Technical', 'Social', 'Cultural', 'Sports')"],
            ["counselor", "String", "YES", "", "NULL", "Faculty branch counselor name"],
            ["memberCount", "Number", "NO", "", "0", "Total active enrolled student members"],
            ["eventsCount", "Number", "NO", "", "0", "Cumulative conducted events counter"],
            ["createdAt", "Date", "NO", "", "ISO timestamp", "Institutional charter establishment timestamp"]
        ]
    },
    {
        "name": "campus_links",
        "caption": "campus_links Collection",
        "intro": "The campus_links collection provides verified external URLs, institutional LMS dropboxes, competition portals, and digital research libraries for the Multi-Linker.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Link resource identifier (e.g. link_1)"],
            ["title", "String", "NO", "", "NULL", "Campus resource portal title"],
            ["url", "String", "NO", "", "NULL", "Fully qualified destination URL"],
            ["category", "String", "NO", "", "'Institutional Portals'", "Resource category (Academic, Hackathons, Research)"],
            ["description", "String", "YES", "", "''", "Resource summary and usage instructions"],
            ["icon", "String", "YES", "", "NULL", "Display icon glyph or identifier"],
            ["createdBy", "String", "NO", "MUL", "'system'", "Curator institutional email (FK to users.email)"],
            ["createdAt", "Date", "NO", "", "ISO timestamp", "Resource curation timestamp"],
            ["isOfficial", "Boolean", "NO", "", "false", "Institutionally verified badge flag"]
        ]
    },
    {
        "name": "notification_logs",
        "caption": "notification_logs Collection (notification_dispatches in MongoDB)",
        "intro": "The notification_logs collection tracks automated multi-channel alert transmissions across Email, WhatsApp direct links, and SMS gateways.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Dispatch log entry ID (e.g. notif_1728400000)"],
            ["recipientEmail", "String", "NO", "MUL", "NULL", "Recipient email address (FK to users.email)"],
            ["recipientPhone", "String", "YES", "", "''", "Recipient phone number for SMS and WhatsApp"],
            ["channel", "String", "NO", "", "'email'", "Delivery channel ('email', 'whatsapp', 'sms')"],
            ["type", "String", "NO", "", "'general_alert'", "Workflow notification type"],
            ["title", "String", "NO", "", "NULL", "Alert notification subject heading"],
            ["message", "String", "NO", "", "NULL", "Complete notification body content"],
            ["status", "String", "NO", "", "'delivered'", "Delivery outcome ('delivered', 'queued', 'failed')"],
            ["timestamp", "Date", "NO", "", "ISO timestamp", "Dispatch transmission timestamp"]
        ]
    },
    {
        "name": "audit_logs",
        "caption": "audit_logs Collection",
        "intro": "The audit_logs collection maintains an immutable security ledger recording administrative state modifications, password changes, and OD clearances.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["id", "String", "NO", "UNI", "NULL", "Audit log event ID (e.g. audit_1728400000)"],
            ["action", "String", "NO", "", "NULL", "Action code (EVENT_CREATED, OD_PASS_ISSUED, etc.)"],
            ["user", "String", "NO", "MUL", "'system'", "Acting user institutional email (FK to users.email)"],
            ["details", "String", "NO", "", "NULL", "Human-readable context narrative"],
            ["timestamp", "Date", "NO", "", "ISO timestamp", "Immutable system audit timestamp"]
        ]
    },
    {
        "name": "system_settings",
        "caption": "system_settings Collection",
        "intro": "The system_settings collection stores singleton global institutional configuration policies, email domain restrictions, and academic year settings.",
        "headers": ["Field", "Type", "Null", "Key", "Default", "Extra"],
        "widths": [1.4, 0.9, 0.6, 0.6, 1.1, 2.2],
        "rows": [
            ["_id", "ObjectId", "NO", "PRI", "UUID/Auto", "MongoDB Document Identifier"],
            ["key", "String", "NO", "UNI", "'config'", "Configuration singleton document primary key"],
            ["institutionName", "String", "NO", "", "'Anna University Campus Hub'", "Official institution banner title"],
            ["allowedEmailDomain", "String", "NO", "", "'college.edu'", "Enforced institutional email domain"],
            ["requireEmailDomainCheck", "Boolean", "NO", "", "true", "Domain validation gate flag"],
            ["allowRegistration", "Boolean", "NO", "", "true", "Global self-service student enrollment toggle"],
            ["academicYear", "String", "NO", "", "'2026-2027'", "Active academic operational calendar year"]
        ]
    }
]

# Chapter 6 Parent/Child Entity Relationship Table Data (Page 20)
RELATIONSHIP_TABLE_DATA = [
    ["Parent Entity", "Child Entity", "Relationship Type", "Foreign Key / Reference"],
    ["users", "students", "1-to-0..1", "students.id -> users.id"],
    ["users", "events", "1-to-Many", "events.createdBy -> users.email"],
    ["chapters", "events", "1-to-Many", "events.club -> chapters.name"],
    ["chapters", "students", "1-to-Many", "students.chapter -> chapters.name"],
    ["events", "registrations", "1-to-Many", "registrations.eventId -> events.id"],
    ["students", "registrations", "1-to-Many", "registrations.email -> students.email"],
    ["students", "permission_requests", "1-to-Many", "permission_requests.studentId -> students.id"],
    ["events", "permission_requests", "1-to-Many", "permission_requests.eventId -> events.id"],
    ["permission_requests", "od_records", "1-to-0..1", "od_records.requestId -> permission_requests.id"],
    ["users", "audit_logs", "1-to-Many", "audit_logs.user -> users.email"],
    ["users", "notification_logs", "1-to-Many", "notification_logs.recipientEmail -> users.email"],
    ["users", "campus_links", "1-to-Many", "campus_links.createdBy -> users.email"]
]
