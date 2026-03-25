/* ===== SCANNER MODULE =====
   QR scanning, manual search, walk-in, status overlays
*/
const Scanner = {
  _html5Qr: null,
  _isScanning: false,

  startScan() {
    if (Data.getBeneficiaries().length === 0) {
      alert('প্রথমে তালিকা আমদানি করুন / Import list first');
      return;
    }
    const container = document.getElementById('scannerContainer');
    container.style.display = 'block';
    document.getElementById('manualSearch').style.display = 'none';

    if (this._html5Qr) {
      this._html5Qr.clear();
      this._html5Qr = null;
    }

    this._html5Qr = new Html5Qrcode('qrReader');
    this._isScanning = true;

    this._html5Qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => this._onScanSuccess(decodedText),
      () => {} // ignore scan errors
    ).catch(err => {
      console.error('Camera error:', err);
      container.style.display = 'none';
      alert('ক্যামেরা চালু হয়নি / Camera failed. Use manual search.');
      this.showManualSearch();
    });
  },

  stopScan() {
    if (this._html5Qr && this._isScanning) {
      this._html5Qr.stop().then(() => {
        this._html5Qr.clear();
        this._html5Qr = null;
        this._isScanning = false;
      }).catch(() => {});
    }
    document.getElementById('scannerContainer').style.display = 'none';
  },

  _onScanSuccess(code) {
    // Pause scanning during result display
    if (this._html5Qr && this._isScanning) {
      this._html5Qr.pause(true);
    }

    // Vibrate on scan
    if (navigator.vibrate) navigator.vibrate(100);

    const person = Data.findById(code);
    if (!person) {
      this._showOverlay('warning', '⚠️', 'অজানা কোড / Unknown Code',
        code, 'এই QR তালিকায় নেই / Not in list', [
          { label: '🔍 নাম দিয়ে খুঁজুন / Search', action: () => { this._hideOverlay(); this._resumeScan(); this.showManualSearch(); } },
          { label: '✕ বাতিল / Dismiss', action: () => { this._hideOverlay(); this._resumeScan(); } }
        ]);
      return;
    }

    if (person.collected) {
      const time = person.collected_at ? new Date(person.collected_at).toLocaleTimeString('bn-BD') : '';
      this._showOverlay('danger', '🚫', 'ইতিমধ্যে সংগ্রহ করেছে', person.name,
        `Already Collected\n⏰ ${time}`, [
          { label: '✕ বন্ধ / Close', action: () => { this._hideOverlay(); this._resumeScan(); } }
        ]);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      return;
    }

    // Valid — show confirmation
    this._showOverlay('success', '✅', 'খাদ্য দিন / GIVE FOOD', person.name,
      `${person.id}  •  📱 ****${person.phone_last4}`, [
        { label: '✅ নিশ্চিত করুন / Confirm', action: () => this._confirmCollection(person.id), className: 'confirm-btn' },
        { label: '✕ বাতিল / Cancel', action: () => { this._hideOverlay(); this._resumeScan(); } }
      ]);
  },

  _confirmCollection(id) {
    const result = Data.markCollected(id);
    if (result && !result.duplicate) {
      if (navigator.vibrate) navigator.vibrate(50);
      this._hideOverlay();
      this._resumeScan();
      App.updateStats();
      this._addToRecent(result.person);
    }
  },

  _resumeScan() {
    try {
      if (this._html5Qr && this._isScanning) {
        this._html5Qr.resume();
      }
    } catch (e) { /* scanner may have been stopped */ }
  },

  _showOverlay(type, icon, title, name, detail, buttons) {
    const overlay = document.getElementById('statusOverlay');
    overlay.className = `overlay ${type}`;
    overlay.style.display = 'flex';
    document.getElementById('overlayIcon').textContent = icon;
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayName').textContent = name;
    document.getElementById('overlayDetail').textContent = detail;

    const actionsEl = document.getElementById('overlayActions');
    actionsEl.innerHTML = '';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = `btn ${b.className || ''}`;
      btn.textContent = b.label;
      btn.onclick = b.action;
      actionsEl.appendChild(btn);
    });
  },

  _hideOverlay() {
    document.getElementById('statusOverlay').style.display = 'none';
  },

  showManualSearch() {
    document.getElementById('manualSearch').style.display = 'block';
    document.getElementById('scannerContainer').style.display = 'none';
    this.stopScan();
    document.getElementById('scanSearch').focus();
  },

  searchByName(query) {
    const results = Data.findByName(query);
    const container = document.getElementById('scanSearchResults');

    if (!query.trim()) { container.innerHTML = ''; return; }
    if (results.length === 0) {
      container.innerHTML = '<p style="padding:12px;color:#6b7280">কোনো ফলাফল নেই / No results</p>';
      return;
    }

    container.innerHTML = results.slice(0, 20).map(b => `
      <div class="list-item ${b.collected ? 'collected' : ''}">
        <div>
          <div class="name">${Setup._esc(b.name)}</div>
          <div class="phone">📱 ****${b.phone_last4} &nbsp; <span class="id-badge">${b.id}</span></div>
        </div>
        ${b.collected
          ? '<span class="check">✅</span>'
          : `<button class="select-btn" onclick="Scanner.manualSelect('${b.id}')">নির্বাচন</button>`
        }
      </div>
    `).join('');
  },

  manualSelect(id) {
    const person = Data.findById(id);
    if (!person) return;
    if (person.collected) {
      alert('ইতিমধ্যে সংগ্রহ করেছে / Already collected');
      return;
    }
    this._showOverlay('success', '✅', 'খাদ্য দিন / GIVE FOOD', person.name,
      `${person.id}  •  📱 ****${person.phone_last4}`, [
        { label: '✅ নিশ্চিত করুন / Confirm', action: () => { this._confirmCollection(person.id); document.getElementById('scanSearch').value = ''; document.getElementById('scanSearchResults').innerHTML = ''; }, className: 'confirm-btn' },
        { label: '✕ বাতিল / Cancel', action: () => this._hideOverlay() }
      ]);
  },

  addWalkin() {
    const name = prompt('নাম / Name:');
    if (!name) return;
    const phone = prompt('ফোন নম্বর / Phone:') || '';
    const person = Data.addWalkin(name, phone);
    App.updateStats();
    alert(`✅ ${person.name} যোগ হয়েছে (${person.id}) / Added`);
  },

  _addToRecent(person) {
    const container = document.getElementById('recentScans');
    const list = document.getElementById('recentList');
    container.style.display = 'block';
    const time = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    const item = `<div class="list-item"><div><div class="name">${Setup._esc(person.name)}</div><div class="phone">${time} • ${person.id}</div></div><span class="check">✅</span></div>`;
    list.innerHTML = item + list.innerHTML;
    // Keep only last 10
    while (list.children.length > 10) list.removeChild(list.lastChild);
  }
};
