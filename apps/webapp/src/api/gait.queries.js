import apiClient from './apiClient';

export const gaitApi = {
  getUploadUrl: (scanId) =>
    apiClient.post(`/gait/${scanId}/upload-url`),
  analyzeGait: (scanId) =>
    apiClient.post(`/gait/${scanId}/analyze`),
  getResults: (scanId) =>
    apiClient.get(`/gait/${scanId}/results`),
};
