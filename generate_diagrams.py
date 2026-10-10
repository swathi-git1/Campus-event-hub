import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

FIGURES_DIR = 'Campus_Event_Hub_Report/figures'
os.makedirs(FIGURES_DIR, exist_ok=True)

def draw_flow_diagram(title, boxes, filename):
    fig, ax = plt.subplots(figsize=(8.5, 6.2), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    n = len(boxes)
    box_w = 70
    box_h = 10
    start_x = 15
    y_step = 82 / n
    
    colors = [
        ('#E6F0FA', '#3B82F6'),  # Blue
        ('#ECE6FA', '#8B5CF6'),  # Purple
        ('#FEF8E6', '#F59E0B'),  # Amber
        ('#E8F8EE', '#10B981'),  # Emerald
        ('#FCE8EF', '#EC4899'),  # Pink
        ('#EDF0F5', '#64748B')   # Slate
    ]
    
    for i, (b_title, b_sub) in enumerate(boxes):
        y = 90 - (i * y_step) - box_h
        bg_col, border_col = colors[i % len(colors)]
        
        # Rounded rectangle
        rect = patches.FancyBboxPatch(
            (start_x, y), box_w, box_h,
            boxstyle="round,pad=0.8,rounding_size=1.5",
            linewidth=1.5, edgecolor=border_col, facecolor=bg_col
        )
        ax.add_patch(rect)
        
        # Text
        ax.text(start_x + 3, y + box_h - 3.2, b_title, fontsize=10.5, fontweight='bold', color='#1E293B', va='top')
        ax.text(start_x + 3, y + box_h - 6.8, b_sub, fontsize=8.2, color='#475569', va='top')
        
        # Arrow to next box
        if i < n - 1:
            arrow_y_start = y
            arrow_y_end = 90 - ((i + 1) * y_step)
            ax.annotate('', xy=(start_x + box_w / 2, arrow_y_end), xytext=(start_x + box_w / 2, arrow_y_start),
                        arrowprops=dict(facecolor='#1E293B', edgecolor='#1E293B', width=1.2, headwidth=6, headlength=6))
            
    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, filename), bbox_inches='tight', dpi=200)
    plt.close()
    print(f'Generated {filename}')

# 1. Fig 8.0: Overall Request Flow
draw_flow_diagram(
    "Overall Request Flow",
    [
        ("Client (React Single-Page Application)", "React 18.2 + React Router v6 | Context API (Auth, Data, Theme, Toast) | Role-Based Dashboards"),
        ("HTTP API Layer (Fetch / Axios + JWT)", "apiClient.js | Authorization: Bearer <JWT Token> | 401 Unauthorized Interceptor -> /login"),
        ("Express Middleware Pipeline", "Helmet (Security Headers), CORS whitelist, JSON body parser, rateLimiter.js, auth.js (JWT validation)"),
        ("API Controllers & Route Handlers", "apiRouter.js | auth.js, assistant.js (Gemini AI), db.js (CRUD controllers for events, clubs, registrations, OD)"),
        ("Data Models & Integrity Layer", "In-memory models with transactional integrity | Mongo Connection abstraction | System settings"),
        ("Persistent Database Storage", "MongoDB collections (users, events, clubs, registrations, od_records, audit_logs) & seed snapshots")
    ],
    "fig_8.0_overall_flow.png"
)

# 2. Fig 8.2.A: Low-level architecture - Auth
draw_flow_diagram(
    "Low-level architecture - User Auth & Access Control",
    [
        ("Client (React)", "Login.jsx | Register.jsx | GoogleAccountChooser.jsx | ProtectedRoute.jsx (Role verification)"),
        ("HTTP (Fetch + JWT)", "POST /api/auth/login | POST /api/auth/register | POST /api/auth/reset-password | Bearer Token Storage"),
        ("Express Middleware", "rateLimiter.js (15 attempts/15m) | auth.js (verifyToken, extractUserRole, requireRole)"),
        ("Controllers", "auth.js: loginHandler, registerHandler, verifySession, resetPasswordHandler, changePassword"),
        ("Models", "User Schema (name, email, passwordHash, passwordSalt, role, preferences, isActive)"),
        ("Database Tables", "Users collection | Password_Reset_Tokens Map | Audit_Logs")
    ],
    "fig_8.2.A_auth_arch.png"
)

