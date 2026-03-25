/* ============================================
   QR GENERATOR — Create QR Codes + Print Cards
   ============================================ */

const QRGenerator = {

  generateSVG(text, cellSize) {
    cellSize = cellSize || 4;
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const size = count * cellSize;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="${size}" height="${size}" fill="#fff"/>`;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000"/>`;
        }
      }
    }
    svg += '</svg>';
    return svg;
  },

  generatePrintableCards(beneficiaries, meta) {
    const eventLabel = meta?.event_name || 'Food Distribution';
    const sorted = [...beneficiaries].sort((a, b) => a.name.localeCompare(b.name));
    const cardsPerPage = 8;
    let html = this._printPageHeader(eventLabel);

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && i % cardsPerPage === 0) {
        html += '</div><div class="page-break"></div><div class="qr-cards-grid">';
      }
      if (i === 0) html += '<div class="qr-cards-grid">';

      const b = sorted[i];
      const qrSvg = this.generateSVG(b.id, 3);

      html += `
        <div class="qr-card">
          <div class="qr-card-qr">${qrSvg}</div>
          <div class="qr-card-info">
            <div class="qr-card-name">${this._esc(b.name)}</div>
            <div class="qr-card-id">${b.id}</div>
            <div class="qr-card-phone">Ph: **${b.phone_last4}</div>
            <div class="qr-card-event">${this._esc(eventLabel)}</div>
          </div>
        </div>`;
    }

    html += '</div>';
    html += this._printPageFooter();
    return html;
  },

  openPrintableCards(beneficiaries, meta) {
    const html = this.generatePrintableCards(beneficiaries, meta);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-cards.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },

  _printPageHeader(eventLabel) {
    return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>QR Cards — ${this._esc(eventLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Noto Sans Bengali","Kalpurush","Inter",sans-serif; }
  .qr-cards-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    width: 210mm; margin: 0 auto;
  }
  .qr-card {
    width: 95mm; height: 62mm; border: 1px dashed #999;
    padding: 4mm; display: flex; align-items: center; gap: 4mm;
    page-break-inside: avoid; box-sizing: border-box;
  }
  .qr-card-qr { flex-shrink: 0; width: 28mm; height: 28mm; }
  .qr-card-qr svg { width: 100% !important; height: 100% !important; }
  .qr-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2mm; }
  .qr-card-name { font-size: 14pt; font-weight: 700; line-height: 1.2; word-wrap: break-word; }
  .qr-card-id { font-size: 10pt; color: #555; font-family: monospace; }
  .qr-card-phone { font-size: 10pt; color: #333; }
  .qr-card-event { font-size: 8pt; color: #777; margin-top: auto; }
  .page-break { page-break-after: always; break-after: page; height: 0; }
  .print-header { text-align: center; padding: 8mm 0 4mm; font-size: 14pt; font-weight: 700; }
  @media print { .no-print { display: none; } }
</style>
</head><body>
<div class="no-print" style="text-align:center;padding:16px;background:#1565C0;color:white;">
  <strong>${this._esc(eventLabel)} — QR Cards</strong><br>
  <button onclick="window.print()" style="margin-top:8px;padding:10px 24px;font-size:16px;cursor:pointer;border:none;border-radius:6px;background:white;color:#1565C0;font-weight:700;">
    🖨️ Print Cards
  </button>
</div>
`;
  },

  _printPageFooter() {
    return '</body></html>';
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },
};
