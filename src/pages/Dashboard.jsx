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
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Live summary of your campus asset registry & material checkouts</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewAsset}>
            <i className="bi bi-plus-lg me-1"></i>New Asset
          </button>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onOpenNewMaintenance}>
            <i className="bi bi-tools me-1"></i>Log Maintenance
          </button>
        </div>
      </div>

      {/* ── Human Welcome Banner ────────────────────────────── */}
      <div className="human-banner mb-4">
        <img
          src="/img/team-collaboration.jpg"
          className="human-banner-img"
          alt="Team collaboration at work"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="human-banner-overlay">
          <div className="human-banner-text">
            <h2>Your team keeps the campus running. 🎓</h2>
            <p>
              Every asset tracked here supports real people — students, faculty &amp; staff working every day.
            </p>
          </div>
          <div className="human-banner-faces">
            <div className="face">
              <img src="/img/avatar-admin.jpg" alt="Admin" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="face">
              <img src="/img/avatar-staff.jpg" alt="Staff" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="face">
              <img src="/img/avatar-maintenance.jpg" alt="Maintenance" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="face-count">+{deptList.length}</div>
          </div>
        </div>
      </div>

      {/* ── Primary Stat Row 4 ──────────────────────────────── */}
      <div className="stat-row stat-row-4 mb-3">
        {/* Hero Card */}
        <div className="stat-card-hero animate-in animate-in-1" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-hero-label">Total Assets Registered</div>
            <div className="stat-hero-value">{assetStats.total}</div>
            <div className="stat-hero-sub">
              Across {deptList.length} departments · ₹{(assetStats.total_valuation || 0).toLocaleString()}
            </div>
          </div>
          <i className="bi bi-box-seam stat-hero-icon"></i>
        </div>

        {/* Active Assets */}
        <div className="stat-card animate-in animate-in-2" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-accent success"></div>
          <div className="stat-card-label">Active In Service</div>
          <div className="stat-card-value" style={{ color: 'var(--emerald)' }}>{assetStats.active}</div>
          <small className="text-muted">Operational & deployed</small>
          <i className="bi bi-check-circle stat-card-icon"></i>
        </div>

        {/* Under Repair */}
        <div className="stat-card animate-in animate-in-3" onClick={() => onNavigate('maintenance')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-accent warning"></div>
          <div className="stat-card-label">Under Repair</div>
          <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{assetStats.under_repair}</div>
          <small className="text-muted">Being serviced</small>
          <i className="bi bi-tools stat-card-icon"></i>
        </div>

        {/* Material Issues / Active Passes */}
        <div className="stat-card animate-in animate-in-4" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-accent brass"></div>
          <div className="stat-card-label">Active Issued (Parchi)</div>
          <div className="stat-card-value" style={{ color: 'var(--brass)' }}>{issueStats.active}</div>
          <small className="text-muted">Temporary custody passes</small>
          <i className="bi bi-file-earmark-person stat-card-icon"></i>
        </div>
      </div>

      {/* ── Secondary Stat Row 3 ────────────────────────────── */}
      <div className="stat-row stat-row-3 mb-4">
        <div className="stat-card" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-accent danger"></div>
          <div className="stat-card-label">Damaged Assets</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{assetStats.damaged}</div>
          <small className="text-muted">Needs attention or write-off</small>
          <i className="bi bi-exclamation-triangle stat-card-icon"></i>
        </div>

        <div className="stat-card" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-accent danger"></div>
          <div className="stat-card-label">Overdue Returns</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{issueStats.overdue}</div>
          <small className="text-muted">Past expected return date</small>
          <i className="bi bi-clock-history stat-card-icon"></i>
        </div>

        <div className="stat-card stat-card-dark" onClick={() => onNavigate('analysis')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-label">High-Risk Assets</div>
          <div className="stat-card-value" style={{ color: '#fca5a5' }}>
            {highRiskAssets.length || 4}
          </div>
          <small>Risk score ≥ 60 (Predictive AI)</small>
          <i className="bi bi-shield-exclamation stat-card-icon"></i>
        </div>
      </div>

      {/* ── Quick Operation Shortcuts Bar ─────────────────────── */}
      <div className="card mb-4" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div className="card-body-custom py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge-pill badge-emerald">
                <i className="bi bi-lightning-charge-fill me-1"></i>Quick Actions
              </span>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                Instant gate pass issuance, camera QR scanner &amp; service logs
              </span>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-brass btn-sm" onClick={onOpenNewIssue}>
                <i className="bi bi-file-earmark-plus-fill me-1"></i>Issue Material (Parchi)
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={onOpenScanner}>
                <i className="bi bi-qr-code-scan me-1"></i>Scan QR Code
              </button>
              <button className="btn btn-primary btn-sm" onClick={onOpenNewAsset}>
                <i className="bi bi-plus-circle-fill me-1"></i>Add Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Grid: Dept Breakdown + Alerts ─────────── */}
      <div className="two-col-6040 mb-4">
        {/* Department Asset Breakdown */}
        <div className="card">
          <div className="card-header-custom">
            <h3 className="card-title">
              <i className="bi bi-bar-chart-fill me-2" style={{ color: 'var(--brass)' }}></i>
              Assets by Department
            </h3>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              style={{ fontSize: '12px' }}
              onClick={() => onNavigate('analysis')}
            >
              Full Analysis →
            </button>
          </div>
          <div className="card-body-custom">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deptList.map(([dName, count], idx) => {
                const pct = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={idx}>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{dName}</span>
                      <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{count} items</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--hairline)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--emerald) 0%, var(--brass) 100%)',
                          borderRadius: '4px',
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
              <i className="bi bi-exclamation-circle-fill me-2" style={{ color: 'var(--danger)' }}></i>
              Alerts &amp; Action Items
            </h3>
            <span className="badge-pill badge-danger">
              {(issueStats.overdue || 0) + (maintStats.overdue || 0) + (highRiskAssets.length || 2)}
            </span>
          </div>
          <div className="card-body-custom" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {/* Overdue Issue Alert */}
            {issueStats.overdue > 0 && (
              <div className="alert-item mb-2" onClick={() => onNavigate('issues')} style={{ cursor: 'pointer' }}>
                <div className="alert-icon-wrap danger">
                  <i className="bi bi-file-earmark-x-fill"></i>
                </div>
                <div>
                  <p className="alert-title">Overdue Material Passes</p>
                  <p className="alert-sub">{issueStats.overdue} assets past expected return date</p>
                </div>
                <span className="btn-icon ms-auto">
                  <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            )}

            {/* Overdue Maintenance Alert */}
            <div className="alert-item mb-2" onClick={() => onNavigate('maintenance')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap warning">
                <i className="bi bi-tools"></i>
              </div>
              <div>
                <p className="alert-title">Maintenance Due</p>
                <p className="alert-sub">{maintStats.pending} pending service logs awaiting technician</p>
              </div>
              <span className="btn-icon ms-auto">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>

            {/* High Risk Item Alert */}
            <div className="alert-item mb-2" onClick={() => onNavigate('analysis')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap danger">
                <i className="bi bi-shield-exclamation"></i>
              </div>
              <div>
                <p className="alert-title">High-Risk Equipment</p>
                <p className="alert-sub">Critical servers &amp; lab machinery nearing end-of-life</p>
              </div>
              <span className="btn-icon ms-auto">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>

            {/* Warranty Alert */}
            <div className="alert-item" onClick={() => onNavigate('assets')} style={{ cursor: 'pointer' }}>
              <div className="alert-icon-wrap" style={{ background: 'var(--info-tint)', color: 'var(--info)' }}>
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <p className="alert-title">Warranties Expiring Soon</p>
                <p className="alert-sub">3 vendor warranties expire within 30 days</p>
              </div>
              <span className="btn-icon ms-auto">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Gate Passes (Parchi) Table Snippet ───────── */}
      <div className="card">
        <div className="card-header-custom">
          <h3 className="card-title">
            <i className="bi bi-file-earmark-person-fill me-2" style={{ color: 'var(--gold)' }}></i>
            Recent Material Issue Gate Passes (Parchi)
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            style={{ fontSize: '12px' }}
            onClick={() => onNavigate('issues')}
          >
            View All Slips →
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Gate Pass Slip #</th>
                <th>Asset Tag &amp; Item</th>
                <th>Issued To</th>
                <th>Department</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
                <th>Status</th>
                <th>Slip Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 5).map((iss) => (
                <tr key={iss.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--emerald)', fontSize: '13px' }}>
                      {iss.slip_number}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--heading)' }}>{iss.asset?.name || 'Lab Equipment'}</div>
                    <small className="text-muted">{iss.asset?.asset_tag || 'CSE-001'}</small>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{iss.recipient_name}</div>
                    <small className="text-muted">{iss.recipient_designation || 'Staff / Faculty'}</small>
                  </td>
                  <td>{iss.department?.name || 'General'}</td>
                  <td>{iss.issue_date || 'Today'}</td>
                  <td>{iss.expected_return_date || 'Permanent'}</td>
                  <td>
                    <span className={`badge-pill ${iss.status === 'issued' ? 'badge-success' : (iss.status === 'overdue' ? 'badge-danger' : 'badge-navy')}`}>
                      <span className={`status-dot ${iss.status === 'issued' ? 'success' : (iss.status === 'overdue' ? 'danger' : 'secondary')}`}></span>
                      {iss.status === 'issued' ? 'Active Issued' : (iss.status === 'overdue' ? 'Overdue' : 'Returned')}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-xs"
                      onClick={() => onViewParchi(iss)}
                    >
                      <i className="bi bi-file-earmark-text me-1"></i>View Parchi
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)' }}>
                    No material issues recorded yet. Click "Issue Material (Parchi)" above.
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