# 3. Fig 8.3.A: Low-level architecture - Campus Club & Advisor Management
draw_flow_diagram(
    "Low-level architecture - Campus Club & Advisor Management",
    [
        ("Client (React)", "Clubs.jsx | ClubProfile.jsx | PendingClubs.jsx | InstructorProfile.jsx | SearchInput | FilterBar"),
        ("HTTP (Fetch + JWT)", "GET /api/clubs | POST /api/clubs | PUT /api/clubs/:id | GET /api/instructors | GET /api/stats"),
        ("Express Middleware", "auth.js (JWT verify + role check: Admin for creation, Instructor for assigned club updates)"),
        ("Controllers", "apiRouter.js: getClubs, getClubById, createClub, updateClub, getInstructors, allocateAdvisor"),
        ("Models", "Club Schema (code, name, category, leadAdvisorId, meetingVenue, memberCount, status)"),
        ("Database Tables", "Clubs collection | Instructors collection | Chapters collection")
    ],
    "fig_8.3.A_club_arch.png"
)

# 4. Fig 8.4.A: Low-level architecture - Event Lifecycle & Scheduling
draw_flow_diagram(
    "Low-level architecture - Event Lifecycle & Scheduling",
    [
        ("Client (React)", "ManageEvents.jsx | EventDetail.jsx | Home.jsx | FilterBar | AddEventModal | ScheduleCalendar"),
        ("HTTP (Fetch + JWT)", "GET /api/events | POST /api/events | PUT /api/events/:id | DELETE /api/events/:id | Scoped Club queries"),
        ("Express Middleware", "auth.js (JWT validation, verify assigned club ownership for instructor, admin override)"),
        ("Controllers", "apiRouter.js: getEvents, createEvent, updateEvent, deleteEvent, getEventById, generateVenuePIN"),
        ("Models", "Event Schema (title, clubId, date, time, venue, category, accessLevel, capacity, venuePin, status)"),
        ("Database Tables", "Events collection | Clubs collection | Audit_Logs")
    ],
    "fig_8.4.A_event_arch.png"
)

# 5. Fig 8.5.A: Low-level architecture - Student Membership
draw_flow_diagram(
    "Low-level architecture - Student Chapter Membership",
    [
        ("Client (React)", "ManageMemberships.jsx | Clubs.jsx (Join Chapter Modal) | AdminPermissions.jsx | MemberFilter"),
        ("HTTP (Fetch + JWT)", "GET /api/memberships | POST /api/memberships/apply | PATCH /api/memberships/:id/status"),
        ("Express Middleware", "auth.js (JWT auth, verify instructor assigned to target club or admin authorization)"),
        ("Controllers", "apiRouter.js: getMembershipsByClub, applyMembership, updateMembershipStatus, verifyStudentEligibility"),
        ("Models", "Student Schema (rollNo, dept, year, chapter, verificationStatus, attendanceCount)"),
        ("Database Tables", "Students collection | Clubs collection | Users collection")
    ],
    "fig_8.5.A_membership_arch.png"
)

# 6. Fig 8.6.A: Low-level architecture - Event Registration & Pass Issuance
draw_flow_diagram(
    "Low-level architecture - Event Registration & Pass Issuance",
    [
        ("Client (React)", "Enroll.jsx | Confirmation.jsx | MyRegistrations.jsx | PassQRModal | PassCard"),
        ("HTTP (Fetch + JWT)", "POST /api/events/:id/register | GET /api/registrations/my | GET /api/registrations/:ticketId"),
        ("Express Middleware", "auth.js (verify student role, validate college domain, prevent duplicate registrations)"),
        ("Controllers", "apiRouter.js: registerEvent, getMyRegistrations, validateEligibility, generatePasscodeTicket"),
        ("Models", "Registration Schema (ticketId, eventId, studentEmail, studentName, rollNo, registeredAt, status)"),
        ("Database Tables", "Registrations collection | Events collection (enrolledCount increment) | Audit_Logs")
    ],
    "fig_8.6.A_registration_arch.png"
)

