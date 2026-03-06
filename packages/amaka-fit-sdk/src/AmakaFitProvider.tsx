import React, { createContext, useContext, useMemo } from 'react';
import { AmakaFitConfig } from './types';

interface AmakaFitContextType {
  config: AmakaFitConfig;
  apiRequest: (path: string, options?: RequestInit) => Promise<any>;
}

const AmakaFitContext = createContext<AmakaFitContextType | null>(null);

export function useAmakaFit(): AmakaFitContextType {
  const ctx = useContext(AmakaFitContext);
  if (!ctx) throw new Error('useAmakaFit must be used within AmakaFitProvider');
  return ctx;
}

interface ProviderProps {
  apiKey: string;
  apiUrl?: string;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export function AmakaFitProvider({ apiKey, apiUrl = 'https://api.amakasole.com', onError, children }: ProviderProps) {
  const config: AmakaFitConfig = useMemo(() => ({ apiKey, apiUrl, onError }), [apiKey, apiUrl, onError]);

  const apiRequest = useMemo(() => {
    return async (path: string, options: RequestInit = {}) => {
      try {
        const res = await fetch(`${apiUrl}${path}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            ...((options.headers as Record<string, string>) || {}),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
      } catch (error) {
        onError?.(error as Error);
        throw error;
      }
    };
  }, [apiKey, apiUrl, onError]);

  return (
    <AmakaFitContext.Provider value={{ config, apiRequest }}>
      {children}
    </AmakaFitContext.Provider>
  );
}
