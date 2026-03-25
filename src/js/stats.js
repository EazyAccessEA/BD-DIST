/* ============================================
   STATS — Dashboard Counters + Progress
   ============================================ */

const Stats = {

  update() {
    const stats = DataManager.getStats();
    this._updateCounter('stat-total', stats.total);
    this._updateCounter('stat-collected', stats.collected);
    this._updateCounter('stat-remaining', stats.remaining);
    this._updateCounter('stat-walkins', stats.walkins);

    // Progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = stats.percent + '%';
    }

    // Progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${stats.collected} / ${stats.total} (${stats.percent}%)`;
    }

    // Scan day header counter
    const scanCounter = document.getElementById('scan-counter');
    if (scanCounter) {
      scanCounter.textContent = `${stats.collected} / ${stats.total}`;
    }

    // Scan day labels
    const scanCollected = document.getElementById('scan-stat-collected');
    const scanRemaining = document.getElementById('scan-stat-remaining');
    if (scanCollected) scanCollected.textContent = stats.collected;
    if (scanRemaining) scanRemaining.textContent = stats.remaining;
  },

  _updateCounter(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  renderReportsList() {
    const collectedList = DataManager.getCollectedList();
    UI.renderBeneficiaryList('reports-collected-list', collectedList, {
      emptyTitle: I18N.t('reports.no_data'),
      maxItems: 200,
    });

    const uncollectedList = DataManager.getUncollectedList();
    UI.renderBeneficiaryList('reports-uncollected-list', uncollectedList, {
      emptyTitle: I18N.t('reports.no_data'),
      maxItems: 200,
    });
  },
};
