/* ============================================
   DISTRIBUTE — Name-Search Distribution Mode
   ============================================ */

const Distribute = {
  _debounceTimer: null,
  _allBeneficiaries: [],
  _groupMode: 'name', // 'name' or 'household'

  init() {
    const searchInput = document.getElementById('distribute-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._debounce(() => this._filterList(e.target.value), 300);
      });
    }

    const alphabet = document.getElementById('alphabet-index');
    if (alphabet) {
      alphabet.addEventListener('click', (e) => {
        const letter = e.target.closest('.alphabet-letter');
        if (!letter) return;
        const target = letter.dataset.letter;
        const header = document.querySelector(
          `.letter-header[data-letter="${target}"]`
        );
        if (header) header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  },

  refresh() {
    this._allBeneficiaries = DataManager.getBeneficiaries();
    this._allBeneficiaries.sort((a, b) => a.name.localeCompare(b.name, 'bn'));
    this._updateCounters();
    this._renderGroupToggle();
    this._buildAlphabet(this._allBeneficiaries);
    this._renderList(this._allBeneficiaries);
  },

  // --- Private helpers ---

  _debounce(fn, delay) {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(fn, delay);
  },

  _filterList(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this._buildAlphabet(this._allBeneficiaries);
      this._renderList(this._allBeneficiaries);
      return;
    }
    const filtered = this._allBeneficiaries.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.phone_last4.includes(q)
    );
    this._buildAlphabet(filtered);
    this._renderList(filtered);
  },

  _updateCounters() {
    const stats = DataManager.getStats();
    const collected = document.getElementById('distribute-stat-collected');
    const remaining = document.getElementById('distribute-stat-remaining');
    const progressFill = document.getElementById('distribute-progress-fill');
    const progressText = document.getElementById('distribute-progress-text');

    if (collected) collected.textContent = stats.collected;
    if (remaining) remaining.textContent = stats.remaining;
    if (progressFill) progressFill.style.width = stats.percent + '%';
    if (progressText) {
      progressText.textContent = stats.total > 0
        ? `${stats.collected} / ${stats.total} (${stats.percent}%)`
        : '';
    }

    if (stats.total > 0 && stats.remaining === 0) {
      UI.toastSuccess(I18N.t('distribute.all_done'));
    }
  },

  _getFirstChar(name) {
    if (!name) return '#';
    const ch = name.charAt(0).toUpperCase();
    if (/[A-Z]/.test(ch)) return ch;
    return ch;
  },

  _groupByLetter(list) {
    const groups = {};
    list.forEach(b => {
      const letter = this._getFirstChar(b.name);
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(b);
    });
    return groups;
  },

  _buildAlphabet(list) {
    const container = document.getElementById('alphabet-index');
    if (!container) return;

    const groups = this._groupByLetter(list);
    const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'bn'));

    container.innerHTML = letters.map(letter =>
      `<button class="alphabet-letter" data-letter="${this._esc(letter)}">${this._esc(letter)}</button>`
    ).join('');
  },

  // --- Household helpers ---

  _hasHouseholdData() {
    return this._allBeneficiaries.some(b => b.household && b.household.trim() !== '');
  },

  _renderGroupToggle() {
    const container = document.getElementById('distribute-group-toggle');
    if (!container) return;
    if (!this._hasHouseholdData()) {
      container.innerHTML = '';
      container.classList.add('hidden');
      return;
    }
    container.classList.remove('hidden');
    const nameActive = this._groupMode === 'name' ? ' btn-primary' : ' btn-ghost';
    const hhActive = this._groupMode === 'household' ? ' btn-primary' : ' btn-ghost';
    container.innerHTML =
      `<button class="btn btn-sm${nameActive}" data-group="name">${I18N.t('distribute.group_name')}</button>` +
      `<button class="btn btn-sm${hhActive}" data-group="household">${I18N.t('distribute.group_household')}</button>`;
    container.querySelectorAll('[data-group]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this._groupMode = e.currentTarget.dataset.group;
        this._renderGroupToggle();
        this._buildAlphabet(this._allBeneficiaries);
        this._renderList(this._allBeneficiaries);
      });
    });
  },

  _groupByHousehold(list) {
    const groups = {};
    const noHH = [];
    list.forEach(b => {
      const hh = (b.household || '').trim();
      if (!hh) { noHH.push(b); return; }
      if (!groups[hh]) groups[hh] = [];
      groups[hh].push(b);
    });
    return { groups, noHH };
  },

  // --- Render ---

  _renderList(list) {
    const container = document.getElementById('distribute-list');
    if (!container) return;

    if (!list.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">${I18N.t('distribute.search')}</div>
        </div>`;
      return;
    }

    if (this._groupMode === 'household' && this._hasHouseholdData()) {
      this._renderHouseholdList(container, list);
    } else {
      this._renderNameList(container, list);
    }

    this._bindGiveButtons();
    this._bindUndoHandlers();
  },

  _renderNameList(container, list) {
    const groups = this._groupByLetter(list);
    const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'bn'));
    let html = '';
    letters.forEach(letter => {
      html += `<div class="letter-header" data-letter="${this._esc(letter)}">${this._esc(letter)}</div>`;
      groups[letter].forEach(b => { html += this._renderItem(b); });
    });
    container.innerHTML = html;
  },

  _renderHouseholdList(container, list) {
    const { groups, noHH } = this._groupByHousehold(list);
    const hhKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'bn'));
    let html = '';
    hhKeys.forEach(hh => {
      const members = groups[hh];
      html += `<div class="letter-header" data-letter="${this._esc(hh)}">` +
        `${I18N.t('distribute.household_header')}: ${this._esc(hh)} (${members.length})</div>`;
      members.sort((a, b) => a.name.localeCompare(b.name, 'bn'));
      members.forEach(b => { html += this._renderItem(b); });
    });
    if (noHH.length) {
      html += `<div class="letter-header">—</div>`;
      noHH.sort((a, b) => a.name.localeCompare(b.name, 'bn'));
      noHH.forEach(b => { html += this._renderItem(b); });
    }
    container.innerHTML = html;
  },

  _renderItem(b) {
    const isCollected = b.collected;
    const itemCls = 'distribute-item' + (isCollected ? ' distribute-item-collected' : '');
    const timeStr = b.collected_at
      ? new Date(b.collected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const proxyTag = (isCollected && b.proxy)
      ? ` <span class="distribute-proxy-tag">(${I18N.t('distribute.proxy')})</span>`
      : '';

    let html = `<div class="${itemCls}" data-id="${b.id}">`;
    html += `  <div class="distribute-item-info">`;
    html += `    <div class="distribute-item-name">${this._esc(b.name)}</div>`;
    html += `    <div class="distribute-item-meta">${b.id} · ${I18N.t('distribute.phone_hint')}: **${b.phone_last4}</div>`;
    html += `  </div>`;

    if (isCollected) {
      html += `<span class="badge badge-success" data-undo-id="${b.id}" style="cursor:pointer;">` +
        `✓ ${I18N.t('distribute.given')} ${timeStr}${proxyTag}</span>`;
    } else {
      html += `<button class="distribute-give-btn" data-give-id="${b.id}">${I18N.t('distribute.give_food')}</button>`;
    }

    html += `</div>`;
    return html;
  },

  // --- Button bindings ---

  _bindGiveButtons() {
    document.querySelectorAll('[data-give-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showConfirmation(e.currentTarget.dataset.giveId);
      });
    });
  },

  _bindUndoHandlers() {
    document.querySelectorAll('[data-undo-id]').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showUndoModal(e.currentTarget.dataset.undoId);
      });
    });
  },

  // --- Undo modal ---

  _showUndoModal(id) {
    const person = DataManager.findById(id);
    if (!person || !person.collected) return;

    const timeStr = person.collected_at
      ? new Date(person.collected_at).toLocaleString()
      : '';

    const bodyHtml = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">${this._esc(person.name)}</div>
        <div style="color:var(--text-muted);margin-bottom:12px;">${I18N.t('scan.collected_at')}: ${timeStr}</div>
        <label style="display:block;text-align:left;margin-bottom:4px;font-weight:600;">
          ${I18N.t('distribute.undo_reason')}
        </label>
        <select id="undo-reason-select" style="width:100%;padding:10px;font-size:1rem;border-radius:8px;border:1px solid #ccc;">
          <option value="mistake">${I18N.t('distribute.undo_mistake')}</option>
          <option value="wrong_person">${I18N.t('distribute.undo_wrong')}</option>
          <option value="other">${I18N.t('distribute.undo_other')}</option>
        </select>
      </div>`;

    UI.showModal(
      I18N.t('distribute.undo'),
      bodyHtml,
      [
        { label: I18N.t('common.cancel'), cls: 'btn-ghost', onClick: () => UI.closeModal() },
        {
          label: I18N.t('distribute.undo'),
          cls: 'btn-danger',
          onClick: () => {
            const sel = document.getElementById('undo-reason-select');
            const reason = sel ? sel.value : 'other';
            UI.closeModal();
            this._confirmUndo(id, reason);
          }
        }
      ]
    );
  },

  _confirmUndo(id, reason) {
    const person = DataManager.undoCollection(id, reason);
    if (!person) return;

    UI.toastSuccess(I18N.t('distribute.undo') + ': ' + person.name);
    this._refreshDataAndCounters();
    this._updateItemInPlaceUndo(id, person);
  },

  _updateItemInPlaceUndo(id, person) {
    const item = document.querySelector(`.distribute-item[data-id="${id}"]`);
    if (!item) return;
    item.classList.remove('distribute-item-collected');
    const badge = item.querySelector('[data-undo-id]');
    if (badge) {
      const btn = document.createElement('button');
      btn.className = 'distribute-give-btn';
      btn.dataset.giveId = id;
      btn.textContent = I18N.t('distribute.give_food');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showConfirmation(id);
      });
      badge.replaceWith(btn);
    }
  },

  // --- Confirmation modal ---

  _showConfirmation(id) {
    const person = DataManager.findById(id);
    if (!person) return;

    if (person.collected) {
      UI.toastWarning(I18N.t('scan.already'));
      return;
    }

    let rationHtml = '';
    const rations = DataManager.getRationDef();
    if (rations && rations.length) {
      rationHtml = `<div style="text-align:left;margin-top:12px;padding:10px;background:#f0f7f0;border-radius:8px;">` +
        `<div style="font-weight:600;margin-bottom:6px;">${I18N.t('distribute.rations_label')}</div><ul style="margin:0;padding-left:20px;">`;
      rations.forEach(r => {
        rationHtml += `<li>${this._esc(r.name || r.item)}: ${this._esc(String(r.qty || r.amount || ''))} ${this._esc(r.unit || '')}</li>`;
      });
      rationHtml += `</ul></div>`;
    }

    const proxyId = 'proxy-check-' + id;
    const proxyNameId = 'proxy-name-' + id;

    const bodyHtml = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">${this._esc(person.name)}</div>
        <div style="color:var(--text-muted);margin-bottom:4px;">ID: ${person.id}</div>
        <div style="color:var(--text-muted);">${I18N.t('distribute.phone_hint')}: **${person.phone_last4}</div>
        ${rationHtml}
        <div style="text-align:left;margin-top:12px;padding-top:10px;border-top:1px solid #eee;">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="${proxyId}" style="width:20px;height:20px;">
            <span>${I18N.t('distribute.proxy')}</span>
          </label>
          <div id="${proxyNameId}-wrap" style="display:none;margin-top:8px;">
            <input type="text" id="${proxyNameId}" placeholder="${I18N.t('distribute.proxy_name')}"
              style="width:100%;padding:10px;font-size:1rem;border-radius:8px;border:1px solid #ccc;box-sizing:border-box;">
          </div>
        </div>
      </div>`;

    const modal = UI.showModal(
      I18N.t('distribute.confirm_give'),
      bodyHtml,
      [
        { label: I18N.t('common.cancel'), cls: 'btn-ghost', onClick: () => UI.closeModal() },
        {
          label: I18N.t('distribute.give_food'),
          cls: 'btn-success',
          onClick: () => {
            const chk = document.getElementById(proxyId);
            const nameInput = document.getElementById(proxyNameId);
            const isProxy = chk && chk.checked;
            const proxyName = nameInput ? nameInput.value.trim() : '';
            UI.closeModal();
            this._confirmGive(id, { proxy: isProxy, proxy_name: proxyName });
          }
        }
      ]
    );

    // Bind proxy checkbox toggle
    setTimeout(() => {
      const chk = document.getElementById(proxyId);
      const wrap = document.getElementById(proxyNameId + '-wrap');
      if (chk && wrap) {
        chk.addEventListener('change', () => {
          wrap.style.display = chk.checked ? 'block' : 'none';
        });
      }
    }, 50);
  },

  _confirmGive(id, options) {
    const proxyOpts = (options && options.proxy)
      ? { proxy: true, proxy_name: options.proxy_name || '' }
      : {};
    const result = DataManager.markCollected(id, proxyOpts);
    if (!result) {
      UI.toastError('Person not found');
      return;
    }
    if (result.alreadyCollected) {
      UI.toastWarning(I18N.t('scan.already'));
      return;
    }

    UI.toastSuccess('✓ ' + result.person.name);
    this._refreshDataAndCounters();
    this._updateItemInPlace(id, result.person);

    // If household mode, ask about marking household
    this._maybeAskHousehold(id, proxyOpts);
  },

  _maybeAskHousehold(id, proxyOpts) {
    if (this._groupMode !== 'household') return;
    const person = DataManager.findById(id);
    if (!person || !person.household) return;
    const members = DataManager.getHouseholdMembers(person.household);
    const uncollected = members.filter(m => !m.collected && m.id !== id);
    if (!uncollected.length) return;

    UI.showModal(
      I18N.t('distribute.mark_household'),
      `<p style="text-align:center;">${I18N.t('distribute.household_header')}: ${this._esc(person.household)}<br>(${uncollected.length} ${I18N.t('scan.remaining')})</p>`,
      [
        { label: I18N.t('common.no'), cls: 'btn-ghost', onClick: () => UI.closeModal() },
        {
          label: I18N.t('common.yes'),
          cls: 'btn-success',
          onClick: () => {
            UI.closeModal();
            this._markHousehold(person.household, proxyOpts);
          }
        }
      ]
    );
  },

  _markHousehold(householdId, proxyOpts) {
    const marked = DataManager.markHouseholdCollected(householdId, proxyOpts);
    if (!marked || !marked.length) return;
    this._refreshDataAndCounters();
    marked.forEach(p => this._updateItemInPlace(p.id, p));
    UI.toastSuccess('✓ ' + marked.length + ' ' + I18N.t('distribute.household_header'));
  },

  // --- In-place updates ---

  _updateItemInPlace(id, person) {
    const item = document.querySelector(`.distribute-item[data-id="${id}"]`);
    if (!item) return;

    item.classList.add('distribute-item-collected');
    const timeStr = person.collected_at
      ? new Date(person.collected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const proxyTag = person.proxy
      ? ` <span class="distribute-proxy-tag">(${I18N.t('distribute.proxy')})</span>`
      : '';

    const btn = item.querySelector('[data-give-id]');
    if (btn) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-success';
      badge.dataset.undoId = id;
      badge.style.cursor = 'pointer';
      badge.innerHTML = '✓ ' + I18N.t('distribute.given') + ' ' + timeStr + proxyTag;
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showUndoModal(id);
      });
      btn.replaceWith(badge);
    }
  },

  _refreshDataAndCounters() {
    this._allBeneficiaries = DataManager.getBeneficiaries();
    this._allBeneficiaries.sort((a, b) => a.name.localeCompare(b.name, 'bn'));
    this._updateCounters();
    if (typeof Stats !== 'undefined' && Stats.update) Stats.update();
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },
};
