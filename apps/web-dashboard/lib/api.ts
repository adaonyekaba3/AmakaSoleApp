import { apiRequest } from './auth';

export const dashboardApi = {
  login: (email: string, password: string) =>
    apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMetrics: (token: string) =>
    apiRequest('/api/partners/dashboard/metrics', {}, token),

  getOrders: (token: string, page = 1) =>
    apiRequest(`/api/orders?page=${page}`, {}, token),
};
