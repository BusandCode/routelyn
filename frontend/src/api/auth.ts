import { api } from './client';
import type { AuthUser } from '../types';

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data as { token: string; user: AuthUser };
}