# 7. Fig 8.7.A: Low-level architecture - Live Attendance Desk & PIN Check-in
draw_flow_diagram(
    "Low-level architecture - Live Attendance Desk & Venue PIN Verification",
    [
        ("Client (React)", "CheckIn.jsx (Instructor Console) | MyRegistrations.jsx (Self PIN Check-in) | AttendanceRoster"),
        ("HTTP (Fetch + JWT)", "GET /api/events/:id/attendees | POST /api/attendance/check-in-pin | PATCH /api/attendance/:regId"),
        ("Express Middleware", "auth.js (verify attendee ownership for self-check-in, advisor ownership for roster toggle)"),
        ("Controllers", "apiRouter.js: getEventRoster, verifyVenuePINCheckIn, updateAttendeeStatus, calculateAttendancePct"),
        ("Models", "Registration Schema (status: 'present'/'absent', checkInTime, verificationMethod: 'PIN'/'Desk')"),
        ("Database Tables", "Registrations collection | Students collection (attendanceCount++) | Events collection")
    ],
    "fig_8.7.A_attendance_arch.png"
)

# 8. Fig 8.8.A: Low-level architecture - On-Duty (OD) Permission Workflow
draw_flow_diagram(
    "Low-level architecture - On-Duty (OD) Permission Workflow",
    [
        ("Client (React)", "StudentPermissions.jsx | ODRequests.jsx | ODProofVerification.jsx | ODRecordsArchive.jsx"),
        ("HTTP (Fetch + JWT)", "POST /api/od/request | GET /api/od/requests | PATCH /api/od/:id/status | GET /api/od/archive"),
        ("Express Middleware", "auth.js (verify role: student for submission, faculty advisor & OD Incharge for sanction)"),
        ("Controllers", "apiRouter.js: submitODRequest, getPendingODRequests, verifyODProof, sanctionODRecord, exportODArchive"),
        ("Models", "PermissionRequest & ODRecord Schema (studentEmail, rollNo, eventId, date, proofUrl, status, comments)"),
        ("Database Tables", "Permission_Requests collection | OD_Records collection | Audit_Logs")
    ],
    "fig_8.8.A_od_arch.png"
)

# 9. Fig 8.9.A: Low-level architecture - Executive Dashboard & Analytics
draw_flow_diagram(
    "Low-level architecture - Executive Dashboard & Analytics",
    [
        ("Client (React)", "Admin Dashboard.jsx | ODAnalytics.jsx | ParticipationHistory.jsx | tableExport.js (CSV/PDF)"),
        ("HTTP (Fetch + JWT)", "GET /api/admin/metrics | GET /api/analytics/clubs | GET /api/analytics/od | GET /api/reports/export"),
        ("Express Middleware", "auth.js (JWT auth, role-based access for aggregated campus-wide statistics)"),
        ("Controllers", "apiRouter.js: getCampusMetrics, getClubAnalytics, getODAnalytics, generateConsolidatedReport"),
        ("Models", "Aggregated analytical queries across Events, Registrations, Clubs, and OD collections"),
        ("Database Tables", "Events, Registrations, Clubs, OD_Records, Audit_Logs, System_Settings")
    ],
    "fig_8.9.A_analytics_arch.png"
)

