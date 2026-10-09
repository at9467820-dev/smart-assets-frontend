/**
 * AssetPulse — Smart QR Asset Scanner & Action Hub
 */
document.addEventListener('DOMContentLoaded', function () {
  const scannerEl = document.getElementById('qr-reader');
  if (!scannerEl) return;

  const resultEl  = document.getElementById('scan-result');
  const startBtn  = document.getElementById('start-scan');
  const stopBtn   = document.getElementById('stop-scan');
  const manualInput = document.getElementById('manual-tag-input');
  const manualBtn = document.getElementById('manual-lookup-btn');

  let scanner = null;

  function parseScannedData(decodedText) {
    let clean = decodedText.trim();
    let assetId = null;

    // Check if it's a full URL e.g. http://localhost:5000/assets/12
    if (clean.includes('/assets/')) {
      const parts = clean.split('/assets/');
      const lastPart = parts[parts.length - 1].split('/')[0].split('?')[0];
      if (/^\d+$/.test(lastPart)) {
        assetId = lastPart;
      }
    } else if (/^\d+$/.test(clean)) {
      assetId = clean;
    }

    return { raw: clean, assetId: assetId };
  }

  function displayActionHub(data) {
    if (!resultEl) return;

    const raw = data.raw;
    const targetUrl = data.assetId ? `/assets/${data.assetId}` : `/assets/scan-action/${encodeURIComponent(raw)}`;
    const issueUrl = data.assetId ? `/issues/create?asset_id=${data.assetId}` : `/issues/create`;
    const maintUrl = data.assetId ? `/maintenance/create?asset_id=${data.assetId}` : `/maintenance/create`;

    resultEl.innerHTML = `
      <div class="card" style="border: 2px solid var(--emerald); background: rgba(16, 185, 129, 0.04); box-shadow: 0 8px 20px rgba(0,0,0,0.06);">
        <div class="card-body-custom p-3">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-success"><i class="bi bi-qr-code me-1"></i>QR Scanned</span>
              <span class="fw-bold text-dark font-monospace">${raw}</span>
            </div>
            <a href="${targetUrl}" class="btn btn-sm btn-primary">
              <i class="bi bi-arrow-right-circle me-1"></i>Open Asset
            </a>
          </div>

          <div class="text-muted mb-2" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
            Select Immediate Action:
          </div>

          <div class="d-grid gap-2">
            <a href="${issueUrl}" class="btn btn-success btn-sm text-start py-2">
              <i class="bi bi-file-earmark-plus-fill me-2"></i><b>Issue Material / Gate Pass (Parchi)</b>
            </a>
            <a href="${maintUrl}" class="btn btn-warning btn-sm text-dark text-start py-2">
              <i class="bi bi-tools me-2"></i><b>Send for Maintenance / Service Request</b>
            </a>
            <a href="${targetUrl}" class="btn btn-outline-dark btn-sm text-start py-2">
              <i class="bi bi-eye-fill me-2"></i><b>View Full Asset History & Return Status</b>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function onScanSuccess(decodedText) {
    const data = parseScannedData(decodedText);
    displayActionHub(data);

    // Stop scanner after recognition
    if (scanner) {
      stopScanner();
    }
  }

  function onScanError(err) {
    // Continuous scan errors are ignored
  }

  function startScanner() {
    if (scanner) return;

    scanner = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(devices => {
      if (!devices || devices.length === 0) {
        alert('No camera found on this device. You can enter the Asset Tag manually.');
        return;
      }
      // Prefer rear environment camera if available
      const cameraId = devices.length > 1 ? devices[devices.length - 1].id : devices[0].id;
      scanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        onScanSuccess,
        onScanError
      ).then(() => {
        startBtn?.classList.add('d-none');
        stopBtn?.classList.remove('d-none');
      }).catch(err => {
        alert('Could not start camera: ' + err);
        scanner = null;
      });
    }).catch(err => {
      alert('Camera access denied or unavailable: ' + err);
    });
  }

  function stopScanner() {
    scanner?.stop().then(() => {
      scanner.clear();
      scanner = null;
      startBtn?.classList.remove('d-none');
      stopBtn?.classList.add('d-none');
    }).catch(() => {
      scanner = null;
    });
  }

  startBtn?.addEventListener('click', startScanner);
  stopBtn?.addEventListener('click', stopScanner);

  // Manual lookup handler
  manualBtn?.addEventListener('click', function() {
    const val = manualInput?.value.trim();
    if (val) {
      const data = parseScannedData(val);
      displayActionHub(data);
    }
  });

  manualInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      manualBtn?.click();
    }
  });

  if (scannerEl.dataset.autostart === 'true') {
    startScanner();
  }
});
