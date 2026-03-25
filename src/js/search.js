/* ============================================
   SEARCH — Manual Name/ID Search Fallback
   ============================================ */

const Search = {
  _debounceTimer: null,

  init() {
    const setupSearch = document.getElementById('setup-search');
    const scanSearch = document.getElementById('scan-search-input');

    if (setupSearch) {
      setupSearch.addEventListener('input', (e) => {
        this._debounce(() => this._handleSetupSearch(e.target.value));
      });
    }

    if (scanSearch) {
      scanSearch.addEventListener('input', (e) => {
        this._debounce(() => this._handleScanSearch(e.target.value));
      });
    }
  },

  _debounce(fn, delay = 300) {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(fn, delay);
  },

  _handleSetupSearch(query) {
    if (!query.trim()) {
      const all = DataManager.getBeneficiaries();
      UI.renderBeneficiaryList('setup-list', all, {
        emptyTitle: I18N.t('setup.no_data'),
        emptyText: I18N.t('setup.no_data_desc'),
        maxItems: 100,
      });
      return;
    }
    const results = DataManager.findByName(query);
    UI.renderBeneficiaryList('setup-list', results, {
      emptyTitle: 'No matches',
      emptyText: `No beneficiaries matching "${query}"`,
      maxItems: 50,
    });
  },

  _handleScanSearch(query) {
    if (!query.trim()) {
      UI.hide('#scan-search-results');
      return;
    }
    const results = DataManager.findByName(query);
    UI.show('#scan-search-results');
    UI.renderBeneficiaryList('scan-search-results', results, {
      emptyTitle: 'No matches',
      maxItems: 20,
      showMarkBtn: true,
    });

    // Bind mark buttons
    document.querySelectorAll('[data-mark-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.markId;
        App.processCollection(id);
      });
    });
  },

  showScanSearch() {
    UI.show('#scan-search-panel');
    const input = document.getElementById('scan-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  },

  hideScanSearch() {
    UI.hide('#scan-search-panel');
    UI.hide('#scan-search-results');
  },
};
