import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { ordersApi } from '../../api/orders.queries';

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    ordersApi.getOrder(orderId)
      .then((r) => { setOrder(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="p-6 text-gray-500">Order not found</div>;

  const handleCancel = async () => {
    try {
      await ordersApi.cancelOrder(orderId);
      setOrder({ ...order, status: 'CANCELLED' });
      show('Order cancelled', 'success');
    } catch {
      show('Cannot cancel order', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        <Badge
          label={order.status}
          variant={order.status === 'PAID' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'}
        />
      </div>

      <Card className="mt-5">
        <DataRow label="Order ID" value={order.id.slice(0, 8)} />
        <DataRow label="Amount" value={`$${(order.amount / 100).toFixed(2)}`} />
        <DataRow label="Date" value={new Date(order.createdAt).toLocaleDateString()} />
        {order.trackingNumber && (
          <>
            <DataRow label="Tracking" value={order.trackingNumber} />
            <DataRow label="Carrier" value={order.trackingCarrier || 'N/A'} />
          </>
        )}
      </Card>

      {order.shippingAddress && (
        <Card className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-sm text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </Card>
      )}

      {order.status === 'PENDING' && (
        <Button variant="outline" onClick={handleCancel} className="mt-6">
          Cancel Order
        </Button>
      )}
    </div>
  );
}
