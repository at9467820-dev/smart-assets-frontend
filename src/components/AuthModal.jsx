import React, { useState } from 'react';

export function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [flashMsg, setFlashMsg] = useState(null);

  if (!isOpen) return null;

  const fillCreds = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFlashMsg({ type: 'success', text: `Signed in as ${username} successfully!` });
    setTimeout(() => {
      setFlashMsg(null);
      onClose();
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFlashMsg({ type: 'success', text: 'Account registered successfully! Redirecting...' });
    setTimeout(() => {
      setFlashMsg(null);
      setView('login');
    }, 1000);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setFlashMsg({ type: 'success', text: 'Password reset link sent to your email!' });
    setTimeout(() => {
      setFlashMsg(null);
      setView('reset');
    }, 1200);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFlashMsg({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }
    setFlashMsg({ type: 'success', text: 'Password updated! Please sign in.' });
    setTimeout(() => {
      setFlashMsg(null);
      setView('login');
    }, 1000);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 2000,
        background: 'rgba(5, 14, 12, 0.88)',
        backdropFilter: 'blur(12px)',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: view === 'login' || view === 'register' ? '920px' : '480px',
          margin: '20px auto',
        }}
      >
        {/* ── View 1: Split-Panel Sign In (login.html) ────────────────── */}
        {view === 'login' && (
          <div
            className="animate-in"
            style={{
              background: '#111827',
              borderRadius: '12px',
              border: '1px solid #1F2937',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Left Brand Panel */}
            <div
              style={{
                background: '#0B1120',
                borderRight: '1px solid #1F2937',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px' }}>
                    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                      <rect width="36" height="36" rx="8" fill="#2563EB" />
                      <path
                        d="M10 18H14L16.5 12L19.5 24L22 18H26"
                        stroke="#FFFFFF"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
                      AssetPulse
                    </h2>
                    <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                      Asset Management
                    </span>
                  </div>
                </div>

                <div style={{ margin: '32px 0 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 600, color: '#fff', lineHeight: 1.35, marginBottom: '20px' }}>
                    Institutional asset tracking &amp; inventory control.
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-qr-code-scan"></i>
                      </div>
                      <span>Instant QR Scanner &amp; Gate Pass Slips (Parchi)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <span>Real-Time Depreciation &amp; Lifecycle Analytics</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <span>Immutable Security Trail &amp; Audit Logs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#526071', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span>Asset Management Platform</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>● System Online</span>
              </div>
            </div>

            {/* Right Form Panel */}
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#111827' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  Sign In
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '22px' }}>
                Access your asset management dashboard
              </p>

              {flashMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    marginBottom: '16px',
                    background: flashMsg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: flashMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
                    border: '1px solid ' + (flashMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'),
                  }}
                >
                  <i className={`bi ${flashMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-1`}></i>
                  {flashMsg.text}
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                    Username or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        background: '#0B0F19',
                        border: '1px solid #1F2937',
                        borderRadius: '6px',
                        fontSize: '13.5px',
                        color: '#fff',
                        outline: 'none',
                      }}
                      placeholder="Username or email"
                      required
                    />
                    <i className="bi bi-person" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Password
                    </span>
                    <a
                      href="#forgot"
                      onClick={(e) => { e.preventDefault(); setView('forgot'); }}
                      style={{ fontSize: '11.5px', color: '#3B82F6', textDecoration: 'none' }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 38px',
                        background: '#0B0F19',
                        border: '1px solid #1F2937',
                        borderRadius: '6px',
                        fontSize: '13.5px',
                        color: '#fff',
                        outline: 'none',
                      }}
                      placeholder="Password"
                      required
                    />
                    <i className="bi bi-lock" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2563EB',
                    border: '1px solid #1D4ED8',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Sign In</span> <i className="bi bi-arrow-right-short" style={{ fontSize: '18px' }}></i>
                </button>
              </form>

              {/* Demo Credentials Bar */}
              <div style={{ marginTop: '16px', padding: '8px 12px', background: '#0B0F19', border: '1px solid #1F2937', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demo:
                </span>
                <button
                  type="button"
                  onClick={() => fillCreds('admin', 'admin123')}
                  style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('cse_staff', 'staff123')}
                  style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('maint1', 'maint123')}
                  style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Maint
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#8e9cae' }}>
                Need an account?{' '}
                <a
                  href="#register"
                  onClick={(e) => { e.preventDefault(); setView('register'); }}
                  style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
                >
                  Create account
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── View 2: Set New Password / Reset Password (reset_password.html) ── */}
        {view === 'reset' && (
          <div
            className="animate-in"
            style={{
              background: 'rgba(18, 32, 61, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #1e3a6a, #0d1b36)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: '#d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)',
                }}
              >
                AP
              </div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>
                Set New Password
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Create a strong new password for your account
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#d4af37',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  marginTop: '10px',
                }}
              >
                <i className="bi bi-person-circle"></i> admin@assetpulse.campus.edu
              </div>
            </div>

            {flashMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                  background: flashMsg.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: flashMsg.type === 'success' ? '#86efac' : '#fca5a5',
                  border: '1px solid ' + (flashMsg.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'),
                }}
              >
                {flashMsg.text}
              </div>
            )}

            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      background: 'rgba(10, 17, 36, 0.65)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      color: '#fff',
                      outline: 'none',
                    }}
                    placeholder="At least 6 characters"
                    required
                  />
                  <i className="bi bi-lock" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      background: 'rgba(10, 17, 36, 0.65)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      color: '#fff',
                      outline: 'none',
                    }}
                    placeholder="Re-enter new password"
                    required
                  />
                  <i className="bi bi-shield-lock" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b98a2e 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#0a1124',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35)',
                }}
              >
                <i className="bi bi-check2-circle me-1"></i> Update Password &amp; Sign In
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
              <a
                href="#login"
                onClick={(e) => { e.preventDefault(); setView('login'); }}
                style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Sign In
              </a>
            </div>
          </div>
        )}

        {/* ── View 3: Forgot Password ──────────────────────────── */}
        {view === 'forgot' && (
          <div
            className="animate-in"
            style={{
              background: 'rgba(18, 32, 61, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>
                Reset Password
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Enter your registered campus email to receive a recovery token
              </p>
            </div>

            {flashMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', background: 'rgba(34,197,94,0.15)', color: '#86efac' }}>
                {flashMsg.text}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Institutional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      background: 'rgba(10, 17, 36, 0.65)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      color: '#fff',
                      outline: 'none',
                    }}
                    placeholder="name@campus.edu"
                    required
                  />
                  <i className="bi bi-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Send Password Reset Link
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
              <a
                href="#login"
                onClick={(e) => { e.preventDefault(); setView('login'); }}
                style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Sign In
              </a>
            </div>
          </div>
        )}

        {/* ── View 4: Register Account ─────────────────────────── */}
        {view === 'register' && (
          <div
            className="animate-in"
            style={{
              background: '#0e1f1c',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  Create Account
                </h2>
                <p style={{ fontSize: '13px', color: '#8e9cae', margin: '4px 0 0' }}>
                  Register institutional access to AssetPulse SAMS
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: '#060e0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13.5px' }}
                    placeholder="e.g. Dr. Tariq Mahmood"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '10px 12px', background: '#060e0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13.5px' }}
                    placeholder="tariq_m"
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Campus Email
                  </label>
                  <input
                    type="email"
                    style={{ width: '100%', padding: '10px 12px', background: '#060e0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13.5px' }}
                    placeholder="tariq@campus.edu"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    style={{ width: '100%', padding: '10px 12px', background: '#060e0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13.5px' }}
                    placeholder="Create password"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Department
                  </label>
                  <select style={{ width: '100%', padding: '10px 12px', background: '#060e0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13.5px' }}>
                    <option>Computer Science</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Administration</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Complete Registration
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#8e9cae' }}>
              Already registered?{' '}
              <a
                href="#login"
                onClick={(e) => { e.preventDefault(); setView('login'); }}
                style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
              >
                Sign In instead
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
