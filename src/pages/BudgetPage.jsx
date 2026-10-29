import React from 'react';

export function BudgetPage({ departments = [], assets = [] }) {
  const deptSummaries = [
    { name: 'Computer Science', code: 'CSE', assets: 18, estMaint: 24000, estRepl: 180000, totalEst: 204000, actual: 48000, variance: -156000 },
    { name: 'Electrical Engineering', code: 'EE', assets: 12, estMaint: 18000, estRepl: 95000, totalEst: 113000, actual: 32000, variance: -81000 },
    { name: 'Mechanical Engineering', code: 'ME', assets: 9, estMaint: 15000, estRepl: 60000, totalEst: 75000, actual: 19500, variance: -55500 },
    { name: 'Administration & Finance', code: 'ADM', assets: 7, estMaint: 8000, estRepl: 35000, totalEst: 43000, actual: 12000, variance: -31000 },
  ];

  const grandEst = deptSummaries.reduce((sum, d) => sum + d.totalEst, 0);
  const grandActual = deptSummaries.reduce((sum, d) => sum + d.actual, 0);
  const grandVariance = grandActual - grandEst;

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="page-title">
            <i className="bi bi-wallet2 me-2 text-primary"></i>
            Budget &amp; Cost Estimation
          </h1>
          <p className="page-subtitle">FY2026-27 — Auto-computed from asset depreciation &amp; maintenance records</p>
        </div>
        <div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => alert('Fiscal year budget estimates saved!')}>
            <i className="bi bi-save me-1"></i>Save FY2026 Estimates
          </button>
        </div>
      </div>

      {/* ── Grand Total Row ─────────────────────────────────── */}
      <div className="stat-row stat-row-3 mb-4">
        <div className="stat-card-hero">
          <div>
            <div className="stat-hero-label">Total Estimated Budget</div>
            <div className="stat-hero-value" style={{ fontSize: '32px' }}>
              ₹{grandEst.toLocaleString()}
            </div>
            <div className="stat-hero-sub">All departments · FY2026</div>
          </div>
          <i className="bi bi-wallet2 stat-hero-icon"></i>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent success"></div>
          <div className="stat-card-label">Actual Spent to Date</div>
          <div className="stat-card-value" style={{ fontSize: '28px', color: 'var(--emerald)' }}>
            ₹{grandActual.toLocaleString()}
          </div>
          <small className="text-muted">Total verified expenditure</small>
          <i className="bi bi-check-circle stat-card-icon"></i>
        </div>

        <div className="stat-card">
          <div className={`stat-card-accent ${grandVariance > 0 ? 'danger' : 'brass'}`}></div>
          <div className="stat-card-label">Budget Variance</div>
          <div className="stat-card-value" style={{ fontSize: '28px', color: grandVariance > 0 ? 'var(--danger)' : 'var(--emerald)' }}>
            {grandVariance > 0 ? '+' : '−'}₹{Math.abs(grandVariance).toLocaleString()}
          </div>
          <small className="text-muted">{grandVariance <= 0 ? 'Under projected budget' : 'Over budget'}</small>
          <i className="bi bi-graph-up stat-card-icon"></i>
        </div>
      </div>

      {/* ── Department Breakdown Table ──────────────────────── */}
      <div className="card">
        <div className="card-header-custom">
          <h3 className="card-title">
            <i className="bi bi-table me-2 text-primary"></i>
            Department Breakdown &amp; Variance
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Department</th>
                <th>Assets</th>
                <th>Est. Maintenance (₹)</th>
                <th>Est. Replacement (₹)</th>
                <th>Total Estimated (₹)</th>
                <th>Actual Spent (₹)</th>
                <th>Variance (₹)</th>
                <th>Budget Utilized</th>
              </tr>
            </thead>
            <tbody>
              {deptSummaries.map((s, idx) => {
                const pct = Math.min(100, Math.round((s.actual / s.totalEst) * 100));
                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{s.name}</div>
                      <small className="text-muted">{s.code}</small>
                    </td>
                    <td>{s.assets}</td>
                    <td>₹{s.estMaint.toLocaleString()}</td>
                    <td>₹{s.estRepl.toLocaleString()}</td>
                    <td style={{ fontWeight: 700 }}>₹{s.totalEst.toLocaleString()}</td>
                    <td>₹{s.actual.toLocaleString()}</td>
                    <td style={{ fontWeight: 600, color: s.variance > 0 ? 'var(--danger)' : 'var(--emerald)' }}>
                      {s.variance > 0 ? '+' : ''}₹{s.variance.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--hairline)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: pct > 80 ? 'var(--danger)' : 'var(--emerald)',
                            }}
                          />
                        </div>
                        <small style={{ fontWeight: 700, fontSize: '11px', width: '32px' }}>{pct}%</small>
                      </div>
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
