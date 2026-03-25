/* ===== APP CORE =====
   Tab switching, language toggle, stats updates, initialization
*/
const App = {
  _lang: 'bn', // 'bn' = Bengali (default), 'en' = English

  init() {
    // Restore language preference
    const savedLang = localStorage.getItem('fd_lang');
    if (savedLang) this._lang = savedLang;
    document.body.classList.add('lang-' + this._lang);

    // If data already exists, show setup cards
    const list = Data.getBeneficiaries();
    if (list.length > 0) {
      document.getElementById('eventCard').style.display = 'block';
      document.getElementById('listCard').style.display = 'block';
      document.getElementById('printCard').style.display = 'block';
      Setup.renderList();

      const meta = Data.getMeta();
      if (meta.event_name) document.getElementById('eventName').value = meta.event_name;
      if (meta.event_date) document.getElementById('eventDate').value = meta.event_date;

      document.getElementById('importStatus').className = 'status-msg ok';
      document.getElementById('importStatus').innerHTML =
        `✅ <strong>${list.length}</strong> জন লোড আছে / loaded`;
    }

    this.updateStats();
    Reports.refresh();

    // Set default date to today
    if (!document.getElementById('eventDate').value) {
      document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
    }
  },

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // Update panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tabName).classList.add('active');

    // Refresh data when switching
    if (tabName === 'scan') this.updateStats();
    if (tabName === 'reports') Reports.refresh();
    if (tabName === 'setup') Setup.renderList();

    // Stop scanner when leaving scan tab
    if (tabName !== 'scan' && Scanner._isScanning) Scanner.stopScan();
  },

  toggleLang() {
    this._lang = this._lang === 'bn' ? 'en' : 'bn';
    document.body.classList.remove('lang-bn', 'lang-en');
    document.body.classList.add('lang-' + this._lang);
    localStorage.setItem('fd_lang', this._lang);
  },

  updateStats() {
    const stats = Data.getStats();

    // Scan day stats
    document.getElementById('statCollected').textContent = stats.collected;
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statRemaining').textContent = stats.remaining;

    const pct = stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;
    document.getElementById('progressFill').style.width = pct + '%';
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
