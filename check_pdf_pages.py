import pypdf

pdf_path = "Campus_Event_Hub_Report/Final_Report.pdf"
reader = pypdf.PdfReader(pdf_path)
total_pages = len(reader.pages)
print(f"Total PDF Pages: {total_pages}")

chapter_pages = {}
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    first_few = " ".join(lines[:6])
    
    for ch in range(1, 10):
        ch_str = f"CHAPTER {ch}"
        if ch_str in first_few and ch_str not in chapter_pages:
            chapter_pages[ch_str] = i + 1

print("\nDetected Chapter Start Pages:")
for ch, p in sorted(chapter_pages.items()):
    print(f"  {ch}: Page {p}")
