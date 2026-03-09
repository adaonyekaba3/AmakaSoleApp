import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import { subscriptionsApi } from '../../api/subscriptions.queries';

export default function ShoeCollectionPage() {
  const [shoes, setShoes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', size: '', shoeType: 'SNEAKER' });
  const { show } = useToast();

  useEffect(() => {
    subscriptionsApi.getProfile().then((r) => {
      const profile = r.data?.profile;
      if (profile?.shoeCollection) setShoes(profile.shoeCollection);
    }).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.brand || !form.model || !form.size) { show('Fill in all fields', 'error'); return; }
    try {
      const result = await subscriptionsApi.updateShoeCollection('ADD', form);
      setShoes(result.data.shoeCollection);
      setAdding(false);
      setForm({ brand: '', model: '', size: '', shoeType: 'SNEAKER' });
      show('Shoe added!', 'success');
    } catch {
      show('Failed to add shoe', 'error');
    }
  };

  const handleRemove = async (shoeId) => {
    try {
      const result = await subscriptionsApi.updateShoeCollection('REMOVE', { shoeId });
      setShoes(result.data.shoeCollection);
    } catch {
      show('Failed to remove', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shoe Collection</h2>
        <Button size="sm" className="!w-auto" onClick={() => setAdding(!adding)}>
          Add
        </Button>
      </div>

      {adding && (
        <Card className="mb-6">
          <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <Input label="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          <Button onClick={handleAdd}>Add Shoe</Button>
        </Card>
      )}

      {shoes.length === 0 ? (
        <p className="text-gray-500 text-center">No shoes in collection</p>
      ) : (
        shoes.map((item) => (
          <Card key={item.id} className="mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">{item.brand} {item.model}</p>
                <p className="text-xs text-gray-500">Size {item.size} | {item.shoeType}</p>
              </div>
              <Button variant="ghost" size="sm" className="!w-auto" onClick={() => handleRemove(item.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
