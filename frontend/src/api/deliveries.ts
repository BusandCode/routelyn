import { api } from './client';

export async function myDeliveries() {
  const res = await api.get('/deliveries/mine');
  return res.data.data;
}
export async function submitLocation(deliveryId: string, latitude: number, longitude: number, accuracy?: number) {
  const res = await api.post(`/deliveries/${deliveryId}/location`, { latitude, longitude, accuracy });
  return res.data.data;
}
