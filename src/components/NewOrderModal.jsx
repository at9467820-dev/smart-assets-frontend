import React, { useState } from 'react';

export function NewOrderModal({ departments = [], onClose, onSuccess }) {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Other');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 1);
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState('');
  const [priority, setPriority] = useState('medium');
  const [supplierName, setSupplierName] = useState('');
  const [justification, setJustification] = useState('');
  const [specsNotes, setSpecsNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !justification) {
      alert('Please fill the item name and justification.');
      return;
    }

    setLoading(true);
    try {
      await onSuccess({
        item_name: itemName,
        category,
        department_id: parseInt(departmentId),
        quantity: parseInt(quantity) || 1,
        estimated_unit_cost: parseFloat(unitCost) || 0,
        priority,
        supplier_name: supplierName,
        justification,
        specs_notes: specsNotes,
      });
      onClose();
    } catch (err) {
      alert('Error submitting requisition: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="card-header-custom" style={{ padding: '18px 24px', borderBottom: '1px solid var(--hairline)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <i className="bi bi-cart-plus-fill"></i>
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '17px' }}>
                New Procurement Requisition
              </h3>
              <small className="text-muted">Request new equipment, parts, or consumable lab supplies</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label-custom">Material / Equipment Name *</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Raspberry Pi 4 Model B (4GB)"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Category</label>
              <select
                className="form-control-custom"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Computer">Computer</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Networking">Networking</option>
                <option value="Other">Other / Spares</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label-custom">Department *</label>
              <select
                className="form-control-custom"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Quantity *</label>
              <input
                type="number"
                min="1"
                className="form-control-custom"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Est. Unit Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control-custom"
                placeholder="0.00"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-custom">Priority Level</label>
              <select
                className="form-control-custom"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent lab need)</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Preferred Supplier / Vendor</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Dell Commercial, Local Vendor"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Requisition Justification *</label>
            <textarea
              className="form-control-custom"
              rows={2}
              placeholder="Why is this equipment or spare part required?"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Technical Specs &amp; Deliverables</label>
            <textarea
              className="form-control-custom"
              rows={2}
              placeholder="Optional technical specifications or brand requirements..."
              value={specsNotes}
              onChange={(e) => setSpecsNotes(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              <i className="bi bi-cart-check me-1"></i>
              {loading ? 'Submitting…' : 'Submit Requisition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
