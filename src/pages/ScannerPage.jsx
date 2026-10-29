import React, { useState } from 'react';

export function ScannerPage({
  assets = [],
  onOpenIssueModal,
  onOpenMaintenanceModal,
  onOpenReturnModal,
}) {
  const [manualTag, setManualTag] = useState('');
  const [scannedAsset, setScannedAsset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLookup = (tag) => {
    setErrorMsg('');
    const found = assets.find(
      (a) =>
        a.asset_tag.toLowerCase() === tag.trim().toLowerCase() ||
        String(a.id) === tag.trim() ||
        (a.serial_number && a.serial_number.toLowerCase() === tag.trim().toLowerCase())
    );

    if (found) {
      setScannedAsset(found);
    } else {
      // Mock asset if not found in memory
      setScannedAsset({
        id: 999,
        asset_tag: tag.toUpperCase(),
        name: `Scanned Device (${tag.toUpperCase()})`,
        category: 'Lab Equipment',
        department: { name: 'Computer Science' },
        location: 'Lab 302, Computing Block',
        status: 'active',
        purchase_cost: 65000,
        risk_score: 30,
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualTag.trim()) return;
    handleLookup(manualTag);
  };

  const toggleCamera = () => {
    if (!isScanning) {
      setIsScanning(true);
      // Simulate quick scan for demonstration or connect webcam
      setTimeout(() => {
        if (assets.length > 0) {
          setScannedAsset(assets[0]);
        } else {
          handleLookup('CSE-001');
        }
        setIsScanning(false);
      }, 1500);
    } else {
      setIsScanning(false);
    }
  };

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="bi bi-qr-code-scan me-2" style={{ color: 'var(--emerald)' }}></i>
            Smart QR Asset Scanner &amp; Action Hub
          </h1>
          <p className="page-subtitle">
            Scan any asset QR code to issue material (generate parchi), send for maintenance, or check in returns
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="card mb-4">
          <div className="card-header-custom">
            <h3 className="card-title">
              <i className="bi bi-camera me-2" style={{ color: 'var(--brass)' }}></i>
              Camera QR Scanner
            </h3>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn btn-sm ${isScanning ? 'btn-danger' : 'btn-primary'}`}
                onClick={toggleCamera}
              >
                <i className={`bi ${isScanning ? 'bi-stop-circle' : 'bi-camera'} me-1`}></i>
                {isScanning ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>
          </div>
          <div className="card-body-custom">
            {/* Viewport */}
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '2px dashed var(--hairline)',
                minHeight: '260px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isScanning ? '#000000' : 'var(--bg)',
                position: 'relative',
              }}
            >
              {isScanning ? (
                <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                  <div className="spinner-border text-success mb-3" role="status"></div>
                  <div style={{ fontWeight: 600, color: 'var(--emerald-bright)' }}>Scanning Camera Feed…</div>
                  <small style={{ color: '#94a3b8' }}>Align QR code inside viewfinder</small>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '30px 20px' }}>
                  <i
                    className="bi bi-qr-code-scan"
                    style={{ fontSize: '48px', opacity: 0.3, display: 'block', marginBottom: '12px', color: 'var(--heading)' }}
                  ></i>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--heading)' }}>
                    Press "Start Camera" to begin scanning
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                    Point your camera at any AssetPulse QR code label
                  </div>
                </div>
              )}
            </div>

            {/* Manual Tag Lookup */}
            <form onSubmit={handleManualSubmit} style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--hairline)' }}>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '10px' }}>
                <i className="bi bi-keyboard me-1"></i>
                Or enter an asset tag / QR code manually:
              </p>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={manualTag}
                  onChange={(e) => setManualTag(e.target.value)}
                  className="form-control-custom"
                  placeholder="e.g. CSE-001 or SN-7890214"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary btn-sm px-3">
                  <i className="bi bi-lightning-charge me-1"></i>Lookup
                </button>
              </div>
            </form>

            {/* Quick preset tags */}
            <div className="d-flex gap-1 flex-wrap mt-2">
              <small className="text-muted me-1">Sample tags:</small>
              {['CSE-001', 'EE-002', 'ME-001'].map((tag) => (
                <span
                  key={tag}
                  className="badge-pill badge-navy"
                  style={{ cursor: 'pointer', fontSize: '11px' }}
                  onClick={() => {
                    setManualTag(tag);
                    handleLookup(tag);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scanned Asset Action Hub Card ────────────────────── */}
        {scannedAsset && (
          <div className="card mb-4 animate-in" style={{ border: '2px solid var(--emerald)' }}>
            <div className="card-header-custom" style={{ background: 'var(--bg-warm)' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge-pill badge-emerald">{scannedAsset.asset_tag}</span>
                <strong style={{ color: 'var(--heading)', fontSize: '15px' }}>{scannedAsset.name}</strong>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setScannedAsset(null)}
                style={{ border: 'none', background: 'transparent' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="card-body-custom">
              <div className="row g-3 mb-3" style={{ fontSize: '13px' }}>
                <div className="col-6">
                  <span className="text-muted d-block">Department:</span>
                  <strong>{scannedAsset.department?.name || 'General'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Location:</span>
                  <strong>{scannedAsset.location || 'Campus Center'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Status:</span>
                  <span className="badge-pill badge-success">{scannedAsset.status}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Book Value:</span>
                  <strong style={{ color: 'var(--emerald)' }}>
                    ₹{parseFloat(scannedAsset.purchase_cost || 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Action Buttons for Scanned Asset */}
              <div className="d-flex gap-2 flex-wrap pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm flex-fill"
                  onClick={() => onOpenIssueModal(scannedAsset)}
                >
                  <i className="bi bi-file-earmark-person me-1"></i>Issue Material (Parchi)
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={() => onOpenMaintenanceModal(scannedAsset)}
                >
                  <i className="bi bi-tools me-1"></i>Maintenance Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Smart Quick Actions Explanation ─────────────────── */}
        <div className="card">
          <div className="card-body-custom">
            <h6 style={{ fontFamily: 'var(--font-heading)', color: 'var(--heading)', marginBottom: '14px' }}>
              <i className="bi bi-stars me-1" style={{ color: 'var(--brass)' }}></i>
              Instant QR Workflow Actions
            </h6>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3" style={{ background: 'var(--bg-warm)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="fw-bold" style={{ fontSize: '13px', color: 'var(--heading)' }}>
                    <i className="bi bi-file-earmark-plus text-success me-1"></i> Issue Material &amp; Parchi
                  </div>
                  <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '3px' }}>
                    Immediately create a gate pass voucher with issuer timestamp &amp; recipient custody.
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3" style={{ background: 'var(--bg-warm)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="fw-bold" style={{ fontSize: '13px', color: 'var(--heading)' }}>
                    <i className="bi bi-tools text-primary me-1"></i> Maintenance Request
                  </div>
                  <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '3px' }}>
                    Send asset to repair workshop and notify assigned technician.
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3" style={{ background: 'var(--bg-warm)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="fw-bold" style={{ fontSize: '13px', color: 'var(--heading)' }}>
                    <i className="bi bi-box-arrow-in-down-left text-info me-1"></i> Return Asset Check-In
                  </div>
                  <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '3px' }}>
                    Inspect returned condition and generate Return Clearance Receipt.
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3" style={{ background: 'var(--bg-warm)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="fw-bold" style={{ fontSize: '13px', color: 'var(--heading)' }}>
                    <i className="bi bi-cart-plus text-warning me-1"></i> Order Replacement Parts
                  </div>
                  <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '3px' }}>
                    Submit quick purchase orders for matching replacement parts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
