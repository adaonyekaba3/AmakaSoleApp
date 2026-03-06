'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input defaultValue={user?.firstName} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input defaultValue={user?.lastName} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input defaultValue={user?.email} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50" disabled />
          </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
          <input placeholder="https://your-api.com/webhooks/amakasole" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <button className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
          Update Webhook
        </button>
      </div>
    </DashboardLayout>
  );
}
