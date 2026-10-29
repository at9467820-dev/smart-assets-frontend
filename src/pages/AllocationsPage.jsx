import React, { useState, useMemo } from 'react';

export function AllocationsPage({ assets = [], departments = [] }) {
  const [selectedDept, setSelectedDept] = useState('');

  const sampleAllocations = [
    { id: 1, assetTag: 'CSE-001', assetName: 'Dell Precision Tower 7920', fromDept: 'General IT Store', toDept: 'Computer Science', fromUser: 'IT Officer', toUser: 'Dr. Tariq Mahmood', allocatedBy: 'Administrator', date: '01 Oct 2026', reason: 'Assigned for AI & Machine Learning Research' },
    { id: 2, assetTag: 'EE-002', assetName: 'Tektronix Mixed Domain Oscilloscope', fromDept: 'Central Engineering', toDept: 'Electrical Engineering', fromUser: 'Lab Storekeeper', toUser: 'Engr. Sarah Khan', allocatedBy: 'Administrator', date: '28 Sep 2026', reason: 'Upgraded lab workstation equipment' },
    { id: 3, assetTag: 'ME-003', assetName: '3D Printer Ultimaker S5', fromDept: 'Mechanical Eng.', toDept: 'Mechanical Eng.', fromUser: 'Dr. A. Rasheed', toUser: 'Robotics Workshop', allocatedBy: 'Lab Incharge', date: '20 Sep 2026', reason: 'Transferred to student fabrication studio' },
  ];

  const filtered = useMemo(() => {
    if (!selectedDept) return sampleAllocations;
    return sampleAllocations.filter((a) => a.toDept.toLowerCase().includes(selectedDept.toLowerCase()));
  }, [selectedDept]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="bi bi-arrow-left-right me-2 text-primary"></i>
            Allocation &amp; Custody History
          </h1>
          <p className="page-subtitle">Track every equipment handover, department transfer, and custodian change</p>
        </div>
      </div>

      {/* ── Filter ──────────────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-body-custom">
          <div className="d-flex gap-2 align-items-end flex-wrap">
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label-custom">Filter by Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="form-control-custom"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setSelectedDept('')}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Allocations Table ───────────────────────────────── */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Asset Tag &amp; Item</th>
                <th>From Dept.</th>
                <th>To Dept.</th>
                <th>From Custodian</th>
                <th>To Custodian</th>
                <th>Allocated By</th>
                <th>Transfer Date</th>
                <th>Reason / Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--emerald)', fontFamily: 'monospace' }}>
                      {a.assetTag}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{a.assetName}</div>
                  </td>
                  <td>{a.fromDept}</td>
                  <td>
                    <strong style={{ color: 'var(--heading)' }}>{a.toDept}</strong>
                  </td>
                  <td style={{ fontSize: '12px' }}>{a.fromUser}</td>
                  <td style={{ fontSize: '12px', fontWeight: 600 }}>{a.toUser}</td>
                  <td style={{ fontSize: '12px' }}>{a.allocatedBy}</td>
                  <td style={{ fontSize: '12px' }}>{a.date}</td>
                  <td style={{ fontSize: '12px', maxWidth: '200px' }}>{a.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
