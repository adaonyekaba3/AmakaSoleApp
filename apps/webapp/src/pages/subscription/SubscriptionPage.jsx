import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';
import { ordersApi } from '../../api/orders.queries';

const SUBSCRIPTION_PRICE = 2999;
const SUBSCRIPTION_ANNUAL_PRICE = 28800;

const benefits = [
  'Unlimited foot scans',
  '20% discount on orthotics',
  'Priority support',
  'Early access to new features',
  'Free shipping on all orders',
];

export default function SubscriptionPage() {
  const [plan, setPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await ordersApi.createSubscription('pm_card_placeholder');
      show('Subscription activated!', 'success');
    } catch {
      show('Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">AmakaSole Premium</h2>
      <p className="text-gray-500 mt-2">Get the most out of your foot health journey</p>

      <div className="flex gap-3 mt-6">
        <Button
          variant={plan === 'monthly' ? 'primary' : 'outline'}
          onClick={() => setPlan('monthly')}
          className="flex-1"
          size="sm"
        >
          Monthly ${(SUBSCRIPTION_PRICE / 100).toFixed(2)}/mo
        </Button>
        <Button
          variant={plan === 'annual' ? 'primary' : 'outline'}
          onClick={() => setPlan('annual')}
          className="flex-1"
          size="sm"
        >
          Annual ${(SUBSCRIPTION_ANNUAL_PRICE / 100).toFixed(2)}/yr
        </Button>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <span className="text-success text-base">&#10003;</span>
            <span className="text-sm text-gray-700">{b}</span>
          </div>
        ))}
      </Card>

      <Button onClick={handleSubscribe} loading={loading} className="mt-6">
        Subscribe Now
      </Button>
    </div>
  );
}
