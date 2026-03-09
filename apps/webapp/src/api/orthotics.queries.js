import apiClient from './apiClient';

export const orthoticsApi = {
  generate: (params) =>
    apiClient.post('/orthotics/generate', params),
  listOrthotics: (page = 1) =>
    apiClient.get('/orthotics', { params: { page } }),
  getOrthotic: (id) =>
    apiClient.get(`/orthotics/${id}`),
  confirmOrthotic: (id) =>
    apiClient.post(`/orthotics/${id}/confirm`),
};
