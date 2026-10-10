$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = "C:\Users\S.Gomathi\Downloads\campus-event-hub-final\Campus_Event_Hub_Report\Final_Report.docx"
$doc = $word.Documents.Open($docPath)
$pages = $doc.ComputeStatistics(2)
Write-Host "Page Count: $pages"
$doc.Close([ref]$false)
$word.Quit()
