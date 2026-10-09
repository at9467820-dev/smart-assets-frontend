import React, { useState, useMemo } from 'react';

export function AssetsPage({
  assets = [],
  departments = [],
  onOpenIssueModal,
  onOpenMaintenanceModal,
  onOpenNewAsset,
  onOpenScanner,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deprYears, setDeprYears] = useState(3);

  const categories = ['Computer', 'Lab Equipment', 'Networking', 'Projector', 'Electrical', 'HVAC', 'Furniture', 'Other'];

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !searchQuery ||
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.asset_tag && a.asset_tag.toLowerCase().includes(q)) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.serial_number && a.serial_number.toLowerCase().includes(q));

      const matchCat = !selectedCategory || a.category === selectedCategory;
      const matchDept = !selectedDept || String(a.department_id || a.department?.id) === String(selectedDept);
      const matchStatus = !selectedStatus || a.status === selectedStatus;

      return matchQ && matchCat && matchDept && matchStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedDept, selectedStatus]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDept('');
    setSelectedStatus('');
  };

  const calculateDepreciation = (cost, years) => {
    const pCost = parseFloat(cost) || 0;
    const rate = 0.15; // 15% reducing balance per year
    const currentVal = Math.max(0, pCost * Math.pow(1 - rate, years));
    const accumulated = pCost - currentVal;
    return {
      currentVal: Math.round(currentVal),
      accumulated: Math.round(accumulated),
    };
  };

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="page-title">Asset Registry</h1>
          <p className="page-subtitle">
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found in campus inventory
          </p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onOpenScanner}>
            <i className="bi bi-qr-code-scan me-1"></i>Scan QR
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewAsset}>
            <i className="bi bi-plus-lg me-1"></i>New Asset
          </button>
        </div>
      </div>

      {/* ── Filters Card ─────────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom">
          <div className="d-flex flex-wrap gap-2 align-items-end">
            {/* Search */}
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label className="form-label-custom">Search</label>
              <div style={{ position: 'relative' }}>
                <i
                  className="bi bi-search"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--ink-muted)',
                    fontSize: '13px',
                  }}
                ></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control-custom"
                  style={{ paddingLeft: '34px' }}
                  placeholder="Name, tag, location, serial…"
                />
              </div>
            </div>

            {/* Department */}
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label className="form-label-custom">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="form-control-custom"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div style={{ flex: 1, minWidth: '130px' }}>
              <label className="form-label-custom">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-control-custom"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="under_repair">Under Repair</option>
                <option value="damaged">Damaged</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            {/* Category */}
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label className="form-label-custom">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control-custom"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={resetFilters}>
                <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Assets Table ────────────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Name &amp; Location</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Purchase Cost</th>
                <th>Warranty</th>
                <th>Risk Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((a) => {
                const isRiskHigh = (a.risk_score || 25) >= 60;
                const isRepair = a.status === 'under_repair';
                const isDamaged = a.status === 'damaged';
                const isActive = a.status === 'active';

                return (
                  <tr key={a.id}>
                    <td>
                      <span
                        onClick={() => setSelectedAsset(a)}
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--emerald)',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {a.asset_tag}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: 'var(--heading)', cursor: 'pointer' }}
                        onClick={() => setSelectedAsset(a)}
                      >
                        {a.name}
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {a.location || 'Campus Center'}
                      </small>
                    </td>
                    <td>
                      <span className="badge-pill badge-navy">{a.category || 'General'}</span>
                    </td>
                    <td>{a.department?.name || 'General Dept'}</td>
                    <td>
                      <span
                        className={`badge-pill ${
                          isActive
                            ? 'badge-success'
                            : isRepair
                            ? 'badge-warning'
                            : isDamaged
                            ? 'badge-danger'
                            : 'badge-navy'
                        }`}
                      >
                        <span
                          className={`status-dot ${
                            isActive ? 'success' : isRepair ? 'warning' : isDamaged ? 'danger' : 'secondary'
                          }`}
                        ></span>
                        {isActive ? 'Active' : isRepair ? 'Under Repair' : isDamaged ? 'Damaged' : 'Retired'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{parseFloat(a.purchase_cost || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge-pill badge-success">Valid</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '6px',
                            background: 'var(--hairline)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${a.risk_score || 25}%`,
                              height: '100%',
                              background: isRiskHigh ? 'var(--danger)' : 'var(--emerald)',
                            }}
                          />
                        </div>
                        <small style={{ fontWeight: 700, color: isRiskHigh ? 'var(--danger)' : 'var(--emerald)' }}>
                          {a.risk_score || 25}%
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn-icon"
                          title="View Asset Details & QR"
                          onClick={() => setSelectedAsset(a)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Issue Gate Pass (Parchi)"
                          onClick={() => onOpenIssueModal(a)}
                        >
                          <i className="bi bi-file-earmark-person-fill" style={{ color: 'var(--brass)' }}></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Log Maintenance"
                          onClick={() => onOpenMaintenanceModal(a)}
                        >
                          <i className="bi bi-tools" style={{ color: 'var(--warning)' }}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>No matching assets found</div>
                    <p style={{ fontSize: '13px', margin: '4px 0 14px' }}>
                      Try adjusting your search query or filter selections
                    </p>
                    <button className="btn btn-outline-primary btn-sm" onClick={resetFilters}>
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Asset Detail Modal ───────────────────────────────── */}
      {selectedAsset && (
        <div className="modal-overlay" onClick={() => setSelectedAsset(null)}>
          <div className="modal-content animate-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-pill badge-emerald" style={{ fontSize: '13px' }}>
                  {selectedAsset.asset_tag}
                </span>
                <h3 className="card-title" style={{ margin: 0, fontSize: '18px' }}>
                  {selectedAsset.name}
                </h3>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedAsset(null)}
                style={{ border: 'none' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div className="row g-4">
                {/* Left Col: Specs */}
                <div className="col-md-7">
                  <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', marginBottom: '14px' }}>
                    Asset Specifications
                  </h4>
                  <table className="table-custom" style={{ border: '1px solid var(--hairline)' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, width: '40%' }}>Category</td>
                        <td>{selectedAsset.category}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Department</td>
                        <td>{selectedAsset.department?.name || 'General'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Current Location</td>
                        <td>{selectedAsset.location || 'Main Campus'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Serial Number</td>
                        <td style={{ fontFamily: 'monospace' }}>{selectedAsset.serial_number || 'SN-7890214'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Purchase Price</td>
                        <td style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                          ₹{parseFloat(selectedAsset.purchase_cost || 0).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Current Status</td>
                        <td>
                          <span className="badge-pill badge-success">{selectedAsset.status}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Depreciation Calculator */}
                  <div className="card mt-3" style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}>
                    <div className="card-body-custom p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brass)' }}>
                          Estimated Book Value
                        </span>
                        <div className="d-flex gap-1">
                          {[1, 3, 5].map((y) => (
                            <button
                              key={y}
                              className={`btn btn-xs ${deprYears === y ? 'btn-brass' : 'btn-outline-primary'}`}
                              onClick={() => setDeprYears(y)}
                            >
                              Year {y}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(() => {
                        const depr = calculateDepreciation(selectedAsset.purchase_cost, deprYears);
                        return (
                          <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                            <div>
                              <small className="text-muted">Current Value:</small>
                              <div style={{ fontWeight: 700, color: 'var(--emerald)', fontSize: '16px' }}>
                                ₹{depr.currentVal.toLocaleString()}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <small className="text-muted">Depreciation:</small>
                              <div style={{ fontWeight: 600, color: 'var(--ink-muted)' }}>
                                -₹{depr.accumulated.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right Col: QR Code Card */}
                <div className="col-md-5">
                  <div
                    className="card text-center p-3"
                    style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                      Physical QR Label
                    </div>
                    <div
                      style={{
                        background: '#ffffff',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px dashed var(--emerald)',
                        display: 'inline-block',
                        margin: '0 auto 12px',
                      }}
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          selectedAsset.asset_tag
                        )}`}
                        alt={`QR for ${selectedAsset.asset_tag}`}
                        style={{ width: '130px', height: '130px', display: 'block' }}
                      />
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '12px', marginTop: '6px', color: '#091a17' }}>
                        {selectedAsset.asset_tag}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer me-1"></i>Print QR Label
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                <button
                  type="button"
                  className="btn btn-brass btn-sm"
                  onClick={() => {
                    const a = selectedAsset;
                    setSelectedAsset(null);
                    onOpenIssueModal(a);
                  }}
                >
                  <i className="bi bi-file-earmark-person-fill me-1"></i>Issue Material (Parchi)
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const a = selectedAsset;
                    setSelectedAsset(null);
                    onOpenMaintenanceModal(a);
                  }}
                >
                  <i className="bi bi-tools me-1"></i>Log Maintenance
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSelectedAsset(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
