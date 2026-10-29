import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../api/client';

export function MaintenanceCalendarPage({ maintenance = [], onOpenNewMaintenance }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const events = await api.getMaintenanceSchedule();
        if (events && events.length > 0) {
          setScheduleEvents(events);
        } else {
          // Generate realistic events from maintenance logs
          const generated = maintenance.map((m) => ({
            id: `m-${m.id}`,
            category: 'maintenance',
            title: `Service: ${m.asset_tag}`,
            date: m.scheduled_date || m.request_date || new Date().toISOString().split('T')[0],
            status: m.status,
            priority: m.priority || 'medium',
            description: m.issue_description,
            asset_name: m.asset_name,
            is_overdue: m.status !== 'resolved' && new Date(m.scheduled_date || m.request_date) < new Date(),
          }));
          setScheduleEvents(generated);
        }
      } catch (err) {
        console.warn('Failed to load schedule events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [maintenance]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayEvents(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayEvents(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayEvents(null);
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Convert Sunday (0) to Monday-based (0 = Mon, 6 = Sun)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];

    // Previous month filler days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDateStr = new Date(year, month - 1, d).toISOString().split('T')[0];
      days.push({
        dayNumber: d,
        dateStr: prevDateStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr: dateStr,
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete rows of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDateStr = new Date(year, month + 1, i).toISOString().split('T')[0];
      days.push({
        dayNumber: i,
        dateStr: nextDateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Map events to dateStr
  const eventsByDate = useMemo(() => {
    const map = {};
    scheduleEvents.forEach((ev) => {
      if (!ev.date) return;
      const dateKey = ev.date.split('T')[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(ev);
    });
    return map;
  }, [scheduleEvents]);

  const todayStr = new Date().toISOString().split('T')[0];

  const totalThisMonth = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return scheduleEvents.filter((e) => e.date && e.date.startsWith(prefix)).length;
  }, [scheduleEvents, year, month]);

  const overdueCount = useMemo(() => {
    return scheduleEvents.filter((e) => e.is_overdue).length;
  }, [scheduleEvents]);

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title">
            <i className="bi bi-calendar-check-fill me-2" style={{ color: 'var(--primary)' }}></i>
            Maintenance &amp; Service Calendar
          </h1>
          <p className="page-subtitle">
            Visual preventive maintenance schedule, inspection timelines, and warranty milestones
          </p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenNewMaintenance && onOpenNewMaintenance(null)}>
            <i className="bi bi-plus-circle-fill me-1"></i>Schedule New Service
          </button>
        </div>
      </div>

      {/* ── Metrics Strip ───────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="glass-card p-3">
            <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px' }}>Current Month Tasks</small>
            <h4 className="m-0 fw-bold" style={{ color: 'var(--primary-bright)' }}>{totalThisMonth} Events</h4>
            <small className="text-muted" style={{ fontSize: '11px' }}>Scheduled for {monthNames[month]}</small>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card p-3">
            <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px' }}>Overdue Attention</small>
            <h4 className="m-0 fw-bold text-danger">{overdueCount} Critical</h4>
            <small className="text-muted" style={{ fontSize: '11px' }}>Past scheduled maintenance date</small>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card p-3">
            <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px' }}>Preventive Rate</small>
            <h4 className="m-0 fw-bold text-success">94.2%</h4>
            <small className="text-muted" style={{ fontSize: '11px' }}>On-time resolution target</small>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card p-3">
            <small className="text-secondary d-block mb-1 text-uppercase" style={{ fontSize: '11px' }}>Active Technicians</small>
            <h4 className="m-0 fw-bold" style={{ color: 'var(--cyan)' }}>4 Teams</h4>
            <small className="text-muted" style={{ fontSize: '11px' }}>Electrical &bull; IT &bull; HVAC &bull; Lab</small>
          </div>
        </div>
      </div>

      {/* ── Calendar Controls Bar ────────────────────────────── */}
      <div className="glass-card p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleNextMonth}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleToday}>
            Today
          </button>
          <h4 className="m-0 ms-2 fw-bold" style={{ fontSize: '17px', color: 'var(--text-primary)' }}>
            {monthNames[month]} {year}
          </h4>
        </div>

        {/* Legend */}
        <div className="d-flex gap-3 align-items-center flex-wrap" style={{ fontSize: '12px' }}>
          <span className="d-flex align-items-center gap-1">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></span>
            Overdue
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)' }}></span>
            Scheduled
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }}></span>
            Warranty End
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
            Resolved
          </span>
        </div>
      </div>

      {/* ── Calendar Grid ───────────────────────────────────── */}
      <div className="glass-card p-3 mb-4">
        {/* Days of Week Header */}
        <div className="d-grid text-center mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)' }}>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* Calendar Cells */}
        <div className="calendar-month-grid">
          {calendarDays.map((cell, idx) => {
            const dayEvents = eventsByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === todayStr;
            const isSelected = selectedDayEvents?.dateStr === cell.dateStr;

            return (
              <div
                key={idx}
                className={`calendar-cell ${isToday ? 'today' : ''}`}
                style={{
                  opacity: cell.isCurrentMonth ? 1 : 0.35,
                  cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                  borderColor: isSelected ? 'var(--primary)' : undefined,
                }}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    setSelectedDayEvents({ dateStr: cell.dateStr, events: dayEvents });
                  }
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isToday ? 800 : 600,
                      color: isToday ? 'var(--primary-bright)' : 'var(--text-primary)',
                      background: isToday ? 'var(--primary-bg)' : 'transparent',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.dayNumber}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '10px', padding: '1px 5px' }}>
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'hidden' }}>
                  {dayEvents.slice(0, 3).map((ev) => {
                    let chipClass = 'calendar-chip-warning';
                    if (ev.is_overdue) chipClass = 'calendar-chip-danger';
                    else if (ev.category === 'warranty') chipClass = 'calendar-chip-info';
                    else if (ev.status === 'resolved') chipClass = 'calendar-chip-success';

                    return (
                      <div key={ev.id} className={`calendar-chip ${chipClass}`} title={ev.title}>
                        <i className={`bi ${ev.category === 'warranty' ? 'bi-shield-check' : 'bi-tools'}`} style={{ fontSize: '10px' }}></i>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <small style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      +{dayEvents.length - 3} more
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Selected Date Event Drawer / Panel ───────────────── */}
      {selectedDayEvents && (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 fw-bold" style={{ fontSize: '15px' }}>
              <i className="bi bi-clock-history text-primary me-2"></i>
              Scheduled Tasks on {selectedDayEvents.dateStr}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setSelectedDayEvents(null)}
              style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="row g-3">
            {selectedDayEvents.events.map((ev) => (
              <div key={ev.id} className="col-md-6">
                <div className="glass-card p-3 h-100" style={{ borderLeft: `4px solid ${ev.is_overdue ? 'var(--danger)' : 'var(--primary)'}` }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold" style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {ev.title}
                    </span>
                    <span className={`badge ${ev.is_overdue ? 'badge-danger' : 'badge-indigo'}`}>
                      {ev.status?.toUpperCase() || 'SCHEDULED'}
                    </span>
                  </div>
                  <p className="m-0 mb-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {ev.description || 'Routine preventive maintenance inspection and diagnostics.'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Asset: <b>{ev.asset_name}</b></span>
                    <span>Priority: <b className="text-uppercase">{ev.priority}</b></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
