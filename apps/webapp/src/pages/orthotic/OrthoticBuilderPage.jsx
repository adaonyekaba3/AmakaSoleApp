import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useToast } from '../../components/Toast';
import { useOrthoticStore } from '../../store/orthoticStore';

const INSOLE_PRICE_RANGE = {
  EVA_FOAM: 15000,
  MEMORY_FOAM: 18500,
  CARBON_FIBER: 27500,
  PREMIUM: 30000,
};

const MATERIAL_DESCRIPTIONS = {
  EVA_FOAM: 'Lightweight, flexible everyday comfort',
  MEMORY_FOAM: 'Conforms to your foot, ideal for long wear',
  CARBON_FIBER: 'Maximum support, preferred by athletes',
  PREMIUM: 'Luxury materials selected for your brand',
};

const shoeTypes = ['SNEAKER', 'BOOT', 'HEEL', 'LOAFER', 'SANDAL', 'SPORT'];
const useCases = ['EVERYDAY', 'SPORT', 'MEDICAL'];
const materials = Object.keys(INSOLE_PRICE_RANGE);
const archPrefs = ['LOW', 'MEDIUM', 'HIGH'];

const stepLabels = ['Shoe Type', 'Use Case', 'Material', 'Arch Height'];
const optionSets = [shoeTypes, useCases, materials, archPrefs];
const keys = ['shoeType', 'useCase', 'material', 'archHeightPref'];

export default function OrthoticBuilderPage() {
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get('scanId');
  const navigate = useNavigate();
  const { show } = useToast();
  const { generate, isGenerating } = useOrthoticStore();

  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    shoeType: 'SNEAKER',
    useCase: 'EVERYDAY',
    material: 'EVA_FOAM',
    archHeightPref: 'MEDIUM',
  });

  const handleGenerate = async () => {
    if (!scanId) { show('Please complete a scan first', 'error'); return; }
    try {
      const design = await generate({ scanId, ...config });
      navigate(`/designs/${design.id}`, { replace: true });
    } catch {
      show('Failed to generate design', 'error');
    }
  };

  return (
    <div className="app-shell bg-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Design Your Orthotic</h2>
        <ProgressBar progress={((step + 1) / stepLabels.length) * 100} className="mt-3" />
        <p className="text-xs text-gray-500 mt-2">{stepLabels[step]}</p>
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {optionSets[step].map((option) => {
          const isSelected = config[keys[step]] === option;
          const priceInfo = step === 2 ? ` — $${(INSOLE_PRICE_RANGE[option] / 100).toFixed(0)}` : '';
          const desc = step === 2 ? MATERIAL_DESCRIPTIONS[option] : '';

          return (
            <Card
              key={option}
              variant={isSelected ? 'elevated' : 'outlined'}
              className={`mb-3 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setConfig({ ...config, [keys[step]]: option })}
            >
              <p className={`text-sm font-semibold ${isSelected ? 'text-primary-600' : 'text-gray-700'}`}>
                {option.replace(/_/g, ' ')}{priceInfo}
              </p>
              {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3 p-6 border-t border-gray-200">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={step < stepLabels.length - 1 ? () => setStep(step + 1) : handleGenerate}
          loading={isGenerating}
          className="flex-1"
        >
          {step < stepLabels.length - 1 ? 'Next' : 'Generate Design'}
        </Button>
      </div>
    </div>
  );
}
