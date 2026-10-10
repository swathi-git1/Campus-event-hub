import docx

doc = docx.Document(r'c:\Users\S.Gomathi\Downloads\Store_Management_System_Report_Revised.docx')

# Let's inspect the paragraphs in each module in the reference docx
# Specifically let's inspect 8.2 (User Auth)
print("=== INSPECTING MODULE 8.2 (P187 to P230) ===")
for i in range(187, 230):
    p = doc.paragraphs[i]
    txt = p.text.strip()
    has_img = ''
    if 'graphic' in p._p.xml:
        for node in p._p.xpath('.//wp:extent'):
            w = int(node.get('cx', 0)) / 914400.0
            h = int(node.get('cy', 0)) / 914400.0
            has_img = f'[IMG: {w:.2f} x {h:.2f} in]'
    sb = p.paragraph_format.space_before.pt if p.paragraph_format.space_before else 0
    sa = p.paragraph_format.space_after.pt if p.paragraph_format.space_after else 0
    if txt or has_img:
        print(f"P{i:03d} (sb={sb:.0f}, sa={sa:.0f}) {has_img}: {txt[:65]}")
