/**
 * AssetPulse — Chart.js Dashboard Charts
 */
document.addEventListener('DOMContentLoaded', function () {

  const NAVY   = '#12203D';
  const BRASS  = '#B98A2E';
  const SUCCESS= '#3F7D58';
  const DANGER = '#A94A34';
  const WARNING= '#C47D2A';
  const MUTED  = '#5B6273';
  const HAIRLINE='#DEE1E8';

  const palette = [NAVY, BRASS, SUCCESS, DANGER, WARNING, '#1E6FAB', '#7B5EA7', '#2C7873'];

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = MUTED;

  // ── Department Bar Chart ─────────────────────────────────
  const deptCtx = document.getElementById('dept-chart');
  if (deptCtx) {
    const labels = JSON.parse(deptCtx.dataset.labels || '[]');
    const values = JSON.parse(deptCtx.dataset.values || '[]');

    new Chart(deptCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Assets',
          data: values,
          backgroundColor: palette.slice(0, labels.length),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 32,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: NAVY,
            padding: 10,
            callbacks: {
              label: ctx => `  ${ctx.parsed.y} assets`,
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: HAIRLINE },
            border: { display: false },
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  // ── Status Donut Chart ───────────────────────────────────
  const statusCtx = document.getElementById('status-chart');
  if (statusCtx) {
    const labels = JSON.parse(statusCtx.dataset.labels || '[]');
    const values = JSON.parse(statusCtx.dataset.values || '[]');
    const colors  = [SUCCESS, WARNING, DANGER, MUTED];

    new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 }
          },
          tooltip: { backgroundColor: NAVY, padding: 10 }
        }
      }
    });
  }

  // ── Maintenance Trend Line ───────────────────────────────
  const trendCtx = document.getElementById('maintenance-trend-chart');
  if (trendCtx) {
    const labels = JSON.parse(trendCtx.dataset.labels || '[]');
    const values = JSON.parse(trendCtx.dataset.values || '[]');

    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Maintenance Requests',
          data: values,
          borderColor: BRASS,
          backgroundColor: 'rgba(185,138,46,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: BRASS,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: NAVY, padding: 10 }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { grid: { color: HAIRLINE }, border: { display: false }, ticks: { precision: 0 } }
        }
      }
    });
  }

  // ── Budget vs Actual Bar Chart ───────────────────────────
  const budgetCtx = document.getElementById('budget-chart');
  if (budgetCtx) {
    const labels    = JSON.parse(budgetCtx.dataset.labels    || '[]');
    const estimated = JSON.parse(budgetCtx.dataset.estimated || '[]');
    const actual    = JSON.parse(budgetCtx.dataset.actual    || '[]');

    new Chart(budgetCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Estimated (₹)',
            data: estimated,
            backgroundColor: 'rgba(18,32,61,0.75)',
            borderRadius: 4,
            barThickness: 20,
          },
          {
            label: 'Actual Spent (₹)',
            data: actual,
            backgroundColor: BRASS,
            borderRadius: 4,
            barThickness: 20,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } },
          tooltip: {
            backgroundColor: NAVY,
            padding: 10,
            callbacks: {
              label: ctx => `  ₹${ctx.parsed.y.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: {
            grid: { color: HAIRLINE },
            border: { display: false },
            ticks: {
              callback: v => '₹' + (v / 1000 > 0 ? (v/1000).toFixed(0) + 'k' : v)
            }
          }
        }
      }
    });
  }

  // ── Dept Utilization Chart (Analysis page) ───────────────
  const utilCtx = document.getElementById('utilization-chart');
  if (utilCtx) {
    const labels = JSON.parse(utilCtx.dataset.labels || '[]');
    const active = JSON.parse(utilCtx.dataset.active || '[]');
    const repair = JSON.parse(utilCtx.dataset.repair || '[]');
    const dmgd   = JSON.parse(utilCtx.dataset.damaged || '[]');
    const retd   = JSON.parse(utilCtx.dataset.retired || '[]');

    new Chart(utilCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Active',       data: active, backgroundColor: SUCCESS, borderRadius: 4, stack: 's1' },
          { label: 'Under Repair', data: repair, backgroundColor: WARNING, borderRadius: 4, stack: 's1' },
          { label: 'Damaged',      data: dmgd,   backgroundColor: DANGER,  borderRadius: 4, stack: 's1' },
          { label: 'Retired',      data: retd,   backgroundColor: MUTED,   borderRadius: 4, stack: 's1' },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } },
          tooltip: { backgroundColor: NAVY, padding: 10 }
        },
        scales: {
          x: { stacked: true, grid: { display: false }, border: { display: false } },
          y: { stacked: true, grid: { color: HAIRLINE }, border: { display: false }, ticks: { precision: 0 } }
        }
      }
    });
  }

});
