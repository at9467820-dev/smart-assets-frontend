import React, { useState, useMemo } from 'react';

export function IssuesPage({
  issues = [],
  onOpenNewIssue,
  onOpenScanner,
  onViewParchi,
  onOpenReturnModal,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  const activeIssues = useMemo(() => {
    return issues.filter((i) => i.status === 'issued');
  }, [issues]);

  const overdueIssues = useMemo(() => {
    return issues.filter(
      (i) => i.status === 'issued' && i.expected_return_date && new Date(i.expected_return_date) < now
    );
  }, [issues, now]);

  const returnedIssues = useMemo(() => {
    return issues.filter((i) => ['returned', 'damaged_returned'].includes(i.status));
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      // Tab filter
      if (activeTab === 'active' && i.status !== 'issued') return false;
      if (
        activeTab === 'overdue' &&
        !(i.status === 'issued' && i.expected_return_date && new Date(i.expected_return_date) < now)
      )
        return false;
      if (activeTab === 'returned' && !['returned', 'damaged_returned'].includes(i.status)) return false;

      // Search filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (i.slip_number && i.slip_number.toLowerCase().includes(q)) ||
        (i.recipient_name && i.recipient_name.toLowerCase().includes(q)) ||
        (i.asset?.name && i.asset.name.toLowerCase().includes(q)) ||
        (i.asset?.asset_tag && i.asset.asset_tag.toLowerCase().includes(q)) ||
        (i.department?.name && i.department.name.toLowerCase().includes(q)) ||
        (i.purpose && i.purpose.toLowerCase().includes(q))
      );
    });
  }, [issues, activeTab, searchQuery, now]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-file-earmark-person-fill me-2" style={{ color: 'var(--brass)' }}></i>
            Material Issues &amp; Gate Passes (Parchi)
          </h1>
          <p className="page-subtitle">
            Track material checkouts, issuer timestamps, gate passes (parchi), and return clearances
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onOpenScanner}>
            <i className="bi bi-qr-code-scan me-1"></i>Scan Asset QR
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewIssue}>
            <i className="bi bi-plus-circle-fill me-1"></i>Issue Material / New Gate Pass
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────── */}
      <div className="row g-3 mb-4">
        {/* Active Issues */}
        <div className="col-sm-6 col-xl-3">
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('active')}
          >
            <div
              className="stat-icon"
              style={{
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--emerald)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </div>
            <div>
              <div className="stat-label">Active Issues (Out)</div>
              <div className="stat-value" style={{ color: 'var(--emerald)', fontSize: '24px', fontWeight: 700 }}>
                {activeIssues.length}
              </div>
              <small className="text-muted">Assets currently in custody</small>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="col-sm-6 col-xl-3">
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('overdue')}
          >
            <div
              className="stat-icon"
              style={{
                background: 'rgba(239,68,68,0.12)',
                color: 'var(--danger)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-exclamation-octagon-fill"></i>
            </div>
            <div>
              <div className="stat-label">Overdue Returns</div>
              <div className="stat-value" style={{ color: 'var(--danger)', fontSize: '24px', fontWeight: 700 }}>
                {overdueIssues.length}
              </div>
              <small className="text-muted">Past scheduled due date</small>
            </div>
          </div>
        </div>

        {/* Returned */}
        <div className="col-sm-6 col-xl-3">
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('returned')}
          >
            <div
              className="stat-icon"
              style={{
                background: 'rgba(212,175,55,0.12)',
                color: 'var(--brass)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-check2-all"></i>
            </div>
            <div>
              <div className="stat-label">Returned &amp; Cleared</div>
              <div className="stat-value" style={{ color: 'var(--brass)', fontSize: '24px', fontWeight: 700 }}>
                {returnedIssues.length}
              </div>
              <small className="text-muted">Closed issue slips</small>
            </div>
          </div>
        </div>

        {/* Total Slips */}
        <div className="col-sm-6 col-xl-3">
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('all')}
          >
            <div
              className="stat-icon"
              style={{
                background: 'rgba(18,32,61,0.08)',
                color: 'var(--heading)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="bi bi-receipt"></i>
            </div>
            <div>
              <div className="stat-label">Total Slips (Parchi)</div>
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700 }}>
                {issues.length}
              </div>
              <small className="text-muted">Lifetime issue vouchers</small>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Search Bar ────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom pb-2 pt-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            {/* Tabs */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('all')}
              >
                All Slips ({issues.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('active')}
              >
                <i className="bi bi-arrow-up-right-circle me-1"></i>Active Issued ({activeIssues.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'overdue' ? 'btn-danger' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('overdue')}
              >
                <i className="bi bi-clock-history me-1"></i>Overdue ({overdueIssues.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'returned' ? 'btn-secondary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('returned')}
              >
                <i className="bi bi-check-circle me-1"></i>Returned ({returnedIssues.length})
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: '280px' }}>
              <i
                className="bi bi-search"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-muted)',
                  fontSize: '13px',
                }}
              ></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control-custom"
                style={{ paddingLeft: '34px' }}
                placeholder="Search slip #, person, item…"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Slips Table ─────────────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Gate Pass Slip #</th>
                <th>Asset Tag &amp; Item</th>
                <th>Issued To (Recipient)</th>
                <th>Department</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((iss) => {
                const isOverdue =
                  iss.status === 'issued' && iss.expected_return_date && new Date(iss.expected_return_date) < now;
                const isReturned = ['returned', 'damaged_returned'].includes(iss.status);

                return (
                  <tr key={iss.id}>
                    <td>
                      <span
                        onClick={() => onViewParchi(iss)}
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--emerald)',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {iss.slip_number}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--heading)' }}>
                        {iss.asset?.name || 'Lab Equipment'}
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {iss.asset?.asset_tag || 'CSE-001'}
                      </small>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{iss.recipient_name}</div>
                      <small className="text-muted">
                        {iss.recipient_designation || 'Faculty / Staff'}
                        {iss.recipient_phone ? ` · ${iss.recipient_phone}` : ''}
                      </small>
                    </td>
                    <td>{iss.department?.name || 'General'}</td>
                    <td style={{ fontSize: '12px' }}>{iss.issue_date || 'Today'}</td>
                    <td style={{ fontSize: '12px', color: isOverdue ? 'var(--danger)' : 'inherit', fontWeight: isOverdue ? 700 : 400 }}>
                      {iss.expected_return_date || 'Permanent'}
                    </td>
                    <td>
                      <span
                        className={`badge-pill ${
                          isOverdue
                            ? 'badge-danger'
                            : iss.status === 'issued'
                            ? 'badge-success'
                            : 'badge-navy'
                        }`}
                      >
                        <span
                          className={`status-dot ${
                            isOverdue ? 'danger' : iss.status === 'issued' ? 'success' : 'secondary'
                          }`}
                        ></span>
                        {isOverdue ? 'Overdue' : iss.status === 'issued' ? 'Active Issued' : 'Returned & Cleared'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-xs"
                          onClick={() => onViewParchi(iss)}
                          title="View Official Gate Pass (Parchi)"
                        >
                          <i className="bi bi-file-earmark-text me-1"></i>Parchi
                        </button>
                        {!isReturned && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={() => onOpenReturnModal(iss)}
                            title="Return Asset and Clear Gate Pass"
                          >
                            <i className="bi bi-box-arrow-in-down-left me-1"></i>Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>No material issue slips found</div>
                    <p style={{ fontSize: '13px', margin: '4px 0 14px' }}>
                      Click "Issue Material / New Gate Pass" above to checkout an asset
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={onOpenNewIssue}>
                      + Issue Material (Parchi)
                    </button>
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
