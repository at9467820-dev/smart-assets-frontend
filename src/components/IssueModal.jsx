import React, { useState, useMemo, useEffect } from 'react';

export function IssueModal({ asset, availableAssets = [], departments = [], onClose, onSuccess }) {
  // Only selectable assets (not currently issued and not retired)
  const selectableAssets = useMemo(() => {
    return availableAssets.filter((a) => !a.is_currently_issued && a.status !== 'retired');
  }, [availableAssets]);

  const [assetId, setAssetId] = useState(
    asset?.id ? String(asset.id) : (selectableAssets[0]?.id ? String(selectableAssets[0].id) : '')
  );

  useEffect(() => {
    if (!asset && (!assetId || !selectableAssets.some((a) => String(a.id) === String(assetId)))) {
      if (selectableAssets.length > 0) {
        setAssetId(String(selectableAssets[0].id));
      } else {
        setAssetId('');
      }
    }
  }, [asset, selectableAssets, assetId]);

  const [issuedToName, setIssuedToName] = useState('');
  const [issuedToIdNumber, setIssuedToIdNumber] = useState('');
  const [issuedToDept, setIssuedToDept] = useState(departments[0]?.name || '');
  const [issuedToPhone, setIssuedToPhone] = useState('');
  const [issuedToEmail, setIssuedToEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [gatePassType, setGatePassType] = useState('returnable');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [issueCondition, setIssueCondition] = useState('Good / Functional');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!issuedToDept && departments.length > 0) {
      setIssuedToDept(departments[0].name);
    }
  }, [departments, issuedToDept]);

  const selectedAsset = asset || availableAssets.find((a) => String(a.id) === String(assetId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId || !issuedToName || !purpose) {
      alert('Please fill all required fields (Asset, Recipient Name, and Purpose).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        asset_id: parseInt(assetId),
        issued_to_name: issuedToName,
        issued_to_id_number: issuedToIdNumber,
        issued_to_dept: issuedToDept,
        issued_to_phone: issuedToPhone,
        issued_to_email: issuedToEmail,
        purpose,
        gate_pass_type: gatePassType,
        expected_return_date: expectedReturnDate,
        issue_condition: issueCondition,
        remarks_on_issue: remarks,
        issuer_name: 'Authorized Staff',
      };

      await onSuccess(payload);
      onClose();
    } catch (err) {
      alert('Error creating issue slip: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="card-header-custom" style={{ padding: '18px 24px', borderBottom: '1px solid var(--hairline)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <i className="bi bi-file-earmark-plus-fill"></i>
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '17px' }}>
                Issue Material / New Gate Pass (Parchi)
              </h3>
              <small className="text-muted">Generate an official tracked equipment handover voucher</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Asset Selection */}
          <div className="mb-3">
            <label className="form-label-custom">Selected Equipment / Material *</label>
            {asset ? (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-warm)',
                  border: '1px solid var(--emerald)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span className="badge-pill badge-emerald me-2">{asset.asset_tag}</span>
                  <strong style={{ color: 'var(--heading)' }}>{asset.name}</strong>
                  <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                    Category: {asset.category} • Location: {asset.location || 'Main Lab'}
                  </div>
                </div>
                <span className="badge-pill badge-success">Ready for Issue</span>
              </div>
            ) : (
              <div>
                <select
                  className="form-control-custom"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  required
                >
                  <option value="">
                    {selectableAssets.length > 0
                      ? `-- Select an available equipment (${selectableAssets.length} available) --`
                      : '-- No unissued assets currently available --'}
                  </option>
                  {selectableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.asset_tag}] {a.name} — {a.department?.name || a.department_name || a.department_code || a.category} ({a.location || 'Campus'})
                    </option>
                  ))}
                </select>
                {selectedAsset && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                    Tag: <strong style={{ color: 'var(--heading)' }}>{selectedAsset.asset_tag}</strong> • Dept:{' '}
                    <strong>{selectedAsset.department?.name || selectedAsset.department_name || 'General'}</strong> • Location:{' '}
                    {selectedAsset.location || 'Lab'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recipient Details */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-custom">Issued To (Person Name) *</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Dr. Ayesha Siddiqui"
                value={issuedToName}
                onChange={(e) => setIssuedToName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">CNIC / Employee / Roll #</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. EMP-2024-884"
                value={issuedToIdNumber}
                onChange={(e) => setIssuedToIdNumber(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Department / Unit *</label>
              <select
                className="form-control-custom"
                value={issuedToDept}
                onChange={(e) => setIssuedToDept(e.target.value)}
                required
              >
                <option value="">-- Select Recipient Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
                <option value="Administration">Administration</option>
                <option value="General Campus">General Campus</option>
                <option value="Student Project">Student Project</option>
                <option value="Other / External">Other / External</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Phone / Mobile</label>
              <input
                type="tel"
                className="form-control-custom"
                placeholder="0300-1234567"
                value={issuedToPhone}
                onChange={(e) => setIssuedToPhone(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Official Email</label>
              <input
                type="email"
                className="form-control-custom"
                placeholder="recipient@campus.edu"
                value={issuedToEmail}
                onChange={(e) => setIssuedToEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Issue Terms */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-custom">Gate Pass Type</label>
              <select
                className="form-control-custom"
                value={gatePassType}
                onChange={(e) => setGatePassType(e.target.value)}
              >
                <option value="returnable">Returnable (Temporary Checkout)</option>
                <option value="non_returnable">Non-Returnable (Permanent / Consumption)</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Expected Return Date</label>
              <input
                type="date"
                className="form-control-custom"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="mb-3">
            <label className="form-label-custom">Purpose of Issue / Checkout *</label>
            <input
              type="text"
              className="form-control-custom"
              placeholder="e.g. Final Year Project evaluation, Inter-campus research demo"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          {/* Condition & Remarks */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label-custom">Physical Condition on Handover</label>
              <select
                className="form-control-custom"
                value={issueCondition}
                onChange={(e) => setIssueCondition(e.target.value)}
              >
                <option value="Good / Functional">Good / Functional</option>
                <option value="Minor Scratches / Working">Minor Scratches / Working</option>
                <option value="Repaired / Verified">Repaired / Verified</option>
                <option value="Needs Inspection">Needs Inspection</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Issuer Remarks / Gate Instructions</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Carry charger & VGA converter"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? (
                'Generating Gate Pass…'
              ) : (
                <>
                  <i className="bi bi-file-earmark-check me-1"></i>Generate Parchi &amp; Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
