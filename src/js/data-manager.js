/* ============================================
   DATA MANAGER — localStorage CRUD Operations
   ============================================ */

const DataManager = {
  KEYS: {
    beneficiaries: 'fd_beneficiaries',
    meta: 'fd_event_meta',
    audit_log: 'fd_audit_log',
    ration_def: 'fd_ration_def',
  },

  // --- Beneficiaries ---

  getBeneficiaries() {
    try {
      const raw = localStorage.getItem(this.KEYS.beneficiaries);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveBeneficiaries(list) {
    localStorage.setItem(this.KEYS.beneficiaries, JSON.stringify(list));
  },

  importBeneficiaries(parsedRows) {
    const list = parsedRows.map((row, i) => ({
      id: 'FD-' + String(i + 1).padStart(4, '0'),
      name: (row.name || '').trim(),
      phone: (row.phone || '').trim(),
      phone_last4: (row.phone || '').trim().slice(-4),
      household: row.household || '',
      nid: row.nid || '',
      photo: row.photo || '',
      collected: false,
      collected_at: null,
      proxy: false,
      proxy_name: '',
      notes: row.notes || '',
    }));
    this.saveBeneficiaries(list);
    return list;
  },

  findById(id) {
    const list = this.getBeneficiaries();
    return list.find(b => b.id === id) || null;
  },

  findByName(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const list = this.getBeneficiaries();
    return list.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.phone_last4.includes(q)
    );
  },

  markCollected(id, options = {}) {
    const list = this.getBeneficiaries();
    const person = list.find(b => b.id === id);
    if (!person) return null;
    if (person.collected) return { alreadyCollected: true, person };
    person.collected = true;
    person.collected_at = new Date().toISOString();
    if (options.proxy) {
      person.proxy = true;
      person.proxy_name = options.proxy_name || '';
    }
    this.saveBeneficiaries(list);
    this.appendAuditEntry({ action: 'collect', id, timestamp: person.collected_at });
    return { alreadyCollected: false, person };
  },

  undoCollection(id, reason) {
    const list = this.getBeneficiaries();
    const person = list.find(b => b.id === id);
    if (!person || !person.collected) return null;
    const prevTime = person.collected_at;
    person.collected = false;
    person.collected_at = null;
    person.proxy = false;
    person.proxy_name = '';
    this.saveBeneficiaries(list);
    this.appendAuditEntry({
      action: 'undo',
      id,
      reason,
      prev_collected_at: prevTime,
      timestamp: new Date().toISOString(),
    });
    return person;
  },

  addWalkin(name, phone) {
    const list = this.getBeneficiaries();
    const nextNum = list.length + 1;
    const person = {
      id: 'FD-' + String(nextNum).padStart(4, '0'),
      name: name.trim(),
      phone: phone.trim(),
      phone_last4: phone.trim().slice(-4),
      household: '',
      nid: '',
      photo: '',
      collected: false,
      collected_at: null,
      proxy: false,
      proxy_name: '',
      notes: 'walk-in',
    };
    list.push(person);
    this.saveBeneficiaries(list);
    return person;
  },

  getStats() {
    const list = this.getBeneficiaries();
    const total = list.length;
    const collected = list.filter(b => b.collected).length;
    const walkins = list.filter(b => b.notes === 'walk-in').length;
    const proxies = list.filter(b => b.proxy).length;
    const auditLog = this.getAuditLog();
    const corrections = auditLog.filter(e => e.action === 'undo').length;
    return {
      total,
      collected,
      remaining: total - collected,
      walkins,
      proxies,
      corrections,
      percent: total > 0 ? Math.round((collected / total) * 100) : 0,
    };
  },

  getCollectedList() {
    return this.getBeneficiaries()
      .filter(b => b.collected)
      .sort((a, b) => (a.collected_at || '').localeCompare(b.collected_at || ''));
  },

  getUncollectedList() {
    return this.getBeneficiaries()
      .filter(b => !b.collected)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getDuplicatePhones() {
    const list = this.getBeneficiaries();
    const phoneCounts = {};
    list.forEach(b => {
      if (b.phone) {
        phoneCounts[b.phone] = (phoneCounts[b.phone] || 0) + 1;
      }
    });
    return Object.entries(phoneCounts)
      .filter(([, count]) => count > 1)
      .map(([phone, count]) => ({ phone, count }));
  },

  // --- Household ---

  getHouseholdMembers(householdId) {
    if (!householdId) return [];
    return this.getBeneficiaries().filter(b => b.household === householdId);
  },

  markHouseholdCollected(householdId, options = {}) {
    const list = this.getBeneficiaries();
    const members = list.filter(b => b.household === householdId && !b.collected);
    const now = new Date().toISOString();
    members.forEach(p => {
      p.collected = true;
      p.collected_at = now;
      if (options.proxy) {
        p.proxy = true;
        p.proxy_name = options.proxy_name || '';
      }
      this.appendAuditEntry({ action: 'collect', id: p.id, timestamp: now });
    });
    this.saveBeneficiaries(list);
    return members;
  },

  // --- Audit Log ---

  getAuditLog() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.audit_log)) || [];
    } catch {
      return [];
    }
  },

  appendAuditEntry(entry) {
    const log = this.getAuditLog();
    log.push(entry);
    localStorage.setItem(this.KEYS.audit_log, JSON.stringify(log));
  },

  // --- Ration Definition ---

  getRationDef() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ration_def)) || [];
    } catch {
      return [];
    }
  },

  saveRationDef(items) {
    localStorage.setItem(this.KEYS.ration_def, JSON.stringify(items));
  },

  // --- Event Meta ---

  getMeta() {
    try {
      const raw = localStorage.getItem(this.KEYS.meta);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveMeta(meta) {
    localStorage.setItem(this.KEYS.meta, JSON.stringify(meta));
  },

  setEventInfo(name, date) {
    const meta = {
      event_name: name,
      event_date: date,
      total_beneficiaries: this.getBeneficiaries().length,
      created_at: new Date().toISOString(),
    };
    this.saveMeta(meta);
    return meta;
  },

  // --- Clear ---

  clearAll() {
    localStorage.removeItem(this.KEYS.beneficiaries);
    localStorage.removeItem(this.KEYS.meta);
    localStorage.removeItem(this.KEYS.audit_log);
    localStorage.removeItem(this.KEYS.ration_def);
  },

  hasData() {
    return this.getBeneficiaries().length > 0;
  },
};
