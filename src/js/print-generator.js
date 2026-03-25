/* ============================================
   PRINT GENERATOR — Checklist & Token Slips
   ============================================ */

const PrintGenerator = {

  // --- Paper Checklist ---

  generateChecklist(beneficiaries, meta) {
    const eventLabel = meta?.event_name || 'Food Distribution';
    const eventDate = meta?.event_date || '';
    const sorted = [...beneficiaries].sort((a, b) => a.name.localeCompare(b.name));
    const rowsPerPage = 40;
    const totalPages = Math.ceil(sorted.length / rowsPerPage) || 1;

    let html = this._checklistHeader(eventLabel, eventDate, totalPages);

    for (let i = 0; i < sorted.length; i++) {
      const pageNum = Math.floor(i / rowsPerPage) + 1;

      if (i % rowsPerPage === 0) {
        if (i > 0) {
          html += '</tbody></table>';
          html += '</div>'; // close .checklist-page
        }
        html += `<div class="checklist-page">`;
        html += this._checklistPageHeader(eventLabel, eventDate, pageNum, totalPages, i === 0);
        html += `<table class="checklist-table">
          <thead><tr>
            <th class="chk-col">☐</th>
            <th class="num-col">#</th>
            <th class="name-col">${I18N.t('print.col_name') || 'Name'}</th>
            <th class="id-col">ID</th>
            <th class="phone-col">${I18N.t('print.col_phone') || 'Phone'}</th>
            <th class="sig-col">${I18N.t('print.col_signature')}</th>
          </tr></thead><tbody>`;
      }

      const b = sorted[i];
      html += `<tr>
        <td class="chk-col">☐</td>
        <td class="num-col">${i + 1}</td>
        <td class="name-col">${this._esc(b.name)}</td>
        <td class="id-col">${b.id}</td>
        <td class="phone-col">**${b.phone_last4}</td>
        <td class="sig-col"></td>
      </tr>`;
    }

    if (sorted.length > 0) {
      html += '</tbody></table></div>';
    }

    html += this._pageFooter();
    return html;
  },

  openChecklist(beneficiaries, meta) {
    const html = this.generateChecklist(beneficiaries, meta);
    this._openOrDownload(html, 'checklist.html');
  },

  // --- Token Slips (Two-Part Tear-off) ---

  generateTokenSlips(beneficiaries, meta) {
    const eventLabel = meta?.event_name || 'Food Distribution';
    const sorted = [...beneficiaries].sort((a, b) => a.name.localeCompare(b.name));
    const slipsPerPage = 10; // 2 cols × 5 rows

    let html = this._tokenHeader(eventLabel);

    for (let i = 0; i < sorted.length; i++) {
      if (i % slipsPerPage === 0) {
        if (i > 0) {
          html += '</div>'; // close .token-grid
          html += '</div>'; // close .token-page
        }
        html += '<div class="token-page"><div class="token-grid">';
      }

      const b = sorted[i];
      const tearText = I18N.t('print.tear_here');
      const keepText = I18N.t('print.keep_this');
      const stubText = I18N.t('print.organizer_stub');

      html += `<div class="token-cell">
        <div class="token-top">
          <div class="token-id">${b.id}</div>
          <div class="token-name">${this._esc(b.name)}</div>
          <div class="token-event">${this._esc(eventLabel)}</div>
          <div class="token-keep">${this._esc(keepText)}</div>
        </div>
        <div class="token-perforation">${this._esc(tearText)}</div>
        <div class="token-bottom">
          <div class="token-id token-id-small">${b.id}</div>
          <div class="token-name-small">${this._esc(b.name)}</div>
          <div class="token-stub-label">${this._esc(stubText)}</div>
        </div>
      </div>`;
    }

    if (sorted.length > 0) {
      html += '</div></div>'; // close .token-grid + .token-page
    }

    html += this._pageFooter();
    return html;
  },

  openTokenSlips(beneficiaries, meta) {
    const html = this.generateTokenSlips(beneficiaries, meta);
    this._openOrDownload(html, 'tokens.html');
  },

  // --- Private Helpers ---

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },

  _openOrDownload(html, filename) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },

  _checklistHeader(eventLabel, eventDate, totalPages) {
    const title = I18N.t('print.checklist_title');
    const printBtn = I18N.t('setup.generate_checklist');
    return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>${this._esc(title)} — ${this._esc(eventLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Noto Sans Bengali","Kalpurush","Inter","Segoe UI",sans-serif;
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
  .no-print { text-align: center; padding: 16px; background: #1565C0; color: white; }
  .no-print button {
    margin-top: 8px; padding: 10px 24px; font-size: 16px;
    cursor: pointer; border: none; border-radius: 6px;
    background: white; color: #1565C0; font-weight: 700;
  }
  .checklist-page {
    width: 210mm; margin: 0 auto; padding: 10mm 12mm;
    page-break-after: always;
  }
  .checklist-page:last-of-type { page-break-after: auto; }
  .page-header {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 2px solid #000; padding-bottom: 4mm; margin-bottom: 4mm;
  }
  .page-header-left h1 { font-size: 16pt; font-weight: 700; }
  .page-header-left .event-date { font-size: 11pt; color: #333; }
  .page-header-right { font-size: 11pt; text-align: right; }
  .instructions {
    background: #f0f0f0; border: 1px solid #999; padding: 3mm 4mm;
    margin-bottom: 4mm; font-size: 11pt; font-weight: 600;
  }
  .checklist-table {
    width: 100%; border-collapse: collapse; font-size: 12pt;
  }
  .checklist-table th, .checklist-table td {
    border: 1px solid #000; padding: 2mm 3mm; text-align: left;
  }
  .checklist-table th {
    background: #e0e0e0; font-weight: 700; font-size: 11pt;
  }
  .chk-col { width: 8mm; text-align: center; font-size: 14pt; }
  .num-col { width: 8mm; text-align: center; }
  .name-col { font-size: 14pt; font-weight: 600; }
  .id-col { width: 18mm; font-family: monospace; font-size: 10pt; }
  .phone-col { width: 16mm; font-size: 10pt; }
  .sig-col { width: 30mm; }
  @media print {
    .no-print { display: none; }
    body { margin: 0; }
    .checklist-page { padding: 8mm 10mm; }
  }
</style>
</head><body>
<div class="no-print">
  <strong>${this._esc(eventLabel)} — ${this._esc(title)}</strong><br>
  <button onclick="window.print()">🖨️ ${this._esc(printBtn)}</button>
</div>
`;
  },

  _checklistPageHeader(eventLabel, eventDate, pageNum, totalPages, isFirst) {
    const pageLabel = I18N.t('print.page');
    const ofLabel = I18N.t('common.of');
    let html = `<div class="page-header">
      <div class="page-header-left">
        <h1>${this._esc(eventLabel)}</h1>
        ${eventDate ? `<div class="event-date">${this._esc(eventDate)}</div>` : ''}
      </div>
      <div class="page-header-right">
        ${this._esc(pageLabel)} ${pageNum} ${this._esc(ofLabel)} ${totalPages}
      </div>
    </div>`;

    if (isFirst) {
      const instructions = I18N.t('print.instructions_v2');
      html += `<div class="instructions">${this._esc(instructions)}</div>`;
    }

    return html;
  },

  _tokenHeader(eventLabel) {
    const title = I18N.t('print.token_title');
    const printBtn = I18N.t('setup.generate_tokens');
    return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>${this._esc(title)} — ${this._esc(eventLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Noto Sans Bengali","Kalpurush","Inter","Segoe UI",sans-serif;
    color: #000;
    background: #fff;
  }
  .no-print { text-align: center; padding: 16px; background: #1565C0; color: white; }
  .no-print button {
    margin-top: 8px; padding: 10px 24px; font-size: 16px;
    cursor: pointer; border: none; border-radius: 6px;
    background: white; color: #1565C0; font-weight: 700;
  }
  .token-page {
    width: 210mm; margin: 0 auto; padding: 5mm;
    page-break-after: always;
  }
  .token-page:last-of-type { page-break-after: auto; }
  .token-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 0;
    width: 100%;
    min-height: 277mm; /* A4 minus padding */
  }
  .token-cell {
    border: 1px dashed #666;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .token-top {
    flex: 3;
    padding: 4mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .token-perforation {
    border-top: 2px dashed #000;
    text-align: center;
    font-size: 8pt;
    color: #555;
    padding: 1mm 0;
    letter-spacing: 2px;
  }
  .token-bottom {
    flex: 2;
    padding: 3mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f9f9f9;
  }
  .token-id {
    font-size: 18pt;
    font-weight: 700;
    font-family: monospace;
    margin-bottom: 2mm;
  }
  .token-id-small {
    font-size: 14pt;
  }
  .token-name {
    font-size: 12pt;
    font-weight: 600;
    line-height: 1.2;
    word-wrap: break-word;
    max-width: 100%;
  }
  .token-name-small {
    font-size: 9pt;
    font-weight: 500;
    line-height: 1.2;
    word-wrap: break-word;
    max-width: 100%;
    color: #333;
  }
  .token-event {
    font-size: 9pt;
    color: #555;
    margin-top: 2mm;
  }
  .token-keep {
    font-size: 8pt;
    color: #777;
    margin-top: 2mm;
    font-style: italic;
  }
  .token-stub-label {
    font-size: 7pt;
    color: #777;
    margin-top: 1mm;
    font-style: italic;
  }
  @media print {
    .no-print { display: none; }
    body { margin: 0; }
    .token-page { padding: 3mm; }
  }
</style>
</head><body>
<div class="no-print">
  <strong>${this._esc(eventLabel)} — ${this._esc(title)}</strong><br>
  <button onclick="window.print()">🖨️ ${this._esc(printBtn)}</button>
</div>
`;
  },

  _pageFooter() {
    return '</body></html>';
  },
};
