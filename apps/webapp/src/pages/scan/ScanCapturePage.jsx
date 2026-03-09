import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';
import { useScanStore } from '../../store/scanStore';

export default function ScanCapturePage() {
  const [capturing, setCapturing] = useState(false);
  const [foot, setFoot] = useState('LEFT');
  const { startScan, confirmScan } = useScanStore();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleCapture = async () => {
    setCapturing(true);
    try {
      const { scanId } = await startScan(foot, 'PLY');
      await confirmScan(scanId, foot);
      navigate(`/scan/processing/${scanId}`, { replace: true });
    } catch {
      show('Scan failed. Please try again.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="app-shell bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm aspect-[3/4] bg-dark-card rounded-3xl border-2 border-dashed border-primary-500 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white">Camera View</h3>
          <p className="text-sm text-gray-300 mt-2">
            Point camera at your {foot.toLowerCase()} foot
          </p>
        </div>
      </div>

      <div className="p-6 bg-dark-bg">
        <div className="flex gap-3 mb-4">
          <Button
            variant={foot === 'LEFT' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFoot('LEFT')}
            className="flex-1 !border-gray-600"
          >
            Left Foot
          </Button>
          <Button
            variant={foot === 'RIGHT' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFoot('RIGHT')}
            className="flex-1 !border-gray-600"
          >
            Right Foot
          </Button>
        </div>
        <Button onClick={handleCapture} loading={capturing}>
          {capturing ? 'Scanning...' : 'Capture Scan'}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-2 !text-gray-400">
          Cancel
        </Button>
      </div>
    </div>
  );
}
