/* ============================================
   DISTRIBUTE — Name-Search Distribution Mode
   ============================================ */

const Distribute = {
  _debounceTimer: null,
  _allBeneficiaries: [],

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
    // Return the Bengali (or other script) character as-is
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

    const groups = this._groupByLetter(list);
    const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'bn'));
    let html = '';

    letters.forEach(letter => {
      html += `<div class="letter-header" data-letter="${this._esc(letter)}">${this._esc(letter)}</div>`;
      groups[letter].forEach(b => {
        const isCollected = b.collected;
        const itemCls = 'distribute-item' + (isCollected ? ' distribute-item-collected' : '');
        const timeStr = b.collected_at
          ? new Date(b.collected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        html += `<div class="${itemCls}" data-id="${b.id}">`;
        html += `  <div class="distribute-item-info">`;
        html += `    <div class="distribute-item-name">${this._esc(b.name)}</div>`;
        html += `    <div class="distribute-item-meta">${b.id} · ${I18N.t('distribute.phone_hint')}: **${b.phone_last4}</div>`;
        html += `  </div>`;

        if (isCollected) {
          html += `<span class="badge badge-success">✓ ${I18N.t('distribute.given')} ${timeStr}</span>`;
        } else {
          html += `<button class="distribute-give-btn" data-give-id="${b.id}">${I18N.t('distribute.give_food')}</button>`;
        }

        html += `</div>`;
      });
    });

    container.innerHTML = html;
    this._bindGiveButtons();
  },

  _bindGiveButtons() {
    document.querySelectorAll('[data-give-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.giveId;
        this._showConfirmation(id);
      });
    });
  },

  _showConfirmation(id) {
    const person = DataManager.findById(id);
    if (!person) return;

    if (person.collected) {
      UI.toastWarning(I18N.t('scan.already'));
      return;
    }

    const bodyHtml = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">${this._esc(person.name)}</div>
        <div style="color:var(--text-muted);margin-bottom:4px;">ID: ${person.id}</div>
        <div style="color:var(--text-muted);">${I18N.t('distribute.phone_hint')}: **${person.phone_last4}</div>
      </div>
    `;

    UI.showModal(
      I18N.t('distribute.confirm_give'),
      bodyHtml,
      [
        {
          label: I18N.t('common.cancel'),
          cls: 'btn-ghost',
          onClick: () => UI.closeModal()
        },
        {
          label: I18N.t('distribute.give_food'),
          cls: 'btn-success',
          onClick: () => {
            UI.closeModal();
            this._confirmGive(id);
          }
        }
      ]
    );
  },

  _confirmGive(id) {
    const result = DataManager.markCollected(id);
    if (!result) {
      UI.toastError('Person not found');
      return;
    }
    if (result.alreadyCollected) {
      UI.toastWarning(I18N.t('scan.already'));
      return;
    }

    UI.toastSuccess('✓ ' + result.person.name);
    this._allBeneficiaries = DataManager.getBeneficiaries();
    this._allBeneficiaries.sort((a, b) => a.name.localeCompare(b.name, 'bn'));
    this._updateCounters();
    Stats.update();

    // Update the single item in-place instead of full re-render
    this._updateItemInPlace(id, result.person);
  },

  _updateItemInPlace(id, person) {
    const item = document.querySelector(`.distribute-item[data-id="${id}"]`);
    if (!item) return;

    item.classList.add('distribute-item-collected');
    const timeStr = person.collected_at
      ? new Date(person.collected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    const btn = item.querySelector('[data-give-id]');
    if (btn) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-success';
      badge.textContent = '✓ ' + I18N.t('distribute.given') + ' ' + timeStr;
      btn.replaceWith(badge);
    }
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },
};
