import { apiClient } from './apiClient';

export const subscriptionsApi = {
  getProfile: () =>
    apiClient.get('/users/profile').then(r => r.data),

  updateProfile: (data: Record<string, unknown>) =>
    apiClient.put('/users/profile', data).then(r => r.data),

  updateShoeCollection: (action: string, data: Record<string, unknown>) =>
    apiClient.put('/users/shoe-collection', { action, ...data }).then(r => r.data),

  getFootHealthScore: () =>
    apiClient.get('/users/foot-health-score').then(r => r.data),
};
