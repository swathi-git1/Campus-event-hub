import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from schema_tables_data import COLLECTIONS_DATA, RELATIONSHIP_TABLE_DATA
from modules_content_data import MODULES_DATA

REPORT_DIR = 'Campus_Event_Hub_Report'
FIG_DIR = os.path.join(REPORT_DIR, 'figures')
SUPPORT_DIR = os.path.join(REPORT_DIR, 'supporting_files')
OUTPUT_DOCX = os.path.join(REPORT_DIR, 'Final_Report.docx')

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=35, bottom=35, left=70, right=70):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_run_font_tnr(run, font_size=12, bold=False, italic=False, underline=False):
    run.font.name = "Times New Roman"
    run.font.size = Pt(font_size)
    run.bold = bold
    run.italic = italic
    run.underline = underline
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
    rPr.append(rFonts)

def add_p(doc, text="", font_size=12, bold=False, italic=False, underline=False,
          align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, line_spacing=1.18,
          page_break_before=False, keep_with_next=False):
    p = doc.add_paragraph()
    p.alignment = align
    if space_before:
        p.paragraph_format.space_before = Pt(space_before)
    if space_after:
        p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if page_break_before:
        p.paragraph_format.page_break_before = True
    if keep_with_next:
        p.paragraph_format.keep_with_next = True
        
    if text:
        r = p.add_run(text)
        set_run_font_tnr(r, font_size=font_size, bold=bold, italic=italic, underline=underline)
    return p

def add_bullet_item(doc, lead_bold, text_rest, space_after=3):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.18
    
    r_bullet = p.add_run("• ")
    set_run_font_tnr(r_bullet, font_size=11)
    
    if lead_bold:
        r_lead = p.add_run(lead_bold)
        set_run_font_tnr(r_lead, font_size=11, bold=True)
        
    r_rest = p.add_run(text_rest)
    set_run_font_tnr(r_rest, font_size=11)
    return p

