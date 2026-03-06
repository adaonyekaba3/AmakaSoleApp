import { create } from 'zustand';
import { scansApi } from '../api/scans.queries';

interface ScanState {
  currentScanId: string | null;
  scanStatus: string | null;
  scans: any[];
  isLoading: boolean;

  startScan: (foot: 'LEFT' | 'RIGHT', fileType: 'STL' | 'OBJ' | 'PLY') => Promise<{ uploadUrl: string; scanId: string }>;
  confirmScan: (scanId: string, foot: 'LEFT' | 'RIGHT') => Promise<void>;
  pollStatus: (scanId: string) => Promise<string>;
  loadScans: (page?: number) => Promise<void>;
  setCurrentScan: (scanId: string | null) => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
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
