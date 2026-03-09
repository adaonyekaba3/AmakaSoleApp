import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const orthoticDesignId = searchParams.get('orthoticDesignId');
  const navigate = useNavigate();
  const { show } = useToast();
  const { setSelectedDesign, setShippingAddress, createPaymentIntent } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const update = (field, value) => setAddress({ ...address, [field]: value });

  const handleCheckout = async () => {
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
      show('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      if (orthoticDesignId) setSelectedDesign(orthoticDesignId);
      setShippingAddress(address);
      await createPaymentIntent();
      navigate('/orders/confirmation', { replace: true });
    } catch (error) {
      show(error.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <Input label="Full Name" value={address.fullName} onChange={(e) => update('fullName', e.target.value)} />
        <Input label="Address Line 1" value={address.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} />
        <Input label="Address Line 2 (optional)" value={address.addressLine2} onChange={(e) => update('addressLine2', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="City" value={address.city} onChange={(e) => update('city', e.target.value)} />
          <Input label="State" value={address.state} onChange={(e) => update('state', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Postal Code" value={address.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
          <Input label="Country" value={address.country} onChange={(e) => update('country', e.target.value)} />
        </div>
      </Card>

      <Button onClick={handleCheckout} loading={loading} className="mt-6">
        Place Order
      </Button>
    </div>
  );
}
