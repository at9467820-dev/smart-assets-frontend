import React from 'react';

export function Sidebar({ currentTab, setTab, overdueCount = 0, maintCount = 0, onOpenAuth }) {
  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Overview', icon: 'bi-grid-1x2' },
        { id: 'assets', label: 'Assets Registry', icon: 'bi-box-seam' },
        {
          id: 'issues',
          label: 'Material Issues',
          icon: 'bi-file-earmark-person',
          badge: overdueCount > 0 ? overdueCount : null,
          badgeStyle: { background: 'var(--danger)', color: '#ffffff' },
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: 'bi-tools',
          badge: maintCount > 0 ? maintCount : null,
          badgeStyle: { background: '#334155', color: '#ffffff' },
        },
        { id: 'calendar', label: 'Service Calendar', icon: 'bi-calendar3' },
        { id: 'allocations', label: 'Allocations', icon: 'bi-arrow-left-right' },
      ],
    },
    {
      title: 'Finance & Supply',
      items: [
        { id: 'orders', label: 'Orders & Vendors', icon: 'bi-cart3' },
        { id: 'budget', label: 'Budget Allocations', icon: 'bi-wallet2' },
        { id: 'depreciation', label: 'Lifecycle Simulator', icon: 'bi-calculator' },
      ],
    },
    {
      title: 'Analytics & Tools',
      items: [
        { id: 'analysis', label: 'Risk Intelligence', icon: 'bi-graph-up' },
        { id: 'datahub', label: 'Data Hub & Backup', icon: 'bi-database-gear' },
        { id: 'scanner', label: 'QR Scanner', icon: 'bi-qr-code-scan' },
      ],
    },
    {
      title: 'Governance',
      items: [
        { id: 'audit_logs', label: 'Security Audit Trail', icon: 'bi-shield-check' },
      ],
    },
  ];

  return (
    <nav id="sidebar" aria-label="Main navigation">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#2563EB" />
            <path
              d="M10 18H14L16.5 12L19.5 24L22 18H26"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">AssetPulse</span>
          <span className="sidebar-brand-sub">Asset Management</span>
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

      {/* User Profile Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <i className="bi bi-person-fill" style={{ fontSize: '16px' }}></i>
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Administrator</div>
            <div className="sidebar-user-role">Superuser &bull; HQ Admin</div>
          </div>
          <button
            type="button"
            className="btn-icon ms-auto"
            title="Sign in / Profile"
            onClick={onOpenAuth}
            style={{ border: 'none', background: 'transparent', color: '#94A3B8' }}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
