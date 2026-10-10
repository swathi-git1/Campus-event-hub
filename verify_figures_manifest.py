import os
import csv
from PIL import Image, ImageStat

FIG_DIR = 'Campus_Event_Hub_Report/figures'
MANIFEST_CSV = 'Campus_Event_Hub_Report/figures_manifest.csv'

# Perceptual difference hash (dHash)
def dhash(image, hash_size=8):
    resized = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    diff = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = pixels[row * (hash_size + 1) + col]
            pixel_right = pixels[row * (hash_size + 1) + col + 1]
            diff.append(pixel_left > pixel_right)
    return hex(int(''.join(['1' if d else '0' for d in diff]), 2))

# Figures mapping
figures_def = [
    ("Figure 4.1", "class_diagram.png", "All", "Architecture", "Fig 4.1 UML Class Diagram of Campus Event Hub Architecture"),
    ("Figure 6.1", "er_diagram.png", "All", "Database", "Fig 6.1 Entity-Relationship Diagram of Campus Event Hub Architecture"),
    ("Figure 8.1.1", "fig_8.1.1_overall_architecture.png", "System", "Architecture", "Figure 8.1.1 Overall System Request & Data Architecture for Campus Event Hub"),
    ("Figure 8.2.1", "fig_8.2.1_backend_folder.png", "System", "server/*", "Figure 8.2.1 Backend Folder Structure"),
    ("Figure 8.2.2", "fig_8.2.2_frontend_folder.png", "System", "src/*", "Figure 8.2.2 Frontend Folder Structure"),
    ("Figure 8.3.1", "fig_8.3.1_user_login.png", "Public", "/login", "Figure 8.3.1 Role-Based User Login & Authentication Interface"),
    ("Figure 8.3.2", "fig_8.3.2_user_register.png", "Public", "/register", "Figure 8.3.2 Student Institutional Registration Interface"),
    ("Figure 8.4.1", "fig_8.4.1_student_profile.png", "Student", "/student/profile", "Figure 8.4.1 Student Profile, Academic Credentials & Multi-Channel Alert Preferences"),
    ("Figure 8.5.1", "fig_8.5.1_clubs_directory.png", "Student", "/student/clubs", "Figure 8.5.1 Accredited Student Clubs & Technical Chapters Directory"),
    ("Figure 8.5.2", "fig_8.5.2_club_profile_csi.png", "Student", "/student/clubs/csi", "Figure 8.5.2 CSI Student Chapter Detailed Profile & Executive Council"),
    ("Figure 8.6.1", "fig_8.6.1_instructor_events.png", "Instructor", "/instructor/events", "Figure 8.6.1 Chapter Event Scheduling & Capacity Gating Console"),
    ("Figure 8.7.1", "fig_8.7.1_student_enroll_catalog.png", "Student", "/student/enroll", "Figure 8.7.1 Campus Event Catalog & Discovery Feed"),
    ("Figure 8.7.2", "fig_8.7.2_student_enroll_detail.png", "Student", "/student/enroll/1", "Figure 8.7.2 Event Pass Reservation & Contestant Registration Interface"),
    ("Figure 8.7.3", "fig_8.7.3_registration_confirmation.png", "Student", "/student/confirmation", "Figure 8.7.3 Digital Event Pass Confirmation with Verification QR Token"),
    ("Figure 8.7.4", "fig_8.7.4_my_registrations.png", "Student", "/student/registrations", "Figure 8.7.4 Student Enrolled Event Passes & Pass Management Portfolio"),
    ("Figure 8.8.1", "fig_8.8.1_instructor_live_checkin.png", "Instructor", "/instructor/checkin", "Figure 8.8.1 Faculty Advisor Live Attendance Verification & 4-Digit Hall PIN Console"),
    ("Figure 8.9.1", "fig_8.9.1_student_permissions.png", "Student", "/student/permissions", "Figure 8.9.1 Student Academic On-Duty (OD) Leave Application Console"),
    ("Figure 8.9.2", "fig_8.9.2_od_requests_table.png", "OD In-Charge", "/od-incharge/requests", "Figure 8.9.2 Chief OD In-Charge Application Review & Scrutiny Interface"),
    ("Figure 8.10.1", "fig_8.10.1_od_proof_verification.png", "OD In-Charge", "/od-incharge/proofs", "Figure 8.10.1 Event Completion Certificate & Participation Proof Verification Console"),
    ("Figure 8.11.1", "fig_8.11.1_od_records_archive.png", "OD In-Charge", "/od-incharge/records", "Figure 8.11.1 Institutional Official OD Pass Registry & Academic Exemption Archive"),
    ("Figure 8.12.1", "fig_8.12.1_instructor_memberships.png", "Instructor", "/instructor/memberships", "Figure 8.12.1 Chapter Student Membership Roster & Verification Management"),
    ("Figure 8.13.1", "fig_8.13.1_student_achievements.png", "Student", "/student/achievements", "Figure 8.13.1 Collegiate Hall of Fame & Competitive Achievements Feed"),
    ("Figure 8.14.1", "fig_8.14.1_student_feedback.png", "Student", "/student/feedback", "Figure 8.14.1 Post-Event Student Feedback & Ratings Console"),
    ("Figure 8.15.1", "fig_8.15.1_campus_links.png", "Student", "/links", "Figure 8.15.1 Multi-Linker Unified Campus Portals & Academic Resources Hub"),
    ("Figure 8.18.1", "fig_8.18.1_system_settings.png", "Admin", "/settings", "Figure 8.18.1 Institutional System Settings & Email Domain Security Configuration"),
    ("Figure 8.19.1", "fig_8.19.1_od_analytics.png", "OD In-Charge", "/od-incharge/analytics", "Figure 8.19.1 Departmental OD Distribution Analytics & Trend Charts"),
    ("Figure 8.19.2", "fig_8.19.2_admin_dashboard.png", "Admin", "/admin/dashboard", "Figure 8.19.2 Super Admin Executive Control Center & Campus Metrics Overview"),
    ("Figure 8.19.3", "fig_8.19.3_student_history.png", "Student", "/student/history", "Figure 8.19.3 Student Co-Curricular Transcript & Verified Attendance History"),
]

