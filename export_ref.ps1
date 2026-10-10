$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = "C:\Users\S.Gomathi\Downloads\Store_Management_System_Report_Revised.docx"
$pdfPath = "C:\Users\S.Gomathi\Downloads\campus-event-hub-final\ref_exported.pdf"
$doc = $word.Documents.Open($docPath)
$doc.ExportAsFixedFormat($pdfPath, 17) # wdExportFormatPDF = 17
$doc.Close([ref]$false)
$word.Quit()
Write-Host "Exported reference to $pdfPath"
