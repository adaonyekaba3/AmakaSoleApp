import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useCartStore } from '../../store/cartStore';

export default function OrderConfirmationPage() {
  const { orderId, reset } = useCartStore();
  const navigate = useNavigate();

  const handleDone = () => {
    reset();
    navigate('/orders');
  };

  return (
    <div className="app-shell flex flex-col items-center justify-center p-6 bg-white">
      <div className="text-6xl text-center">&#10004;&#65039;</div>
      <h2 className="text-2xl font-bold text-gray-900 text-center mt-6">Order Placed!</h2>
      <p className="text-gray-500 text-center mt-3 max-w-sm">
        Your custom orthotics are being manufactured. We'll notify you when they ship.
      </p>

      {orderId && (
        <Card variant="outlined" className="mt-6 text-center">
          <p className="text-xs text-gray-500">Order ID</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{orderId.slice(0, 8)}</p>
        </Card>
      )}

      <div className="mt-8 w-full max-w-sm space-y-3">
        <Button onClick={handleDone}>View Orders</Button>
        <Link to="/" onClick={() => reset()}>
          <Button variant="ghost" className="mt-3">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
