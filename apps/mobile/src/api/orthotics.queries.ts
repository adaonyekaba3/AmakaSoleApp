import { apiClient } from './apiClient';

export const orthoticsApi = {
  generate: (data: { scanId: string; shoeType: string; useCase: string; material: string; archHeightPref: string }) =>
    apiClient.post('/orthotics/generate', data).then(r => r.data),

  getOrthotic: (orthoticId: string) =>
    apiClient.get(`/orthotics/${orthoticId}`).then(r => r.data),

  listOrthotics: (page = 1, limit = 20) =>
    apiClient.get('/orthotics', { params: { page, limit } }).then(r => r.data),

  updateOrthotic: (orthoticId: string, data: Record<string, string>) =>
    apiClient.put(`/orthotics/${orthoticId}`, data).then(r => r.data),

  confirmOrthotic: (orthoticId: string) =>
    apiClient.post(`/orthotics/${orthoticId}/confirm`).then(r => r.data),
};
