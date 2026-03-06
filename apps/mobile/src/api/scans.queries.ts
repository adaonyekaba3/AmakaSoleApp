import { apiClient } from './apiClient';

export const scansApi = {
  getUploadUrl: (foot: 'LEFT' | 'RIGHT', fileType: 'STL' | 'OBJ' | 'PLY') =>
    apiClient.post('/scans/upload-url', { foot, fileType }).then(r => r.data),

  confirmScan: (scanId: string, foot: 'LEFT' | 'RIGHT') =>
    apiClient.post(`/scans/${scanId}/confirm`, { foot }).then(r => r.data),

  getScanStatus: (scanId: string) =>
    apiClient.get(`/scans/${scanId}/status`).then(r => r.data),

  getScan: (scanId: string) =>
    apiClient.get(`/scans/${scanId}`).then(r => r.data),

  listScans: (page = 1, limit = 20) =>
    apiClient.get('/scans', { params: { page, limit } }).then(r => r.data),

  deleteScan: (scanId: string) =>
    apiClient.delete(`/scans/${scanId}`).then(r => r.data),
};
