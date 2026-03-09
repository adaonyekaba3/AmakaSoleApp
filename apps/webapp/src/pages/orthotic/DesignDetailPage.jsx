import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { useOrthoticStore } from '../../store/orthoticStore';

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function DesignDetailPage() {
  const { orthoticId } = useParams();
  const navigate = useNavigate();
  const { currentDesign, loadDesign, confirmDesign } = useOrthoticStore();
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    loadDesign(orthoticId).then(() => setLoading(false)).catch(() => setLoading(false));
  }, [orthoticId]);

  if (loading) return <LoadingSpinner message="Loading design..." />;
  if (!currentDesign) return <div className="p-6 text-gray-500">Design not found</div>;

  const spec = currentDesign.cadSpec;

  const handleConfirm = async () => {
    try {
      await confirmDesign(orthoticId);
      show('Design confirmed!', 'success');
    } catch {
      show('Failed to confirm', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orthotic Design</h2>
        <Badge label={currentDesign.status} variant={currentDesign.status === 'CONFIRMED' ? 'success' : 'info'} />
      </div>

      <Card className="mt-5">
        <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
        <DataRow label="Shoe Type" value={currentDesign.shoeType} />
        <DataRow label="Use Case" value={currentDesign.useCase} />
        <DataRow label="Material" value={currentDesign.material?.replace(/_/g, ' ')} />
        <DataRow label="Arch Preference" value={currentDesign.archHeightPref} />
      </Card>

      {spec && (
        <Card className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
          <DataRow label="Arch Height" value={`${spec.arch_profile?.height_mm}mm`} />
          <DataRow label="Heel Cup Depth" value={`${spec.heel_cup?.depth_mm}mm`} />
          <DataRow label="Thickness" value={`${spec.thickness_mm}mm`} />
          <DataRow label="Total Length" value={`${spec.total_length_mm}mm`} />
          <DataRow label="Shore Hardness" value={`${spec.shore_hardness}`} />
        </Card>
      )}

      {currentDesign.status === 'DRAFT' && (
        <div className="mt-6 space-y-3">
          <Button onClick={handleConfirm}>Confirm Design</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Edit Design</Button>
        </div>
      )}
      {currentDesign.status === 'CONFIRMED' && (
        <Link to={`/orders/checkout?orthoticDesignId=${orthoticId}`}>
          <Button className="mt-6">Order Now</Button>
        </Link>
      )}
    </div>
  );
}
