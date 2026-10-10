# Campus Event Hub Modules for Chapter 8
# Strictly following the 6-topic sequence:
# 1. Screenshots & Interface Explanations
# 2. Purpose & Scope
# 3. Functional Requirements
# 4. Non-Functional Requirements
# 5. API Design
# 6. DB Design

MODULES_DATA = [
    {
        "num": "8.3",
        "title": "User Authentication & Access Control (RBAC)",
        "figures": [
            ("fig_8.3.1_user_login.png", "Figure 8.3.1 Role-Based User Login & Authentication Interface", "The login console provides role-independent authentication with email and password input fields, quick-demo account credential cards, password visibility toggling, and multi-role gateway routing."),
            ("fig_8.3.2_user_register.png", "Figure 8.3.2 Student Institutional Registration Interface", "The registration portal validates institutional email domain compliance, enforces secure password complexity standards, and captures student biodata before provisioning active portal access.")
        ],
        "purpose": "Provides cryptographic authentication, secure credential hashing, session persistence, and Role-Based Access Control (RBAC) across five institutional roles (Student, Instructor, Faculty OD In-Charge, Admin, Public Visitor).",
        "functional": [
            ("Role-Based Authentication: ", "Users authenticate with institutional email and password to receive a cryptographically signed HMAC-SHA256 JWT access token and user profile metadata."),
            ("Domain-Restricted Sign-Up: ", "Prospective students register with enforced institutional email validation matching the configured allowed campus domain (@college.edu)."),
            ("Credential Security: ", "Users can change passwords securely via old password validation; self-service forgot-password generates 15-minute verification reset tokens."),
            ("Session Persistence: ", "Bearer tokens are securely stored in browser storage with automatic session timeout handling and Axios 401 interception.")
        ],
        "non_functional": [
            ("Cryptographic Standard: ", "Passwords are never stored in plaintext; salted PBKDF2 with SHA-512 and 12,000 iterations is enforced."),
            ("Brute-Force Protection: ", "IP-based sliding-window rate limiting restricts authentication attempts to 15 requests per 15-minute window."),
            ("Stateless Scalability: ", "HMAC-SHA256 signed tokens allow horizontal backend scaling without shared server memory locks.")
        ],
        "api": [
            ["POST", "/api/auth/login", "Authenticates credentials; returns signed JWT token, refresh token, and profile (id, role, name, email)."],
            ["POST", "/api/auth/register", "Registers a new student account after verifying institutional email domain policy."],
            ["GET", "/api/auth/me", "Validates current Bearer JWT token and returns authenticated user identity."],
            ["POST", "/api/auth/change-password", "Updates user password after verifying current PBKDF2 hash."],
            ["POST", "/api/auth/forgot-password", "Generates 15-minute numerical reset code for verified account email."],
            ["POST", "/api/auth/reset-password", "Validates verification code and commits updated PBKDF2 password hash."]
        ],
        "db": [
            ["users", "PK: _id (ObjectId)\nUNIQUE: email, id\nINDEX: role", "email String, passwordHash String, passwordSalt String, role String, name String, dept String, isActive Boolean, preferences Object, createdAt Date"]
        ]
    },
    {
        "num": "8.4",
        "title": "Student Profile & Credential Management",
        "figures": [
            ("fig_8.4.1_student_profile.png", "Figure 8.4.1 Student Profile, Academic Credentials & Multi-Channel Alert Preferences", "The profile interface presents comprehensive scholar biodata, academic roll numbers, engineering degree status, cumulative event attendance counter, and toggles for WhatsApp, SMS, and Email alert preferences.")
        ],
        "purpose": "Centralizes collegiate student biodata, degree standing, roll numbers, chapter affiliations, and notification preference dispatch flags.",
        "functional": [
            ("Biodata Management: ", "Students view and update profile details, contact telephone numbers, avatars, and technical skill tags."),
            ("Academic Tracking: ", "Maintains verified degree credentials, department assignment, curriculum year, and verified attendance counters."),
            ("Dispatch Channels: ", "Allows users to selectively enable or disable WhatsApp, SMS, and Email alert dispatch triggers.")
        ],
        "non_functional": [
            ("Data Confidentiality: ", "Student contact numbers and personal settings are restricted to the authenticated student owner and administrative staff."),
            ("Read Efficiency: ", "Student profile queries resolve in < 25ms through indexed MongoDB collections.")
        ],
        "api": [
            ["GET", "/api/students/:id", "Retrieves complete student biographical and academic record by ID."],
            ["PUT", "/api/users/profile", "Updates student biodata, phone number, bio summary, and skill badges."],
            ["PUT", "/api/auth/preferences", "Updates UI theme, accent color, and multi-channel notification dispatch toggles."]
        ],
        "db": [
            ["students", "PK: _id (ObjectId)\nUNIQUE: rollNo, email, id\nFK: email -> users.email", "rollNo String, name String, email String, dept String, degree String, year String, chapter String, verificationStatus String, attendanceCount Number, avatar String"],
            ["users", "PK: _id (ObjectId)\nUNIQUE: email", "preferences.notifications { email Boolean, whatsapp Boolean, sms Boolean }"]
        ]
    },
    {
        "num": "8.5",
        "title": "Campus Clubs & Chapter Governance",
        "figures": [
            ("fig_8.5.1_clubs_directory.png", "Figure 8.5.1 Accredited Student Clubs & Technical Chapters Directory", "The clubs catalog displays accredited collegiate chapters (CSI, IEEE, IE, Robotics, Fine Arts) with category filters, counselor names, and active member counts."),
            ("fig_8.5.2_club_profile_csi.png", "Figure 8.5.2 CSI Student Chapter Detailed Profile & Executive Council", "The chapter detailed view shows the mission charter, faculty branch counselor, upcoming events calendar, student executive office bearers, and joining guidelines.")
        ],
        "purpose": "Maintains official master governance records for accredited collegiate technical societies, faculty branch counselors, executive committees, and active student chapter rosters.",
        "functional": [
            ("Chapter Directory: ", "Displays accredited collegiate chapters categorized by Technical, Social, Cultural, and Sports branches."),
            ("Counselor Assignment: ", "Associates designated faculty advisors with student chapters for oversight and event sanctioning."),
            ("Administrative Chartering: ", "Enables administrators to charter new student societies or update chapter governance metadata.")
        ],
        "non_functional": [
            ("Catalogue Availability: ", "High-availability cached chapter metadata ensures instant discovery with zero database bottlenecks."),
            ("Integrity Constraints: ", "Chapter codes and unique society names are validated to prevent duplicate charter entries.")
        ],
        "api": [
            ["GET", "/api/chapters", "Retrieves paginated list of accredited chapters with category and search filters."],
            ["POST", "/api/chapters", "Admin endpoint. Charters a new campus chapter with faculty counselor and category."],
            ["PUT", "/api/chapters/:id", "Admin endpoint. Updates chapter charter details, tagline, and counselor."],
            ["DELETE", "/api/chapters/:id", "Admin endpoint. Revokes chapter accreditation."]
        ],
        "db": [
            ["chapters", "PK: _id (ObjectId)\nUNIQUE: name, id", "id String, name String, tagline String, description String, category String, counselor String, memberCount Number, eventsCount Number, createdAt Date"]
        ]
    },
    {
        "num": "8.6",
        "title": "Event Scheduling & Capacity Gating",
        "figures": [
            ("fig_8.6.1_instructor_events.png", "Figure 8.6.1 Chapter Event Scheduling & Capacity Gating Console", "Faculty advisors manage scheduled workshops, hackathons, and technical contests with venue allocations, maximum attendee seating limits, and live registration counts.")
        ],
        "purpose": "Enables faculty branch counselors and student conveners to create, configure, publish, and supervise campus technical symposiums, workshops, and contests with strict seating capacity limits.",
        "functional": [
            ("Event Scheduling: ", "Advisors configure event titles, dates, commencement times, venues, and descriptions."),
            ("Capacity Thresholds: ", "Enforces hard registration limits to prevent auditorium and lab overbooking."),
            ("Dynamic 4-Digit PIN: ", "Generates unique venue hall attendance PINs for secure in-person check-in verification.")
        ],
        "non_functional": [
            ("Concurrency Safety: ", "Atomic registration counters prevent race conditions during peak registration rushes."),
            ("Audit Traceability: ", "Every event creation, update, and deletion is recorded in the system audit log.")
        ],
        "api": [
            ["GET", "/api/events", "Retrieves active campus events with search, category, status, and chapter filters."],
            ["POST", "/api/events", "Creates a new chapter event with capacity limits and auto-generated venue PIN."],
            ["PUT", "/api/events/:id", "Updates event schedule, venue, capacity threshold, or description."],
            ["DELETE", "/api/events/:id", "Removes scheduled event and archives linked records."]
        ],
        "db": [
            ["events", "PK: _id (ObjectId)\nUNIQUE: id\nFK: club -> chapters.name", "id String, title String, club String, date String, time String, venue String, category String, capacity Number, registered Number, status String, venuePin String, createdBy String, createdAt Date"]
        ]
    },
    {
        "num": "8.7",
        "title": "Digital Pass Enrollment & Ticketing",
        "figures": [
            ("fig_8.7.1_student_enroll_catalog.png", "Figure 8.7.1 Campus Event Catalog & Discovery Feed", "The student discovery portal presents available events with chapter badges, date indicators, remaining seats, and one-click enrollment buttons."),
            ("fig_8.7.2_student_enroll_detail.png", "Figure 8.7.2 Event Pass Reservation & Contestant Registration Interface", "Event registration detail page featuring event agenda, venue location, team registration input, and seat reservation triggers."),
            ("fig_8.7.3_registration_confirmation.png", "Figure 8.7.3 Digital Event Pass Confirmation with Verification QR Token", "Confirmed digital pass ticket displaying unique ticket pass ID, student roll number, event dates, and QR check-in verification payload."),
            ("fig_8.7.4_my_registrations.png", "Figure 8.7.4 Student Enrolled Event Passes & Pass Management Portfolio", "Student registered passes console displaying active passes, venue check-in statuses, and direct PDF pass download actions.")
        ],
        "purpose": "Manages contestant enrollment, seat allocation, duplicate prevention, and the generation of tamper-evident digital event entry passes.",
        "functional": [
            ("Pass Reservation: ", "Students register for upcoming technical events and provide contestant team details."),
            ("Duplicate Prevention: ", "Compound indexing on (eventId, email) blocks duplicate enrollments by the same scholar."),
            ("Digital Pass Issuance: ", "Generates unique ticket identifiers (REG-XXXXXX-XXX) with venue check-in metadata.")
        ],
        "non_functional": [
            ("Fast Pass Generation: ", "Digital entry passes are generated in < 100ms and rendered instantly in the browser."),
            ("Compound Indexing: ", "MongoDB index ensures uniqueness and lightning-fast registration lookups.")
        ],
        "api": [
            ["GET", "/api/registrations", "Fetches registered passes filtered by authenticated student email or event ID."],
            ["POST", "/api/registrations", "Reserves entry pass for specified event, checks seating capacity, and increments registered count."]
        ],
        "db": [
            ["registrations", "PK: _id (ObjectId)\nUNIQUE: id\nMUL: eventId, email (Compound Index)", "id String, eventId String, eventTitle String, club String, eventDate String, venue String, team String, studentName String, rollNo String, email String, status String, attended Boolean, attendedAt String, checkinMethod String, timestamp Date"]
        ]
    },
    {
        "num": "8.8",
        "title": "Live Attendance & Venue PIN Verification",
        "figures": [
            ("fig_8.8.1_instructor_live_checkin.png", "Figure 8.8.1 Faculty Advisor Live Attendance Verification & 4-Digit Hall PIN Console", "Advisor attendance console displaying dynamic venue hall PIN (4821), registered contestant checklist, search filters, and one-click check-in toggle buttons.")
        ],
        "purpose": "Provides dual-mode anti-proxy attendance verification: student self-check-in via projected 4-digit venue hall PIN and advisor roster check-in.",
        "functional": [
            ("Projected Venue PIN: ", "Faculty display a rotating 4-digit PIN on auditorium projectors for verified in-person check-in."),
            ("Self PIN Verification: ", "Attendees enter the PIN in their portal to mark presence, automatically updating check-in timestamp."),
            ("Advisor Override: ", "Advisors can mark individual attendees present or absent from the roster dashboard console.")
        ],
        "non_functional": [
            ("Proxy Elimination: ", "Time-bound PIN entry prevents remote sign-ins by absent students."),
            ("Workflow Cascade: ", "Marking attendance automatically advances approved OD requests to 'EVENT_ATTENDED' state.")
        ],
        "api": [
            ["POST", "/api/registrations/self-checkin", "Validates student-submitted 4-digit venue PIN against event record and marks attendance."],
            ["POST", "/api/registrations/:id/attendance", "Faculty endpoint. Toggles attendee present/absent status with checkinMethod tag."]
        ],
        "db": [
            ["registrations", "PK: _id (ObjectId)\nMUL: eventId", "attended Boolean, attendedAt String, checkinMethod String ('Self PIN Verified', 'Advisor Marked')"]
        ]
    },
    {
        "num": "8.9",
        "title": "On-Duty (OD) Permission Requests & Scrutiny",
        "figures": [
            ("fig_8.9.1_student_permissions.png", "Figure 8.9.1 Student Academic On-Duty (OD) Leave Application Console", "Student OD request submission desk with event dropdown selection, purpose statement, department assignment, and request tracking history."),
            ("fig_8.9.2_od_requests_table.png", "Figure 8.9.2 Chief OD In-Charge Application Review & Scrutiny Interface", "Chief OD In-Charge administrative console displaying submitted leave requests, student academic credentials, review actions, and approval/rejection modals.")
        ],
        "purpose": "Digitizes the academic On-Duty (OD) leave workflow, enabling students to request attendance exemptions for co-curricular participation and allowing OD Officers to scrutinize applications.",
        "functional": [
            ("Leave Application: ", "Students submit OD requests specifying event title, dates, and academic purpose."),
            ("Scrutiny & Review: ", "OD In-Charge reviews student roll number, department, and event eligibility."),
            ("Clearance Decision: ", "Officers grant preliminary approval or reject applications with mandatory feedback remarks.")
        ],
        "non_functional": [
            ("Multi-Channel Alerts: ", "Decisions trigger automated WhatsApp, SMS, and Email dispatches to student contacts."),
            ("Role Restrictions: ", "Approval endpoints strictly enforce 'faculty_od' and 'admin' role privileges.")
        ],
        "api": [
            ["GET", "/api/permission-requests", "Fetches OD permission requests filtered by role, status, student, or chapter."],
            ["POST", "/api/permission-requests", "Submits new OD permission request for student event participation."],
            ["POST", "/api/permission-requests/:id/approve", "Faculty OD endpoint. Approves request, records remarks, and triggers alerts."],
            ["POST", "/api/permission-requests/:id/reject", "Faculty OD endpoint. Rejects request with documented institutional justification."]
        ],
        "db": [
            ["permission_requests", "PK: _id (ObjectId)\nUNIQUE: id\nFK: studentId -> students.id", "id String, studentId String, studentName String, studentEmail String, rollNo String, eventTitle String, status String ('pending', 'approved', 'rejected'), remarks String, approvedBy String, approvedAt Date, createdAt Date"]
        ]
    },
    {
        "num": "8.10",
        "title": "OD Participation Proof Verification & Inspection",
        "figures": [
            ("fig_8.10.1_od_proof_verification.png", "Figure 8.10.1 Event Completion Certificate & Participation Proof Verification Console", "Proof inspection console displaying uploaded event certificates, event photos, attendee statements, and officer verification toggles.")
        ],
        "purpose": "Enforces post-event compliance verification, requiring attendees to submit participation certificates and event photos before official OD passes can be issued.",
        "functional": [
            ("Certificate Upload: ", "Attendees upload participation certificates, presentation slides, or photos as evidence."),
            ("Document Inspection: ", "OD In-Charge inspects uploaded certificates and verifies authenticity against event rosters."),
            ("Proof Validation: ", "Officers approve or reject submitted proof, transitioning status to 'UNDER_VERIFICATION'.")
        ],
        "non_functional": [
            ("Institutional Policy: ", "Strict policy prevents OD pass issuance before physical or digital certificate verification."),
            ("Audit Logging: ", "Every verification decision logs the reviewing officer's identity and timestamp.")
        ],
        "api": [
            ["POST", "/api/permission-requests/:id/proof", "Uploads participation certificate URL, photos, and event completion summary."],
            ["POST", "/api/permission-requests/:id/verify-proof", "Faculty OD endpoint. Verifies submitted proof documents with inspection remarks."]
        ],
        "db": [
            ["permission_requests", "PK: _id (ObjectId)", "proof { certificateUrl String, photos Array, description String, verifiedAt Date, verifiedBy String, verificationRemarks String }, status String ('UNDER_VERIFICATION')"]
        ]
    },
    {
        "num": "8.11",
        "title": "Official OD Pass Registry & Academic Exemption Archive",
        "figures": [
            ("fig_8.11.1_od_records_archive.png", "Figure 8.11.1 Institutional Official OD Pass Registry & Academic Exemption Archive", "Official OD registry archive displaying sanctioned OD passes, pass numbers, student roll numbers, sanctioned leave days, and verification hashes.")
        ],
        "purpose": "Maintains an immutable archive of sanctioned On-Duty passes for institutional audit, semester attendance credit calculations, and Controller of Examinations (CoE) verification.",
        "functional": [
            ("Official Pass Issuance: ", "Generates official numbered OD passes (OD-2026-XXXX) with credited academic days."),
            ("Tamper-Proof Verification: ", "Embeds verification reference hashes and cryptographic QR code strings on each pass."),
            ("Registry Archive: ", "Provides searchable records filtered by department, status, student, and date range.")
        ],
        "non_functional": [
            ("Audit Compliance: ", "Meets university accreditation (NAAC/NBA) audit standards for co-curricular leave documentation."),
            ("Data Integrity: ", "Sanctioned OD records cannot be deleted; they serve as permanent academic attendance evidence.")
        ],
        "api": [
            ["POST", "/api/permission-requests/:id/issue-od", "Faculty OD endpoint. Issues official OD pass and creates permanent OD record."],
            ["GET", "/api/od-records", "Retrieves official sanctioned OD pass registry with multi-criteria filters."],
            ["GET", "/api/od-records/:id", "Retrieves complete verified OD pass document by pass ID or request ID."]
        ],
        "db": [
            ["od_records", "PK: _id (ObjectId)\nUNIQUE: id\nFK: requestId -> permission_requests.id", "id String, requestId String, studentId String, studentName String, rollNo String, dept String, eventName String, eventDates String, totalDaysOD Number, status String, issuedBy String, verificationReference String, qrCodeData String, issuedAt String, issuedAtTimestamp Date"]
        ]
    },
    {
        "num": "8.12",
        "title": "Chapter Student Membership Roster & Management",
        "figures": [
            ("fig_8.12.1_instructor_memberships.png", "Figure 8.12.1 Chapter Student Membership Roster & Verification Management", "Chapter membership roster console showing registered student members, roll numbers, engineering departments, attendance counts, and standing.")
        ],
        "purpose": "Manages chapter membership rosters, student affiliations, member standing, and co-curricular eligibility for technical societies.",
        "functional": [
            ("Roster Management: ", "Advisors inspect active member lists, join dates, and verification statuses across chapters."),
            ("Member Search: ", "Search students by roll number, department, year, or chapter affiliation."),
            ("Participation Tallies: ", "Tracks verified attendance counts per member for annual society awards.")
        ],
        "non_functional": [
            ("Departmental Filtering: ", "Supports instant department-level indexing for accreditation data collection."),
            ("Read SLA: ", "Roster queries load in < 50ms across thousands of student records.")
        ],
        "api": [
            ["GET", "/api/students", "Retrieves student roster with filters for dept, chapter, year, status, and search query."]
        ],
        "db": [
            ["students", "PK: _id (ObjectId)\nMUL: chapter, dept", "rollNo String, name String, dept String, year String, chapter String, verificationStatus String, attendanceCount Number"]
        ]
    },
    {
        "num": "8.13",
        "title": "Collegiate Hall of Fame & Achievements Feed",
        "figures": [
            ("fig_8.13.1_student_achievements.png", "Figure 8.13.1 Collegiate Hall of Fame & Competitive Achievements Feed", "Achievements feed celebrating hackathon champions, symposium winners, and paper publication laurels with prize cash amounts and badges.")
        ],
        "purpose": "Celebrates student co-curricular triumphs, indexing competition victories, project awards, and hackathon laurels in a centralized institutional hall of fame.",
        "functional": [
            ("Achievement Publishing: ", "Advisors post competitive laurels, hackathon victories, and symposium prize winners."),
            ("Winner Notification: ", "Automated workflow dispatches congratulatory alerts to winners across WhatsApp and Email."),
            ("Hall of Fame Showcase: ", "Public feed highlighting outstanding student performers and chapter achievements.")
        ],
        "non_functional": [
            ("Rich Media Delivery: ", "Achievement banners and winner badges load through optimized responsive assets."),
            ("Audit Trail: ", "Announcements are recorded in the security audit log.")
        ],
        "api": [
            ["POST", "/api/notifications/workflow/winner", "Dispatches congratulatory alerts to event winners and logs announcements."]
        ],
        "db": [
            ["events", "PK: _id (ObjectId)", "title String, winners Array, club String, date String"],
            ["notification_logs", "PK: _id (ObjectId)", "recipientEmail String, channel String, title String, message String, type String ('winner_announcement')"]
        ]
    },
    {
        "num": "8.14",
        "title": "Post-Event Student Feedback & Ratings Console",
        "figures": [
            ("fig_8.14.1_student_feedback.png", "Figure 8.14.1 Post-Event Student Feedback & Ratings Console", "Student feedback console with interactive 5-star rating inputs, qualitative critique text areas, and historical review submissions.")
        ],
        "purpose": "Collects structured post-event student feedback, ratings, and qualitative suggestions to guide future chapter event improvements.",
        "functional": [
            ("Star Ratings: ", "Attendees rate event content, venue facilities, and speaker engagement on a 5-star scale."),
            ("Written Reviews: ", "Captures qualitative feedback and constructive recommendations for chapter conveners."),
            ("Review History: ", "Students view past submissions and advisor responses.")
        ],
        "non_functional": [
            ("Rating Validation: ", "Ensures rating bounds between 1 and 5 stars; text feedback sanitized against XSS."),
            ("Feedback Anonymity: ", "Preserves student candor while maintaining verified attendance validation.")
        ],
        "api": [
            ["GET", "/api/events", "Fetches completed events eligible for student feedback submission."]
        ],
        "db": [
            ["registrations", "PK: _id (ObjectId)", "id String, eventId String, email String, attended Boolean"]
        ]
    },
    {
        "num": "8.15",
        "title": "Multi-Linker Unified Campus Portals Hub",
        "figures": [
            ("fig_8.15.1_campus_links.png", "Figure 8.15.1 Multi-Linker Unified Campus Portals & Academic Resources Hub", "Centralized campus resource launcher displaying categorized cards for LMS courseware, GitHub repos, hackathon portals, CoE hall tickets, and IEEE Xplore.")
        ],
        "purpose": "Consolidates dispersed university portals, LMS courseware, national competition repositories, CoE portals, and IEEE research libraries into a unified single-click launcher.",
        "functional": [
            ("Categorized Directory: ", "Catalogs resource portals under Academic & LMS, Club Repositories, Hackathons, and Institutional Portals."),
            ("Resource Curation: ", "Authorized faculty and administrators add, update, and manage official campus resource links."),
            ("Direct Navigation: ", "Students launch target resources with verified destination URLs and guidance descriptions.")
        ],
        "non_functional": [
            ("URL Validation: ", "Enforces strict HTTPS URL syntax validation to prevent phishing link insertion."),
            ("Zero Latency: ", "Client-side categorized filtering delivers instant instantaneous search across campus links.")
        ],
        "api": [
            ["GET", "/api/links", "Retrieves active campus resource links with search and category filters."],
            ["POST", "/api/links", "Adds new campus portal resource with title, URL, category, and icon."],
            ["PUT", "/api/links/:id", "Updates campus link details, description, or official status."],
            ["DELETE", "/api/links/:id", "Removes link resource from the campus launcher directory."]
        ],
        "db": [
            ["campus_links", "PK: _id (ObjectId)\nUNIQUE: id", "id String, title String, url String, category String, description String, icon String, createdBy String, isOfficial Boolean, createdAt Date"]
        ]
    },
    {
        "num": "8.16",
        "title": "Multi-Channel Notification Dispatches (WhatsApp, SMS, Email)",
        "figures": [
            ("fig_8.16.1_whatsapp_dispatch.png", "Figure 8.16.1 WhatsApp Direct Alert Notification & Click-to-Chat Interface", "Multi-channel notification console displaying dispatched WhatsApp alert cards, student mobile contact, verified delivery provider status, and direct WhatsApp Web click-to-chat triggers."),
            ("fig_8.16.2_sms_gateway.png", "Figure 8.16.2 SMS Alert Gateway Notification Payload & Transmission Console", "Cellular SMS dispatch interface presenting character-counted text alert payloads, student cellular phone targets, carrier gateway statuses, and device messenger compose triggers."),
            ("fig_8.16.3_email_notification.png", "Figure 8.16.3 Official Institutional Email Pass Notification & Dispatch View", "Formal SMTP institutional email notification delivery view containing structured event credentials, sanctioned On-Duty leave days, official pass tokens, and webmail action links.")
        ],
        "purpose": "Coordinates automated transactional transmissions across direct WhatsApp API links, SMS gateways, and SMTP email services for event registrations, OD approvals, and laurels.",
        "functional": [
            ("WhatsApp Direct Links: ", "Constructs pre-encoded WhatsApp API URLs for one-click mobile dispatch with official OD pass headers."),
            ("SMS Alert Gateway: ", "Formats concise SMS alert payloads containing critical pass codes and check-in times."),
            ("Email Notification Delivery: ", "Sends comprehensive formal email notices containing complete academic exemption details."),
            ("Dispatch Audit Log: ", "Records all outgoing transmissions in the notification_dispatches collection with delivery status.")
        ],
        "non_functional": [
            ("Multi-Channel Redundancy: ", "Ensures students receive critical OD clearances across multiple devices simultaneously."),
            ("Template Integrity: ", "Uses standardized institutional message templates with tamper-evident pass tokens.")
        ],
        "api": [
            ["GET", "/api/notifications", "Retrieves notification dispatch history filtered by recipient email address."],
            ["POST", "/api/notifications/dispatch", "Logs and dispatches transactional notification across selected communication channel."],
            ["POST", "/api/notifications/direct-links", "Generates pre-filled WhatsApp and Gmail compose links for student communications."],
            ["POST", "/api/notifications/workflow/od", "Executes multi-channel alert dispatch workflow upon OD request approval or rejection."]
        ],
        "db": [
            ["notification_logs", "PK: _id (ObjectId)\nUNIQUE: id\nMUL: recipientEmail\n(Saved to notification_dispatches in DB)", "id String, recipientEmail String, recipientPhone String, channel String ('email', 'whatsapp', 'sms'), type String, title String, message String, status String, timestamp Date"]
        ]
    },
    {
        "num": "8.17",
        "title": "Security Audit Logging & Compliance",
        "figures": [],
        "purpose": "Provides an immutable, tamper-evident security audit trail recording every administrative state change, event modification, user registration, and OD clearance.",
        "functional": [
            ("Event Logging: ", "Captures timestamped audit entries for EVENT_CREATED, ATTENDANCE_RECORDED, OD_PASS_ISSUED, and SETTINGS_UPDATED."),
            ("Actor Attribution: ", "Records the acting user's email address and role alongside contextual action narratives."),
            ("Administrative Inspection: ", "Super administrators inspect audit logs for institutional accreditation audits.")
        ],
        "non_functional": [
            ("Append-Only Integrity: ", "Audit logs are strictly append-only; database operations cannot mutate historical entries."),
            ("ISO-8601 Timestamps: ", "All audit events use UTC ISO-8601 timestamps for forensic traceability.")
        ],
        "api": [
            ["GET", "/api/audit-logs", "Admin endpoint. Retrieves paginated security audit log entries with action narratives."]
        ],
        "db": [
            ["audit_logs", "PK: _id (ObjectId)\nUNIQUE: id\nMUL: user", "id String, action String, user String, details String, timestamp Date"]
        ]
    },
    {
        "num": "8.18",
        "title": "Institutional System Settings & Email Domain Security",
        "figures": [
            ("fig_8.18.1_system_settings.png", "Figure 8.18.1 Institutional System Settings & Email Domain Security Configuration", "Administrative system configuration panel with institution name banner, enforced allowed email domain (@college.edu), domain verification toggle, and registration gates.")
        ],
        "purpose": "Enforces global security policies, configurable institutional email domain restrictions, and administrative academic calendar year controls.",
        "functional": [
            ("Domain Whitelisting: ", "Restricts student registrations strictly to verified institutional email addresses (@college.edu)."),
            ("Registration Gate: ", "Enables administrators to temporarily close self-service registration during examination periods."),
            ("Academic Year Control: ", "Configures active calendar year for co-curricular record archiving.")
        ],
        "non_functional": [
            ("Singleton Pattern: ", "System settings are stored as a singleton document ensuring unified global state."),
            ("Immediate Enforcement: ", "Domain rule changes take effect immediately across all active registration handlers.")
        ],
        "api": [
            ["GET", "/api/settings/system", "Retrieves active institutional system configuration settings."],
            ["PUT", "/api/settings/system", "Admin endpoint. Updates allowed email domain, domain check toggle, and academic year."],
            ["GET", "/api/auth/config", "Public endpoint. Returns current allowed email domain for frontend registration validation."]
        ],
        "db": [
            ["system_settings", "PK: _id (ObjectId)\nUNIQUE: key", "key String ('config'), institutionName String, allowedEmailDomain String, requireEmailDomainCheck Boolean, allowRegistration Boolean, academicYear String"]
        ]
    },
    {
        "num": "8.19",
        "title": "Institutional Reporting & Analytics Dashboard",
        "figures": [
            ("fig_8.19.1_od_analytics.png", "Figure 8.19.1 Departmental OD Distribution Analytics & Trend Charts", "OD analytics dashboard illustrating department-wise On-Duty sanction distributions, monthly trend metrics, and verification completion ratios."),
            ("fig_8.19.2_admin_dashboard.png", "Figure 8.19.2 Super Admin Executive Control Center & Campus Metrics Overview", "Executive administration overview presenting total scheduled events, active student enrollments, accredited chapters, and pending approval queues."),
            ("fig_8.19.3_student_history.png", "Figure 8.19.3 Student Co-Curricular Transcript & Verified Attendance History", "Student participation history console displaying verified event attendance transcripts, earned achievement badges, and exportable records.")
        ],
        "purpose": "Generates dynamic real-time participation analytics, department-wise On-Duty distribution charts, executive governance KPI cards, and exportable participation transcripts.",
        "functional": [
            ("Executive KPI Cards: ", "Displays real-time counts for active events, registered students, chartered chapters, and pending OD waivers."),
            ("Departmental Distribution: ", "Aggregates OD leave requests by engineering department for academic council review."),
            ("Participation Transcripts: ", "Compiles verified student co-curricular event attendance history for placement resumes.")
        ],
        "non_functional": [
            ("Sub-Second Aggregation: ", "In-memory database pipelines calculate analytics summaries in < 15ms."),
            ("Export Streaming: ", "Supports client-side CSV and PDF export streaming without server CPU locks.")
        ],
        "api": [
            ["GET", "/api/stats", "Calculates real-time institutional KPIs: totalEvents, upcomingEvents, totalStudents, activeChapters, pendingODRequests, approvedODRequests."],
            ["GET", "/api/events", "Returns event listings with participation counts for accreditation reports."],
            ["GET", "/api/od-records", "Returns sanctioned OD records for Controller of Examinations (CoE) audit compilation."]
        ],
        "db": [
            ["events", "PK: _id (ObjectId)", "registered Number, capacity Number, status String"],
            ["students", "PK: _id (ObjectId)", "attendanceCount Number, dept String"],
            ["od_records", "PK: _id (ObjectId)", "dept String, totalDaysOD Number, status String"]
        ]
    }
]
