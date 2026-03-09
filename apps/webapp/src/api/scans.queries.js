import apiClient from './apiClient';

export const scansApi = {
  getUploadUrl: (foot, fileType) =>
    apiClient.post('/scans/upload-url', { foot, fileType }),
  confirmScan: (scanId, foot) =>
    apiClient.post(`/scans/${scanId}/confirm`, { foot }),
  getScanStatus: (scanId) =>
    apiClient.get(`/scans/${scanId}/status`),
  listScans: (page = 1) =>
    apiClient.get('/scans', { params: { page } }),
  getScan: (scanId) =>
    apiClient.get(`/scans/${scanId}`),
};
