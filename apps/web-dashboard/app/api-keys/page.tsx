'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function ApiKeysPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">API Keys</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-gray-600 mb-6">Manage API keys for integrating AmakaSole into your platform.</p>

        <div className="border rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Production Key</p>
              <p className="text-sm text-gray-500 font-mono mt-1">ak_live_••••••••••••••••</p>
            </div>
            <button className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors">
              Reveal
            </button>
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Test Key</p>
              <p className="text-sm text-gray-500 font-mono mt-1">ak_test_••••••••••••••••</p>
            </div>
            <button className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors">
              Reveal
            </button>
          </div>
        </div>

        <button className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
          Generate New Key
        </button>
      </div>
    </DashboardLayout>
  );
}
