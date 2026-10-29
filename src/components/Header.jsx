import React, { useState, useEffect } from 'react';

export function Header({
  theme,
  setTheme,
  toggleTheme,
  unreadCount = 0,
  onOpenNotifications,
  onOpenLabelStudio,
  onOpenScanner,
  onOpenCmdPalette,
  onOpenAuth,
  onSearch,
}) {
  const [query, setQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-GB', options));
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="sidebar-toggle"
        id="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Breadcrumb & Date */}
      <div className="topbar-greeting">
        <p className="topbar-greeting-text">
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>System Console</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>/</span>
          <span>Overview</span>
        </p>
        <p className="topbar-date">{currentDate} &bull; Main Campus</p>
      </div>

      <div className="topbar-actions">
        {/* Global Search */}
        <div className="search-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            id="global-search"
            className="search-input"
            placeholder="Search tags, assets... (Ctrl+K)"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (onOpenCmdPalette) onOpenCmdPalette();
              }
            }}
            autoComplete="off"
            aria-label="Global search"
          />
        </div>

        {/* Scan Button */}
        <button
          type="button"
          onClick={onOpenScanner}
          className="btn-scan"
          title="Open QR Scanner"
        >
          <i className="bi bi-qr-code-scan"></i>
          <span>Scan</span>
        </button>

        {/* Print Labels Quick Button */}
        {onOpenLabelStudio && (
          <button
            type="button"
            className="notif-btn"
            onClick={onOpenLabelStudio}
            title="Label & Sticker Print Studio"
            aria-label="Label Studio"
          >
            <i className="bi bi-printer"></i>
          </button>
        )}

        {/* Spotlight Command Palette Trigger */}
        <button
          type="button"
          className="notif-btn"
          onClick={onOpenCmdPalette}
          title="Command Palette (Ctrl + K)"
          aria-label="Command Palette"
        >
          <i className="bi bi-command"></i>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="notif-btn position-relative"
          onClick={onOpenNotifications}
          title="Notifications"
          aria-label="Notifications"
        >
          <i className="bi bi-bell"></i>
          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '9px', padding: '2px 5px' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Clean Theme Toggle Button (Dark / Light) */}
        <button
          type="button"
          id="theme-customizer-toggle"
          className="dark-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Dark / Light Theme"
          title={`Switch to ${theme === 'dark' || theme === 'oled' ? 'Light' : 'Dark'} Mode`}
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'}`}></i>
        </button>

        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="topbar-avatar-photo"
          title="Account Settings"
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-bg)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            AD
          </div>
        </button>
      </div>
    </header>
  );
}
