import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('routelyn_token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiError(err: unknown): string {
  const anyErr = err as any;
  return anyErr?.response?.data?.error || anyErr?.message || 'Something went wrong';
}
