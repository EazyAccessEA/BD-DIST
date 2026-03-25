/* ============================================
   UI — DOM Helpers, Toasts, Modals
   ============================================ */

const UI = {
  _toastContainer: null,

  init() {
    this._toastContainer = document.getElementById('toast-container');
  },

  $(selector) {
    return document.querySelector(selector);
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  show(el) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.remove('hidden');
  },

  hide(el) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.add('hidden');
  },

  // --- Toast Notifications ---

  toast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this._toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  toastSuccess(msg) { this.toast(msg, 'success'); },
  toastError(msg) { this.toast(msg, 'error', 5000); },
  toastWarning(msg) { this.toast(msg, 'warning', 4000); },

  // --- Modal ---

  showModal(title, bodyHtml, actions) {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';

    let actionsHtml = '';
    if (actions && actions.length) {
      actionsHtml = '<div class="modal-actions">' +
        actions.map((a, i) =>
          `<button class="btn ${a.cls || 'btn-outline'}" data-action="${i}">${a.label}</button>`
        ).join('') +
        '</div>';
    }

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-title">${title}</div>
        <div class="modal-body">${bodyHtml}</div>
        ${actionsHtml}
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
      const actionIdx = e.target.dataset.action;
      if (actionIdx !== undefined && actions[actionIdx]) {
        actions[actionIdx].onClick();
      }
    });

    document.body.appendChild(overlay);
    return overlay;
  },

  showConfirm(title, message, onConfirm) {
    this.showModal(title, `<p>${message}</p>`, [
      { label: I18N.t('common.cancel'), cls: 'btn-ghost', onClick: () => this.closeModal() },
      { label: I18N.t('common.confirm'), cls: 'btn-danger', onClick: () => { this.closeModal(); onConfirm(); } },
    ]);
  },

  closeModal() {
    const existing = document.getElementById('active-modal');
    if (existing) existing.remove();
  },

  // --- Scan Result Overlays ---

  showScanResult(type, person, extra) {
    this.closeScanResult();
    const overlay = document.createElement('div');
    overlay.className = `scan-result scan-result-${type}`;
    overlay.id = 'scan-result-overlay';

    if (type === 'success') {
      overlay.innerHTML = `
        <div class="scan-result-icon">✅</div>
        <div class="scan-result-name">${this._esc(person.name)}</div>
        <div class="scan-result-detail">
          ID: ${person.id}<br>
          ${I18N.t('scan.verify_phone')}: **${person.phone_last4}
        </div>
        <div class="scan-result-actions">
          <button class="btn btn-block btn-lg" style="background:rgba(255,255,255,0.3);color:white;font-size:1.25rem;"
            id="btn-confirm-collection">${I18N.t('scan.confirm')}</button>
          <button class="btn btn-block btn-ghost" style="color:rgba(255,255,255,0.8);"
            id="btn-dismiss-scan">${I18N.t('scan.dismiss')}</button>
        </div>
      `;
    } else if (type === 'danger') {
      const time = person.collected_at
        ? new Date(person.collected_at).toLocaleTimeString()
        : '';
      overlay.innerHTML = `
        <div class="scan-result-icon">🚫</div>
        <div class="scan-result-name">${I18N.t('scan.already')}</div>
        <div class="scan-result-detail">
          ${this._esc(person.name)}<br>
          ${I18N.t('scan.collected_at')}: ${time}<br>
          ${I18N.t('scan.do_not_give')}
        </div>
        <div class="scan-result-actions">
          <button class="btn btn-block btn-lg" style="background:rgba(255,255,255,0.3);color:white;"
            id="btn-dismiss-scan">${I18N.t('scan.dismiss')}</button>
        </div>
      `;
    } else if (type === 'warning') {
      overlay.innerHTML = `
        <div class="scan-result-icon">⚠️</div>
        <div class="scan-result-name">${I18N.t('scan.unknown')}</div>
        <div class="scan-result-detail">${I18N.t('scan.unknown_desc')}<br>${extra || ''}</div>
        <div class="scan-result-actions">
          <button class="btn btn-block btn-lg" style="background:rgba(255,255,255,0.3);color:white;"
            id="btn-search-backup">${I18N.t('scan.search_backup')}</button>
          <button class="btn btn-block btn-ghost" style="color:rgba(255,255,255,0.8);"
            id="btn-dismiss-scan">${I18N.t('scan.dismiss')}</button>
        </div>
      `;
    }

    document.body.appendChild(overlay);
    this._bindScanResultButtons();
  },

  _bindScanResultButtons() {
    const confirmBtn = document.getElementById('btn-confirm-collection');
    const dismissBtn = document.getElementById('btn-dismiss-scan');
    const searchBtn = document.getElementById('btn-search-backup');

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (this._onConfirmCollection) this._onConfirmCollection();
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => this.closeScanResult());
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.closeScanResult();
        if (this._onSearchBackup) this._onSearchBackup();
      });
    }
  },

  onConfirmCollection(fn) { this._onConfirmCollection = fn; },
  onSearchBackup(fn) { this._onSearchBackup = fn; },

  closeScanResult() {
    const el = document.getElementById('scan-result-overlay');
    if (el) el.remove();
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },

  // --- Render Helpers ---

  renderBeneficiaryList(containerId, list, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!list.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">${options.emptyTitle || 'No results'}</div>
          <div class="empty-state-text">${options.emptyText || ''}</div>
        </div>`;
      return;
    }

    const showMax = options.maxItems || 100;
    const displayed = list.slice(0, showMax);

    container.innerHTML = displayed.map(b => `
      <div class="list-item" data-id="${b.id}">
        <div class="list-item-info">
          <div class="list-item-name">${this._esc(b.name)}</div>
          <div class="list-item-meta">${b.id} · **${b.phone_last4}${b.notes ? ' · ' + b.notes : ''}</div>
        </div>
        ${b.collected
          ? `<span class="badge badge-success">✓ ${I18N.t('scan.collected')}</span>`
          : options.showMarkBtn
            ? `<button class="btn btn-success btn-sm" data-mark-id="${b.id}" style="min-height:36px;padding:6px 12px;font-size:0.875rem;">${I18N.t('scan.confirm')}</button>`
            : `<span class="badge badge-warning">${I18N.t('scan.remaining')}</span>`
        }
      </div>
    `).join('');

    if (list.length > showMax) {
      container.innerHTML += `<div class="list-item text-center text-muted" style="justify-content:center;">+${list.length - showMax} more</div>`;
    }
  },
};
