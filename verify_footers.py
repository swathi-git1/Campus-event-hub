import pypdf

reader = pypdf.PdfReader('Campus_Event_Hub_Report/Final_Report.pdf')
print('Total pages:', len(reader.pages))
for i in [1, 2, 3, 4, 5, 6, 7, 8, 17, 19, 20, 73]:
    txt = reader.pages[i-1].extract_text().strip()
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    first_line = lines[0] if lines else ''
    last_line = lines[-1] if lines else ''
    print(f'Doc Page {i:>2}: first="{first_line[:35]}" | last="{last_line}"')
