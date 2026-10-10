import docx

doc = docx.Document(r'Campus_Event_Hub_Report\Final_Report.docx')

print("Checking table structure images...")
import os
for f in os.listdir('Campus_Event_Hub_Report/figures'):
    if f.startswith('tbl_'):
        from PIL import Image
        im = Image.open(os.path.join('Campus_Event_Hub_Report/figures', f))
        print(f, im.size)
