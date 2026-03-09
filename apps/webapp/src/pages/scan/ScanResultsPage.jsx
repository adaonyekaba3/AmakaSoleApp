import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { scansApi } from '../../api/scans.queries';

function MeasurementItem({ label, value }) {
  return (
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

export default function ScanResultsPage() {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scansApi.getScan(scanId)
      .then((r) => { setScan(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [scanId]);

  if (loading) return <LoadingSpinner message="Loading results..." />;
  if (!scan) return <div className="p-6 text-gray-500">Scan not found</div>;

  const measurements = scan.measurements;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Scan Results</h2>
        <Badge label={scan.status} variant="success" />
      </div>

      {measurements &&
        ['left', 'right'].map((side) => {
          const m = measurements[side];
          if (!m) return null;
          return (
            <Card key={side} className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{side} Foot</h3>
              <div className="flex gap-4 mt-3">
                <MeasurementItem label="Length" value={`${m.length_mm}mm`} />
                <MeasurementItem label="Width" value={`${m.width_mm}mm`} />
              </div>
              <div className="flex gap-4 mt-3">
                <MeasurementItem label="Arch Height" value={`${m.arch_height_mm}mm`} />
                <MeasurementItem label="Heel Width" value={`${m.heel_width_mm}mm`} />
              </div>
            </Card>
          );
        })}

      <div className="mt-8 space-y-3">
        <Link to={`/scan/gait/${scanId}`}>
          <Button variant="secondary">Analyze Gait</Button>
        </Link>
        <Link to={`/designs/builder?scanId=${scanId}`}>
          <Button className="mt-3">Generate Orthotic</Button>
        </Link>
      </div>
    </div>
  );
}
