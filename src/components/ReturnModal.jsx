import React, { useState } from 'react';

export function ReturnModal({ issue, onClose, onSuccess }) {
  const [returnCondition, setReturnCondition] = useState('Good / Functional');
  const [remarks, setRemarks] = useState('');
  const [fineAmount, setFineAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSuccess(issue.id, {
        return_condition: returnCondition,
        remarks_on_return: remarks,
        fine_amount: parseFloat(fineAmount) || 0,
      });
      onClose();
    } catch (err) {
      alert('Return error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
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
              <i className="bi bi-box-arrow-in-down-left"></i>
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '17px' }}>
                Return Asset &amp; Clear Gate Pass
              </h3>
              <small className="text-muted">Inspect equipment and record return custody</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div
            style={{
              padding: '14px',
              background: 'var(--bg-warm)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '18px',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong style={{ color: 'var(--heading)' }}>{issue.asset_name || issue.asset?.name}</strong>
              <span className="badge-pill badge-emerald">{issue.asset_tag || issue.asset?.asset_tag}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Custodian: <b>{issue.recipient_name || issue.issued_to_name}</b> • Slip: <code>{issue.slip_number}</code>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Asset Condition on Return *</label>
            <select
              className="form-control-custom"
              value={returnCondition}
              onChange={(e) => setReturnCondition(e.target.value)}
              required
            >
              <option value="Good / Functional">Good / Functional (Normal return, intact)</option>
              <option value="Minor Wear / Scratches">Minor Wear / Minor Scratches</option>
              <option value="Damaged - Needs Repair">Damaged - Needs Repair / Maintenance</option>
              <option value="Faulty / Broken">Faulty / Broken (Flag for replacement)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Inspection &amp; Return Notes</label>
            <textarea
              className="form-control-custom"
              rows={2}
              placeholder="e.g. All cables returned, inspected and working properly"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Penalty / Damage Fine (₹ if applicable)</label>
            <input
              type="number"
              step="0.01"
              className="form-control-custom"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              <i className="bi bi-check2-circle me-1"></i>
              {loading ? 'Processing…' : 'Confirm Return & Issue Clearance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
