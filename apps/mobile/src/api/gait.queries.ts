import { apiClient } from './apiClient';

export const gaitApi = {
  getUploadUrl: (scanId: string) =>
    apiClient.post('/gait/upload-url', { scanId }).then(r => r.data),

  analyzeGait: (scanId: string) =>
    apiClient.post(`/gait/${scanId}/analyze`).then(r => r.data),

  getResults: (scanId: string) =>
    apiClient.get(`/gait/${scanId}/results`).then(r => r.data),
};
