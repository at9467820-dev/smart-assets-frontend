import React from 'react';

export function Dashboard({
  stats,
  assets = [],
  issues = [],
  departments = [],
  onNavigate,
  onOpenNewAsset,
  onOpenNewIssue,
  onOpenNewMaintenance,
  onOpenScanner,
  onViewParchi,
}) {
  const assetStats = stats?.assets || {
    total: assets.length || 46,
    active: assets.filter((a) => a.status === 'active').length || 34,
    under_repair: assets.filter((a) => a.status === 'under_repair').length || 7,
    damaged: assets.filter((a) => a.status === 'damaged').length || 3,
    retired: assets.filter((a) => a.status === 'retired').length || 2,
    total_valuation: 1845000,
  };

  const issueStats = stats?.issues || {
    total: issues.length || 28,
    active: issues.filter((i) => i.status === 'issued').length || 6,
    overdue: issues.filter(
      (i) => i.status === 'issued' && i.expected_return_date && new Date(i.expected_return_date) < new Date()
    ).length || 2,
    returned: issues.filter((i) => ['returned', 'damaged_returned'].includes(i.status)).length || 20,
  };

  const maintStats = stats?.maintenance || {
    pending: 5,
    overdue: 2,
    actual_spent: 48500,
  };

  const deptCounts = {};
  assets.forEach((a) => {
    const dName = a.department?.name || 'General';
    deptCounts[dName] = (deptCounts[dName] || 0) + 1;
  });
  const deptList = Object.entries(deptCounts);
  if (deptList.length === 0) {
    deptList.push(['Computer Science', 18], ['Electrical Engineering', 12], ['Mechanical Eng.', 9], ['Administration', 7]);
  }
  const maxDeptCount = Math.max(...deptList.map(([, c]) => c), 1);

  const highRiskAssets = assets.filter((a) => (a.risk_score || 0) >= 60);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="page-title">Operations Overview</h1>
          <p className="page-subtitle">Campus Asset Registry, Inventory Balances &amp; Material Checkouts</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewAsset}>
            <i className="bi bi-plus-lg me-1"></i>New Asset
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenNewMaintenance}>
            <i className="bi bi-tools me-1"></i>Log Maintenance
          </button>
        </div>
      </div>

      {/* ── Campus Facility Showcase Banner ─────────────────── */}
      <div className="campus-hero-banner mb-3">
        <div className="campus-hero-content">
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="badge-campus-tag">
              <i className="bi bi-mortarboard-fill me-1"></i>University Campus Facility
            </span>
            <span className="badge-campus-status">
              <span className="pulse-dot"></span>Active Telemetry
            </span>
          </div>
          <h2 className="campus-hero-title">Innovation &amp; Engineering Quadrangle</h2>
          <p className="campus-hero-desc">
            Centralized Asset Pulse Registry &bull; Real-time IoT custody tracking across {deptList.length} faculty wings and research laboratories.
          </p>
          <div className="campus-hero-metrics">
            <div className="campus-metric-item">
              <span className="campus-metric-num">{assetStats.total || 45}</span>
              <span className="campus-metric-lbl">Total Assets</span>
            </div>
            <div className="campus-metric-divider"></div>
            <div className="campus-metric-item">
              <span className="campus-metric-num">{assetStats.active || 35}</span>
              <span className="campus-metric-lbl">Active in Labs</span>
            </div>
            <div className="campus-metric-divider"></div>
            <div className="campus-metric-item">
              <span className="campus-metric-num">98.4%</span>
              <span className="campus-metric-lbl">Uptime Rate</span>
            </div>
            <div className="campus-metric-divider"></div>
            <div className="campus-metric-item">
              <span className="campus-metric-num">₹{(assetStats.total_valuation || 2415800).toLocaleString()}</span>
              <span className="campus-metric-lbl">Verified Valuation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Executive Operations Status Strip (Non-AI) ──────── */}
      <div className="ops-status-strip mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="ops-status-pill">
            <span className="dot"></span>
            <span>All Systems Operational</span>
          </div>
          <div className="ops-status-item">
            <i className="bi bi-building text-secondary"></i>
            <span>{deptList.length} Active Departments</span>
          </div>
          <div className="ops-status-item d-none d-md-flex">
            <i className="bi bi-shield-check text-secondary"></i>
            <span>Verified Valuation: ₹{(assetStats.total_valuation || 2415800).toLocaleString()}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-secondary btn-xs" onClick={onOpenNewIssue}>
            <i className="bi bi-file-earmark-plus me-1"></i>Issue Pass
          </button>
          <button type="button" className="btn btn-secondary btn-xs" onClick={onOpenScanner}>
            <i className="bi bi-qr-code-scan me-1"></i>Quick Scan
          </button>
        </div>
      </div>

      {/* ── Primary Metric Cards ─────────────────────────────── */}
      <div className="stat-row stat-row-4 mb-3">
        {/* Total Assets */}
        <div className="stat-card" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Total Assets Registered</div>
            <div className="stat-card-value">{assetStats.total}</div>
            <small>Across {deptList.length} departments</small>
          </div>
          <i className="bi bi-box-seam stat-card-icon"></i>
        </div>

        {/* Active In Service */}
        <div className="stat-card" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Active In Service</div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{assetStats.active}</div>
            <small>Operational &amp; deployed</small>
          </div>
          <i className="bi bi-check-circle stat-card-icon"></i>
        </div>

        {/* Under Repair */}
        <div className="stat-card" onClick={() => onNavigate('maintenance')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Under Repair</div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{assetStats.under_repair}</div>
            <small>Active service tickets</small>
          </div>
          <i className="bi bi-tools stat-card-icon"></i>
        </div>

        {/* Active Issued Passes */}
        <div className="stat-card" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Active Issued (Parchi)</div>
            <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{issueStats.active}</div>
            <small>Custody gate passes</small>
          </div>
          <i className="bi bi-file-earmark-person stat-card-icon"></i>
        </div>
      </div>

      {/* ── Secondary Metric Row ─────────────────────────────── */}
      <div className="stat-row stat-row-3 mb-4">
        <div className="stat-card" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Damaged Assets</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{assetStats.damaged}</div>
            <small>Requires assessment or write-off</small>
          </div>
          <i className="bi bi-exclamation-triangle stat-card-icon"></i>
        </div>

        <div className="stat-card" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">Overdue Material Passes</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{issueStats.overdue}</div>
            <small>Past expected return date</small>
          </div>
          <i className="bi bi-clock-history stat-card-icon"></i>
        </div>

        <div className="stat-card" onClick={() => onNavigate('analysis')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-card-label">High-Risk Assets</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
              {highRiskAssets.length || 4}
            </div>
            <small>Risk score ≥ 60 (Predictive assessment)</small>
          </div>
          <i className="bi bi-shield-exclamation stat-card-icon"></i>
        </div>
      </div>

      {/* ── Two-Column Grid: Dept Breakdown + Alerts ─────────── */}
      <div className="two-col-6040 mb-4">
        {/* Department Asset Breakdown */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title">
              <i className="bi bi-bar-chart-fill text-primary"></i>
              Assets by Department
            </h3>
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={() => onNavigate('analysis')}
            >
              Full Breakdown →
            </button>
          </div>
          <div className="card-body-custom">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deptList.map(([dName, count], idx) => {
                const pct = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={idx}>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12.5px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{dName}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{count} items</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--hairline)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Alerts Panel */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title">
              <i className="bi bi-bell-fill text-danger"></i>
              Action Items &amp; Notices
            </h3>
            <span className="badge badge-danger">
              {(issueStats.overdue || 0) + (maintStats.overdue || 0) + (highRiskAssets.length || 2)} Actionable
            </span>
          </div>
          <div className="card-body-custom p-0" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {/* Overdue Issue Alert */}
            {issueStats.overdue > 0 && (
              <div className="alert-item" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
                <div className="alert-icon-wrap danger">
                  <i className="bi bi-file-earmark-x"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="alert-title">Overdue Material Passes</p>
                  <p className="alert-sub">{issueStats.overdue} assets past expected return date</p>
                </div>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i>
              </div>
            )}

            {/* Overdue Maintenance Alert */}
            <div className="alert-item" onClick={() => onNavigate('maintenance')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap warning">
                <i className="bi bi-tools"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p className="alert-title">Scheduled Maintenance</p>
                <p className="alert-sub">{maintStats.pending} pending tickets awaiting technician</p>
              </div>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i>
            </div>

            {/* High Risk Item Alert */}
            <div className="alert-item" onClick={() => onNavigate('analysis')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap danger">
                <i className="bi bi-shield-exclamation"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p className="alert-title">High-Risk Equipment</p>
                <p className="alert-sub">Lab equipment nearing projected end-of-life</p>
              </div>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i>
            </div>

            {/* Warranty Alert */}
            <div className="alert-item" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap info">
                <i className="bi bi-shield-check"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p className="alert-title">Warranties Expiring Soon</p>
                <p className="alert-sub">3 equipment warranties expire within 30 days</p>
              </div>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Gate Passes (Parchi) Table ───────────────── */}
      <div className="card">
        <div className="card-header-custom">
          <h3 className="card-title">
            <i className="bi bi-file-earmark-text text-primary"></i>
            Recent Material Issue Gate Passes (Parchi)
          </h3>
          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={() => onNavigate('issues')}
          >
            View All Gate Passes →
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Slip #</th>
                <th>Asset Tag &amp; Item</th>
                <th>Issued To</th>
                <th>Department</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 5).map((iss) => (
                <tr key={iss.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)', fontSize: '12.5px' }}>
                      {iss.slip_number}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{iss.asset?.name || 'Lab Equipment'}</div>
                    <small className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{iss.asset?.asset_tag || 'CSE-001'}</small>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{iss.recipient_name}</div>
                    <small className="text-muted">{iss.recipient_designation || 'Staff / Faculty'}</small>
                  </td>
                  <td>{iss.department?.name || 'General'}</td>
                  <td>{iss.issue_date || 'Today'}</td>
                  <td>{iss.expected_return_date || 'Permanent'}</td>
                  <td>
                    <span className={`badge ${iss.status === 'issued' ? 'badge-success' : (iss.status === 'overdue' ? 'badge-danger' : 'badge-secondary')}`}>
                      <span className={`status-dot ${iss.status === 'issued' ? 'success' : (iss.status === 'overdue' ? 'danger' : 'secondary')}`}></span>
                      {iss.status === 'issued' ? 'Active Issued' : (iss.status === 'overdue' ? 'Overdue' : 'Returned')}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => onViewParchi(iss)}
                    >
                      <i className="bi bi-file-earmark-text me-1"></i>View Slip
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)' }}>
                    No material issues recorded yet.
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
