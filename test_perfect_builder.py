import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

from perfect_builder_base import (
    REPORT_DIR, FIG_DIR, SUPPORT_DIR, OUTPUT_DOCX,
    add_p, add_bullet_item, add_compact_table, add_figure
)

def build():
    doc = Document()
    
    # ==========================================
    # SECTION 0: COVER PAGE (No headers/footers, no border)
    # ==========================================
    sec0 = doc.sections[0]
    sec0.page_width = Pt(595.3)   # A4
    sec0.page_height = Pt(841.9)
    sec0.top_margin = Pt(72.0)
    sec0.bottom_margin = Pt(72.0)
    sec0.left_margin = Pt(72.0)
    sec0.right_margin = Pt(72.0)
    sec0.different_first_page_header_footer = False
    
    logo_path = os.path.join(SUPPORT_DIR, 'college_logo.png')
    
    add_p(doc, "CAMPUS EVENT HUB", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=30, space_after=14)
    add_p(doc, "23CS54C – MODERN WEB TECHNOLOGIES", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_p(doc, "Submitted by", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    add_p(doc, "GOMATHI S 24104058", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_p(doc, "In partial fulfillment for the award of the degree", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_p(doc, "of", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_p(doc, "BACHELOR OF ENGINEERING/TECHNOLOGY", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_p(doc, "in", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_p(doc, "COMPUTER SCIENCE AND ENGINEERING/ INFORMATION TECHNOLOGY", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(4)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.35))
        
    add_p(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    add_p(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "K.R.NAGAR, KOVILPATTI - 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "OCTOBER - 2026", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    
    # ==========================================
    # SECTION 1: REPORT BODY (Border & Dynamic Page Numbers)
    # ==========================================
    sec1 = doc.add_section()
    sec1.page_width = Pt(595.3)
    sec1.page_height = Pt(841.9)
    sec1.top_margin = Pt(72.0)
    sec1.bottom_margin = Pt(72.0)
    sec1.left_margin = Pt(72.0)
    sec1.right_margin = Pt(72.0)
    sec1.different_first_page_header_footer = False
    
    # Page Border (Exact XML matching reference)
    pgBorders = parse_xml(
        f'<w:pgBorders {nsdecls("w")} w:display="allPages" w:offsetFrom="page">'
        f'<w:top w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:left w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:bottom w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:right w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'</w:pgBorders>'
    )
    sec1._sectPr.append(pgBorders)
    
    # Right-aligned dynamic page number in footer
    footer = sec1.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run()
    fld = parse_xml(
        f'<w:fldSimple {nsdecls("w")} w:instr="PAGE">'
        f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r>'
        f'</w:fldSimple>'
    )
    f_p._p.append(fld)
    
    # ==========================================
    # BONAFIDE CERTIFICATE (Page 1)
    # ==========================================
    add_p(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    add_p(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "K.R.NAGAR, KOVILPATTI - 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    
    if os.path.exists(logo_path):
        p_logo2 = doc.add_paragraph()
        p_logo2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo2.paragraph_format.space_before = Pt(6)
        p_logo2.paragraph_format.space_after = Pt(4)
        r_logo2 = p_logo2.add_run()
        r_logo2.add_picture(logo_path, width=Inches(1.3))
        
    add_p(doc, "BONAFIDE CERTIFICATE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=18, space_after=15)
    add_p(doc, "This is to certify that this project report, “Campus Event Hub”, is the bonafide work of GOMATHI S (24104058) who carried out the project work under my supervision.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=32, line_spacing=1.5)
    
    add_p(doc, "Course Instructor/Guide", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=32, space_after=32)
    
    add_p(doc, "Submitted to the 23CS54C – MODERN WEB TECHNOLOGIES Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ____________",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=32, line_spacing=1.5)
    
    p_ex = doc.add_paragraph()
    p_ex.paragraph_format.space_before = Pt(32)
    r_ex1 = p_ex.add_run("Internal Examiner")
    r_ex1.font.name = "Times New Roman"
    r_ex1.font.size = Pt(12)
    r_ex1.bold = True
    r_tab = p_ex.add_run("\t\t\t\t\t\t")
    r_ex2 = p_ex.add_run("Co Examiner")
    r_ex2.font.name = "Times New Roman"
    r_ex2.font.size = Pt(12)
    r_ex2.bold = True
    
    # ==========================================
    # TABLE OF CONTENTS (Page 2)
    # ==========================================
    add_p(doc, "TABLE OF CONTENTS", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=18, page_break_before=True)
    
    toc_data = [
        ("CH NO", "TITLE", "PAGE NO"),
        ("1", "INTRODUCTION", "3"),
        ("2", "OBJECTIVES", "4"),
        ("3", "DESCRIPTION", "5"),
        ("4", "CLASS DIAGRAM", "6"),
        ("5", "TABLE STRUCTURES", "7"),
        ("6", "ER DIAGRAM", "16"),
        ("7", "TECH STACK", "18"),
        ("8", "MODULES", "19"),
        ("9", "CONCLUSION", "72")
    ]
    
    for ch, title, pg in toc_data:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        is_hdr = (ch == "CH NO")
        r_ch = p.add_run(f"{ch:<8}")
        r_ch.font.name = "Times New Roman"
        r_ch.font.size = Pt(12)
        r_ch.bold = is_hdr
        
        dots = "." * (60 - len(title)) if not is_hdr else " " * (60 - len(title))
        r_title = p.add_run(f"{title}{dots}")
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(12)
        r_title.bold = is_hdr
        
        r_pg = p.add_run(f"{pg:>6}")
        r_pg.font.name = "Times New Roman"
        r_pg.font.size = Pt(12)
        r_pg.bold = is_hdr

    # ==========================================
    # CHAPTER 1: INTRODUCTION (Page 3)
    # ==========================================
    add_p(doc, "CHAPTER 1", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "INTRODUCTION", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=18)
    
    add_p(doc, "In the modern collegiate environment, the efficient administration of student activities, co-curricular chapters, and campus events plays a vital role in ensuring the holistic development, technical excellence, and leadership incubation of university students. Handling club registrations, technical symposiums, hackathon scheduling, attendance verification, and academic On-Duty (OD) sanctioning through manual, noticeboard, or paper-based methods is time-consuming, error-prone, administratively exhausting, and lacks transparency. There is an urgent need for a reliable, digital solution that brings all these dispersed operations under one unified platform.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
          
    add_p(doc, "The Campus Event Hub is a comprehensive, full-stack web application designed to digitize, centralize, and automate the complete lifecycle of campus club governance, event scheduling, contestant enrollment, live attendance verification, and departmental On-Duty academic leave sanctions. The system was developed to meet the real-world operational requirements of autonomous collegiate institutions, departmental societies, and multi-disciplinary student chapters, and is deployed in a live networked production environment.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    add_p(doc, "The application is organized into three major functional domains: Master Governance Management, which covers all foundational records such as recognized campus clubs, faculty branch counselors, auditorium venues, and institutional domain policies; Transaction Management, which handles day-to-day operations including event creation, access gating, digital pass generation, real-time live attendance check-ins, and On-Duty (OD) leave approvals; and Reports & Analytics, which provides faculty advisors and administrators with real-time visibility into all student participation activities through dynamic, exportable reports.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    add_p(doc, "The system is powered by a high-concurrency Node.js and Express backend API architecture coupled with a reactive Vite and React 18 single-page frontend. Robust MongoDB persistence with transactional synchronization layers, Helmet security headers, CORS origin whitelisting, IP rate limiting, and stateless JSON Web Token (JWT) sessions make it production-ready and maintainable. This report documents the design, development, and implementation of the Campus Event Hub, providing a complete technical overview of its architecture, features, and functionality.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    # ==========================================
    # CHAPTER 2: OBJECTIVES (Page 4)
    # ==========================================
    add_p(doc, "CHAPTER 2", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "OBJECTIVES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=18)
    
    objectives = [
        ("To Digitize Campus Event Operations: ", "Replace manual paperwork, physical sign-up sheets, and printed circulars with a centralized digital system to improve accuracy, efficiency, and data accessibility."),
        ("To Centralize Master Data: ", "Maintain consistent and accurate master records for recognized student clubs, technical chapters, faculty advisors, and venue allocations."),
        ("To Automate the Event Lifecycle: ", "Streamline event scheduling, capacity thresholds, members-only eligibility checks, and real-time pass issuance with complete traceability."),
        ("To Enforce Role-Based Access Control: ", "Secure the application using cryptographic JWT authentication and protected routes separating Administrator, Faculty Advisor, Student Member, OD Incharge, and Public tiers."),
        ("To Secure Live Event Attendance: ", "Eliminate proxy attendance and sign-in forgery using dynamic, projected 4-digit venue hall PINs and interactive advisor check-in consoles."),
        ("To Standardize On-Duty (OD) Workflows: ", "Digitize the academic leave request lifecycle, enabling attendees to submit leave applications with proof attachments and allowing departmental officers to sanction waivers swiftly."),
        ("To Issue Digital Event Passes: ", "Generate verifiable digital passes with unique ticket identifiers, student roll numbers, and embedded verification metadata."),
        ("To Provide Dynamic Reporting and Analytics: ", "Generate detailed participation transcripts, department-wise OD distribution charts, and export them to Excel/CSV for effective analysis and decision-making."),
        ("To Ensure System Security and Reliability: ", "Implement security measures such as Helmet, CORS, rate limiting, and salted password hashing to protect the system."),
        ("To Deploy a Scalable, Maintainable Architecture: ", "Use a modular REST API architecture with separate frontend, backend, and database layers for easier maintenance and scalability.")
    ]
    for lead, rest in objectives:
        add_bullet_item(doc, lead, rest, space_after=3)

    # ==========================================
    # CHAPTER 3: DESCRIPTION (Page 5)
    # ==========================================
    add_p(doc, "CHAPTER 3", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "DESCRIPTION", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=18)
    
    add_p(doc, "The Campus Event Hub is a full-stack web application developed to manage and automate collegiate co-curricular activities, technical chapters, event scheduling, live attendance, and academic leave workflows. The system consists of five major functional areas:",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
          
    areas = [
        ("1. Master Data Management",
         "This module maintains centralized master records, including accredited campus clubs (CSI, IEEE, IE, Robotics, Yoga, Sports, Fine Arts, Music), faculty advisors, campus auditoriums and computing labs, and institutional email domain policies. These records ensure consistency and accuracy across all event transactions."),
         
        ("2. Transaction Management",
         "This module manages day-to-day event activities, including Event Creation, Access Gating, Chapter Membership Screening, Event Registration, Digital Pass Issuance, Live 4-Digit PIN Attendance, and On-Duty (OD) Sanctioning. Each transaction is linked to relevant master data, ensuring traceability, accountability, and effective participation control."),
         
        ("3. Reports and Dashboard",
         "The Reports module generates dynamic analytics for student participation, event enrollments, attendance percentages, and department-wise OD leaves using filters such as date, club, department, and academic year. Reports can be exported to Excel and PDF for further analysis. The Dashboard provides an overview of active events and recent campus activities."),
         
        ("4. Security and Access Control",
         "The system uses salted password hashing and JSON Web Token (JWT) authentication to secure user access. Protected API routes, Axios response interceptors, and request rate limiting help prevent unauthorized access and manage invalid or expired sessions."),
         
        ("5. Technology and Deployment",
         "The application uses React for the frontend, Node.js and Express for the backend, and MongoDB with in-memory sync for database management. It is deployed in a production-ready environment with Docker and automated deployment scripts, ensuring maintainability, scalability, and future enhancements.")
    ]
    for title, text in areas:
        add_p(doc, title, font_size=12, bold=True, space_before=4, space_after=2)
        add_p(doc, text, font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    # ==========================================
    # CHAPTER 4: CLASS DIAGRAM (Page 6)
    # ==========================================
    add_p(doc, "CHAPTER 4", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "CLASS DIAGRAM", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=14)
    add_figure(doc, 'class_diagram.png', "", width_in=6.15, space_after=4)

    # ==========================================
    # CHAPTER 5: TABLE STRUCTURES (Pages 7 to 15)
    # ==========================================
    add_p(doc, "CHAPTER 5", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "TABLE STRUCTURES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=14)
    
    # Page 7: Users & Students
    add_p(doc, "Users", font_size=12, bold=True, space_before=2, space_after=2)
    add_figure(doc, 'tbl_users.png', "", width_in=4.8, space_after=8)
    add_p(doc, "Students", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_students.png', "", width_in=4.8, space_after=4)
    
    # Page 8: Instructors & Clubs
    add_p(doc, "Instructors", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'tbl_instructors.png', "", width_in=4.8, space_after=8)
    add_p(doc, "Clubs", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_clubs.png', "", width_in=4.8, space_after=4)
    
    # Page 9: Events & Registrations
    add_p(doc, "Events", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'tbl_events.png', "", width_in=4.8, space_after=8)
    add_p(doc, "Registrations", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_registrations.png', "", width_in=4.8, space_after=4)
    
    # Page 10: Permission_Requests & OD_Records
    add_p(doc, "Permission_Requests :", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'tbl_permission_requests.png', "", width_in=4.8, space_after=8)
    add_p(doc, "OD_Records :", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_od_records.png', "", width_in=4.8, space_after=4)
    
    # Page 11: Audit_Logs & System_Settings
    add_p(doc, "Audit_Logs :", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'tbl_audit_logs.png', "", width_in=4.8, space_after=8)
    add_p(doc, "System_Settings :", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_system_settings.png', "", width_in=4.8, space_after=4)
    
    # Page 12: Event_Feedback & Club_Achievements
    add_p(doc, "Event_Feedback :", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'tbl_event_feedback.png', "", width_in=4.8, space_after=8)
    add_p(doc, "Club_Achievements :", font_size=12, bold=True, space_before=6, space_after=2)
    add_figure(doc, 'tbl_club_achievements.png', "", width_in=4.8, space_after=4)

    # ==========================================
    # CHAPTER 6: ER DIAGRAM (Pages 16 to 17)
    # ==========================================
    add_p(doc, "CHAPTER 6", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "ER DIAGRAM", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=14)
    add_p(doc, "ADDITIONAL MASTER TABLES", font_size=12, bold=True, space_before=2, space_after=4)
    add_figure(doc, 'er_diagram.png', "", width_in=6.15, space_after=6)
    
    # Second page of ER diagram
    add_p(doc, "RELATIONAL CONSTRAINTS & MULTIPLICITIES", font_size=12, bold=True, space_before=6, space_after=4, page_break_before=True)
    add_figure(doc, 'er_diagram.png', "", width_in=6.15, space_after=6)

    # ==========================================
    # CHAPTER 7: TECH STACK (Page 18 - Both tables together!)
    # ==========================================
    add_p(doc, "CHAPTER 7", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "TECH STACK", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=14)
    
    add_p(doc, "7.1 TECH STACK", font_size=13, bold=True, space_before=4, space_after=4)
    tech_table = [
        ["Frontend", "React.js (Vite)", "Single-page application with dynamic UI"],
        ["State Management", "React Context API", "Centralized application state"],
        ["HTTP Client", "Axios", "REST API communication with JWT auth"],
        ["Backend", "Node.js + Express.js v5", "RESTful API server"],
        ["ORM / Abstraction", "Mongoose / Mongo Sync", "Database abstraction and model management"],
        ["Database", "MongoDB (via driver)", "Document storage with high-speed indexing"],
        ["Authentication", "JSON Web Tokens (JWT)", "Stateless, token-based user authentication"],
        ["Security", "Helmet, CORS, bcryptjs", "HTTP hardening, rate limiting, password hashing"],
        ["Reports", "tableExport (CSV/PDF)", "Client/server-side report generation"],
        ["CI/CD", "Docker (Dockerfile)", "Automated containerized builds and deployments"]
    ]
    add_compact_table(doc, ["Layer", "Technology", "Purpose"], tech_table, [1.4, 1.9, 2.95], space_after=8)
    
    add_p(doc, "7.2 ARCHITECTURE OVERVIEW", font_size=13, bold=True, space_before=4, space_after=4)
    arch_table = [
        ["Model", "MongoDB + In-Memory Sync", "Defines data structure, handles DB queries, manages relationships and validations"],
        ["View", "React.js + Context API", "Renders the UI, manages user interaction, communicates with the server via Axios"],
        ["Controller", "Node.js + Express.js", "Receives HTTP requests, applies business logic, coordinates between Model and View"]
    ]
    add_compact_table(doc, ["Layer", "Technology", "Purpose"], arch_table, [1.4, 1.9, 2.95], space_after=6)

    # ==========================================
    # CHAPTER 8: MODULES - 8.0 & 8.1 (Pages 19 to 26)
    # ==========================================
    add_p(doc, "CHAPTER 8", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, page_break_before=True)
    add_p(doc, "MODULES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=14)
    
    add_p(doc, "8.0 Design Approach", font_size=13, bold=True, space_before=4, space_after=4)
    add_p(doc, "Each module of the Campus Event Hub is described here the way a system design problem is solved: by walking through the same seven steps in the same order, every time. This keeps the explanation of every module complete and comparable, and shows why each design decision was taken rather than only what the screen looks like.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.2)
          
    steps_data = [
        ["1. Functional requirements", "What must the module do?", "Section x.1"],
        ["2. Non-functional requirements", "How fast, how big, how available? Where does the CAP trade-off fall?", "Section x.2"],
        ["3. Tech stack", "Which tools suit this problem, and why?", "Section x.3"],
        ["4. Back-of-the-envelope", "How many users, requests and how much storage?", "Section x.4"],
        ["5. Low-level architecture", "Which components exist and who talks to whom?", "Section x.5 (diagram + request flow)"],
        ["6. API design", "What is the contract between client and server?", "Section x.6"],
        ["7. DB design", "Which tables, keys and indexes store the data?", "Section x.7"]
    ]
    add_compact_table(doc, ["Step", "Question it answers", "Presented in each module as"], steps_data, [1.6, 2.7, 1.95], space_after=6)
    
    add_p(doc, "Shared baseline for all modules", font_size=12, bold=True, underline=True, space_before=2, space_after=3)
    add_p(doc, "Non-functional baseline. Every request travels through Helmet (HTTP hardening), CORS, a payload size limit, a rate limiter and the JWT authentication middleware before it reaches a controller. All data lives in a single database, so the system chooses consistency over availability in CAP terms (CP): a user may briefly be unable to save if the database is unreachable, but two users can never see conflicting versions of an event registration or an attendance balance. Timestamps use ISO-8601 UTC formats.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.2)
          
    add_p(doc, "Sizing baseline (assumptions).", font_size=12, italic=True, space_before=2, space_after=3)
    sizing_data = [
        ["Named users", "≈ 20", "Faculty advisors, club heads, and administrative staff"],
        ["Working days / year", "300", "Assumption"],
        ["Requests per user per day", "≈ 300", "Form loads, dropdown look-ups and saves (assumption)"],
        ["Total requests per day", "20 × 300 = 6,000", "Derived"],
        ["Average load", "6,000 ÷ 28,800 s ≈ 0.2 req/s", "Spread over an 8-hour working day"],
        ["Peak load", "≈ 2–5 req/s", "10× to 25× the average, e.g. start of shift"],
        ["Total collections", "12", "Live schema"]
    ]
    add_compact_table(doc, ["Quantity", "Estimate", "Basis"], sizing_data, [1.6, 1.8, 2.85], space_after=6)
    
    add_p(doc, "A single Node.js process and one MongoDB instance handle this load comfortably. The design keeps the application stateless (JWT instead of server sessions), so extra Node.js instances can be added behind a load balancer if usage grows.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, line_spacing=1.2)
    add_figure(doc, 'fig_8.0_overall_flow.png', "Fig 8.0 Overall request flow of the Campus Event Hub Platform", width_in=5.2, space_after=6)

    # 8.1 FOLDER STRUCTURE (Pages 21 to 26)
    add_p(doc, "8.1 FOLDER STRUCTURE", font_size=13, bold=True, space_before=4, space_after=4, page_break_before=True)
    add_figure(doc, 'fig_8.1.1_highlevel_project.png', "Fig 8.1.1 Highlevel view of project", width_in=3.6, space_after=4)
    add_p(doc, "8.1.1 BACKEND FOLDER", font_size=12, bold=True, space_before=4, space_after=2)
    add_figure(doc, 'fig_8.1.2_backend_folder.png', "Fig 8.1.2 – Backend Folder Structure – Overall organization of backend files and directories showing modular architecture.", width_in=3.4, space_after=4)
    add_figure(doc, 'fig_8.1.3_config_folder.png', "Fig 8.1.3 config Folder structure", width_in=3.4, space_after=4)
    
    add_figure(doc, 'fig_8.1.4_controller_folder.png', "Fig 8.1.4 Controller Folder", width_in=3.4, space_after=4, page_break_before=True)
    add_figure(doc, 'fig_8.1.5_middleware_folder.png', "Fig 8.1.5 Middleware Folder Structure", width_in=3.4, space_after=4)
    add_figure(doc, 'fig_8.1.6_model_folder.png', "Fig 8.1.6 Model Folder Structure", width_in=3.4, space_after=4)
    
    add_p(doc, "8.1.2 FRONTEND FOLDER", font_size=12, bold=True, space_before=4, space_after=2, page_break_before=True)
    add_figure(doc, 'fig_8.1.7_frontend_folder.png', "Fig 8.1.7 Structure of Frontend Folder", width_in=3.4, space_after=4)
    add_figure(doc, 'fig_8.1.8_src_folder.png', "Fig 8.1.8 Structure of frontend/src", width_in=3.4, space_after=4)
    
    add_figure(doc, 'fig_8.1.9_pages_folder.png', "Fig 8.1.9 Structure of frontend/src/pages Folder", width_in=3.4, space_after=4, page_break_before=True)
    add_figure(doc, 'fig_8.1.10_routes_services.png', "Fig 8.1.10 Structure of frontend/src/routes and frontend/src/services", width_in=3.4, space_after=4)
    add_figure(doc, 'fig_8.1.11_components_folder.png', "Fig 8.1.11 Structure of frontend/src/components", width_in=3.4, space_after=4)

    # ==========================================
    # 8.2 USER AUTHENTICATION & ACCESS CONTROL (Pages 27 to 30)
    # ==========================================
    add_p(doc, "8.2 USER AUTHENTICATION & ACCESS CONTROL", font_size=13, bold=True, space_before=4, space_after=4, page_break_before=True)
    add_p(doc, "8.2.0 Purpose & Scope", font_size=12, bold=True, underline=True, space_before=2, space_after=2)
    add_p(doc, "Provides tokenized authentication, secure credential management, and Role-Based Access Control (RBAC) across the enterprise, preventing unauthorized data modifications.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, line_spacing=1.2)
          
    add_p(doc, "8.2.1 Functional Requirements", font_size=12, bold=True, underline=True, space_before=2, space_after=2)
    add_p(doc, "What the module must do:", font_size=12, space_after=2)
    add_bullet_item(doc, "", "A user signs in with a username/email and password and receives a signed JWT plus a profile (id, full_name, role).")
    add_bullet_item(doc, "", "A signed-in user can change their own password; administrators can register new users.")
    add_bullet_item(doc, "", "Four roles – admin, instructor, student, od_incharge – decide which endpoints a user may call.")
    add_bullet_item(doc, "", "Each account has an active / inactive status so access can be withdrawn without deleting the record, and the last login time is stored.")
    add_bullet_item(doc, "", "The browser redirects unauthenticated users to the login screen (protected routes) and handles an expired or invalid token centrally.")
    add_p(doc, "Out of scope: self-service sign-up for faculty roles and external multi-factor authentication hardware.", font_size=12, space_before=2, space_after=4)
    
    add_p(doc, "8.2.2 Non-Functional Requirements", font_size=12, bold=True, underline=True, space_before=2, space_after=2)
    add_p(doc, "How well the module must do it (the system-wide baseline in the chapter introduction also applies):", font_size=12, space_after=2)
    add_bullet_item(doc, "", "Security: passwords are stored only as bcryptjs hashes with auto-generated salts; the hash is never returned by the API.")
    add_bullet_item(doc, "", "Brute-force defence: at most 15 login attempts per 15 minutes per IP address on /api/auth/login.")
    add_bullet_item(doc, "", "Session length: tokens expire after 12 hours, which limits the damage of a stolen token while avoiding repeated logins in one shift.")
    add_bullet_item(doc, "", "Scalability: because tokens are stateless, any server instance can validate a request without a shared session store.")
    add_bullet_item(doc, "", "Latency target: login under 500 ms (dominated by the deliberate cost of bcrypt); token verification adds only microseconds per request.")
    add_bullet_item(doc, "", "CAP: the user table is a single MySQL source of truth – consistency is preferred, so a disabled account is refused immediately on the next login.")
    
    add_p(doc, "8.2.3 Tech Stack", font_size=12, bold=True, underline=True, space_before=4, space_after=2)
    add_compact_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Password hashing", "bcryptjs (salted)", "Pure JavaScript, no native build step on the Jenkins/production server"],
        ["Session", "JSON Web Token, 12 h", "Stateless; the client keeps the token and sends it in the Authorization header"],
        ["Abuse control", "rateLimiter.js middleware", "Applies the 15 per 15 minute limit only to the login route"],
        ["HTTP hardening", "Helmet, CORS", "Standard security headers and a restricted set of allowed origins"],
        ["Client guard", "ProtectedRoute.jsx + Axios interceptor", "Redirects to /login when no token exists or the server answers 401"]
    ], [1.4, 2.0, 2.85], space_after=6)
    
    add_p(doc, "8.2.4 Back-of-the-Envelope Estimation", font_size=12, bold=True, underline=True, space_before=4, space_after=2, page_break_before=True)
    add_p(doc, "Figures marked “live” come from the running system; the rest are working assumptions used to size the design.", font_size=12, space_after=2)
    add_compact_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Users", "≈ 20 rows, < 10 KB", "Assumption (≈ 0.5 KB per row)"],
        ["Logins per day", "≈ 40", "20 users × about 2 logins (12-hour tokens)"],
        ["Login burst", "≈ 20 logins in 5 minutes", "Start of shift ≈ 0.07 login/s"],
        ["CPU per login", "≈ 100 ms", "Typical bcrypt compare; one core handles ≈ 10 logins/s"],
        ["Brute-force ceiling", "1,440 attempts / day / IP", "15 attempts × 96 windows of 15 minutes"],
        ["Authenticated calls", "≈ 6,000 / day", "Each one verifies the JWT signature"]
    ], [1.6, 1.8, 2.85], space_after=6)
    
    add_p(doc, "8.2.5 Low-Level Architecture", font_size=12, bold=True, underline=True, space_before=4, space_after=2)
    add_figure(doc, 'fig_8.2.A_auth_arch.png', "Fig 8.2.A Low-level architecture – USER AUTHENTICATION & ACCESS CONTROL", width_in=5.2, space_after=4)
    add_p(doc, "Request flow:\n• Login.jsx posts the credentials; rateLimiter.js counts the attempt for the caller’s IP.\n• authController looks the user up by username (unique index), checks that the status is active, and compares the password with the stored bcrypt hash.\n• On success it updates last_login, signs a JWT (12 h) and returns the token with the profile.\n• The client stores the token; api.js adds it as a Bearer header on every later request.\n• auth.js verifies the signature and expiry and checks the role before the route handler runs.\n• A 401 response triggers the Axios interceptor, which clears the session and sends the user back to the login screen.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.2)
          
    add_p(doc, "8.2.6 API Design", font_size=12, bold=True, underline=True, space_before=4, space_after=2, page_break_before=True)
    add_p(doc, "Only /api/auth/login is public. The remaining paths are representative routes derived from the authController methods.", font_size=12, space_after=2)
    add_compact_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["POST", "/api/auth/login (public)", "Body: username, password. Returns JWT bearer token and user profile (id, full_name, role). Rate limited."],
        ["POST", "/api/auth/register", "Admin only. Creates a user with a hashed password and a role."],
        ["GET", "/api/auth/me", "Returns the profile of the signed-in user from the token."],
        ["PUT", "/api/auth/change-password", "Body: current and new password. Stores a new bcrypt hash."]
    ], [1.1, 2.1, 3.05], space_after=6)
    
    add_p(doc, "8.2.7 DB Design", font_size=12, bold=True, underline=True, space_before=4, space_after=2)
    add_compact_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Users", "PK id (auto increment)\nUNIQUE username", "username varchar(100), password varchar(255) hash, full_name, email, role enum(admin, instructor, student, od_incharge) default student, status enum(active, inactive) default active, last_login, createdAt, updatedAt"]
    ], [1.4, 2.0, 2.85], space_after=4)
    add_p(doc, "• The unique index on username makes the login look-up a single index read and prevents duplicate accounts.\n• No other table has a foreign key to Users, so authentication can be changed independently of the store data.",
          font_size=12, space_after=6, line_spacing=1.2)
          
    add_p(doc, "8.2.8 Screenshots", font_size=12, bold=True, underline=True, space_before=4, space_after=2)
    add_figure(doc, 'fig_8.2.1_login_portal.png', "Fig 8.2: User Login & Authentication Interface",
               "The login interface allows users to enter credentials and authenticate into their role-specific dashboard. It includes quick sign-in cards for demonstration, secure password fields, and role verification.",
               width_in=4.4, space_after=4)

    # Remaining Modules 8.3 to 8.8 follow exact same clean, compact page template...
    # Let's add 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9 and 9 cleanly!

    doc.save(OUTPUT_DOCX)
    print(f"Generated perfect base report at {OUTPUT_DOCX}")

if __name__ == "__main__":
    build()
