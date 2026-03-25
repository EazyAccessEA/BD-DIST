/* ============================================
   SCANNER — Camera QR Code Scanning
   ============================================ */

const Scanner = {
  _scanner: null,
  _isRunning: false,
  _onScan: null,
  _lastScanned: null,
  _lastScanTime: 0,
  _cooldownMs: 2000,

  init(containerId, onScan) {
    this._onScan = onScan;
    this._containerId = containerId;
  },

  async start() {
    if (this._isRunning) return;

    try {
      this._scanner = new Html5Qrcode(this._containerId);
      await this._scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => this._handleScan(decodedText),
        () => {} // ignore errors during scanning
      );
      this._isRunning = true;
    } catch (err) {
      throw new Error(this._getCameraErrorMsg(err));
    }
  },

  async stop() {
    if (!this._isRunning || !this._scanner) return;
    try {
      await this._scanner.stop();
      this._scanner.clear();
    } catch {
      // ignore stop errors
    }
    this._isRunning = false;
  },

  isRunning() {
    return this._isRunning;
  },

  _handleScan(decodedText) {
    const now = Date.now();
    // Debounce: ignore same code within cooldown
    if (decodedText === this._lastScanned && now - this._lastScanTime < this._cooldownMs) {
      return;
    }
    this._lastScanned = decodedText;
    this._lastScanTime = now;

    if (this._onScan) {
      this._onScan(decodedText.trim());
    }
  },

  _getCameraErrorMsg(err) {
    const msg = String(err?.message || err || '');
    if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
      return I18N.t('scan.title') + ': Camera permission denied. Please allow camera access.';
    }
    if (msg.includes('NotFoundError') || msg.includes('no camera')) {
      return 'No camera found on this device.';
    }
    if (msg.includes('NotReadableError')) {
      return 'Camera is in use by another app. Please close it and try again.';
    }
    return 'Camera error: ' + msg;
  },

  resetCooldown() {
    this._lastScanned = null;
    this._lastScanTime = 0;
  },
};
