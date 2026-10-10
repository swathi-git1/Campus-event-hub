$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = "C:\Users\S.Gomathi\Downloads\campus-event-hub-final\Campus_Event_Hub_Report\Final_Report.docx"
$pdfPath = "C:\Users\S.Gomathi\Downloads\campus-event-hub-final\Campus_Event_Hub_Report\Final_Report.pdf"

$doc = $word.Documents.Open($docPath)
$pages = $doc.ComputeStatistics(2)
Write-Host "DOCX Page Count in Word COM: $pages"

$doc.ExportAsFixedFormat($pdfPath, 17) # 17 = wdExportFormatPDF
$doc.Close([ref]$false)
$word.Quit()
Write-Host "PDF successfully exported to: $pdfPath"
