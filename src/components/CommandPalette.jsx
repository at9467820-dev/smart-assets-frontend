import React, { useState, useEffect } from 'react';

export function CommandPalette({ isOpen, onClose, onNavigate, onOpenNewIssue, onOpenNewAsset, onOpenNewOrder, onOpenNewMaintenance, onOpenScanner }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      group: 'Quick Actions',
      items: [
        {
          label: 'Issue Material / Generate Gate Pass (Parchi)',
          icon: 'bi-file-earmark-plus-fill',
          tag: 'Issue',
          handler: () => { onClose(); onOpenNewIssue(); },
        },
        {
          label: 'Register New Asset',
          icon: 'bi-plus-lg',
          tag: 'Asset',
          handler: () => { onClose(); onOpenNewAsset(); },
        },
        {
          label: 'New Asset Requisition / Order',
          icon: 'bi-cart-plus-fill',
          tag: 'Order',
          handler: () => { onClose(); onOpenNewOrder(); },
        },
        {
          label: 'Create Maintenance Request',
          icon: 'bi-tools',
          tag: 'Maint',
          handler: () => { onClose(); onOpenNewMaintenance(); },
        },
        {
          label: 'Open Camera QR Scanner',
          icon: 'bi-qr-code-scan',
          tag: 'Scan',
          handler: () => { onClose(); onOpenScanner(); },
        },
      ],
    },
    {
      group: 'Navigation',
      items: [
        {
          label: 'Dashboard Overview',
          icon: 'bi-grid-1x2',
          tag: 'Jump',
          handler: () => { onClose(); onNavigate('dashboard'); },
        },
        {
          label: 'Asset Inventory Registry',
          icon: 'bi-box-seam',
          tag: 'Jump',
          handler: () => { onClose(); onNavigate('assets'); },
        },
        {
          label: 'Material Issues & Gate Passes',
          icon: 'bi-file-earmark-person-fill',
          tag: 'Jump',
          handler: () => { onClose(); onNavigate('issues'); },
        },
        {
          label: 'Budget & Spend Variance',
          icon: 'bi-wallet2',
          tag: 'Jump',
          handler: () => { onClose(); onNavigate('budget'); },
        },
        {
          label: 'Asset Risk & Utilization Analysis',
          icon: 'bi-graph-up-arrow',
          tag: 'Jump',
          handler: () => { onClose(); onNavigate('analysis'); },
        },
        {
          label: 'System Audit Trail',
          icon: 'bi-shield-check',
          tag: 'Admin',
          handler: () => { onClose(); onNavigate('audit_logs'); },
        },
      ],
    },
  ];

  const filteredGroups = actions
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((grp) => grp.items.length > 0);

  return (
    <div
      id="cmd-palette"
      className="cmd-palette-backdrop active"
      onClick={(e) => {
        if (e.target.id === 'cmd-palette') onClose();
      }}
      style={{ display: 'flex' }}
    >
      <div className="cmd-palette-card animate-in">
        <div className="cmd-palette-header">
          <i className="bi bi-search" style={{ color: 'var(--primary)', fontSize: '18px' }}></i>
          <input
            type="text"
            id="cmd-input"
            className="cmd-palette-input"
            placeholder="Type a command, search asset tag or page..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <span className="cmd-palette-shortcut" onClick={onClose} style={{ cursor: 'pointer' }}>
            ESC
          </span>
        </div>

        <div className="cmd-palette-body" id="cmd-list">
          {filteredGroups.map((grp, gIdx) => (
            <React.Fragment key={gIdx}>
              <div className="cmd-palette-group-title">{grp.group}</div>
              {grp.items.map((item, idx) => (
                <div
                  key={idx}
                  className="cmd-palette-item"
                  onClick={item.handler}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cmd-palette-item-left">
                    <div className="cmd-palette-item-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <div>{item.label}</div>
                  </div>
                  <span className="cmd-palette-shortcut">{item.tag}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
          {filteredGroups.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-muted)' }}>
              No matching commands or pages found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
