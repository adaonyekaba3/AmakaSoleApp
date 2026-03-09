import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useScanStore } from '../../store/scanStore';

const POLL_INTERVAL = 3000;

export default function ScanProcessingPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { pollStatus, scanStatus } = useScanStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const status = await pollStatus(scanId);
      if (status === 'COMPLETE') {
        clearInterval(intervalRef.current);
        navigate(`/scan/results/${scanId}`, { replace: true });
      } else if (status === 'FAILED') {
        clearInterval(intervalRef.current);
        navigate(-1);
      }
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scanId]);

  return (
    <div className="app-shell bg-dark-bg flex flex-col items-center justify-center">
      <LoadingSpinner message="Processing your scan..." />
      <p className="text-xs text-gray-400 mt-4">
        Status: {scanStatus || 'PROCESSING'}
      </p>
    </div>
  );
}
