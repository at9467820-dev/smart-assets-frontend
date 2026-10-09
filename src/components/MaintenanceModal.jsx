import React, { useState } from 'react';

export function MaintenanceModal({ asset, availableAssets = [], onClose, onSuccess }) {
  const [assetId, setAssetId] = useState(asset?.id || availableAssets[0]?.id || '');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [scheduledDate, setScheduledDate] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId || !issueDescription) {
      alert('Please specify the asset and issue description.');
      return;
    }

    setLoading(true);
    try {
      await onSuccess({
        asset_id: parseInt(assetId),
        issue_description: issueDescription,
        priority,
        scheduled_date: scheduledDate || null,
        estimated_cost: parseFloat(estimatedCost) || 0,
      });
      onClose();
    } catch (err) {
      alert('Error creating maintenance request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="card-header-custom" style={{ padding: '18px 24px', borderBottom: '1px solid var(--hairline)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <i className="bi bi-tools"></i>
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '17px' }}>
                Send Asset to Maintenance
              </h3>
              <small className="text-muted">Create a service ticket and assign to repair workshop</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="mb-3">
            <label className="form-label-custom">Asset to Service *</label>
            {asset ? (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-warm)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span className="badge-pill badge-emerald me-2">{asset.asset_tag}</span>
                <strong style={{ color: 'var(--heading)' }}>{asset.name}</strong>
              </div>
            ) : (
              <select
                className="form-control-custom"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                required
              >
                <option value="">-- Choose asset --</option>
                {availableAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.asset_tag}] {a.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Issue Description / Fault Symptoms *</label>
            <textarea
              className="form-control-custom"
              rows={3}
              placeholder="Describe the fault, malfunction, or required routine maintenance in detail..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-custom">Priority Level</label>
              <select
                className="form-control-custom"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low (Non-critical)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Urgent lab need)</option>
                <option value="critical">Critical (Safety / Exam halt)</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Estimated Repair Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control-custom"
                placeholder="0.00"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Scheduled Service Date</label>
            <input
              type="date"
              className="form-control-custom"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              <i className="bi bi-tools me-1"></i>
              {loading ? 'Submitting…' : 'Submit Service Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
