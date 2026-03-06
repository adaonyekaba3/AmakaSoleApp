import { useState, useCallback } from 'react';
import { useAmakaFit } from './AmakaFitProvider';
import { ScanResult } from './types';

export function useScan() {
  const { apiRequest } = useAmakaFit();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const startScan = useCallback(async (foot: 'LEFT' | 'RIGHT' = 'LEFT', fileType: 'STL' | 'OBJ' | 'PLY' = 'PLY'): Promise<ScanResult> => {
    setIsScanning(true);
    try {
      // Create scan session
      const session = await apiRequest('/api/partners/scan-session', {
        method: 'POST',
        body: JSON.stringify({ foot, fileType }),
      });

      const scanId = session.data.scanId;

      // In a real integration, the host app would upload the scan file
      // to session.data.uploadUrl, then the scan would be processed

      const result: ScanResult = {
        scanId,
        status: 'PENDING',
      };

      setScanResult(result);
      return result;
    } finally {
      setIsScanning(false);
    }
  }, [apiRequest]);

  const getScanStatus = useCallback(async (scanId: string): Promise<ScanResult> => {
    const result = await apiRequest(`/api/scans/${scanId}/status`);
    const scan: ScanResult = {
      scanId,
      status: result.data.status,
    };
    setScanResult(scan);
    return scan;
  }, [apiRequest]);

  return { startScan, getScanStatus, isScanning, scanResult };
}
