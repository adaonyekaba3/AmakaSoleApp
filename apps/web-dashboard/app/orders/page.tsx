'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { dashboardApi } from '@/lib/api';

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (token) dashboardApi.getOrders(token, page).then(r => setOrders(r.data)).catch(() => {});
  }, [token, page]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Currency</th>
              <th className="px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono">{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-sm">${(order.amount / 100).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-sm uppercase">{order.currency}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-6 justify-center">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
          className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50">Previous</button>
        <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
        <button onClick={() => setPage(page + 1)}
          className="px-4 py-2 text-sm border rounded-lg">Next</button>
      </div>
    </DashboardLayout>
  );
}
