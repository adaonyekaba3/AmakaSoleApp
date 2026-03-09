import apiClient from './apiClient';

export const subscriptionsApi = {
  getProfile: () =>
    apiClient.get('/profile'),
  updateProfile: (data) =>
    apiClient.put('/profile', data),
  getFootHealthScore: () =>
    apiClient.get('/profile/health-score'),
  updateShoeCollection: (action, data) =>
    apiClient.post('/profile/shoes', { action, ...data }),
};
