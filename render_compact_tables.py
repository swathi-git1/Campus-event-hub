import matplotlib.pyplot as plt
import os

FIGURES_DIR = 'Campus_Event_Hub_Report/figures'
os.makedirs(FIGURES_DIR, exist_ok=True)

schema_tables = [
    ("Users", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("name", "varchar(150)", "NO", "", "NULL", ""),
        ("email", "varchar(150)", "NO", "UNI", "NULL", ""),
        ("passwordHash", "varchar(255)", "NO", "", "NULL", ""),
        ("passwordSalt", "varchar(64)", "NO", "", "NULL", ""),
        ("role", "enum('student','instructor','admin','od_incharge')", "NO", "", "student", ""),
        ("isActive", "tinyint(1)", "NO", "", "1", ""),
        ("preferences", "json", "YES", "", "NULL", ""),
        ("createdAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("updatedAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", "on update")
    ]),
    ("Students", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("rollNo", "varchar(30)", "NO", "UNI", "NULL", ""),
        ("name", "varchar(150)", "NO", "", "NULL", ""),
        ("email", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("dept", "varchar(100)", "NO", "", "NULL", ""),
        ("degree", "varchar(50)", "YES", "", "B.Tech", ""),
        ("year", "varchar(20)", "YES", "", "3rd Year", ""),
        ("chapter", "varchar(50)", "YES", "MUL", "NULL", ""),
        ("verificationStatus", "enum('verified','pending','rejected')", "NO", "", "pending", ""),
        ("attendanceCount", "int", "NO", "", "0", ""),
        ("joinedDate", "date", "YES", "", "NULL", "")
    ]),
    ("Instructors", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("employeeId", "varchar(50)", "NO", "UNI", "NULL", ""),
        ("name", "varchar(150)", "NO", "", "NULL", ""),
        ("email", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("designation", "varchar(100)", "YES", "", "Faculty Advisor", ""),
        ("dept", "varchar(100)", "NO", "", "NULL", ""),
        ("assignedClub", "varchar(50)", "NO", "MUL", "NULL", ""),
        ("officeRoom", "varchar(100)", "YES", "", "NULL", ""),
        ("officeHours", "varchar(150)", "YES", "", "NULL", ""),
        ("phone", "varchar(30)", "YES", "", "NULL", "")
    ]),
    ("Clubs", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("code", "varchar(30)", "NO", "UNI", "NULL", ""),
        ("name", "varchar(150)", "NO", "", "NULL", ""),
        ("category", "varchar(50)", "NO", "", "Technical", ""),
        ("leadAdvisorId", "varchar(36)", "YES", "MUL", "NULL", ""),
        ("description", "text", "YES", "", "NULL", ""),
        ("meetingVenue", "varchar(100)", "YES", "", "NULL", ""),
        ("memberCount", "int", "NO", "", "0", ""),
        ("status", "enum('active','pending')", "NO", "", "active", "")
    ]),
    ("Events", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("title", "varchar(200)", "NO", "", "NULL", ""),
        ("clubId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("date", "date", "NO", "", "NULL", ""),
        ("time", "varchar(50)", "NO", "", "NULL", ""),
        ("venue", "varchar(100)", "NO", "", "NULL", ""),
        ("category", "varchar(50)", "NO", "", "Workshop", ""),
        ("accessLevel", "enum('public','members_only')", "NO", "", "public", ""),
        ("capacity", "int", "NO", "", "100", ""),
        ("enrolledCount", "int", "NO", "", "0", ""),
        ("venuePin", "varchar(4)", "NO", "", "1234", ""),
        ("status", "enum('upcoming','completed')", "NO", "", "upcoming", "")
    ]),
    ("Registrations", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("ticketId", "varchar(50)", "NO", "UNI", "NULL", ""),
        ("eventId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("studentEmail", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("studentName", "varchar(150)", "NO", "", "NULL", ""),
        ("rollNo", "varchar(30)", "NO", "", "NULL", ""),
        ("registeredAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("status", "enum('registered','present','absent')", "NO", "", "registered", ""),
        ("checkInTime", "datetime", "YES", "", "NULL", ""),
        ("verificationMethod", "enum('PIN','Desk')", "YES", "", "NULL", "")
    ]),
    ("Chapters", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("clubCode", "varchar(30)", "NO", "MUL", "NULL", ""),
        ("chapterName", "varchar(150)", "NO", "", "NULL", ""),
        ("foundingYear", "int", "YES", "", "2020", ""),
        ("facultyMentor", "varchar(150)", "NO", "", "NULL", ""),
        ("meetingCadence", "varchar(50)", "YES", "", "Weekly", ""),
        ("status", "enum('active','probation')", "NO", "", "active", "")
    ]),
    ("Chapter_Memberships", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("studentRollNo", "varchar(30)", "NO", "MUL", "NULL", ""),
        ("chapterCode", "varchar(30)", "NO", "MUL", "NULL", ""),
        ("role", "enum('member','lead','secretary','treasurer')", "NO", "", "member", ""),
        ("joinedDate", "date", "NO", "", "NULL", ""),
        ("approvalStatus", "enum('approved','pending','rejected')", "NO", "", "approved", ""),
        ("reviewedBy", "varchar(150)", "YES", "", "NULL", "")
    ]),
    ("Permission_Requests", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("studentEmail", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("rollNo", "varchar(30)", "NO", "", "NULL", ""),
        ("eventId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("clubName", "varchar(100)", "NO", "", "NULL", ""),
        ("requestDate", "date", "NO", "", "NULL", ""),
        ("reason", "text", "NO", "", "NULL", ""),
        ("status", "enum('pending','sanctioned','rejected')", "NO", "", "pending", ""),
        ("comments", "text", "YES", "", "NULL", "")
    ]),
    ("OD_Records", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("requestId", "varchar(36)", "NO", "UNI", "NULL", ""),
        ("studentEmail", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("rollNo", "varchar(30)", "NO", "", "NULL", ""),
        ("eventName", "varchar(200)", "NO", "", "NULL", ""),
        ("odDate", "date", "NO", "", "NULL", ""),
        ("sanctionedBy", "varchar(150)", "NO", "", "Chief OD Officer", ""),
        ("sanctionDate", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("academicYear", "varchar(20)", "NO", "", "2026-2027", "")
    ]),
    ("Attendance_Logs", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("eventId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("studentRollNo", "varchar(30)", "NO", "MUL", "NULL", ""),
        ("checkInTime", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("verificationMode", "enum('PIN','Desk_QR','Manual')", "NO", "", "PIN", ""),
        ("deviceFingerprint", "varchar(100)", "YES", "", "NULL", ""),
        ("verifiedBy", "varchar(150)", "YES", "", "NULL", "")
    ]),
    ("Venue_PIN_Sessions", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("eventId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("venuePin", "varchar(4)", "NO", "", "1234", ""),
        ("generatedAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("expiresAt", "datetime", "NO", "", "NULL", ""),
        ("isActive", "tinyint(1)", "NO", "", "1", ""),
        ("facultySupervisor", "varchar(150)", "NO", "", "NULL", "")
    ]),
    ("Audit_Logs", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("timestamp", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("actor", "varchar(150)", "NO", "", "NULL", ""),
        ("action", "varchar(100)", "NO", "", "NULL", ""),
        ("target", "varchar(100)", "YES", "", "NULL", ""),
        ("ipAddress", "varchar(50)", "YES", "", "NULL", "")
    ]),
    ("Notification_Dispatches", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("recipientEmail", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("channel", "enum('email','whatsapp','sms')", "NO", "", "email", ""),
        ("subject", "varchar(200)", "NO", "", "NULL", ""),
        ("dispatchStatus", "enum('delivered','pending','failed')", "NO", "", "delivered", ""),
        ("sentAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("errorMessage", "text", "YES", "", "NULL", "")
    ]),
    ("Campus_Links", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("title", "varchar(150)", "NO", "", "NULL", ""),
        ("category", "varchar(50)", "NO", "", "Academic", ""),
        ("url", "varchar(255)", "NO", "", "NULL", ""),
        ("iconName", "varchar(50)", "YES", "", "external-link", ""),
        ("accessScope", "enum('student','faculty','public')", "NO", "", "public", "")
    ]),
    ("System_Settings", [
        ("key", "varchar(100)", "NO", "PRI", "NULL", ""),
        ("value", "text", "NO", "", "NULL", ""),
        ("dataType", "varchar(30)", "NO", "", "string", ""),
        ("updatedAt", "datetime", "NO", "", "CURRENT_TIMESTAMP", ""),
        ("updatedBy", "varchar(150)", "YES", "", "admin@college.edu", "")
    ]),
    ("Event_Feedback", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("eventId", "varchar(36)", "NO", "MUL", "NULL", ""),
        ("studentEmail", "varchar(150)", "NO", "MUL", "NULL", ""),
        ("rating", "int", "NO", "", "5", ""),
        ("feedbackText", "text", "YES", "", "NULL", "")
    ]),
    ("Club_Achievements", [
        ("id", "varchar(36)", "NO", "PRI", "NULL", ""),
        ("clubCode", "varchar(30)", "NO", "MUL", "NULL", ""),
        ("title", "varchar(200)", "NO", "", "NULL", ""),
        ("awardedTo", "varchar(150)", "YES", "", "NULL", ""),
        ("awardDate", "date", "NO", "", "NULL", ""),
        ("badgeType", "varchar(50)", "YES", "", "Gold", "")
    ])
]

def render_compact(t_name, rows, out_path):
    cols = ["Field", "Type", "Null", "Key", "Default", "Extra"]
    n_rows = len(rows)
    # Calibrated height matching reference docx: ~0.20 in per row + header
    fig_h = max(1.0, 0.22 * (n_rows + 1) + 0.12)
    
    fig, ax = plt.subplots(figsize=(6.4, fig_h), dpi=220)
    ax.axis('off')
    
    cell_text = [list(r) for r in rows]
    tbl = ax.table(
        cellText=cell_text,
        colLabels=cols,
        loc='center',
        cellLoc='left'
    )
    tbl.auto_set_font_size(False)
    tbl.set_fontsize(7.5)
    tbl.scale(1.0, 1.15)
    
    # Header styling (Exact Reference #D9E2F3)
    for col_idx in range(len(cols)):
        c = tbl[(0, col_idx)]
        c.set_facecolor('#D9E2F3')
        c.get_text().set_weight('bold')
        c.get_text().set_color('#0F172A')
        
    for r_idx in range(1, n_rows + 1):
        bg = '#F8FAFC' if r_idx % 2 == 1 else '#FFFFFF'
        for col_idx in range(len(cols)):
            c = tbl[(r_idx, col_idx)]
            c.set_facecolor(bg)
            c.get_text().set_color('#1E293B')
            
    plt.tight_layout(pad=0.15)
    plt.savefig(out_path, bbox_inches='tight', dpi=220)
    plt.close()
    print(f'Rendered compact {t_name}')

for t_name, rows in schema_tables:
    safe_name = t_name.lower().replace(' ', '_')
    out_file = os.path.join(FIGURES_DIR, f'tbl_{safe_name}.png')
    render_compact(t_name, rows, out_file)

print(f"Total {len(schema_tables)} compact schema tables rendered successfully.")
