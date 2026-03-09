import { create } from 'zustand';
import { scansApi } from '../api/scans.queries';

export const useScanStore = create((set) => ({
  currentScanId: null,
  scanStatus: null,
  scans: [],
  isLoading: false,

  startScan: async (foot, fileType) => {
    const result = await scansApi.getUploadUrl(foot, fileType);
    set({ currentScanId: result.data.scanId, scanStatus: 'UPLOADING' });
    return result.data;
  },

  confirmScan: async (scanId, foot) => {
    await scansApi.confirmScan(scanId, foot);
    set({ scanStatus: 'PENDING' });
  },

  pollStatus: async (scanId) => {
    const result = await scansApi.getScanStatus(scanId);
    set({ scanStatus: result.data.status });
    return result.data.status;
  },

  loadScans: async (page = 1) => {
    set({ isLoading: true });
    const result = await scansApi.listScans(page);
    set({ scans: result.data, isLoading: false });
  },

  setCurrentScan: (scanId) => set({ currentScanId: scanId }),
}));
