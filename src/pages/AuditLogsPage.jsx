import React, { useState, useMemo } from 'react';

export function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('');

  const sampleLogs = [
    { id: 101, timestamp: '09 Oct 2026, 11:45:22', user: 'Administrator', role: 'admin', action: 'CREATE', entityType: 'MaterialIssue', entityId: 'GP-2026-0004', description: 'Generated Gate Pass (Parchi) for Dell Precision Tower 7920 to Dr. Tariq', ip: '192.168.1.45' },
    { id: 102, timestamp: '09 Oct 2026, 10:15:08', user: 'Administrator', role: 'admin', action: 'LOGIN', entityType: 'UserSession', entityId: 'ADM-1', description: 'User administrator authenticated successfully via password credentials', ip: '192.168.1.45' },
    { id: 103, timestamp: '08 Oct 2026, 16:30:19', user: 'Engr. Sarah', role: 'staff', action: 'UPDATE', entityType: 'Asset', entityId: 'EE-002', description: 'Updated equipment maintenance status to in_progress', ip: '192.168.1.88' },
    { id: 104, timestamp: '08 Oct 2026, 14:10:00', user: 'Maint Team', role: 'maintenance', action: 'CREATE', entityType: 'MaintenanceLog', entityId: '#12', description: 'Logged preventive service ticket for 3D Printer Ultimaker S5', ip: '192.168.1.102' },
    { id: 105, timestamp: '07 Oct 2026, 09:25:44', user: 'Administrator', role: 'admin', action: 'CREATE', entityType: 'AssetOrder', entityId: 'ORD-2026-0005', description: 'Submitted purchase requisition for Cisco Catalyst 9300 Switch', ip: '192.168.1.45' },
  ];

  const filteredLogs = useMemo(() => {
    if (!actionFilter) return sampleLogs;
    return sampleLogs.filter((l) => l.action === actionFilter);
  }, [actionFilter]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="bi bi-shield-check me-2" style={{ color: 'var(--emerald)' }}></i>
            System Audit Logs &amp; Activity Stream
          </h1>
          <p className="page-subtitle">Complete security audit trail of all user actions, gate pass issuances, and system events</p>
        </div>
      </div>

      {/* ── Action Filter Tabs ──────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${!actionFilter ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActionFilter('')}
            >
              All Actions
            </button>
            <button
              type="button"
              className={`btn btn-sm ${actionFilter === 'LOGIN' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActionFilter('LOGIN')}
            >
              Logins
            </button>
            <button
              type="button"
              className={`btn btn-sm ${actionFilter === 'CREATE' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActionFilter('CREATE')}
            >
              Creations
            </button>
            <button
              type="button"
              className={`btn btn-sm ${actionFilter === 'UPDATE' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActionFilter('UPDATE')}
            >
              Updates
            </button>
            <button
              type="button"
              className={`btn btn-sm ${actionFilter === 'DELETE' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActionFilter('DELETE')}
            >
              Deletions
            </button>
          </div>
        </div>
      </div>

      {/* ── Timeline Table ──────────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Action</th>
                <th>Target Entity</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const actClass =
                  log.action === 'LOGIN'
                    ? 'badge-navy'
                    : log.action === 'CREATE'
                    ? 'badge-success'
                    : log.action === 'UPDATE'
                    ? 'badge-warning'
                    : 'badge-danger';

                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            fontSize: '11px',
                            background: 'rgba(16,185,129,0.15)',
                            color: 'var(--emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {log.user[0]}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--heading)', fontSize: '12.5px' }}>
                          {log.user}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-pill ${actClass}`}>{log.action}</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      <span style={{ fontWeight: 600 }}>{log.entityType}</span>{' '}
                      <span className="text-muted">#{log.entityId}</span>
                    </td>
                    <td style={{ fontSize: '13px', maxWidth: '340px' }}>{log.description}</td>
                    <td style={{ fontSize: '11.5px', color: 'var(--ink-muted)', fontFamily: 'monospace' }}>
                      {log.ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
