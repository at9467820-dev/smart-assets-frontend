import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../api/client';

export function OrdersPage({ orders = [], onOpenNewOrder, onUpdateStatus }) {
  const [subTab, setSubTab] = useState('orders'); // 'orders' or 'vendors'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vList = await api.getVendors();
        setVendors(vList || []);
      } catch (err) {
        console.warn('Failed to load vendors', err);
      }
    };
    fetchVendors();
  }, []);

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

  const filteredVendors = useMemo(() => {
    if (!searchQuery) return vendors;
    const q = searchQuery.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.categories?.some((c) => c.toLowerCase().includes(q)) ||
        v.contact_person?.toLowerCase().includes(q)
    );
  }, [vendors, searchQuery]);

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
            <i className="bi bi-cart-check-fill me-2" style={{ color: 'var(--primary)' }}></i>
            Procurement &amp; Vendor Management
          </h1>
          <p className="page-subtitle">
            Submit purchase requisitions, track equipment delivery, and manage verified suppliers
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${subTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSubTab('orders')}
            >
              <i className="bi bi-list-check me-1"></i>Requisitions ({orders.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${subTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSubTab('vendors')}
            >
              <i className="bi bi-building me-1"></i>Approved Vendors ({vendors.length || 6})
            </button>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewOrder}>
            <i className="bi bi-plus-circle-fill me-1"></i>New Requisition
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

      {subTab === 'orders' && (
        <>
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
                              ? 'badge-info'
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
                              className="btn btn-primary btn-xs"
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
        </>
      )}

      {subTab === 'vendors' && (
        <div className="mt-2">
          {/* Vendor Search */}
          <div className="card mb-4">
            <div className="card-body-custom py-3">
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
                    placeholder="Search verified suppliers by name, category, or contact person..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vendors Cards Grid */}
          <div className="row g-4">
            {filteredVendors.map((v) => (
              <div key={v.id} className="col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge-tag">{v.code || 'VENDOR'}</span>
                      <span className="badge badge-amber">
                        ★ {v.rating} / 5.0
                      </span>
                    </div>

                    <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      {v.name}
                    </h5>
                    <small className="text-muted d-block mb-3" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-file-earmark-check me-1 text-primary"></i>
                      {v.active_contracts || 'Annual Institutional Rate Contract'}
                    </small>

                    <div className="mb-3 d-flex flex-wrap gap-1">
                      {v.categories?.map((cat, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '10.5px' }}>
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-top mb-3" style={{ borderColor: 'var(--border-color)', fontSize: '12px' }}>
                      <div className="mb-1 text-secondary">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Contact: <b style={{ color: 'var(--text-primary)' }}>{v.contact_person}</b>
                      </div>
                      <div className="mb-1 text-secondary">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        <a href={`mailto:${v.email}`} style={{ color: 'var(--primary-bright)' }}>{v.email}</a>
                      </div>
                      <div className="text-secondary">
                        <i className="bi bi-telephone me-2 text-primary"></i>
                        {v.phone}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <small style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                      Lead time: <b>{v.lead_time_days || 7} days</b>
                    </small>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={onOpenNewOrder}
                    >
                      <i className="bi bi-plus-lg me-1"></i>New Requisition
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
