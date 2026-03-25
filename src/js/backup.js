/* ============================================
   BACKUP — JSON Backup/Restore
   ============================================ */

const Backup = {

  exportState() {
    const meta = DataManager.getMeta();
    const data = {
      version: 1,
      app: 'bd-dist',
      exported_at: new Date().toISOString(),
      meta: meta,
      beneficiaries: DataManager.getBeneficiaries(),
      lang: I18N.getLang(),
    };

    const json = JSON.stringify(data, null, 2);
    const eventName = meta?.event_name || 'distribution';
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${eventName.replace(/\s+/g, '-')}-backup-${date}.json`;
    this._download(json, filename);
  },

  importState(jsonText) {
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      return { success: false, error: I18N.t('backup.invalid_file') };
    }

    if (!data || data.app !== 'bd-dist' || !data.version || !Array.isArray(data.beneficiaries)) {
      return { success: false, error: I18N.t('backup.invalid_file') };
    }

    if (data.meta) {
      DataManager.saveMeta(data.meta);
    }
    DataManager.saveBeneficiaries(data.beneficiaries);

    if (data.lang) {
      I18N.setLang(data.lang);
    }

    return { success: true, count: data.beneficiaries.length };
  },

  triggerImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const doImport = () => {
          const result = this.importState(reader.result);
          if (result.success) {
            UI.toastSuccess(I18N.t('backup.import_success') + ` (${result.count})`);
          } else {
            UI.toastError(result.error);
          }
        };

        if (DataManager.hasData()) {
          UI.showConfirm(
            I18N.t('backup.restore'),
            I18N.t('backup.confirm_restore'),
            doImport
          );
        } else {
          doImport();
        }
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  },

  _download(content, filename) {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
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
