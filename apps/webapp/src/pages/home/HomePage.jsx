import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useScanStore } from '../../store/scanStore';
import { subscriptionsApi } from '../../api/subscriptions.queries';

export default function HomePage() {
  const { user } = useUser();
  const { scans, loadScans } = useScanStore();
  const [healthScore, setHealthScore] = useState(null);

  useEffect(() => {
    loadScans().catch(() => {});
    subscriptionsApi.getFootHealthScore()
      .then((r) => setHealthScore(r.data.footHealthScore))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Hi, {user?.firstName || 'there'}
      </h2>
      <p className="text-sm text-gray-500 mt-1">Your foot health dashboard</p>

      <Card className="mt-6 text-center py-8">
        <p className="text-sm font-medium text-gray-600">Foot Health Score</p>
        <p className="text-4xl font-bold text-primary-600 mt-2">{healthScore ?? '--'}</p>
        <p className="text-xs text-gray-500 mt-1">
          {healthScore && healthScore >= 75 ? 'Great condition!' : 'Room for improvement'}
        </p>
      </Card>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { to: '/scan', emoji: '\uD83D\uDCF8', label: 'New Scan' },
          { to: '/designs', emoji: '\uD83E\uDDB6', label: 'My Designs' },
          { to: '/orders', emoji: '\uD83D\uDCE6', label: 'Orders' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{action.emoji}</span>
            <p className="text-sm font-medium text-gray-800 mt-2">{action.label}</p>
          </Link>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Recent Scans</h3>
      {scans.length === 0 ? (
        <Card variant="outlined" className="text-center">
          <p className="text-gray-500 mb-3">No scans yet. Start your first scan!</p>
          <Link to="/scan">
            <Button variant="secondary">Start Scan</Button>
          </Link>
        </Card>
      ) : (
        scans.slice(0, 3).map((scan) => (
          <Card key={scan.id} className="mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Scan {scan.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-500">{new Date(scan.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge
                label={scan.status}
                variant={scan.status === 'COMPLETE' ? 'success' : scan.status === 'FAILED' ? 'error' : 'info'}
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
