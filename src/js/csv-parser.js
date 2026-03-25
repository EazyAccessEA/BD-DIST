/* ============================================
   CSV PARSER — Import/Export CSV Files
   ============================================ */

const CSVParser = {

  parse(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { error: 'CSV must have a header row and at least one data row', rows: [] };
    }

    const headers = this._parseLine(lines[0]).map(h => h.toLowerCase().trim());
    const nameCol = this._findColumn(headers, ['name', 'নাম', 'full_name', 'fullname', 'beneficiary']);
    const phoneCol = this._findColumn(headers, ['phone', 'ফোন', 'mobile', 'phone_number', 'contact', 'tel']);
    const householdCol = this._findColumn(headers, ['household', 'পরিবার', 'family', 'hh']);
    const nidCol = this._findColumn(headers, ['nid', 'national_id', 'এনআইডি']);
    const notesCol = this._findColumn(headers, ['notes', 'নোট', 'comments']);
    const photoCol = this._findColumn(headers, ['photo', 'image', 'ছবি']);

    if (nameCol === -1) {
      return { error: 'CSV must have a "name" column', rows: [] };
    }
    if (phoneCol === -1) {
      return { error: 'CSV must have a "phone" column', rows: [] };
    }

    const rows = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = this._parseLine(line);
      const name = (cols[nameCol] || '').trim();
      const phone = (cols[phoneCol] || '').trim().replace(/[^0-9+]/g, '');
      const household = householdCol !== -1 ? (cols[householdCol] || '').trim() : '';
      const nid = nidCol !== -1 ? (cols[nidCol] || '').trim() : '';
      const notes = notesCol !== -1 ? (cols[notesCol] || '').trim() : '';
      const photo = photoCol !== -1 ? (cols[photoCol] || '').trim() : '';

      if (!name) {
        errors.push(`Row ${i + 1}: missing name`);
        continue;
      }

      rows.push({ name, phone, household, nid, notes, photo });
    }

    return { error: null, rows, warnings: errors };
  },

  _findColumn(headers, aliases) {
    for (const alias of aliases) {
      const idx = headers.indexOf(alias);
      if (idx !== -1) return idx;
    }
    return -1;
  },

  _parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  },

  exportReport(beneficiaries, meta) {
    const headers = [
      'ID', 'Name', 'Phone', 'Household', 'NID',
      'Collected', 'Collected At', 'Proxy', 'Proxy Name', 'Notes',
    ];
    const rows = beneficiaries.map(b => [
      b.id,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      b.phone,
      b.household || '',
      b.nid || '',
      b.collected ? 'Yes' : 'No',
      b.collected_at ? new Date(b.collected_at).toLocaleString() : '',
      b.proxy ? 'Yes' : 'No',
      b.proxy_name || '',
      b.notes || '',
    ]);

    let csv = '\uFEFF'; // BOM for Excel UTF-8
    csv += headers.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');

    const eventName = meta?.event_name || 'distribution';
    const filename = `${eventName.replace(/\s+/g, '-')}-report.csv`;
    this._download(csv, filename, 'text/csv;charset=utf-8');
  },

  exportUncollected(beneficiaries, meta) {
    const uncollected = beneficiaries.filter(b => !b.collected);
    const headers = ['ID', 'Name', 'Phone', 'Household'];
    const rows = uncollected.map(b => [
      b.id,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      b.phone,
      b.household || '',
    ]);

    let csv = '\uFEFF';
    csv += headers.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');

    const eventName = meta?.event_name || 'distribution';
    const filename = `${eventName.replace(/\s+/g, '-')}-uncollected.csv`;
    this._download(csv, filename, 'text/csv;charset=utf-8');
  },

  _download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
