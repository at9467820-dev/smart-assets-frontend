import React, { useState, useMemo } from 'react';

export function DepreciationSimulatorPage({ assets = [], departments = [] }) {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || 'custom');
  const [cost, setCost] = useState(75000);
  const [lifespan, setLifespan] = useState(5); // years
  const [salvagePercent, setSalvagePercent] = useState(10); // 10%
  const [method, setMethod] = useState('straight_line'); // 'straight_line', 'ddb', 'syd'

  // When selecting an asset, prepopulate inputs
  const handleAssetSelect = (id) => {
    setSelectedAssetId(id);
    if (id === 'custom') {
      setCost(75000);
      setLifespan(5);
    } else {
      const a = assets.find((item) => String(item.id) === String(id));
      if (a) {
        setCost(parseFloat(a.purchase_cost) || 50000);
        // Estimate lifespan based on category
        const lifespanMap = {
          Computer: 4,
          Projector: 5,
          Networking: 6,
          'Lab Equipment': 8,
          Electrical: 7,
          HVAC: 10,
          Furniture: 10,
          Other: 5,
        };
        setLifespan(lifespanMap[a.category] || 5);
      }
    }
  };

  const salvageValue = useMemo(() => {
    return Math.round(cost * (salvagePercent / 100));
  }, [cost, salvagePercent]);

  // Compute Year-by-Year Schedule
  const schedule = useMemo(() => {
    const rows = [];
    const depreciableBase = cost - salvageValue;
    let currentBook = cost;
    let accumulated = 0;

    if (method === 'straight_line') {
      const annualExpense = depreciableBase / lifespan;
      for (let y = 1; y <= lifespan; y++) {
        const startVal = currentBook;
        let expense = annualExpense;
        if (startVal - expense < salvageValue) {
          expense = Math.max(0, startVal - salvageValue);
        }
        accumulated += expense;
        currentBook = Math.max(salvageValue, startVal - expense);
        rows.push({
          year: y,
          beginningValue: Math.round(startVal),
          depreciation: Math.round(expense),
          accumulated: Math.round(accumulated),
          endingValue: Math.round(currentBook),
        });
      }
    } else if (method === 'ddb') {
      const rate = (2 / lifespan);
      for (let y = 1; y <= lifespan; y++) {
        const startVal = currentBook;
        let expense = startVal * rate;
        if (startVal - expense < salvageValue) {
          expense = Math.max(0, startVal - salvageValue);
        }
        accumulated += expense;
        currentBook = Math.max(salvageValue, startVal - expense);
        rows.push({
          year: y,
          beginningValue: Math.round(startVal),
          depreciation: Math.round(expense),
          accumulated: Math.round(accumulated),
          endingValue: Math.round(currentBook),
        });
      }
    } else if (method === 'syd') {
      const sydSum = (lifespan * (lifespan + 1)) / 2;
      for (let y = 1; y <= lifespan; y++) {
        const remainingLife = lifespan - y + 1;
        const fraction = remainingLife / sydSum;
        const startVal = currentBook;
        let expense = depreciableBase * fraction;
        if (startVal - expense < salvageValue) {
          expense = Math.max(0, startVal - salvageValue);
        }
        accumulated += expense;
        currentBook = Math.max(salvageValue, startVal - expense);
        rows.push({
          year: y,
          beginningValue: Math.round(startVal),
          depreciation: Math.round(expense),
          accumulated: Math.round(accumulated),
          endingValue: Math.round(currentBook),
        });
      }
    }

    return rows;
  }, [cost, lifespan, salvageValue, method]);

  const exportScheduleCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Year,Beginning Book Value,Depreciation Expense,Accumulated Depreciation,Ending Book Value\n';
    schedule.forEach((r) => {
      csvContent += `${r.year},${r.beginningValue},${r.depreciation},${r.accumulated},${r.endingValue}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `depreciation_schedule_${method}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const optimalReplacementYear = Math.max(1, Math.round(lifespan * 0.75));

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title">
            <i className="bi bi-calculator me-2" style={{ color: 'var(--primary)' }}></i>
            Lifecycle &amp; Depreciation Simulator
          </h1>
          <p className="page-subtitle">
            Financial forecasting model: Straight-Line, DDB &amp; Sum-of-Years' Digits amortization
          </p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={exportScheduleCsv}>
            <i className="bi bi-file-earmark-arrow-down me-1"></i>Export Schedule CSV
          </button>
        </div>
      </div>

      {/* ── Configuration & Financial KPIs ─────────────────── */}
      <div className="row g-4 mb-4">
        {/* Controls Column */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
              <i className="bi bi-sliders text-primary"></i> Simulation Parameters
            </h5>

            {/* Select Asset */}
            <div className="mb-3">
              <label className="form-label">Asset Preset</label>
              <select
                className="form-select"
                value={selectedAssetId}
                onChange={(e) => handleAssetSelect(e.target.value)}
              >
                <option value="custom">Manual Custom Simulator</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.asset_tag}] {a.name} (₹{parseFloat(a.purchase_cost || 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Cost */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label">Initial Acquisition Cost</label>
                <span className="fw-bold" style={{ color: 'var(--primary)' }}>₹{cost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range w-100"
                min="5000"
                max="500000"
                step="5000"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>

            {/* Useful Lifespan */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label">Useful Lifespan (Years)</label>
                <span className="fw-bold" style={{ color: 'var(--primary)' }}>{lifespan} Years</span>
              </div>
              <input
                type="range"
                className="form-range w-100"
                min="2"
                max="15"
                step="1"
                value={lifespan}
                onChange={(e) => setLifespan(Number(e.target.value))}
              />
            </div>

            {/* Salvage / Scrap % */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label">Salvage / Scrap Value</label>
                <span className="fw-bold text-warning">{salvagePercent}% (₹{salvageValue.toLocaleString()})</span>
              </div>
              <input
                type="range"
                className="form-range w-100"
                min="0"
                max="30"
                step="5"
                value={salvagePercent}
                onChange={(e) => setSalvagePercent(Number(e.target.value))}
              />
            </div>

            {/* Depreciation Method */}
            <div className="mb-2">
              <label className="form-label">Calculation Standard</label>
              <div className="d-flex flex-column gap-2">
                {[
                  { id: 'straight_line', label: 'Straight-Line (Equal Annual Decay)' },
                  { id: 'ddb', label: 'Double Declining Balance (Accelerated 200%)' },
                  { id: 'syd', label: "Sum-of-the-Years' Digits (Weighted SYD)" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`btn text-start ${method === m.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 12px', fontSize: '12.5px' }}
                    onClick={() => setMethod(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Highlights & Visual Decay Chart */}
        <div className="col-lg-8">
          {/* Key Metric Tiles */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="glass-card p-3">
                <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>Initial Cost</small>
                <h4 className="m-0 fw-bold" style={{ color: 'var(--text-primary)' }}>₹{cost.toLocaleString()}</h4>
                <small className="text-muted" style={{ fontSize: '11px' }}>100% Capital Outlay</small>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="glass-card p-3">
                <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>Residual Scrap</small>
                <h4 className="m-0 fw-bold" style={{ color: 'var(--amber)' }}>₹{salvageValue.toLocaleString()}</h4>
                <small className="text-muted" style={{ fontSize: '11px' }}>{salvagePercent}% Terminal Floor</small>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="glass-card p-3">
                <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>Year 1 Write-Off</small>
                <h4 className="m-0 fw-bold" style={{ color: 'var(--primary)' }}>
                  ₹{(schedule[0]?.depreciation || 0).toLocaleString()}
                </h4>
                <small className="text-muted" style={{ fontSize: '11px' }}>
                  {Math.round(((schedule[0]?.depreciation || 0) / cost) * 100)}% First Year
                </small>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="glass-card p-3">
                <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>Optimal Replace</small>
                <h4 className="m-0 fw-bold" style={{ color: 'var(--emerald)' }}>Year {optimalReplacementYear}</h4>
                <small className="text-muted" style={{ fontSize: '11px' }}>Cost vs Overhaul Cross</small>
              </div>
            </div>
          </div>

          {/* Visual Amortization Decay Bars */}
          <div className="glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 fw-bold" style={{ fontSize: '15px' }}>
                <i className="bi bi-graph-down text-primary me-2"></i> Book Value Decay Trajectory
              </h5>
              <div className="d-flex gap-3" style={{ fontSize: '11.5px' }}>
                <span className="d-flex align-items-center gap-1">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }}></span>
                  Book Value
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(239, 68, 68, 0.4)' }}></span>
                  Accumulated Depreciation
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              {schedule.map((row) => {
                const bookPct = Math.round((row.endingValue / cost) * 100);
                const deprPct = 100 - bookPct;
                return (
                  <div key={row.year} className="d-flex align-items-center gap-3">
                    <span style={{ width: '55px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Year {row.year}
                    </span>
                    <div style={{ flex: 1, height: '26px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                      <div
                        style={{
                          width: `${bookPct}%`,
                          background: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          transition: 'width 0.3s ease',
                        }}
                      >
                        {bookPct > 15 ? `₹${row.endingValue.toLocaleString()} (${bookPct}%)` : ''}
                      </div>
                      <div
                        style={{
                          width: `${deprPct}%`,
                          background: 'rgba(239, 68, 68, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '8px',
                          color: 'var(--danger-bright)',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {deprPct > 20 ? `Depr: ${deprPct}%` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Year-by-Year Schedule Table ─────────────────────── */}
      <div className="glass-card">
        <div className="glass-card-header">
          <h5 className="m-0 fw-bold" style={{ fontSize: '15px' }}>
            <i className="bi bi-table text-primary me-2"></i> Depreciation Amortization Schedule
          </h5>
          <span className="badge badge-indigo">
            Standard: {method.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timeline Period</th>
                <th>Beginning Book Value</th>
                <th>Annual Depreciation Charge</th>
                <th>Cumulative Accumulated</th>
                <th>Ending Net Asset Value</th>
                <th>Retention %</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((r) => (
                <tr key={r.year}>
                  <td className="fw-bold" style={{ color: 'var(--primary-bright)' }}>Year {r.year}</td>
                  <td>₹{r.beginningValue.toLocaleString()}</td>
                  <td className="text-danger fw-semibold">- ₹{r.depreciation.toLocaleString()}</td>
                  <td style={{ color: 'var(--amber)' }}>₹{r.accumulated.toLocaleString()}</td>
                  <td className="fw-bold" style={{ color: 'var(--emerald)' }}>₹{r.endingValue.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-indigo">
                      {Math.round((r.endingValue / cost) * 100)}%
                    </span>
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
