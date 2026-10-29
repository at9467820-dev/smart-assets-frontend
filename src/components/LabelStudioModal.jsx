import React, { useState } from 'react';

export function LabelStudioModal({ isOpen, onClose, assets = [], defaultAsset = null }) {
  const [selectedAssetId, setSelectedAssetId] = useState(defaultAsset?.id || (assets[0]?.id || ''));
  const [format, setFormat] = useState('badge'); // 'badge', 'compact', 'sheet'
  const [showQR, setShowQR] = useState(true);
  const [showSerial, setShowSerial] = useState(true);
  const [showDept, setShowDept] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [customTitle, setCustomTitle] = useState('CAMPUS ASSET REGISTRY');

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => String(a.id) === String(selectedAssetId)) || assets[0] || {
    asset_tag: 'CSE-001',
    name: 'Dell Precision Tower 3660',
    category: 'Computer',
    department_name: 'Computer Science',
    department_code: 'CSE',
    location: 'Lab 301',
    serial_number: 'SN-98234-X',
    purchase_date: '2025-08-15',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '840px' }}>
        {/* Modal Header */}
        <div className="glass-card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--primary-bg)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="bi bi-printer-fill fs-5"></i>
            </div>
            <div>
              <h5 className="m-0 fw-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                QR &amp; Barcode Label Studio
              </h5>
              <small style={{ color: 'var(--text-secondary)' }}>
                Generate verified physical asset stickers, QR badges, and printable sheets
              </small>
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-secondary" onClick={onClose} style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="glass-card-body">
          <div className="row g-4">
            {/* Configuration Column */}
            <div className="col-md-5 border-end" style={{ borderColor: 'var(--border-color)' }}>
              <div className="mb-3">
                <label className="form-label">Select Asset</label>
                <select
                  className="form-select"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.asset_tag}] {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Label Template Style</label>
                <div className="d-grid gap-2">
                  {[
                    { id: 'badge', title: 'Executive Metal Badge', sub: '3.5" × 2.25" High Density' },
                    { id: 'compact', title: 'Compact Asset Tag', sub: '2.0" × 1.0" Inventory Sticker' },
                    { id: 'sheet', title: 'Batch Print Sheet (12x)', sub: 'Avery Multi-label Layout' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      className={`btn text-start ${format === tpl.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 12px' }}
                      onClick={() => setFormat(tpl.id)}
                    >
                      <div className="fw-bold" style={{ fontSize: '13px' }}>{tpl.title}</div>
                      <small style={{ opacity: 0.8, fontSize: '11px' }}>{tpl.sub}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Header Institution Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. NATIONAL INSTITUTE OF TECH"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Label Elements</label>
                <div className="d-flex flex-column gap-2">
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={showQR} onChange={(e) => setShowQR(e.target.checked)} />
                    High-Res QR Code Link
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={showSerial} onChange={(e) => setShowSerial(e.target.checked)} />
                    Serial &amp; Model Number
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={showDept} onChange={(e) => setShowDept(e.target.checked)} />
                    Department &amp; Room Location
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={showCategory} onChange={(e) => setShowCategory(e.target.checked)} />
                    Category &amp; Purchase Year
                  </label>
                </div>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="col-md-7 d-flex flex-column align-items-center justify-content-center">
              <span className="badge badge-indigo mb-2">LIVE PRINT PREVIEW</span>

              {/* Printable Wrapper */}
              <div className="printable-area p-3 w-100 d-flex justify-content-center">
                {format === 'badge' && (
                  <div style={{
                    width: '320px',
                    border: '2px solid #0f172a',
                    borderRadius: '12px',
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2" style={{ borderColor: '#e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em', color: '#4f46e5' }}>
                          {customTitle}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>
                          {currentAsset.asset_tag}
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: '#0f172a', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        {currentAsset.department_code || 'INST'}
                      </span>
                    </div>

                    {/* Middle Content */}
                    <div className="d-flex gap-3 align-items-center my-2">
                      {showQR && (
                        <div style={{
                          width: '74px', height: '74px', border: '1px solid #cbd5e1',
                          borderRadius: '6px', padding: '3px', background: '#ffffff', flexShrink: 0
                        }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ASSET:${encodeURIComponent(currentAsset.asset_tag)}`}
                            alt="Asset QR"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </div>
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentAsset.name}
                        </div>
                        {showCategory && (
                          <div style={{ fontSize: '10.5px', color: '#475569' }}>
                            Cat: <b>{currentAsset.category}</b>
                          </div>
                        )}
                        {showDept && (
                          <div style={{ fontSize: '10.5px', color: '#475569' }}>
                            Dept: {currentAsset.department_name || 'General'}
                          </div>
                        )}
                        {showSerial && currentAsset.serial_number && (
                          <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                            S/N: {currentAsset.serial_number}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-top pt-1 mt-2 d-flex justify-content-between align-items-center" style={{ borderColor: '#e2e8f0', fontSize: '9px', color: '#64748b' }}>
                      <span>Scan QR to verify custodian</span>
                      <span>Security AssetPulse</span>
                    </div>
                  </div>
                )}

                {format === 'compact' && (
                  <div style={{
                    width: '260px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '8px 10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontFamily: 'system-ui, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {showQR && (
                      <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=ASSET:${encodeURIComponent(currentAsset.asset_tag)}`}
                          alt="QR"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#4f46e5' }}>
                        {currentAsset.asset_tag}
                      </div>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentAsset.name}
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                        {currentAsset.department_name || 'Campus'} &bull; {currentAsset.location || 'Lab'}
                      </div>
                    </div>
                  </div>
                )}

                {format === 'sheet' && (
                  <div style={{
                    width: '100%',
                    maxWidth: '380px',
                    background: '#ffffff',
                    border: '1px dashed #94a3b8',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    color: '#0f172a',
                  }}>
                    {assets.slice(0, 6).map((a, i) => (
                      <div key={i} style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=ASSET:${encodeURIComponent(a.asset_tag)}`}
                          alt="QR"
                          style={{ width: '32px', height: '32px' }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: '#4f46e5' }}>{a.asset_tag}</div>
                          <div style={{ fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{a.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 text-center">
                <small style={{ color: 'var(--text-secondary)' }}>
                  Supports all standard thermal sticker printers and Avery laser/inkjet sheets.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="glass-card-header d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <i className="bi bi-printer-fill me-1"></i>Print Labels Now
          </button>
        </div>
      </div>
    </div>
  );
}
