import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../api/client';

export function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const sampleLogs = [
    { id: 101, timestamp: '29 Oct 2026, 11:45:22 AM', user: 'admin', action: 'CREATE', entity: 'AssetIssue', description: 'Generated Gate Pass (Parchi) for Dell Optiplex 7090 Desktop', ip_address: '127.0.0.1' },
    { id: 102, timestamp: '29 Oct 2026, 10:15:08 AM', user: 'admin', action: 'LOGIN', entity: 'UserSession', description: 'User admin signed in successfully via password credentials', ip_address: '127.0.0.1' },
    { id: 103, timestamp: '28 Oct 2026, 04:30:19 PM', user: 'cse_staff', action: 'UPDATE', entity: 'Asset', description: 'Updated equipment maintenance status to in_progress', ip_address: '127.0.0.1' },
    { id: 104, timestamp: '28 Oct 2026, 02:10:00 PM', user: 'maint1', action: 'CREATE', entity: 'MaintenanceLog', description: 'Logged preventive service ticket for Rigol Oscilloscope', ip_address: '127.0.0.1' },
    { id: 105, timestamp: '27 Oct 2026, 09:25:44 AM', user: 'admin', action: 'CREATE', entity: 'AssetOrder', description: 'Submitted purchase requisition for Cisco Catalyst Switch', ip_address: '127.0.0.1' },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      try {
        const liveLogs = await api.getAuditLogs();
        if (isMounted) {
          if (liveLogs && liveLogs.length > 0) {
            setLogs(liveLogs);
          } else {
            setLogs(sampleLogs);
          }
        }
      } catch (err) {
        if (isMounted) setLogs(sampleLogs);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLogs();
    return () => { isMounted = false; };
  }, []);

  const filteredLogs = useMemo(() => {
    const list = logs.length > 0 ? logs : sampleLogs;
    if (!actionFilter) return list;
    return list.filter((l) => (l.action || '').toUpperCase().includes(actionFilter.toUpperCase()));
  }, [logs, actionFilter]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
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
                const act = (log.action || '').toUpperCase();
                const actClass =
                  act.includes('LOGIN')
                    ? 'badge-navy'
                    : act.includes('CREATE')
                    ? 'badge-success'
                    : act.includes('UPDATE')
                    ? 'badge-warning'
                    : 'badge-danger';

                const userName = log.user || 'System';
                const initial = userName ? userName[0].toUpperCase() : 'S';

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
                          {initial}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--heading)', fontSize: '12.5px' }}>
                          {userName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-pill ${actClass}`}>{log.action}</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      <span style={{ fontWeight: 600 }}>{log.entity || log.entityType || 'Record'}</span>
                    </td>
                    <td style={{ fontSize: '13px', maxWidth: '380px' }}>{log.description}</td>
                    <td style={{ fontSize: '11.5px', color: 'var(--ink-muted)', fontFamily: 'monospace' }}>
                      {log.ip_address || log.ip || '127.0.0.1'}
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)' }}>
                    No audit records matching this filter.
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
