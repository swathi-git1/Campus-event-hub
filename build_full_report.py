import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from report_builder_base import (
    REPORT_DIR, FIG_DIR, SUPPORT_DIR, OUTPUT_DOCX,
    add_para, add_heading1, add_heading2, add_heading3,
    add_bullet, add_custom_table, add_image_with_caption
)

def build_complete_academic_report():
    doc = Document()
    
    # ----------------------------------------------------
    # SECTION 0: COVER PAGE (No headers/footers, no border)
    # ----------------------------------------------------
    sec0 = doc.sections[0]
    sec0.page_width = Pt(595.3)   # A4
    sec0.page_height = Pt(841.9)
    sec0.top_margin = Pt(72.0)
    sec0.bottom_margin = Pt(72.0)
    sec0.left_margin = Pt(72.0)
    sec0.right_margin = Pt(72.0)
    sec0.different_first_page_header_footer = False
    
    logo_path = os.path.join(SUPPORT_DIR, 'college_logo.png')
    
    add_para(doc, "CAMPUS EVENT HUB", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=32, space_after=14)
    add_para(doc, "23CS54C – MODERN WEB TECHNOLOGIES", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_para(doc, "Submitted by", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    add_para(doc, "GOMATHI S 24104058", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_para(doc, "In partial fulfillment for the award of the degree", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_para(doc, "of", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_para(doc, "BACHELOR OF ENGINEERING/TECHNOLOGY", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_para(doc, "in", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_para(doc, "COMPUTER SCIENCE AND ENGINEERING/ INFORMATION TECHNOLOGY", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(4)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.4))
        
    add_para(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    add_para(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_para(doc, "K.R.NAGAR, KOVILPATTI - 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_para(doc, "OCTOBER - 2026", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    
    # ----------------------------------------------------
    # SECTION 1: REPORT BODY (Border & Dynamic Page Numbers)
    # ----------------------------------------------------
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
    f_pPr = f_p._p.get_or_add_pPr()
    fld = parse_xml(
        f'<w:fldSimple {nsdecls("w")} w:instr="PAGE">'
        f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r>'
        f'</w:fldSimple>'
    )
    f_p._p.append(fld)
    
    # ----------------------------------------------------
    # BONAFIDE CERTIFICATE (Page 1)
    # ----------------------------------------------------
    add_para(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    add_para(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_para(doc, "K.R.NAGAR, KOVILPATTI - 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    
    if os.path.exists(logo_path):
        p_logo2 = doc.add_paragraph()
        p_logo2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo2.paragraph_format.space_before = Pt(6)
        p_logo2.paragraph_format.space_after = Pt(4)
        r_logo2 = p_logo2.add_run()
        r_logo2.add_picture(logo_path, width=Inches(1.3))
        
    add_para(doc, "BONAFIDE CERTIFICATE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=18, space_after=15)
    add_para(doc, "This is to certify that this project report, “Campus Event Hub”, is the bonafide work of GOMATHI S (24104058) who carried out the project work under my supervision.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=32, line_spacing=1.5)
    
    add_para(doc, "Course Instructor/Guide", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=32, space_after=32)
    
    add_para(doc, "Submitted to the 23CS54C – MODERN WEB TECHNOLOGIES Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ____________",
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
    
    doc.add_page_break()
    
    # ----------------------------------------------------
    # TABLE OF CONTENTS (Page 2)
    # ----------------------------------------------------
    add_para(doc, "TABLE OF CONTENTS", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=18)
    
    # Placeholder for TOC lines, will match exact starting pages
    toc_lines = [
        ("CH NO", "TITLE", "PAGE NO"),
        ("1", "INTRODUCTION", "3"),
        ("2", "OBJECTIVES", "4"),
        ("3", "DESCRIPTION", "5"),
        ("4", "CLASS DIAGRAM", "7"),
        ("5", "TABLE STRUCTURES", "8"),
        ("6", "ER DIAGRAM", "15"),
        ("7", "TECH STACK", "16"),
        ("8", "MODULES", "18"),
        ("9", "CONCLUSION", "55")
    ]
    
    for ch, title, pg in toc_lines:
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

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 1: INTRODUCTION
    # ----------------------------------------------------
    add_heading1(doc, "INTRODUCTION", chapter_num=1)
    
    add_para(doc, "In the modern collegiate environment, co-curricular and extracurricular student activities play a vital role in ensuring the holistic development, technical competency, and leadership acumen of aspiring engineers and technologists. Handling club registrations, technical symposiums, hackathon scheduling, attendance verification, and academic On-Duty (OD) sanctioning through manual, noticeboard, or paper-based methods is time-consuming, error-prone, administratively exhausting, and lacks institutional transparency. There is an urgent, compelling need for a reliable, comprehensive digital platform that brings all these dispersed campus operations under one unified, authoritative system.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_para(doc, "The Campus Event Hub is a comprehensive, production-grade, full-stack web application meticulously architected to digitize, centralize, and automate the complete lifecycle of campus club governance, event scheduling, contestant registration, live attendance verification, and departmental On-Duty academic leave sanctions. The system was engineered to fulfill the real-world operational requirements of autonomous collegiate institutions, departmental societies, and multi-disciplinary student chapters, and is deployed in an active local and networked production environment.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    add_para(doc, "The application is structured into four major functional domains: Institutional Master Data Management, which maintains authoritative records for accredited campus clubs, faculty branch counselors, room and lab venues, and collegiate domain parameters; Event Lifecycle & Enrollment Engine, which manages scheduling proposals, access gating (Public vs. Chapter Members Only), digital pass issuance, and capacity quotas; Live Attendance Desk & PIN Verification, which executes synchronized real-time attendance tracking via dynamic 4-digit venue hall PIN projections and advisor attendance consoles; and On-Duty (OD) Sanctioning & Analytics, which provides departmental authorities with automated leave workflows, proof verification, and exportable participation reports.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    add_para(doc, "The platform is hosted on a high-concurrency Node.js and Express.js RESTful backend architecture coupled with a reactive Vite and React 18 single-page frontend. Robust MongoDB persistence with transactional synchronization layers, Helmet security headers, CORS origin whitelisting, IP rate limiting, and stateless JSON Web Token (JWT) sessions render the platform secure, robust, and highly maintainable. This comprehensive report documents the design, architecture, schemas, API contracts, implementation modules, and operational workflows of the Campus Event Hub.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 2: OBJECTIVES
    # ----------------------------------------------------
    add_heading1(doc, "OBJECTIVES", chapter_num=2)
    
    obj_list = [
        ("To Digitize Campus Event Operations: ", "Replace manual paperwork, physical sign-up lists, and printed circulars with a centralized digital system to elevate accuracy, institutional efficiency, and real-time data accessibility."),
        ("To Centralize Club & Advisor Master Data: ", "Maintain consistent, validated master records for accredited clubs, technical chapters, faculty counselors, and campus venue allocations."),
        ("To Automate the Event Lifecycle: ", "Streamline event creation, capacity budgeting, members-only access gating, and digital pass generation with end-to-end traceability."),
        ("To Enforce Multi-Tier Role-Based Access Control: ", "Secure application resources using cryptographic JWT authentication and role-scoped guards separating Administrator, Faculty Advisor, Student Member, OD Incharge, and Public tiers."),
        ("To Secure Live Event Attendance Verification: ", "Eliminate proxy attendance and sign-in forgery using dynamic, projected 4-digit venue hall PINs and interactive advisor check-in consoles."),
        ("To Standardize On-Duty (OD) Permission Workflows: ", "Digitize the academic leave request lifecycle, enabling attendees to submit leave applications with proof attachments and allowing departmental officers to sanction waivers swiftly."),
        ("To Issue Cryptographic Digital Event Passes: ", "Generate verifiable digital passes with unique ticket identifiers, student roll numbers, and scannable QR verification metadata."),
        ("To Provide Dynamic Reporting & Executive Analytics: ", "Generate detailed participation transcripts, department-wise OD distribution charts, and exportable CSV/PDF reports for administrative decision-making."),
        ("To Ensure System Security and Resiliency: ", "Incorporate robust defenses including HTTP hardening via Helmet, CORS origin controls, IP rate limiting, and salted password hashing."),
        ("To Deploy a Scalable, Maintainable Architecture: ", "Implement a modular client-server architecture with RESTful API endpoints and Docker containerization for seamless enterprise scalability.")
    ]
    for lead, rest in obj_list:
        add_bullet(doc, lead, rest)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 3: DESCRIPTION
    # ----------------------------------------------------
    add_heading1(doc, "DESCRIPTION", chapter_num=3)
    
    add_para(doc, "The Campus Event Hub is a full-stack web application developed to manage and automate collegiate co-curricular activities, technical chapters, event scheduling, live attendance, and academic leave workflows. The system consists of five major functional areas:",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=10, line_spacing=1.25)
             
    areas = [
        ("1. Master Governance & Club Management",
         "This module maintains centralized records for accredited campus clubs (including Computer Society of India, IEEE Student Branch, Institution of Engineers, Robotics Club, Fine Arts Club, and Sports Council), faculty advisor appointments, room and auditorium infrastructure, and institutional email domain policies. These records guarantee organizational consistency and uniform branding across all collegiate activities."),
         
        ("2. Role-Based Access & Identity Control",
         "The system enforces strict cryptographic identity management using salted password hashes and stateless JSON Web Tokens (JWT). Five distinct user personas are supported: Administrator (campus-wide authority), Faculty Advisor / Instructor (scoped to assigned club operations), Registered Student (catalog browsing, pass issuance, PIN check-in), OD Incharge (leave permission verification), and Public Guest (read-only showcase). Protected routes, response interceptors, and IP rate limiting safeguard system endpoints."),
         
        ("3. Event Lifecycle & Scheduling Engine",
         "This module manages day-to-day event planning and publishing. Faculty counselors configure event dates, venue halls, category classifications, and access levels (Public vs. Chapter Members Only). The scheduling engine validates venue availability, prevents room collisions, enforces capacity ceilings, and generates unique 4-digit venue PINs required for live check-in."),
         
        ("4. Live Attendance & Dynamic Venue PIN Desk",
         "To eliminate manual signature sheets and prevent proxy check-ins, the platform deploys a synchronized attendance engine. During active events, faculty advisors project the unique 4-digit venue hall PIN onto auditorium displays. Attendees confirm attendance via instant self-check-in through their mobile portals, while advisors retain manual override consoles and contestant roster export capabilities."),
         
        ("5. On-Duty (OD) Verification & Institutional Analytics",
         "The OD subsystem automates student academic leave requests by verifying attendance records against event rosters, reviewing uploaded certificate proofs, and routing approvals through faculty advisors to the Chief OD Officer. Concurrently, executive dashboards provide live KPI tracking, department participation breakdowns, monthly event trends, and Excel/PDF export facilities.")
    ]
    for title, body in areas:
        add_para(doc, title, font_size=12, bold=True, space_before=4, space_after=2)
        add_para(doc, body, font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 4: CLASS DIAGRAM
    # ----------------------------------------------------
    add_heading1(doc, "CLASS DIAGRAM", chapter_num=4)
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'class_diagram.png'), "Fig 4.1 UML Class Diagram of Campus Event Hub Architecture", width_inches=6.2)
    add_para(doc, "The UML Class Diagram models the object-oriented structure of the Campus Event Hub. The User base class encapsulates shared security credentials and role attributes, extended by Student and Instructor entities. The Club entity maintains a one-to-one counseling relationship with an Instructor and a one-to-many composition with scheduled Events and student chapter affiliations. Events aggregate multiple Registrations, which link individual Students to unique ticket passes. Registrations establish direct relational links with ODRecord and PermissionRequest entities, ensuring complete traceability between event attendance and sanctioned academic On-Duty leave waivers.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 5: TABLE STRUCTURES
    # ----------------------------------------------------
    add_heading1(doc, "TABLE STRUCTURES", chapter_num=5)
    
    schema_displays = [
        ("Users", "tbl_users.png"),
        ("Students", "tbl_students.png"),
        ("Instructors", "tbl_instructors.png"),
        ("Clubs", "tbl_clubs.png"),
        ("Events", "tbl_events.png"),
        ("Registrations", "tbl_registrations.png"),
        ("Permission_Requests", "tbl_permission_requests.png"),
        ("OD_Records", "tbl_od_records.png"),
        ("Audit_Logs", "tbl_audit_logs.png"),
        ("System_Settings", "tbl_system_settings.png"),
        ("Event_Feedback", "tbl_event_feedback.png"),
        ("Club_Achievements", "tbl_club_achievements.png")
    ]
    for t_name, img_file in schema_displays:
        add_para(doc, t_name, font_size=12, bold=True, space_before=6, space_after=2)
        img_p = os.path.join(FIG_DIR, img_file)
        add_image_with_caption(doc, img_p, "", width_inches=6.0, space_after=6)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 6: ER DIAGRAM
    # ----------------------------------------------------
    add_heading1(doc, "ER DIAGRAM", chapter_num=6)
    add_para(doc, "ADDITIONAL MASTER TABLES & ENTITY RELATIONSHIPS", font_size=12, bold=True, space_before=4, space_after=6)
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'er_diagram.png'), "Fig 6.1 Entity-Relationship Diagram of Campus Event Hub Database Schema", width_inches=6.2)
    add_para(doc, "The Entity-Relationship (ER) Diagram illustrates the relational integrity and cardinalities governing the database schema. Central entities USERS, STUDENTS, INSTRUCTORS, CLUBS, EVENTS, REGISTRATIONS, and OD_RECORDS are connected via foreign key constraints. Specifically, each INSTRUCTOR is assigned to exactly one CLUB; each EVENT is hosted by a recognized CLUB; and each REGISTRATION pairs a STUDENT roll number with an EVENT under a unique ticket key. This architecture prevents duplicate enrollments and provides full referential consistency across all live attendance and OD workflows.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 7: TECH STACK
    # ----------------------------------------------------
    add_heading1(doc, "TECH STACK", chapter_num=7)
    
    add_heading2(doc, "7.1 TECH STACK")
    tech_table = [
        ["Frontend", "React.js 18.2 (Vite 5.4)", "Single-page application delivering dynamic, accessible UI"],
        ["State Management", "React Context API", "Centralized auth, data, theme, and toast notification state"],
        ["HTTP Client", "Fetch API / Axios Interceptor", "REST API communication with Bearer JWT token injection"],
        ["Routing", "React Router DOM v6", "Client-side routing with role-scoped ProtectedRoute guards"],
        ["Backend", "Node.js v24 + Express.js Router", "RESTful API micro-services and business logic dispatch"],
        ["Database Layer", "MongoDB + In-Memory Abstraction", "Durable document storage with high-speed query indexing"],
        ["Authentication", "JSON Web Tokens (JWT)", "Stateless, cryptographically signed token verification"],
        ["Security Hardening", "Helmet, CORS, rateLimiter.js", "HTTP header protection, origin whitelisting, IP throttling"],
        ["Analytics & Export", "tableExport.js / Canvas", "Client/server-side CSV data exports and printable summaries"],
        ["Containerization", "Docker & Nginx", "Production-ready runtime container and reverse proxy"]
    ]
    add_custom_table(doc, ["Layer", "Technology", "Purpose"], tech_table, [1.5, 2.0, 2.75])
    
    add_heading2(doc, "7.2 ARCHITECTURE OVERVIEW")
    arch_table = [
        ["Model", "In-Memory Schemas + MongoDB", "Defines data structures, enforces unique constraints, handles query indexing"],
        ["View", "React.js + Tailwind Design System", "Renders role-scoped dashboards, live attendance desks, modals, and passes"],
        ["Controller", "Node.js + Express API Router", "Processes HTTP requests, executes business validation, coordinates Model and View"]
    ]
    add_custom_table(doc, ["Layer", "Technology", "Purpose"], arch_table, [1.5, 2.0, 2.75])

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 8: MODULES (8.0 to 8.9)
    # ----------------------------------------------------
    add_heading1(doc, "MODULES", chapter_num=8)
    
    add_heading2(doc, "8.0 Design Approach")
    add_para(doc, "Each module of the Campus Event Hub is systematically described here according to an industry-standard seven-step system design framework. This ensures structural completeness, consistency, and clear engineering rationale across all platform capabilities.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    steps_data = [
        ["1. Functional requirements", "What must the module do?", "Section x.1"],
        ["2. Non-functional requirements", "How fast, how secure, how available? CAP tradeoff?", "Section x.2"],
        ["3. Tech stack", "Which architectural tools suit this problem, and why?", "Section x.3"],
        ["4. Back-of-the-envelope", "What are the sizing, throughput, and memory estimates?", "Section x.4"],
        ["5. Low-level architecture", "Which components exist and how do requests flow?", "Section x.5 (diagram + flow)"],
        ["6. API design", "What is the REST contract between client and server?", "Section x.6"],
        ["7. DB design", "Which collections, primary keys, and indexes store the data?", "Section x.7"]
    ]
    add_custom_table(doc, ["Step", "Question it answers", "Presented in each module as"], steps_data, [1.6, 2.7, 1.95])
    
    add_heading3(doc, "Shared Baseline for All Modules")
    add_para(doc, "Non-functional baseline: Every incoming HTTP request traverses through Helmet (HTTP header hardening), strict CORS policy enforcement, payload size validation, IP rate limiting, and JWT authentication middleware before reaching business controllers. Under the CAP theorem, the platform prioritizes Consistency over Availability (CP) for all transactional operations (event capacity booking, attendance induction, and OD records), ensuring that concurrent registrations can never oversell a venue and students cannot register duplicate entries. All timestamps use UTC ISO-8601 formatting.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    sizing_data = [
        ["Active Student Body", "≈ 2,500 students", "Undergraduate and postgraduate campus student population"],
        ["Faculty Advisors & Staff", "≈ 50 faculty", "Club mentors, department coordinators, OD officers"],
        ["Accredited Clubs", "8 to 12 active chapters", "CSI, IEEE, IE, Robotics, Yoga, Sports, Fine Arts, Music"],
        ["Scheduled Events / Year", "≈ 120 events", "10 to 15 events per month during academic semesters"],
        ["Peak Daily Requests", "≈ 15,000 requests/day", "Registration rushes and live venue PIN check-in peaks"],
        ["Average Request Rate", "≈ 0.5 req/s", "Distributed over typical 8-hour college working day"],
        ["Peak Live Attendance Surge", "≈ 25–40 req/s", "Synchronized check-in at commencement of major events"]
    ]
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], sizing_data, [1.8, 1.8, 2.65])
    
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.0_overall_flow.png'), "Fig 8.0 Overall request flow of the Campus Event Hub Platform", width_inches=6.0)

    # 8.1 FOLDER STRUCTURE
    add_heading2(doc, "8.1 FOLDER STRUCTURE")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.1.1_highlevel_project.png'), "Fig 8.1.1 Highlevel view of project root directory", width_inches=5.8)
    
    add_para(doc, "8.1.1 BACKEND FOLDER (server/)", font_size=12, bold=True, space_before=6, space_after=2)
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.1.2_backend_folder.png'), "Fig 8.1.2 Backend Folder Structure – Modular API server and MongoDB integration", width_inches=5.8)
    
    add_para(doc, "8.1.2 FRONTEND FOLDER (src/)", font_size=12, bold=True, space_before=6, space_after=2)
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.1.4_frontend_folder.png'), "Fig 8.1.4 Frontend Folder Structure – Component hierarchy and role-scoped pages", width_inches=5.8)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.2 USER AUTHENTICATION & ACCESS CONTROL
    # ----------------------------------------------------
    add_heading2(doc, "8.2 USER AUTHENTICATION & ACCESS CONTROL")
    add_heading3(doc, "8.2.0 Purpose & Scope")
    add_para(doc, "Provides tokenized authentication, secure credential management, role-based route gating, and institutional domain validation across the entire collegiate ecosystem, preventing unauthorized data modification and privilege escalation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.2.1 Functional Requirements")
    add_bullet(doc, "Universal Identity Sign-In: ", "Users sign in via college email and password, receiving a cryptographically signed JWT bearer token and verified profile metadata (id, name, email, role).")
    add_bullet(doc, "Role-Based Redirection: ", "Upon successful sign-in, the system automatically redirects users to their designated role dashboard: Admin (/admin/dashboard), Instructor (/instructor/dashboard), OD Incharge (/od-incharge/dashboard), or Student (/student/dashboard).")
    add_bullet(doc, "Student Self-Registration: ", "Prospective student attendees register with full name, collegiate email, student roll number, department, degree, and study year.")
    add_bullet(doc, "Institutional Email Domain Check: ", "Enforces strict domain validation against college.edu (or configured domain) to prevent external unauthorized account registrations.")
    add_bullet(doc, "Password Lifecycle & Reset: ", "Users can update passwords securely, while administrators retain the privilege to toggle account active status or issue temporary reset tokens.")
    
    add_heading3(doc, "8.2.2 Non-Functional Requirements")
    add_bullet(doc, "Cryptographic Security: ", "Passwords are never stored in plaintext; all credentials use salted SHA-256 or bcrypt hashes with auto-generated unique salt values.")
    add_bullet(doc, "Brute-Force Protection: ", "IP-based rate limiting restricts authentication attempts to at most 15 requests per 15-minute window on /api/auth/login.")
    add_bullet(doc, "Stateless Session Scaling: ", "JWT tokens carry a 12-hour expiration window, eliminating server-side session state and supporting horizontal scaling.")
    add_bullet(doc, "Low Latency: ", "Token verification executes in microseconds per request; password verification is intentionally bounded to ~100ms for hashing cost.")
    
    add_heading3(doc, "8.2.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Credential Hashing", "Salted Hash (SHA-256 / bcrypt)", "Strong one-way cryptographic protection preventing rainbow table attacks"],
        ["Token Protocol", "Stateless JSON Web Token (JWT)", "Decouples authentication state from server memory, enabling easy scale"],
        ["Rate Limiting", "rateLimiter.js middleware", "Throttles abusive login brute-force attempts per client IP"],
        ["Route Guarding", "ProtectedRoute.jsx", "Client-side component inspecting role permissions and redirecting invalid sessions"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.2.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Total User Accounts", "≈ 2,550 accounts", "2,500 students + 40 faculty + 10 staff"],
        ["Daily Logins", "≈ 1,200 logins/day", "Peak morning logins and event check-in sessions"],
        ["Token Verification Volume", "≈ 15,000 verifications/day", "Every authenticated API request validates JWT signature"],
        ["CPU Cost per Login", "≈ 80–100 ms", "Controlled cryptographic hash cost per verification attempt"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.2.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.2.A_auth_arch.png'), "Fig 8.2.A Low-level architecture – USER AUTHENTICATION & ACCESS CONTROL", width_inches=6.0)
    add_para(doc, "Request flow: (1) Login.jsx submits credentials; rateLimiter.js verifies the IP request ceiling. (2) auth.js locates the account in Users collection, extracts the unique salt, and verifies the hash. (3) Upon success, a 12-hour JWT bearer token is signed and returned alongside user profile data. (4) The client stores the token in localStorage and attaches it to the Authorization header of subsequent requests. (5) ProtectedRoute.jsx intercepts navigation and confirms role clearance.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.2.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["POST", "/api/auth/login", "Public. Body: {email, password}. Returns JWT token and profile (id, name, role)."],
        ["POST", "/api/auth/register", "Public. Body: {name, email, password, rollNo, dept}. Validates college domain."],
        ["GET", "/api/auth/me", "Authenticated. Returns currently signed-in user profile from verified JWT token."],
        ["POST", "/api/auth/reset-password", "Public. Body: {email, code, newPassword}. Sets updated password hash."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.2.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Users", "PK: id\nUNIQUE: email", "id, name, email, passwordHash, passwordSalt, role, isActive, preferences, createdAt"],
        ["Audit_Logs", "PK: id\nMUL: actor", "id, timestamp, actor, action, target, ipAddress, details"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.2.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.2.1_login_portal.png'), "Fig 8.2.1 User Login Portal with Multi-Role Credentials & Quick Sign-in", width_inches=5.8)
    add_para(doc, "The login portal delivers a responsive authentication interface supporting secure email/password credential input, one-click quick-fill role cards for rapid testing across personas (Student, Instructor, Admin, OD Incharge), and Google OAuth simulation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.2.2_register_portal.png'), "Fig 8.2.2 Student Self-Registration Portal with Institutional Domain Validation", width_inches=5.8)
    add_para(doc, "The student registration screen allows undergraduate and postgraduate students to create self-service accounts, enforcing mandatory roll number specification, department selection, and institutional domain validation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.2.3_admin_permissions.png'), "Fig 8.2.3 Administrator System Permissions & Institutional Security Controls", width_inches=5.8)
    add_para(doc, "The administrative security console provides central control over allowed email domains, student registration toggles, active role permissions, and system audit logs, ensuring compliance with institutional policies.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.3 CAMPUS CLUB & ADVISOR MANAGEMENT
    # ----------------------------------------------------
    add_heading2(doc, "8.3 CAMPUS CLUB & ADVISOR MANAGEMENT (MASTER DATA)")
    add_heading3(doc, "8.3.0 Purpose & Scope")
    add_para(doc, "Unifies foundational collegiate records for recognized student organizations, technical chapters, faculty branch counselors, and venue infrastructure, providing an authoritative institutional directory for all event activities.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.3.1 Functional Requirements")
    add_bullet(doc, "Accredited Club Catalog: ", "Maintains centralized records for campus clubs (CSI, IEEE, IE, Robotics, Yoga, Sports, Fine Arts, Music) with unique codes, mission descriptions, and category tags.")
    add_bullet(doc, "One-to-One Advisor Allocation: ", "Binds each accredited club to an appointed faculty counselor, linking employee ID, designation, office room, office hours, and contact details.")
    add_bullet(doc, "Club Showcase Profiles: ", "Provides students with public club profile pages displaying advisor details, upcoming schedules, member counts, and chapter join links.")
    add_bullet(doc, "Pending Club Inception: ", "Administrators review, approve, or reject new student club chapter applications through a dedicated governance dashboard.")
    
    add_heading3(doc, "8.3.2 Non-Functional Requirements")
    add_bullet(doc, "High Read-to-Write Ratio: ", "Master club records are read heavily by attendees (100:1 ratio compared to writes), necessitating in-memory caching and optimized indexing.")
    add_bullet(doc, "Referential Integrity: ", "Foreign keys prevent orphaned events or memberships; a club cannot be deactivated while active scheduled events remain pending.")
    add_bullet(doc, "Access Authorization: ", "Only administrators may create new clubs or reallocate faculty advisors; advisors may only edit their assigned club profile.")
    
    add_heading3(doc, "8.3.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Club Showcase UI", "React.js + ClubLogo Component", "Renders rich visual club cards with category badges and member counts"],
        ["Advisor Mapping", "Relational foreign key constraints", "Enforces strict one-to-one mapping between faculty and assigned clubs"],
        ["Persistence", "MongoDB Clubs Collection", "Flexible document storage accommodating variable club assets and bios"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.3.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Recognized Clubs", "8 to 15 clubs", "Active collegiate technical chapters and cultural societies"],
        ["Faculty Advisors", "1 per club (≈ 8–15)", "One-to-one faculty counselor assignments"],
        ["Club Profile Views", "≈ 2,000 views/week", "Students browsing campus opportunities and chapter events"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.3.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.A_club_arch.png'), "Fig 8.3.A Low-level architecture – CAMPUS CLUB & ADVISOR MANAGEMENT", width_inches=6.0)
    add_para(doc, "Request flow: (1) Clubs.jsx requests the club catalog from apiRouter.js. (2) The controller returns active clubs with advisor and member counts. (3) Selecting a club loads ClubProfile.jsx with its scoped event list. (4) Club creation and advisor reassignment are restricted to the Admin role.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.3.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["GET", "/api/clubs", "Public. Returns array of accredited clubs with category, advisor name, and member count."],
        ["GET", "/api/clubs/:id", "Public. Returns detailed profile of a specific club chapter and its upcoming events."],
        ["POST", "/api/clubs", "Admin only. Creates a new campus club chapter with designated faculty advisor."],
        ["PUT", "/api/clubs/:id/advisor", "Admin only. Updates assigned faculty advisor mapping for a club."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.3.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Clubs", "PK: id\nUNIQUE: code", "id, code, name, category, leadAdvisorId, description, meetingVenue, memberCount, status"],
        ["Instructors", "PK: id\nUNIQUE: employeeId", "id, employeeId, name, email, designation, dept, assignedClub, officeRoom, phone"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.3.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.1_clubs_directory.png'), "Fig 8.3.1 Campus Clubs & Chapters Directory Interface", width_inches=5.8)
    add_para(doc, "The campus clubs directory displays all accredited student chapters with category tags, active member counts, and assigned faculty counselor information, allowing students to explore collegiate organizations.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.2_club_profile_csi.png'), "Fig 8.3.2 Individual Club Profile – Computer Society of India (CSI) Chapter", width_inches=5.8)
    add_para(doc, "The individual club profile page provides in-depth chapter information, faculty counselor office hours, upcoming workshops, and a one-click membership application button for eligible students.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.3_instructor_dashboard.png'), "Fig 8.3.3 Faculty Advisor Scoped Management Console", width_inches=5.8)
    add_para(doc, "The instructor dashboard is strictly scoped to the advisor's assigned club, presenting pending membership queues, active event schedules, live attendance controls, and chapter achievement publishing.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.4_instructor_profile.png'), "Fig 8.3.4 Faculty Advisor Profile & Academic Specializations Record", width_inches=5.8)
    add_para(doc, "The advisor profile page details the faculty mentor's employee code, academic department, office cabin location, consultation hours, and research specializations.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.3.5_admin_pending_clubs.png'), "Fig 8.3.5 Administrator Pending Club Applications & Governance Desk", width_inches=5.8)
    add_para(doc, "The administrative pending clubs screen enables institutional officials to evaluate new student chapter proposals, review founding faculty sponsors, and grant formal institutional accreditation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.4 EVENT LIFECYCLE & SCHEDULING MANAGEMENT
    # ----------------------------------------------------
    add_heading2(doc, "8.4 EVENT LIFECYCLE & SCHEDULING MANAGEMENT")
    add_heading3(doc, "8.4.0 Purpose & Scope")
    add_para(doc, "Orchestrates the entire lifecycle of collegiate events—from initial scheduling, capacity budgeting, and access gating to banner publishing, live status updates, and post-event archival.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.4.1 Functional Requirements")
    add_bullet(doc, "Event Creation & Publishing: ", "Faculty advisors schedule events by defining title, date, start/end time, physical venue, category (Workshop, Hackathon, Symposium), and capacity ceiling.")
    add_bullet(doc, "Granular Access Gating: ", "Supports three distinct access tiers: Public (open to all students), Members Only (restricted to approved chapter members), and Club Scoped.")
    add_bullet(doc, "Dynamic 4-Digit Venue PIN: ", "The system generates an automatic, unique 4-digit venue hall PIN for every created event, utilized for attendee check-in.")
    add_bullet(doc, "Real-Time Capacity Tracker: ", "Maintains an atomic enrolledCount counter, closing enrollment automatically when capacity is reached.")
    add_bullet(doc, "Promotional Asset Hosting: ", "Supports poster and banner uploads to deliver visual engagement across public and student portals.")
    
    add_heading3(doc, "8.4.2 Non-Functional Requirements")
    add_bullet(doc, "Concurrency & Atomicity: ", "Prevents race conditions during registration rushes; enrollment operations use atomic increments to enforce capacity limits.")
    add_bullet(doc, "Scheduling Conflict Prevention: ", "Validates venue and time slot availability to eliminate simultaneous room booking conflicts across departments.")
    add_bullet(doc, "Responsive Browsing: ", "Event catalogs load in under 400ms with client-side category and date filtering.")
    
    add_heading3(doc, "8.4.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Event Scheduling Engine", "React modal + date/time pickers", "Interactive client-side validation preventing overlapping date entries"],
        ["Capacity Enforcement", "Atomic database increment", "Prevents overselling available auditorium and lab seats"],
        ["Gated Access Logic", "accessControl.js utility", "Enforces chapter membership checks prior to allowing enrollment"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.4.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Events per Year", "≈ 120 events", "10 to 15 events per month during academic semesters"],
        ["Average Capacity", "100 seats / event", "Auditoriums (250) and computing laboratories (60)"],
        ["Total Registrations / Year", "≈ 8,500 registrations", "Derived from average 70 attendees per event"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.4.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.4.A_event_arch.png'), "Fig 8.4.A Low-level architecture – EVENT LIFECYCLE & SCHEDULING MANAGEMENT", width_inches=6.0)
    add_para(doc, "Request flow: (1) ManageEvents.jsx loads club-specific events. (2) Submitting the Add Event modal triggers POST /api/events with schedule, capacity, and access settings. (3) The server assigns a 4-digit venue PIN and persists the record. (4) EventDetail.jsx evaluates attendee membership status before unlocking registration.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.4.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["GET", "/api/events", "Public. Returns list of upcoming events with date, venue, capacity, and access level."],
        ["POST", "/api/events", "Instructor/Admin. Creates event: {title, clubId, date, time, venue, capacity, accessLevel}."],
        ["PUT", "/api/events/:id", "Instructor/Admin. Updates event details or marks status as completed/cancelled."],
        ["GET", "/api/events/:id", "Public. Returns full event record including poster banner, agenda, and enrolled count."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.4.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Events", "PK: id\nMUL: clubId", "id, title, clubId, date, time, venue, category, accessLevel, capacity, enrolledCount, venuePin, status, posterUrl"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.4.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.4.1_landing_events.png'), "Fig 8.4.1 Public Upcoming Events Catalog with Category Filters & Badges", width_inches=5.8)
    add_para(doc, "The public events showcase features dynamic category filters (Technical, Cultural, Sports), date badges, venue indicators, and access tier tags (Public vs. Members Only) for all upcoming collegiate activities.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.4.2_event_detail.png'), "Fig 8.4.2 Event Detail View with Banner Poster, Eligibility Verification & Registration CTA", width_inches=5.8)
    add_para(doc, "The event detail screen displays the high-resolution event banner poster, organizing team, physical venue hall, seat capacity counter, and the enrollment action button with real-time membership eligibility validation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.4.3_instructor_manage_events.png'), "Fig 8.4.3 Faculty Advisor Event Management Console & PIN Administration", width_inches=5.8)
    add_para(doc, "The advisor event management console provides complete control over scheduled events, revealing generated 4-digit venue hall PINs, enrolled contestant numbers, live attendance links, and CSV/PDF export options.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.5 STUDENT CHAPTER MEMBERSHIP & ELIGIBILITY
    # ----------------------------------------------------
    add_heading2(doc, "8.5 STUDENT CHAPTER MEMBERSHIP & ELIGIBILITY")
    add_heading3(doc, "8.5.0 Purpose & Scope")
    add_para(doc, "Regulates student affiliation with accredited campus chapters, enforcing membership quotas, application screening, and verification workflows required for gated club activities.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.5.1 Functional Requirements")
    add_bullet(doc, "Chapter Application Submission: ", "Students apply to join recognized clubs through the club profile page, submitting their academic credentials and statement of intent.")
    add_bullet(doc, "Faculty Advisor Screening: ", "The assigned faculty counselor reviews pending applications, approving or rejecting candidates based on chapter capacity and prerequisites.")
    add_bullet(doc, "Institutional Membership Audit: ", "Administrators monitor campus-wide membership rosters with search and filter controls across clubs and departments.")
    add_bullet(doc, "Gated Event Unlocking: ", "Approval immediately updates the student's profile, granting instant eligibility to enroll in members-only chapter hackathons and technical clinics.")
    
    add_heading3(doc, "8.5.2 Non-Functional Requirements")
    add_bullet(doc, "Consistency: ", "Membership state is transactional; approved status propagates instantaneously across the client state and event eligibility checks.")
    add_bullet(doc, "Privacy & Scoping: ", "Faculty advisors can only view membership applications for their assigned club, ensuring student data confidentiality.")
    
    add_heading3(doc, "8.5.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Application Roster UI", "React table with live status filter", "Enables rapid batch processing of pending applicant queues"],
        ["Scoping Security", "Backend advisor role validation", "Restricts membership approval authority to the verified club advisor"],
        ["State Synchronization", "DataContext refresh protocol", "Instantly updates student membership badges without full page reload"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.5.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Total Active Members", "≈ 1,850 memberships", "Students holding one or more club affiliations"],
        ["Applications / Semester", "≈ 400 new applications", "Membership drives conducted at semester commencement"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.5.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.5.A_membership_arch.png'), "Fig 8.5.A Low-level architecture – STUDENT CHAPTER MEMBERSHIP", width_inches=6.0)
    add_para(doc, "Request flow: (1) Student applies via Clubs.jsx. (2) Application is stored with pending status. (3) Advisor opens ManageMemberships.jsx to inspect applicants. (4) Selecting Approve triggers PATCH /api/memberships/:id/status, setting status to verified and unlocking members-only events.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.5.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["GET", "/api/memberships", "Instructor/Admin. Returns student applications filtered by club and status."],
        ["POST", "/api/memberships/apply", "Student only. Submits membership application for specified club."],
        ["PATCH", "/api/memberships/:id/status", "Instructor/Admin. Body: {status: 'verified'|'rejected'}."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.5.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Students", "PK: id\nUNIQUE: rollNo\nMUL: chapter", "id, rollNo, name, email, dept, degree, year, chapter, verificationStatus, attendanceCount"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.5.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.5.1_instructor_memberships.png'), "Fig 8.5.1 Faculty Advisor Club Membership Application Review Console", width_inches=5.8)
    add_para(doc, "The instructor membership console displays pending student applications with student name, roll number, department, application date, and quick action buttons to grant or reject membership.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.6 EVENT REGISTRATION & DIGITAL PASS
    # ----------------------------------------------------
    add_heading2(doc, "8.6 EVENT REGISTRATION & DIGITAL PASS ISSUANCE")
    add_heading3(doc, "8.6.0 Purpose & Scope")
    add_para(doc, "Governs attendee registration, seat allocation, duplicate prevention, and the generation of tamper-resistant digital event passes with unique ticket codes and QR verification data.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.6.1 Functional Requirements")
    add_bullet(doc, "1-Click Registration Flow: ", "Eligible students enroll in scheduled events with instant seat confirmation and confirmation dialog.")
    add_bullet(doc, "Unique Ticket ID Generation: ", "Assigns an immutable, high-entropy ticket identifier (e.g., TKT-CSI-2026-084) to every valid registration.")
    add_bullet(doc, "Digital Passbook & QR Code: ", "Generates an interactive digital pass containing event details, student roll number, seat allocation, and scannable QR verification code.")
    add_bullet(doc, "Duplicate Registration Lock: ", "Enforces database uniqueness on (eventId, studentEmail), preventing duplicate ticket generation.")
    add_bullet(doc, "My Registrations Hub: ", "A dedicated student portal displaying all active and past event passes with attendance verification status and certificate download links.")
    
    add_heading3(doc, "8.6.2 Non-Functional Requirements")
    add_bullet(doc, "Integrity & Idempotency: ", "Concurrent enrollment requests from the same student result in exactly one ticket record.")
    add_bullet(doc, "Pass Generation Speed: ", "Digital passes render instantaneously client-side without external network dependencies.")
    
    add_heading3(doc, "8.6.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Ticket Generation", "Crypto unique token algorithm", "Creates cryptographically unique ticket pass identifiers"],
        ["QR Code Rendering", "SVG/Canvas QR generator", "Produces vector-sharp scannable QR codes on all mobile devices"],
        ["Pass Presentation", "Modern CSS Glassmorphism Card", "Delivers a premium, mobile-optimized digital pass aesthetic"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.6.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Registrations per Year", "≈ 8,500 tickets", "Derived from 120 events × 70 attendees"],
        ["Storage per Ticket", "≈ 0.8 KB", "Compact JSON record including verification timestamps"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.6.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.6.A_registration_arch.png'), "Fig 8.6.A Low-level architecture – EVENT REGISTRATION & DIGITAL PASS ISSUANCE", width_inches=6.0)
    add_para(doc, "Request flow: (1) Student clicks Register on EventDetail.jsx. (2) Confirmation modal confirms academic details. (3) POST /api/events/:id/register writes the registration record and increments enrolledCount. (4) Confirmation.jsx displays the generated pass. (5) Passes are persistently accessible in MyRegistrations.jsx.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.6.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["POST", "/api/events/:id/register", "Student only. Creates registration and returns unique ticket ID and pass details."],
        ["GET", "/api/registrations/my", "Student only. Returns all event passes registered by the signed-in student."],
        ["DELETE", "/api/registrations/:ticketId", "Student/Admin. Cancels registration and decrements event enrolled count."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.6.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Registrations", "PK: id\nUNIQUE: ticketId\nMUL: eventId, studentEmail", "id, ticketId, eventId, studentEmail, studentName, rollNo, registeredAt, status, checkInTime, verificationMethod"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.6.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.6.1_my_registrations.png'), "Fig 8.6.1 Student My Registrations Hub with Digital Passes, Status Badges & PIN Check-in", width_inches=5.8)
    add_para(doc, "The My Registrations console presents active event passes with unique ticket codes, physical venue designations, attendance verification badges (Registered / Present), self-PIN check-in prompts, and certificate links.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.7 LIVE ATTENDANCE DESK & VENUE PIN
    # ----------------------------------------------------
    add_heading2(doc, "8.7 LIVE ATTENDANCE DESK & SECURE VENUE PIN VERIFICATION")
    add_heading3(doc, "8.7.0 Purpose & Scope")
    add_para(doc, "Regulates physical attendee verification during live events, replacing paper signatures with synchronized 4-digit venue hall PIN projections and interactive faculty advisor consoles to eradicate proxy check-ins.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.7.1 Functional Requirements")
    add_bullet(doc, "Dual-Mode Verification: ", "Supports two simultaneous verification modes: (1) Attendee self-check-in by entering the projected 4-digit venue PIN, and (2) Faculty advisor interactive check-in desk.")
    add_bullet(doc, "Dynamic 4-Digit Hall PIN: ", "The event-scoped 4-digit PIN is displayed prominently on the instructor console for auditorium screen projection during the check-in window.")
    add_bullet(doc, "Live Roster & Metric Gauges: ", "The advisor console renders registered, present, and absent attendee counts, alongside a live attendance percentage progress ring.")
    add_bullet(doc, "1-Click Status Toggling: ", "Advisors can toggle individual contestant status between Present and Absent, with automatic verification audit logging.")
    add_bullet(doc, "Contestant Roster Export: ", "Exports the finalized attendee list to CSV or PDF for institutional records.")
    
    add_heading3(doc, "8.7.2 Non-Functional Requirements")
    add_bullet(doc, "Proxy Prevention: ", "Venue PINs are short-lived and valid only during the active event window; check-in attempts require student authentication.")
    add_bullet(doc, "Sub-Second Latency: ", "Self-check-in PIN validation executes in under 200ms to handle concurrent auditorium check-in rushes.")
    
    add_heading3(doc, "8.7.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Live Console UI", "React stateful attendance table", "Instant UI updates upon student check-in without full page refreshes"],
        ["PIN Verification Engine", "Server-side constant-time compare", "Validates 4-digit venue PIN securely against event records"],
        ["Report Exporter", "Client-side tableExport utility", "Generates printable attendee PDF rosters and CSV spreadsheets"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.7.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Peak Check-in Surge", "≈ 100 check-ins / 5 min", "Students entering auditorium at event start"],
        ["Throughput Requirement", "≈ 25–40 req/s peak", "Handled comfortably by Node.js single-process loop"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.7.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.7.A_attendance_arch.png'), "Fig 8.7.A Low-level architecture – LIVE ATTENDANCE DESK & VENUE PIN VERIFICATION", width_inches=6.0)
    add_para(doc, "Request flow: (1) Advisor opens CheckIn.jsx and projects the 4-digit venue PIN. (2) Student submits the PIN via MyRegistrations.jsx. (3) apiRouter.js verifies PIN accuracy and marks registration status as 'present' with timestamp and 'PIN' verification method. (4) The advisor's live roster reflects the update instantly.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.7.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["POST", "/api/attendance/check-in-pin", "Student only. Body: {eventId, venuePin}. Marks registration as verified present."],
        ["GET", "/api/events/:id/attendees", "Instructor/Admin. Returns attendee list with roll numbers, status, and check-in times."],
        ["PATCH", "/api/attendance/:regId", "Instructor only. Body: {status: 'present'|'absent'}. Advisor manual toggle."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.7.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Registrations", "PK: id\nMUL: eventId", "status ('registered','present','absent'), checkInTime, verificationMethod ('PIN','Desk')"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.7.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.7.1_instructor_live_attendance.png'), "Fig 8.7.1 Faculty Advisor Live Attendance Desk Console with Projected 4-Digit Venue PIN", width_inches=5.8)
    add_para(doc, "The live attendance desk console displays the projected 4-digit venue hall PIN, registered attendee metrics, attendance percentage gauges, individual contestant rows, and toggle controls for advisors.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.8 ON-DUTY (OD) PERMISSION WORKFLOW
    # ----------------------------------------------------
    add_heading2(doc, "8.8 ON-DUTY (OD) PERMISSION & VERIFICATION WORKFLOW")
    add_heading3(doc, "8.8.0 Purpose & Scope")
    add_para(doc, "Standardizes the institutional academic leave permission workflow, enabling students to apply for attendance waivers, upload participation proofs, and receive authenticated sanctions from faculty advisors and the Chief OD Officer.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.8.1 Functional Requirements")
    add_bullet(doc, "Student OD Submission: ", "Attendees submit permission requests by selecting the verified event, providing leave dates, articulating participation reasons, and attaching certificate or pass proofs.")
    add_bullet(doc, "Two-Tier Institutional Workflow: ", "Requests follow a formal governance pipeline: Submitted → Advisor Endorsed → OD Incharge Sanctioned (or Rejected with remarks).")
    add_bullet(doc, "Document Proof Verification Modal: ", "OD Incharges inspect uploaded certificates, digital passes, and event attendance timestamps within an in-app verification preview modal.")
    add_bullet(doc, "Permanent Records Archive: ", "Sanctioned OD records are archived permanently with unique grant identifiers, academic year tags, and searchable department filters.")
    add_bullet(doc, "Official Sanction Export: ", "Exports approved OD lists to CSV and PDF for departmental academic record reconciliation.")
    
    add_heading3(doc, "8.8.2 Non-Functional Requirements")
    add_bullet(doc, "Auditability & Traceability: ", "Every status transition logs the officer identity, timestamp, and review remarks, establishing an incontrovertible audit trail.")
    add_bullet(doc, "Data Protection: ", "Proof files and OD records are protected by role-based authorization, accessible only to students, advisors, and OD incharge faculty.")
    
    add_heading3(doc, "8.8.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Request Submission UI", "StudentPermissions.jsx form", "Guided step-by-step leave application with file attachment upload"],
        ["Proof Inspection", "ODProofVerification.jsx modal", "In-line preview of digital ticket passes and event certificates"],
        ["Archival Engine", "ODRecordsArchive.jsx + tableExport", "Searchable data grid with one-click official departmental export"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.8.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["OD Requests / Year", "≈ 4,500 requests", "≈ 50% of event attendees applying for academic attendance waivers"],
        ["Storage per OD Record", "≈ 1.5 KB", "Metadata plus attached proof reference string"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.8.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.A_od_arch.png'), "Fig 8.8.A Low-level architecture – ON-DUTY (OD) PERMISSION WORKFLOW", width_inches=6.0)
    add_para(doc, "Request flow: (1) Student files leave via StudentPermissions.jsx. (2) POST /api/od/request registers the permission record. (3) OD Incharge views pending requests in ODRequests.jsx and opens the proof verification dialog. (4) Granting sanction transitions the record to 'sanctioned' and writes an immutable entry into OD_Records.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.8.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["POST", "/api/od/request", "Student only. Body: {eventId, reason, proofUrl}. Submits new leave permission request."],
        ["GET", "/api/od/requests", "OD Incharge/Admin. Returns pending permission requests with student roll numbers."],
        ["PATCH", "/api/od/:id/status", "OD Incharge. Body: {status: 'sanctioned'|'rejected', comments}. Finalizes sanction."],
        ["GET", "/api/od/archive", "OD Incharge/Admin. Returns permanently archived sanctioned OD records."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.8.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Permission_Requests", "PK: id\nMUL: studentEmail", "id, studentEmail, rollNo, eventId, clubName, requestDate, reason, proofUrl, status, comments"],
        ["OD_Records", "PK: id\nUNIQUE: requestId", "id, requestId, studentEmail, rollNo, eventName, odDate, sanctionedBy, sanctionDate, academicYear"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.8.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.1_student_od_request.png'), "Fig 8.8.1 Student On-Duty (OD) Permission Request Application Screen", width_inches=5.8)
    add_para(doc, "The student OD request form enables students to select attended events, specify departure/arrival times, detail academic reasons, and attach verification proofs.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.2_od_incharge_dashboard.png'), "Fig 8.8.2 Chief OD Officer Governance Control Center & Metrics", width_inches=5.8)
    add_para(doc, "The OD Incharge dashboard summarizes pending leaves, total sanctioned attendance waivers, and department-wise distribution charts, enabling real-time administrative oversight.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.3_od_requests_table.png'), "Fig 8.8.3 OD Permission Applications Review & Action Table", width_inches=5.8)
    add_para(doc, "The OD request management table allows officers to filter applications by status, inspect student roll numbers and event dates, open verification dialogs, and sanction waivers.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.4_od_records_archive.png'), "Fig 8.8.4 Permanent Sanctioned OD Records Archive & Institutional Export Desk", width_inches=5.8)
    add_para(doc, "The OD records archive stores all formally granted attendance waivers, providing searchable academic year filters and export tools to transmit authorized attendance lists to university examiners.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.8.5_od_analytics.png'), "Fig 8.8.5 Department-Wise OD Analytics & Leave Distribution Metrics", width_inches=5.8)
    add_para(doc, "The OD analytics interface visualizes department-wise participation ratios, monthly leave request trends, and approval percentage distributions across collegiate academic branches.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # 8.9 EXECUTIVE DASHBOARD & CAMPUS ANALYTICS
    # ----------------------------------------------------
    add_heading2(doc, "8.9 EXECUTIVE DASHBOARD & CAMPUS ANALYTICS")
    add_heading3(doc, "8.9.0 Purpose & Scope")
    add_para(doc, "Delivers institutional transparency and executive business intelligence through live KPI monitoring, student participation transcripts, club performance rankings, and multi-criteria report generation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.9.1 Functional Requirements")
    add_bullet(doc, "Campus Executive KPI Cards: ", "Displays active campus clubs, total student members, scheduled yearly events, and sanctioned OD counts with real-time aggregation.")
    add_bullet(doc, "Student Participation Transcript: ", "Provides students with an accredited co-curricular transcript documenting verified attendances, club memberships, and earned honors.")
    add_bullet(doc, "Achievements Leaderboard: ", "Showcases collegiate awards, national hackathon trophies, and club milestones across the university community.")
    add_bullet(doc, "Institutional Settings & Theming: ", "Empowers users to customize interface appearance (Light/Dark themes, Sandal accent palette, font sizing, and notification preferences).")
    add_bullet(doc, "AI Assistant Integration: ", "Features an embedded intelligent campus guide powered by Google Gemini to answer questions regarding club rules, upcoming deadlines, and OD policies.")
    
    add_heading3(doc, "8.9.2 Non-Functional Requirements")
    add_bullet(doc, "Read-Only Optimization: ", "Analytical queries aggregate across indexed collections without locking transactional tables, preventing latency during event check-ins.")
    add_bullet(doc, "Dashboard Load Performance: ", "The executive control center loads all analytical charts and summary metric cards in under 1.2 seconds.")
    
    add_heading3(doc, "8.9.3 Tech Stack")
    add_custom_table(doc, ["Concern", "Choice", "Why it fits this module"], [
        ["Metrics Aggregation", "In-memory / MongoDB aggregate pipeline", "Computes department totals, monthly trends, and member counts swiftly"],
        ["Visualization", "Chart.js / Responsive CSS Canvas", "Renders beautiful interactive bar charts and attendance progress indicators"],
        ["AI Campus Assistant", "Gemini Assistant module (assistant.js)", "Provides natural language event search and campus policy guidance"]
    ], [1.5, 2.0, 2.75])
    
    add_heading3(doc, "8.9.4 Back-of-the-Envelope Estimation")
    add_custom_table(doc, ["Quantity", "Estimate", "Basis"], [
        ["Dashboard Views / Day", "≈ 800 views/day", "Students checking schedules and faculty reviewing analytics"],
        ["Analytics Aggregates", "5 core aggregations", "Total events, attendees, clubs, ODs, and monthly series"]
    ], [1.8, 1.8, 2.65])
    
    add_heading3(doc, "8.9.5 Low-Level Architecture")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.A_analytics_arch.png'), "Fig 8.9.A Low-level architecture – EXECUTIVE DASHBOARD & CAMPUS ANALYTICS", width_inches=6.0)
    add_para(doc, "Request flow: (1) Admin opens Dashboard.jsx. (2) apiRouter.js triggers aggregated metrics queries across clubs, events, registrations, and OD records. (3) Aggregated JSON payloads are returned to the client and rendered via reactive metric cards, charts, and data tables.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.25)
             
    add_heading3(doc, "8.9.6 API Design")
    add_custom_table(doc, ["Method", "Endpoint", "Purpose / contract"], [
        ["GET", "/api/stats", "Public. Returns high-level platform counters (active clubs, student members, events, ODs)."],
        ["GET", "/api/analytics/clubs", "Instructor/Admin. Returns club-wise event counts, enrollment rates, and member growth."],
        ["GET", "/api/assistant/chat", "Authenticated. Body: {message}. Answers queries via embedded Gemini AI assistant."]
    ], [1.1, 2.1, 3.05])
    
    add_heading3(doc, "8.9.7 DB Design")
    add_custom_table(doc, ["Table", "Keys & indexes", "Key columns"], [
        ["Aggregated Views", "Read-only across 6 collections", "Events, Registrations, Clubs, Students, OD_Records, System_Settings"]
    ], [1.5, 1.8, 2.95])
    
    add_heading3(doc, "8.9.8 Screenshots")
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.4_admin_dashboard_kpis.png'), "Fig 8.9.4 Institutional Administrator Control Center with Live KPI Gauges & Club Directory", width_inches=5.8)
    add_para(doc, "The administrator control center consolidates campus-wide activity metrics, listing 8 accredited clubs, 8 faculty branch counselors, 9 active events, and student membership distributions.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.1_student_dashboard.png'), "Fig 8.9.1 Student Personalized Portal with Quick Actions & Event Calendar", width_inches=5.8)
    add_para(doc, "The student dashboard welcomes attendees with their personal academic profile, approved club chapter badges, upcoming event calendar, and quick access buttons to digital passes.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.2_participation_history.png'), "Fig 8.9.2 Student Co-Curricular Participation & Attendance Transcript", width_inches=5.8)
    add_para(doc, "The participation transcript documents verified event attendances, indicating exact check-in timestamps, verification methods (PIN vs. Desk), and certificate download eligibility.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.3_campus_achievements.png'), "Fig 8.9.3 Campus Achievements & Club Trophy Leaderboard Showcase", width_inches=5.8)
    add_para(doc, "The campus achievements board celebrates university milestones, displaying inter-collegiate hackathon victories, national awards, and student distinction badges.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)
             
    add_image_with_caption(doc, os.path.join(FIG_DIR, 'fig_8.9.5_global_settings.png'), "Fig 8.9.5 Global Appearance, Accessibility & Institutional Notification Preferences", width_inches=5.8)
    add_para(doc, "The global settings module allows students and staff to personalize interface themes (Light/Dark/System), select Sandal accent themes, adjust typography sizes, and configure alert channels.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 9: CONCLUSION
    # ----------------------------------------------------
    add_heading1(doc, "CONCLUSION", chapter_num=9)
    
    add_para(doc, "The Campus Event Hub provides a complete digital solution for managing the major activities involved in collegiate club governance, event scheduling, contestant registration, live attendance verification, and academic On-Duty leave processing. The system integrates club master data management, event lifecycle scheduling, chapter membership approvals, digital pass issuance, dynamic 4-digit venue hall PIN attendance, OD leave verification, executive dashboards, and multi-criteria reports within a single, high-performance application. By replacing manual paperwork and disconnected processes, it vastly improves the accuracy, consistency, and accessibility of operational information across higher education institutions.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    add_para(doc, "The application was developed using React 18 for the frontend single-page application, Node.js and Express for the RESTful backend API services, and MongoDB with transactional consistency layers for durable document persistence. Its client-server architecture supports structured communication between the user interface, application server, and database. Cryptographic password hashing, stateless JSON Web Token (JWT) authentication, five-tier role-based access control, request rate limiting, Helmet HTTP hardening, and protected client routes ensure robust security against unauthorized data modifications and privilege escalation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    add_para(doc, "The completed project demonstrates how a web-based information system can simplify campus operations, eliminate proxy attendance, reduce administrative overhead, minimize recording errors, and improve decision-making through live analytics. Its modular architecture ensures easy maintainability and allows future enhancements, such as integration with university ERP databases and automated SMS notifications, to be seamlessly introduced. Overall, the Campus Event Hub successfully meets its objective of providing a secure, organized, and efficient platform for managing collegiate activities and student participation.",
             font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.25)

    doc.save(OUTPUT_DOCX)
    print(f"SUCCESS: Report saved to {OUTPUT_DOCX}")

if __name__ == "__main__":
    build_complete_academic_report()
