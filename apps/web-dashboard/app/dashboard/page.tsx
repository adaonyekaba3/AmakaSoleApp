'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { dashboardApi } from '@/lib/api';

interface Metrics {
  totalOrders: number;
  totalScans: number;
  totalDesigns: number;
  totalRevenue: number;
  recentOrders: Array<{ id: string; amount: number; status: string; createdAt: string }>;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (token) {
      dashboardApi.getMetrics(token).then(r => setMetrics(r.data)).catch(() => {});
    }
  }, [token]);

  const cards = [
    { label: 'Total Orders', value: metrics?.totalOrders ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Scans', value: metrics?.totalScans ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Total Designs', value: metrics?.totalDesigns ?? 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Revenue', value: `$${((metrics?.totalRevenue ?? 0) / 100).toFixed(2)}`, color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color.split(' ')[1]}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(metrics?.recentOrders || []).map(order => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-3 text-sm font-mono">{order.id.slice(0, 8)}</td>
                <td className="py-3 text-sm">${(order.amount / 100).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{order.status}</span>
                </td>
                <td className="py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
