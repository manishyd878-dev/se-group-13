const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

function getAuthHeaders() {
  const token = localStorage.getItem('bloodbridge_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during request');
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server. Please ensure the backend is running on port 5000.');
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  googleAuth: (payload) => request('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  updateMe: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  // Hospitals
  getHospitals: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
    );
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/hospitals${query ? `?${query}` : ''}`);
  },
  getHospital: (id) => request(`/hospitals/${id}`),
  updateStock: (id, payload) => request(`/hospitals/${id}/stock`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateHospital: (id, payload) => request(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Blood Requests
  createRequest: (payload) => request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  getMyRequests: () => request('/requests/mine'),
  getHospitalRequests: () => request('/requests/hospital'),
  updateRequestStatus: (id, status) => request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),

  // Contact & Stats
  submitContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getStats: () => request('/stats'),
};
