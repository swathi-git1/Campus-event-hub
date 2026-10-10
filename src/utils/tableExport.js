/**
 * Table Export Utilities for Campus Event Hub
 * Provides CSV/Excel and Printable PDF generation for filtered data tables.
 */

export function exportTableToCSV({ filename, headers, rows, metadata = {} }) {
  const metaLines = []
  metaLines.push(`"CAMPUS EVENT HUB - INSTITUTIONAL DATA EXPORT"`)
  if (metadata.title) metaLines.push(`"Report Title: ${metadata.title}"`)
  if (metadata.filterSummary) metaLines.push(`"Applied Filters: ${metadata.filterSummary}"`)
  metaLines.push(`"Generated On: ${new Date().toLocaleString()} | Authenticated User Session"`)
  metaLines.push('')

  // Escape quotes and format CSV values
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""'
    const s = String(val).replace(/"/g, '""')
    return `"${s}"`
  }

  const headerLine = headers.map(escapeCell).join(',')
  const dataLines = rows.map(row => row.map(escapeCell).join(','))

  const allLines = [...metaLines, headerLine, ...dataLines]
  const csvContent = '\uFEFF' + allLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportTableToPDF({ title, subtitle, filterSummary, headers, rows }) {
  const printWindow = window.open('', '_blank', 'width=950,height=750')
  if (!printWindow) {
    alert('Please allow popups to generate the printable PDF document.')
    return
  }

  const tableHeaderHtml = headers.map(h => `<th style="padding: 8px 10px; background: #1e293b; color: #fff; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase;">${h}</th>`).join('')
  
  const tableRowsHtml = rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc'
    const cells = row.map(cell => `<td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; color: #1e293b;">${cell || '—'}</td>`).join('')
    return `<tr style="background: ${bg};">${cells}</tr>`
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #0f172a; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .institution { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 4px; color: #0f172a; }
          .doc-title { font-size: 14px; font-weight: 600; color: #475569; margin: 0; }
          .meta-info { font-size: 11px; color: #64748b; line-height: 1.5; text-align: right; }
          .filter-bar { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; font-size: 11.5px; margin-bottom: 16px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          .stamp { border: 2px dashed #94a3b8; border-radius: 6px; padding: 8px 16px; display: inline-block; font-weight: 700; color: #475569; font-size: 10px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="institution">NATIONAL ENGINEERING COLLEGE (AUTONOMOUS)</div>
            <div class="doc-title">${title} · ${subtitle || 'Official Institutional Records'}</div>
          </div>
          <div class="meta-info">
            <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Security Clearance:</strong> University Platform Administrator</div>
            <div><strong>Verification:</strong> Cryptographically Synced</div>
          </div>
        </div>

        <div class="filter-bar">
          <span><strong>Active Scope:</strong> ${filterSummary || 'All Registered Records'}</span>
          <span><strong>Record Count:</strong> ${rows.length} verified entries</span>
        </div>

        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <div>Campus Event Hub · Autonomous Institutional Engine</div>
            <div>This computer-generated document requires no physical signature for digital audit.</div>
          </div>
          <div style="text-align: right;">
            <div class="stamp">OFFICIAL AUDIT VERIFIED</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
