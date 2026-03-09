import { useState } from 'react';
import Card from '../../components/Card';

function SettingRow({ label, value, onToggle }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-900">{label}</span>
      <button
        onClick={() => onToggle(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <p className="text-sm font-medium text-gray-500 mt-6 mb-3">Notifications</p>
      <Card>
        <SettingRow label="Push Notifications" value={pushEnabled} onToggle={setPushEnabled} />
        <SettingRow label="Email Notifications" value={emailEnabled} onToggle={setEmailEnabled} />
      </Card>

      <p className="text-sm font-medium text-gray-500 mt-6 mb-3">About</p>
      <Card>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm">Version</span>
          <span className="text-sm text-gray-500">1.0.0</span>
        </div>
        <div className="flex justify-between items-center py-3 cursor-pointer">
          <span className="text-sm">Terms of Service</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="flex justify-between items-center py-3 cursor-pointer">
          <span className="text-sm">Privacy Policy</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </div>
  );
}
