import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { useOrthoticStore } from '../../store/orthoticStore';

export default function DesignListPage() {
  const { designs, loadDesigns } = useOrthoticStore();

  useEffect(() => { loadDesigns(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Designs</h2>

      {designs.length === 0 ? (
        <Card variant="outlined" className="text-center py-8">
          <p className="text-gray-500">
            No designs yet. Complete a scan to generate your first custom orthotic.
          </p>
        </Card>
      ) : (
        designs.map((item) => (
          <Link key={item.id} to={`/designs/${item.id}`}>
            <Card className="mb-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">
                    {item.shoeType} - {item.material?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.useCase} | {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  label={item.status}
                  variant={item.status === 'CONFIRMED' ? 'success' : item.status === 'ORDERED' ? 'info' : 'neutral'}
                />
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
