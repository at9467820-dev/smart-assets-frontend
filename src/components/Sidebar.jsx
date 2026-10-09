import React from 'react';

export function Sidebar({ currentTab, setTab, overdueCount = 0, maintCount = 0, onOpenAuth }) {
  const navSections = [
    {
      title: 'Menu',
      items: [
        { id: 'dashboard', label: 'Overview', icon: 'bi-grid-1x2-fill' },
        { id: 'assets', label: 'Assets', icon: 'bi-box-seam-fill' },
        {
          id: 'issues',
          label: 'Material Issues',
          icon: 'bi-file-earmark-person-fill',
          badge: overdueCount > 0 ? overdueCount : null,
          badgeStyle: { background: 'var(--danger)' },
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: 'bi-tools',
          badge: maintCount > 0 ? maintCount : null,
        },
        { id: 'allocations', label: 'Allocations', icon: 'bi-arrow-left-right' },
      ],
    },
    {
      title: 'Finance & Procurement',
      items: [
        { id: 'orders', label: 'Asset Orders', icon: 'bi-cart-check-fill' },
        { id: 'budget', label: 'Budget & Reports', icon: 'bi-wallet2' },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'analysis', label: 'Analysis', icon: 'bi-graph-up-arrow' },
        { id: 'scanner', label: 'QR Scanner', icon: 'bi-qr-code-scan' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'audit_logs', label: 'Audit Trail', icon: 'bi-shield-check' },
      ],
    },
  ];

  return (
    <nav id="sidebar" aria-label="Main navigation">
      {/* Brand with SVG Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="48" height="48" rx="12" fill="#091A17" stroke="#10B981" strokeWidth="1.5" />
            <g transform="translate(12, 11)">
              <path d="M4 24V8L10 4V20L4 24Z" fill="#10B981" />
              <path d="M10 4L22 20V26L10 10V4Z" fill="#D4AF37" />
              <path d="M22 8V24L16 28V12L22 8Z" fill="#059669" opacity="0.9" />
              <circle cx="22" cy="8" r="2.5" fill="#FDE047" />
            </g>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">AssetPulse</span>
          <span className="sidebar-brand-sub">Smart Asset Registry</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {navSections.map((sec, idx) => (
          <React.Fragment key={idx}>
            <div className="sidebar-section-label">{sec.title}</div>
            {sec.items.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-item-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(item.id);
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge-count" style={item.badgeStyle}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <img src="/img/avatar-admin.jpg" alt="Admin" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Administrator</div>
            <div className="sidebar-user-role">admin</div>
          </div>
          <button
            type="button"
            className="btn-icon ms-auto"
            title="Authentication & Profiles"
            onClick={onOpenAuth}
            style={{ border: 'none', background: 'transparent' }}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
