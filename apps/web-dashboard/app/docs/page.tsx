'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function DocsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">API Documentation</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          Integrate AmakaSole foot scanning and orthotic generation into your application using our REST API or React Native SDK.
        </p>
        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Authentication</h3>
        <p className="text-gray-600 mb-2">All API requests require an API key passed in the <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-API-Key</code> header.</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{`curl -X POST https://api.amakasole.com/api/partners/scan-session \\
  -H "X-API-Key: ak_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"foot": "LEFT", "fileType": "PLY"}'`}
        </pre>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h2>
        <div className="space-y-4">
          <EndpointDoc method="POST" path="/api/partners/scan-session" description="Create a new scan session and get a presigned upload URL" />
          <EndpointDoc method="POST" path="/api/partners/generate-orthotic" description="Generate an orthotic design from a completed scan" />
          <EndpointDoc method="GET" path="/api/partners/dashboard/metrics" description="Get dashboard metrics (requires JWT auth)" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">React Native SDK</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{`import { AmakaFitProvider, AmakaFitScanButton } from '@amakasole/amaka-fit-sdk';

function App() {
  return (
    <AmakaFitProvider apiKey="ak_live_your_key">
      <AmakaFitScanButton
        onScanComplete={(scan) => console.log(scan)}
        onDesignReady={(design) => console.log(design)}
      />
    </AmakaFitProvider>
  );
}`}
        </pre>
      </div>
    </DashboardLayout>
  );
}

function EndpointDoc({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-700',
    POST: 'bg-blue-100 text-blue-700',
    PUT: 'bg-amber-100 text-amber-700',
    DELETE: 'bg-red-100 text-red-700',
  };
  return (
    <div className="flex items-start gap-3 p-4 border rounded-xl">
      <span className={`text-xs font-bold px-2 py-1 rounded ${methodColors[method]}`}>{method}</span>
      <div>
        <code className="text-sm font-mono text-gray-900">{path}</code>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