# Generate Class Diagram (Chapter 4)
def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=220)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    classes = [
        # (x, y, w, h, name, stereotype, [attrs], [methods])
        (5, 62, 26, 32, "User", "«entity»",
         ["+ id : String [PK]", "+ name : String", "+ email : String [UK]", "+ passwordHash : String", "+ passwordSalt : String", "+ role : String", "+ isActive : Boolean", "+ preferences : JSON"],
         ["+ authenticate(pwd) : bool", "+ updateProfile(data) : void", "+ changePassword(n) : void"]),
        
        (37, 62, 26, 32, "Instructor", "«entity»",
         ["+ id : String [PK]", "+ employeeId : String [UK]", "+ designation : String", "+ dept : String", "+ assignedClub : String [FK]", "+ officeRoom : String", "+ officeHours : String", "+ phone : String"],
         ["+ manageClubEvents() : List", "+ reviewMemberships() : void", "+ projectVenuePIN() : String", "+ toggleAttendance() : void"]),
         
        (69, 62, 26, 32, "Club", "«entity»",
         ["+ id : String [PK]", "+ code : String [UK]", "+ name : String", "+ category : String", "+ leadAdvisorId : String [FK]", "+ meetingVenue : String", "+ memberCount : Integer", "+ status : String"],
         ["+ addMember(studentId) : void", "+ publishEvent(event) : void", "+ postAchievement() : void"]),

        (5, 12, 26, 36, "Student", "«entity»",
         ["+ id : String [PK]", "+ rollNo : String [UK]", "+ name : String", "+ email : String [FK]", "+ dept : String", "+ degree : String", "+ year : String", "+ chapter : String [FK]", "+ attendanceCount : Int"],
         ["+ registerEvent(evtId) : Ticket", "+ submitPIN(pin) : bool", "+ applyChapter(club) : void", "+ requestOD(evtId) : void"]),

        (37, 12, 26, 36, "Event", "«entity»",
         ["+ id : String [PK]", "+ title : String", "+ clubId : String [FK]", "+ date : Date", "+ time : String", "+ venue : String", "+ category : String", "+ accessLevel : String", "+ capacity : Integer", "+ venuePin : String (4-digit)", "+ status : String"],
         ["+ isRegistrationOpen() : bool", "+ verifyPIN(pin) : bool", "+ getAttendeeList() : List", "+ exportRoster(fmt) : File"]),

        (69, 12, 26, 36, "Registration", "«entity»",
         ["+ id : String [PK]", "+ ticketId : String [UK]", "+ eventId : String [FK]", "+ studentEmail : String [FK]", "+ studentName : String", "+ rollNo : String", "+ registeredAt : DateTime", "+ status : String", "+ checkInTime : DateTime", "+ verificationMethod : String"],
         ["+ markPresent(method) : void", "+ generatePass() : PDF", "+ isEligibleCert() : bool"])
    ]

    for x, y, w, h, name, stereo, attrs, methods in classes:
        # Outer box
        rect = patches.Rectangle((x, y), w, h, linewidth=1.2, edgecolor='#0F172A', facecolor='#FFFFFF')
        ax.add_patch(rect)
        
        # Header box
        header_h = 7
        h_rect = patches.Rectangle((x, y + h - header_h), w, header_h, linewidth=1.2, edgecolor='#0F172A', facecolor='#F1F5F9')
        ax.add_patch(h_rect)
        ax.text(x + w/2, y + h - 2.2, stereo, fontsize=7, color='#475569', ha='center', va='center')
        ax.text(x + w/2, y + h - 5.0, name, fontsize=9.5, fontweight='bold', color='#0F172A', ha='center', va='center')
        
        # Attributes
        curr_y = y + h - header_h - 2
        for attr in attrs:
            ax.text(x + 1.2, curr_y, attr, fontsize=6.8, color='#1E293B', va='top', family='monospace')
            curr_y -= 2.6
            
        # Divider line
        div_y = y + 10.5
        ax.plot([x, x + w], [div_y, div_y], color='#0F172A', linewidth=0.8)
        
        # Methods
        curr_y = div_y - 1.5
        for meth in methods:
            ax.text(x + 1.2, curr_y, meth, fontsize=6.8, color='#0F172A', va='top', family='monospace')
            curr_y -= 2.5

    # Relationships Lines
    # User -> Student
    ax.annotate('', xy=(18, 48), xytext=(18, 62), arrowprops=dict(arrowstyle="->", color='#0F172A', lw=1.2))
    ax.text(19, 54, 'specializes 1:1', fontsize=7, color='#334155')

    # Instructor -> Club
    ax.plot([63, 69], [78, 78], color='#0F172A', lw=1.2)
    ax.text(64, 79, '1 : 1', fontsize=7, color='#334155')

    # Club -> Event
    ax.annotate('', xy=(50, 48), xytext=(72, 62), arrowprops=dict(arrowstyle="->", color='#0F172A', lw=1.2))
    ax.text(61, 56, 'organizes 1 : N', fontsize=7, color='#334155')

    # Student -> Registration
    ax.plot([31, 69], [22, 22], color='#0F172A', lw=1.2)
    ax.text(48, 23, 'registers 1 : N', fontsize=7, color='#334155')

    # Event -> Registration
    ax.plot([63, 69], [30, 30], color='#0F172A', lw=1.2)
    ax.text(64, 31, '1 : N', fontsize=7, color='#334155')

    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, "class_diagram.png"), bbox_inches='tight', dpi=220)
    plt.close()
    print('Generated class_diagram.png')

