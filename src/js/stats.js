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
    this._updateCounter('stat-proxies', stats.proxies);
    this._updateCounter('stat-corrections', stats.corrections);

    // Progress bar (scan panel)
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = stats.percent + '%';
    }

    // Progress bar (reports panel)
    const reportsProgressFill = document.getElementById('reports-progress-fill');
    if (reportsProgressFill) {
      reportsProgressFill.style.width = stats.percent + '%';
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

  renderRationSummary() {
    const container = document.getElementById('reports-ration-summary');
    if (!container) return;

    const ration = DataManager.getRationDef();
    if (!ration || ration.length === 0) {
      container.innerHTML = '';
      return;
    }

    const stats = DataManager.getStats();
    const collected = stats.collected;

    let html = '<div class="card">';
    html += '<h3 data-i18n="reports.ration_summary">' + I18N.t('reports.ration_summary') + '</h3>';
    html += '<p class="text-muted mt-sm">' + I18N.t('reports.total_distributed') + ':</p>';
    html += '<ul class="mt-sm" style="list-style:disc;padding-left:var(--space-lg);">';

    ration.forEach(function(r) {
      const qty = parseFloat(r.quantity) || 0;
      const total = qty * collected;
      const unit = r.unit || '';
      const perPerson = qty + ' ' + unit;
      html += '<li style="margin-bottom:var(--space-xs);">';
      html += '<strong>' + (r.item || '—') + '</strong>: ';
      html += total + ' ' + unit;
      html += ' <span class="text-muted">(' + collected + ' × ' + perPerson + ')</span>';
      html += '</li>';
    });

    html += '</ul></div>';
    container.innerHTML = html;
  },

  renderAuditLog() {
    const container = document.getElementById('reports-audit-log');
    if (!container) return;

    const log = DataManager.getAuditLog();
    if (!log || log.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-text">'
        + I18N.t('reports.no_audit') + '</div></div>';
      return;
    }

    // Show last 50 entries, most recent first
    const recent = log.slice(-50).reverse();
    let html = '';

    recent.forEach(function(entry) {
      const time = entry.timestamp
        ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '—';
      const date = entry.timestamp
        ? new Date(entry.timestamp).toLocaleDateString()
        : '';
      const actionLabel = entry.action === 'undo' ? '↩ Undo' : '✅ Collect';
      const actionClass = entry.action === 'undo' ? 'text-warning' : 'text-success';
      const reason = entry.reason ? ' — ' + entry.reason : '';

      html += '<div class="beneficiary-row" style="padding:var(--space-sm) var(--space-md);">';
      html += '<div>';
      html += '<span class="' + actionClass + ' font-bold">' + actionLabel + '</span> ';
      html += '<strong>' + (entry.id || '—') + '</strong>';
      if (reason) html += '<span class="text-muted">' + reason + '</span>';
      html += '</div>';
      html += '<div class="text-muted" style="font-size:0.85em;">' + date + ' ' + time + '</div>';
      html += '</div>';
    });

    container.innerHTML = html;
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

    this.renderRationSummary();
    this.renderAuditLog();
  },
};
