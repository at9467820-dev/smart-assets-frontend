import React, { useState, useMemo } from 'react';

export function MaintenancePage({ maintenance = [], onOpenNewMaintenance }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const pendingCount = maintenance.filter((m) => m.status === 'pending').length;
  const inProgressCount = maintenance.filter((m) => m.status === 'in_progress').length;
  const resolvedCount = maintenance.filter((m) => m.status === 'resolved').length;
  const totalCost = maintenance.reduce((sum, m) => sum + (parseFloat(m.actual_cost) || 0), 0);

  const filteredLogs = useMemo(() => {
    return maintenance.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !searchQuery ||
        (m.asset_tag && m.asset_tag.toLowerCase().includes(q)) ||
        (m.asset_name && m.asset_name.toLowerCase().includes(q)) ||
        (m.issue_description && m.issue_description.toLowerCase().includes(q));

      const matchStatus = !statusFilter || m.status === statusFilter;
      const matchPriority = !priorityFilter || m.priority === priorityFilter;

      return matchQ && matchStatus && matchPriority;
    });
  }, [maintenance, searchQuery, statusFilter, priorityFilter]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-tools me-2" style={{ color: 'var(--brass)' }}></i>
            Maintenance &amp; Repairs
          </h1>
          <p className="page-subtitle">
            Manage scheduled preventive maintenance, technician tickets, parts repair, and cost tracking
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenNewMaintenance(null)}>
            <i className="bi bi-plus-circle-fill me-1"></i>Log Maintenance Request
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
              <i className="bi bi-clock-history"></i>
            </div>
            <div>
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value" style={{ color: 'var(--warning)', fontSize: '24px', fontWeight: 700 }}>
                {pendingCount}
              </div>
              <small className="text-muted">Awaiting technician</small>
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
              <i className="bi bi-gear-wide-connected"></i>
            </div>
            <div>
              <div className="stat-label">In Progress</div>
              <div className="stat-value" style={{ color: 'var(--info)', fontSize: '24px', fontWeight: 700 }}>
                {inProgressCount}
              </div>
              <small className="text-muted">Currently being repaired</small>
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
              <i className="bi bi-check2-circle"></i>
            </div>
            <div>
              <div className="stat-label">Resolved Logs</div>
              <div className="stat-value" style={{ color: 'var(--emerald)', fontSize: '24px', fontWeight: 700 }}>
                {resolvedCount}
              </div>
              <small className="text-muted">Equipment restored</small>
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
              <i className="bi bi-currency-rupee"></i>
            </div>
            <div>
              <div className="stat-label">Total Spent</div>
              <div className="stat-value" style={{ color: 'var(--brass)', fontSize: '24px', fontWeight: 700 }}>
                ₹{totalCost.toLocaleString()}
              </div>
              <small className="text-muted">Repair expenditure</small>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ─────────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom pb-2 pt-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            {/* Search */}
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
                placeholder="Search ticket, asset tag, fault..."
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control-custom"
              style={{ width: '160px' }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-control-custom"
              style={{ width: '160px' }}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Maintenance Table ────────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Asset Tag &amp; Name</th>
                <th>Fault / Problem Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Completed Date</th>
                <th>Actual Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--emerald)' }}>
                      #{m.id}
                    </span>
                  </td>
                  <td>
                    <span className="badge-pill badge-navy me-1">{m.asset_tag}</span>
                    <strong style={{ color: 'var(--heading)' }}>{m.asset_name}</strong>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontSize: '13px' }}>{m.issue_description}</div>
                    {m.technician_notes && (
                      <small style={{ color: 'var(--emerald)', display: 'block', marginTop: '2px' }}>
                        Note: {m.technician_notes}
                      </small>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge-pill ${
                        m.priority === 'critical' || m.priority === 'high'
                          ? 'badge-danger'
                          : m.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-navy'
                      }`}
                    >
                      {m.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge-pill ${
                        m.status === 'resolved'
                          ? 'badge-success'
                          : m.status === 'in_progress'
                          ? 'badge-warning'
                          : 'badge-navy'
                      }`}
                    >
                      <span
                        className={`status-dot ${
                          m.status === 'resolved' ? 'success' : m.status === 'in_progress' ? 'warning' : 'secondary'
                        }`}
                      ></span>
                      {m.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>{m.request_date || 'Today'}</td>
                  <td style={{ fontSize: '12px' }}>{m.completed_date || '—'}</td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{parseFloat(m.actual_cost || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔧</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>No maintenance records found</div>
                    <p style={{ fontSize: '13px', margin: '4px 0 14px' }}>
                      All systems operating smoothly without reported faults
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => onOpenNewMaintenance(null)}>
                      + Log Maintenance Request
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