generate_class_diagram()

# Generate ER Diagram (Chapter 6)
def generate_er_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=220)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    tables = [
        # (x, y, w, h, table_name, [(key_type, col_name, data_type)])
        (5, 58, 26, 36, "USERS", [
            ("PK", "id", "VARCHAR(36)"),
            ("UK", "email", "VARCHAR(150)"),
            (" ", "name", "VARCHAR(150)"),
            (" ", "passwordHash", "VARCHAR(255)"),
            (" ", "passwordSalt", "VARCHAR(64)"),
            (" ", "role", "ENUM(5)"),
            (" ", "isActive", "BOOLEAN"),
            (" ", "createdAt", "DATETIME")
        ]),
        (37, 58, 26, 36, "CLUBS", [
            ("PK", "id", "VARCHAR(36)"),
            ("UK", "code", "VARCHAR(30)"),
            (" ", "name", "VARCHAR(150)"),
            (" ", "category", "VARCHAR(50)"),
            ("FK", "leadAdvisorId", "VARCHAR(36)"),
            (" ", "meetingVenue", "VARCHAR(100)"),
            (" ", "memberCount", "INT"),
            (" ", "status", "VARCHAR(30)")
        ]),
        (69, 58, 26, 36, "INSTRUCTORS", [
            ("PK", "id", "VARCHAR(36)"),
            ("UK", "employeeId", "VARCHAR(50)"),
            ("FK", "email", "VARCHAR(150)"),
            (" ", "designation", "VARCHAR(100)"),
            (" ", "dept", "VARCHAR(100)"),
            ("FK", "assignedClub", "VARCHAR(36)"),
            (" ", "officeRoom", "VARCHAR(50)"),
            (" ", "phone", "VARCHAR(20)")
        ]),
        (5, 10, 26, 38, "STUDENTS", [
            ("PK", "id", "VARCHAR(36)"),
            ("UK", "rollNo", "VARCHAR(30)"),
            ("FK", "email", "VARCHAR(150)"),
            (" ", "dept", "VARCHAR(100)"),
            (" ", "degree", "VARCHAR(50)"),
            (" ", "year", "VARCHAR(20)"),
            ("FK", "chapter", "VARCHAR(30)"),
            (" ", "verificationStatus", "VARCHAR(30)"),
            (" ", "attendanceCount", "INT")
        ]),
        (37, 10, 26, 38, "EVENTS", [
            ("PK", "id", "VARCHAR(36)"),
            (" ", "title", "VARCHAR(200)"),
            ("FK", "clubId", "VARCHAR(36)"),
            (" ", "date", "DATE"),
            (" ", "time", "VARCHAR(50)"),
            (" ", "venue", "VARCHAR(100)"),
            (" ", "accessLevel", "VARCHAR(30)"),
            (" ", "capacity", "INT"),
            (" ", "venuePin", "VARCHAR(4)"),
            (" ", "status", "VARCHAR(30)")
        ]),
        (69, 10, 26, 38, "REGISTRATIONS", [
            ("PK", "id", "VARCHAR(36)"),
            ("UK", "ticketId", "VARCHAR(50)"),
            ("FK", "eventId", "VARCHAR(36)"),
            ("FK", "studentEmail", "VARCHAR(150)"),
            (" ", "studentName", "VARCHAR(150)"),
            (" ", "rollNo", "VARCHAR(30)"),
            (" ", "registeredAt", "DATETIME"),
            (" ", "status", "VARCHAR(30)"),
            (" ", "checkInTime", "DATETIME"),
            (" ", "verificationMethod", "VARCHAR(30)")
        ])
    ]

    for x, y, w, h, t_name, cols in tables:
        # Table Box
        rect = patches.Rectangle((x, y), w, h, linewidth=1.2, edgecolor='#1E293B', facecolor='#FFFFFF')
        ax.add_patch(rect)
        
        # Header
        h_rect = patches.Rectangle((x, y + h - 6), w, 6, linewidth=1.2, edgecolor='#1E293B', facecolor='#D9E2F3')
        ax.add_patch(h_rect)
        ax.text(x + w/2, y + h - 3.8, t_name, fontsize=9.5, fontweight='bold', color='#0F172A', ha='center', va='center')
        
        # Columns
        curr_y = y + h - 8
        for k_type, col, d_type in cols:
            k_color = '#DC2626' if k_type == 'PK' else ('#2563EB' if k_type == 'FK' else ('#D97706' if k_type == 'UK' else '#64748B'))
            ax.text(x + 1.2, curr_y, k_type, fontsize=6.5, fontweight='bold', color=k_color, va='top', family='monospace')
            ax.text(x + 5.5, curr_y, col, fontsize=6.8, color='#0F172A', va='top', family='monospace')
            ax.text(x + w - 1.2, curr_y, d_type, fontsize=6.5, color='#475569', va='top', ha='right', family='monospace')
            curr_y -= 3.2

    # Relationship connectors
    # USERS -> STUDENTS
    ax.annotate('', xy=(18, 48), xytext=(18, 58), arrowprops=dict(arrowstyle="->", color='#0F172A', lw=1.2))
    ax.text(19, 53, '1 : 1', fontsize=7.5, color='#334155', fontweight='bold')

    # CLUBS -> INSTRUCTORS
    ax.plot([63, 69], [76, 76], color='#0F172A', lw=1.2)
    ax.text(64.5, 77.5, '1 : 1', fontsize=7.5, color='#334155', fontweight='bold')

    # CLUBS -> EVENTS
    ax.annotate('', xy=(50, 48), xytext=(50, 58), arrowprops=dict(arrowstyle="->", color='#0F172A', lw=1.2))
    ax.text(51, 53, '1 : N', fontsize=7.5, color='#334155', fontweight='bold')

    # EVENTS -> REGISTRATIONS
    ax.plot([63, 69], [28, 28], color='#0F172A', lw=1.2)
    ax.text(64.5, 29.5, '1 : N', fontsize=7.5, color='#334155', fontweight='bold')

    # STUDENTS -> REGISTRATIONS
    ax.plot([31, 69], [18, 18], color='#0F172A', lw=1.2)
    ax.text(48, 19.5, '1 : N', fontsize=7.5, color='#334155', fontweight='bold')

    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, "er_diagram.png"), bbox_inches='tight', dpi=220)
    plt.close()
    print('Generated er_diagram.png')

