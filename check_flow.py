import docx

doc = docx.Document(r'c:\Users\S.Gomathi\Downloads\Store_Management_System_Report_Revised.docx')

print("=== CHECKING PARAGRAPHS 0 TO 70 (Front matter & early chapters) ===")
for i in range(70):
    p = doc.paragraphs[i]
    txt = p.text.strip()
    has_img = '[IMG]' if 'graphic' in p._p.xml else ''
    pb = '[PB]' if 'w:br w:type="page"' in p._p.xml or 'w:type="page"' in p._p.xml else ''
    sb = p.paragraph_format.space_before.pt if p.paragraph_format.space_before else 0
    sa = p.paragraph_format.space_after.pt if p.paragraph_format.space_after else 0
    if txt or has_img or pb:
        print(f"P{i:03d} (sb={sb:.0f}, sa={sa:.0f}) {pb} {has_img}: {txt[:65]}")
