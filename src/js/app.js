/* ============================================
   APP — Main Application Logic & Routing
   ============================================ */

const App = {
  _currentTab: 'setup',

  init() {
    I18N.init();
    UI.init();
    Search.init();
    this._bindNavigation();
    this._bindSetupActions();
    this._bindScanActions();
    this._bindReportActions();
    this._bindLangToggle();
    I18N.onLangChange(() => this._refreshUI());
    this._refreshUI();
    this.switchTab(DataManager.hasData() ? 'scan' : 'setup');
  },

  // --- Tab Navigation ---

  switchTab(tab) {
    this._currentTab = tab;
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const panel = document.getElementById(`panel-${tab}`);
    const navBtn = document.getElementById(`nav-${tab}`);
    if (panel) panel.classList.add('active');
    if (navBtn) navBtn.classList.add('active');

    if (tab === 'scan') this._refreshScanPanel();
    if (tab === 'reports') this._refreshReportsPanel();
    if (tab === 'setup') this._refreshSetupPanel();
  },

  _bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
  },

  // --- Setup Tab ---

  _bindSetupActions() {
    // CSV Import
    const fileInput = document.getElementById('csv-file-input');
    const dropZone = document.getElementById('csv-drop-zone');

    if (dropZone) {
      dropZone.addEventListener('click', () => fileInput?.click());
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) this._importCSV(file);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this._importCSV(file);
        fileInput.value = '';
      });
    }

    // Event info
    const eventName = document.getElementById('event-name');
    const eventDate = document.getElementById('event-date');
    if (eventName) eventName.addEventListener('change', () => this._saveEventInfo());
    if (eventDate) eventDate.addEventListener('change', () => this._saveEventInfo());

    // Generate cards
    const genBtn = document.getElementById('btn-generate-cards');
    if (genBtn) genBtn.addEventListener('click', () => this._generateCards());

    // Clear data
    const clearBtn = document.getElementById('btn-clear-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        UI.showConfirm(
          I18N.t('setup.clear_data'),
          I18N.t('setup.confirm_clear'),
          () => {
            DataManager.clearAll();
            this._refreshUI();
            UI.toastSuccess('Data cleared');
            this.switchTab('setup');
          }
        );
      });
    }

    // Add walk-in
    const walkinBtn = document.getElementById('btn-add-walkin');
    if (walkinBtn) walkinBtn.addEventListener('click', () => this._showWalkinModal());
  },

  _importCSV(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = CSVParser.parse(e.target.result);
      if (result.error) {
        UI.toastError(result.error);
        return;
      }
      const list = DataManager.importBeneficiaries(result.rows);
      this._saveEventInfo();
      UI.toastSuccess(`${list.length} ${I18N.t('setup.loaded')}`);

      const dupes = DataManager.getDuplicatePhones();
      if (dupes.length > 0) {
        UI.toastWarning(`${dupes.length} ${I18N.t('setup.dup_phones')}`);
      }
      if (result.warnings?.length) {
        UI.toastWarning(`${result.warnings.length} rows skipped`);
      }
      this._refreshUI();
    };
    reader.readAsText(file, 'UTF-8');
  },

  _saveEventInfo() {
    const name = document.getElementById('event-name')?.value || '';
    const date = document.getElementById('event-date')?.value || '';
    if (name || date) DataManager.setEventInfo(name, date);
  },

  _generateCards() {
    const list = DataManager.getBeneficiaries();
    if (!list.length) {
      UI.toastError('No beneficiaries loaded');
      return;
    }
    const meta = DataManager.getMeta();
    UI.toastSuccess(I18N.t('setup.generating'));
    setTimeout(() => QRGenerator.openPrintableCards(list, meta), 100);
  },

  _showWalkinModal() {
    UI.showModal(I18N.t('setup.add_walkin'),
      `<div class="input-group mb-md">
        <label>${I18N.t('setup.walkin_name')}</label>
        <input class="input" id="walkin-name" type="text" autocomplete="off">
      </div>
      <div class="input-group">
        <label>${I18N.t('setup.walkin_phone')}</label>
        <input class="input" id="walkin-phone" type="tel" autocomplete="off">
      </div>`,
      [
        { label: I18N.t('common.cancel'), cls: 'btn-ghost', onClick: () => UI.closeModal() },
        { label: I18N.t('common.save'), cls: 'btn-primary', onClick: () => {
          const name = document.getElementById('walkin-name')?.value;
          const phone = document.getElementById('walkin-phone')?.value;
          if (!name?.trim()) { UI.toastError('Name required'); return; }
          DataManager.addWalkin(name, phone || '');
          UI.closeModal();
          UI.toastSuccess(`Added: ${name}`);
          this._refreshUI();
        }},
      ]
    );
  },

  _refreshSetupPanel() {
    const list = DataManager.getBeneficiaries();
    const meta = DataManager.getMeta();

    if (meta) {
      const nameInput = document.getElementById('event-name');
      const dateInput = document.getElementById('event-date');
      if (nameInput && meta.event_name) nameInput.value = meta.event_name;
      if (dateInput && meta.event_date) dateInput.value = meta.event_date;
    }

    if (list.length > 0) {
      UI.show('#setup-data-loaded');
      UI.hide('#setup-no-data');
      document.getElementById('setup-count').textContent = list.length;
      UI.renderBeneficiaryList('setup-list', list, {
        emptyTitle: I18N.t('setup.no_data'),
        maxItems: 100,
      });
    } else {
      UI.hide('#setup-data-loaded');
      UI.show('#setup-no-data');
    }
  },

  // --- Scan Tab ---

  _bindScanActions() {
    const startBtn = document.getElementById('btn-start-scan');
    const stopBtn = document.getElementById('btn-stop-scan');
    const manualBtn = document.getElementById('btn-manual-entry');

    if (startBtn) startBtn.addEventListener('click', () => this._startScanner());
    if (stopBtn) stopBtn.addEventListener('click', () => this._stopScanner());
    if (manualBtn) manualBtn.addEventListener('click', () => Search.showScanSearch());

    UI.onConfirmCollection(() => {
      const id = this._pendingCollectionId;
      if (id) {
        DataManager.markCollected(id);
        UI.closeScanResult();
        Stats.update();
        UI.toastSuccess('✓ ' + I18N.t('scan.collected'));
        Scanner.resetCooldown();
        this._pendingCollectionId = null;
      }
    });

    UI.onSearchBackup(() => Search.showScanSearch());
  },

  async _startScanner() {
    if (!DataManager.hasData()) {
      UI.toastWarning(I18N.t('scan.no_data_warn'));
      return;
    }
    try {
      Scanner.init('scan-viewfinder', (code) => this._handleScannedCode(code));
      await Scanner.start();
      UI.hide('#btn-start-scan');
      UI.show('#btn-stop-scan');
    } catch (err) {
      UI.toastError(err.message);
    }
  },

  async _stopScanner() {
    await Scanner.stop();
    UI.show('#btn-start-scan');
    UI.hide('#btn-stop-scan');
  },

  _handleScannedCode(code) {
    const person = DataManager.findById(code);
    if (!person) {
      UI.showScanResult('warning', {}, code);
      return;
    }
    if (person.collected) {
      UI.showScanResult('danger', person);
      return;
    }
    this._pendingCollectionId = person.id;
    UI.showScanResult('success', person);
  },

  processCollection(id) {
    const result = DataManager.markCollected(id);
    if (!result) { UI.toastError('Person not found'); return; }
    if (result.alreadyCollected) {
      UI.toastWarning(I18N.t('scan.already'));
      return;
    }
    Stats.update();
    Search.hideScanSearch();
    UI.toastSuccess('✓ ' + result.person.name);
  },

  _refreshScanPanel() {
    Stats.update();
    if (!DataManager.hasData()) {
      UI.show('#scan-no-data');
      UI.hide('#scan-ready');
    } else {
      UI.hide('#scan-no-data');
      UI.show('#scan-ready');
    }
  },

  // --- Reports Tab ---

  _bindReportActions() {
    const exportBtn = document.getElementById('btn-export-report');
    const exportUncBtn = document.getElementById('btn-export-uncollected');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const list = DataManager.getBeneficiaries();
        const meta = DataManager.getMeta();
        CSVParser.exportReport(list, meta);
        UI.toastSuccess('Report downloaded');
      });
    }

    if (exportUncBtn) {
      exportUncBtn.addEventListener('click', () => {
        const list = DataManager.getBeneficiaries();
        const meta = DataManager.getMeta();
        CSVParser.exportUncollected(list, meta);
        UI.toastSuccess('Uncollected list downloaded');
      });
    }
  },

  _refreshReportsPanel() {
    Stats.update();
    Stats.renderReportsList();
  },

  // --- Language ---

  _bindLangToggle() {
    const btn = document.getElementById('btn-lang-toggle');
    if (btn) btn.addEventListener('click', () => {
      I18N.toggleLang();
      btn.textContent = I18N.t('app.lang_toggle');
    });
  },

  _refreshUI() {
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = I18N.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = I18N.t(el.dataset.i18nPlaceholder);
    });

    Stats.update();
    this._refreshSetupPanel();
  },
};

// Boot the app
document.addEventListener('DOMContentLoaded', () => App.init());