generate_er_diagram()

# Generate Folder Tree Visuals (8.1)
def generate_folder_tree_graphic(title, lines, filename):
    fig, ax = plt.subplots(figsize=(7.5, 5.0), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    rect = patches.FancyBboxPatch((4, 4), 92, 92, boxstyle="round,pad=1.0,rounding_size=2.0",
                                  linewidth=1.2, edgecolor='#CBD5E1', facecolor='#F8FAFC')
    ax.add_patch(rect)

    # Header bar
    h_bar = patches.Rectangle((4, 86), 92, 10, linewidth=1.2, edgecolor='#CBD5E1', facecolor='#E2E8F0')
    ax.add_patch(h_bar)
    ax.text(8, 91, title, fontsize=9.5, fontweight='bold', color='#1E293B', va='center')

    curr_y = 80
    for line in lines:
        is_dir = line.endswith('/') or line.startswith('📁') or 'folder' in line.lower()
        col = '#1E3A8A' if is_dir else '#334155'
        weight = 'bold' if is_dir else 'normal'
        ax.text(8, curr_y, line, fontsize=8.0, color=col, fontweight=weight, family='monospace', va='top')
        curr_y -= 4.6

    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, filename), bbox_inches='tight', dpi=200)
    plt.close()
    print(f'Generated {filename}')

