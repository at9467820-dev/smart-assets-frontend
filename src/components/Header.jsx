import React, { useState, useEffect } from 'react';

export function Header({
  theme,
  toggleTheme,
  onOpenScanner,
  onOpenCmdPalette,
  onOpenAuth,
  onSearch,
}) {
  const [query, setQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const icon = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙';
    const text = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(`${icon} ${text}, Administrator`);

    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
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

      <div className="topbar-greeting">
        <p className="topbar-greeting-text">{greeting}</p>
        <p className="topbar-date">{currentDate}</p>
      </div>

      <div className="topbar-actions">
        {/* Global Search */}
        <div className="search-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            id="global-search"
            className="search-input"
            placeholder="Search assets, tags… (Ctrl+K)"
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
          style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}
        >
          <i className="bi bi-qr-code-scan me-1"></i>
          Scan
        </button>

        {/* Spotlight Trigger */}
        <button
          type="button"
          className="notif-btn"
          onClick={onOpenCmdPalette}
          title="Command Palette (Ctrl + K)"
          aria-label="Command Palette"
        >
          <i className="bi bi-command"></i>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          id="dark-toggle"
          className="dark-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
        </button>

        {/* Profile Avatar */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="topbar-avatar-photo"
          title="Account & Auth"
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <img src="/img/avatar-admin.jpg" alt="Profile" onError={(e) => { e.target.style.display = 'none'; }} />
        </button>
      </div>
    </header>
  );
}
