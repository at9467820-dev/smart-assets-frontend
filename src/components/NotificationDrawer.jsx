import React, { useState } from 'react';

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onNavigate,
  onMarkAllRead,
}) {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'critical') return n.priority === 'critical';
    if (filter === 'warranty') return n.type === 'warranty_expiry';
    if (filter === 'maint') return n.type === 'overdue_maint';
    if (filter === 'orders') return n.type === 'order_pending';
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="badge badge-danger">CRITICAL</span>;
      case 'high':
        return <span className="badge badge-amber">URGENT</span>;
      case 'medium':
        return <span className="badge badge-indigo">NOTICE</span>;
      default:
        return <span className="badge badge-info">INFO</span>;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'overdue_issue':
        return <i className="bi bi-exclamation-octagon-fill text-danger fs-5"></i>;
      case 'overdue_maint':
        return <i className="bi bi-tools text-warning fs-5"></i>;
      case 'warranty_expiry':
        return <i className="bi bi-shield-exclamation text-info fs-5"></i>;
      case 'critical_risk':
        return <i className="bi bi-graph-down-arrow text-danger fs-5"></i>;
      case 'order_pending':
        return <i className="bi bi-cart-dash text-primary fs-5"></i>;
      default:
        return <i className="bi bi-bell-fill text-secondary fs-5"></i>;
    }
  };

  return (
    <>
      <div className="notif-drawer-backdrop" onClick={onClose} />
      <div className="notif-drawer">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--primary-bg)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="bi bi-bell-fill fs-5"></i>
            </div>
            <div>
              <h5 className="m-0 fw-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Notification Center</h5>
              <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                {notifications.length} active system alert{notifications.length === 1 ? '' : 's'}
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onClose}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-2 border-bottom d-flex gap-1 flex-wrap" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-input)' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'critical', label: '🚨 Overdue' },
            { id: 'warranty', label: '🛡️ Warranties' },
            { id: 'maint', label: '🔧 Maintenance' },
            { id: 'orders', label: '🛒 Orders' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: '20px' }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div className="text-center p-5 text-muted">
              <i className="bi bi-check-circle-fill fs-1 text-success mb-2 d-block"></i>
              <p className="fw-semibold m-0" style={{ color: 'var(--text-primary)' }}>All Clear!</p>
              <small>No pending alerts matching this filter.</small>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="notif-item unread"
                onClick={() => {
                  if (item.link_tab && onNavigate) {
                    onNavigate(item.link_tab);
                    onClose();
                  }
                }}
              >
                <div className="mt-1">{getIcon(item.type)}</div>
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                    <span className="fw-bold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {item.title}
                    </span>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="m-0 mb-1" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      <i className="bi bi-clock me-1"></i>
                      {item.timestamp}
                    </small>
                    <span className="btn btn-sm btn-link p-0 text-decoration-none" style={{ fontSize: '11px', color: 'var(--primary)' }}>
                      Take Action &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onMarkAllRead}
            style={{ fontSize: '12px' }}
          >
            <i className="bi bi-check2-all me-1"></i>Mark all as read
          </button>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            AssetPulse Live Feed
          </span>
        </div>
      </div>
    </>
  );
}