generate_folder_tree_graphic(
    "Campus Event Hub - Project Root Structure",
    [
        "campus-event-hub-final/",
        "  ├── server/                     [Standalone Express/Node.js API & MongoDB]",
        "  ├── src/                        [React 18 Single-Page Application]",
        "  │   ├── components/             [Modular Reusable UI Components]",
        "  │   ├── context/                [Centralized State Contexts]",
        "  │   ├── data/                   [Seed Mock Data & Analytics Records]",
        "  │   ├── layouts/                [DashboardLayout & Navigation Shell]",
        "  │   ├── pages/                  [Role-Scoped Page Routes]",
        "  │   └── utils/                  [Access Control, API Client, Exporters]",
        "  ├── public/                     [Static Assets & Club Logos]",
        "  ├── Dockerfile & nginx.conf     [Production Containerization]",
        "  ├── package.json & vite.config  [Build & Dev Bundler Configuration]",
        "  └── START-APP.bat               [1-Click Local Application Launcher]"
    ],
    "fig_8.1.1_highlevel_project.png"
)

generate_folder_tree_graphic(
    "Campus Event Hub - Backend (server/) Structure",
    [
        "server/",
        "  ├── apiRouter.js                [REST API Endpoints & Request Dispatcher]",
        "  ├── auth.js                     [JWT Token Lifecycle & Password Hashing]",
        "  ├── db.js                       [In-Memory Collections & MongoDB Sync Layer]",
        "  ├── mongoConnection.js          [MongoDB Driver & Reconnection Protocol]",
        "  ├── notificationService.js      [Email & Alert Broadcast Engine]",
        "  ├── rateLimiter.js              [IP Request Throttling Middleware]",
        "  ├── assistant.js                [Gemini AI Assistant Integration]",
        "  ├── vitePlugin.js               [Vite Development Server API Bridge]",
        "  ├── index.js                    [HTTP Server Entry Point (Port 5000)]",
        "  └── Dockerfile                  [Node.js Runtime Container Definition]"
    ],
    "fig_8.1.2_backend_folder.png"
)

generate_folder_tree_graphic(
    "Campus Event Hub - Frontend (src/) Structure",
    [
        "src/",
        "  ├── components/                 [Navbar, Sidebar, FilterBar, Modals]",
        "  ├── context/                    [AuthContext, DataContext, ThemeContext]",
        "  ├── layouts/                    [DashboardLayout with Scoped Navigation]",
        "  ├── pages/                      [Multi-Role Page Views]",
        "  │   ├── admin/                  [Dashboard, Permissions, PendingClubs]",
        "  │   ├── instructor/             [ManageEvents, CheckIn, Memberships]",
        "  │   ├── od_incharge/            [ODDashboard, ODRequests, ODArchive]",
        "  │   ├── student/                [Dashboard, Clubs, MyRegistrations, OD]",
        "  │   └── auth/                   [Login, Register, GoogleAccountChooser]",
        "  ├── utils/                      [accessControl, apiClient, tableExport]",
        "  ├── App.jsx & main.jsx          [Route Tree & Application Bootstrap]",
        "  └── index.css                   [Tailwind Tokens & Design System]"
    ],
    "fig_8.1.4_frontend_folder.png"
)
