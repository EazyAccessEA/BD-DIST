/* ===== DATA MANAGER =====
   localStorage CRUD for beneficiaries and event metadata
*/
const Data = {
  KEYS: { beneficiaries: 'fd_beneficiaries', meta: 'fd_event_meta' },

  // --- Beneficiaries ---
  getBeneficiaries() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.beneficiaries)) || [];
    } catch { return []; }
  },

  saveBeneficiaries(list) {
    localStorage.setItem(this.KEYS.beneficiaries, JSON.stringify(list));
  },

  findById(id) {
    return this.getBeneficiaries().find(b => b.id === id) || null;
  },

  findByName(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.getBeneficiaries().filter(b =>
      b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
    );
  },

  markCollected(id) {
    const list = this.getBeneficiaries();
    const person = list.find(b => b.id === id);
    if (!person) return null;
    if (person.collected) return { duplicate: true, person };
    person.collected = true;
    person.collected_at = new Date().toISOString();
    this.saveBeneficiaries(list);
    return { duplicate: false, person };
  },

  // --- Event Meta ---
  getMeta() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.meta)) || {};
    } catch { return {}; }
  },

  saveMeta(meta) {
    localStorage.setItem(this.KEYS.meta, JSON.stringify(meta));
  },

  // --- Stats ---
  getStats() {
    const list = this.getBeneficiaries();
    const collected = list.filter(b => b.collected).length;
    return { total: list.length, collected, remaining: list.length - collected };
  },

  // --- Import from CSV ---
  importCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { error: 'CSV ফাইলে কোনো ডাটা নেই / CSV file has no data' };

    const header = lines[0].toLowerCase();
    const cols = header.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

    // Auto-detect columns
    const nameAliases = ['name', 'নাম', 'full_name', 'fullname', 'beneficiary', 'beneficiary_name'];
    const phoneAliases = ['phone', 'ফোন', 'mobile', 'মোবাইল', 'phone_number', 'contact', 'tel'];

    let nameIdx = cols.findIndex(c => nameAliases.includes(c));
    let phoneIdx = cols.findIndex(c => phoneAliases.includes(c));

    // Fallback: first col = name, second = phone
    if (nameIdx === -1) nameIdx = 0;
    if (phoneIdx === -1) phoneIdx = Math.min(1, cols.length - 1);

    const beneficiaries = [];
    const phoneSet = new Map();
    const duplicatePhones = [];

    for (let i = 1; i < lines.length; i++) {
      const row = Data._parseCSVLine(lines[i]);
      if (row.length <= Math.max(nameIdx, phoneIdx)) continue;

      const name = row[nameIdx].trim();
      const phone = row[phoneIdx].trim().replace(/[^0-9+]/g, '');
      if (!name) continue;

      const id = 'FD-' + String(i).padStart(4, '0');
      const phone_last4 = phone.slice(-4);

      if (phone && phoneSet.has(phone)) {
        duplicatePhones.push({ phone, names: [phoneSet.get(phone), name] });
      }
      if (phone) phoneSet.set(phone, name);

      beneficiaries.push({
        id, name, phone, phone_last4,
        collected: false, collected_at: null, notes: ''
      });
    }

    this.saveBeneficiaries(beneficiaries);
    return { count: beneficiaries.length, duplicatePhones };
  },

  // Simple CSV line parser handling quoted fields
  _parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  },

  // --- Export ---
  exportCSV() {
    const list = this.getBeneficiaries();
    const meta = this.getMeta();
    let csv = 'ID,Name,Phone,Collected,Collected_At,Notes\n';
    for (const b of list) {
      const row = [
        b.id,
        '"' + b.name.replace(/"/g, '""') + '"',
        b.phone,
        b.collected ? 'Yes' : 'No',
        b.collected_at || '',
        '"' + (b.notes || '').replace(/"/g, '""') + '"'
      ];
      csv += row.join(',') + '\n';
    }
    return csv;
  },

  addWalkin(name, phone) {
    const list = this.getBeneficiaries();
    const maxNum = list.reduce((max, b) => {
      const n = parseInt(b.id.replace('FD-', ''), 10);
      return n > max ? n : max;
    }, 0);
    const id = 'FD-' + String(maxNum + 1).padStart(4, '0');
    const person = {
      id, name, phone,
      phone_last4: phone.slice(-4),
      collected: false, collected_at: null,
      notes: 'Walk-in'
    };
    list.push(person);
    this.saveBeneficiaries(list);
    return person;
  },

  clearAll() {
    localStorage.removeItem(this.KEYS.beneficiaries);
    localStorage.removeItem(this.KEYS.meta);
  }
};
