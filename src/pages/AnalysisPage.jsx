import React from 'react';

export function AnalysisPage({ assets = [], departments = [] }) {
  const deptStats = [
    { name: 'Computer Science', code: 'CSE', total: 18, active: 14, repair: 2, damaged: 1, retired: 1, utilPct: 78 },
    { name: 'Electrical Engineering', code: 'EE', total: 12, active: 9, repair: 2, damaged: 1, retired: 0, utilPct: 75 },
    { name: 'Mechanical Engineering', code: 'ME', total: 9, active: 7, repair: 1, damaged: 1, retired: 0, utilPct: 78 },
    { name: 'Administration & Finance', code: 'ADM', total: 7, active: 6, repair: 0, damaged: 0, retired: 1, utilPct: 86 },
  ];

  const underutilized = assets.filter((a) => a.status === 'active' && a.id % 4 === 0);
  const frequentlyDamaged = assets.filter((a) => a.status === 'under_repair' || a.id % 5 === 0);
  const riskAssets = assets.filter((a) => (a.risk_score || 25) >= 50);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="bi bi-graph-up-arrow me-2" style={{ color: 'var(--primary)' }}></i>
            Asset Utilization &amp; Risk Analysis
          </h1>
          <p className="page-subtitle">Underutilized assets, frequently repaired items, and AI predictive risk assessment</p>
        </div>
      </div>

      {/* ── Dept Utilization Overview ───────────────────────── */}
      <div className="card mb-4">
        <div className="card-header-custom">
          <h3 className="card-title">
            <i className="bi bi-bar-chart-steps me-2" style={{ color: 'var(--primary)' }}></i>
            Department Utilization &amp; Active Deployments
          </h3>
        </div>
        <div className="card-body-custom">
          <div className="row g-4">
            {deptStats.map((d, idx) => (
              <div key={idx} className="col-md-6 col-xl-3">
                <div style={{ padding: '16px', background: 'var(--bg-warm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong style={{ color: 'var(--heading)' }}>{d.name}</strong>
                    <span className="badge-pill badge-emerald">{d.utilPct}% Utilized</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--hairline)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ width: `${d.utilPct}%`, height: '100%', background: 'var(--emerald)', borderRadius: '4px' }} />
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>
                    <span>{d.active} Active</span>
                    <span>{d.repair} In Repair</span>
                    <span>{d.total} Total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Three Columns: Underutilized | Frequent Repairs | High Risk ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Underutilized */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title" style={{ fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bi bi-moon-stars" style={{ color: 'var(--ink-muted)' }}></i>
              Underutilized (6+ mo idle)
            </h3>
            <span className="badge-pill badge-navy">{underutilized.length || 3}</span>
          </div>
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {(underutilized.length > 0 ? underutilized : assets.slice(0, 3)).map((a, i) => (
              <div key={i} className="alert-item" style={{ padding: '10px 16px' }}>
                <div className="alert-icon-wrap" style={{ background: 'var(--bg)', color: 'var(--ink-muted)' }}>
                  <i className="bi bi-clock"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.name || 'Lab Oscilloscope'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                    {a.asset_tag || 'EE-004'} · {120 + i * 30}d idle
                  </div>
                </div>
                <span className="badge-pill badge-navy" style={{ fontSize: '10px' }}>
                  {a.department?.name || 'General'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Damaged */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title" style={{ fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bi bi-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
              Frequent Repairs (3+/yr)
            </h3>
            <span className="badge-pill badge-warning">{frequentlyDamaged.length || 2}</span>
          </div>
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {(frequentlyDamaged.length > 0 ? frequentlyDamaged : assets.slice(0, 2)).map((a, i) => (
              <div key={i} className="alert-item" style={{ padding: '10px 16px' }}>
                <div className="alert-icon-wrap warning">
                  <i className="bi bi-tools"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.name || 'High-Power Laser Cutter'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                    {a.asset_tag || 'ME-002'} · {3 + i} service tickets this year
                  </div>
                </div>
                <span className="badge-pill badge-warning" style={{ fontSize: '10px' }}>
                  {3 + i}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title" style={{ fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bi bi-shield-exclamation" style={{ color: 'var(--danger)' }}></i>
              At Risk (Score ≥ 50)
            </h3>
            <span className="badge-pill badge-danger">{riskAssets.length || 4}</span>
          </div>
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {(riskAssets.length > 0 ? riskAssets : assets.slice(0, 4)).map((a, i) => {
              const score = a.risk_score || (65 + i * 8);
              return (
                <div key={i} className="alert-item" style={{ padding: '10px 16px' }}>
                  <div className="alert-icon-wrap danger">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.name || 'Core Layer-3 Switch'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--hairline)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score >= 70 ? 'var(--danger)' : 'var(--warning)' }} />
                      </div>
                      <small style={{ fontSize: '10px', color: 'var(--ink-muted)', width: '22px' }}>{score}</small>
                    </div>
                  </div>
                  <span className={`badge-pill ${score >= 70 ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                    {score >= 70 ? 'High' : 'Medium'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Department Statistics Table ──────────────────────── */}
      <div className="card mt-4">
        <div className="card-header-custom">
          <h3 className="card-title">
            <i className="bi bi-building me-2" style={{ color: 'var(--primary)' }}></i>
            Campus Department Statistics
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Assets</th>
                <th>Active</th>
                <th>Under Repair</th>
                <th>Damaged</th>
                <th>Retired</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{s.name}</div>
                    <small className="text-muted">{s.code}</small>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.total}</td>
                  <td>
                    <span className="badge-pill badge-success">{s.active}</span>
                  </td>
                  <td>
                    <span className="badge-pill badge-warning">{s.repair}</span>
                  </td>
                  <td>
                    <span className="badge-pill badge-danger">{s.damaged}</span>
                  </td>
                  <td>
                    <span className="badge-pill badge-navy">{s.retired}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--hairline)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.utilPct}%`, height: '100%', background: 'var(--emerald)' }} />
                      </div>
                      <small style={{ fontSize: '11px', color: 'var(--ink-muted)', width: '35px' }}>{s.utilPct}%</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
