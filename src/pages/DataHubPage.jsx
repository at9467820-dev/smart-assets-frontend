import React, { useState } from 'react';
import { api } from '../api/client';

export function DataHubPage({ assets = [], issues = [], maintenance = [], departments = [], onDataRefreshed }) {
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Trigger browser download for CSVs
  const handleDownloadCsv = (type) => {
    const url = api.getExportUrl(type);
    window.open(url, '_blank');
  };

  // Full JSON System Backup
  const handleDownloadJsonBackup = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      system: 'AssetPulse SAMS 4.0',
      assets_count: assets.length,
      issues_count: issues.length,
      maintenance_count: maintenance.length,
      departments,
      assets,
      issues,
      maintenance,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `assetpulse_system_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Download sample CSV template
  const handleDownloadSampleCsv = () => {
    const sample = [
      'name,category,department_code,location,purchase_cost,purchase_date,warranty_expiry,serial_number,manufacturer',
      'Apple MacBook Pro M3,Computer,CSE,Lab 301,165000,2025-06-15,2028-06-15,MBP-98234,Apple',
      'Tektronix Digital Oscilloscope,Lab Equipment,ECE,Circuits Lab,85000,2025-02-10,2027-02-10,TEK-4102,Tektronix',
      'Cisco Catalyst 9300 Switch,Networking,IT,Server Room 2,120000,2024-11-20,2029-11-20,CSCO-9300-X,Cisco Systems',
      'Epson EB-2250U Projector,Projector,MECH,Seminar Hall B,68000,2025-01-08,2027-01-08,EPS-2250,Epson',
    ].join('\n');

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + sample);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'assetpulse_bulk_import_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Parse CSV File on upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length < 2) continue;

        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });

        // Validation
        const isValid = Boolean(rowObj.name && (rowObj.category || rowObj.department_code));
        rows.push({
          index: i,
          data: rowObj,
          isValid,
          error: !rowObj.name ? 'Asset Name is required' : null,
        });
      }
      setParsedRows(rows);
    };
    reader.readAsText(file);
  };

  // Submit Bulk Import
  const handleExecuteImport = async () => {
    const validPayload = parsedRows.filter((r) => r.isValid).map((r) => r.data);
    if (validPayload.length === 0) return;

    setIsImporting(true);
    try {
      const res = await api.bulkImportAssets(validPayload);
      if (res?.success) {
        setImportResult({
          success: true,
          message: `Successfully imported ${res.imported || validPayload.length} asset(s) with generated QR codes.`,
        });
        setParsedRows([]);
        setCsvFile(null);
        if (onDataRefreshed) onDataRefreshed();
      } else {
        setImportResult({
          success: false,
          message: res?.error || 'Failed to complete import batch.',
        });
      }
    } catch (err) {
      setImportResult({
        success: false,
        message: err.message || 'Error occurred during bulk import.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title">
            <i className="bi bi-database-fill-gear me-2" style={{ color: 'var(--primary)' }}></i>
            Data Hub &amp; Export Center
          </h1>
          <p className="page-subtitle">
            One-click CSV data exports, bulk spreadsheet ingestion, and full JSON system snapshots
          </p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownloadSampleCsv}>
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>Sample CSV Template
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleDownloadJsonBackup}>
            <i className="bi bi-cloud-arrow-down-fill me-1"></i>Full System Backup (JSON)
          </button>
        </div>
      </div>

      {/* ── Export Cards Grid ────────────────────────────────── */}
      <div className="row g-4 mb-5">
        {/* Assets Export */}
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
                <span className="badge badge-indigo">{assets.length} Records</span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                Asset Master Registry
              </h5>
              <p className="m-0 mb-3" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Export all tagged hardware, serial numbers, risk ratings, book valuations, and warranties to CSV.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => handleDownloadCsv('assets')}
            >
              <i className="bi bi-download me-1"></i>Download Assets CSV
            </button>
          </div>
        </div>

        {/* Gate Passes Export */}
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{
                  width: '38px', height: '38px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="bi bi-file-earmark-person fs-5"></i>
                </div>
                <span className="badge badge-secondary">{issues.length} Checkouts</span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                Gate Pass &amp; Checkouts
              </h5>
              <p className="m-0 mb-3" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Export material slips, borrower roll numbers, expected returns, overdue history, and damages.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => handleDownloadCsv('issues')}
            >
              <i className="bi bi-download me-1"></i>Download Gate Passes CSV
            </button>
          </div>
        </div>

        {/* Maintenance Logs Export */}
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{
                  width: '38px', height: '38px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="bi bi-tools fs-5"></i>
                </div>
                <span className="badge badge-secondary">{maintenance.length} Tickets</span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                Maintenance &amp; Repairs
              </h5>
              <p className="m-0 mb-3" style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Export technician work orders, scheduled PM inspection dates, actual repair expenses, and notes.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={() => handleDownloadCsv('maintenance')}
            >
              <i className="bi bi-download me-1"></i>Download Maintenance CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Bulk CSV Ingestion Studio ────────────────────────── */}
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h5 className="m-0 fw-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              <i className="bi bi-cloud-arrow-up-fill text-primary me-2"></i>
              Bulk CSV Asset Importer Studio
            </h5>
            <small style={{ color: 'var(--text-secondary)' }}>
              Upload any institution asset spreadsheet. Auto-generates unique asset tags &amp; QR badges on ingest.
            </small>
          </div>
          {parsedRows.length > 0 && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleExecuteImport}
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Importing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1"></i>
                  Confirm &amp; Import ({parsedRows.filter((r) => r.isValid).length} Assets)
                </>
              )}
            </button>
          )}
        </div>

        {/* Feedback alert */}
        {importResult && (
          <div className={`alert ${importResult.success ? 'alert-success' : 'alert-danger'} mb-3`} style={{ borderRadius: '10px' }}>
            <i className={`bi ${importResult.success ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {importResult.message}
          </div>
        )}

        {/* Upload Dropzone */}
        {parsedRows.length === 0 ? (
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-input)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onClick={() => document.getElementById('csv-file-input')?.click()}
          >
            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--primary-bg)', color: 'var(--primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <i className="bi bi-file-earmark-arrow-up-fill fs-2"></i>
            </div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Click or drag CSV spreadsheet here
            </h5>
            <p className="text-muted m-0 mb-3" style={{ fontSize: '13px' }}>
              Compatible with Microsoft Excel, Google Sheets, and ERP exported CSV files
            </p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleDownloadSampleCsv(); }}>
              <i className="bi bi-download me-1"></i>Download Template (.csv)
            </button>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                File: <span className="badge badge-indigo">{csvFile?.name}</span> ({parsedRows.length} detected rows)
              </span>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => { setParsedRows([]); setCsvFile(null); }}
              >
                <i className="bi bi-trash me-1"></i>Clear &amp; Upload Different File
              </button>
            </div>

            {/* Preview Table */}
            <div className="table-container mb-3" style={{ maxHeight: '320px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Dept Code</th>
                    <th>Location</th>
                    <th>Purchase Cost</th>
                    <th>Serial No</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => (
                    <tr key={row.index} style={{ opacity: row.isValid ? 1 : 0.6 }}>
                      <td className="fw-bold text-muted">{row.index}</td>
                      <td className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                        {row.data.name || <span className="text-danger">[Missing Name]</span>}
                      </td>
                      <td>{row.data.category || 'Other'}</td>
                      <td>
                        <span className="badge badge-indigo">{row.data.department_code || 'GEN'}</span>
                      </td>
                      <td>{row.data.location || 'Campus'}</td>
                      <td>₹{parseFloat(row.data.purchase_cost || 0).toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{row.data.serial_number || 'N/A'}</td>
                      <td>
                        {row.isValid ? (
                          <span className="badge badge-emerald">Ready</span>
                        ) : (
                          <span className="badge badge-danger">Invalid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
