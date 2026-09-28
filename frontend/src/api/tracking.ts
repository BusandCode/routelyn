import { api } from './client';
import type { TrackingData } from '../types';

export async function getTracking(trackingNumber: string): Promise<TrackingData> {
  const res = await api.get(`/tracking/${encodeURIComponent(trackingNumber)}`);
  return res.data.data;
}
