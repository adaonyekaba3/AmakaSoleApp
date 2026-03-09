import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Clerk will manage tokens; inject via interceptor
let getTokenFn = null;

export function setAuthTokenProvider(fn) {
  getTokenFn = fn;
}

apiClient.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // no token available
    }
  }
  return config;
});

export default apiClient;
