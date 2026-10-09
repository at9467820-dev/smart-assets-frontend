import React, { useState, useMemo } from 'react';

export function OrdersPage({ orders = [], onOpenNewOrder, onUpdateStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !searchQuery ||
        (o.order_number && o.order_number.toLowerCase().includes(q)) ||
        (o.item_name && o.item_name.toLowerCase().includes(q)) ||
        (o.supplier_name && o.supplier_name.toLowerCase().includes(q));

      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const approvedCount = orders.filter((o) => o.status === 'approved').length;
  const orderedCount = orders.filter((o) => o.status === 'ordered').length;
  const totalValuation = orders.reduce((sum, o) => sum + (parseFloat(o.total_cost) || 0), 0);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-cart-check-fill me-2" style={{ color: 'var(--brass)' }}></i>
            Asset Orders &amp; Procurement
          </h1>
          <p className="page-subtitle">
            Submit and track purchase requisitions for new lab equipment, replacements, and spare modules
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewOrder}>
            <i className="bi bi-plus-circle-fill me-1"></i>New Purchase Requisition
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(245,158,11,0.12)',
                color: 'var(--warning)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div>
              <div className="stat-label">Pending Approval</div>
              <div className="stat-value" style={{ color: 'var(--warning)', fontSize: '24px', fontWeight: 700 }}>
                {pendingCount}
              </div>
              <small className="text-muted">Awaiting sign-off</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(212,175,55,0.12)',
                color: 'var(--brass)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-check2-circle"></i>
            </div>
            <div>
              <div className="stat-label">Approved</div>
              <div className="stat-value" style={{ color: 'var(--brass)', fontSize: '24px', fontWeight: 700 }}>
                {approvedCount}
              </div>
              <small className="text-muted">Ready for purchase</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(56,189,248,0.12)',
                color: 'var(--info)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-truck"></i>
            </div>
            <div>
              <div className="stat-label">In Transit / Ordered</div>
              <div className="stat-value" style={{ color: 'var(--info)', fontSize: '24px', fontWeight: 700 }}>
                {orderedCount}
              </div>
              <small className="text-muted">Vendor shipment active</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--emerald)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-currency-rupee"></i>
            </div>
            <div>
              <div className="stat-label">Order Pipeline Cost</div>
              <div className="stat-value" style={{ color: 'var(--emerald)', fontSize: '24px', fontWeight: 700 }}>
                ₹{totalValuation.toLocaleString()}
              </div>
              <small className="text-muted">Total requisitioned</small>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom pb-2 pt-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
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
                placeholder="Search order #, item name, vendor..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control-custom"
              style={{ width: '180px' }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered / In Transit</option>
              <option value="received">Received &amp; Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Orders Table ────────────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Material / Item Description</th>
                <th>Department</th>
                <th>Qty</th>
                <th>Est. Unit Cost</th>
                <th>Total Cost (₹)</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Workflow</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--emerald)' }}>
                      {o.order_number}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{o.order_date || 'Today'}</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--heading)', display: 'block' }}>{o.item_name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                      Category: {o.category} {o.supplier_name ? `• Vendor: ${o.supplier_name}` : ''}
                    </span>
                  </td>
                  <td>{o.department_name || 'General'}</td>
                  <td>
                    <strong>{o.quantity}</strong>
                  </td>
                  <td>₹{parseFloat(o.estimated_unit_cost || 0).toLocaleString()}</td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{parseFloat(o.total_cost || 0).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge-pill ${
                        o.priority === 'critical' || o.priority === 'high'
                          ? 'badge-danger'
                          : o.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-navy'
                      }`}
                    >
                      {o.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge-pill ${
                        o.status === 'received'
                          ? 'badge-success'
                          : o.status === 'ordered'
                          ? 'badge-warning'
                          : o.status === 'approved'
                          ? 'badge-brass'
                          : 'badge-danger'
                      }`}
                    >
                      <span
                        className={`status-dot ${
                          o.status === 'received' ? 'success' : o.status === 'ordered' ? 'warning' : 'secondary'
                        }`}
                      ></span>
                      {o.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      {o.status === 'pending' && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-xs"
                          onClick={() => onUpdateStatus(o.id, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      {o.status === 'approved' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => onUpdateStatus(o.id, 'ordered')}
                        >
                          <i className="bi bi-truck me-1"></i>Place Order
                        </button>
                      )}
                      {o.status === 'ordered' && (
                        <button
                          type="button"
                          className="btn btn-brass btn-xs"
                          onClick={() => onUpdateStatus(o.id, 'received')}
                        >
                          <i className="bi bi-check-circle me-1"></i>Receive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>No procurement orders found</div>
                    <p style={{ fontSize: '13px', margin: '4px 0 14px' }}>
                      Submit a requisition to order hardware or classroom supplies
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={onOpenNewOrder}>
                      + New Purchase Requisition
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
