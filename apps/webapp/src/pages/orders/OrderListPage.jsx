import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ordersApi } from '../../api/orders.queries';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.listOrders()
      .then((r) => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  const statusVariant = (status) => {
    if (['PAID', 'DELIVERED'].includes(status)) return 'success';
    if (status === 'CANCELLED') return 'error';
    if (['MANUFACTURING', 'SHIPPED'].includes(status)) return 'info';
    return 'warning';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <Card variant="outlined" className="text-center py-8">
          <p className="text-gray-500">No orders yet</p>
        </Card>
      ) : (
        orders.map((item) => (
          <Link key={item.id} to={`/orders/${item.id}`}>
            <Card className="mb-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Order {item.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-900">${(item.amount / 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge label={item.status} variant={statusVariant(item.status)} />
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
