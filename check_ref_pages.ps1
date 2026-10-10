$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = "C:\Users\S.Gomathi\Downloads\Store_Management_System_Report_Revised.docx"
$doc = $word.Documents.Open($docPath)
$pages = $doc.ComputeStatistics(2)
Write-Host "Reference Page Count: $pages"
$doc.Close([ref]$false)
$word.Quit()
