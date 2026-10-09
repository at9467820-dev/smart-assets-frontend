import React from 'react';

export function ParchiModal({ issue, onClose, onReturnClick }) {
  if (!issue) return null;

  const handlePrint = () => {
    window.print();
  };

  const isOverdue =
    issue.is_overdue ||
    (issue.status === 'issued' && issue.expected_return_date && new Date() > new Date(issue.expected_return_date));

  const recipientName = issue.recipient_name || issue.issued_to_name || 'N/A';
  const assetTag = issue.asset?.asset_tag || issue.asset_tag || 'CSE-001';
  const assetName = issue.asset?.name || issue.asset_name || 'Equipment Unit';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-in" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
        {/* Controls Toolbar (hidden during print) */}
        <div
          className="d-flex align-items-center justify-content-between p-3"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--hairline)',
            background: 'var(--bg-warm)',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="badge-pill badge-emerald">
              <i className="bi bi-shield-check me-1"></i>Official Gate Pass Voucher
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--emerald)' }}>
              {issue.slip_number}
            </span>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i>Print Parchi (A4)
            </button>
            {issue.status === 'issued' && onReturnClick && (
              <button
                type="button"
                className="btn btn-brass btn-sm"
                onClick={() => {
                  onClose();
                  onReturnClick(issue);
                }}
              >
                <i className="bi bi-box-arrow-in-down-left me-1"></i>Return Asset
              </button>
            )}
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              style={{ border: 'none', background: 'transparent' }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* ── Official Printable Parchi Container ── */}
        <div className="parchi-print-container" style={{ padding: '28px', backgroundColor: '#ffffff', color: '#0f172a' }}>
          <div style={{ border: '2.5px solid #091a17', padding: '24px', borderRadius: '4px' }}>
            {/* Institution Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2px solid #091a17',
                paddingBottom: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>
                  AssetPulse Smart Asset Management System (SAMS)
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#091a17', margin: '4px 0 2px', textTransform: 'uppercase' }}>
                  Official Material Issue Slip &amp; Gate Pass (Parchi)
                </h2>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Authorized Institutional Property Custody &amp; Gate Security Clearance Voucher
                </div>
              </div>

              <div style={{ textAlign: 'right', background: '#f8fafc', padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Gate Pass No.
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#091a17' }}>
                  {issue.slip_number}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>
                  {issue.gate_pass_type?.toUpperCase() || 'RETURNABLE'}
                </div>
              </div>
            </div>

            {/* Status & Priority Ribbon */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '8px 14px',
                borderRadius: '4px',
                marginBottom: '18px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Issue Classification: </span>
                <strong style={{ color: '#091a17' }}>
                  {issue.gate_pass_type === 'returnable'
                    ? 'Returnable Equipment (Temporary Handover)'
                    : 'Non-Returnable / Consumable Item'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Current Status: </span>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '11px',
                    backgroundColor:
                      issue.status === 'returned' ? '#dcfce7' : isOverdue ? '#fee2e2' : '#e0f2fe',
                    color: issue.status === 'returned' ? '#166534' : isOverdue ? '#991b1b' : '#075985',
                  }}
                >
                  {issue.status === 'returned'
                    ? 'RETURNED & VERIFIED'
                    : isOverdue
                    ? 'OVERDUE RETURN'
                    : 'ACTIVE ISSUED (OUT)'}
                </span>
              </div>
            </div>

            {/* 2-Column Grid: Recipient Info vs Material Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '18px' }}>
              {/* Left Column: Recipient & Authorization */}
              <div>
                <div
                  style={{
                    background: '#091a17',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '5px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  1. Recipient / Bearer Custody Details
                </div>

                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, width: '42%', borderBottom: '1px solid #e2e8f0' }}>
                        Issued To (Bearer):
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 800, color: '#091a17', borderBottom: '1px solid #e2e8f0' }}>
                        {recipientName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        ID / Roll Number:
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        {issue.issued_to_id_number || issue.recipient_id || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Department / Class:
                      </td>
                      <td style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0' }}>
                        {issue.department?.name || issue.issued_to_dept || 'General Dept'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Contact Phone:
                      </td>
                      <td style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0' }}>
                        {issue.issued_to_phone || issue.recipient_phone || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Authorized Issuer:
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 700, color: '#059669', borderBottom: '1px solid #e2e8f0' }}>
                        {issue.issuer_name || 'Administrator'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Column: Asset Details */}
              <div>
                <div
                  style={{
                    background: '#091a17',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '5px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  2. Equipment &amp; Material Specifications
                </div>

                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, width: '40%', borderBottom: '1px solid #e2e8f0' }}>
                        Asset Tag:
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 800, fontFamily: 'monospace', color: '#091a17', borderBottom: '1px solid #e2e8f0' }}>
                        {assetTag}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Item Name:
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 700, color: '#091a17', borderBottom: '1px solid #e2e8f0' }}>
                        {assetName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Handover Condition:
                      </td>
                      <td style={{ padding: '4px 6px', color: '#059669', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        {issue.issue_condition || 'Good / Functional'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                        Purpose of Issue:
                      </td>
                      <td style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0' }}>
                        {issue.purpose || 'Academic & Lab Assignment'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timestamps Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '10px 14px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '11.5px',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Date &amp; Time Issued:</span>
                <strong style={{ color: '#091a17' }}>{issue.issue_date || '09 Oct 2026, 11:30 AM'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Scheduled Return Date:</span>
                <strong style={{ color: isOverdue ? '#dc2626' : '#091a17' }}>
                  {issue.expected_return_date || 'Permanent Deployment'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Actual Returned Timestamp:</span>
                <strong style={{ color: '#059669' }}>{issue.return_date || '— (Active in Custody)'}</strong>
              </div>
            </div>

            {/* Terms and Security Notice */}
            <div
              style={{
                background: '#fdfbf7',
                border: '1px solid #fde68a',
                padding: '10px 14px',
                borderRadius: '4px',
                marginBottom: '22px',
                fontSize: '10.5px',
                color: '#78350f',
                lineHeight: 1.4,
              }}
            >
              <strong>TERMS &amp; GATE CLEARANCE NOTICE:</strong> The bearer agrees to take full custodial
              responsibility for the above-listed item(s). Equipment must be returned on or before the due date in the
              same physical condition. Any loss, component damage, or overdue delay will be charged to the recipient's
              department account. Security officers are authorized to inspect and verify this slip at campus exit/entry
              points.
            </div>

            {/* 3-Part Signatures Block */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', paddingTop: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '40px', borderBottom: '1.5px solid #091a17', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#091a17' }}>
                  Issued By (Asset Custodian)
                </div>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>Authorized Staff Signature</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '40px', borderBottom: '1.5px solid #091a17', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#091a17' }}>
                  Bearer's Signature &amp; CNIC
                </div>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>Custody Acceptance Confirmation</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '40px', borderBottom: '1.5px solid #091a17', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#091a17' }}>
                  Campus Gate Security Stamp
                </div>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>Exit / Return Verification</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