# Generate rotated class diagram for rotated landscape page 7
class_diag_path = os.path.join(FIG_DIR, 'class_diagram.png')
if os.path.exists(class_diag_path):
    img = Image.open(class_diag_path)
    # Rotate 270 degrees (90 deg counter-clockwise) matching reference
    rotated = img.rotate(270, expand=True)
    rotated.save(os.path.join(FIG_DIR, 'class_diagram_rotated.png'))
    print("Created class_diagram_rotated.png")

hashes = set()
rows = []
all_passed = True

print(f"{'Figure':<14} {'File':<36} {'StdDev':<8} {'dHash':<18} {'Status'}")
print("-" * 88)

for fig_no, filename, role, route, caption in figures_def:
    filepath = os.path.join(FIG_DIR, filename)
    if not os.path.exists(filepath):
        print(f"FAILED: Missing file {filename}")
        all_passed = False
        continue

    img = Image.open(filepath)
    stat = ImageStat.Stat(img)
    stddev = sum(stat.stddev) / len(stat.stddev)
    h = dhash(img)

    is_blank = stddev < 5.0
    is_duplicate = h in hashes
    hashes.add(h)

    status = "VERIFIED"
    if is_blank:
        status = "FAILED (Blank)"
        all_passed = False
    elif is_duplicate:
        status = "FAILED (Duplicate)"
        all_passed = False

    print(f"{fig_no:<14} {filename:<36} {stddev:<8.2f} {h:<18} {status}")
    rows.append([fig_no, filename, role, route, caption, h, f"{stddev:.2f}", status])

with open(MANIFEST_CSV, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["Figure", "Filename", "Role", "Route", "Caption", "dHash", "StdDev", "VerificationStatus"])
    writer.writerows(rows)

print("-" * 88)
print(f"Total Figures Verified: {len(rows)}")
print(f"All Acceptance Checks Passed: {all_passed}")
print(f"Manifest written to: {MANIFEST_CSV}")
