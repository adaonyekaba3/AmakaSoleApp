import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ProgressBar from '../../components/ProgressBar';
import { useToast } from '../../components/Toast';
import { subscriptionsApi } from '../../api/subscriptions.queries';

const STEPS = ['About You', 'Activity', 'Conditions'];
const activities = ['Running', 'Walking', 'Hiking', 'Tennis', 'Basketball', 'Golf', 'Standing Work', 'Gym'];
const conditions = ['Plantar Fasciitis', 'Flat Feet', 'High Arches', 'Bunions', 'Heel Spurs', 'Knee Pain', 'Back Pain', 'None'];

export default function IntakeFormPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();
  const [form, setForm] = useState({
    dateOfBirth: '',
    weightKg: '',
    heightCm: '',
    primaryActivity: [],
    knownConditions: [],
  });

  const toggleItem = (list, item) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await subscriptionsApi.updateProfile({
        dateOfBirth: form.dateOfBirth || undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        primaryActivity: form.primaryActivity.length > 0 ? form.primaryActivity : undefined,
        knownConditions: form.knownConditions.length > 0 ? form.knownConditions : undefined,
      });
      navigate('/');
    } catch {
      show('Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell bg-white flex flex-col">
      <div className="p-6 pt-12">
        <p className="text-xs text-gray-500">Step {step + 1} of {STEPS.length}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">{STEPS[step]}</h2>
        <ProgressBar progress={((step + 1) / STEPS.length) * 100} className="mt-4" />
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-6">
        {step === 0 && (
          <>
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <Input label="Weight (kg)" type="number" placeholder="70" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
            <Input label="Height (cm)" type="number" placeholder="170" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
          </>
        )}
        {step === 1 && (
          <div className="flex flex-wrap gap-2">
            {activities.map((a) => (
              <Button
                key={a}
                title={a}
                variant={form.primaryActivity.includes(a) ? 'primary' : 'outline'}
                size="sm"
                className="!w-auto"
                onClick={() => setForm({ ...form, primaryActivity: toggleItem(form.primaryActivity, a) })}
              />
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <Button
                key={c}
                title={c}
                variant={form.knownConditions.includes(c) ? 'primary' : 'outline'}
                size="sm"
                className="!w-auto"
                onClick={() => setForm({ ...form, knownConditions: toggleItem(form.knownConditions, c) })}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 p-6 border-t border-gray-200">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={step < STEPS.length - 1 ? () => setStep(step + 1) : handleSubmit}
          loading={loading}
          className="flex-1"
        >
          {step < STEPS.length - 1 ? 'Next' : 'Complete'}
        </Button>
      </div>
    </div>
  );
}
