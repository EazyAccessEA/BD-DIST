/* ===== REPORTS MODULE =====
   Summary stats, uncollected list, CSV export, data clear
*/
const Reports = {
  refresh() {
    const stats = Data.getStats();

    document.getElementById('rptTotal').textContent = stats.total;
    document.getElementById('rptCollected').textContent = stats.collected;
    document.getElementById('rptRemaining').textContent = stats.remaining;

    const pct = stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;
    document.getElementById('rptProgress').style.width = pct + '%';
    document.getElementById('rptRate').textContent =
      `${pct}% সম্পন্ন / complete`;

    this.renderUncollected();
  },

  renderUncollected() {
    const list = Data.getBeneficiaries().filter(b => !b.collected);
    const container = document.getElementById('uncollectedList');

    if (list.length === 0) {
      container.innerHTML = '<p style="padding:12px;color:#059669;text-align:center;font-weight:600">🎉 সবাই সংগ্রহ করেছে / Everyone collected!</p>';
      return;
    }

    container.innerHTML = list.slice(0, 50).map(b => `
      <div class="list-item">
        <div>
          <div class="name">${Setup._esc(b.name)}</div>
          <div class="phone">📱 ****${b.phone_last4}</div>
        </div>
        <span class="id-badge">${b.id}</span>
      </div>
    `).join('');

    if (list.length > 50) {
      container.innerHTML += `<p style="padding:12px;text-align:center;color:#6b7280">+${list.length - 50} আরো / more</p>`;
    }
  },

  exportCSV() {
    const csv = Data.exportCSV();
    if (!csv) { alert('কোনো ডাটা নেই / No data'); return; }

    const meta = Data.getMeta();
    const filename = `distribution-report-${meta.event_date || 'export'}.csv`;

    const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  clearAll() {
    const msg = 'সব ডাটা মুছে যাবে! আপনি কি নিশ্চিত?\nAll data will be deleted! Are you sure?';
    if (!confirm(msg)) return;
    if (!confirm('চূড়ান্ত নিশ্চিতকরণ / Final confirmation — delete everything?')) return;

    Data.clearAll();
    App.updateStats();
    this.refresh();

    // Reset setup panel
    document.getElementById('importStatus').textContent = '';
    document.getElementById('importStatus').className = 'status-msg';
    document.getElementById('eventCard').style.display = 'none';
    document.getElementById('listCard').style.display = 'none';
    document.getElementById('printCard').style.display = 'none';
    document.getElementById('duplicateWarning').style.display = 'none';

    alert('✅ সব ডাটা মুছে ফেলা হয়েছে / All data cleared');
  }
};
