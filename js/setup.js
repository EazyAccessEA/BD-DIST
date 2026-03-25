/* ===== SETUP MODULE =====
   CSV import, list review, QR card generation
*/
const Setup = {
  importCSV(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = Data.importCSV(e.target.result);
      const el = document.getElementById('importStatus');
      if (result.error) {
        el.className = 'status-msg err';
        el.textContent = result.error;
        return;
      }
      el.className = 'status-msg ok';
      el.innerHTML = `✅ <strong>${result.count}</strong> জন লোড হয়েছে / loaded`;

      // Show duplicate warning
      if (result.duplicatePhones.length > 0) {
        const warn = document.getElementById('duplicateWarning');
        warn.style.display = 'block';
        warn.innerHTML = `⚠️ <strong>${result.duplicatePhones.length}</strong> টি ডুপ্লিকেট ফোন নম্বর পাওয়া গেছে / duplicate phone numbers found`;
      }

      // Show remaining cards
      document.getElementById('eventCard').style.display = 'block';
      document.getElementById('listCard').style.display = 'block';
      document.getElementById('printCard').style.display = 'block';
      this.renderList();
      App.updateStats();
    };
    reader.readAsText(file, 'UTF-8');
  },

  renderList(filter) {
    const list = filter ? Data.findByName(filter) : Data.getBeneficiaries();
    const container = document.getElementById('beneficiaryList');
    const countEl = document.getElementById('beneficiaryCount');

    countEl.textContent = `${list.length} জন / people`;

    if (list.length === 0) {
      container.innerHTML = '<p style="padding:12px;color:#6b7280">কোনো ফলাফল নেই / No results</p>';
      return;
    }

    container.innerHTML = list.slice(0, 100).map(b => `
      <div class="list-item ${b.collected ? 'collected' : ''}">
        <div>
          <div class="name">${this._esc(b.name)}</div>
          <div class="phone">📱 ****${b.phone_last4}</div>
        </div>
        <span class="id-badge">${b.id}</span>
        ${b.collected ? '<span class="check">✅</span>' : ''}
      </div>
    `).join('');

    if (list.length > 100) {
      container.innerHTML += `<p style="padding:12px;text-align:center;color:#6b7280">+${list.length - 100} আরো / more...</p>`;
    }
  },

  filterList(val) {
    this.renderList(val);
  },

  saveEvent() {
    const meta = {
      event_name: document.getElementById('eventName').value || 'Food Distribution',
      event_date: document.getElementById('eventDate').value || new Date().toISOString().split('T')[0],
      total_beneficiaries: Data.getBeneficiaries().length,
      created_at: new Date().toISOString()
    };
    Data.saveMeta(meta);
    const el = document.getElementById('importStatus');
    el.className = 'status-msg ok';
    el.innerHTML = '✅ সংরক্ষিত / Saved';
    setTimeout(() => el.textContent = '', 2000);
  },

  generateCards() {
    const list = Data.getBeneficiaries();
    const meta = Data.getMeta();
    if (list.length === 0) { alert('কোনো তালিকা নেই / No list loaded'); return; }

    // Sort alphabetically
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, 'bn'));

    // Build printable HTML
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>QR Cards - ${this._esc(meta.event_name || 'Food Distribution')}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: -apple-system, 'Noto Sans Bengali', system-ui, sans-serif; }
      @media print {
        @page { margin: 10mm; size: A4; }
        .page-break { page-break-after: always; }
      }
      .cards-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 8px;
      }
      .qr-card {
        border: 2px solid #333;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 100px;
      }
      .qr-card canvas { flex-shrink: 0; }
      .card-info { flex: 1; min-width: 0; }
      .card-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; word-wrap: break-word; }
      .card-id { font-size: 11px; font-family: monospace; color: #555; margin-bottom: 2px; }
      .card-phone { font-size: 11px; color: #777; }
      .card-event { font-size: 9px; color: #999; margin-top: 4px; border-top: 1px solid #eee; padding-top: 4px; }
      .no-print-msg { padding: 16px; text-align: center; background: #f0f0f0; margin-bottom: 12px; }
      @media print { .no-print-msg { display: none; } }
    </style>
    </head><body>
    <div class="no-print-msg">
      <strong>প্রিন্ট করতে Ctrl+P চাপুন / Press Ctrl+P to print</strong>
    </div>
    <div class="cards-grid">`;

    sorted.forEach((b, i) => {
      // Page break every 8 cards
      if (i > 0 && i % 8 === 0) {
        html += `</div><div class="page-break"></div><div class="cards-grid">`;
      }
      html += `
        <div class="qr-card">
          <canvas id="qr-${b.id}" width="80" height="80"></canvas>
          <div class="card-info">
            <div class="card-name">${this._esc(b.name)}</div>
            <div class="card-id">${b.id}</div>
            <div class="card-phone">📱 ****${b.phone_last4}</div>
            <div class="card-event">${this._esc(meta.event_name || '')}</div>
          </div>
        </div>`;
    });

    html += `</div>
    <script src="lib/qrcode.min.js"><\/script>
    <script>
      document.querySelectorAll('.qr-card canvas').forEach(canvas => {
        const id = canvas.id.replace('qr-', '');
        try {
          const qr = qrcode(0, 'M');
          qr.addData(id);
          qr.make();
          const size = qr.getModuleCount();
          const ctx = canvas.getContext('2d');
          const cellSize = Math.floor(80 / size);
          canvas.width = cellSize * size;
          canvas.height = cellSize * size;
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              ctx.fillStyle = qr.isDark(r, c) ? '#000' : '#fff';
              ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
          }
        } catch(e) { console.error(e); }
      });
    <\/script></body></html>`;

    // Open in new tab
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
