import React, { useState } from 'react';

export function NewAssetModal({ departments = [], onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Computer');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 1);
  const [location, setLocation] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [conditionRating, setConditionRating] = useState(8);
  const [serialNumber, setSerialNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !departmentId) {
      alert('Please fill the asset name and select a department.');
      return;
    }

    setLoading(true);
    try {
      await onSuccess({
        name,
        category,
        department_id: parseInt(departmentId),
        location,
        purchase_cost: parseFloat(purchaseCost) || 0,
        purchase_date: purchaseDate || null,
        warranty_expiry: warrantyExpiry || null,
        condition_rating: parseInt(conditionRating),
        serial_number: serialNumber,
        manufacturer,
        notes,
      });
      onClose();
    } catch (err) {
      alert('Error creating asset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
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
              <i className="bi bi-box-seam-fill"></i>
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '17px' }}>
                Register New Asset
              </h3>
              <small className="text-muted">Auto-generates tag, QR label, and lifecycle ledger</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label-custom">Asset / Equipment Name *</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Dell Precision 3660 Tower"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Category *</label>
              <select
                className="form-control-custom"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Computer">Computer</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Networking">Networking</option>
                <option value="Projector">Projector</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <label className="form-label-custom">Location / Room / Lab</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. AI & Robotics Lab, Block A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label-custom">Purchase Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control-custom"
                placeholder="45000"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Purchase Date</label>
              <input
                type="date"
                className="form-control-custom"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Warranty Expiry</label>
              <input
                type="date"
                className="form-control-custom"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label-custom">Manufacturer / Brand</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Dell, Agilent, HP"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Serial Number</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. SN-98442-X"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Condition ({conditionRating}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={conditionRating}
                onChange={(e) => setConditionRating(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--emerald)', marginTop: '8px' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Technical Notes / Specs</label>
            <textarea
              className="form-control-custom"
              rows={2}
              placeholder="Optional technical specifications or invoice remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              <i className="bi bi-plus-circle-fill me-1"></i>
              {loading ? 'Registering…' : 'Register Asset & Generate QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
