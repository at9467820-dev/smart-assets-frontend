import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../api/client';

export function ScannerPage({
  assets = [],
  onOpenIssueModal,
  onOpenMaintenanceModal,
  onOpenReturnModal,
  onOpenLabelStudio,
}) {
  const [manualTag, setManualTag] = useState('');
  const [scannedAsset, setScannedAsset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Fetch available cameras when mounted
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera if available
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Unable to query camera devices:', err);
      });
  }, []);

  // Helper to extract tag from URL or raw string
  const cleanTag = (raw) => {
    if (!raw) return '';
    let val = String(raw).trim();
    if (val.includes('/')) {
      const parts = val.split('/').filter(Boolean);
      val = parts[parts.length - 1];
    }
    return val;
  };

  const handleLookup = async (rawTag) => {
    setErrorMsg('');
    setSuccessMsg('');
    const tag = cleanTag(rawTag);
    if (!tag) return;

    setIsLoadingLookup(true);

    // 1. Check local assets list in memory
    const localFound = assets.find(
      (a) =>
        a.asset_tag?.toLowerCase() === tag.toLowerCase() ||
        String(a.id) === tag ||
        (a.serial_number && a.serial_number.toLowerCase() === tag.toLowerCase())
    );

    if (localFound) {
      setScannedAsset(localFound);
      setSuccessMsg(`Asset ${localFound.asset_tag} identified successfully!`);
      setIsLoadingLookup(false);
      return;
    }

    // 2. Fetch from backend API lookup
    try {
      const res = await api.lookupIdentifier(tag);
      if (res && res.found && res.asset) {
        setScannedAsset(res.asset);
        setSuccessMsg(`Asset ${res.asset.asset_tag} fetched from database!`);
      } else {
        setErrorMsg(`No registered asset found matching "${tag}".`);
      }
    } catch (err) {
      setErrorMsg(`Lookup failed: ${err.message || 'Asset not found'}`);
    } finally {
      setIsLoadingLookup(false);
    }
  };

  const startCamera = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-camera-viewport');
      }

      const cameraConfig = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: 'environment' };

      await scannerRef.current.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          stopCamera();
          handleLookup(decodedText);
        },
        (errorMessage) => {
          // Standard scanning frame drops, ignore
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setIsScanning(false);
      setErrorMsg(
        `Unable to access camera (${err.name || 'Error'}: ${err.message || 'Permission denied or no webcam connected'}). You can also upload a QR photo or enter the tag manually below.`
      );
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const toggleCamera = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoadingLookup(true);

    try {
      const fileScanner = new Html5Qrcode('qr-file-detector');
      const decodedText = await fileScanner.scanFile(file, true);
      fileScanner.clear();
      handleLookup(decodedText);
    } catch (err) {
      setErrorMsg('No readable QR code found in the uploaded image. Please ensure the code is well-lit and in focus.');
      setIsLoadingLookup(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualTag.trim()) return;
    handleLookup(manualTag);
  };

  // Preset sample tags
  const sampleTags = assets.slice(0, 4).map((a) => a.asset_tag).concat(['CSE-001', 'ECE-001']);
  const uniqueSampleTags = Array.from(new Set(sampleTags)).slice(0, 5);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="page-title">
            <i className="bi bi-qr-code-scan me-2" style={{ color: 'var(--emerald)' }}></i>
            Smart QR Asset Scanner &amp; Action Hub
          </h1>
          <p className="page-subtitle">
            Scan physical asset tags via live webcam, upload QR photos, or query tags to issue materials &amp; gate passes
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Alerts */}
        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 animate-in" style={{ padding: '12px 16px', borderRadius: '8px' }}>
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div style={{ fontSize: '13px', flex: 1 }}>{errorMsg}</div>
            <button type="button" className="btn-close btn-sm" onClick={() => setErrorMsg('')}></button>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-3 animate-in" style={{ padding: '12px 16px', borderRadius: '8px' }}>
            <i className="bi bi-check-circle-fill fs-5"></i>
            <div style={{ fontSize: '13px', flex: 1 }}>{successMsg}</div>
            <button type="button" className="btn-close btn-sm" onClick={() => setSuccessMsg('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header-custom d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h3 className="card-title" style={{ margin: 0, fontSize: '16px' }}>
              <i className="bi bi-camera-video me-2" style={{ color: 'var(--brass)' }}></i>
              Live QR Camera Scanner
            </h3>
            <div className="d-flex align-items-center gap-2">
              {cameras.length > 1 && (
                <select
                  className="form-control-custom py-1"
                  style={{ fontSize: '12px', width: 'auto' }}
                  value={selectedCameraId}
                  onChange={(e) => {
                    setSelectedCameraId(e.target.value);
                    if (isScanning) {
                      stopCamera();
                      setTimeout(startCamera, 300);
                    }
                  }}
                  disabled={isScanning}
                >
                  {cameras.map((c, i) => (
                    <option key={c.id} value={c.id}>
                      {c.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              )}

              {/* Upload QR Image file button */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                title="Upload image containing QR code to scan"
              >
                <i className="bi bi-upload me-1"></i>
                Upload Image
              </button>

              {/* Start / Stop Camera Button */}
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
            {/* Real Camera Viewport */}
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '2px dashed var(--hairline)',
                minHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isScanning ? '#000000' : 'var(--bg)',
                position: 'relative',
              }}
            >
              {/* Target div for Html5Qrcode video */}
              <div
                id="qr-camera-viewport"
                style={{
                  width: '100%',
                  display: isScanning ? 'block' : 'none',
                }}
              />

              {/* Hidden div for file scanner */}
              <div id="qr-file-detector" style={{ display: 'none' }} />

              {!isScanning && (
                <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '36px 20px' }}>
                  <i
                    className="bi bi-qr-code-scan"
                    style={{ fontSize: '48px', opacity: 0.35, display: 'block', marginBottom: '12px', color: 'var(--heading)' }}
                  ></i>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--heading)' }}>
                    Press "Start Camera" to activate live scanner
                  </div>
                  <div style={{ fontSize: '12.5px', marginTop: '6px', opacity: 0.75 }}>
                    Point camera at any AssetPulse QR barcode, or click "Upload Image" to scan a photo
                  </div>
                </div>
              )}
            </div>

            {/* Manual Tag Lookup */}
            <form onSubmit={handleManualSubmit} style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--hairline)' }}>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '10px' }}>
                <i className="bi bi-keyboard me-1"></i>
                Or enter an asset tag / barcode / serial number manually:
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
                <button type="submit" className="btn btn-primary btn-sm px-3" disabled={isLoadingLookup}>
                  {isLoadingLookup ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    <i className="bi bi-lightning-charge me-1"></i>
                  )}
                  Lookup
                </button>
              </div>
            </form>

            {/* Quick preset tags */}
            {uniqueSampleTags.length > 0 && (
              <div className="d-flex gap-1 flex-wrap mt-2 align-items-center">
                <small className="text-muted me-1">Quick presets:</small>
                {uniqueSampleTags.map((tag) => (
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
            )}
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
                title="Dismiss"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="card-body-custom">
              <div className="row g-3 mb-3" style={{ fontSize: '13px' }}>
                <div className="col-6">
                  <span className="text-muted d-block">Department:</span>
                  <strong>{scannedAsset.department?.name || scannedAsset.department_name || 'General'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Location:</span>
                  <strong>{scannedAsset.location || 'Campus Center'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Status:</span>
                  <span className={`badge-pill ${scannedAsset.is_currently_issued ? 'badge-warning' : 'badge-success'}`}>
                    {scannedAsset.is_currently_issued ? 'Issued (Checked Out)' : scannedAsset.status || 'Active'}
                  </span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Purchase Cost:</span>
                  <strong style={{ color: 'var(--emerald)' }}>
                    ₹{parseFloat(scannedAsset.purchase_cost || 0).toLocaleString()}
                  </strong>
                </div>
                {scannedAsset.serial_number && (
                  <div className="col-12">
                    <span className="text-muted d-block">Serial Number:</span>
                    <span style={{ fontFamily: 'monospace' }}>{scannedAsset.serial_number}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Scanned Asset */}
              <div className="d-flex gap-2 flex-wrap pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                {/* 1. Issue Material / Parchi */}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm flex-fill"
                  onClick={() => onOpenIssueModal(scannedAsset)}
                >
                  <i className="bi bi-file-earmark-person me-1"></i>Issue Material (Parchi)
                </button>

                {/* 2. Maintenance */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={() => onOpenMaintenanceModal(scannedAsset)}
                >
                  <i className="bi bi-tools me-1"></i>Log Maintenance
                </button>

                {/* 3. Return Asset (if currently checked out) */}
                {scannedAsset.is_currently_issued && onOpenReturnModal && (
                  <button
                    type="button"
                    className="btn btn-warning btn-sm flex-fill"
                    onClick={() => onOpenReturnModal(scannedAsset.current_issue || { asset: scannedAsset, asset_id: scannedAsset.id })}
                  >
                    <i className="bi bi-box-arrow-in-down-left me-1"></i>Check-In Return
                  </button>
                )}

                {/* 4. Print Label */}
                {onOpenLabelStudio && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onOpenLabelStudio(scannedAsset)}
                    title="Print QR Label"
                  >
                    <i className="bi bi-printer me-1"></i>Label
                  </button>
                )}
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
                    Generate a gate pass voucher with issuer timestamp &amp; recipient custody.
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
                    <i className="bi bi-printer text-warning me-1"></i> Physical QR Barcode Labels
                  </div>
                  <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '3px' }}>
                    Print durable physical sticker labels for campus hardware and equipment.
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
