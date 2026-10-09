/**
 * AssetPulse API Client
 * Connected to Render Live Backend: https://smart-assets.onrender.com
 */

// Use environment variable if provided, else default to deployed backend URL
const API_BASE = (import.meta.env.VITE_API_URL || 'https://smart-assets.onrender.com/api').replace(/\/+$/, '');

async function fetchJson(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.warn(`API ${res.status} on ${endpoint}:`, errorBody);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API fetch to ${endpoint} failed:`, err.message);
    return null;
  }
}

export const api = {
  // Base URL reference
  baseUrl: API_BASE,

  // Stats
  async getDashboardStats() {
    const data = await fetchJson('/dashboard/stats');
    if (data) return data;
    return {
      assets: { total: 0, active: 0, under_repair: 0, damaged: 0, retired: 0, total_valuation: 0 },
      issues: { total: 0, active: 0, overdue: 0, returned: 0 },
      maintenance: { pending: 0, overdue: 0, actual_spent: 0 },
      activities: [],
    };
  },

  // Assets
  async getAssets(params = {}) {
    const query = new URLSearchParams(params).toString();
    const data = await fetchJson(`/assets?${query}`);
    return data?.assets || [];
  },

  async getAssetDetail(id) {
    return await fetchJson(`/assets/${id}`);
  },

  async createAsset(assetData) {
    return await fetchJson('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  },

  async updateAsset(id, assetData) {
    return await fetchJson(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  },

  async deleteAsset(id) {
    return await fetchJson(`/assets/${id}`, {
      method: 'DELETE',
    });
  },

  // Material Issues & Gate Passes (Parchi)
  async getIssues(params = {}) {
    const query = new URLSearchParams(params).toString();
    const data = await fetchJson(`/issues?${query}`);
    return data || { issues: [], count: 0, active_count: 0, overdue_count: 0 };
  },

  async createIssue(issueData) {
    return await fetchJson('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  async returnIssue(id, returnData) {
    return await fetchJson(`/issues/${id}/return`, {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
  },

  // Maintenance
  async getMaintenance() {
    const data = await fetchJson('/maintenance');
    return data?.maintenance || [];
  },

  async createMaintenance(maintData) {
    return await fetchJson('/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintData),
    });
  },

  // Orders / Requisitions
  async getOrders() {
    const data = await fetchJson('/orders');
    return data?.orders || [];
  },

  async createOrder(orderData) {
    return await fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrderStatus(id, status) {
    return await fetchJson(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Departments
  async getDepartments() {
    const data = await fetchJson('/departments');
    return data?.departments || [];
  },

  // QR Lookup
  async lookupIdentifier(identifier) {
    return await fetchJson(`/lookup/${encodeURIComponent(identifier)}`);
  },
};
