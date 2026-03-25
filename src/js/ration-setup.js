/* ============================================
   RATION SETUP — Ration Definition Form
   ============================================ */

const RationSetup = {
  init() {
    const addBtn = document.getElementById('btn-add-ration-item');
    if (addBtn) addBtn.addEventListener('click', () => this._addItem());
  },

  refresh() {
    this._render();
  },

  _render() {
    const container = document.getElementById('ration-items-list');
    if (!container) return;
    const items = DataManager.getRationDef();

    if (!items.length) {
      container.innerHTML = '<div class="text-muted" style="padding:8px 0;">' +
        I18N.t('setup.ration_empty') + '</div>';
      return;
    }

    container.innerHTML = items.map((item, i) => `
      <div class="ration-row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <input class="input" type="text" value="${this._esc(item.item)}"
          data-ration-idx="${i}" data-ration-field="item"
          placeholder="${I18N.t('setup.ration_item')}" style="flex:2;">
        <input class="input" type="number" value="${item.quantity}"
          data-ration-idx="${i}" data-ration-field="quantity"
          placeholder="0" style="flex:1;width:60px;">
        <input class="input" type="text" value="${this._esc(item.unit)}"
          data-ration-idx="${i}" data-ration-field="unit"
          placeholder="${I18N.t('setup.ration_unit')}" style="flex:1;width:60px;">
        <button class="btn btn-ghost btn-sm text-danger"
          data-remove-ration="${i}" style="padding:4px 8px;">✕</button>
      </div>
    `).join('');

    this._bindInputs();
  },

  _bindInputs() {
    document.querySelectorAll('[data-ration-idx]').forEach(input => {
      input.addEventListener('change', () => this._saveFromDOM());
    });
    document.querySelectorAll('[data-remove-ration]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.removeRation);
        this._removeItem(idx);
      });
    });
  },

  _saveFromDOM() {
    const items = [];
    document.querySelectorAll('.ration-row').forEach(row => {
      const itemInput = row.querySelector('[data-ration-field="item"]');
      const qtyInput = row.querySelector('[data-ration-field="quantity"]');
      const unitInput = row.querySelector('[data-ration-field="unit"]');
      if (itemInput && qtyInput && unitInput) {
        items.push({
          item: itemInput.value.trim(),
          quantity: qtyInput.value.trim(),
          unit: unitInput.value.trim(),
        });
      }
    });
    DataManager.saveRationDef(items);
  },

  _addItem() {
    const items = DataManager.getRationDef();
    items.push({ item: '', quantity: '', unit: 'kg' });
    DataManager.saveRationDef(items);
    this._render();
  },

  _removeItem(idx) {
    const items = DataManager.getRationDef();
    items.splice(idx, 1);
    DataManager.saveRationDef(items);
    this._render();
  },

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },
};
