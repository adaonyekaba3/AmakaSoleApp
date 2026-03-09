import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useScanStore } from '../../store/scanStore';

export default function ScanHomePage() {
  const { scans, isLoading, loadScans } = useScanStore();

  useEffect(() => { loadScans(); }, []);

  if (isLoading) return <LoadingSpinner message="Loading scans..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Foot Scans</h2>
        <Link to="/scan/tutorial">
          <Button size="sm" className="!w-auto">New Scan</Button>
        </Link>
      </div>

      {scans.length === 0 ? (
        <Card variant="outlined" className="text-center py-8">
          <p className="text-gray-500 mb-4">No scans yet</p>
          <Link to="/scan/tutorial">
            <Button>Start Your First Scan</Button>
          </Link>
        </Card>
      ) : (
        scans.map((scan) => (
          <Link
            key={scan.id}
            to={scan.status === 'COMPLETE' ? `/scan/results/${scan.id}` : '#'}
          >
            <Card className="mb-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Scan {scan.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  label={scan.status}
                  variant={scan.status === 'COMPLETE' ? 'success' : scan.status === 'FAILED' ? 'error' : 'info'}
                />
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
