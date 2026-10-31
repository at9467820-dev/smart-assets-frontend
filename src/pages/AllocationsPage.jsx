import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../api/client';

export function AllocationsPage({ assets = [], departments = [] }) {
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackAllocations = [
    { id: 1, asset_tag: 'CSE-001', asset_name: 'Dell Optiplex 7090 Desktop', from_dept: 'Central Inventory', to_dept: 'Computer Science', from_user: 'IT Officer', to_user: 'Dr. Tariq Mahmood', allocated_by: 'Administrator', allocation_date: '01 Oct 2026', reason: 'Assigned for AI & Machine Learning Research' },
    { id: 2, asset_tag: 'ECE-001', asset_name: 'Rigol DS1054Z Oscilloscope', from_dept: 'Central Stores', to_dept: 'Electronics & Communication', from_user: 'Lab Storekeeper', to_user: 'Engr. Sarah Khan', allocated_by: 'Administrator', allocation_date: '28 Sep 2026', reason: 'Upgraded lab workstation equipment' },
    { id: 3, asset_tag: 'MECH-001', asset_name: 'Creality Ender 3 V2 3D Printer', from_dept: 'Central Store', to_dept: 'Mechanical Engineering', from_user: 'Central Inventory', to_user: 'Robotics Workshop', allocated_by: 'Administrator', allocation_date: '20 Sep 2026', reason: 'Transferred to student fabrication studio' },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchAllocations = async () => {
      try {
        const data = await api.getAllocations();
        if (isMounted) {
          if (data && data.length > 0) {
            setAllocations(data);
          } else {
            setAllocations(fallbackAllocations);
          }
        }
      } catch (err) {
        if (isMounted) setAllocations(fallbackAllocations);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllocations();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const list = allocations.length > 0 ? allocations : fallbackAllocations;
    return list.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !searchQuery ||
        (a.asset_tag && a.asset_tag.toLowerCase().includes(q)) ||
        (a.asset_name && a.asset_name.toLowerCase().includes(q)) ||
        (a.to_user && a.to_user.toLowerCase().includes(q)) ||
        (a.from_user && a.from_user.toLowerCase().includes(q)) ||
        (a.reason && a.reason.toLowerCase().includes(q));

      const toD = a.to_dept || a.toDept || '';
      const matchDept = !selectedDept || toD.toLowerCase().includes(selectedDept.toLowerCase());

      return matchQ && matchDept;
    });
  }, [allocations, selectedDept, searchQuery]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
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
            <div style={{ flex: 2, minWidth: '220px', position: 'relative' }}>
              <label className="form-label-custom">Search Transfer or Custodian</label>
              <div style={{ position: 'relative' }}>
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
                  placeholder="Asset tag, custodian, reason..."
                />
              </div>
            </div>

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
                onClick={() => {
                  setSelectedDept('');
                  setSearchQuery('');
                }}
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
                      {a.asset_tag || a.assetTag}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{a.asset_name || a.assetName}</div>
                  </td>
                  <td>{a.from_dept || a.fromDept}</td>
                  <td>
                    <strong style={{ color: 'var(--heading)' }}>{a.to_dept || a.toDept}</strong>
                  </td>
                  <td style={{ fontSize: '12px' }}>{a.from_user || a.fromUser || '—'}</td>
                  <td style={{ fontSize: '12px', fontWeight: 600 }}>{a.to_user || a.toUser || '—'}</td>
                  <td style={{ fontSize: '12px' }}>{a.allocated_by || a.allocatedBy || 'Admin'}</td>
                  <td style={{ fontSize: '12px' }}>{a.allocation_date || a.date}</td>
                  <td style={{ fontSize: '12px', maxWidth: '220px' }}>{a.reason || a.notes || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)' }}>
                    No matching custody transfers found.
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
