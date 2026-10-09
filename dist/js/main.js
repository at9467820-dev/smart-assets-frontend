/* ═══════════════════════════════════════════════════════════
   AssetPulse — Main JavaScript v2.0
   Dark/Light mode, sidebar, search, animations
   ═══════════════════════════════════════════════════════════ */

/* ── Dark / Light Mode Toggle ─────────────────────────── */
(function () {
  const saved = localStorage.getItem('ap-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  // ── Theme Toggle ────────────────────────────────────────
  const toggleBtn = document.getElementById('dark-toggle');
  if (toggleBtn) {
    const current = () => document.documentElement.getAttribute('data-theme');
    toggleBtn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ap-theme', next);
      toggleBtn.innerHTML = next === 'dark'
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>';
    });
    toggleBtn.innerHTML = current() === 'dark'
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  }

  // ── Sidebar Toggle (Mobile) ─────────────────────────────
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function closeSidebar() {
    sidebar?.classList.remove('show');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }
  function openSidebar() {
    sidebar?.classList.add('show');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.contains('show') ? closeSidebar() : openSidebar();
  });
  overlay?.addEventListener('click', closeSidebar);

  // ── Global Search ──────────────────────────────────────
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');

  let searchTimer;
  searchInput?.addEventListener('input', function () {
    clearTimeout(searchTimer);
    const q = this.value.trim();
    if (q.length < 2) {
      searchResults?.classList.remove('show');
      return;
    }
    searchTimer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(data => {
          if (!searchResults) return;
          if (!data.results || data.results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item" style="color:var(--ink-muted)">No results found</div>';
          } else {
            searchResults.innerHTML = data.results.map(r => {
              const iconMap = { asset: 'bi-box', maintenance: 'bi-tools' };
              const bgMap  = { asset: 'var(--navy)', maintenance: 'var(--warning)' };
              return `
                <a class="search-result-item" href="${r.url}">
                  <span class="search-result-icon" style="background:${bgMap[r.type]||'var(--navy)'};color:white">
                    <i class="bi ${iconMap[r.type]||'bi-search'}"></i>
                  </span>
                  <span>
                    <div style="font-size:13px;font-weight:500;color:var(--ink)">${r.title}</div>
                    <div style="font-size:11px;color:var(--ink-muted)">${r.subtitle||''}</div>
                  </span>
                </a>
              `;
            }).join('');
          }
          searchResults.classList.add('show');
        })
        .catch(() => {});
    }, 280);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      searchResults?.classList.remove('show');
    }
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults?.classList.remove('show');
      searchInput.blur();
    }
  });

  // ── Notification Bell ──────────────────────────────────
  const notifBell = document.getElementById('notif-bell');
  const notifBadge = document.getElementById('notif-badge');

  if (notifBell) {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        if (notifBadge) {
          notifBadge.textContent = data.count || '';
          notifBadge.style.display = data.count > 0 ? 'flex' : 'none';
        }
      })
      .catch(() => {});
  }

  // ── Flash Message Slide-in + Auto-dismiss ─────────────
  const flashes = document.querySelectorAll('.flash-message[data-dismiss]');
  flashes.forEach((el, i) => {
    // Stagger entrance delay
    el.style.animationDelay = `${i * 0.08}s`;
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s, transform 0.4s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      setTimeout(() => el.remove(), 400);
    }, 5000 + (i * 200));
  });

  // ── Animated Number Counters ──────────────────────────
  const countEls = document.querySelectorAll('[data-count]');
  countEls.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || target === 0) return;

    const duration = 800; // ms
    const startTime = performance.now();

    function animateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    // Only animate if element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateCount);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });

  // ── Photo preview ──────────────────────────────────────
  const photoInput = document.getElementById('photo-input');
  const photoPreview = document.getElementById('photo-preview');

  photoInput?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (photoPreview) {
          photoPreview.src = e.target.result;
          photoPreview.classList.add('show');
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // ── Condition rating visual ────────────────────────────
  const conditionInput = document.getElementById('condition-rating');
  const conditionBar = document.getElementById('condition-bar');

  function updateConditionBar(val) {
    if (!conditionBar) return;
    conditionBar.innerHTML = Array.from({ length: 10 }, (_, i) => {
      let color;
      if (val >= 8) color = 'var(--success)';
      else if (val >= 5) color = 'var(--warning)';
      else color = 'var(--danger)';
      return `<span class="condition-pip" style="background:${i < val ? color : 'var(--hairline)'}"></span>`;
    }).join('');
  }

  if (conditionInput) {
    updateConditionBar(parseInt(conditionInput.value) || 5);
    conditionInput.addEventListener('input', () => updateConditionBar(parseInt(conditionInput.value)));
  }

  // ── Confirm delete dialogs ────────────────────────────
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', function (e) {
      const msg = this.getAttribute('data-confirm') || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  // ── Tooltip init (Bootstrap) ──────────────────────────
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(el => new bootstrap.Tooltip(el));

  // ── Active nav highlight ──────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && href !== '/' && path.startsWith(href)) {
      link.classList.add('active');
    } else if (href === '/' && path === '/') {
      link.classList.add('active');
    }
  });

  // ── Spotlight Command Palette (Ctrl + K) ─────────────
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('show');
    cmdInput?.focus();
    if (cmdInput) cmdInput.value = '';
    filterCmdItems('');
  }

  function closeCmdPalette() {
    cmdPalette?.classList.remove('show');
  }

  function filterCmdItems(query) {
    if (!cmdList) return;
    const items = cmdList.querySelectorAll('.cmd-palette-item');
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPalette?.classList.contains('show')) closeCmdPalette();
      else openCmdPalette();
    }
    if (e.key === 'Escape' && cmdPalette?.classList.contains('show')) {
      closeCmdPalette();
    }
  });

  cmdPalette?.addEventListener('click', (e) => {
    if (e.target === cmdPalette) closeCmdPalette();
  });

  cmdInput?.addEventListener('input', (e) => {
    filterCmdItems(e.target.value);
  });
});
