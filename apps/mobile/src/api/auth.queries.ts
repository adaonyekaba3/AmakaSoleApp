import { apiClient } from './apiClient';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }).then(r => r.data),

  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post('/auth/register', data).then(r => r.data),

  socialApple: (identityToken: string, firstName?: string, lastName?: string) =>
    apiClient.post('/auth/social/apple', { identityToken, firstName, lastName }).then(r => r.data),

  socialGoogle: (idToken: string) =>
    apiClient.post('/auth/social/google', { idToken }).then(r => r.data),

  me: () =>
    apiClient.get('/auth/me').then(r => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then(r => r.data),

  refresh: () =>
    apiClient.post('/auth/refresh').then(r => r.data),
};