def add_native_table(doc, headers, data, col_widths=None, space_after=6, header_bg="F2F2F2", font_size=9):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="000000", sz="4")
    
    # Header row
    hdr_row = table.rows[0]
    for idx, heading in enumerate(headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, header_bg)
        set_cell_margins(cell, top=35, bottom=35, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        r = p.add_run(heading)
        set_run_font_tnr(r, font_size=font_size + 0.5, bold=True)
        
    # Data rows
    for r_idx, row_data in enumerate(data):
        row = table.rows[r_idx + 1]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            r = p.add_run(str(val))
            set_run_font_tnr(r, font_size=font_size)
            
    # Widths
    if col_widths:
        for idx, width in enumerate(col_widths):
            for row in table.rows:
                row.cells[idx].width = Inches(width)
                
    p_last = doc.add_paragraph()
    p_last.paragraph_format.space_before = Pt(0)
    p_last.paragraph_format.space_after = Pt(space_after)
    return table

def add_figure(doc, img_name, caption_text, expl_text=None, width_in=None, height_in=None, space_after=6):
    img_path = os.path.join(FIG_DIR, img_name)
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(2)
        p_img.paragraph_format.keep_with_next = True
        r_img = p_img.add_run()
        if height_in:
            r_img.add_picture(img_path, height=Inches(height_in))
        elif width_in:
            r_img.add_picture(img_path, width=Inches(width_in))
        else:
            r_img.add_picture(img_path, width=Inches(4.8))
        
        if caption_text:
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(4)
            if expl_text:
                p_cap.paragraph_format.keep_with_next = True
            r_cap = p_cap.add_run(caption_text)
            set_run_font_tnr(r_cap, font_size=10, italic=True)
            
        if expl_text:
            add_p(doc, expl_text, font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=space_after, line_spacing=1.18)
    else:
        print(f"WARNING: Image not found: {img_path}")

def generate_report(toc_page_map=None):
    doc = Document()
    
    # Normal style font defaults
    doc.styles['Normal'].font.name = 'Times New Roman'
    doc.styles['Normal']._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
    doc.styles['Normal']._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    doc.styles['Normal']._element.rPr.rFonts.set(qn('w:cs'), 'Times New Roman')
    
    # Page setup (A4, 1 inch margins, border on all pages, centered footer numbering)
    sec = doc.sections[0]
    sec.page_width = Pt(595.3)
    sec.page_height = Pt(841.9)
    sec.top_margin = Pt(72.0)
    sec.bottom_margin = Pt(72.0)
    sec.left_margin = Pt(72.0)
    sec.right_margin = Pt(72.0)
    sec.different_first_page_header_footer = False
    
    # Black page border on all pages (matching reference)
    pgBorders = parse_xml(
        f'<w:pgBorders {nsdecls("w")} w:display="allPages" w:offsetFrom="page">'
        f'<w:top w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:left w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:bottom w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'<w:right w:val="single" w:color="000000" w:sz="6" w:space="24"/>'
        f'</w:pgBorders>'
    )
    sec._sectPr.append(pgBorders)
    
    # Page numbering starts at 1, centered inside border
    pgNumType = parse_xml(f'<w:pgNumType {nsdecls("w")} w:start="1"/>')
    sec._sectPr.append(pgNumType)
    
    footer = sec.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    f_p.paragraph_format.space_before = Pt(0)
    f_p.paragraph_format.space_after = Pt(0)
    fld = parse_xml(
        f'<w:fldSimple {nsdecls("w")} w:instr="PAGE">'
        f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr><w:t>1</w:t></w:r>'
        f'</w:fldSimple>'
    )
    f_p._p.append(fld)
    
    logo_path = os.path.join(SUPPORT_DIR, 'college_logo.png')

    # =========================================================================
    # PAGE 1: TITLE PAGE
    # =========================================================================
    add_p(doc, "CAMPUS EVENT HUB", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=28, space_after=14)
    add_p(doc, "23CS54C – MODERN WEB TECHNOLOGIES", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_p(doc, "Submitted by", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    add_p(doc, "GOMATHI S    24104058", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
    add_p(doc, "In partial fulfillment for the award of the degree", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "of", font_size=12, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "BACHELOR OF ENGINEERING", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "in", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "COMPUTER SCIENCE AND ENGINEERING", font_size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)
    
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(8)
        p_logo.paragraph_format.space_after = Pt(8)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.35))
        
    add_p(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_p(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "K.R.NAGAR, KOVILPATTI – 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_p(doc, "OCTOBER - 2026", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)

    # =========================================================================
    # PAGE 2: BONAFIDE CERTIFICATE
    # =========================================================================
    add_p(doc, "NATIONAL ENGINEERING COLLEGE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2, page_break_before=True)
    add_p(doc, "(An Autonomous Institution affiliated to Anna University, Chennai)", font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "K.R.NAGAR, KOVILPATTI - 628503", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    
    if os.path.exists(logo_path):
        p_logo2 = doc.add_paragraph()
        p_logo2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo2.paragraph_format.space_before = Pt(6)
        p_logo2.paragraph_format.space_after = Pt(6)
        r_logo2 = p_logo2.add_run()
        r_logo2.add_picture(logo_path, width=Inches(1.3))
        
    add_p(doc, "BONAFIDE CERTIFICATE", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=20, space_after=16)
    add_p(doc, "This is to certify that this project report, “Campus Event Hub”, is the bonafide work of GOMATHI S (24104058) who carried out the project work under my supervision.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=32, line_spacing=1.4)
    
    add_p(doc, "Course Instructor/Guide", font_size=12, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=28, space_after=28)
    
    add_p(doc, "Submitted to the 23CS54C – MODERN WEB TECHNOLOGIES Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ____________",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=32, line_spacing=1.4)
    
    p_ex = doc.add_paragraph()
    p_ex.paragraph_format.space_before = Pt(32)
    p_ex.paragraph_format.space_after = Pt(0)
    r_ex1 = p_ex.add_run("Internal Examiner")
    set_run_font_tnr(r_ex1, font_size=12, bold=True)
    r_tab = p_ex.add_run("\t\t\t\t\t\t")
    r_ex2 = p_ex.add_run("Co Examiner")
    set_run_font_tnr(r_ex2, font_size=12, bold=True)

    # =========================================================================
    # PAGE 3: TABLE OF CONTENTS
    # =========================================================================
    add_p(doc, "TABLE OF CONTENTS", font_size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=18, page_break_before=True)
    
    pm = toc_page_map or {
        "1": "4",
        "2": "5",
        "3": "6",
        "4": "7",
        "5": "8",
        "6": "16",
        "7": "18",
        "8": "19",
        "9": "48"
    }
    
    toc_data = [
        ["CH NO", "TITLE", "PAGE NO"],
        ["1", "INTRODUCTION", pm.get("1", "4")],
        ["2", "OBJECTIVES", pm.get("2", "5")],
        ["3", "DESCRIPTION", pm.get("3", "6")],
        ["4", "CLASS DIAGRAM", pm.get("4", "7")],
        ["5", "TABLE STRUCTURES", pm.get("5", "8")],
        ["6", "ER DIAGRAM", pm.get("6", "16")],
        ["7", "TECH STACK", pm.get("7", "18")],
        ["8", "MODULES", pm.get("8", "19")],
        ["9", "CONCLUSION", pm.get("9", "55")]
    ]
    add_native_table(doc, toc_data[0], toc_data[1:], [1.2, 3.8, 1.4], space_after=12, header_bg="FFFFFF", font_size=10.5)

    # =========================================================================
    # PAGE 4: CHAPTER 1 - INTRODUCTION
    # =========================================================================
    add_p(doc, "CHAPTER 1", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "INTRODUCTION", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=16)
    
    add_p(doc, "In modern higher educational institutions, the comprehensive and accurate management of student co-curricular activities, technical societies, and campus event operations plays a pivotal role in operational excellence, student career development, institutional benchmarking, and accreditation. Recognized chapters continuously host technical symposiums, hackathons, workshops, and sports galas. Historically, handling these multifaceted student activities through manual paper circulars, fragmented desktop spreadsheets, or isolated departmental sub-systems is time-consuming, prone to human error, lacks data validation, and suffers from a total absence of centralized transparency.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)
          
    add_p(doc, "There is an urgent requirement for a unified, secure, enterprise-grade digital solution that consolidates all campus event operations, digital pass issuance, live attendance verification, and departmental On-Duty (OD) academic leave sanctioning under one integrated platform. The Campus Event Hub is designed and implemented specifically to address these institutional challenges. Developed as a core constituent of collegiate governance, this system digitizes the complete lifecycle of campus event management—from secure role-based login authentication to event discovery, capacity-gated enrollments, dynamic 4-digit venue hall PIN attendance, certificate proof verification, and automated multi-channel notification dispatching.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)
          
    add_p(doc, "The functional architecture of Campus Event Hub is structured into key operational areas: Role-Based Authentication & Access Control, enforcing strict boundaries across five institutional roles (Student, Instructor, Faculty OD In-Charge, Admin, Public Visitor); Campus Chapter Governance, cataloging recognized student branches and faculty counselors; Event Lifecycle & Capacity Gating, managing auditorium seat allocations and digital passes; Anti-Proxy Live Attendance, using projected hall PINs; On-Duty (OD) Academic Leave Management, governing formal duty leave approvals and verifiable pass issuance; and Multi-Channel Dispatches, streaming instant alerts across direct WhatsApp API links, SMS gateways, and email.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)
          
    add_p(doc, "This technical report documents the complete architectural design, database schemas, RESTful API specifications, user workflows, non-functional optimizations, and practical implementation details of Campus Event Hub. All documented features, API endpoints, database structures, and screenshots presented herein reflect the verified working implementation of the project.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)

    # =========================================================================
    # PAGE 5: CHAPTER 2 - OBJECTIVES
    # =========================================================================
    add_p(doc, "CHAPTER 2", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "OBJECTIVES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=16)
    
    objectives = [
        ("To Digitize Campus Event Operations: ", "Replace fragmented paper notices, isolated sign-up forms, and manual record-keeping with a centralized, web-based digital platform for complete event lifecycle administration."),
        ("To Centralize Chapter & Advisor Master Data: ", "Maintain consistent, normalized master records for recognized student societies (CSI, IEEE, IE, Robotics, Fine Arts), faculty counselors, and auditorium venue allocations."),
        ("To Enforce Role-Based Access Control & Security: ", "Provide stateless HMAC-SHA256 JWT authentication and granular Role-Based Access Control (RBAC) across Student, Instructor, Faculty OD In-Charge, and Administrator tiers."),
        ("To Automate Event Scheduling & Capacity Thresholds: ", "Establish automated workflows for scheduling technical symposiums, defining hard seat limits, and issuing verifiable digital ticket passes with unique ticket numbers."),
        ("To Eliminate Proxy Live Event Attendance: ", "Implement dynamic, auditorium-projected 4-digit venue hall PINs alongside advisor check-in consoles to guarantee physical presence verification."),
        ("To Standardize On-Duty (OD) Academic Workflows: ", "Digitize the academic leave request lifecycle, enabling attendees to submit leave applications with mandatory proof attachments and allowing departmental officers to sanction waivers swiftly."),
        ("To Issue Verifiable Official OD Passes: ", "Generate tamper-evident digital passes with unique ticket identifiers, student roll numbers, and embedded cryptographic QR verification metadata."),
        ("To Dispatch Automated Multi-Channel Notifications: ", "Integrate direct WhatsApp API links, SMS alert payloads, and formal email dispatches to provide instant updates on event registrations, OD approvals, and laurels."),
        ("To Enable Dynamic Reporting & Analytics: ", "Provide dynamic multi-criteria search, department-level OD distribution charts, and exportable participation transcripts for academic accreditation (NAAC/NBA/NIRF)."),
        ("To Deploy Scalable Full-Stack Web Architecture: ", "Build a modular, decoupled full-stack architecture using React 18 frontend components, Node.js RESTful APIs, and MongoDB document persistence.")
    ]
    for lead, rest in objectives:
        add_bullet_item(doc, lead, rest, space_after=4)

    # =========================================================================
    # PAGE 6: CHAPTER 3 - DESCRIPTION
    # =========================================================================
    add_p(doc, "CHAPTER 3", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "DESCRIPTION", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=16)
    
    add_p(doc, "The Campus Event Hub is a full-stack web application engineered to centralize, digitize, and automate collegiate co-curricular activities, technical chapters, event scheduling, live attendance, and academic leave workflows across higher education institutions. The system comprises five primary functional domains:",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.2)
          
    domains = [
        ("1. Master Governance & Club Management",
         "This module maintains foundational records for accredited campus chapters (CSI, IEEE, IE, Robotics, Yoga, Sports, Fine Arts), faculty branch counselors, auditorium venues, and institutional domain policies (@college.edu). It provides student chapters with a centralized digital profile and executive council directory."),
        ("2. Event Lifecycle & Capacity Gating",
         "Manages event scheduling, registration thresholds, contestant eligibility, and digital pass reservations. Hard capacity gating prevents auditorium overbooking, while dynamic pass generation issues verifiable entry tickets (REG-XXXXXX-XXX) with venue check-in metadata."),
        ("3. Digital Ticketing & Live PIN Attendance",
         "Eliminates proxy sign-ins through a dual verification mechanism: dynamic 4-digit venue hall PINs projected during events for attendee self-check-in, complemented by an interactive faculty advisor attendance console with instant status toggles."),
        ("4. On-Duty (OD) Permission & Academic Leave Sanctioning",
         "Governs the complete multi-state academic leave lifecycle (Pending -> Approved -> Event Attended -> Proof Submitted -> Under Verification -> OD Issued). Students submit participation certificates and event photos, which OD Officers scrutinize before issuing official passes with credited leave days."),
        ("5. Multi-Channel Notifications & System Security",
         "Coordinates transactional notifications across WhatsApp direct links, SMS gateways, and SMTP email services. Security is hardened via PBKDF2 SHA-512 salted password hashing, stateless HMAC-SHA256 JWT tokens, sliding-window IP rate limiting, and immutable audit logging.")
    ]
    for title, text in domains:
        add_p(doc, title, font_size=12, bold=True, space_before=4, space_after=1)
        add_p(doc, text, font_size=11.5, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=5, line_spacing=1.18)

    # =========================================================================
    # PAGE 7: CHAPTER 4 - CLASS DIAGRAM (Rotated Landscape Page matching Reference)
    # =========================================================================
    add_p(doc, "CHAPTER 4", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "CLASS DIAGRAM", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=10)
    
    # Use rotated image with height exactly fitted to page 7
    rot_img = 'class_diagram_rotated.png' if os.path.exists(os.path.join(FIG_DIR, 'class_diagram_rotated.png')) else 'class_diagram.png'
    add_figure(doc, rot_img, None, None, height_in=7.2, space_after=0)

    # =========================================================================
    # CHAPTER 5: TABLE STRUCTURES (Native Word Tables, 2 per page, Starts Page 8)
    # =========================================================================
    add_p(doc, "CHAPTER 5", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "TABLE STRUCTURES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=10)
    add_p(doc, "The database schema for the Campus Event Hub is built on MongoDB document persistence managed via the native MongoDB Node.js driver (mongodb v7). Collections enforce BSON data types, primary document identifiers (_id), unique indexes, and compound indexing across transactional references. Below are the structural specifications for the 11 collections:",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.15)

    # Pair collections 2 per page
    for idx, col in enumerate(COLLECTIONS_DATA):
        is_first_on_subsequent_page = (idx > 0 and idx % 2 == 0)
        
        # Heading / Caption above table in bold Times New Roman
        add_p(doc, col["caption"], font_size=11, bold=True, space_before=4, space_after=1, page_break_before=is_first_on_subsequent_page)
        add_native_table(doc, col["headers"], col["rows"], col["widths"], space_after=6, font_size=8.5)

    # =========================================================================
    # CHAPTER 6: ER DIAGRAM (Chen notation + Relationship Table)
    # =========================================================================
    add_p(doc, "CHAPTER 6", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "ER DIAGRAM", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=10)
    add_p(doc, "The Entity-Relationship (ER) model for the Campus Event Hub defines the relational schema, entity attributes, primary keys, and cardinalities in Chen notation across the 11 database collections.",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, line_spacing=1.15)
          
    add_figure(doc, 'er_diagram.png', "Fig 6.1 Entity-Relationship Diagram of Campus Event Hub Architecture",
               None,
               height_in=6.6, space_after=4)

    # Relational Constraints Table
    add_p(doc, "RELATIONAL CONSTRAINTS & MULTIPLICITIES", font_size=12, bold=True, space_before=8, space_after=4, page_break_before=True)
    add_p(doc, "The following relational mapping defines parent-child entity dependencies, cardinality multipliers, and foreign key references across the 11 MongoDB collections:",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.15)
          
    add_native_table(doc, RELATIONSHIP_TABLE_DATA[0], RELATIONSHIP_TABLE_DATA[1:], [1.3, 1.4, 1.3, 2.4], space_after=6, font_size=9.5)

    # =========================================================================
    # CHAPTER 7: TECH STACK
    # =========================================================================
    add_p(doc, "CHAPTER 7", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "TECH STACK", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=8)
    
    add_p(doc, "7.1 TECH STACK", font_size=11.5, bold=True, space_before=2, space_after=2)
    tech_data = [
        ["Frontend UI", "React.js v18 (Vite)", "Single-page application (SPA) with modular component hierarchy and React Context state."],
        ["Styling & Icons", "Tailwind CSS + Lucide React", "Responsive UI styling, status badges, and consistent institutional typography."],
        ["HTTP Client", "Axios / Fetch", "Promise-based REST API requests with Bearer token headers and 401 error interceptors."],
        ["Backend Engine", "Node.js + Express-style Router", "Asynchronous event-driven RESTful API router handling request dispatching and logic."],
        ["Database Driver", "MongoDB Native Driver (v7)", "High-performance document driver connecting to local MongoDB and MongoDB Compass."],
        ["Database Store", "MongoDB 7.0 / 8.0", "Document persistence with indexed lookups, unique keys, and in-memory transactional sync."],
        ["Authentication", "HMAC-SHA256 JWT + PBKDF2", "Stateless bearer token authentication with PBKDF2 SHA-512 salted password hashing."],
        ["Multi-Channel Alerts", "WhatsApp API, SMS, SMTP", "Automated transactional alert dispatches for event passes, OD approvals, and laurels."],
        ["Export & Reports", "CSV / PDF Streaming", "Dynamic report generation for co-curricular participation audits and attendance transcripts."],
        ["Deployment", "Docker + Nginx", "Containerized deployment with automated production builds and static asset proxying."]
    ]
    add_native_table(doc, ["Layer", "Technology", "Purpose & Architectural Role"], tech_data, [1.3, 1.8, 3.3], space_after=6, font_size=9)
    
    add_p(doc, "7.2 ARCHITECTURE OVERVIEW", font_size=11.5, bold=True, space_before=3, space_after=2)
    arch_data = [
        ["Model Layer", "MongoDB Driver + Memory Sync", "Manages 11 collections, schema validation, unique/compound indexes, and persistence."],
        ["Controller Layer", "Node.js / Express Router", "Extracts request parameters, validates payloads, enforces role access, and formats JSON responses."],
        ["View Layer", "React Pages & UI Modals", "Renders interactive catalog tables, pass cards, filter bars, and modal dialogs."]
    ]
    add_native_table(doc, ["Layer Component", "Technology Choice", "Responsibilities & Data Flow"], arch_data, [1.3, 1.8, 3.3], space_after=4, font_size=9)

    # =========================================================================
    # CHAPTER 8: CAMPUS EVENT HUB MODULES
    # =========================================================================
    add_p(doc, "CHAPTER 8", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "CAMPUS EVENT HUB MODULES", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=10)
    
    # 8.1 Design Approach & System Baseline
    add_p(doc, "8.1 Design Approach & System Baseline", font_size=12.5, bold=True, space_before=2, space_after=2)
    add_p(doc, "Each module of the Campus Event Hub is described here using a standard system design methodology. By evaluating every module through the same six sequential topics, the technical architecture remains clear, structured, and consistent across all administrative, academic, and co-curricular workflows.",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, line_spacing=1.15)
          
    seq_table = [
        ["1. Screenshots & Interface Explanations", "What does the module interface look like and how is it used?", "First topic"],
        ["2. Purpose & Scope", "What does the module do and where do its boundaries lie?", "Second topic"],
        ["3. Functional Requirements", "What business & operational tasks must the module execute?", "Third topic"],
        ["4. Non-Functional Requirements", "What performance, security, availability & CAP constraints apply?", "Fourth topic"],
        ["5. API Design", "What are the RESTful endpoint definitions, HTTP methods & payloads?", "Fifth topic"],
        ["6. DB Design", "Which tables, primary keys, foreign keys & indexes model the schema?", "Sixth topic"]
    ]
    add_native_table(doc, ["Topic", "Question it Answers", "Order in Each Module"], seq_table, [1.8, 3.2, 1.4], space_after=5, font_size=9)
    
    add_p(doc, "System Baseline & Sizing Metrics", font_size=11.5, bold=True, space_before=2, space_after=2)
    add_p(doc, "Non-functional baseline: Every API request passes through sliding-window IP rate limiting, CORS validation, JSON payload bounds, and stateless HMAC-SHA256 JWT authentication middleware before reaching route handlers. Database operations run against MongoDB with in-memory synchronization, guaranteeing data consistency for student registrations and attendance balances.",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, line_spacing=1.15)
          
    sizing_data = [
        ["Named Campus Users", "~ 250 Users", "Students, chapter counselors, OD in-charge, and administrators"],
        ["Working Days / Year", "300 Days", "Collegiate academic calendar operating period"],
        ["Requests per User / Day", "~ 300 Requests", "Catalog browsing, pass generation, live PIN check-in, and OD filing"],
        ["Total Requests per Day", "75,000 Requests", "250 users × 300 requests/day"],
        ["Average Request Load", "~ 2.6 req/sec", "75,000 requests / 28,800 working seconds (8-hour shift)"],
        ["Peak Symposium Load", "~ 25 – 40 req/sec", "Major hackathon registration opens & live auditorium PIN rushes"],
        ["Total Database Collections", "11 Collections", "Live MongoDB Schema (users, events, students, registrations, etc.)"]
    ]
    add_native_table(doc, ["Quantity Metric", "Estimated Value", "Basis / Derivation"], sizing_data, [1.6, 1.8, 3.0], space_after=5, font_size=9)

    # Figure 8.1.1 Overall System Architecture
    add_p(doc, "Overall System Architecture & Data Flow", font_size=11.5, bold=True, space_before=3, space_after=2, page_break_before=True)
    add_figure(doc, 'fig_8.1.1_overall_architecture.png', "Figure 8.1.1 Overall System Request & Data Architecture for Campus Event Hub",
               "Figure 8.1.1 illustrates the end-to-end request lifecycle and multi-tiered data flow across the Campus Event Hub. Single-page application requests originate from the React 18 client layer, pass through HTTP authorization transport with Bearer JWT tokens and sliding-window rate limiters, enter the Node.js API routing layer (apiRouter.js), execute business domain rules (db.js), and persist changes to the 11 MongoDB collections.",
               width_in=5.2, space_after=4)

    # 8.2 Folder Structure
    add_p(doc, "8.2 Folder Structure", font_size=12.5, bold=True, space_before=3, space_after=2, page_break_before=True)
    add_p(doc, "The codebase follows a clean, modular layer separation between backend REST API services and frontend React single-page components.",
          font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=3, line_spacing=1.15)
          
    add_p(doc, "Backend Directory Organization", font_size=11.5, bold=True, space_before=2, space_after=2)
    add_p(doc, "The backend repository structure houses server configurations, authentication middleware, database connections, notification services, and REST routers:",
          font_size=11, space_after=2)
    add_figure(doc, 'fig_8.2.1_backend_folder.png', "Figure 8.2.1 Backend folder structure", width_in=3.6, space_after=4)

    add_p(doc, "Frontend Directory Organization", font_size=11.5, bold=True, space_before=3, space_after=2, page_break_before=True)
    add_p(doc, "The frontend single-page application organizes views into dedicated student, instructor, OD officer, and administrative pages:",
          font_size=11, space_after=2)
    add_figure(doc, 'fig_8.2.2_frontend_folder.png', "Figure 8.2.2 Frontend folder structure", width_in=4.0, space_after=4)

    # -------------------------------------------------------------------------
    # MODULES 8.3 THROUGH 8.19
    # Strictly following the 6 topics:
    # 1. Screenshots & Interface Explanations (FIRST!)
    # 2. Purpose & Scope
    # 3. Functional Requirements
    # 4. Non-Functional Requirements
    # 5. API Design
    # 6. DB Design
    # -------------------------------------------------------------------------
    for m in MODULES_DATA:
        add_p(doc, f"{m['num']} {m['title']}", font_size=12.5, bold=True, space_before=4, space_after=2, page_break_before=True)
        
        # 1. Screenshots & Interface Explanations
        if m.get("figures"):
            for fig_file, fig_caption, fig_expl in m["figures"]:
                add_figure(doc, fig_file, fig_caption, fig_expl, width_in=4.4, space_after=3)
                
        # 2. Purpose & Scope
        add_p(doc, "Purpose & Scope", font_size=11.5, bold=True, space_before=3, space_after=1)
        add_p(doc, m["purpose"], font_size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=3, line_spacing=1.15)
        
        # 3. Functional Requirements
        add_p(doc, "Functional Requirements", font_size=11.5, bold=True, space_before=3, space_after=1)
        for lead, rest in m["functional"]:
            add_bullet_item(doc, lead, rest, space_after=2)
            
        # 4. Non-Functional Requirements
        add_p(doc, "Non-Functional Requirements", font_size=11.5, bold=True, space_before=3, space_after=1)
        for lead, rest in m["non_functional"]:
            add_bullet_item(doc, lead, rest, space_after=2)
            
        # 5. API Design
        add_p(doc, "API Design", font_size=11.5, bold=True, space_before=3, space_after=1)
        add_native_table(doc, ["Method", "Endpoint", "Purpose / Contract"], m["api"], [1.0, 2.3, 3.1], space_after=3, font_size=8.5)
        
        # 6. DB Design
        add_p(doc, "DB Design", font_size=11.5, bold=True, space_before=3, space_after=1)
        add_native_table(doc, ["Collection", "Keys & Indexes", "Key Columns & Attributes"], m["db"], [1.4, 2.0, 3.0], space_after=4, font_size=8.5)

    # =========================================================================
    # CHAPTER 9: CONCLUSION
    # =========================================================================
    add_p(doc, "CHAPTER 9", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4, page_break_before=True)
    add_p(doc, "CONCLUSION", font_size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=16)
    
    add_p(doc, "The Campus Event Hub provides a comprehensive, secure, and robust digital framework for digitizing student co-curricular activities, technical chapters, event pass reservation, anti-proxy attendance verification, and academic On-Duty (OD) leave workflows across higher educational institutions. By replacing paper-based notices, physical sign-up lists, and fragmented desktop spreadsheets with a centralized full-stack web application, the system drastically improves operational efficiency, attendance integrity, administrative auditability, and accreditation readiness.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)
          
    add_p(doc, "The implementation successfully integrates multi-role authentication (Student, Instructor, Faculty OD In-Charge, Admin), chapter governance curation, capacity-gated event creation, verifiable digital pass generation, dual-mode live attendance (auditorium-projected 4-digit PINs and advisor rosters), multi-stage OD proof verification, and permanent official OD registry archiving into a single cohesive interface. The inclusion of high-efficiency multi-channel notification dispatching across WhatsApp direct links, SMS alert gateways, and SMTP email services empowers scholars and faculty to maintain real-time situational awareness with minimal administrative overhead.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)
          
    add_p(doc, "Developing the application using React 18 for the frontend, Node.js for the RESTful API backend, and MongoDB native driver document persistence ensures high concurrency performance, horizontal scalability, and data security. Overall, the Campus Event Hub fulfills all specified functional, architectural, and security objectives, delivering a state-of-the-art solution for collegiate event administration and academic leave governance.",
          font_size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=8, line_spacing=1.22)

    doc.save(OUTPUT_DOCX)
    print(f"Generated DOCX report: {OUTPUT_DOCX}")

if __name__ == '__main__':
    generate_report()
