import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const slides = [
  { title: 'Scan Your Feet', description: 'Use your phone camera to create a precise 3D model of your feet in seconds.' },
  { title: 'AI-Powered Analysis', description: 'Our ML engine analyzes your foot structure and gait for the perfect fit.' },
  { title: 'Custom Orthotics', description: 'Receive personalized orthotic insoles manufactured just for you.' },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div className="app-shell bg-dark-bg flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-white">{slides[current].title}</h2>
        <p className="text-gray-300 mt-4 max-w-sm">{slides[current].description}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-6 bg-primary-500' : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="mb-8">
        <Button onClick={handleNext}>
          {current < slides.length - 1 ? 'Next' : 'Get Started'}
        </Button>
        {current < slides.length - 1 && (
          <Button variant="ghost" onClick={() => navigate('/sign-in')} className="mt-3 !text-gray-400">
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
