import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './pages/Dashboard';
import { AssetsPage } from './pages/AssetsPage';
import { IssuesPage } from './pages/IssuesPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { OrdersPage } from './pages/OrdersPage';
import { BudgetPage } from './pages/BudgetPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ScannerPage } from './pages/ScannerPage';
import { AllocationsPage } from './pages/AllocationsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ParchiModal } from './components/ParchiModal';
import { IssueModal } from './components/IssueModal';
import { ReturnModal } from './components/ReturnModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { NewAssetModal } from './components/NewAssetModal';
import { NewOrderModal } from './components/NewOrderModal';
import { api } from './api/client';

export function App() {
  const [currentTab, setTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('ap-theme') || 'dark');

  // Data States
  const [stats, setStats] = useState(null);
  const [assets, setAssets] = useState([]);
  const [issues, setIssues] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [orders, setOrders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewParchiIssue, setViewParchiIssue] = useState(null);
  const [issueModalAsset, setIssueModalAsset] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returnModalIssue, setReturnModalIssue] = useState(null);
  const [maintenanceModalAsset, setMaintenanceModalAsset] = useState(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ap-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut for CmdPalette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, assetsData, issuesData, maintData, ordersData, deptsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAssets(),
        api.getIssues(),
        api.getMaintenance(),
        api.getOrders(),
        api.getDepartments(),
      ]);

      setStats(statsData);
      setAssets(assetsData || []);
      setIssues(issuesData?.issues || []);
      setMaintenance(maintData || []);
      setOrders(ordersData || []);
      setDepartments(deptsData || []);
    } catch (err) {
      console.warn('API sync: Using cached / mock state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleCreateIssue = async (payload) => {
    const res = await api.createIssue(payload);
    await loadData();
    if (res?.issue_id) {
      const refreshed = await api.getIssues();
      const created = refreshed.issues?.find((i) => i.id === res.issue_id);
      if (created) {
        setViewParchiIssue(created);
      }
    }
  };

  const handleReturnIssue = async (issueId, returnData) => {
    await api.returnIssue(issueId, returnData);
    await loadData();
  };

  const handleCreateMaintenance = async (maintData) => {
    await api.createMaintenance(maintData);
    await loadData();
  };

  const handleCreateAsset = async (assetData) => {
    await api.createAsset(assetData);
    await loadData();
  };

  const handleCreateOrder = async (orderData) => {
    await api.createOrder(orderData);
    await loadData();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    await loadData();
  };

  const overdueIssuesCount = issues.filter(
    (i) => i.status === 'issued' && i.expected_return_date && new Date(i.expected_return_date) < new Date()
  ).length;

  const pendingMaintCount = maintenance.filter((m) => ['pending', 'in_progress'].includes(m.status)).length;

  return (
    <div>
      {/* ── Sidebar Navigation ──────────────────────────────── */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        overdueCount={overdueIssuesCount}
        maintCount={pendingMaintCount}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* ── Main Content Area ───────────────────────────────── */}
      <div id="main-content">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenScanner={() => setTab('scanner')}
          onOpenCmdPalette={() => setIsCmdOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <main className="content-area">
          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              assets={assets}
              issues={issues}
              departments={departments}
              onNavigate={(tab) => setTab(tab)}
              onOpenNewAsset={() => setIsNewAssetModalOpen(true)}
              onOpenNewIssue={() => {
                setIssueModalAsset(null);
                setIsIssueModalOpen(true);
              }}
              onOpenNewMaintenance={() => {
                setMaintenanceModalAsset(null);
                setIsMaintenanceModalOpen(true);
              }}
              onOpenScanner={() => setTab('scanner')}
              onViewParchi={(iss) => setViewParchiIssue(iss)}
            />
          )}

          {currentTab === 'assets' && (
            <AssetsPage
              assets={assets}
              departments={departments}
              onOpenIssueModal={(asset) => {
                setIssueModalAsset(asset);
                setIsIssueModalOpen(true);
              }}
              onOpenMaintenanceModal={(asset) => {
                setMaintenanceModalAsset(asset);
                setIsMaintenanceModalOpen(true);
              }}
              onOpenNewAsset={() => setIsNewAssetModalOpen(true)}
              onOpenScanner={() => setTab('scanner')}
            />
          )}

          {currentTab === 'issues' && (
            <IssuesPage
              issues={issues}
              onOpenNewIssue={() => {
                setIssueModalAsset(null);
                setIsIssueModalOpen(true);
              }}
              onOpenScanner={() => setTab('scanner')}
              onViewParchi={(iss) => setViewParchiIssue(iss)}
              onOpenReturnModal={(iss) => setReturnModalIssue(iss)}
            />
          )}

          {currentTab === 'maintenance' && (
            <MaintenancePage
              maintenance={maintenance}
              onOpenNewMaintenance={(asset) => {
                setMaintenanceModalAsset(asset);
                setIsMaintenanceModalOpen(true);
              }}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersPage
              orders={orders}
              onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetPage departments={departments} assets={assets} />
          )}

          {currentTab === 'analysis' && (
            <AnalysisPage assets={assets} departments={departments} />
          )}

          {currentTab === 'scanner' && (
            <ScannerPage
              assets={assets}
              onOpenIssueModal={(asset) => {
                setIssueModalAsset(asset);
                setIsIssueModalOpen(true);
              }}
              onOpenMaintenanceModal={(asset) => {
                setMaintenanceModalAsset(asset);
                setIsMaintenanceModalOpen(true);
              }}
              onOpenReturnModal={(iss) => setReturnModalIssue(iss)}
            />
          )}

          {currentTab === 'allocations' && (
            <AllocationsPage assets={assets} departments={departments} />
          )}

          {currentTab === 'audit_logs' && <AuditLogsPage />}
        </main>
      </div>

      {/* ── Spotlight Command Palette (Ctrl + K) ─────────────── */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onNavigate={(tab) => setTab(tab)}
        onOpenNewIssue={() => {
          setIssueModalAsset(null);
          setIsIssueModalOpen(true);
        }}
        onOpenNewAsset={() => setIsNewAssetModalOpen(true)}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        onOpenNewMaintenance={() => {
          setMaintenanceModalAsset(null);
          setIsMaintenanceModalOpen(true);
        }}
        onOpenScanner={() => setTab('scanner')}
      />

      {/* ── Authentication & Password Reset Modal ────────────── */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* ── Parchi Gate Pass Slip Modal ──────────────────────── */}
      {viewParchiIssue && (
        <ParchiModal
          issue={viewParchiIssue}
          onClose={() => setViewParchiIssue(null)}
          onReturnClick={(iss) => setReturnModalIssue(iss)}
        />
      )}

      {/* ── Material Issue Modal ─────────────────────────────── */}
      {isIssueModalOpen && (
        <IssueModal
          asset={issueModalAsset}
          availableAssets={assets}
          onClose={() => {
            setIsIssueModalOpen(false);
            setIssueModalAsset(null);
          }}
          onSuccess={handleCreateIssue}
        />
      )}

      {/* ── Return Asset Check-In Modal ──────────────────────── */}
      {returnModalIssue && (
        <ReturnModal
          issue={returnModalIssue}
          onClose={() => setReturnModalIssue(null)}
          onSuccess={handleReturnIssue}
        />
      )}

      {/* ── Maintenance Request Modal ────────────────────────── */}
      {isMaintenanceModalOpen && (
        <MaintenanceModal
          asset={maintenanceModalAsset}
          availableAssets={assets}
          onClose={() => {
            setIsMaintenanceModalOpen(false);
            setMaintenanceModalAsset(null);
          }}
          onSuccess={handleCreateMaintenance}
        />
      )}

      {/* ── Register New Asset Modal ─────────────────────────── */}
      {isNewAssetModalOpen && (
        <NewAssetModal
          departments={departments}
          onClose={() => setIsNewAssetModalOpen(false)}
          onSuccess={handleCreateAsset}
        />
      )}

      {/* ── Requisition Order Modal ──────────────────────────── */}
      {isNewOrderModalOpen && (
        <NewOrderModal
          departments={departments}
          onClose={() => setIsNewOrderModalOpen(false)}
          onSuccess={handleCreateOrder}
        />
      )}
    </div>
  );
}
