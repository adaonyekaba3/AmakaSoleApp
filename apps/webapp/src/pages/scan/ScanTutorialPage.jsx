import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const steps = [
  { title: 'Find Good Lighting', desc: 'Natural or bright indoor light works best.' },
  { title: 'Place on Flat Surface', desc: 'Stand on a flat, solid surface with your feet shoulder-width apart.' },
  { title: 'Follow the Guide', desc: 'Move your phone slowly around each foot following the on-screen guide.' },
];

export default function ScanTutorialPage() {
  return (
    <div className="app-shell bg-white flex flex-col">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-900">How to Scan</h2>
        <p className="text-gray-500 mt-2 mb-6">Follow these steps for the best results</p>

        {steps.map((step, i) => (
          <Card key={i} className="mb-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-white">{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200">
        <Link to="/scan/capture">
          <Button>Start Scanning</Button>
        </Link>
      </div>
    </div>
  );
}
